import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { MockJetsContextProvider } from '../../__mocks__/MockJetsContext';

import { JetsTooltipGlobal } from './index';
import { activeTooltipData, paramsData } from './__fixtures__';

const setup = ({ data = {}, config = {}, params = {}, events = {} } = {}) => ({
  user: userEvent.setup(),
  ...render(
    <MockJetsContextProvider config={config} params={{ ...paramsData(params) }} events={events}>
      <JetsTooltipGlobal data={{ ...activeTooltipData(data) }} />
    </MockJetsContextProvider>
  ),
});

describe('JetsTooltipGlobal', () => {
  describe('when a tooltip is rendered', () => {
    it('should apply the classes for horizontal layout when selected', async () => {
      setup({ params: { isHorizontal: true } });
      expect(screen.getByText(/33B/).closest('.jets-tooltip')).toHaveClass('horizontal');
    });

    it('should hide buttons when in hover mode', () => {
      setup({ params: { tooltipOnHover: true } });
      expect(screen.getByText(/33B/).closest('.jets-tooltip--body')).toHaveClass('no-buttons');
    });

    it('should display the correct seat row, class, and number provided', () => {
      setup();
      expect(screen.getByText(/Premium Economy 33B/)).toBeInTheDocument();
    });

    it('should set the correct text direction in the header', () => {
      setup({ params: { rightToLeft: true } });
      expect(screen.getByText(/33B/).closest('.jets-tooltip--header')).toHaveStyle('direction: rtl');
    });

    it('should display the correct price when provided', () => {
      setup();
      expect(screen.queryByText(/\$1234/)).not.toBeInTheDocument();

      setup({ data: { price: '$1234' } });
      expect(screen.getByText(/\$1234/)).toBeInTheDocument();
    });

    it('should display the correct passenger label based on the passenger data', () => {
      setup();
      expect(screen.queryByText(/Dave Smith/)).not.toBeInTheDocument();

      setup({ data: { passenger: { passengerLabel: 'Dave Smith' } } });
      expect(screen.getByText(/Dave Smith/)).toBeInTheDocument();
    });

    it('should display the fallback passenger label if there is passenger data but no passengerLabel', () => {
      setup({ data: { passenger: { id: '2' } } });
      expect(screen.getByText(/Passenger 2/)).toBeInTheDocument();
    });

    it('should display the restrictions label properly', () => {
      setup({ data: { passengerTypes: ['ADT'] } });
      expect(screen.getByText(/The seat is only for\: adults/)).toBeInTheDocument();

      setup({ data: { passengerTypes: ['CHD'] } });
      expect(screen.getByText(/The seat is only for\: children/)).toBeInTheDocument();

      setup({ data: { passengerTypes: ['INF'] } });
      expect(screen.getByText(/The seat is only for\: infants/)).toBeInTheDocument();

      setup({ data: { passengerTypes: ['ADT', 'INF'] } });
      expect(screen.getByText(/The seat is only for\: adults, infants/)).toBeInTheDocument();
    });

    it('should not apply all restriction labels at once', () => {
      setup({ data: { passengerTypes: ['ADT', 'CHD', 'INF'] } });
      expect(screen.queryByText(/The seat is only for/)).not.toBeInTheDocument();
    });

    it('should display the seat features value and icon properties for all features', () => {
      setup();

      expect(screen.getByText(/free on demand entertainment/)).toBeInTheDocument();
      expect(screen.getByTestId('audio_video')).toBeInTheDocument();
      expect(screen.getByText(/No underseat storage/)).toBeInTheDocument();
      expect(screen.getByTestId('no_storage')).toBeInTheDocument();
      expect(screen.getByText(/Exit row/)).toBeInTheDocument();
      expect(screen.getByTestId('exit_row')).toBeInTheDocument();
    });

    it('should display the seat feature title if no icon is available', () => {
      setup({
        data: {
          features: [
            {
              key: 'audioVideo',
              icon: null,
              title: 'Audio & Video On Demand',
              uniqId: '_jsjpt16',
              value: 'free on demand entertainment',
            },
          ],
        },
      });

      expect(screen.getByText(/Audio \& Video On Demand/)).toBeInTheDocument();
    });

    it('should set the correct text direction for features', () => {
      setup({ params: { rightToLeft: true } });
      expect(screen.getByTestId('audio_video').closest('.jets-tooltip--features')).toHaveStyle('direction: rtl');
    });

    it('should display the seat measurements provided', () => {
      setup();

      expect(screen.getByText(/Pitch/)).toBeInTheDocument();
      expect(screen.getByText(/101 cm/)).toBeInTheDocument();
      expect(screen.getByText(/Width/)).toBeInTheDocument();
      expect(screen.getByText(/49 cm/)).toBeInTheDocument();
      expect(screen.getByText(/Recline/)).toBeInTheDocument();
      expect(screen.getByText(/20 cm/)).toBeInTheDocument();
    });

    it('should render buttons with the correct class names', () => {
      setup();

      expect(screen.getByRole('button', { name: /Cancel/ })).toHaveClass('jets-btn jets-tooltip--btn');
      expect(screen.getByRole('button', { name: /Select/ })).toHaveClass('jets-btn jets-tooltip--btn');

      setup({ data: { passenger: { passengerLabel: 'Dave Smith' } } });
      expect(screen.getByRole('button', { name: /Unselect/ })).toHaveClass('jets-btn jets-tooltip--btn');
    });
  });

  describe('when a button in the tooltip is pressed', () => {
    it('should fire onSeatSelect when "Select" is pressed', async () => {
      const onSeatSelect = jest.fn();
      const { user } = setup({ events: { onSeatSelect } });

      await user.click(screen.getByText(/Select/));
      expect(onSeatSelect).toHaveBeenCalledTimes(1);
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

      await user.click(screen.getByText(/Unselect/));
      expect(onSeatUnselect).toHaveBeenCalledTimes(1);
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
    });
  });

  describe('when override classes are provided', () => {
    it('should apply the custom class to the feature', () => {
      setup({
        data: {
          features: [
            {
              key: 'customFeature',
              cssClass: 'custom-feature-class',
              title: 'Custom Feature',
              uniqId: '_customFeature1',
              value: 'Custom Value',
            },
          ],
        },
      });

      expect(screen.getByText(/Custom Feature/).closest('.jets-tooltip--feature')).toHaveClass('custom-feature-class');
    });
  });

  describe('when custom theme data is provided', () => {
    it('should apply custom theme colors to the tooltip', () => {
      setup({
        config: {
          colorTheme: {
            tooltipBackgroundColor: 'rgb(255, 255, 255)',
            tooltipBorderColor: 'rgb(0, 0, 0)',
            tooltipFontColor: 'rgb(0, 0, 0)',
            tooltipHeaderColor: 'rgb(0, 0, 0)',
          },
        },
      });

      const tooltip = screen.getByText(/33B/).closest('.jets-tooltip');

      expect(tooltip).toHaveStyle('background: rgb(255, 255, 255)');
      expect(tooltip).toHaveStyle('border-color: rgb(0, 0, 0)');
      expect(tooltip).toHaveStyle('color: rgb(0, 0, 0)');
      expect(screen.getByText(/33B/).closest('.jets-tooltip--header')).toHaveStyle('color: rgb(0, 0, 0)');
    });

    it('should apply custom theme colors to the measurement icons', () => {
      setup({
        config: {
          colorTheme: {
            tooltipIconBackgroundColor: 'rgb(255, 255, 255)',
            tooltipIconBorderColor: 'rgb(0, 0, 0)',
            tooltipIconColor: 'rgb(0, 0, 0)',
          },
        },
      });

      const icon = screen.getByTestId('pitch').closest('.svg_span');
      const iconWrapper = screen.getByTestId('pitch').closest('.jets-tooltip--measurement');

      expect(icon).toHaveStyle('fill: rgb(0, 0, 0)');
      expect(iconWrapper).toHaveStyle('border-color: rgb(0, 0, 0)');
      expect(iconWrapper).toHaveStyle('background: rgb(255, 255, 255)');
    });

    it('should apply custom theme colors to the buttons', () => {
      setup({
        config: {
          colorTheme: {
            tooltipSelectButtonTextColor: 'rgb(255, 255, 255)',
            tooltipSelectButtonBackgroundColor: 'rgb(0, 0, 0)',
            tooltipCancelButtonTextColor: 'rgb(255, 255, 255)',
            tooltipCancelButtonBackgroundColor: 'rgb(0, 0, 0)',
          },
        },
      });

      const selectButton = screen.getByText(/Select/).closest('.jets-btn');
      const cancelButton = screen.getByText(/Cancel/).closest('.jets-btn');

      expect(selectButton).toHaveStyle('color: rgb(255, 255, 255)');
      expect(selectButton).toHaveStyle('background-color: rgb(0, 0, 0)');
      expect(cancelButton).toHaveStyle('color: rgb(255, 255, 255)');
      expect(cancelButton).toHaveStyle('background-color: rgb(0, 0, 0)');
    });
  });

  describe('when a lang property is passed', () => {
    it('should display the correct localized label for buttons', () => {
      setup({ data: { lang: 'ES' } });

      expect(screen.getByText(/Cancelar/)).toBeInTheDocument();
      expect(screen.getByText(/Seleccionar/)).toBeInTheDocument();
    });

    it('should display the fallback passenger label if none passed (FR)', () => {
      setup({ data: { lang: 'FR', passenger: { id: '2' } } });
      expect(screen.getByText(/Passager 2/)).toBeInTheDocument();
    });
  });
});
