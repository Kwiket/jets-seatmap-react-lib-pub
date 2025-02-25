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
  it('it renders the SeatMap component', () => {
    const { container } = render(<JetsSeatMap />);
    expect(container).toBeInTheDocument();
  });

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
      expect(screen.getByText(/Premium Economy/)).toBeInTheDocument();
    });
  });

  it('should trigger the appropriate events when a seat is selected', async () => {
    // TODO: Rename when you know what the events are
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

    //
  });
});
