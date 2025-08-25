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

const setup = ({ componentOverrides = {}, params = {}, props = DEFAULT_PROPS } = {}) => ({
  ...render(
    <MockJetsContextProvider componentOverrides={componentOverrides} config={props.config} params={params}>
      <JetsPlaneBody {...props} />
    </MockJetsContextProvider>
  ),
});

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
});
