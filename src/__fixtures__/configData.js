import { CONFIG_MOCK } from '../components/Demo/constants';

const HIDDEN_SEAT_FEATURES = [
  'babyBassinet',
  'wingInWindow',
  'nearLavatory',
  'bassinet',
  'getColdByExit',
  'standardSeat',
  'nearGalley',
  'nearStairs',
];

export const configData = (overrides = {}) => ({
  ...CONFIG_MOCK,
  apiAppId: 'mockApiAppId',
  apiAuthorizationScheme: 'JWT',
  apiKey: 'auth_token',
  apiMetadata: {
    transaction_id: '123-456-789',
    offer_id: '123abc-456def-789ghi',
  },
  apiUrl: 'http://example.com/api',
  currencySign: '$',
  hiddenSeatFeatures: HIDDEN_SEAT_FEATURES,
  units: 'metric',
  ...overrides,
});
