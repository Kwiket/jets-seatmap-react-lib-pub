import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { JetsSeatMap } from './SeatMap';
import { flightDetails } from './__fixtures__/seatMapApiGetPlaneFeatures';
import { CONFIG_MOCK } from '../Demo/constants';
import { cabin, entertainment, power, seatDetails, wifi } from './__fixtures__/seatMapApiPostDataResponse';

const setup = ({
  flight,
  availability,
  passengers,
  currentDeckIndex,
  configOverrides,
  onSeatMapInited,
  onAvailabilityApplied,
}) => {
  const config = {
    ...CONFIG_MOCK,
    ...configOverrides,
  };
  return render(
    <JetsSeatMap
      flight={flight}
      availability={availability}
      passengers={passengers}
      currentDeckIndex={currentDeckIndex}
      config={config}
      onSeatMapInited={onSeatMapInited}
      onAvailabilityApplied={onAvailabilityApplied}
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

describe('JetsSeatMap', () => {
  it('should show the tooltip with the correct data when a seat is clicked', async () => {
    const flight = flightDetails();

    const singleCabinResponseFixture = [
      {
        id: '1111',
        cabin: cabin(),
        entertainment: entertainment(),
        power: power(),
        wifi: wifi(),
        seatDetails: seatDetails(),
      },
    ];
    mockPostData.mockImplementation(() => singleCabinResponseFixture);

    setup({
      flight: flight,
      availability: null,
      passengers: null,
      currentDeckIndex: 0,
    });

    await waitFor(() => {
      fireEvent.click(screen.getByText(/33A/));
    });

    await waitFor(() => {
      expect(screen.getByText(/Premium Economy 33A/)).toBeInTheDocument();
      expect(screen.getByText(/Select/)).toBeInTheDocument();
    });
  });

  it('should trigger onSeatSelected when a passenger selects an available seat', async () => {
    const flight = flightDetails();

    const singleCabinResponseFixture = [
      {
        id: '1111',
        cabin: cabin(),
        entertainment: entertainment(),
        power: power(),
        wifi: wifi(),
        seatDetails: seatDetails(),
      },
    ];

    mockPostData.mockImplementation(() => singleCabinResponseFixture);

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

    const { rerender } = setup({
      flight,
      availability,
      passengers,
      currentDeckIndex: 1,
      onSeatSelected,
    });

    await waitFor(() => {
      rerender(
        <JetsSeatMap
          flight={flight}
          passengers={passengers}
          availability={availability}
          currentDeckIndex={1}
          onSeatSelected={onSeatSelected}
        />
      );
    });

    await waitFor(() => {
      fireEvent.click(screen.getByText(/33A/));
    });

    await waitFor(() => {
      fireEvent.click(screen.getByText(/Select/));
    });

    expect(onSeatSelected).toHaveBeenCalledTimes(1);
    expect(onSeatSelected).toHaveBeenCalledWith([
      {
        abbr: 'JD',
        id: '1',
        passengerColor: 'brown',
        passengerLabel: 'John Doe',
        readOnly: false,
        seat: { price: 'EUR 5', currency: 'EUR', priceValue: 5, seatLabel: '33A' },
      },
    ]);
  });

  it('should trigger onSeatUnselected when a passenger unselects a seat they just selected', async () => {
    const flight = flightDetails();

    const singleCabinResponseFixture = [
      {
        id: '1111',
        cabin: cabin(),
        entertainment: entertainment(),
        power: power(),
        wifi: wifi(),
        seatDetails: seatDetails(),
      },
    ];

    mockPostData.mockImplementation(() => singleCabinResponseFixture);

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
    const onSeatUnselected = jest.fn();

    const { rerender } = setup({
      flight,
      availability: null,
      passengers: null,
      currentDeckIndex: 0,
    });

    rerender(
      <JetsSeatMap
        flight={flight}
        passengers={passengers}
        availability={availability}
        currentDeckIndex={1}
        onSeatSelected={onSeatSelected}
        onSeatUnselected={onSeatUnselected}
      />
    );

    await waitFor(() => {
      fireEvent.click(screen.getByText(/33A/));
    });

    await waitFor(() => {
      fireEvent.click(screen.getByText(/Select/));
    });

    await waitFor(() => {
      fireEvent.click(screen.getByText(/33A/));
    });

    await waitFor(() => {
      fireEvent.click(screen.getByText(/Unselect/));
    });

    expect(onSeatUnselected).toHaveBeenCalledTimes(1);
    expect(onSeatUnselected).toHaveBeenCalledWith([
      { abbr: 'JD', id: '1', passengerColor: 'brown', passengerLabel: 'John Doe', readOnly: false, seat: null },
    ]);
  });
});
