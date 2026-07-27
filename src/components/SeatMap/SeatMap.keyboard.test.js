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

const setup = ({ flight, configOverrides }) => {
  const config = {
    ...CONFIG_MOCK,
    ...configOverrides,
  };
  return render(
    <JetsSeatMap
      flight={flight}
      availability={null}
      passengers={null}
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

describe('SeatMap keyboard navigation', () => {
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

  it('after load exactly one gridcell is in the tab order (tabindex=0)', async () => {
    setup({ flight, configOverrides: { wcag: { enabled: true } } });

    await waitFor(() => {
      expect(screen.getByText(/33A/)).toBeInTheDocument();
    });

    const container = screen.getByTestId('jets-seat-map');
    await waitFor(() => {
      const tabbable = container.querySelectorAll('[role="gridcell"][tabindex="0"]');
      expect(tabbable.length).toBe(1);
    });
  });

  it('ArrowDown moves focus to a different gridcell', async () => {
    setup({ flight, configOverrides: { wcag: { enabled: true } } });

    await waitFor(() => {
      expect(screen.getByText(/33A/)).toBeInTheDocument();
    });

    const container = screen.getByTestId('jets-seat-map');
    let first;
    await waitFor(() => {
      first = container.querySelector('[role="gridcell"][tabindex="0"]');
      expect(first).toBeTruthy();
    });

    first.focus();
    expect(document.activeElement).toBe(first);

    fireEvent.keyDown(container, { key: 'ArrowDown' });

    expect(document.activeElement).not.toBe(first);
    expect(document.activeElement.getAttribute('role')).toBe('gridcell');
  });

  it('does nothing when wcag is off (zero-change): no gridcells, arrow keys inert', async () => {
    setup({ flight, configOverrides: {} });

    await waitFor(() => {
      expect(screen.getByText(/33A/)).toBeInTheDocument();
    });

    const container = screen.getByTestId('jets-seat-map');
    expect(container.querySelectorAll('[role="gridcell"]').length).toBe(0);

    expect(() => {
      fireEvent.keyDown(container, { key: 'ArrowDown' });
    }).not.toThrow();
  });
});
