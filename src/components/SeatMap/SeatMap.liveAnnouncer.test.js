import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { JetsSeatMap } from './SeatMap';
import { flightDetails } from './__fixtures__/seatMapApiGetPlaneFeatures';
import { CONFIG_MOCK } from '../Demo/constants';
import {
  cabin,
  entertainment,
  power,
  seatDetails,
  wifi,
  deck,
  row,
  seat,
} from './__fixtures__/seatMapApiPostDataResponse';

const setup = ({ flight, configOverrides, passengers = null }) => {
  const config = {
    ...CONFIG_MOCK,
    ...configOverrides,
  };
  return render(
    <JetsSeatMap
      flight={flight}
      availability={null}
      passengers={passengers}
      currentDeckIndex={0}
      config={config}
      onSeatMapInited={() => {}}
      onAvailabilityApplied={() => {}}
      onSeatSelected={() => {}}
      onSeatUnselected={() => {}}
    />
  );
};

const mockPostData = jest.fn();

jest.mock('./api', () => {
  const module = jest.requireActual('./api');
  return {
    ...module,
    JetsSeatMapApiService: class extends module.JetsSeatMapApiService {
      postData = mockPostData;
    },
  };
});

describe('SeatMap live announcer', () => {
  const flight = flightDetails();

  beforeEach(() => {
    const oneRowDeck = deck({
      rows: [row({ uniqId: '_row33', number: 33, seats: [seat({ letter: 'A' })] })],
    });

    const singleCabinResponseFixture = [
      {
        id: '1111',
        cabin: cabin(),
        entertainment: entertainment(),
        power: power(),
        wifi: wifi(),
        seatDetails: seatDetails({ decks: [oneRowDeck] }),
      },
    ];
    mockPostData.mockImplementation(() => singleCabinResponseFixture);
  });

  it('renders no aria-live region when wcag.liveAnnouncer is off (zero-change)', async () => {
    setup({ flight, configOverrides: {} });

    await waitFor(() => {
      expect(screen.getByText(/33A/)).toBeInTheDocument();
    });

    const container = screen.getByTestId('jets-seat-map');
    expect(container.querySelector('[aria-live]')).toBeNull();
  });

  it('renders no aria-live region when wcag is enabled but liveAnnouncer is explicitly off', async () => {
    setup({ flight, configOverrides: { wcag: { enabled: true, liveAnnouncer: false } } });

    await waitFor(() => {
      expect(screen.getByText(/33A/)).toBeInTheDocument();
    });

    const container = screen.getByTestId('jets-seat-map');
    expect(container.querySelector('[aria-live]')).toBeNull();
  });

  it('renders a polite, atomic aria-live region when wcag.liveAnnouncer is on', async () => {
    setup({ flight, configOverrides: { wcag: { enabled: true } } });

    await waitFor(() => {
      expect(screen.getByText(/33A/)).toBeInTheDocument();
    });

    const container = screen.getByTestId('jets-seat-map');
    const region = container.querySelector('[aria-live]');
    expect(region).not.toBeNull();
    expect(region.getAttribute('aria-live')).toBe('polite');
    expect(region.getAttribute('aria-atomic')).toBe('true');
  });

  it('announces seat selection into the live region', async () => {
    setup({
      flight,
      configOverrides: { wcag: { enabled: true }, tooltipOnHover: true },
      passengers: [{ id: '1', passengerLabel: 'John Doe', seat: null, readOnly: false }],
    });

    await waitFor(() => {
      expect(screen.getByText(/33A/)).toBeInTheDocument();
    });

    const seatEl = screen.getByText(/33A/).closest('[data-testid="jets-seat"]');
    fireEvent.click(seatEl);

    const container = screen.getByTestId('jets-seat-map');
    await waitFor(() => {
      const region = container.querySelector('[aria-live]');
      expect(region.textContent).toContain('33A');
    });
  });
});
