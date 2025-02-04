export const seatDataFirst = (overrides = {}) => ({
  classCode: 'F',
  classType: 'First',
  color: '#4071B9',
  leftOffset: 0,
  letter: 'A',
  number: '1A',
  originalColor: '#4071B9',
  rotation: 'n',
  rowName: 'First',
  seatIconType: 23,
  seatType: 'F-23',
  size: {
    width: 200,
    height: 400,
  },
  status: 'available',
  topOffset: 0,
  type: 'seat',
  uniqId: '_fksozcf',
  ...overrides,
});

export const seatDataBusiness = (overrides = {}) => ({
  classCode: 'B',
  classType: 'Business',
  color: '#4071B9',
  leftOffset: 0,
  letter: 'A',
  number: '7A',
  originalColor: '#4071B9',
  rotation: 'n',
  rowName: 'Business',
  seatIconType: 18,
  seatType: 'B-18',
  size: {
    width: 185,
    height: 175,
  },
  status: 'available',
  topOffset: 0,
  type: 'seat',
  uniqId: '_65zxjv1',
  ...overrides,
});

export const seatDataPremium = (overrides = {}) => ({
  classCode: 'P',
  classType: 'Premium economy',
  color: '#5AB54C',
  leftOffset: 0,
  letter: 'A',
  number: '33A',
  originalColor: '#5AB54C',
  rowName: 'Premium Economy',
  seatIconType: 14,
  seatType: 'P-14',
  size: {
    width: 120,
    height: 150,
  },
  status: 'available',
  topOffset: 0,
  type: 'seat',
  uniqId: '_xek5akt',
  ...overrides,
});

export const seatDataEconomy = (overrides = {}) => ({
  classCode: 'E',
  classType: 'Economy',
  color: '#8FB947',
  leftOffset: 0,
  letter: 'A',
  number: '53A',
  originalColor: '#8FB947',
  rowName: 'Economy',
  seatType: 'E-3',
  seatIconType: 3,
  size: {
    width: 100,
    height: 100,
  },
  status: 'available',
  topOffset: 0,
  type: 'seat',
  uniqId: '_7z3en2q',
  ...overrides,
});

export const seatDataAisle = (overrides = {}) => ({
  letter: 33,
  size: {
    width: 120,
    height: 150,
  },
  status: 'disabled',
  type: 'aisle',
  uniqId: '_stw21s6',
  ...overrides,
});

export const seatDataEmpty = (overrides = {}) => ({
  letter: '',
  size: {
    width: 120,
    height: 150,
  },
  status: 'disabled',
  type: 'empty',
  uniqId: '_t1h0uve',
  ...overrides,
});

export const seatDataIndex = (overrides = {}) => ({
  letter: '',
  size: {
    width: 120,
    height: 150,
  },
  status: 'disabled',
  type: 'index',
  uniqId: '_t1h0uve',
  ...overrides,
});
