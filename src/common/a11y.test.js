import { buildSeatAriaLabel, computeSeatPosition } from './a11y';

const locale = {
  seatPositionWindow: 'window',
  seatPositionAisle: 'aisle',
  seatPositionMiddle: 'middle',
  seatExtraLegroom: 'extra legroom',
  seatExitRow: 'exit row',
  seatAvailable: 'available',
  seatUnavailable: 'unavailable',
  seatSelected: 'selected',
  seatSelectedFor: 'selected for',
  seatRestrictedFor: 'not available for',
  INF: 'infants',
};

const seat = (over = {}) => ({ type: 'seat', status: 'available', number: '14C', ...over });

describe('computeSeatPosition', () => {
  it('returns null for non-seat cells', () => {
    const row = { seats: [{ type: 'aisle' }] };
    expect(computeSeatPosition(row.seats[0], row)).toBeNull();
  });

  it('marks the first and last real seats as window', () => {
    const a = seat({ number: '1A' });
    const b = seat({ number: '1B' });
    const aisle = { type: 'aisle' };
    const c = seat({ number: '1C' });
    const row = { seats: [a, b, aisle, c] };
    expect(computeSeatPosition(a, row)).toBe('window');
    expect(computeSeatPosition(c, row)).toBe('window');
  });

  it('marks a seat next to an aisle cell as aisle', () => {
    const a = seat({ number: '1A' });
    const b = seat({ number: '1B' });
    const aisle = { type: 'aisle' };
    const c = seat({ number: '1C' });
    const d = seat({ number: '1D' });
    const row = { seats: [a, b, aisle, c, d] };
    expect(computeSeatPosition(b, row)).toBe('aisle');
    expect(computeSeatPosition(c, row)).toBe('aisle');
  });
});

describe('buildSeatAriaLabel', () => {
  it('available seat with price and position', () => {
    const s = seat({ price: 12, currency: '€' });
    expect(buildSeatAriaLabel(s, 'aisle', locale)).toBe('14C, aisle, available, €12');
  });

  it('selected seat names the passenger', () => {
    const s = seat({ status: 'selected', passenger: { passengerLabel: 'John Doe' } });
    expect(buildSeatAriaLabel(s, 'window', locale)).toBe('14C, window, selected for John Doe');
  });

  it('unavailable seat', () => {
    const s = seat({ number: '14B', status: 'unavailable' });
    expect(buildSeatAriaLabel(s, 'middle', locale)).toBe('14B, middle, unavailable');
  });

  it('restricted seat reads passengerTypes through the locale', () => {
    const s = seat({ number: '12A', passengerTypes: ['INF'] });
    expect(buildSeatAriaLabel(s, 'window', locale)).toBe('12A, window, not available for infants');
  });
});
