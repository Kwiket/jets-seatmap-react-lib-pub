import { classifyKey, remapForOrientation, move, initialCell, isInteractive } from './seat-grid-navigation';

const seat = (over = {}) => ({ type: 'seat', status: 'available', ...over });
const aisle = { type: 'aisle' };
// A deck: rows[0] = [A avail, B avail, aisle, C unavailable], rows[1] = [D avail, E avail, aisle, F avail]
const decks = [
  {
    rows: [
      { seats: [seat({ number: '1A' }), seat({ number: '1B' }), aisle, seat({ number: '1C', status: 'unavailable' })] },
      { seats: [seat({ number: '2A' }), seat({ number: '2B' }), aisle, seat({ number: '2F' })] },
    ],
  },
];

describe('classifyKey', () => {
  it('maps plain and ctrl/meta arrows', () => {
    expect(classifyKey({ key: 'ArrowLeft' })).toBe('ArrowLeft');
    expect(classifyKey({ key: 'ArrowLeft', ctrlKey: true })).toBe('CtrlArrowLeft');
    expect(classifyKey({ key: 'Home', metaKey: true })).toBe('CtrlHome');
    expect(classifyKey({ key: 'Tab' })).toBeNull();
  });
});

describe('remapForOrientation', () => {
  it('passes through when vertical', () => {
    expect(remapForOrientation('ArrowRight', false, false)).toBe('ArrowRight');
  });
  it('rotates arrows when horizontal LTR', () => {
    expect(remapForOrientation('ArrowRight', true, false)).toBe('ArrowDown');
  });
});

describe('move', () => {
  it('ArrowRight skips the aisle spacer to the next seat', () => {
    const from = { deckIdx: 0, rowIdx: 0, colIdx: 1 };
    expect(move(from, 'ArrowRight', decks)).toEqual({ deckIdx: 0, rowIdx: 0, colIdx: 3 });
  });
  it('returns the same ref on a no-op (ArrowLeft past the first seat)', () => {
    const from = { deckIdx: 0, rowIdx: 0, colIdx: 0 };
    expect(move(from, 'ArrowLeft', decks)).toBe(from);
  });
  it('ArrowDown lands on the seat nearest the current column', () => {
    const from = { deckIdx: 0, rowIdx: 0, colIdx: 0 };
    expect(move(from, 'ArrowDown', decks)).toEqual({ deckIdx: 0, rowIdx: 1, colIdx: 0 });
  });
  it('Home/End go to first/last seat of the row', () => {
    const from = { deckIdx: 0, rowIdx: 0, colIdx: 1 };
    expect(move(from, 'Home', decks)).toEqual({ deckIdx: 0, rowIdx: 0, colIdx: 0 });
    expect(move(from, 'End', decks)).toEqual({ deckIdx: 0, rowIdx: 0, colIdx: 3 });
  });
  it('CtrlArrowRight skims to the next interactive seat, skipping unavailable', () => {
    // row 0 col 1 -> next interactive is... col 3 is unavailable, so no further interactive: no-op
    const from = { deckIdx: 0, rowIdx: 0, colIdx: 1 };
    expect(move(from, 'CtrlArrowRight', decks)).toBe(from);
  });
});

describe('initialCell', () => {
  it('returns the first interactive seat', () => {
    expect(initialCell(0, decks)).toEqual({ deckIdx: 0, rowIdx: 0, colIdx: 0 });
  });
});

describe('isInteractive', () => {
  it('true for an available seat, false for an aisle', () => {
    expect(isInteractive(decks, { deckIdx: 0, rowIdx: 0, colIdx: 0 })).toBe(true);
    expect(isInteractive(decks, { deckIdx: 0, rowIdx: 0, colIdx: 2 })).toBe(false);
  });
});
