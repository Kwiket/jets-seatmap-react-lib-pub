export const flightDetails = (overrides = {}) => ({
  id: '1111',
  airlineCode: 'EK',
  flightNo: '2',
  departureDate: '2025-07-19',
  departure: 'LHR',
  arrival: 'DXB',
  cabinClass: 'A',
  passengerType: 'ADT',
  ...overrides,
});
