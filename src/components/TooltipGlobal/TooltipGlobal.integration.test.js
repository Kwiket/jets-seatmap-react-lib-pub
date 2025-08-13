import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { MockJetsContextProvider } from '../../__mocks__/MockJetsContext';

import { JetsTooltipGlobal } from './index';
import { activeTooltipData } from './__fixtures__';

const setup = ({ data = {}, config = {}, params = {}, events = {} } = {}) => ({
  user: userEvent.setup(),
  ...render(
    <MockJetsContextProvider config={config} params={params} events={events}>
      <JetsTooltipGlobal data={{ ...activeTooltipData(data) }} />
    </MockJetsContextProvider>
  ),
});

describe('JetsTooltipGlobal', () => {
  describe('when a button in the tooltip is pressed', () => {
    it('should fire onSeatSelect when "Select" is pressed', async () => {
      const onSeatSelect = jest.fn();
      const { user } = setup({ events: { onSeatSelect } });

      // need to remove mocked functions from the expected object
      const expectedData = { ...activeTooltipData() };
      delete expectedData.seatmapElement;
      delete expectedData.seatNode;

      await user.click(screen.getByText(/Select/));
      expect(onSeatSelect).toHaveBeenCalledTimes(1);
      expect(onSeatSelect).toHaveBeenCalledWith(expect.objectContaining(expectedData));
    });

    it('should not fire onSeatSelect when seat selection is disabled and "Select" is pressed', async () => {
      const onSeatSelect = jest.fn();
      const { user } = setup({ events: { isSeatSelectDisabled: () => true, onSeatSelect } });

      await user.click(screen.getByText(/Select/));
      expect(onSeatSelect).not.toHaveBeenCalled();
    });

    it('should fire onSeatUnselect when "Unselect" is pressed', async () => {
      const onSeatUnselect = jest.fn();
      const { user } = setup({ data: { passenger: { passengerLabel: 'Dave Smith' } }, events: { onSeatUnselect } });

      // need to remove mocked functions from the expected object
      const expectedData = { ...activeTooltipData() };
      delete expectedData.seatmapElement;
      delete expectedData.seatNode;

      await user.click(screen.getByText(/Unselect/));
      expect(onSeatUnselect).toHaveBeenCalledTimes(1);
      expect(onSeatUnselect).toHaveBeenCalledWith(expect.objectContaining(expectedData));
    });

    it('should not fire onSeatUnselect when the passenger is readOnly and "Unselect" is pressed', async () => {
      const onSeatUnselect = jest.fn();
      const { user } = setup({
        data: { passenger: { passengerLabel: 'Dave Smith', readOnly: true } },
        events: { isSeatSelectDisabled: () => true, onSeatUnselect },
      });

      await user.click(screen.getByText(/Unselect/));
      expect(onSeatUnselect).not.toHaveBeenCalled();
    });

    it('should fire onTooltipClose when "Cancel" is pressed', async () => {
      const onTooltipClose = jest.fn();
      const { user } = setup({ events: { onTooltipClose } });

      await user.click(screen.getByText(/Cancel/));
      expect(onTooltipClose).toHaveBeenCalledTimes(1);
      expect(onTooltipClose).toHaveBeenCalledWith(
        null,
        null,
        expect.objectContaining({
          _reactName: 'onClick',
          bubbles: true,
          type: 'click',
        })
      );
    });
  });
});
