import { row, wingsInfo } from './seatMapApiPostDataResponse';

export const finalDeck = (overrides = {}) => ({
  uniqId: '_dix8s8l',
  level: 1,
  number: 1,
  width: 200,
  height: 200,
  rows: [row()],
  wingsInfo: wingsInfo(),
  ...overrides
});

