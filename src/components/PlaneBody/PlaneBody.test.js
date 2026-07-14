import { render, screen } from '@testing-library/react';

import { MockJetsContextProvider } from '../../__mocks__/MockJetsContext';

import { JetsPlaneBody } from './index';

const DEFAULT_PROPS = {
  activeDeck: 0,
  content: [],
  exits: [],
  bulks: [],
  isSeatMapInited: true,
  showOneDeck: false,
  config: {},
};

const setup = ({ componentOverrides = {}, params = {}, props = DEFAULT_PROPS, wcagFlags } = {}) => ({
  ...render(
    <MockJetsContextProvider
      componentOverrides={componentOverrides}
      config={props.config}
      params={params}
      wcagFlags={wcagFlags}
    >
      <JetsPlaneBody {...props} />
    </MockJetsContextProvider>
  ),
});

const ONE_DECK_PROPS = {
  ...DEFAULT_PROPS,
  content: [{ uniqId: 'deck-1', number: 1, height: 100, width: 100, rows: [], wingsInfo: {} }],
};

describe('JetsPlaneBody', () => {
  it('should render the loading component when initialised', () => {
    setup({
      props: {
        ...DEFAULT_PROPS,
        isSeatMapInited: false,
      },
    });

    expect(screen.getByTestId('jets-not-init')).toBeVisible();
  });

  it('should render a custom loading component when supplied', () => {
    const customLoadingComponent = () => <div>Custom Loading</div>;

    setup({
      componentOverrides: { JetsNotInit: customLoadingComponent },
      props: {
        ...DEFAULT_PROPS,
        isSeatMapInited: false,
      },
    });

    expect(screen.queryByTestId('jets-not-init')).toBeNull();
    expect(screen.getByText('Custom Loading')).toBeVisible();
  });

  it('does not emit data-deck-index on the deck wrapper when WCAG is off (zero-change)', () => {
    setup({
      props: ONE_DECK_PROPS,
      wcagFlags: { gridSemantics: false },
    });

    expect(screen.getAllByTestId('jets-plane-body-deck')[0]).not.toHaveAttribute('data-deck-index');
  });

  it('emits data-deck-index on the deck wrapper when gridSemantics is on', () => {
    setup({
      props: ONE_DECK_PROPS,
      wcagFlags: { gridSemantics: true },
    });

    expect(screen.getAllByTestId('jets-plane-body-deck')[0]).toHaveAttribute('data-deck-index', '0');
  });
});
