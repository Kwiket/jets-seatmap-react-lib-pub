import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { MockJetsContextProvider } from '../../__mocks__/MockJetsContext';

import {
  paramsData,
  seatDataFirst,
  seatDataBusiness,
  seatDataPremium,
  seatDataEconomy,
  seatDataAisle,
  seatDataEmpty,
} from './__fixtures__';
import { JetsSeat } from './index';

const setup = ({ data = {}, config = {}, params = {}, events = {} } = {}) => ({
  user: userEvent.setup(),
  ...render(
    <MockJetsContextProvider config={config} events={events} params={{ ...paramsData(params) }}>
      <JetsSeat data={data} />
    </MockJetsContextProvider>
  ),
});

describe('JetsSeat', () => {
  describe('when any seat type is rendered', () => {
    it('should add the correct classes', async () => {
      setup({ data: seatDataFirst() });

      const wrapper = screen.getByText(/1A/).closest('.jets-seat');

      // jets-seat twice due to component naming and seatType data
      expect(wrapper).toHaveClass('jets-seat jets-seat jets-available');
    });

    it('should display the seat number', async () => {
      setup({ data: seatDataFirst() });

      expect(screen.getByText(/1A/)).toBeInTheDocument();
    });

    it('should render with the correct offset', () => {
      setup({ data: seatDataFirst() });

      const wrapper = screen.getByText(/1A/).closest('.jets-seat');

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

      const wrapper = screen.getByText(/1A/).closest('.jets-seat');

      expect(wrapper).toHaveStyle({
        top: '4378px',
        left: '125px',
      });
    });

    it('should fire onClick handlers when clicked', async () => {
      const onSeatClick = jest.fn();

      const { user } = setup({
        data: seatDataFirst(),
        events: { onSeatClick },
      });

      await user.click(screen.getByText(/1A/));
      expect(onSeatClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('when hover mode is turned on', () => {
    it('should fire onMouseEnter and onMouseLeave handlers', async () => {
      const showTooltip = jest.fn();
      const onTooltipClose = jest.fn();

      const { user } = setup({
        data: seatDataFirst(),
        events: { onTooltipClose, showTooltip },
        params: { tooltipOnHover: true },
      });

      await user.hover(screen.getByText(/1A/));
      expect(showTooltip).toHaveBeenCalledTimes(1);
    });
  });

  describe('when a first class seat is rendered', () => {
    it('should render the seat', () => {
      setup({ data: seatDataFirst() });

      expect(screen.getByText(/1A/)).toBeInTheDocument();
    });

    it('should apply the correct class for ne rotation', async () => {
      setup({
        data: seatDataFirst({
          rotation: 'ne',
        }),
      });

      const wrapper = screen.getByText(/1A/).closest('.jets-seat');

      expect(wrapper).toHaveClass('jets-seat-r-ne');
    });

    it('should apply the correct class for sw rotation', async () => {
      setup({
        data: seatDataFirst({
          rotation: 'sw',
        }),
      });

      const wrapper = screen.getByText(/1A/).closest('.jets-seat');

      expect(wrapper).toHaveClass('jets-seat-r-sw');
    });

    it('should render with the correct dimensions', () => {
      setup({ data: seatDataFirst() });

      const wrapper = screen.getByText(/1A/).closest('.jets-seat');

      expect(wrapper).toHaveStyle({
        width: '200px',
        height: '400px',
      });
    });
  });

  describe('when a business class seat is rendered', () => {
    it('should apply the correct class for ne rotation', async () => {
      setup({
        data: seatDataBusiness({
          rotation: 'ne',
        }),
      });

      const wrapper = screen.getByText(/7A/).closest('.jets-seat');

      expect(wrapper).toHaveClass('jets-seat-r-ne');
    });

    it('should apply the correct class for sw rotation', async () => {
      setup({
        data: seatDataBusiness({
          rotation: 'sw',
        }),
      });

      const wrapper = screen.getByText(/7A/).closest('.jets-seat');

      expect(wrapper).toHaveClass('jets-seat-r-sw');
    });

    it('should render with the correct dimensions', () => {
      setup({ data: seatDataBusiness() });

      const wrapper = screen.getByText(/7A/).closest('.jets-seat');

      expect(wrapper).toHaveStyle({
        width: '185px',
        height: '175px',
      });
    });
  });

  describe('when a premium economy class seat is rendered', () => {
    it('should render with the correct dimensions', () => {
      setup({ data: seatDataPremium() });

      const wrapper = screen.getByText(/33A/).closest('.jets-seat');

      expect(wrapper).toHaveStyle({
        width: '120px',
        height: '150px',
      });
    });
  });

  describe('when an economy class seat is rendered', () => {
    it('should render with the correct dimensions', () => {
      setup({ data: seatDataEconomy() });

      const wrapper = screen.getByText(/53A/).closest('.jets-seat');

      expect(wrapper).toHaveStyle({
        width: '100px',
        height: '100px',
      });
    });
  });

  describe('when no seat is rendered', () => {
    // using the escape hatch as there is no other content to grab the rendered elements

    it('should render an aisle tile', () => {
      const { container } = setup({ data: seatDataAisle() });
      const wrapper = container.querySelector('.jets-seat');

      expect(wrapper).toBeInTheDocument();
      expect(wrapper).toHaveClass('jets-aisle');
    });

    it('should render an empty tile', () => {
      const { container } = setup({ data: seatDataEmpty() });
      const wrapper = container.querySelector('.jets-seat');

      expect(wrapper).toBeInTheDocument();
      expect(wrapper).toHaveClass('jets-empty');
    });
  });

  describe('when visibleSeatPriceLabels config is enabled', () => {
    it('should render the price when all data is supplied', () => {
      setup({
        config: { visibleSeatPriceLabels: true },
        data: seatDataFirst({
          cost: 100,
          currency: '$',
          price: 100,
        }),
      });

      expect(screen.getByText(/\$/)).toBeInTheDocument();
      expect(screen.getByText(/100/)).toBeInTheDocument();
    });

    it('should render a fallback label is currency is missing', () => {
      setup({
        config: { visibleSeatPriceLabels: true },
        data: seatDataFirst({
          cost: 100,
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
          cost: 100,
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
            abbr: 'DS',
            passengerLabel: 'Dave Smith',
          },
        }),
      });

      expect(screen.getByText(/DS/)).toBeInTheDocument();
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
  });
});
