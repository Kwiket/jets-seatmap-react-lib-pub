import { LOCALES_MAP } from './constants';
import { LOCALE_EN } from './i18n.languages';

// Canonical set of keys every locale must have (from default locale EN)
const EXPECTED_LOCALE_KEYS = Object.keys(LOCALE_EN).sort();

describe('i18n locales', () => {
  it.each(Object.entries(LOCALES_MAP))(
    'locale %s has the same set of keys as the default locale',
    (_localeCode, localeObj) => {
      const actualKeys = Object.keys(localeObj).sort();
      expect(actualKeys).toEqual(EXPECTED_LOCALE_KEYS);
    }
  );
});
