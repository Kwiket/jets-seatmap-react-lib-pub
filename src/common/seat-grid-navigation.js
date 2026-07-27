/**
 * Pure logic. Operates on `IDeckData[]` and an `ICellPos = {deckIdx, rowIdx, colIdx}`
 * (0-based indices into the data arrays — NOT the 1-based aria indices). It identifies
 * cells by array position, not by DOM attributes. `move()` returns the SAME `ICellPos`
 * reference when no move is possible (callers compare by `===` to detect no-op).
 * Cross-deck navigation is intentionally out of scope (`move()` always returns the same
 * `deckIdx`).
 */

export const PAGE_STEP = 5;

/** Seat statuses that the user can interact with (focus + act on). */
const INTERACTIVE_STATUSES = new Set(['available', 'selected', 'preferred', 'extra']);

/**
 * Map a `KeyboardEvent` to a `TGridKey | null`. Returns null for keys the
 * grid does not consume (so callers can let the event bubble).
 * Handles Ctrl-modifier (or Meta on macOS) and PageUp/Down.
 */
export function classifyKey(ev) {
  const mod = ev.ctrlKey || ev.metaKey;

  switch (ev.key) {
    case 'ArrowLeft':
      return mod ? 'CtrlArrowLeft' : 'ArrowLeft';
    case 'ArrowRight':
      return mod ? 'CtrlArrowRight' : 'ArrowRight';
    case 'ArrowUp':
      return 'ArrowUp';
    case 'ArrowDown':
      return 'ArrowDown';
    case 'Home':
      return mod ? 'CtrlHome' : 'Home';
    case 'End':
      return mod ? 'CtrlEnd' : 'End';
    case 'PageUp':
      return 'PageUp';
    case 'PageDown':
      return 'PageDown';
    default:
      return null;
  }
}

/**
 * Remap the four arrow keys so they match the ON-SCREEN direction when the
 * cabin is rendered horizontally (the map is rotated 90deg). In horizontal
 * LTR the cabin is additionally flipped 180deg by the deck wrapper, so the
 * visual rotation is opposite to RTL. Non-arrow keys (Home/End/Page/Ctrl…)
 * pass through unchanged, as does every key in vertical mode.
 *
 * Measured on the demo (model key -> visual direction):
 *   LTR: ArrowRight -> UP,   ArrowDown -> RIGHT
 *   RTL: ArrowRight -> DOWN, ArrowDown -> LEFT
 */
export function remapForOrientation(key, horizontal, rightToLeft) {
  if (!horizontal) return key;
  const ltr = {
    ArrowRight: 'ArrowDown',
    ArrowDown: 'ArrowLeft',
    ArrowLeft: 'ArrowUp',
    ArrowUp: 'ArrowRight',
  };
  const rtl = {
    ArrowRight: 'ArrowUp',
    ArrowDown: 'ArrowRight',
    ArrowLeft: 'ArrowDown',
    ArrowUp: 'ArrowLeft',
  };
  return (rightToLeft ? rtl : ltr)[key] ?? key;
}

/**
 * Compute the next focused cell given current position, the key, and the
 * deck data. Returns the SAME `ICellPos` (referentially) if no move was
 * possible.
 */
export function move(from, key, decks) {
  const deck = decks[from.deckIdx];
  if (!deck || !deck.rows || deck.rows.length === 0) {
    return from;
  }

  const rows = deck.rows;
  const currentRow = rows[from.rowIdx];
  if (!currentRow || !currentRow.seats) {
    return from;
  }

  switch (key) {
    case 'ArrowLeft':
      return stepHorizontal(from, currentRow.seats, -1);
    case 'ArrowRight':
      return stepHorizontal(from, currentRow.seats, +1);
    case 'ArrowUp':
      return stepVertical(from, rows, from.rowIdx - 1, -1);
    case 'ArrowDown':
      return stepVertical(from, rows, from.rowIdx + 1, +1);
    case 'Home': {
      const col = firstSeatCol(currentRow.seats);
      if (col < 0 || col === from.colIdx) return from;
      return { deckIdx: from.deckIdx, rowIdx: from.rowIdx, colIdx: col };
    }
    case 'End': {
      const col = lastSeatCol(currentRow.seats);
      if (col < 0 || col === from.colIdx) return from;
      return { deckIdx: from.deckIdx, rowIdx: from.rowIdx, colIdx: col };
    }
    case 'CtrlHome': {
      const cell = firstSeatCellOfDeck(from.deckIdx, rows);
      if (!cell || (cell.rowIdx === from.rowIdx && cell.colIdx === from.colIdx)) return from;
      return cell;
    }
    case 'CtrlEnd': {
      const cell = lastSeatCellOfDeck(from.deckIdx, rows);
      if (!cell || (cell.rowIdx === from.rowIdx && cell.colIdx === from.colIdx)) return from;
      return cell;
    }
    case 'PageUp': {
      if (from.rowIdx === 0) return from;
      // Scan from the target row back DOWN toward `from`, so we always land
      // on a seat-bearing row even if the exact target row is a separator.
      const target = Math.max(0, from.rowIdx - PAGE_STEP);
      return stepVertical(from, rows, target, +1);
    }
    case 'PageDown': {
      const lastRowIdx = rows.length - 1;
      if (from.rowIdx === lastRowIdx) return from;
      const target = Math.min(lastRowIdx, from.rowIdx + PAGE_STEP);
      return stepVertical(from, rows, target, -1);
    }
    case 'CtrlArrowLeft':
      return skim(from, decks, -1);
    case 'CtrlArrowRight':
      return skim(from, decks, +1);
    default:
      return from;
  }
}

/**
 * First focusable cell of a deck. Prefers the first interactive seat
 * (window/aisle/middle, any status except `unavailable`); falls back to
 * `{deckIdx, rowIdx: 0, colIdx: 0}` when nothing is interactive.
 */
export function initialCell(deckIdx, decks) {
  const fallback = { deckIdx, rowIdx: 0, colIdx: 0 };
  const deck = decks[deckIdx];
  if (!deck || !deck.rows) return fallback;

  for (let r = 0; r < deck.rows.length; r++) {
    const row = deck.rows[r];
    if (!row || !row.seats) continue;
    for (let c = 0; c < row.seats.length; c++) {
      if (isSeatInteractive(row.seats[c])) {
        return { deckIdx, rowIdx: r, colIdx: c };
      }
    }
  }

  return fallback;
}

/**
 * Whether the seat at the given position is "interactive" (a real
 * `seat`-type cell with a status the user can act on).
 */
export function isInteractive(decks, pos) {
  const deck = decks[pos.deckIdx];
  if (!deck || !deck.rows) return false;
  const row = deck.rows[pos.rowIdx];
  if (!row || !row.seats) return false;
  const seat = row.seats[pos.colIdx];
  return isSeatInteractive(seat);
}

// ─── internals ─────────────────────────────────────────────────────────────

/** Whether a cell is a real seat (any status) — the only arrow-key target. */
function isSeatCell(seat) {
  return !!seat && seat.type === 'seat';
}

/**
 * Move horizontally within a row to the next SEAT cell in `dir` (+1/-1),
 * skipping spacer cells. Returns `from` (referentially) if none exists.
 */
function stepHorizontal(from, seats, dir) {
  for (let c = from.colIdx + dir; c >= 0 && c < seats.length; c += dir) {
    if (isSeatCell(seats[c])) {
      return { deckIdx: from.deckIdx, rowIdx: from.rowIdx, colIdx: c };
    }
  }
  return from;
}

/**
 * Scan rows starting at `startRowIdx` in `dir` for the first seat-bearing
 * row, landing on the seat nearest `from.colIdx`. Skips seatless separator
 * rows. Returns `from` if no seat row is reachable (or if it resolves back
 * to the current cell).
 */
function stepVertical(from, rows, startRowIdx, dir) {
  for (let r = startRowIdx; r >= 0 && r < rows.length; r += dir) {
    const seats = rows[r]?.seats;
    if (!seats) continue;
    const col = nearestSeatCol(seats, from.colIdx);
    if (col >= 0) {
      if (r === from.rowIdx && col === from.colIdx) return from;
      return { deckIdx: from.deckIdx, rowIdx: r, colIdx: col };
    }
  }
  return from;
}

/** Index of the first seat cell in a row, or -1. */
function firstSeatCol(seats) {
  for (let c = 0; c < seats.length; c++) {
    if (isSeatCell(seats[c])) return c;
  }
  return -1;
}

/** Index of the last seat cell in a row, or -1. */
function lastSeatCol(seats) {
  for (let c = seats.length - 1; c >= 0; c--) {
    if (isSeatCell(seats[c])) return c;
  }
  return -1;
}

/** Seat cell nearest to `desiredCol` (ties resolve to the left), or -1. */
function nearestSeatCol(seats, desiredCol) {
  let best = -1;
  let bestDist = Infinity;
  for (let c = 0; c < seats.length; c++) {
    if (!isSeatCell(seats[c])) continue;
    const dist = Math.abs(c - desiredCol);
    if (dist < bestDist) {
      best = c;
      bestDist = dist;
    }
  }
  return best;
}

/** First seat cell of the deck (top-down), or null. */
function firstSeatCellOfDeck(deckIdx, rows) {
  for (let r = 0; r < rows.length; r++) {
    const seats = rows[r]?.seats;
    const col = seats ? firstSeatCol(seats) : -1;
    if (col >= 0) return { deckIdx, rowIdx: r, colIdx: col };
  }
  return null;
}

/** Last seat cell of the deck (bottom-up), or null. */
function lastSeatCellOfDeck(deckIdx, rows) {
  for (let r = rows.length - 1; r >= 0; r--) {
    const seats = rows[r]?.seats;
    const col = seats ? lastSeatCol(seats) : -1;
    if (col >= 0) return { deckIdx, rowIdx: r, colIdx: col };
  }
  return null;
}

/**
 * Skim within the current row toward `dir` (+1 or -1). Returns the FIRST
 * interactive seat encountered in that direction ("hop to the next playable
 * seat"). If the row contains no interactive cell beyond `from` in that
 * direction, returns `from` unchanged.
 */
function skim(from, decks, dir) {
  const deck = decks[from.deckIdx];
  if (!deck || !deck.rows) return from;
  const row = deck.rows[from.rowIdx];
  if (!row || !row.seats || row.seats.length === 0) return from;

  let c = from.colIdx + dir;
  while (c >= 0 && c < row.seats.length) {
    if (isSeatInteractive(row.seats[c])) {
      return { deckIdx: from.deckIdx, rowIdx: from.rowIdx, colIdx: c };
    }
    c += dir;
  }

  // No further interactive cell in this direction: stay where we are.
  return from;
}

function isSeatInteractive(seat) {
  if (!seat) return false;
  if (seat.type !== 'seat') return false;
  return INTERACTIVE_STATUSES.has(seat.status);
}
