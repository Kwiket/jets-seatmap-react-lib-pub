import {
  DEFAULT_SEAT_PASSENGER_TYPES,
  ENTITY_STATUS_MAP,
  ENTITY_TYPE_MAP,
  SEAT_FEATURES_ICONS,
  Utils,
} from '../../common';
import { JetsSeatMapService } from './service';
import { createPassenger, createRow, createSeatsMapService } from './service.test';

beforeEach(() => {
  jest.resetAllMocks();
});

jest.mock('../../common/utils');

describe('JetsSeatMapService handlers', () => {
  describe('selectSeatHandler', () => {
    it('should set passenger seat, price & number for next passenger', () => {
      const service = createSeatsMapService();

      const passengerId = '12345';
      const passenger = {
        id: passengerId,
      };
      const otherPassengerId = '54321';
      const otherPassenger = {
        id: otherPassengerId,
      };
      const getNextPassengerMock = jest.spyOn(service, 'getNextPassenger').mockImplementation(() => passenger);

      const setPassengersHandlerReturnValue = {
        key: 'value',
      };
      const setPassengersHandlerMock = jest
        .spyOn(service, 'setPassengersHandler')
        .mockImplementation(() => setPassengersHandlerReturnValue);

      const seat = {
        passenger: {
          id: passengerId,
        },
        price: '$ 9,99',
        number: '33A',
      };
      const passengersList = [passenger, otherPassenger];

      const content = {};
      const { data: actualData, passengers: actualPassengers } = service.selectSeatHandler(
        content,
        seat,
        passengersList
      );

      expect(actualData).toEqual(setPassengersHandlerReturnValue);

      const expectedPassengers = [
        {
          id: passengerId,
          seat: {
            price: '$ 9,99',
            seatLabel: '33A',
          },
        },
        {
          id: otherPassengerId,
        },
      ];
      expect(actualPassengers).toEqual(expectedPassengers);
      expect(getNextPassengerMock).toHaveBeenCalledTimes(1);
      expect(setPassengersHandlerMock).toHaveBeenCalledTimes(1);
      expect(setPassengersHandlerMock).toHaveBeenCalledWith({}, expectedPassengers);
    });

    it('should not modify passengers if no next passenger', () => {
      const service = createSeatsMapService();

      const passengerId = '12345';
      const passenger = {
        id: passengerId,
      };
      const otherPassengerId = '54321';
      const otherPassenger = {
        id: otherPassengerId,
      };
      const getNextPassengerMock = jest.spyOn(service, 'getNextPassenger').mockImplementation(() => null);

      const setPassengersHandlerReturnValue = {
        key: 'value',
      };
      const setPassengersHandlerMock = jest
        .spyOn(service, 'setPassengersHandler')
        .mockImplementation(() => setPassengersHandlerReturnValue);

      const seat = {
        passenger: {
          id: passengerId,
        },
        price: '$ 9,99',
        number: '33A',
      };
      const passengersList = [passenger, otherPassenger];

      const content = {};
      const { data: actualData, passengers: actualPassengers } = service.selectSeatHandler(
        content,
        seat,
        passengersList
      );

      expect(actualData).toEqual(setPassengersHandlerReturnValue);

      const expectedPassengers = [
        {
          id: passengerId,
        },
        {
          id: otherPassengerId,
        },
      ];
      expect(actualPassengers).toEqual(expectedPassengers);
      expect(getNextPassengerMock).toHaveBeenCalledTimes(1);
      expect(setPassengersHandlerMock).toHaveBeenCalledTimes(1);
      expect(setPassengersHandlerMock).toHaveBeenCalledWith({}, expectedPassengers);
    });
  });

  describe('unselectSeatHandler', () => {
    it('should clear the seat from any passengers assigned to the supplied seat before calling setPassengersHandler', () => {
      const service = createSeatsMapService();

      const setPassengersHandlerReturnValue = {
        key: 'value',
      };
      const setPassengersHandlerMock = jest
        .spyOn(service, 'setPassengersHandler')
        .mockImplementation(() => setPassengersHandlerReturnValue);

      const passengerId = '12345';
      const otherPassengerId = '54321';
      const seat = {
        passenger: {
          id: passengerId,
        },
      };
      const otherSeat = {
        passenger: {
          id: otherPassengerId,
        },
      };
      const passengersList = [
        {
          id: passengerId,
          seat: seat,
        },
        {
          id: otherPassengerId,
          seat: otherSeat,
        },
      ];

      const content = {};
      const { data: actualData, passengers: actualPassengers } = service.unselectSeatHandler(
        content,
        seat,
        passengersList
      );

      expect(actualData).toEqual(setPassengersHandlerReturnValue);

      const expectedPassengers = [
        {
          id: passengerId,
          seat: null,
        },
        {
          id: otherPassengerId,
          seat: otherSeat,
        },
      ];
      expect(actualPassengers).toEqual(expectedPassengers);
      expect(setPassengersHandlerMock).toHaveBeenCalledWith({}, expectedPassengers);
    });
  });

  describe('setAvailabilityHandler', () => {
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

    it.each([
      [
        'should return the specified cssClass, label & icon in additionalProps (seat-specific)',
        {
          cssClass: 'class',
          label: 'additionalProp',
          iconName: '+',
          expectedIcon: SEAT_FEATURES_ICONS['+'],
        },
      ],
      [
        'should return dot icon in additionalProps if none specified in availability additionalProps (seat-specific)',
        {
          cssClass: 'class',
          label: 'additionalProp',
          iconName: null,
          expectedIcon: SEAT_FEATURES_ICONS['dot'],
        },
      ],
      [
        'should return empty icon in additionalProps if invalid icon name specified in availability additionalProps (seat-specific)',
        {
          cssClass: 'class',
          label: 'additionalProp',
          iconName: 'invalidIcon',
          expectedIcon: '',
        },
      ],
    ])('%s', (_, { cssClass, label, iconName, expectedIcon }) => {
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
          additionalProps: [
            {
              icon: iconName,
              label: label,
              cssClass: cssClass,
            },
          ],
        },
      ];

      const uniqId = '_random';
      const mockGenerateId = jest.fn().mockReturnValue(uniqId);
      Utils.generateId = mockGenerateId;

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
                      cssClass: cssClass,
                      icon: expectedIcon,
                      title: null,
                      uniqId: uniqId,
                      value: label,
                    },
                  ],
                  color: 'magenta',
                },
              ],
            },
          ],
        },
      ]);

      expect(mockGenerateId).toHaveBeenCalledTimes(1);
    });

    it.each([
      [
        'should return the specified cssClass, label & icon in additionalProps (wildcard)',
        {
          cssClass: 'class',
          label: 'additionalProp',
          iconName: '+',
          expectedIcon: SEAT_FEATURES_ICONS['+'],
        },
      ],
      [
        'should return dot icon in additionalProps if none specified in availability additionalProps (wildcard)',
        {
          cssClass: 'class',
          label: 'additionalProp',
          iconName: null,
          expectedIcon: SEAT_FEATURES_ICONS['dot'],
        },
      ],
      [
        'should return empty icon in additionalProps if invalid icon name specified in availability additionalProps (wildcard)',
        {
          cssClass: 'class',
          label: 'additionalProp',
          iconName: 'invalidIcon',
          expectedIcon: '',
        },
      ],
    ])('%s', (_, { cssClass, label, iconName, expectedIcon }) => {
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
          additionalProps: [
            {
              icon: iconName,
              label: label,
              cssClass: cssClass,
            },
          ],
        },
      ];

      const uniqId = '_random';
      const mockGenerateId = jest.fn().mockReturnValue(uniqId);
      Utils.generateId = mockGenerateId;

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
                  additionalProps: [
                    {
                      cssClass: cssClass,
                      icon: expectedIcon,
                      title: null,
                      uniqId: uniqId,
                      value: label,
                    },
                  ],
                  color: 'magenta',
                },
              ],
            },
          ],
        },
      ]);

      expect(mockGenerateId).toHaveBeenCalledTimes(1);
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

      const content = [deck];
      const passengers = [passenger];
      const response = service.setPassengersHandler(content, passengers);

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

      const content = [deck];
      const passengers = [passenger];
      service.setPassengersHandler(content, passengers);

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

      const content = [deck];
      const passengers = [];
      const response = service.setPassengersHandler(content, passengers);

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
});
