import { render, screen } from '@testing-library/react';

import { MockJetsContextProvider } from '../../__mocks__/MockJetsContext';

import { DECK_LOCALE_KEY } from '../Deck';
import { JetsDeckTitle } from './index';
import CONFIG_MOCK from '../Demo/constants/config-mock';

import { SCALE_TYPES } from '../../common';

import { useEnvironmentInfo } from '../../common/hooks/useEnvironmentInfo';

jest.mock('../../common/hooks/useEnvironmentInfo', () => ({
  useEnvironmentInfo: jest.fn(),
}));

const mockAntiScale = 2;
const deckTitleSelector = '.jets-deck--title';

const defaultContextProps = {
  config: { scaleType: SCALE_TYPES.ZOOM },
  params: { antiScale: mockAntiScale },
};

const setup = ({
  lang = CONFIG_MOCK.lang,
  localeKey = DECK_LOCALE_KEY,
  contextProps = defaultContextProps,
  ...rest
} = {}) => {
  return render(
    <MockJetsContextProvider {...contextProps}>
      <JetsDeckTitle {...rest} lang={lang} localeKey={localeKey} />
    </MockJetsContextProvider>
  );
};

describe('JetsDeckTitle', () => {
  beforeEach(() => {
    useEnvironmentInfo.mockReturnValue({ isSafari: false });
  });

  it('should render the Deck number correctly (EN)', () => {
    setup({ number: '2' });
    expect(screen.getByText('Deck: 2')).toBeInTheDocument();
  });

  it('should not adjust scaling if it is not Safari browser', () => {
    const { container } = setup();

    const titleEl = container.querySelector(deckTitleSelector);

    expect(titleEl).toBeInTheDocument();
    expect(titleEl).toHaveStyle(`transform: scale(${mockAntiScale}) translateY(30px)`);
    expect(titleEl).not.toHaveStyle(`zoom: ${mockAntiScale}`);
  });

  it('should adjusts scaling if it is Safari and scaleType is zoom', () => {
    useEnvironmentInfo.mockReturnValue({ isSafari: true });

    const { container } = setup();

    const titleEl = container.querySelector(deckTitleSelector);

    expect(titleEl).toBeInTheDocument();
    expect(titleEl).not.toHaveStyle(`transform: scale(${mockAntiScale}) translateY(30px)`);
  });

  it('should not adjust scaling if Safari but scaleType is not zoom', () => {
    useEnvironmentInfo.mockReturnValue({ isSafari: true });

    const { container } = setup({
      contextProps: { ...defaultContextProps, config: { scaleType: SCALE_TYPES.SCALE } },
    });

    const titleEl = container.querySelector(deckTitleSelector);

    expect(titleEl).toBeInTheDocument();
    expect(titleEl).toHaveStyle(`transform: scale(${mockAntiScale}) translateY(30px)`);
    expect(titleEl).not.toHaveStyle(`zoom: ${mockAntiScale}`);
  });
});
