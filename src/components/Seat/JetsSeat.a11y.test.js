import React from 'react';
import { render, screen } from '@testing-library/react';
import { JetsContext } from '../../common';
import { JetsSeat } from './JetsSeat';

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

describe('JetsSeat WCAG grid semantics', () => {
  it('renders a plain div with no ARIA when gridSemantics is off (zero-change)', () => {
    renderSeat(seatData(), { ...baseCtx, wcagFlags: { gridSemantics: false, keyboardNavigation: false } });
    const el = screen.getByTestId('jets-seat');
    expect(el.tagName).toBe('DIV');
    expect(el).not.toHaveAttribute('role');
    expect(el).not.toHaveAttribute('aria-label');
    expect(el).not.toHaveAttribute('tabindex');
  });

  it('renders a gridcell button with an accessible name when gridSemantics is on', () => {
    renderSeat(seatData({ price: 12, currency: '€' }), {
      ...baseCtx,
      wcagFlags: { gridSemantics: true, keyboardNavigation: false },
    });
    const el = screen.getByTestId('jets-seat');
    expect(el.tagName).toBe('BUTTON');
    expect(el).toHaveAttribute('role', 'gridcell');
    expect(el).toHaveAttribute('aria-colindex', '3');
    expect(el).toHaveAttribute('aria-rowindex', '14');
    expect(el).toHaveAttribute('aria-label', expect.stringContaining('14C'));
    expect(el).toHaveAttribute('aria-selected', 'false');
    expect(el).toHaveAttribute('tabindex', '0'); // gridSemantics on, keyboardNavigation off -> seat is a tab stop
  });

  it('marks an unavailable seat aria-disabled and omits aria-selected', () => {
    renderSeat(seatData({ status: 'unavailable' }), {
      ...baseCtx,
      wcagFlags: { gridSemantics: true, keyboardNavigation: false },
    });
    const el = screen.getByTestId('jets-seat');
    expect(el).toHaveAttribute('aria-disabled', 'true');
    expect(el).not.toHaveAttribute('aria-selected');
  });

  it('does not activate an unavailable seat on click', () => {
    const onSeatClick = jest.fn();
    renderSeat(seatData({ status: 'unavailable' }), {
      ...baseCtx,
      onSeatClick,
      wcagFlags: { gridSemantics: true, keyboardNavigation: false },
    });
    screen.getByTestId('jets-seat').click();
    expect(onSeatClick).not.toHaveBeenCalled();
  });

  it('renders an aisle cell as a non-button gridcell with tabindex -1', () => {
    renderSeat(seatData({ type: 'aisle', number: undefined, seatType: undefined }), {
      ...baseCtx,
      wcagFlags: { gridSemantics: true, keyboardNavigation: false },
    });
    const el = screen.getByTestId('jets-seat');
    expect(el.tagName).toBe('DIV');
    expect(el).toHaveAttribute('role', 'gridcell');
    expect(el).toHaveAttribute('tabindex', '-1');
    expect(el).toHaveAttribute('aria-label');
  });
});
