import { queryHelpers, render, screen, fireEvent } from '@testing-library/react';

import { MockJetsContextProvider } from '../../__mocks__/MockJetsContext';

import { JetsTooltipGlobal } from './index';

import { activeTooltipData, paramsData } from './__fixtures__';
import { userEvent } from '@storybook/testing-library';

const setup = ({ data = {}, config = {}, params = {}, events = {} } = {}) => {
  render(
    <MockJetsContextProvider config={config} params={{ ...paramsData(params) }} events={events}>
      <JetsTooltipGlobal data={{ ...activeTooltipData(data) }} />
    </MockJetsContextProvider>
  );
};

describe('JetsTooltipGlobal', () => {
  // General content and functionality
  it('applies classes for horizontal layout', async () => {
    setup({ params: { isHorizontal: true } });
    expect(screen.getByText(/33B/).closest('.jets-tooltip')).toHaveClass('horizontal');
  });

  it('hides buttons when in hover mode', () => {
    setup({ params: { tooltipOnHover: true } });
    expect(screen.getByText(/33B/).closest('.jets-tooltip--body')).toHaveClass('no-buttons');
  });

  it('displays the correct seat row, class, and number', () => {
    setup();
    expect(screen.getByText(/Premium Economy 33B/)).toBeInTheDocument();
  });

  it('sets the correct text direction in the header', () => {
    setup({ params: { rightToLeft: true } });
    expect(screen.getByText(/33B/).closest('.jets-tooltip--header')).toHaveStyle('direction: rtl');
  });

  it('displays the correct price when available', () => {
    setup();
    expect(screen.queryByText(/\$1234/)).not.toBeInTheDocument();

    setup({ data: { price: '$1234' } });
    expect(screen.getByText(/\$1234/)).toBeInTheDocument();
  });

  it('displays the correct passenger label from data', () => {
    setup();
    expect(screen.queryByText(/Dave Smith/)).not.toBeInTheDocument();

    setup({ data: { passenger: { passengerLabel: 'Dave Smith' } } });
    expect(screen.getByText(/Dave Smith/)).toBeInTheDocument();
  });

  it('displays the fallback passenger label if none passed', () => {
    setup({ data: { passenger: { id: '2' } } });
    expect(screen.getByText(/Passenger 2/)).toBeInTheDocument();
  });

  it('applies the correct restriction label', () => {
    setup({ data: { passengerTypes: ['ADT'] } });
    expect(screen.getByText(/The seat is only for\: adults/)).toBeInTheDocument();

    setup({ data: { passengerTypes: ['CHD'] } });
    expect(screen.getByText(/The seat is only for\: children/)).toBeInTheDocument();

    setup({ data: { passengerTypes: ['INF'] } });
    expect(screen.getByText(/The seat is only for\: infants/)).toBeInTheDocument();

    setup({ data: { passengerTypes: ['ADT', 'INF'] } });
    expect(screen.getByText(/The seat is only for\: adults, infants/)).toBeInTheDocument();
  });

  it('does not apply all restriction labels at once', () => {
    setup({ data: { passengerTypes: ['ADT', 'CHD', 'INF'] } });
    expect(screen.queryByText(/The seat is only for/)).not.toBeInTheDocument();
  });

  it('displays the seat features value and icon', () => {
    setup();

    expect(screen.getByText(/free on demand entertainment/)).toBeInTheDocument();
    expect(screen.getByTestId('audio_video')).toBeInTheDocument();
    expect(screen.getByText(/No underseat storage/)).toBeInTheDocument();
    expect(screen.getByTestId('no_storage')).toBeInTheDocument();
    expect(screen.getByText(/Exit row/)).toBeInTheDocument();
    expect(screen.getByTestId('exit_row')).toBeInTheDocument();
  });

  it('displays the seat feature title if no icon is available', () => {
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

  it('sets the correct text direction for features', () => {
    setup({ params: { rightToLeft: true } });
    expect(screen.getByTestId('audio_video').closest('.jets-tooltip--features')).toHaveStyle('direction: rtl');
  });

  it('displays the seat measurements', () => {
    setup();

    expect(screen.getByText(/Pitch/)).toBeInTheDocument();
    expect(screen.getByText(/101 cm/)).toBeInTheDocument();
    expect(screen.getByText(/Width/)).toBeInTheDocument();
    expect(screen.getByText(/49 cm/)).toBeInTheDocument();
    expect(screen.getByText(/Recline/)).toBeInTheDocument();
    expect(screen.getByText(/20 cm/)).toBeInTheDocument();
  });

  it('fires onSeatSelect when Select is clicked', () => {
    const onSeatSelect = jest.fn();

    setup({ events: { onSeatSelect } });

    userEvent.click(screen.getByText(/Select/));
    expect(onSeatSelect).toHaveBeenCalledTimes(1);
  });

  it('does not fire onSeatSelect when selection is disabled', () => {
    const onSeatSelect = jest.fn();

    setup({ events: { isSeatSelectDisabled: () => true, onSeatSelect } });

    userEvent.click(screen.getByText(/Select/));
    expect(onSeatSelect).not.toHaveBeenCalled();
  });

  it('fires onSeatUnselect when Unselect is clicked', () => {
    const onSeatUnselect = jest.fn();

    setup({ data: { passenger: { passengerLabel: 'Dave Smith' } }, events: { onSeatUnselect } });

    userEvent.click(screen.getByText(/Unselect/));
    expect(onSeatUnselect).toHaveBeenCalledTimes(1);
  });

  it('does not fire onSeatUnselect when passenger is readOnly', () => {
    const onSeatUnselect = jest.fn();

    setup({
      data: { passenger: { passengerLabel: 'Dave Smith', readOnly: true } },
      events: { isSeatSelectDisabled: () => true, onSeatUnselect },
    });

    userEvent.click(screen.getByText(/Unselect/));
    expect(onSeatUnselect).not.toHaveBeenCalled();
  });

  it('fires onTooltipClose when Cancel is clicked', () => {
    const onTooltipClose = jest.fn();

    setup({ events: { onTooltipClose } });

    userEvent.click(screen.getByText(/Cancel/));
    expect(onTooltipClose).toHaveBeenCalledTimes(1);
  });

  // Class overrides
  it('applies custom class to the feature', () => {
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

  // Theme overrides
  it('applies custom theme colors to the tooltip', () => {
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

  it('applies custom theme colors to the measurement icons', () => {
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

  it('applies custom theme colors to the buttons', () => {
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

  // Locales
  it('displays the correct localized text for buttons', () => {
    setup({ data: { lang: 'ES' } });

    expect(screen.getByText(/Cancelar/)).toBeInTheDocument();
    expect(screen.getByText(/Seleccionar/)).toBeInTheDocument();
  });

  it('displays the fallback passenger label if none passed (FR)', () => {
    setup({ data: { lang: 'FR', passenger: { id: '2' } } });
    expect(screen.getByText(/Passager 2/)).toBeInTheDocument();
  });
});
