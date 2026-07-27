import { render } from '@testing-library/react';

import { MockJetsContextProvider } from '../../__mocks__/MockJetsContext';
import { seatDataPremium, seatDataEconomy, seatDataAisle } from '../Seat/__fixtures__';
import { JetsSeatList } from './index';

let axe, toHaveNoViolations;
try {
  // eslint-disable-next-line global-require
  ({ axe, toHaveNoViolations } = require('jest-axe'));
} catch (e) {
  // jest-axe not installed in this environment — the suite skips.
}
const describeAxe = axe ? describe : describe.skip;
if (toHaveNoViolations) expect.extend({ toHaveNoViolations });

const row = (overrides = {}) => ({
  uniqId: '_row33',
  number: 33,
  classCode: 'P',
  seats: [seatDataPremium()],
  ...overrides,
});

const deck = (overrides = {}) => ({
  uniqId: '_deck1',
  rows: [row()],
  ...overrides,
});

const setup = ({ content = [deck()], lang = 'EN', config = {}, events = {} } = {}) => ({
  ...render(
    <MockJetsContextProvider config={config} events={events}>
      <JetsSeatList content={content} lang={lang} />
    </MockJetsContextProvider>
  ),
});

describeAxe('JetsSeatList axe a11y', () => {
  it('renders a semantic table with mixed seat statuses and no axe violations', async () => {
    const content = [
      deck({
        rows: [
          row({
            seats: [
              seatDataPremium({ number: '33A', status: 'available' }),
              seatDataAisle(),
              seatDataEconomy({ number: '33B', uniqId: '_seat33b', status: 'unavailable' }),
            ],
          }),
          row({
            uniqId: '_row34',
            number: 34,
            seats: [
              seatDataEconomy({
                number: '34A',
                status: 'selected',
                passenger: { id: 'p1', passengerLabel: 'John Doe' },
              }),
            ],
          }),
        ],
      }),
    ];

    const { container } = setup({ content });

    const results = await axe(container, { rules: { 'color-contrast': { enabled: false } } });
    expect(results).toHaveNoViolations();
  });
});
