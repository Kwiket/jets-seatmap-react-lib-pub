import React, { useContext, useMemo, useState } from 'react';

import { JetsContext, LOCALES_MAP, DEFAULT_LANG, ENTITY_TYPE_MAP, computeSeatPosition } from '../../common';
import './SeatList.css';

/** Position filter values for the single `<select>` (window / aisle are mutually exclusive). */
const POSITION_FILTERS = ['all', 'window', 'aisle'];

/** Sort keys consumed by the sort `<select>`. */
const SORT_KEYS = ['row', 'priceAsc', 'priceDesc'];

const locale = lang => LOCALES_MAP[lang] || LOCALES_MAP[DEFAULT_LANG] || {};

const t = (loc, key, fallback) => loc[key] || fallback;

/** Flatten `content` (decks → rows → seats) into real seats only, tagged with row/position info. */
const flattenSeats = content => {
  const result = [];
  for (const deck of content || []) {
    for (const row of deck.rows || []) {
      for (const seat of row.seats || []) {
        if (seat.type !== ENTITY_TYPE_MAP.seat) continue;
        result.push({
          seat,
          row,
          rowNumber: rowNumber(seat),
          position: computeSeatPosition(seat, row),
        });
      }
    }
  }
  return result;
};

/**
 * Passenger-facing row number for the Row column — the numeric prefix of the
 * seat number ('43A' → '43'). Falls back to the seat's `rowName`, never to
 * an internal row id, which is meaningless to users.
 */
const rowNumber = seat => {
  const fromNumber = (seat.number || '').match(/\d+/)?.[0];
  if (fromNumber) return fromNumber;
  return seat.rowName ?? '';
};

const positionLabel = (entry, loc) => {
  switch (entry.position) {
    case 'window':
      return t(loc, 'seatPositionWindow', 'window');
    case 'aisle':
      return t(loc, 'seatPositionAisle', 'aisle');
    case 'middle':
      return t(loc, 'seatPositionMiddle', 'middle');
    default:
      return '—';
  }
};

/**
 * Comma-joined feature titles for the Features column. `seat.features` (as
 * prepared by data-preparer.js) already excludes dimension measurements
 * (pitch/width/recline live in `seat.measurements`), so every entry here is
 * an amenity. Quality-sign features ("+"/"-") carry the localized text in
 * `value` with `title: null`; plain features carry it in `title` — either
 * way `title || value` is the display text.
 */
const featuresLabel = seat => {
  const features = seat.features || [];
  if (!features.length) return '—';
  const titles = features.map(f => f.title || f.value).filter(v => !!v);
  return titles.length ? titles.join(', ') : '—';
};

/**
 * `seat.price` is a pre-formatted display string (e.g. 'EUR 20'), already
 * built by the availability handler; `seat.priceValue` carries the raw
 * number used to decide "free" vs "paid" and for sorting.
 */
const priceLabel = (seat, loc) => {
  if (seat.price == null) return '—';
  if (!seat.priceValue) return t(loc, 'free', 'free');
  return String(seat.price);
};

/** A seat the user can never select (no availability for it). */
const isUnavailable = seat => seat.status === 'unavailable' || seat.status === 'disabled';

/**
 * Label for the (enabled) Select button — encodes availability + price in
 * one control so a separate Status / Price column isn't needed:
 *   - paid seat  → the formatted price (e.g. 'EUR 33');
 *   - free / unpriced seat → the plain "Select" word.
 * Unavailable seats never reach this — they render a disabled button with
 * the unavailable label instead.
 */
const selectButtonLabel = (seat, loc) => {
  if (seat.price != null && seat.priceValue) return priceLabel(seat, loc);
  return t(loc, 'select', 'Select');
};

const hasFeatureMatching = (seat, predicate) => {
  const lists = [seat.features, seat.additionalProps, seat.measurements];
  for (const list of lists) {
    if (!Array.isArray(list)) continue;
    for (const feature of list) {
      if (predicate(feature)) return true;
    }
  }
  return false;
};

const hasExtraLegroom = seat => {
  if (seat.status === 'extra') return true;
  return hasFeatureMatching(
    seat,
    f =>
      f.key === 'extra_legroom' ||
      f.key === 'extraLegroom' ||
      f.title === 'Extra legroom' ||
      f.title === 'extra_legroom'
  );
};

const hasExitRow = seat => hasFeatureMatching(seat, f => f.key === 'exitRow' || f.title === 'Exit row');

const priceKey = seat => {
  // Missing prices sink to the bottom in ascending order and rise to the top
  // in descending order — a consistent UX regardless of sort direction.
  // `seat.price` is the pre-formatted display string (e.g. 'EUR 20'); the
  // numeric value used for comparisons lives in `seat.priceValue`.
  const p = seat.priceValue;
  return typeof p === 'number' ? p : Number.POSITIVE_INFINITY;
};

/**
 * Accessible alternative to the 2D seat grid. Renders every real seat across
 * all decks in `content` as a semantic `<table>`, with a `<fieldset>` of
 * filter checkboxes/selects above it.
 *
 * Select/Unselect buttons are wired through the same `JetsContext`
 * (`onSeatSelect` / `onSeatUnselect`) the grid uses, so selection state and
 * the external `onSeatSelected` / `onSeatUnselected` callbacks fire
 * identically regardless of view mode.
 */
export const JetsSeatList = ({ content = [], lang = DEFAULT_LANG, showActions = true }) => {
  const { onSeatSelect, onSeatUnselect, isSeatSelectDisabled, getSelectDisabledReason } = useContext(JetsContext);

  const [positionFilter, setPositionFilter] = useState('all');
  const [filterExtraLegroom, setFilterExtraLegroom] = useState(false);
  const [filterExitRow, setFilterExitRow] = useState(false);
  const [sortKey, setSortKey] = useState('row');

  const loc = locale(lang);

  const flatSeats = useMemo(() => flattenSeats(content), [content]);

  const showFeaturesColumn = useMemo(() => flatSeats.some(entry => featuresLabel(entry.seat) !== '—'), [flatSeats]);

  const filteredAndSortedSeats = useMemo(() => {
    const filtered = flatSeats.filter(entry => {
      if (positionFilter === 'window' && entry.position !== 'window') return false;
      if (positionFilter === 'aisle' && entry.position !== 'aisle') return false;
      if (filterExtraLegroom && !hasExtraLegroom(entry.seat)) return false;
      if (filterExitRow && !hasExitRow(entry.seat)) return false;
      return true;
    });

    if (sortKey === 'priceAsc') {
      return filtered.slice().sort((a, b) => priceKey(a.seat) - priceKey(b.seat));
    }
    if (sortKey === 'priceDesc') {
      return filtered.slice().sort((a, b) => priceKey(b.seat) - priceKey(a.seat));
    }
    // 'row': stable, preserves the natural deck/row/seat order from flatSeats.
    return filtered;
  }, [flatSeats, positionFilter, filterExtraLegroom, filterExitRow, sortKey]);

  const onSelectClick = seat => {
    if (isSeatSelectDisabled(seat)) return;
    onSeatSelect(seat);
  };

  const onUnselectClick = seat => {
    onSeatUnselect(seat);
  };

  const renderActionCell = entry => {
    const { seat } = entry;

    if (seat.passenger) {
      return (
        <button
          type="button"
          className="jets-seat-list__action jets-seat-list__action--unselect"
          onClick={() => onUnselectClick(seat)}
        >
          {t(loc, 'unselect', 'Unselect')}
        </button>
      );
    }

    if (isUnavailable(seat)) {
      return (
        <button type="button" className="jets-seat-list__action jets-seat-list__action--unavailable" disabled>
          {t(loc, 'unavailable', 'Unavailable')}
        </button>
      );
    }

    const disabled = isSeatSelectDisabled(seat);
    const reason = disabled ? getSelectDisabledReason(seat) : '';
    const label = selectButtonLabel(seat, loc);

    // Expose the disabled reason through the accessible name rather than a
    // native `title`: a title tooltip is not keyboard/touch reachable and its
    // screen-reader support is inconsistent (a11yproject "Remove title
    // attribute tooltips"). An aria-label is announced even for a disabled
    // button in screen-reader browse mode.
    return (
      <button
        type="button"
        className="jets-seat-list__action jets-seat-list__action--select"
        disabled={disabled}
        aria-label={reason ? `${label}, ${reason}` : undefined}
        onClick={() => onSelectClick(seat)}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="jets-seat-list">
      <fieldset className="jets-seat-list__filters">
        <legend className="jets-visually-hidden">{t(loc, 'filters', 'Filters')}</legend>

        <label className="jets-seat-list__select">
          <span>{t(loc, 'position', 'Position')}</span>
          <select value={positionFilter} onChange={e => setPositionFilter(e.target.value)}>
            {POSITION_FILTERS.map(value => (
              <option key={value} value={value}>
                {value === 'all'
                  ? t(loc, 'allPositions', 'All')
                  : value === 'window'
                  ? t(loc, 'filterWindow', 'Window')
                  : t(loc, 'filterAisle', 'Aisle')}
              </option>
            ))}
          </select>
        </label>

        <label className="jets-seat-list__filter">
          <input type="checkbox" checked={filterExtraLegroom} onChange={e => setFilterExtraLegroom(e.target.checked)} />
          <span>{t(loc, 'filterExtraLegroom', 'Extra legroom')}</span>
        </label>

        <label className="jets-seat-list__filter">
          <input type="checkbox" checked={filterExitRow} onChange={e => setFilterExitRow(e.target.checked)} />
          <span>{t(loc, 'filterExitRow', 'Exit row')}</span>
        </label>

        <label className="jets-seat-list__sort">
          <span>{t(loc, 'sortBy', 'Sort by')}</span>
          <select value={sortKey} onChange={e => setSortKey(e.target.value)}>
            {SORT_KEYS.map(value => (
              <option key={value} value={value}>
                {value === 'row'
                  ? t(loc, 'sortByRow', 'Row')
                  : value === 'priceAsc'
                  ? t(loc, 'sortByPriceAsc', 'Price ascending')
                  : t(loc, 'sortByPriceDesc', 'Price descending')}
              </option>
            ))}
          </select>
        </label>
      </fieldset>

      <div className="jets-seat-list__table-scroll">
        <table className="jets-seat-list__table">
          <caption className="jets-visually-hidden">{t(loc, 'allSeats', 'All seats')}</caption>
          <thead>
            <tr>
              <th scope="col" className="jets-seat-list__col-row">
                {t(loc, 'row', 'Row')}
              </th>
              <th scope="col">{t(loc, 'seat', 'Seat')}</th>
              <th scope="col">{t(loc, 'cabin', 'Cabin')}</th>
              <th scope="col">{t(loc, 'position', 'Position')}</th>
              {showFeaturesColumn && <th scope="col">{t(loc, 'features', 'Features')}</th>}
              {showActions && <th scope="col">{t(loc, 'action', 'Action')}</th>}
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedSeats.map(entry => (
              <tr key={entry.seat.id || entry.seat.uniqId}>
                <td className="jets-seat-list__col-row">{entry.rowNumber}</td>
                <td>{entry.seat.number || entry.seat.letter}</td>
                <td>{entry.seat.classType || entry.seat.classCode || '—'}</td>
                <td>{positionLabel(entry, loc)}</td>
                {showFeaturesColumn && <td>{featuresLabel(entry.seat)}</td>}
                {showActions && <td>{renderActionCell(entry)}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
