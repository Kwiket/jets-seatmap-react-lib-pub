import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { JetsSeatMap } from './SeatMap';
import { flightDetails } from './__fixtures__/seatMapApiGetPlaneFeatures';
import { CONFIG_MOCK } from '../Demo/constants';
import { cabin, entertainment, power, seatDetails, wifi, deck, row, seat } from './__fixtures__/seatMapApiPostDataResponse';

let axe, toHaveNoViolations;
try {
  // eslint-disable-next-line global-require
  ({ axe, toHaveNoViolations } = require('jest-axe'));
} catch (e) {
  // jest-axe not installed in this environment — the suite skips.
}
const describeAxe = axe ? describe : describe.skip;
if (toHaveNoViolations) expect.extend({ toHaveNoViolations });

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

describeAxe('JetsSeatMap axe a11y (full integration, wcag.enabled)', () => {
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

  it('renders the default (idle) seat map with wcag fully enabled and no axe violations', async () => {
    setup({ flight, configOverrides: { wcag: { enabled: true } } });

    await waitFor(() => {
      expect(screen.getByText(/33A/)).toBeInTheDocument();
    });

    const container = screen.getByTestId('jets-seat-map');
    const results = await axe(container, { rules: { 'color-contrast': { enabled: false } } });
    expect(results).toHaveNoViolations();
  });

  it('renders the seat map with an open tooltip dialog and no axe violations', async () => {
    setup({ flight, configOverrides: { wcag: { enabled: true } } });

    await waitFor(() => {
      fireEvent.click(screen.getByText(/33A/));
    });

    await waitFor(() => {
      expect(screen.getByText(/Select/)).toBeInTheDocument();
    });

    const container = screen.getByTestId('jets-seat-map');
    const results = await axe(container, { rules: { 'color-contrast': { enabled: false } } });
    expect(results).toHaveNoViolations();
  });
});
