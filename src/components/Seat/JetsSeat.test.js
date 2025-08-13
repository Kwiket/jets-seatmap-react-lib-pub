import { render, screen } from '@testing-library/react';

import { MockJetsContextProvider } from '../../__mocks__/MockJetsContext';

import {
  seatDataFirst,
  seatDataBusiness,
  seatDataPremium,
  seatDataEconomy,
  seatDataAisle,
  seatDataEmpty,
  seatDataIndex,
} from './__fixtures__';
import { JetsSeat } from './index';

const setup = ({ data = {}, config = {}, params = {} } = {}) => ({
  ...render(
    <MockJetsContextProvider config={config} params={params}>
      <JetsSeat data={data} />
    </MockJetsContextProvider>
  ),
});

describe('JetsSeat', () => {
  describe('when any seat type is rendered', () => {
    it('should add the correct classes when available', () => {
      setup({ data: seatDataFirst() });

      const wrapper = screen.getByTestId('jets-seat');

      // jets-seat twice due to component naming and seatType data
      expect(wrapper).toHaveClass('jets-seat jets-seat jets-available');
    });

    it('should add the correct classes when unavailable', () => {
      setup({
        data: seatDataFirst({
          status: 'unavailable',
        }),
      });

      const wrapper = screen.getByTestId('jets-seat');

      // jets-seat twice due to component naming and seatType data
      expect(wrapper).toHaveClass('jets-seat jets-seat jets-unavailable');
    });

    it('should add the correct classes when selected', () => {
      setup({
        data: seatDataFirst({
          status: 'selected',
        }),
      });

      const wrapper = screen.getByTestId('jets-seat');

      // jets-seat twice due to component naming and seatType data
      expect(wrapper).toHaveClass('jets-seat jets-seat jets-selected');
    });

    it('should display the seat number with correct classes', () => {
      setup({ data: seatDataFirst() });

      const seatNumber = screen.getByText(/1A/);

      expect(seatNumber).toBeInTheDocument();
      expect(seatNumber).toHaveClass('jets-seat-number ST-23');
    });

    it('should apply the correct class based on seatIconType', () => {
      setup({
        data: seatDataFirst({
          seatIconType: '99',
        }),
      });

      expect(screen.getByText(/1A/)).toHaveClass('ST-99');
    });

    it('should render with the correct offset', () => {
      setup({ data: seatDataFirst() });

      const wrapper = screen.getByTestId('jets-seat');

      expect(wrapper).toHaveStyle({
        top: '0',
        left: '0',
      });
    });

    it('should render with the correct offset (non-zero values)', () => {
      setup({
        data: seatDataFirst({
          leftOffset: 125,
          topOffset: 4378,
        }),
      });

      const wrapper = screen.getByTestId('jets-seat');

      expect(wrapper).toHaveStyle({
        top: '4378px',
        left: '125px',
      });
    });

    it('should render supplied theme overrides', () => {
      const { container } = setup({
        config: {
          colorTheme: {
            defaultPassengerBadgeColor: 'rgb(0, 0, 0)',
            seatArmrestColor: 'cornflowerblue',
            seatStrokeColor: 'rgb(0, 0, 0)',
            seatStrokeWidth: 100,
          },
        },
        data: seatDataFirst({
          seatType: 'F-2',
        }),
      });

      const seatSVGPath = container.querySelector('.jets-seat-svg path:first-of-type');

      // seatStrokeColor
      expect(seatSVGPath).toHaveAttribute('stroke', 'rgb(0, 0, 0)');
      // seatStrokeWidth
      expect(seatSVGPath).toHaveAttribute('stroke-width', '100');

      const seatSVGRect = container.querySelector('.jets-seat-svg rect:first-of-type');

      // seatArmrestColor
      expect(seatSVGRect).toHaveAttribute('fill', 'cornflowerblue');
    });
  });

  describe('when a first class seat is rendered', () => {
    it('should render the seat', () => {
      setup({ data: seatDataFirst() });

      expect(screen.getByText(/1A/)).toBeInTheDocument();
    });

    it('should apply the correct class for ne rotation', () => {
      setup({
        data: seatDataFirst({
          rotation: 'ne',
        }),
      });

      const wrapper = screen.getByTestId('jets-seat');

      expect(wrapper).toHaveClass('jets-seat-r-ne');
    });

    it('should apply the correct class for sw rotation', () => {
      setup({
        data: seatDataFirst({
          rotation: 'sw',
        }),
      });

      const wrapper = screen.getByTestId('jets-seat');

      expect(wrapper).toHaveClass('jets-seat-r-sw');
    });

    it('should render with the correct dimensions', () => {
      setup({ data: seatDataFirst() });

      const wrapper = screen.getByTestId('jets-seat');

      expect(wrapper).toHaveStyle({
        width: '200px',
        height: '400px',
      });
    });
  });

  describe('when a business class seat is rendered', () => {
    it('should apply the correct class for ne rotation', () => {
      setup({
        data: seatDataBusiness({
          rotation: 'ne',
        }),
      });

      const wrapper = screen.getByTestId('jets-seat');

      expect(wrapper).toHaveClass('jets-seat-r-ne');
    });

    it('should apply the correct class for sw rotation', () => {
      setup({
        data: seatDataBusiness({
          rotation: 'sw',
        }),
      });

      const wrapper = screen.getByTestId('jets-seat');

      expect(wrapper).toHaveClass('jets-seat-r-sw');
    });

    it('should render with the correct dimensions', () => {
      setup({ data: seatDataBusiness() });

      const wrapper = screen.getByTestId('jets-seat');

      expect(wrapper).toHaveStyle({
        width: '185px',
        height: '175px',
      });
    });
  });

  describe('when a premium economy class seat is rendered', () => {
    it('should render with the correct dimensions', () => {
      setup({ data: seatDataPremium() });

      const wrapper = screen.getByTestId('jets-seat');

      expect(wrapper).toHaveStyle({
        width: '120px',
        height: '150px',
      });
    });
  });

  describe('when an economy class seat is rendered', () => {
    it('should render with the correct dimensions', () => {
      setup({ data: seatDataEconomy() });

      const wrapper = screen.getByTestId('jets-seat');

      expect(wrapper).toHaveStyle({
        width: '100px',
        height: '100px',
      });
    });
  });

  describe('when no seat is rendered', () => {
    // using the escape hatch as there is no other content to grab the rendered elements

    it('should render an aisle tile', () => {
      setup({ data: seatDataAisle() });
      const wrapper = screen.getByTestId('jets-seat');

      expect(wrapper).toBeInTheDocument();
      expect(wrapper).toHaveClass('jets-seat jets-aisle');
    });

    it('should apply the correct styles when in horizontal mode', () => {
      setup({
        config: {
          horizontal: true,
        },
        data: seatDataAisle(),
      });

      const wrapper = screen.getByTestId('jets-seat');

      expect(wrapper).toHaveStyle({
        transform: 'rotate(180deg)',
      });
    });

    it('should render an empty tile', () => {
      setup({ data: seatDataEmpty() });
      const wrapper = screen.getByTestId('jets-seat');

      expect(wrapper).toBeInTheDocument();
      expect(wrapper).toHaveClass('jets-seat jets-empty');
    });

    it('should render an index tile', () => {
      setup({ data: seatDataIndex() });
      const wrapper = screen.getByTestId('jets-seat');

      expect(wrapper).toBeInTheDocument();
      expect(wrapper).toHaveClass('jets-seat jets-index');
    });

    it('should render supplied theme overrides (index)', () => {
      setup({
        config: {
          colorTheme: {
            seatLabelColor: '#ff0000',
          },
        },
        data: seatDataIndex(),
      });

      const wrapper = screen.getByTestId('jets-seat-index');

      // seatLabelColor
      expect(wrapper).toHaveStyle({
        color: '#ff0000',
      });
    });
  });

  describe('when visibleSeatPriceLabels config is enabled', () => {
    it('should render the price when all data is supplied', () => {
      setup({
        config: { visibleSeatPriceLabels: true },
        data: seatDataFirst({
          priceValue: 100,
          currency: '$',
          price: 100,
        }),
      });

      expect(screen.getByText(/\$/)).toBeInTheDocument();
      expect(screen.getByText(/100/)).toBeInTheDocument();
    });

    it('should render a fallback label if currency is missing', () => {
      setup({
        config: { visibleSeatPriceLabels: true },
        data: seatDataFirst({
          priceValue: 100,
          price: 100,
        }),
      });

      expect(screen.getByText(/\*/)).toBeInTheDocument();
      expect(screen.getByText(/100/)).toBeInTheDocument();
    });

    it('should not render the price when price is missing', () => {
      setup({
        config: { visibleSeatPriceLabels: true },
        data: seatDataFirst({
          priceValue: 100,
          currency: '$',
        }),
      });

      expect(screen.queryByText(/\$/)).not.toBeInTheDocument();
      expect(screen.queryByText(/100/)).not.toBeInTheDocument();
    });
  });

  describe('when passenger information is passed', () => {
    it('should render the passenger badge', () => {
      setup({
        data: seatDataFirst({
          passenger: {
            abbr: 'DS',
            passengerLabel: 'Dave Smith',
          },
          size: {
            width: 100,
            height: 100,
          },
        }),
      });

      expect(screen.getByText(/DS/)).toBeInTheDocument();
    });

    it('should render the passenger badge with a default content when no abbr is available', () => {
      setup({
        data: seatDataFirst({
          passenger: {
            passengerLabel: 'Dave Smith',
          },
        }),
      });

      expect(screen.getByText(/P/)).toBeInTheDocument();
    });

    it('should render the passenger badge with a custom colour', () => {
      setup({
        data: seatDataFirst({
          passenger: {
            abbr: 'DS',
            passengerColor: 'hotpink',
            passengerLabel: 'Dave Smith',
          },
        }),
      });

      expect(screen.getByText(/DS/).closest('.jets-seat-passenger')).toHaveStyle({
        backgroundColor: 'hotpink',
      });
    });

    it('should apply the correct styles in horizontal mode', () => {
      setup({
        config: {
          horizontal: true,
        },
        data: seatDataFirst({
          passenger: {
            abbr: 'DS',
            passengerLabel: 'Dave Smith',
          },
        }),
      });

      expect(screen.getByText(/DS/)).toHaveStyle({
        transform: 'rotate(180deg)',
      });
    });

    it('should apply the correct styles in horizontal and rtl mode', () => {
      setup({
        config: {
          isHorizontal: true,
          rightToLeft: true,
        },
        data: seatDataFirst({
          passenger: {
            abbr: 'DS',
            passengerLabel: 'Dave Smith',
          },
        }),
      });

      expect(screen.getByText(/DS/)).not.toHaveStyle({
        transform: 'rotate(180deg)',
      });
    });

    it('should apply the correct styles in horizontal and rtl mode', () => {
      setup({
        config: {
          isHorizontal: true,
          rightToLeft: true,
        },
        data: seatDataFirst({
          passenger: {
            abbr: 'DS',
            passengerLabel: 'Dave Smith',
          },
        }),
      });

      expect(screen.getByText(/DS/)).not.toHaveStyle({
        transform: 'rotate(180deg)',
      });
    });
  });
});
