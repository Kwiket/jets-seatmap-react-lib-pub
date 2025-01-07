const AVAILABILITY_MOCK = [
  {
    currency: 'USD',
    label: '20A',
    price: 33,
    onlyForPassengerType: ['ADT', 'CHD', 'INF'],
    additionalProps: [
      { label: 'Test prop for all', icon: null },
      { label: 'Another test prop for all', icon: 'wifi' },
    ],
    color: 'green',
  },
  {
    currency: 'USD',
    label: '20E',
    price: 33,
    onlyForPassengerType: ['ADT', 'CHD', 'INF'],
    additionalProps: [
      { label: 'Clear air', icon: null, cssClass: 'clear-air-style' },
      { label: 'USB plug', icon: 'power' },
    ],
    color: 'red',
  },
  {
    currency: 'USD',
    label: '20K',
    price: 33,
    onlyForPassengerType: ['ADT', 'CHD', 'INF'],
    color: 'magenta',
  },
  {
    currency: 'USD',
    label: '21F',
    price: 13,
    onlyForPassengerType: ['ADT', 'CHD', 'INF'],
  },
  {
    currency: 'USD',
    label: '21J',
    price: 13,
    onlyForPassengerType: ['CHD', 'INF'],
  },
  {
    currency: 'USD',
    label: '35K',
    price: 137,
    onlyForPassengerType: ['CHD', 'INF'],
  },
  {
    currency: 'EUR',
    label: '70E',
    price: 133399,
  },
];

export default AVAILABILITY_MOCK;
