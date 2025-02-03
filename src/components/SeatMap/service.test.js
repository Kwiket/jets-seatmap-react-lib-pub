import { JetsSeatMapService } from './service';
import { DEFAULT_SEAT_PASSENGER_TYPES, ENTITY_STATUS_MAP, ENTITY_TYPE_MAP, JetsContentPreparer } from '../../common';

beforeEach(() => {
  jest.resetAllMocks();
});

jest.mock('../../common/data-preparer');

function createSeatsMapService(
  apiUrl = 'apiUrl',
  apiAppId = 'apiAppId',
  apiKey = 'apiKey',
  colorTheme = 'colorTheme',
  apiAuthorizationScheme = 'apiAuthorizationScheme'
) {
  return new JetsSeatMapService({ apiUrl, apiAppId, apiKey, colorTheme, apiAuthorizationScheme });
}

function createRow(seatSpecs) {
  const row = { seats: [] };

  for (const seatSpec of seatSpecs) {
    row.seats.push({ ...seatSpec });
  }

  return row;
}

function createPassenger(seatNumber, passengerLabel = null) {
  return {
    passengerLabel: passengerLabel,
    seat: {
      seatLabel: seatNumber,
    },
  };
}

describe('JetsSeatMapService', () => {
  describe('getSeatMapData', () => {
    it('TODO', () => {});
  });

  describe('selectSeatHandler', () => {
    it('TODO', () => {});
  });

  describe('unselectSeatHandler', () => {
    it('TODO', () => {});
  });

  describe('setAvailabilityHandler', () => {
    beforeEach(() => {
      JetsContentPreparer.prototype._prepareSeatAdditionalProps = jest.fn().mockImplementation(() => []);
    });

    it('should use seat specific availability if present', () => {
      const service = createSeatsMapService();

      const content = [
        {
          rows: [createRow([{ type: ENTITY_TYPE_MAP.seat, number: '33A' }])],
        },
      ];
      const availability = [
        {
          label: '33A',
          currency: '$',
          price: '9.99',
          onlyForPassengerType: ['Type1', 'Type2'],
          color: 'magenta',
        },
      ];

      const response = service.setAvailabilityHandler(content, availability);

      expect(response).toEqual([
        {
          rows: [
            {
              seats: [
                {
                  type: ENTITY_TYPE_MAP.seat,
                  number: '33A',
                  status: ENTITY_STATUS_MAP.available,
                  price: '$ 9.99',
                  cost: '9.99',
                  currency: '$',
                  passengerTypes: ['Type1', 'Type2'],
                  additionalProps: [],
                  color: 'magenta',
                },
              ],
            },
          ],
        },
      ]);
    });

    it('should use wildcard seat details if no seat specific availability', () => {
      const service = createSeatsMapService();

      const content = [
        {
          rows: [createRow([{ type: ENTITY_TYPE_MAP.seat, number: '33A' }])],
        },
      ];
      const availability = [
        {
          label: '*',
          currency: '$',
          price: '9.99',
          onlyForPassengerType: ['Type1', 'Type2'],
          color: 'magenta',
        },
      ];

      const response = service.setAvailabilityHandler(content, availability);

      expect(response).toEqual([
        {
          rows: [
            {
              seats: [
                {
                  type: ENTITY_TYPE_MAP.seat,
                  number: '33A',
                  status: ENTITY_STATUS_MAP.available,
                  price: '$ 9.99',
                  cost: '9.99',
                  currency: '$',
                  passenger: null,
                  passengerTypes: ['Type1', 'Type2'],
                  additionalProps: [],
                  color: 'magenta',
                },
              ],
            },
          ],
        },
      ]);
    });

    it('should use wildcard seat details for anything not specified in seat specific availability', () => {
      const service = createSeatsMapService();

      const content = [
        {
          rows: [createRow([{ type: ENTITY_TYPE_MAP.seat, number: '33A' }])],
        },
      ];
      const availability = [
        {
          label: '33A',
        },
        {
          label: '*',
          currency: '$',
          price: '9.99',
          onlyForPassengerType: ['Type1', 'Type2'],
          color: 'magenta',
        },
      ];

      const response = service.setAvailabilityHandler(content, availability);

      expect(response).toEqual([
        {
          rows: [
            {
              seats: [
                {
                  type: ENTITY_TYPE_MAP.seat,
                  number: '33A',
                  status: ENTITY_STATUS_MAP.available,
                  price: '$ 9.99',
                  cost: '9.99',
                  currency: '$',
                  passengerTypes: ['Type1', 'Type2'],
                  additionalProps: [],
                  color: 'magenta',
                },
              ],
            },
          ],
        },
      ]);
    });

    it('should use configuration currency sign over seat specific or wildcard currency sign if present', () => {
      const service = new JetsSeatMapService({ currencySign: '₱' });

      const content = [
        {
          rows: [createRow([{ type: ENTITY_TYPE_MAP.seat, number: '33A' }])],
        },
      ];
      const availability = [
        {
          label: '33A',
          currencySign: '$',
        },
        {
          label: '*',
          currencySign: '£',
        },
      ];

      const response = service.setAvailabilityHandler(content, availability);

      expect(response).toEqual([
        {
          rows: [
            {
              seats: [
                {
                  type: ENTITY_TYPE_MAP.seat,
                  number: '33A',
                  status: ENTITY_STATUS_MAP.available,
                  price: '₱ 0',
                  cost: 0,
                  currency: '₱',
                  passengerTypes: DEFAULT_SEAT_PASSENGER_TYPES,
                  additionalProps: [],
                  color: undefined,
                },
              ],
            },
          ],
        },
      ]);
    });

    it('should include any additionalProps returned by JetsContentPreparer', () => {
      const service = createSeatsMapService();

      const content = [
        {
          rows: [createRow([{ type: ENTITY_TYPE_MAP.seat, number: '33A' }])],
        },
      ];
      const availability = [
        {
          label: '33A',
          currency: '$',
          price: '9.99',
          onlyForPassengerType: ['Type1', 'Type2'],
          color: 'magenta',
        },
      ];

      const mockPrepareSeatAdditionalProps = jest.fn().mockImplementation(() => [
        {
          label: 'Additional prop label',
        },
      ]);

      JetsContentPreparer.prototype._prepareSeatAdditionalProps = mockPrepareSeatAdditionalProps;

      const response = service.setAvailabilityHandler(content, availability);

      expect(response).toEqual([
        {
          rows: [
            {
              seats: [
                {
                  type: ENTITY_TYPE_MAP.seat,
                  number: '33A',
                  status: ENTITY_STATUS_MAP.available,
                  price: '$ 9.99',
                  cost: '9.99',
                  currency: '$',
                  passengerTypes: ['Type1', 'Type2'],
                  additionalProps: [
                    {
                      label: 'Additional prop label',
                    },
                  ],
                  color: 'magenta',
                },
              ],
            },
          ],
        },
      ]);
      expect(mockPrepareSeatAdditionalProps).toHaveBeenCalledTimes(1);
      expect(mockPrepareSeatAdditionalProps).toHaveBeenCalledWith({
        type: ENTITY_TYPE_MAP.seat,
        number: '33A',
        status: ENTITY_STATUS_MAP.available,
        price: '$ 9.99',
        cost: '9.99',
        currency: '$',
        passengerTypes: ['Type1', 'Type2'],
        additionalProps: [
          {
            label: 'Additional prop label',
          },
        ],
        color: 'magenta',
      });
    });
  });

  describe('setPassengersHandler', () => {
    it.each([
      [
        'should set status & passenger for available seat with matching passenger',
        {
          seatStatus: ENTITY_STATUS_MAP.available,
          seatPrice: null,
          initialPassengerSeatPrice: null,
          expectedPrice: null,
        },
      ],
      [
        'should set status & passenger for selected seat with matching passenger',
        {
          seatStatus: ENTITY_STATUS_MAP.selected,
          seatPrice: null,
          initialPassengerSeatPrice: null,
          expectedPrice: null,
        },
      ],
      [
        'should set status & passenger for selected seat with matching passenger and take price from seat',
        {
          seatStatus: ENTITY_STATUS_MAP.selected,
          seatPrice: '3,95 EUR',
          initialPassengerSeatPrice: null,
          expectedPrice: '3,95 EUR',
        },
      ],
      [
        'should set status & passenger for selected seat with matching passenger and take price from existing passenger seat',
        {
          seatStatus: ENTITY_STATUS_MAP.selected,
          seatPrice: null,
          initialPassengerSeatPrice: { price: '3,95 EUR' },
          expectedPrice: '3,95 EUR',
        },
      ],
    ])('%s', (_, { seatStatus, seatPrice, initialPassengerSeatPrice, expectedPrice }) => {
      const service = createSeatsMapService();

      const passenger = createPassenger('33A');
      passenger.seat = {
        ...passenger.seat,
        ...initialPassengerSeatPrice,
      };

      const deck = {
        rows: [createRow([{ type: ENTITY_TYPE_MAP.seat, number: '33A', status: seatStatus, price: seatPrice }])],
      };

      const response = service.setPassengersHandler([deck], [passenger]);

      expect(response).toEqual([
        {
          rows: [
            {
              seats: [
                {
                  type: ENTITY_TYPE_MAP.seat,
                  number: '33A',
                  status: ENTITY_STATUS_MAP.selected,
                  passenger: passenger,
                  price: expectedPrice,
                },
              ],
            },
          ],
        },
      ]);
    });

    it('should clear seat from passenger if passenger seat is unavailable', () => {
      const service = createSeatsMapService();

      const passenger = createPassenger('33A', 'Passenger');

      const deck = {
        rows: [createRow([{ type: ENTITY_TYPE_MAP.seat, number: '33A', status: ENTITY_STATUS_MAP.unavailable }])],
      };

      service.setPassengersHandler([deck], [passenger]);

      expect(passenger).toEqual({
        passengerLabel: 'Passenger',
        seat: null,
      });
    });

    it('should clear passenger from seat if seat selected but no passenger is assigned to that seat', () => {
      const service = createSeatsMapService();

      const deck = {
        rows: [
          createRow([
            {
              type: ENTITY_TYPE_MAP.seat,
              number: '33A',
              status: ENTITY_STATUS_MAP.selected,
              passenger: createPassenger('33A'),
            },
          ]),
        ],
      };

      const response = service.setPassengersHandler([deck], []);

      expect(response).toEqual([
        {
          rows: [
            {
              seats: [
                {
                  type: ENTITY_TYPE_MAP.seat,
                  number: '33A',
                  status: ENTITY_STATUS_MAP.available,
                  passenger: null,
                },
              ],
            },
          ],
        },
      ]);
    });
  });

  describe('calculateTooltipData', () => {
    it.each([
      [
        'should return correct tooltip for a horizontal tooltip',
        {
          isHorizontal: true,
        },
      ],
      [
        'should return correct tooltip for a vertical tooltip',
        {
          isHorizontal: false,
        },
      ],
    ])('%s', isHorizontal => {
      const service = createSeatsMapService();

      const seatData = {
        size: {
          height: 50,
        },
      };
      const seatTop = 100;
      const closestNode = {
        name: 'parentNode',
      };
      const seatNode = { offsetTop: seatTop, closest: jest.fn().mockReturnValue(closestNode) };
      const boundingClientRect = {
        width: 200,
        height: 300,
      };
      const seatMapNode = {
        name: 'seatMapNode',
        getBoundingClientRect: jest.fn().mockReturnValue(boundingClientRect),
      };
      const antiScale = 5;

      const result = service.calculateTooltipData(seatData, seatNode, seatMapNode, antiScale, isHorizontal);

      const expectedWidth = isHorizontal ? boundingClientRect.height : boundingClientRect.width;
      const expectedHeight = isHorizontal ? boundingClientRect.width : boundingClientRect.height;

      const expectedWidthPercent = 0.95;
      const expectedTooltipWidth = `${100 * expectedWidthPercent}%`;

      const expectedTop = seatTop + seatData.size.height / 2;

      const expectedLeft = `${100 * (1 - expectedWidthPercent) * 0.5}%`;

      expect(result).toEqual({
        ...seatData,
        top: expectedTop,
        left: expectedLeft,
        antiScale: antiScale,
        width: expectedTooltipWidth,
        seatmapHeight: expectedHeight,
        seatmapWidth: expectedWidth,
        activeDeck: closestNode,
        seatNode: seatNode,
      });
      expect(seatMapNode.getBoundingClientRect).toHaveBeenCalled();
      expect(seatNode.closest).toHaveBeenCalledWith('.tooltip-holder');
    });
  });

  describe('getNextPassenger', () => {
    it('returns first passenger if no passengers have seat labels', () => {
      const service = createSeatsMapService();

      const firstPassenger = createPassenger(null);
      const secondPassenger = createPassenger(null);
      const passenger = service.getNextPassenger([firstPassenger, secondPassenger]);

      expect(passenger).toEqual(firstPassenger);
    });

    it('returns second passenger if first passengers has seat labels', () => {
      const service = createSeatsMapService();

      const firstPassenger = createPassenger('33A');
      const secondPassenger = createPassenger(null);
      const passenger = service.getNextPassenger([firstPassenger, secondPassenger]);

      expect(passenger).toEqual(secondPassenger);
    });

    it('returns undefined if all passengers have seat labels', () => {
      const service = createSeatsMapService();

      const firstPassenger = createPassenger('33A');
      const secondPassenger = createPassenger('33F');
      const passenger = service.getNextPassenger([firstPassenger, secondPassenger]);

      expect(passenger).toBeUndefined();
    });

    it('returns undefined if no passengers are given', () => {
      const service = createSeatsMapService();

      const passenger = service.getNextPassenger([]);

      expect(passenger).toBeUndefined();
    });

    it('returns undefined if null passengers are given', () => {
      const service = createSeatsMapService();

      const passenger = service.getNextPassenger(null);

      expect(passenger).toBeUndefined();
    });
  });

  describe('addAbbrToPassengers', () => {
    it('should add index to passenger if no passengerLabel defined', () => {
      const service = createSeatsMapService();

      const firstPassenger = createPassenger('33A');
      const secondPassenger = createPassenger('33F');
      const [modifiedFirstPassenger, modifiedSecondPassenger] = service.addAbbrToPassengers([
        firstPassenger,
        secondPassenger,
      ]);

      expect(modifiedFirstPassenger).toEqual({
        ...firstPassenger,
        abbr: 'P1',
      });
      expect(modifiedSecondPassenger).toEqual({
        ...secondPassenger,
        abbr: 'P2',
      });
    });

    it('should add first two letters of label if one-word passengerLabel defined', () => {
      const service = createSeatsMapService();

      const firstPassenger = createPassenger('33A', 'Foobar');
      const [modifiedPassenger] = service.addAbbrToPassengers([firstPassenger]);

      expect(modifiedPassenger).toEqual({
        ...firstPassenger,
        abbr: 'FO',
      });
    });

    it('should add initials of label if two-word passengerLabel defined', () => {
      const service = createSeatsMapService();

      const firstPassenger = createPassenger('33A', 'Foo Bar');
      const [modifiedPassenger] = service.addAbbrToPassengers([firstPassenger]);

      expect(modifiedPassenger).toEqual({
        ...firstPassenger,
        abbr: 'FB',
      });
    });

    it('should add first two initials of label if three-word passengerLabel defined', () => {
      const service = createSeatsMapService();

      const firstPassenger = createPassenger('33A', 'Foo Ach Bar');
      const [modifiedPassenger] = service.addAbbrToPassengers([firstPassenger]);

      expect(modifiedPassenger).toEqual({
        ...firstPassenger,
        abbr: 'FA',
      });
    });
  });

  describe('findPassengerBySeatNumber', () => {
    it('should return passenger with matching seat number', () => {
      const service = createSeatsMapService();

      const expectedPassenger = createPassenger('33A');
      const actualPassenger = service.findPassengerBySeatNumber([expectedPassenger], '33A');

      expect(actualPassenger).toEqual(expectedPassenger);
    });

    it('should return passenger with matching seat number with multiple passengers in list', () => {
      const service = createSeatsMapService();

      const expectedPassenger = createPassenger('33A');
      const otherPassenger = createPassenger('33F');
      const actualPassenger = service.findPassengerBySeatNumber([expectedPassenger, otherPassenger], '33A');

      expect(actualPassenger).toEqual(expectedPassenger);
    });

    it('should return undefined if no matching passengers in list', () => {
      const service = createSeatsMapService();

      const passenger = createPassenger('33A');
      const actualPassenger = service.findPassengerBySeatNumber([passenger], '33X');

      expect(actualPassenger).toBeUndefined();
    });
  });

  describe('getDeckIndexBySeatLabel', () => {
    it.each([
      [
        'should find seat in first deck, first row',
        {
          seatLabel: '33A',
          decks: [
            {
              rows: [createRow([{ type: ENTITY_TYPE_MAP.seat, number: '33A' }])],
            },
          ],
          expectedIndex: 0,
        },
      ],
      [
        'should find seat in first deck, second row',
        {
          seatLabel: '33F',
          decks: [
            {
              rows: [
                createRow([{ type: ENTITY_TYPE_MAP.seat, number: '33A' }]),
                createRow([{ type: ENTITY_TYPE_MAP.seat, number: '33F' }]),
              ],
            },
          ],
          expectedIndex: 0,
        },
      ],
      [
        'should find seat in second deck, first row',
        {
          seatLabel: '33F',
          decks: [
            {
              rows: [createRow([{ type: ENTITY_TYPE_MAP.seat, number: '33A' }])],
            },
            {
              rows: [createRow([{ type: ENTITY_TYPE_MAP.seat, number: '33F' }])],
            },
          ],
          expectedIndex: 1,
        },
      ],
      [
        'should return index -1 if seat not present',
        {
          seatLabel: '33X',
          decks: [
            {
              rows: [createRow([{ type: ENTITY_TYPE_MAP.seat, number: '33A' }])],
            },
          ],
          expectedIndex: -1,
        },
      ],
    ])('%s', (_, { seatLabel, decks, expectedIndex }) => {
      const service = createSeatsMapService();

      const actualIndex = service.getDeckIndexBySeatLabel(seatLabel, decks);

      expect(actualIndex).toEqual(expectedIndex);
    });

    it('should return index -1 if no seatLabels given', () => {
      const service = createSeatsMapService();

      const actualIndex = service.getDeckIndexBySeatLabel(null, [
        {
          rows: [createRow([{ type: ENTITY_TYPE_MAP.seat, number: '33A' }])],
        },
      ]);

      expect(actualIndex).toEqual(-1);
    });

    it('should return index -1 if no decks given', () => {
      const service = createSeatsMapService();

      const actualIndex = service.getDeckIndexBySeatLabel('33A', null);

      expect(actualIndex).toEqual(-1);
    });

    it('should return index -1 if empty decks given', () => {
      const service = createSeatsMapService();

      const actualIndex = service.getDeckIndexBySeatLabel('33A', []);

      expect(actualIndex).toEqual(-1);
    });
  });

  describe('compareWithDecksSeatsInfo', () => {
    it.each([
      [
        'should find single seat within decks',
        {
          purpose: 'should find single seat within decks',
          seatLabels: ['33A'],
          decks: [
            {
              rows: [createRow([{ type: ENTITY_TYPE_MAP.seat, number: '33A' }])],
            },
          ],
          expectedExistingSeatLabels: ['33A'],
          expectedNonExistingSeatLabels: [],
        },
      ],
      [
        'should find multiple seats within same row',
        {
          purpose: 'should find multiple seats within same row',
          seatLabels: ['33A', '33F'],
          decks: [
            {
              rows: [
                createRow([
                  { type: ENTITY_TYPE_MAP.seat, number: '33A' },
                  { type: ENTITY_TYPE_MAP.seat, number: '33F' },
                ]),
              ],
            },
          ],
          expectedExistingSeatLabels: ['33A', '33F'],
          expectedNonExistingSeatLabels: [],
        },
      ],
      [
        'should find multiple seats within same deck, different row',
        {
          purpose: 'should find multiple seats within same deck, different row',
          seatLabels: ['33A', '33F'],
          decks: [
            {
              rows: [
                createRow([{ type: ENTITY_TYPE_MAP.seat, number: '33A' }]),
                createRow([{ type: ENTITY_TYPE_MAP.seat, number: '33F' }]),
              ],
            },
          ],
          expectedExistingSeatLabels: ['33A', '33F'],
          expectedNonExistingSeatLabels: [],
        },
      ],
      [
        'should find multiple seats within same plane, different deck',
        {
          seatLabels: ['33A', '33F'],
          decks: [
            {
              rows: [createRow([{ type: ENTITY_TYPE_MAP.seat, number: '33A' }])],
            },
            {
              rows: [createRow([{ type: ENTITY_TYPE_MAP.seat, number: '33F' }])],
            },
          ],
          expectedExistingSeatLabels: ['33A', '33F'],
          expectedNonExistingSeatLabels: [],
        },
      ],
      [
        'should not find a seat that is not in the plane',
        {
          seatLabels: ['33X'],
          decks: [
            {
              rows: [createRow([{ type: ENTITY_TYPE_MAP.seat, number: '33A' }])],
            },
          ],
          expectedExistingSeatLabels: [],
          expectedNonExistingSeatLabels: ['33X'],
        },
      ],
      [
        "should not find a seat that does not have type 'seat'",
        {
          seatLabels: ['33X'],
          decks: [
            {
              rows: [createRow([{ type: ENTITY_TYPE_MAP.aisle, number: '33X' }])],
            },
          ],
          expectedExistingSeatLabels: [],
          expectedNonExistingSeatLabels: ['33X'],
        },
      ],
    ])('%s', (_, { seatLabels, decks, expectedExistingSeatLabels, expectedNonExistingSeatLabels }) => {
      const service = createSeatsMapService();

      const { existingSeatLabels, nonExistingSeatLabels } = service.compareWithDecksSeatsInfo(seatLabels, decks);

      expect(existingSeatLabels).toEqual(expectedExistingSeatLabels);
      expect(nonExistingSeatLabels).toEqual(expectedNonExistingSeatLabels);
    });

    it('should return undefined if no seatLabels given', () => {
      const service = createSeatsMapService();

      const result = service.compareWithDecksSeatsInfo(null, []);

      expect(result).toBeUndefined();
    });

    it('should return undefined if no decks given', () => {
      const service = createSeatsMapService();

      const result = service.compareWithDecksSeatsInfo([], null);

      expect(result).toBeUndefined();
    });
  });
});
