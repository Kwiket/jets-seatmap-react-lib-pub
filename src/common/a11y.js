/**
 * Locale keys consumed by the a11y utilities. Listed centrally so the
 * accessible-name builder, the live-region announcer (Wave E) and the
 * list-view component (Wave F) stay in sync with the locale tables.
 */
export const A11Y_LOCALE_KEYS = {
  seatPositionWindow: 'seatPositionWindow',
  seatPositionAisle: 'seatPositionAisle',
  seatPositionMiddle: 'seatPositionMiddle',
  seatExtraLegroom: 'seatExtraLegroom',
  seatExitRow: 'seatExitRow',
  seatAvailable: 'seatAvailable',
  seatUnavailable: 'seatUnavailable',
  seatSelected: 'seatSelected',
  seatSelectedFor: 'seatSelectedFor',
  seatRestrictedFor: 'seatRestrictedFor',
  close: 'close',
  moveToSeat: 'moveToSeat',
  gridLabel: 'gridLabel',
  allSeats: 'allSeats',
  row: 'row',
  seat: 'seat',
  cabin: 'cabin',
  position: 'position',
  features: 'features',
  price: 'price',
  status: 'status',
  action: 'action',
};

/**
 * Position of a seat in its row from a passenger's perspective.
 * - `window`: first or last real (`type === 'seat'`) cell in the row
 * - `aisle`: immediately adjacent to an `aisle`-typed cell
 * - `middle`: any other interactive seat
 * - `null`: not a real seat (aisle, empty, index)
 *
 * @param {Object} seat
 * @param {Object} row
 * @returns {'window' | 'aisle' | 'middle' | null}
 */
export function computeSeatPosition(seat, row) {
  if (seat.type !== 'seat') return null;
  const cells = row.seats;
  const idx = cells.indexOf(seat);
  if (idx === -1) return null;

  let firstSeatIdx = -1;
  let lastSeatIdx = -1;
  for (let i = 0; i < cells.length; i++) {
    if (cells[i].type === 'seat') {
      if (firstSeatIdx === -1) firstSeatIdx = i;
      lastSeatIdx = i;
    }
  }
  if (idx === firstSeatIdx || idx === lastSeatIdx) return 'window';

  const prev = cells[idx - 1];
  const next = cells[idx + 1];
  if (prev?.type === 'aisle' || next?.type === 'aisle') return 'aisle';

  return 'middle';
}

/**
 * Build a comma-separated accessible name for a seat, suitable as the
 * `aria-label` of the seat button. Fragments join with `, ` so screen
 * readers pause between them. Pure — reads no DOM/service/global state.
 *
 * Sample outputs (locale=EN):
 *   "14C, aisle, extra legroom, available, €12"
 *   "14C, window, selected for John Doe"
 *   "14B, middle, unavailable"
 *   "12A, window, exit row, not available for infants"
 *
 * @param {Object} seat
 * @param {'window' | 'aisle' | 'middle' | null} position
 * @param {Object} locale
 * @returns {string}
 */
export function buildSeatAriaLabel(seat, position, locale) {
  const parts = [];
  parts.push(seatName(seat));

  if (position) {
    parts.push(t(locale, positionLocaleKey(position)));
  }

  if (hasExitRow(seat)) {
    parts.push(t(locale, A11Y_LOCALE_KEYS.seatExitRow));
  } else if (hasExtraLegroom(seat)) {
    parts.push(t(locale, A11Y_LOCALE_KEYS.seatExtraLegroom));
  }

  switch (seat.status) {
    case 'selected':
    case 'preferred':
    case 'extra': {
      const pname = passengerLabel(seat.passenger);
      if (pname) {
        parts.push(`${t(locale, A11Y_LOCALE_KEYS.seatSelectedFor)} ${pname}`);
      } else {
        parts.push(t(locale, A11Y_LOCALE_KEYS.seatSelected));
      }
      break;
    }
    case 'unavailable':
    case 'disabled':
      parts.push(t(locale, A11Y_LOCALE_KEYS.seatUnavailable));
      break;
    case 'available':
    default: {
      const restriction = restrictionLabel(seat, locale);
      if (restriction) {
        parts.push(restriction);
      } else {
        parts.push(t(locale, A11Y_LOCALE_KEYS.seatAvailable));
        const price = priceLabel(seat);
        if (price) parts.push(price);
      }
      break;
    }
  }

  return parts.join(', ');
}

function positionLocaleKey(position) {
  switch (position) {
    case 'window':
      return A11Y_LOCALE_KEYS.seatPositionWindow;
    case 'aisle':
      return A11Y_LOCALE_KEYS.seatPositionAisle;
    case 'middle':
      return A11Y_LOCALE_KEYS.seatPositionMiddle;
    default:
      return A11Y_LOCALE_KEYS.seatPositionMiddle;
  }
}

function seatName(seat) {
  if (seat.number) return seat.number;
  if (seat.name) return seat.name;
  const synthesised = `${seat.rowName ?? ''}${seat.letter ?? ''}`;
  return synthesised || seat.id;
}

function hasFeatureMatching(seat, predicate) {
  const lists = [seat.features, seat.additionalProps, seat.measurements];
  for (const list of lists) {
    // Prepared seat data carries features/measurements as arrays of {key, title} objects
    // (see data-preparer.js `_prepareSeatFeatures`). Guard against other shapes (e.g. a raw,
    // not-yet-prepared features map) so accessible-name building never throws mid-render.
    if (!Array.isArray(list)) continue;
    for (const feature of list) {
      if (predicate(feature)) return true;
    }
  }
  return false;
}

function hasExtraLegroom(seat) {
  if (seat.status === 'extra') return true;
  return hasFeatureMatching(
    seat,
    f =>
      f.key === 'extra_legroom' ||
      f.key === 'extraLegroom' ||
      f.title === 'Extra legroom' ||
      f.title === 'extra_legroom'
  );
}

function hasExitRow(seat) {
  return hasFeatureMatching(seat, f => f.key === 'exitRow' || f.title === 'Exit row');
}

function passengerLabel(p) {
  if (!p) return '';
  return p.passengerLabel?.trim() || p.abbr?.trim() || '';
}

function priceLabel(seat) {
  if (seat.price == null) return '';
  const currency = (seat.currency ?? '').trim();
  return currency ? `${currency}${seat.price}` : String(seat.price);
}

function restrictionLabel(seat, locale) {
  const types = seat.passengerTypes;
  if (!types || types.length === 0) return '';
  const template = t(locale, A11Y_LOCALE_KEYS.seatRestrictedFor);
  const translatedTypes = types.map(pt => locale[pt] ?? pt).join(', ');
  return template.includes('{type}') ? template.replace('{type}', translatedTypes) : `${template} ${translatedTypes}`;
}

function t(locale, key) {
  return locale[key] ?? key;
}
