import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { MockJetsContextProvider } from '../../__mocks__/MockJetsContext';

import { seatDataFirst } from './__fixtures__';
import { JetsSeat } from './index';

const setup = ({ data = {}, config = {}, params = {}, events = {} } = {}) => ({
  user: userEvent.setup(),
  ...render(
    <MockJetsContextProvider config={config} events={events} params={params}>
      <JetsSeat data={data} />
    </MockJetsContextProvider>
  ),
});

describe('JetsSeat', () => {
  describe('when any seat type is rendered', () => {
    it('should not trigger handlers to scroll to the seat by default', () => {
      const mockScrollIntoView = jest.fn();
      const resetSeatJumpTo = jest.fn();
      const showTooltip = jest.fn();

      window.HTMLElement.prototype.scrollIntoView = mockScrollIntoView;

      setup({
        data: seatDataFirst(),
        events: { resetSeatJumpTo, showTooltip },
      });

      expect(mockScrollIntoView).not.toHaveBeenCalled();
      expect(showTooltip).not.toHaveBeenCalled();
      expect(resetSeatJumpTo).not.toHaveBeenCalled();
    });

    it('should not trigger onMouseEnter and onMouseLeave handlers by default', async () => {
      const showTooltip = jest.fn();
      const onTooltipClose = jest.fn();

      const { user } = setup({
        data: seatDataFirst(),
        events: { onTooltipClose, showTooltip },
      });

      const wrapper = screen.getByText(/1A/);

      await user.hover(wrapper);
      expect(showTooltip).not.toHaveBeenCalled();

      await user.unhover(wrapper);
      expect(onTooltipClose).not.toHaveBeenCalled();
    });

    it('should trigger onClick handlers when clicked', async () => {
      const onSeatClick = jest.fn();

      const { user } = setup({
        data: seatDataFirst(),
        events: { onSeatClick },
      });

      await user.click(screen.getByText(/1A/));
      expect(onSeatClick).toHaveBeenCalledTimes(1);
      expect(onSeatClick).toHaveBeenCalledWith(seatDataFirst(), expect.any(Object), expect.any(Object));
    });
  });

  describe('when hover mode is turned on', () => {
    it('should trigger onMouseEnter and onMouseLeave handlers when the seat is hovered and unhovered', async () => {
      const showTooltip = jest.fn();
      const onTooltipClose = jest.fn();

      const { user } = setup({
        data: seatDataFirst(),
        events: { onTooltipClose, showTooltip },
        config: { tooltipOnHover: true },
      });

      const wrapper = screen.getByText(/1A/);

      await user.hover(wrapper);
      expect(showTooltip).toHaveBeenCalledTimes(1);
      expect(showTooltip).toHaveBeenCalledWith(seatDataFirst(), expect.any(Object), expect.any(Object));

      await user.unhover(wrapper);
      expect(onTooltipClose).toHaveBeenCalledTimes(1);
      expect(onTooltipClose).toHaveBeenCalledWith(seatDataFirst(), expect.any(Object), expect.any(Object));
    });
  });

  describe('when a seat label is specified to jump to', () => {
    it('should trigger handlers to scroll to the seat and show the tooltip', () => {
      const mockScrollIntoView = jest.fn();
      const resetSeatJumpTo = jest.fn();
      const showTooltip = jest.fn();

      window.HTMLElement.prototype.scrollIntoView = mockScrollIntoView;

      setup({
        data: seatDataFirst(),
        events: { resetSeatJumpTo, showTooltip, seatLabelJumpTo: '1A' },
      });

      expect(mockScrollIntoView).toHaveBeenCalledTimes(1);
      expect(showTooltip).toHaveBeenCalledTimes(1);
      expect(showTooltip).toHaveBeenCalledWith(seatDataFirst(), expect.any(Object), { nativeEvent: null });
      expect(resetSeatJumpTo).toHaveBeenCalledTimes(1);
    });
  });
});
