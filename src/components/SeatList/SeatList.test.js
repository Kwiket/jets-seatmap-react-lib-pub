import { render, screen, fireEvent, within } from '@testing-library/react';

import { MockJetsContextProvider } from '../../__mocks__/MockJetsContext';
import { seatDataPremium, seatDataEconomy, seatDataAisle } from '../Seat/__fixtures__';
import { JetsSeatList } from './index';

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

describe('JetsSeatList', () => {
  it('renders a semantic table with one row per real seat, excluding non-seat cells', () => {
    const content = [
      deck({
        rows: [
          row({ seats: [seatDataPremium({ number: '33A' }), seatDataAisle()] }),
          row({ uniqId: '_row34', number: 34, seats: [seatDataEconomy({ number: '34A' })] }),
        ],
      }),
    ];

    setup({ content });

    const table = screen.getByRole('table');
    expect(table).toHaveTextContent('33A');
    expect(table).toHaveTextContent('34A');

    // Only real seats get rows — the aisle cell does not appear as a row.
    const bodyRows = within(table).getAllByRole('row');
    // header row + 2 seat rows
    expect(bodyRows).toHaveLength(3);
  });

  it('renders localized column headers', () => {
    setup();

    expect(screen.getByRole('columnheader', { name: 'Row' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Seat' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Cabin' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Position' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Action' })).toBeInTheDocument();
  });

  it('clicking Select on an available seat calls onSeatSelect from JetsContext', () => {
    const onSeatSelect = jest.fn();
    const content = [deck({ rows: [row({ seats: [seatDataPremium({ number: '33A', status: 'available' })] })] })];

    setup({ content, events: { onSeatSelect, isSeatSelectDisabled: () => false } });

    fireEvent.click(screen.getByRole('button', { name: 'Select' }));

    expect(onSeatSelect).toHaveBeenCalledTimes(1);
    expect(onSeatSelect).toHaveBeenCalledWith(expect.objectContaining({ number: '33A' }));
  });

  it('clicking Unselect on a seat with a passenger calls onSeatUnselect from JetsContext', () => {
    const onSeatUnselect = jest.fn();
    const content = [
      deck({
        rows: [
          row({
            seats: [
              seatDataPremium({
                number: '33A',
                status: 'selected',
                passenger: { id: 'p1', passengerLabel: 'John Doe' },
              }),
            ],
          }),
        ],
      }),
    ];

    setup({ content, events: { onSeatUnselect } });

    fireEvent.click(screen.getByRole('button', { name: 'Unselect' }));

    expect(onSeatUnselect).toHaveBeenCalledTimes(1);
    expect(onSeatUnselect).toHaveBeenCalledWith(expect.objectContaining({ number: '33A' }));
  });

  it('renders a disabled button for unavailable seats and does not call onSeatSelect', () => {
    const onSeatSelect = jest.fn();
    const content = [deck({ rows: [row({ seats: [seatDataPremium({ number: '33A', status: 'unavailable' })] })] })];

    setup({ content, events: { onSeatSelect } });

    const button = screen.getByRole('button', { name: 'Unavailable' });
    expect(button).toBeDisabled();
  });

  it('shows the price on the action button for a paid seat', () => {
    const content = [
      deck({ rows: [row({ seats: [seatDataPremium({ number: '33A', status: 'available', price: '€ 25', priceValue: 25 })] })] }),
    ];

    setup({ content, events: { isSeatSelectDisabled: () => false } });

    expect(screen.getByRole('button', { name: '€ 25' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Select' })).not.toBeInTheDocument();
  });

  it('shows a plain "Select" button for a free (unpriced) seat', () => {
    const content = [
      deck({ rows: [row({ seats: [seatDataPremium({ number: '33A', status: 'available', price: '€ 0', priceValue: 0 })] })] }),
    ];

    setup({ content, events: { isSeatSelectDisabled: () => false } });

    expect(screen.getByRole('button', { name: 'Select' })).toBeInTheDocument();
  });

  it('tags the secondary columns so CSS can drop them on a narrow width', () => {
    setup();
    const table = screen.getByRole('table');
    expect(table.querySelector('th.jets-seat-list__col-cabin')).toBeInTheDocument();
    expect(table.querySelector('th.jets-seat-list__col-position')).toBeInTheDocument();
    expect(table.querySelector('td.jets-seat-list__col-cabin')).toBeInTheDocument();
  });

  it('shows no deck filter for a single-deck aircraft', () => {
    setup();
    expect(screen.queryByRole('combobox', { name: 'Deck' })).not.toBeInTheDocument();
  });

  it('renders a deck filter for a multi-deck aircraft and filters rows by deck', () => {
    const content = [
      deck({ uniqId: '_deck1', rows: [row({ seats: [seatDataPremium({ number: '33A' })] })] }),
      deck({ uniqId: '_deck2', rows: [row({ uniqId: '_row50', number: 50, seats: [seatDataEconomy({ number: '50A' })] })] }),
    ];

    setup({ content });

    const deckSelect = screen.getByRole('combobox', { name: 'Deck' });
    // Default 'All decks' shows both decks' seats.
    expect(screen.getByRole('table')).toHaveTextContent('33A');
    expect(screen.getByRole('table')).toHaveTextContent('50A');

    // Filtering to the second deck (index 1) drops the first deck's seat.
    fireEvent.change(deckSelect, { target: { value: '1' } });
    expect(screen.getByRole('table')).not.toHaveTextContent('33A');
    expect(screen.getByRole('table')).toHaveTextContent('50A');
  });

  it('exposes a select-disabled reason via aria-label, not a native title tooltip', () => {
    const content = [deck({ rows: [row({ seats: [seatDataPremium({ number: '33A', status: 'available' })] })] })];

    setup({
      content,
      events: {
        isSeatSelectDisabled: () => true,
        getSelectDisabledReason: () => 'Not available for infants',
      },
    });

    const button = screen.getByRole('button', { name: 'Select, Not available for infants' });
    expect(button).toBeDisabled();
    expect(button).not.toHaveAttribute('title');
  });

  it('filters seats by position (window)', () => {
    // Three-seat row: first/last are 'window', the middle one is neither
    // window nor aisle-adjacent (computeSeatPosition → 'middle').
    const content = [
      deck({
        rows: [
          row({
            seats: [
              seatDataPremium({ number: '33A' }),
              seatDataPremium({ number: '33B', uniqId: '_seat33b' }),
              seatDataPremium({ number: '33C', uniqId: '_seat33c' }),
            ],
          }),
        ],
      }),
    ];

    setup({ content });

    const table = screen.getByRole('table');
    expect(table).toHaveTextContent('33A');
    expect(table).toHaveTextContent('33B');
    expect(table).toHaveTextContent('33C');

    fireEvent.change(screen.getByLabelText('Position'), { target: { value: 'window' } });

    expect(table).toHaveTextContent('33A');
    expect(table).toHaveTextContent('33C');
    expect(table).not.toHaveTextContent('33B');
  });

  it('sorts seats by price when a priced seat exists', () => {
    const content = [
      deck({
        rows: [
          row({
            seats: [
              seatDataPremium({ number: '33A', price: 'EUR 20', priceValue: 20 }),
              seatDataPremium({ number: '33B', uniqId: '_seat33b', price: 'EUR 5', priceValue: 5 }),
            ],
          }),
        ],
      }),
    ];

    setup({ content });

    fireEvent.change(screen.getByLabelText('Sort by'), { target: { value: 'priceAsc' } });

    const cells = screen.getAllByRole('cell').map(c => c.textContent);
    const firstSeatIndex = cells.indexOf('33B');
    const secondSeatIndex = cells.indexOf('33A');
    expect(firstSeatIndex).toBeGreaterThan(-1);
    expect(secondSeatIndex).toBeGreaterThan(firstSeatIndex);
  });
});
