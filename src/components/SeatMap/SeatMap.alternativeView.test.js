import React from 'react';
import { render, fireEvent, screen, waitFor, within } from '@testing-library/react';
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

const setup = ({ flight, availability, passengers, configOverrides, onSeatSelected, onSeatUnselected }) => {
  const config = {
    ...CONFIG_MOCK,
    ...configOverrides,
  };
  return render(
    <JetsSeatMap
      flight={flight}
      availability={availability ?? null}
      passengers={passengers ?? null}
      currentDeckIndex={0}
      config={config}
      onSeatMapInited={() => {}}
      onAvailabilityApplied={() => {}}
      onSeatSelected={onSeatSelected ?? (() => {})}
      onSeatUnselected={onSeatUnselected ?? (() => {})}
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

describe('SeatMap alternativeView (grid/list/auto)', () => {
  const flight = flightDetails();

  beforeEach(() => {
    const twoRowDeck = deck({
      rows: [
        row({ uniqId: '_row33', number: 33, seats: [seat({ letter: 'A' })] }),
        row({ uniqId: '_row34', number: 34, seats: [seat({ letter: 'A' })] }),
      ],
    });

    const singleCabinResponseFixture = [
      {
        id: '1111',
        cabin: cabin(),
        entertainment: entertainment(),
        power: power(),
        wifi: wifi(),
        seatDetails: seatDetails({ decks: [twoRowDeck] }),
      },
    ];
    mockPostData.mockImplementation(() => singleCabinResponseFixture);
  });

  it('renders no table and no toggle button when alternativeView is unset (zero-change default)', async () => {
    setup({ flight, configOverrides: {} });

    await waitFor(() => {
      expect(screen.getByText(/33A/)).toBeInTheDocument();
    });

    expect(screen.queryByRole('table')).toBeNull();
    expect(screen.queryByRole('button', { name: /view as list/i })).toBeNull();
    expect(document.querySelector('.jets-seat-map__view-toggle')).toBeNull();

    // The grid still renders exactly as before.
    const seatEl = screen.getByText(/33A/).closest('[data-testid="jets-seat"]');
    expect(seatEl).toBeTruthy();
  });

  it('renders no table and no toggle button when alternativeView is explicitly "grid"', async () => {
    setup({ flight, configOverrides: { wcag: { alternativeView: 'grid' } } });

    await waitFor(() => {
      expect(screen.getByText(/33A/)).toBeInTheDocument();
    });

    expect(screen.queryByRole('table')).toBeNull();
    expect(document.querySelector('.jets-seat-map__view-toggle')).toBeNull();
  });

  it('renders the table with all seats and no toggle button when alternativeView is "list"', async () => {
    setup({ flight, configOverrides: { wcag: { alternativeView: 'list' } } });

    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    expect(document.querySelector('.jets-seat-map__view-toggle')).toBeNull();

    // Both seats (row 33 and row 34) are present as table rows.
    const table = screen.getByRole('table');
    expect(table).toHaveTextContent('33A');
    expect(table).toHaveTextContent('34A');

    // The grid itself did not render.
    expect(document.querySelector('[data-testid="jets-seat"]')).toBeNull();
  });

  it('renders the toggle button when alternativeView is "auto"', async () => {
    setup({ flight, configOverrides: { wcag: { alternativeView: 'auto' } } });

    await waitFor(() => {
      expect(screen.getByText(/33A/)).toBeInTheDocument();
    });

    const toggle = document.querySelector('.jets-seat-map__view-toggle');
    expect(toggle).not.toBeNull();
    expect(toggle.textContent).toMatch(/view as list/i);
  });

  it('clicking the toggle button in "auto" mode switches between grid and list', async () => {
    setup({ flight, configOverrides: { wcag: { alternativeView: 'auto' } } });

    await waitFor(() => {
      expect(screen.getByText(/33A/)).toBeInTheDocument();
    });

    expect(screen.queryByRole('table')).toBeNull();

    const toggle = document.querySelector('.jets-seat-map__view-toggle');
    fireEvent.click(toggle);

    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument();
    });
    expect(toggle.textContent).toMatch(/view as map/i);

    fireEvent.click(toggle);

    await waitFor(() => {
      expect(screen.queryByRole('table')).toBeNull();
    });
  });

  it('selecting a seat from the list view fires onSeatSelected, same as the grid would', async () => {
    const passengers = [
      {
        id: '1',
        seat: null,
        passengerLabel: 'John Doe',
        passengerColor: 'brown',
        readOnly: false,
      },
    ];

    const availability = [
      {
        currency: 'EUR',
        label: '33A',
        price: 5,
      },
    ];

    const onSeatSelected = jest.fn();

    setup({
      flight,
      availability,
      passengers,
      configOverrides: { wcag: { alternativeView: 'list' } },
      onSeatSelected,
    });

    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    const row33 = screen.getByText('33A').closest('tr');
    const selectButton = within(row33).getByRole('button');
    fireEvent.click(selectButton);

    await waitFor(() => {
      expect(onSeatSelected).toHaveBeenCalledTimes(1);
    });
    expect(onSeatSelected).toHaveBeenCalledWith([
      expect.objectContaining({
        id: '1',
        passengerLabel: 'John Doe',
      }),
    ]);
  });
});
