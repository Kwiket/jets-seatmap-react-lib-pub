import { render, screen } from '@testing-library/react';

import { MockJetsContextProvider } from '../../__mocks__/MockJetsContext';

import { JetsRow } from './index';

const DEFAULT_PROPS = {
  seats: [
    {
      price: 10,
      seatLabel: '1A',
      uniqId: '1A',
    },
  ],
  top: {},
};

const setup = ({ componentOverrides = {}, params = {}, props = DEFAULT_PROPS } = {}) => ({
  ...render(
    <MockJetsContextProvider componentOverrides={componentOverrides} config={props.config} params={params}>
      <JetsRow {...props} />
    </MockJetsContextProvider>
  ),
});

describe('JetsRow', () => {
  it('should render a custom seat component when supplied', () => {
    const customSeatComponent = () => <div>Custom Seat</div>;

    setup({
      componentOverrides: { JetsSeat: customSeatComponent },
      props: {
        ...DEFAULT_PROPS,
      },
    });

    expect(screen.queryByTestId('jets-seat')).toBeNull();
    expect(screen.getByText('Custom Seat')).toBeVisible();
  });
});
