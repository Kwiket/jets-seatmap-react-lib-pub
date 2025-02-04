import { JetsSeatMapService } from './service';
import { ENTITY_TYPE_MAP } from '../../common';

export function createSeatsMapService() {
  return new JetsSeatMapService({
    apiUrl: 'apiUrl',
    apiAppId: 'apiAppId',
    apiKey: 'apiKey',
    colorTheme: 'colorTheme',
    apiAuthorizationScheme: 'apiAuthorizationScheme',
  });
}

export function createRow(seatSpecs) {
  const row = { seats: [] };

  for (const seatSpec of seatSpecs) {
    row.seats.push({ ...seatSpec });
  }

  return row;
}

export function createPassenger(seatNumber, passengerLabel = null) {
  return {
    passengerLabel: passengerLabel,
    seat: {
      seatLabel: seatNumber,
    },
  };
}

describe('JetsSeatMapService', () => {
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
    it('should return first passenger if no passengers have seat labels', () => {
      const service = createSeatsMapService();

      const firstPassenger = createPassenger(null);
      const secondPassenger = createPassenger(null);
      const passengers = [firstPassenger, secondPassenger];
      const passenger = service.getNextPassenger(passengers);

      expect(passenger).toEqual(firstPassenger);
    });

    it('should return second passenger if first passenger has seat labels', () => {
      const service = createSeatsMapService();

      const firstPassenger = createPassenger('33A');
      const secondPassenger = createPassenger(null);
      const passengers = [firstPassenger, secondPassenger];
      const passenger = service.getNextPassenger(passengers);

      expect(passenger).toEqual(secondPassenger);
    });

    it('should return undefined if all passengers have seat labels', () => {
      const service = createSeatsMapService();

      const firstPassenger = createPassenger('33A');
      const secondPassenger = createPassenger('33F');
      const passengers = [firstPassenger, secondPassenger];
      const passenger = service.getNextPassenger(passengers);

      expect(passenger).toBeUndefined();
    });

    it('should return undefined if no passengers are given', () => {
      const service = createSeatsMapService();

      const passengers = [];
      const passenger = service.getNextPassenger(passengers);

      expect(passenger).toBeUndefined();
    });

    it('should return undefined if null passengers are given', () => {
      const service = createSeatsMapService();

      const passengers = null;
      const passenger = service.getNextPassenger(passengers);

      expect(passenger).toBeUndefined();
    });
  });

  describe('addAbbrToPassengers', () => {
    it('should add index to passenger if no passengerLabel defined', () => {
      const service = createSeatsMapService();

      const firstPassenger = createPassenger('33A');
      const secondPassenger = createPassenger('33F');
      const passengers = [firstPassenger, secondPassenger];
      const [modifiedFirstPassenger, modifiedSecondPassenger] = service.addAbbrToPassengers(passengers);

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
      const passengers = [firstPassenger];
      const [modifiedPassenger] = service.addAbbrToPassengers(passengers);

      expect(modifiedPassenger).toEqual({
        ...firstPassenger,
        abbr: 'FO',
      });
    });

    it('should add initials of label if two-word passengerLabel defined', () => {
      const service = createSeatsMapService();

      const firstPassenger = createPassenger('33A', 'Foo Bar');
      const passengers = [firstPassenger];
      const [modifiedPassenger] = service.addAbbrToPassengers(passengers);

      expect(modifiedPassenger).toEqual({
        ...firstPassenger,
        abbr: 'FB',
      });
    });

    it('should add first two initials of label if three-word passengerLabel defined', () => {
      const service = createSeatsMapService();

      const firstPassenger = createPassenger('33A', 'Foo Ach Bar');
      const passengers = [firstPassenger];
      const [modifiedPassenger] = service.addAbbrToPassengers(passengers);

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
      const passengers = [expectedPassenger];
      const seatNumber = '33A';
      const actualPassenger = service.findPassengerBySeatNumber(passengers, seatNumber);

      expect(actualPassenger).toEqual(expectedPassenger);
    });

    it('should return passenger with matching seat number with multiple passengers in list', () => {
      const service = createSeatsMapService();

      const expectedPassenger = createPassenger('33A');
      const otherPassenger = createPassenger('33F');
      const passengers = [expectedPassenger, otherPassenger];
      const seatNumber = '33A';
      const actualPassenger = service.findPassengerBySeatNumber(passengers, seatNumber);

      expect(actualPassenger).toEqual(expectedPassenger);
    });

    it('should return undefined if no matching passengers in list', () => {
      const service = createSeatsMapService();

      const passenger = createPassenger('33A');
      const passengers = [passenger];
      const seatNumber = '33X';
      const actualPassenger = service.findPassengerBySeatNumber(passengers, seatNumber);

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

      const seatLabel = null;
      const decks = [
        {
          rows: [createRow([{ type: ENTITY_TYPE_MAP.seat, number: '33A' }])],
        },
      ];
      const actualIndex = service.getDeckIndexBySeatLabel(seatLabel, decks);

      expect(actualIndex).toEqual(-1);
    });

    it('should return index -1 if no decks given', () => {
      const service = createSeatsMapService();

      const seatLabel = '33A';
      const decks = null;
      const actualIndex = service.getDeckIndexBySeatLabel(seatLabel, decks);

      expect(actualIndex).toEqual(-1);
    });

    it('should return index -1 if empty decks given', () => {
      const service = createSeatsMapService();

      const seatLabel = '33A';
      const decks = [];
      const actualIndex = service.getDeckIndexBySeatLabel(seatLabel, decks);

      expect(actualIndex).toEqual(-1);
    });
  });

  describe('compareWithDecksSeatsInfo', () => {
    it.each([
      [
        'should find single seat within decks',
        {
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

      const seatLabels = null;
      const decks = [];
      const result = service.compareWithDecksSeatsInfo(seatLabels, decks);

      expect(result).toBeUndefined();
    });

    it('should return undefined if no decks given', () => {
      const service = createSeatsMapService();

      const seatLabels = [];
      const decks = null;
      const result = service.compareWithDecksSeatsInfo(seatLabels, decks);

      expect(result).toBeUndefined();
    });
  });
});
