import { render, screen, waitFor } from '@testing-library/react';
import { JetsSeatMap } from './SeatMap';
import { CONFIG_MOCK } from '../Demo/constants';
import { flightDetails } from './__fixtures__/seatMapApiGetPlaneFeatures';
import { finalDeck } from './__fixtures__/SeatMapService';
import { paramsData } from '../TooltipGlobal/__fixtures__';
import { row, seat } from './__fixtures__/seatMapApiPostDataResponse';
import { JetsSeatMapService } from './service';

jest.mock('./service');

const setup = ({ flight, availability, passengers, currentDeckIndex, seatJumpTo, config, onSeatMapInited }) => {
  return render(
    <JetsSeatMap
      flight={flight}
      availability={availability}
      passengers={passengers}
      currentDeckIndex={currentDeckIndex}
      seatJumpTo={seatJumpTo}
      config={config}
      onSeatMapInited={onSeatMapInited}
    />,
  );
};

describe('JetsSeatMap', () => {
  beforeEach(() => {
    JetsSeatMapService.prototype = {
      getSeatMapData: jest.fn(),
      addAbbrToPassengers: jest.fn(),
      setPassengersHandler: jest.fn(),
      setAvailabilityHandler: jest.fn(),
      compareWithDecksSeatsInfo: jest.fn(),
    };
  });

  describe('when the seat map is rendered', () => {
    it('should initialize the seat map if all valid data was passed', async () => {
      const flight = flightDetails();
      const availability = [{ data: 'some availability' }];
      const passengers = [{ data: 'some passenger data' }];
      const params = paramsData();

      const availabilityData = [{ data: 'some availabilityData' }];
      const seatMapData = {
        params,
        content: [],
        exits: [[]],
        bulks: [[]],
        availabilityData,
      };

      const mockOnSeatMapInited = jest.fn();
      const mockGetSeatMapData = jest.fn().mockResolvedValue(seatMapData);
      JetsSeatMapService.prototype.getSeatMapData = mockGetSeatMapData;

      setup({
        flight,
        availability: availability,
        passengers: passengers,
        currentDeckIndex: 0,
        seatJumpTo: null,
        config: CONFIG_MOCK,
        onSeatMapInited: mockOnSeatMapInited,
      });

      await waitFor(() => {
        expect(screen.queryByTestId('jets-seat-map')).toBeInTheDocument();
        expect(mockGetSeatMapData).toHaveBeenCalledWith(
          flight,
          availability,
          passengers,
          expect.any(Object), // not testing it was called with certain config
        );
        expect(mockOnSeatMapInited).toHaveBeenCalledWith({
          heightInPx: params?.isHorizontal ? params?.innerWidth : params?.totalDecksHeight,
          widthInPx: params?.isHorizontal ? params?.totalDecksHeight : params?.innerWidth,
          scaleFactor: params?.scale,
          decksCount: 0,
          currentDeckIndex: 0,
          availabilityData: availabilityData,
        });
      });
    });

    it('should not initialize the seat map if no flight data was passed', async () => {
      const mockOnSeatMapInited = jest.fn();

      setup({
        flight: null,
        availability: null,
        passengers: null,
        currentDeckIndex: 0,
        seatJumpTo: null,
        config: CONFIG_MOCK,
        onSeatMapInited: mockOnSeatMapInited,
      });

      await waitFor(() => {
        expect(screen.queryByTestId('jets-seat-map')).toBeInTheDocument();
        expect(mockOnSeatMapInited).not.toHaveBeenCalled();
      });
    });

    it('should initialize the seat map with an error if an error occurred when getting seat map data', async () => {
      const mockOnSeatMapInited = jest.fn();
      const mockGetSeatMapData = jest.fn().mockRejectedValue(new Error('An error occurred'));
      JetsSeatMapService.prototype.getSeatMapData = mockGetSeatMapData;

      setup({
        flight: flightDetails(),
        availability: null,
        passengers: null,
        currentDeckIndex: 0,
        seatJumpTo: null,
        config: CONFIG_MOCK,
        onSeatMapInited: mockOnSeatMapInited,
      });

      await waitFor(() => {
        expect(screen.queryByTestId('jets-seat-map')).toBeInTheDocument();
        expect(mockOnSeatMapInited).toHaveBeenCalledWith({
          heightInPx: undefined,
          widthInPx: undefined,
          scaleFactor: undefined,
          decksCount: undefined,
          currentDeckIndex: undefined,
          error: 'An error occurred',
        });
      });
    });
  });

  describe('when the seat map is called with valid flight data', () => {
    it('should render seats correctly for a single-deck configuration', async () => {
      const seatMapDataForOneDeck = {
        params: paramsData(),
        content: [
          finalDeck({
            rows: [row({
              seats: [seat({
                number: '11A',
              })],
            })],
          })],
        exits: [[]],
        bulks: [[]],
      };

      const mockGetSeatMapData = jest.fn().mockResolvedValue(seatMapDataForOneDeck);
      JetsSeatMapService.prototype.getSeatMapData = mockGetSeatMapData;

      setup({
        flight: flightDetails(),
        availability: null,
        passengers: null,
        currentDeckIndex: 0, // lower deck
        seatJumpTo: null,
        config: CONFIG_MOCK,
      });

      await waitFor(() => {
        const seatNumber = screen.queryByText(/11A/);
        expect(seatNumber).toBeInTheDocument();
      });
    });

    it('should render seats correctly for a double-deck configuration, lower deck chosen', async () => {
      const seatMapDataForOneDeck = {
        params: paramsData(),
        content: [
          finalDeck({
            rows: [row({
              seats: [seat({
                number: '11A',
              })],
            })],
          }),
          finalDeck({
            rows: [row({
              seats: [seat({
                number: '22B',
              })],
            })],
          })],
        exits: [[]],
        bulks: [[]],
      };

      const mockGetSeatMapData = jest.fn().mockResolvedValue(seatMapDataForOneDeck);
      JetsSeatMapService.prototype.getSeatMapData = mockGetSeatMapData;

      setup({
        flight: flightDetails(),
        availability: null,
        passengers: null,
        currentDeckIndex: 0, // lower deck
        seatJumpTo: null,
        config: CONFIG_MOCK,
      });

      await waitFor(() => {
        const lowerDeckSeat = screen.queryByText(/11A/);
        expect(lowerDeckSeat).toBeInTheDocument();
        const upperDeckSeat = screen.queryByText(/22B/);
        expect(upperDeckSeat).not.toBeInTheDocument();
      });
    });

    it('should render seats correctly for a double-deck configuration, upper deck chosen', async () => {
      const seatMapDataForOneDeck = {
        params: paramsData(),
        content: [
          finalDeck({
            rows: [row({
              seats: [seat({
                number: '11A',
              })],
            })],
          }),
          finalDeck({
            rows: [row({
              seats: [seat({
                number: '22B',
              })],
            })],
          })],
        exits: [[]],
        bulks: [[]],
      };

      const mockGetSeatMapData = jest.fn().mockResolvedValue(seatMapDataForOneDeck);
      JetsSeatMapService.prototype.getSeatMapData = mockGetSeatMapData;

      setup({
        flight: flightDetails(),
        availability: null,
        passengers: null,
        currentDeckIndex: 1, // upper deck
        seatJumpTo: null,
        config: CONFIG_MOCK,
      });

      await waitFor(() => {
        const lowerDeckSeat = screen.queryByText(/11A/);
        expect(lowerDeckSeat).not.toBeInTheDocument();
        const upperDeckSeat = screen.getByText(/22B/);
        expect(upperDeckSeat).toBeInTheDocument();
      });
    });
  });
});
