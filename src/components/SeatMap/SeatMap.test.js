import { render, screen, waitFor, act } from '@testing-library/react';
import { JetsSeatMap } from './SeatMap';
import { CONFIG_MOCK } from '../Demo/constants';
import { flightDetails } from './__fixtures__/seatMapApiGetPlaneFeatures';
import { availability, finalDeck, finalSeat, passenger } from './__fixtures__/SeatMapService';
import { paramsData } from '../TooltipGlobal/__fixtures__';
import { bulk, exit, row, seat } from './__fixtures__/seatMapApiPostDataResponse';
import { JetsSeatMapService } from './service';

jest.mock('./service');

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
      const seatAvailability = [availability()];
      const passengers = [passenger()];
      const params = paramsData();

      const availabilityData = seatAvailability;
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
        availability: seatAvailability,
        passengers: passengers,
        currentDeckIndex: 0,
        onSeatMapInited: mockOnSeatMapInited,
      });

      await waitFor(() => {
        expect(screen.queryByTestId('jets-seat-map')).toBeInTheDocument();
        expect(mockGetSeatMapData).toHaveBeenCalledWith(
          flight,
          seatAvailability,
          passengers,
          expect.any(Object) // not testing it was called with certain config
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

  describe('when the seat map is passed valid config and params', () => {
    it('should render the wings if visibleWings is set to true in params', async () => {
      const seatMapDataForOneDeck = {
        params: paramsData({
          visibleWings: true,
        }),
        content: [
          finalDeck({
            rows: [
              row({
                seats: [
                  finalSeat({
                    number: '11A',
                  }),
                ],
              }),
            ],
          }),
        ],
        exits: [[]],
        bulks: [[]],
      };
      JetsSeatMapService.prototype.getSeatMapData = jest.fn().mockResolvedValue(seatMapDataForOneDeck);

      setup({
        flight: flightDetails(),
        availability: null,
        passengers: null,
        currentDeckIndex: 0,
      });

      await waitFor(() => {
        expect(screen.queryByTestId('jets-wings')).toBeInTheDocument();
      });
    });

    it('should not render the wings if visibleWings is set to false in params', async () => {
      const seatMapDataForOneDeck = {
        params: paramsData({
          visibleWings: false,
        }),
        content: [
          finalDeck({
            rows: [
              row({
                seats: [
                  finalSeat({
                    number: '11A',
                  }),
                ],
              }),
            ],
          }),
        ],
        exits: [[]],
        bulks: [[]],
      };
      JetsSeatMapService.prototype.getSeatMapData = jest.fn().mockResolvedValue(seatMapDataForOneDeck);

      setup({
        flight: flightDetails(),
        availability: null,
        passengers: null,
        currentDeckIndex: 1,
      });

      await waitFor(() => {
        expect(screen.queryByTestId('jets-wings')).not.toBeInTheDocument();
      });
    });

    it('should render the nose and tail of the plane if visibleFuselage is set to true in config', async () => {
      const seatMapDataForOneDeck = {
        params: paramsData(),
        content: [
          finalDeck({
            rows: [
              row({
                seats: [
                  finalSeat({
                    number: '11A',
                  }),
                ],
              }),
            ],
          }),
        ],
        exits: [[]],
        bulks: [[]],
      };
      JetsSeatMapService.prototype.getSeatMapData = jest.fn().mockResolvedValue(seatMapDataForOneDeck);

      setup({
        flight: flightDetails(),
        availability: null,
        passengers: null,
        currentDeckIndex: 1,
        configOverrides: { visibleFuselage: true },
      });

      await waitFor(() => {
        expect(screen.queryByTestId('jets-nose')).toBeInTheDocument();
        expect(screen.queryByTestId('jets-tail')).toBeInTheDocument();
      });
    });

    it('should not render the nose and tail of the plane if visibleFuselage is set to false in config', async () => {
      const seatMapDataForOneDeck = {
        params: paramsData(),
        content: [
          finalDeck({
            rows: [
              row({
                seats: [
                  finalSeat({
                    number: '11A',
                  }),
                ],
              }),
            ],
          }),
        ],
        exits: [[]],
        bulks: [[]],
      };
      JetsSeatMapService.prototype.getSeatMapData = jest.fn().mockResolvedValue(seatMapDataForOneDeck);

      setup({
        flight: flightDetails(),
        availability: null,
        passengers: null,
        currentDeckIndex: 1,
        configOverrides: { visibleFuselage: false },
      });

      await waitFor(() => {
        expect(screen.queryByTestId('jets-nose')).not.toBeInTheDocument();
        expect(screen.queryByTestId('jets-tail')).not.toBeInTheDocument();
      });
    });
  });

  describe('when the seat map is called with valid flight data', () => {
    it('should render seat for a single-deck configuration', async () => {
      const seatMapDataForOneDeck = {
        params: paramsData(),
        content: [
          finalDeck({
            rows: [
              row({
                seats: [
                  finalSeat({
                    number: '11A',
                  }),
                ],
              }),
            ],
          }),
        ],
        exits: [[]],
        bulks: [[]],
      };

      JetsSeatMapService.prototype.getSeatMapData = jest.fn().mockResolvedValue(seatMapDataForOneDeck);

      setup({
        flight: flightDetails(),
        availability: null,
        passengers: null,
        currentDeckIndex: 0, // lower deck
      });

      await waitFor(() => {
        const seatNumber = screen.queryByText(/11A/);
        expect(seatNumber).toBeInTheDocument();
        expect(screen.queryByTestId('jets-bulk')).not.toBeInTheDocument();
        expect(screen.queryByTestId('jets-exit')).not.toBeInTheDocument();
      });
    });

    it('should render seat availability for a single-deck configuration', async () => {
      const seatMapDataForOneDeck = {
        params: paramsData(),
        content: [
          finalDeck({
            rows: [
              row({
                seats: [
                  finalSeat({
                    number: '11A',
                    status: 'available',
                  }),
                  finalSeat({
                    number: '11B',
                    status: 'unavailable',
                  }),
                ],
              }),
            ],
          }),
        ],
        exits: [[]],
        bulks: [[]],
      };

      JetsSeatMapService.prototype.getSeatMapData = jest.fn().mockResolvedValue(seatMapDataForOneDeck);

      setup({
        flight: flightDetails(),
        availability: [
          availability({
            label: '11A',
          }),
        ],
        passengers: null,
        currentDeckIndex: 0, // lower deck
      });

      await waitFor(() => {
        expect(screen.queryByText(/11A/)).toBeInTheDocument();
        expect(screen.queryByText(/11B/)).toBeInTheDocument();
        const seatWrappers = screen.getAllByTestId('jets-seat');
        expect(seatWrappers[0]).toHaveTextContent(/11A/);
        expect(seatWrappers[0]).toHaveClass('jets-seat jets-available');
        expect(seatWrappers[1]).toHaveTextContent(/11B/);
        expect(seatWrappers[1]).toHaveClass('jets-seat jets-unavailable');
      });
    });

    it('should render seat passengers for a single-deck configuration', async () => {
      const seatMapDataForOneDeck = {
        params: paramsData(),
        content: [
          finalDeck({
            rows: [
              row({
                seats: [
                  finalSeat({
                    number: '11A',
                    status: 'available',
                  }),
                  finalSeat({
                    number: '11B',
                    status: 'available',
                  }),
                ],
              }),
            ],
          }),
        ],
        exits: [[]],
        bulks: [[]],
      };
      const mockPassenger = passenger({
        passengerLabel: 'John Doe',
        seat: {
          seatLabel: '11A',
        },
      });
      const mockPassengerWithAbbr = {
        ...mockPassenger,
        abbr: 'JD',
      };
      const seatMapDataForOneDeckWithAllData = {
        ...seatMapDataForOneDeck,
      };
      seatMapDataForOneDeckWithAllData.content[0].rows[0].seats[0].status = 'selected';
      seatMapDataForOneDeckWithAllData.content[0].rows[0].seats[0].passenger = mockPassengerWithAbbr;
      JetsSeatMapService.prototype.getSeatMapData = jest.fn().mockResolvedValue(seatMapDataForOneDeckWithAllData);

      setup({
        flight: flightDetails(),
        availability: null,
        passengers: [mockPassenger],
        currentDeckIndex: 0, // lower deck
      });

      await waitFor(() => {
        const seatWrappers = screen.getAllByTestId('jets-seat');
        expect(seatWrappers[0]).toHaveTextContent(/11A/);
        expect(seatWrappers[0]).toHaveTextContent(/JD/);
        expect(seatWrappers[1]).toHaveTextContent(/11B/);
        expect(seatWrappers[1]).not.toHaveTextContent(/JD/);
      });
    });

    it('should render seat for a double-deck configuration, lower deck chosen', async () => {
      const seatMapDataForOneDeck = {
        params: paramsData(),
        content: [
          finalDeck({
            rows: [
              row({
                isFirstInCabin: true,
                classCode: 'E',
                seats: [
                  finalSeat({
                    number: '11A',
                  }),
                ],
              }),
            ],
          }),
          finalDeck({
            rows: [
              row({
                isFirstInCabin: true,
                classCode: 'F',
                seats: [
                  finalSeat({
                    number: '22B',
                  }),
                ],
              }),
            ],
          }),
        ],
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
      });

      await waitFor(() => {
        const lowerDeckSeat = screen.queryByText(/11A/);
        expect(lowerDeckSeat).toBeInTheDocument();
        const upperDeckSeat = screen.queryByText(/22B/);
        expect(upperDeckSeat).not.toBeInTheDocument();
        const cabinTitle = screen.getByTestId('jets-cabin-title');
        expect(cabinTitle).toBeInTheDocument();
        expect(cabinTitle).toHaveTextContent('Economy');
      });
    });

    it('should render seat for a double-deck configuration, upper deck chosen', async () => {
      const seatMapDataForTwoDecks = {
        params: paramsData(),
        content: [
          finalDeck({
            rows: [
              row({
                isFirstInCabin: true,
                classCode: 'E',
                seats: [
                  finalSeat({
                    number: '11A',
                  }),
                ],
              }),
            ],
          }),
          finalDeck({
            rows: [
              row({
                isFirstInCabin: true,
                classCode: 'F',
                seats: [
                  finalSeat({
                    number: '22B',
                  }),
                ],
              }),
            ],
          }),
        ],
        exits: [[]],
        bulks: [[]],
      };

      const mockGetSeatMapData = jest.fn().mockResolvedValue(seatMapDataForTwoDecks);
      JetsSeatMapService.prototype.getSeatMapData = mockGetSeatMapData;

      setup({
        flight: flightDetails(),
        availability: null,
        passengers: null,
        currentDeckIndex: 1, // upper deck
      });

      await waitFor(() => {
        const lowerDeckSeat = screen.queryByText(/11A/);
        expect(lowerDeckSeat).not.toBeInTheDocument();
        const upperDeckSeat = screen.getByText(/22B/);
        expect(upperDeckSeat).toBeInTheDocument();
        const cabinTitle = screen.getByTestId('jets-cabin-title');
        expect(cabinTitle).toBeInTheDocument();
        expect(cabinTitle).toHaveTextContent('First');
      });
    });

    it('should render bulks and exists', async () => {
      const seatMapDataForOneDeck = {
        params: paramsData(),
        content: [finalDeck()],
        exits: [[exit()]],
        bulks: [[bulk()]],
      };

      JetsSeatMapService.prototype.getSeatMapData = jest.fn().mockResolvedValue(seatMapDataForOneDeck);

      setup({
        flight: flightDetails(),
        availability: null,
        passengers: null,
        currentDeckIndex: 0,
      });

      await waitFor(() => {
        expect(screen.queryByTestId('jets-bulk')).toBeInTheDocument();
        expect(screen.queryByTestId('jets-exit')).toBeInTheDocument();
      });
    });
  });
});
