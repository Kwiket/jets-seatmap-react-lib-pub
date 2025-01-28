import { render, screen, fireEvent } from '@testing-library/react';

import { MockJetsContextProvider } from '../../__mocks__/MockJetsContext';

import { DECK_LOCALE_KEY } from '../Deck';
import { JetsDeckTitle } from './index';
import CONFIG_MOCK from '../Demo/constants/config-mock';

const setup = ({ lang = CONFIG_MOCK.lang, localeKey = DECK_LOCALE_KEY, ...rest }) => {
  render(
    <MockJetsContextProvider>
      <JetsDeckTitle {...rest} lang={lang} localeKey={localeKey} />
    </MockJetsContextProvider>
  );
};

describe('JetsDeckTitle', () => {
  it('should render the Deck number correctly (EN)', () => {
    setup({ number: '2' });
    expect(screen.getByText('Deck: 2')).toBeInTheDocument();
  });
});
