import { row, seatFeatures, wingsInfo } from './seatMapApiPostDataResponse';

export const finalDeck = (overrides = {}) => ({
  uniqId: '_dix8s8l',
  level: 1,
  number: 1,
  width: 200,
  height: 200,
  rows: [
    row({
      seats: [finalSeat()],
    }),
  ],
  wingsInfo: wingsInfo(),
  ...overrides,
});

export const passenger = (overrides = {}) => ({
  id: '1',
  seat: {
    price: 0,
    seatLabel: '11A',
  },
  passengerLabel: 'John Doe',
  passengerColor: 'brown',
  readOnly: true,
  ...overrides,
});

export const availability = (overrides = {}) => ({
  currency: 'EUR',
  label: '1A',
  price: 0,
  ...overrides,
});

export const finalSeat = (overrides = {}) => ({
  uniqId: '_28fwzc8',
  type: 'seat',
  seatType: 'P-14',
  color: '#5AB54C',
  features: seatFeatures(),
  status: 'available',
  leftOffset: 0,
  letter: 'A',
  number: '1A',
  classType: 'Premium economy',
  rowName: 'Premium Economy',
  classCode: 'P',
  topOffset: 0,
  size: {
    width: 100,
    height: 100,
  },
  ...overrides,
});
