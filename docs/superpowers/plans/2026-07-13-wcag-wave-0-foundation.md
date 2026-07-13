# WCAG Wave 0 (Foundation) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the opt-in WCAG flag resolver and the pure accessible-name builder that every later WCAG wave depends on, without changing any rendering, DOM, or behaviour when `config.wcag` is unset.

**Architecture:** Two pure, unit-tested modules in `src/common/` — `wcag-flags.js` (resolves `config.wcag` into a flat flag set) and `a11y.js` (builds seat `aria-label` strings). The resolved flag set is threaded through the existing `JetsContext` so later waves read it from context. This wave is a direct JS port of the Angular library's `utils/wcag-flags.ts` and `utils/a11y.ts`.

**Tech Stack:** React 18, plain JavaScript (no TypeScript), Jest + jsdom + @testing-library/react, Rollup, pnpm.

## Global Constraints

- Plain JavaScript only — no TypeScript syntax (no type annotations, interfaces, or generics).
- Prettier house style: single quotes, 2-space indent, 120 char width, trailing commas ES5, **no** parens on single-arg arrows (`seat => ...`), semicolons required. Husky pre-commit auto-formats staged files.
- English only in every committed file (code, comments, docs, commit messages). No Cyrillic anywhere in the repo.
- Do not mention Claude / Claude Code / Co-Authored-By in commit messages or PRs.
- Additive API changes only. Preserve existing CSS classes (`.jets-seat`, `.jets-row`) and `data-*` attributes.
- Coverage threshold is 85% lines (`jest.config.js`); new modules must ship with tests.
- Zero-change guarantee: with no `config.wcag` (or `wcag.enabled` false), `getWcagFlags` must return every boolean flag `false` and `alternativeView` `'grid'`.
- Work happens in the worktree `/Users/andrey.vilchinsky/work/seatmaps/jets-seatmap-react-lib-pub/.claude/worktrees/wcag` on branch `WCAG`. All paths below are relative to that worktree root.
- Run tests with `pnpm test -- --testPathPattern='<pattern>'` (Jest requires `initTestEnvironment` via the project's Jest setup; run through `pnpm test`, not `jest` directly).

---

### Task 1: WCAG flag resolver + context wiring

Port `getWcagFlags` from the Angular `utils/wcag-flags.ts` to a pure JS module, then expose its result through `JetsContext` so downstream waves can read resolved flags. The resolver is the independently testable deliverable; the one-line context wiring rides along and is verified by the existing SeatMap suite.

**Files:**
- Create: `src/common/wcag-flags.js`
- Test: `src/common/wcag-flags.test.js`
- Modify: `src/common/index.js` (add re-export)
- Modify: `src/components/SeatMap/SeatMap.js:198` (compute flags) and `:539-554` (add to `providerValue`)

**Interfaces:**
- Consumes: `config` object (the merged `configuration` in `SeatMap.js`, shape `{ ...JETS_SEATMAP_DEFAULT_CONFIG, ...userConfig }`), optionally carrying a `wcag` sub-object and/or a deprecated top-level `alternativeView`.
- Produces:
  - `getWcagFlags(config) -> { enabled: boolean, defaultColorTheme: boolean, liveAnnouncer: boolean, visibleRestrictionReason: boolean, landmarksAndSkipLink: boolean, gridSemantics: boolean, keyboardNavigation: boolean, tooltipDialog: boolean, alternativeView: 'grid' | 'list' | 'auto' }`
  - `JetsContext` provider value gains a `wcagFlags` property holding that returned object (read by later waves via `useContext(JetsContext)`).

- [ ] **Step 1: Write the failing test**

Create `src/common/wcag-flags.test.js`:

```js
import { getWcagFlags } from './wcag-flags';

describe('getWcagFlags', () => {
  it('returns all-false / grid when config has no wcag (zero-change guarantee)', () => {
    expect(getWcagFlags({})).toEqual({
      enabled: false,
      defaultColorTheme: false,
      liveAnnouncer: false,
      visibleRestrictionReason: false,
      landmarksAndSkipLink: false,
      gridSemantics: false,
      keyboardNavigation: false,
      tooltipDialog: false,
      alternativeView: 'grid',
    });
  });

  it('treats null/undefined config as empty', () => {
    expect(getWcagFlags(null).enabled).toBe(false);
    expect(getWcagFlags(undefined).gridSemantics).toBe(false);
  });

  it('enabled shortcut flips every undefined flag to true', () => {
    const flags = getWcagFlags({ wcag: { enabled: true } });
    expect(flags.enabled).toBe(true);
    expect(flags.defaultColorTheme).toBe(true);
    expect(flags.liveAnnouncer).toBe(true);
    expect(flags.gridSemantics).toBe(true);
    expect(flags.keyboardNavigation).toBe(true);
    expect(flags.tooltipDialog).toBe(true);
  });

  it('an explicit false survives the enabled shortcut', () => {
    const flags = getWcagFlags({ wcag: { enabled: true, liveAnnouncer: false } });
    expect(flags.liveAnnouncer).toBe(false);
    expect(flags.gridSemantics).toBe(true);
  });

  it('forces keyboardNavigation off when gridSemantics resolves false', () => {
    const flags = getWcagFlags({ wcag: { keyboardNavigation: true } });
    expect(flags.gridSemantics).toBe(false);
    expect(flags.keyboardNavigation).toBe(false);
  });

  it('reads alternativeView from wcag, then top-level, then defaults to grid', () => {
    expect(getWcagFlags({ wcag: { alternativeView: 'list' } }).alternativeView).toBe('list');
    expect(getWcagFlags({ alternativeView: 'auto' }).alternativeView).toBe('auto');
    expect(getWcagFlags({ wcag: {} }).alternativeView).toBe('grid');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test -- --testPathPattern='wcag-flags'`
Expected: FAIL — `Cannot find module './wcag-flags'`.

- [ ] **Step 3: Write the resolver**

Create `src/common/wcag-flags.js`:

```js
/**
 * Fully-resolved WCAG flag set. Components read this (via JetsContext) instead
 * of touching `config.wcag` directly, so the `enabled` shortcut and the
 * cross-flag implications are applied in exactly one place.
 *
 * @typedef {Object} ResolvedWcagFlags
 * @property {boolean} enabled
 * @property {boolean} defaultColorTheme
 * @property {boolean} liveAnnouncer
 * @property {boolean} visibleRestrictionReason
 * @property {boolean} landmarksAndSkipLink
 * @property {boolean} gridSemantics
 * @property {boolean} keyboardNavigation
 * @property {boolean} tooltipDialog
 * @property {'grid' | 'list' | 'auto'} alternativeView
 */

const FLAG_KEYS = [
  'defaultColorTheme',
  'liveAnnouncer',
  'visibleRestrictionReason',
  'landmarksAndSkipLink',
  'gridSemantics',
  'keyboardNavigation',
  'tooltipDialog',
];

/**
 * Resolve `config.wcag` into a flat, default-populated flag set.
 *
 * Rules, in order:
 *  1. Every individual flag defaults to `false` (pre-WCAG parity).
 *  2. When `wcag.enabled === true`, any flag that is `undefined` flips to
 *     `true`. Flags explicitly set to `false` stay `false`.
 *  3. `keyboardNavigation` requires `gridSemantics`; when `gridSemantics`
 *     resolves to `false`, `keyboardNavigation` is forced to `false`.
 *  4. `alternativeView` is a tri-state read from `wcag.alternativeView`, then
 *     the deprecated top-level `config.alternativeView`, then `'grid'`.
 *
 * @param {Object|null|undefined} config
 * @returns {ResolvedWcagFlags}
 */
export function getWcagFlags(config) {
  const w = config?.wcag ?? {};
  const enabled = w.enabled === true;
  const resolved = {};
  for (const key of FLAG_KEYS) {
    const explicit = w[key];
    resolved[key] = explicit === undefined ? enabled : explicit;
  }
  if (!resolved.gridSemantics) {
    resolved.keyboardNavigation = false;
  }
  return {
    enabled,
    defaultColorTheme: resolved.defaultColorTheme,
    liveAnnouncer: resolved.liveAnnouncer,
    visibleRestrictionReason: resolved.visibleRestrictionReason,
    landmarksAndSkipLink: resolved.landmarksAndSkipLink,
    gridSemantics: resolved.gridSemantics,
    keyboardNavigation: resolved.keyboardNavigation,
    tooltipDialog: resolved.tooltipDialog,
    alternativeView: w.alternativeView ?? config?.alternativeView ?? 'grid',
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test -- --testPathPattern='wcag-flags'`
Expected: PASS — 6 tests green.

- [ ] **Step 5: Re-export from the common barrel**

Modify `src/common/index.js` — add this line after `export * from './constants';`:

```js
export * from './wcag-flags';
```

- [ ] **Step 6: Wire resolved flags into JetsContext**

In `src/components/SeatMap/SeatMap.js`:

Add `getWcagFlags` to the existing import from `'../../common'` (the block ending at line 70) — insert `getWcagFlags,` alongside the other named imports.

After line 198 (`const configuration = { ...JETS_SEATMAP_DEFAULT_CONFIG, ...config };`) add:

```js
  const wcagFlags = getWcagFlags(configuration);
```

In the `providerValue` object (around line 539), add `wcagFlags` after `config: configuration,`:

```js
  const providerValue = {
    onSeatClick,
    showTooltip,
    onTooltipClose,
    onSeatSelect,
    onSeatUnselect,
    isSeatSelectDisabled,
    switchDeck,
    resetSeatJumpTo,
    params,
    config: configuration,
    wcagFlags,
    colorTheme,
    activeTooltip,
    seatLabelJumpTo,
    componentOverrides,
  };
```

- [ ] **Step 7: Verify existing SeatMap suite still passes (no behavioural change)**

Run: `pnpm test -- --testPathPattern='SeatMap'`
Expected: PASS — no regressions; `wcagFlags` is additive and unread so far.

- [ ] **Step 8: Commit**

```bash
git add src/common/wcag-flags.js src/common/wcag-flags.test.js src/common/index.js src/components/SeatMap/SeatMap.js
git commit -m "feat(a11y): config.wcag flags + getWcagFlags resolver"
```

---

### Task 2: Accessible-name builder + a11y locale keys

Port `computeSeatPosition` and `buildSeatAriaLabel` from the Angular `utils/a11y.ts` to a pure JS module, and add the ARIA locale keys they consume to every locale in `i18n.languages.js`. Nothing calls the builder yet (Wave B does) — this task delivers the tested pure function and the locale data.

**Files:**
- Create: `src/common/a11y.js`
- Test: `src/common/a11y.test.js`
- Modify: `src/common/index.js` (add re-export)
- Modify: `src/common/i18n.languages.js` (add a11y keys to all 18 `LOCALE_*` objects)

**Interfaces:**
- Consumes: seat objects as produced by `data-preparer.js` (fields used: `type`, `status`, `number`, `name`, `rowName`, `letter`, `id`, `passenger`, `price`, `currency`, `features`, `additionalProps`, `measurements`, `passengerTypes`); row objects with a `seats` array; a `locale` map (`LOCALES_MAP[lang]`).
- Produces:
  - `computeSeatPosition(seat, row) -> 'window' | 'aisle' | 'middle' | null`
  - `buildSeatAriaLabel(seat, position, locale) -> string`
  - `A11Y_LOCALE_KEYS` — a frozen map of the locale key names, so Wave B/E/F stay in sync with `i18n.languages.js`.

- [ ] **Step 1: Write the failing test**

Create `src/common/a11y.test.js`:

```js
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test -- --testPathPattern='a11y'`
Expected: FAIL — `Cannot find module './a11y'`.

- [ ] **Step 3: Write the builder (JS port of the Angular util)**

Create `src/common/a11y.js`:

```js
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
    if (!list) continue;
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test -- --testPathPattern='a11y'`
Expected: PASS — 7 tests green.

- [ ] **Step 5: Re-export from the common barrel**

Modify `src/common/index.js` — add after the `wcag-flags` export from Task 1:

```js
export * from './a11y';
```

- [ ] **Step 6: Add the a11y keys to LOCALE_EN**

In `src/common/i18n.languages.js`, inside the `LOCALE_EN` object, before its closing `};`, add:

```js
  // WCAG a11y keys
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
  close: 'Close',
  moveToSeat: 'Move to seat',
  gridLabel: 'Seat map',
  allSeats: 'All seats',
  row: 'Row',
  seat: 'Seat',
  cabin: 'Cabin',
  position: 'Position',
  features: 'Features',
  price: 'Price',
  status: 'Status',
  action: 'Action',
```

- [ ] **Step 7: Port the same 22 keys into the other 17 locales**

Translations already exist in the sibling Angular repo. For each language block in `src/common/i18n.languages.js` (`LOCALE_RU`, `LOCALE_CN`, `LOCALE_DE`, `LOCALE_ES`, `LOCALE_PL`, `LOCALE_AR`, `LOCALE_CS`, `LOCALE_FR`, `LOCALE_PT`, `LOCALE_IT`, `LOCALE_UK`, `LOCALE_JA`, `LOCALE_KO`, `LOCALE_TR`, `LOCALE_VI`, `LOCALE_PT_BR`, `LOCALE_NL`), copy that language's a11y block from the Angular source of truth:

`/Users/andrey.vilchinsky/work/seatmaps/Angular/jets-seatmap-angular-lib/.claude/worktrees/starry-frolicking-goose/projects/seatmap-lib/src/lib/constants.ts`

Extract a language's a11y block at implementation time (example for RU — swap `RU` for each code) with:

```bash
awk '/LOCALIZATION_RU/{f=1} f&&/seatPositionWindow/{p=1} p{print} p&&/action:/{exit}' \
  /Users/andrey.vilchinsky/work/seatmaps/Angular/jets-seatmap-angular-lib/.claude/worktrees/starry-frolicking-goose/projects/seatmap-lib/src/lib/constants.ts
```

Paste the emitted key/value lines into the matching React locale block. Angular locale-name → React locale-name mapping is 1:1 by language code (`LOCALIZATION_RU` → `LOCALE_RU`, `LOCALIZATION_PT_BR` → `LOCALE_PT_BR`, etc.). Add all 22 keys to each block. If a given key is genuinely absent from an Angular block, fall back to the English value from Step 6 (the builder's `t()` also falls back to the key name, but an English string reads better).

Note: translation *values* are legitimately non-English data (the whole `i18n.languages.js` file is multilingual); the English-only rule applies to prose, comments, and code — not to the localized strings themselves.

- [ ] **Step 8: Verify locale integrity**

Run: `pnpm test -- --testPathPattern='i18n|SeatMap|Tooltip'`
Expected: PASS — existing locale-dependent suites still green.

Sanity-check every locale gained the anchor key:

```bash
grep -c "seatPositionWindow" src/common/i18n.languages.js
```

Expected: `18` (one per locale).

- [ ] **Step 9: Commit**

```bash
git add src/common/a11y.js src/common/a11y.test.js src/common/index.js src/common/i18n.languages.js
git commit -m "feat(a11y): accessible-name builder + locale keys"
```

---

## Self-Review

**Spec coverage (Wave 0 rows of `docs/wcag/PLAN.md`):**
- Commit 1 (`config.wcag flags + getWcagFlags resolver`) → Task 1. ✓
- Commit 2 (`accessible-name builder + locale keys`) → Task 2. ✓
- Zero-change guarantee → Task 1 Step 1 (all-false test) + Step 7 (SeatMap regression). ✓
- Flags exposed via `JetsContext` → Task 1 Step 6. ✓

**Type/name consistency:** `getWcagFlags`, `wcagFlags` (context key), `computeSeatPosition`, `buildSeatAriaLabel`, `A11Y_LOCALE_KEYS` are used identically across tasks and match the signatures in the "Interfaces" blocks. The resolved-flags object keys match the `config.wcag` field names in `PLAN.md`.

**Placeholder scan:** no TBD/TODO; every code step shows complete code. Step 7 of Task 2 references an external translation source with an exact path and extraction command rather than inventing translations — the EN block (Step 6) is complete and is the guaranteed fallback.

---

## Follow-on

This plan covers **Wave 0 only**. After it lands, write the next plan:
- **Wave A** (`hide decorative graphics`, `prefers-reduced-motion`, `forced-colors`) — always-on, no flag reads.
- **Wave B** (`seat is a button` + `grid scaffolding`) — first consumers of `wcagFlags.gridSemantics`, `buildSeatAriaLabel`, and `computeSeatPosition`.

Each subsequent wave gets its own `docs/superpowers/plans/YYYY-MM-DD-wcag-wave-<X>-*.md` following this same structure.
