import React from 'react';
import { render } from '@testing-library/react';
import { JetsContext } from '../../common';
import { JetsSeat } from './JetsSeat';

let axe, toHaveNoViolations;
try {
  // eslint-disable-next-line global-require
  ({ axe, toHaveNoViolations } = require('jest-axe'));
} catch (e) {
  // jest-axe not installed in this environment — the suite skips.
}
const describeAxe = axe ? describe : describe.skip;
if (toHaveNoViolations) expect.extend({ toHaveNoViolations });

const baseCtx = {
  onSeatClick: jest.fn(),
  showTooltip: jest.fn(),
  onTooltipClose: jest.fn(),
  resetSeatJumpTo: jest.fn(),
  seatLabelJumpTo: null,
  params: { tooltipOnHover: false, antiRotation: '', antiScale: 1, isHorizontal: false },
  config: { lang: 'EN', visibleSeatPriceLabels: false },
  colorTheme: {
    defaultPassengerBadgeColor: '#fff',
    defaultPassengerBadgeLabelColor: '#000',
    defaultPassengerBadgeBorderColor: '#000',
    seatStrokeColor: '#000',
    seatArmrestColor: '#ccc',
    seatStrokeWidth: 1,
    seatLabelColor: '#000',
  },
};

const seatData = (over = {}) => ({
  uniqId: 's1',
  letter: 'A',
  type: 'seat',
  status: 'available',
  size: { width: 30, height: 30 },
  number: '14C',
  seatType: 'E-1',
  seatIconType: 1,
  topOffset: 0,
  leftOffset: 0,
  ...over,
});

const renderSeat = (data, ctx) =>
  render(
    <JetsContext.Provider value={ctx}>
      <JetsSeat data={data} colIndex={3} rowIndex={14} rowSeats={[data]} />
    </JetsContext.Provider>
  );

describeAxe('JetsSeat axe a11y', () => {
  it('renders an available seat as a gridcell button with no axe violations when gridSemantics is on', async () => {
    const { container } = renderSeat(seatData({ price: 12, currency: '€' }), {
      ...baseCtx,
      wcagFlags: { gridSemantics: true, keyboardNavigation: true },
    });

    const results = await axe(container, { rules: { 'color-contrast': { enabled: false } } });
    expect(results).toHaveNoViolations();
  });

  it('renders an unavailable (aria-disabled) seat with no axe violations', async () => {
    const { container } = renderSeat(seatData({ status: 'unavailable' }), {
      ...baseCtx,
      wcagFlags: { gridSemantics: true, keyboardNavigation: true },
    });

    const results = await axe(container, { rules: { 'color-contrast': { enabled: false } } });
    expect(results).toHaveNoViolations();
  });
});
