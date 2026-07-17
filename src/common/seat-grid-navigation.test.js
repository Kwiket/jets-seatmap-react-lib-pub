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

  it('false when the deck, row or seat position does not exist', () => {
    expect(isInteractive(decks, { deckIdx: 9, rowIdx: 0, colIdx: 0 })).toBe(false);
    expect(isInteractive(decks, { deckIdx: 0, rowIdx: 9, colIdx: 0 })).toBe(false);
    expect(isInteractive(decks, { deckIdx: 0, rowIdx: 0, colIdx: 9 })).toBe(false);
  });
});

// A taller deck (8 rows) with a leading and trailing seatless separator so the
// Ctrl/Page navigation and the "no seat in this row/deck" branches are exercised.
const sep = { seats: [aisle, aisle] };
const tall = [
  {
    rows: [
      sep, // r0 separator
      { seats: [seat({ number: '1A' }), seat({ number: '1B' })] }, // r1
      { seats: [seat({ number: '2A' }), seat({ number: '2B' })] }, // r2
      { seats: [seat({ number: '3A' }), seat({ number: '3B' })] }, // r3
      { seats: [seat({ number: '4A' }), seat({ number: '4B' })] }, // r4
      { seats: [seat({ number: '5A' }), seat({ number: '5B' })] }, // r5
      { seats: [seat({ number: '6A' }), seat({ number: '6B' })] }, // r6
      sep, // r7 separator
    ],
  },
];

describe('classifyKey — full key set', () => {
  it('maps every consumed key (plain and modified)', () => {
    expect(classifyKey({ key: 'ArrowRight' })).toBe('ArrowRight');
    expect(classifyKey({ key: 'ArrowRight', ctrlKey: true })).toBe('CtrlArrowRight');
    expect(classifyKey({ key: 'ArrowUp' })).toBe('ArrowUp');
    expect(classifyKey({ key: 'ArrowDown' })).toBe('ArrowDown');
    expect(classifyKey({ key: 'Home' })).toBe('Home');
    expect(classifyKey({ key: 'End' })).toBe('End');
    expect(classifyKey({ key: 'End', ctrlKey: true })).toBe('CtrlEnd');
    expect(classifyKey({ key: 'PageUp' })).toBe('PageUp');
    expect(classifyKey({ key: 'PageDown' })).toBe('PageDown');
  });
});

describe('remapForOrientation — RTL and passthrough', () => {
  it('rotates arrows the other way when horizontal RTL', () => {
    expect(remapForOrientation('ArrowRight', true, true)).toBe('ArrowUp');
    expect(remapForOrientation('ArrowDown', true, true)).toBe('ArrowRight');
  });
  it('passes non-arrow keys through unchanged in horizontal mode', () => {
    expect(remapForOrientation('Home', true, false)).toBe('Home');
  });
});

describe('move — vertical, ctrl and page navigation', () => {
  it('ArrowUp lands on the seat row above', () => {
    const from = { deckIdx: 0, rowIdx: 2, colIdx: 0 };
    expect(move(from, 'ArrowUp', tall)).toEqual({ deckIdx: 0, rowIdx: 1, colIdx: 0 });
  });

  it('CtrlHome / CtrlEnd jump to the first / last seat of the deck, skipping separators', () => {
    const from = { deckIdx: 0, rowIdx: 3, colIdx: 1 };
    expect(move(from, 'CtrlHome', tall)).toEqual({ deckIdx: 0, rowIdx: 1, colIdx: 0 });
    expect(move(from, 'CtrlEnd', tall)).toEqual({ deckIdx: 0, rowIdx: 6, colIdx: 1 });
  });

  it('PageDown / PageUp move by PAGE_STEP and land on a seat-bearing row', () => {
    expect(move({ deckIdx: 0, rowIdx: 1, colIdx: 0 }, 'PageDown', tall)).toEqual({ deckIdx: 0, rowIdx: 6, colIdx: 0 });
    expect(move({ deckIdx: 0, rowIdx: 6, colIdx: 0 }, 'PageUp', tall)).toEqual({ deckIdx: 0, rowIdx: 1, colIdx: 0 });
  });

  it('CtrlArrowLeft skims to the previous interactive seat in the row', () => {
    const from = { deckIdx: 0, rowIdx: 1, colIdx: 1 };
    expect(move(from, 'CtrlArrowLeft', tall)).toEqual({ deckIdx: 0, rowIdx: 1, colIdx: 0 });
  });

  it('is a no-op at the deck edges and for unknown keys', () => {
    const top = { deckIdx: 0, rowIdx: 1, colIdx: 0 };
    expect(move(top, 'PageUp', tall)).toBe(top); // rowIdx above still resolves back to itself
    const last = { deckIdx: 0, rowIdx: 6, colIdx: 0 };
    expect(move(last, 'ArrowDown', tall)).toBe(last); // no seat row below
    expect(move(top, 'Enter', tall)).toBe(top); // unknown key
  });

  it('returns the same ref when the deck or the row is missing', () => {
    const noDeck = { deckIdx: 9, rowIdx: 0, colIdx: 0 };
    expect(move(noDeck, 'ArrowLeft', tall)).toBe(noDeck);
    const noRow = { deckIdx: 0, rowIdx: 99, colIdx: 0 };
    expect(move(noRow, 'ArrowLeft', tall)).toBe(noRow);
  });
});

describe('initialCell — fallback', () => {
  it('falls back to {0,0,0} when nothing in the deck is interactive', () => {
    const dead = [{ rows: [{ seats: [aisle, aisle] }, { seats: [seat({ status: 'unavailable' })] }] }];
    expect(initialCell(0, dead)).toEqual({ deckIdx: 0, rowIdx: 0, colIdx: 0 });
  });
  it('falls back when the deck does not exist', () => {
    expect(initialCell(9, tall)).toEqual({ deckIdx: 9, rowIdx: 0, colIdx: 0 });
  });
});
