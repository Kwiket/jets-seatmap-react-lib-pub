import { CONFIG_MOCK } from '../Demo/constants';
import { render, waitFor } from '@testing-library/react';
import { JetsSeatMap } from './SeatMap';
import { flightDetails } from './__fixtures__/seatMapApiGetPlaneFeatures';
import { availability, passenger } from './__fixtures__/SeatMapService';
import {
  cabin,
  cabinItem,
  deck,
  entertainment,
  power,
  row,
  seat,
  seatDetails,
  wifi,
} from './__fixtures__/seatMapApiPostDataResponse';

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

const setup = ({ flight, availability, passengers, currentDeckIndex, configOverrides, onSeatMapInited }) => {
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
    />
  );
};

describe('JetsSeatMap', () => {
  describe('when seat map data is updated', () => {
    it('should not get seat map data again after availability has changed', async () => {
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

      const mockOnSeatMapInited = jest.fn();
      mockPostData.mockImplementation(() => singleCabinResponseFixture);

      const { rerender } = setup({
        flight,
        availability: null,
        passengers: null,
        currentDeckIndex: 0,
        onSeatMapInited: mockOnSeatMapInited,
      });

      rerender(
        <JetsSeatMap
          flight={flight}
          availability={[availability()]}
          passengers={null}
          currentDeckIndex={0}
          config={CONFIG_MOCK}
          onSeatMapInited={mockOnSeatMapInited}
        />
      );

      await waitFor(() => {
        expect(mockOnSeatMapInited).toHaveBeenCalledTimes(1);
        expect(mockPostData).toHaveBeenCalledTimes(1);
      });
    });

    it('should not get seat map data again after passengers has changed', async () => {
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

      const mockOnSeatMapInited = jest.fn();
      mockPostData.mockImplementation(() => singleCabinResponseFixture);

      const { rerender } = setup({
        flight,
        availability: null,
        passengers: null,
        currentDeckIndex: 0,
        onSeatMapInited: mockOnSeatMapInited,
      });

      rerender(
        <JetsSeatMap
          flight={flight}
          availability={null}
          passengers={[passenger()]}
          currentDeckIndex={0}
          config={CONFIG_MOCK}
          onSeatMapInited={mockOnSeatMapInited}
        />
      );

      await waitFor(() => {
        expect(mockOnSeatMapInited).toHaveBeenCalledTimes(1);
        expect(mockPostData).toHaveBeenCalledTimes(1);
      });
    });

    it('should update the deck information if the active deck has changed', async () => {
      const flight = flightDetails();
      const upperAndLowerDecksCabinResponseFixture = [
        {
          id: '1111',
          seatDetails: seatDetails({
            decks: [
              deck({
                level: 0,
                rows: [
                  row({
                    classCode: 'E',
                    seats: [
                      seat({
                        number: '1A',
                      }),
                    ],
                  }),
                ],
              }),
              deck({
                level: 1,
                rows: [
                  row({
                    classCode: 'F',
                    seats: [
                      seat({
                        number: '2B',
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        },
        cabinItem({ id: '1111:F' }),
        cabinItem({ id: '1111:E' }),
      ];

      const mockOnSeatMapInited = jest.fn();
      const onLayoutUpdated = jest.fn();
      mockPostData.mockImplementation(() => upperAndLowerDecksCabinResponseFixture);

      const { rerender } = setup({
        flight,
        availability: null,
        passengers: null,
        currentDeckIndex: 0,
        onSeatMapInited: mockOnSeatMapInited,
      });

      rerender(
        <JetsSeatMap
          flight={flight}
          availability={[availability()]}
          passengers={null}
          currentDeckIndex={1}
          config={CONFIG_MOCK}
          onSeatMapInited={mockOnSeatMapInited}
          onLayoutUpdated={onLayoutUpdated}
        />
      );

      await waitFor(() => {
        expect(mockOnSeatMapInited).toHaveBeenCalledTimes(1);
        expect(mockPostData).toHaveBeenCalledTimes(1);
        expect(onLayoutUpdated).toHaveBeenCalledTimes(2);
        expect(onLayoutUpdated).toHaveBeenNthCalledWith(1, expect.objectContaining({ currentDeckIndex: 0 }));
        expect(onLayoutUpdated).toHaveBeenNthCalledWith(2, expect.objectContaining({ currentDeckIndex: 1 }));
      });
    });
  });
});
