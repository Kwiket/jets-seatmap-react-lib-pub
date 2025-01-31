import { JetsSeatMapService } from './service';
import { ENTITY_TYPE_MAP } from '../../common';

beforeAll(() => {
  jest.clearAllMocks();
});

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

  for (const { type, number } of seatSpecs) {
    row.seats.push({ type, number });
  }

  return row;
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
    it('TODO', () => {});
  });

  describe('setPassengersHandler', () => {
    it('TODO', () => {});
  });

  describe('calculateTooltipData', () => {
    it('TODO', () => {});
  });

  describe('getNextPassenger', () => {
    it('TODO', () => {});
  });

  describe('addAbbrToPassengers', () => {
    it('TODO', () => {});
  });

  describe('findPassengerBySeatNumber', () => {
    it('TODO', () => {});
  });

  describe('getDeckIndexBySeatLabel', () => {
    it('TODO', () => {});
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
