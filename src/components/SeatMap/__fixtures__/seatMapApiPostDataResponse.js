export const seatFeatures = (overrides = {}) => ({
  extraLegroom: '+',
  noFloorStorage: '-',
  nearLavatory: '-',
  nearStairs: '-',
  exitRow: '+',
  ...overrides,
});

export const seat = (overrides = {}) => ({
  color: '#5AB54C',
  features: seatFeatures(),
  leftOffset: 0,
  letter: 'A',
  topOffset: 0,
  ...overrides,
});

export const row = (overrides = {}) => ({
  uniqId: '_b95h9f8',
  classCode: 'P',
  number: 33,
  seats: [seat()],
  seatScheme: 'S-',
  seatType: 14,
  topOffset: 0,
  name: 'Premium Economy',
  isFirstInCabin: true,
  ...overrides,
});

export const wingsInfo = (overrides = {}) => ({
  deckLevel: 1,
  topOffset: 2600,
  height: 3700,
  ...overrides,
});

export const exit = (overrides = {}) => ({
  uniqId: '_m34hj5m',
  type: 'right',
  topOffset: -314,
  ...overrides,
});

export const bulk = (overrides = {}) => ({
  uniqId: '_ff3p1e4',
  id: '16',
  type: 'left',
  iconType: '',
  topOffset: 1560,
  xOffset: 0,
  width: 382,
  height: 176,
  align: 'left',
  ...overrides,
});

export const deck = (overrides = {}) => ({
  uniqId: '_tplskd2',
  bulks: [bulk()],
  level: 1,
  rows: [row()],
  exits: [exit()],
  wingsInfo: wingsInfo(),
  ...overrides,
});

export const plane = (overrides = {}) => ({
  id: 'dc1913d422398c25c5f0b81cab94cc87',
  brand: 'Airbus',
  model: '388',
  summary: 'Airbus A380-800',
  name: 'Airbus A388',
  windowSize: 'large',
  isWideBody: true,
  seatmapExists: true,
  ...overrides,
});

export const cabin = (overrides = {}) => ({
  pitch: '218 cm',
  recline: '180°',
  width: '58 cm',
  flatness: 'full_flat_seat',
  legroomSummary: '218 cm legroom',
  reclineSummary: 'full flat seat',
  type: 'standard_legroom',
  ...overrides,
});

export const entertainment = (overrides = {}) => ({
  exists: true,
  cost: 'free',
  deliveryType: 'in-seat',
  summary: 'free on demand entertainment',
  ...overrides,
});

export const wifi = (overrides = {}) => ({
  exists: true,
  cost: 'free',
  summary: 'WiFi enabled',
  ...overrides,
});

export const power = (overrides = {}) => ({
  summary: 'power available: AC/USB',
  exists: true,
  type: 'AC/USB',
  usbPort: true,
  powerOutlet: true,
  ...overrides,
});

export const seatDetails = (overrides = {}) => ({
  decks: [deck()],
  ...overrides,
});

export const cabinItem = (overrides = {}) => ({
  id: '1111',
  cabin: cabin(),
  entertainment: entertainment(),
  power: power(),
  wifi: wifi(),
  plane: plane(),
  error: null,
  ...overrides,
});
