# WCAG Wave B + C Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make seats keyboard-accessible screen-reader-friendly grid cells — seats become ARIA `gridcell` buttons with accessible names, decks/rows carry grid/row roles, and 2D arrow-key navigation with roving tabindex works — all behind the opt-in flags, so with `config.wcag` unset nothing changes.

**Architecture:** Wave B (grid semantics, gated on `wcagFlags.gridSemantics`) adds `role`/`aria-*`/`tabindex` to the existing `JetsSeat`/`JetsRow`/`JetsDeck` DOM and threads 1-based row/column indices deck→row→seat. Wave C (keyboard navigation, gated on `wcagFlags.keyboardNavigation`, which implies `gridSemantics`) adds a pure `seat-grid-navigation.js` mover plus keydown/focus wiring in `SeatMap`. This is a JS port of the Angular library's completed implementation.

**Tech Stack:** React 18, plain JavaScript (no TypeScript), Jest + jsdom + @testing-library/react, Storybook, Rollup, pnpm.

## Global Constraints

- Plain JavaScript only — no TypeScript syntax.
- Prettier house style: single quotes, 2-space indent, 120 width, trailing commas ES5, NO parens on single-arg arrows, semicolons required. Husky pre-commit runs Prettier — let it run; re-add/amend if it reformats.
- English only in code, comments, commit messages. No Cyrillic (localized string VALUES exempt).
- Do NOT mention Claude / Claude Code / Co-Authored-By in commit messages or PRs.
- Additive & opt-in. **Zero-change guarantee:** with `wcagFlags.gridSemantics` false, `JetsSeat` renders exactly today's `<div class="jets-seat" ...>` (no `role`, no `aria-*`, no `tabindex`), `JetsRow`/`JetsDeck` render exactly today's DOM. With `keyboardNavigation` false, no keydown/focus handlers do anything. A regression test must assert this.
- Read flags from context: `const { wcagFlags } = useContext(JetsContext)` — `wcagFlags` was added to the provider value in Wave 0 (`SeatMap.js`). Treat it as possibly-undefined defensively (`wcagFlags?.gridSemantics`).
- Reuse the Wave 0 pure modules: `getWcagFlags` (already wired), `buildSeatAriaLabel` / `computeSeatPosition` / `A11Y_LOCALE_KEYS` from `src/common/a11y.js`, and `LOCALES_MAP` from `src/common/constants.js`.
- Run tests via `./node_modules/.bin/jest --testPathPattern='<pattern>'` (pnpm blocks on `engines.node` 22.22.3 vs the local 22.17.0; the jest binary runs fine on 22.17). Focused runs while iterating; the relevant suites once before committing.
- Work from the worktree `/Users/andrey.vilchinsky/work/seatmaps/jets-seatmap-react-lib-pub/.claude/worktrees/wcag` on branch `WCAG`. Paths below are relative to that root.
- **Gating decision (differs from the Angular source):** the Angular source renders the grid ARIA roles unconditionally and gates only the nav handlers. This React port intentionally gates the grid roles on `wcagFlags.gridSemantics` too, to preserve the strict zero-change guarantee. Apply the `gridSemantics` gate exactly where each task says.
- **Reference digest (verbatim Angular source for the port):** `/private/tmp/claude-501/-Users-andrey-vilchinsky-work-seatmaps-Angular-jets-seatmap-angular-lib/783fb71f-c4de-4985-bca0-a85a34ddf9c1/scratchpad/angular-wave-bc-digest.md`. Task 1 ports the nav service verbatim from it.

## File structure

- `src/common/seat-grid-navigation.js` (NEW) — pure nav logic (`classifyKey`, `remapForOrientation`, `move`, `initialCell`, `isInteractive`).
- `src/common/seat-grid-navigation.test.js` (NEW).
- `src/common/index.js` (MODIFY) — export the nav module.
- `src/components/Seat/JetsSeat.js` (MODIFY) — gridcell button/div, ARIA, roving tabindex, activation guard.
- `src/components/Seat/JetsSeat.a11y.test.js` (NEW) — grid-semantics render tests + zero-change test.
- `src/components/Row/index.js` (MODIFY) — `role="row"`, `aria-rowindex`, thread `colIndex`/`rowIndex`/`rowSeats` to seats.
- `src/components/Deck/index.js` (MODIFY) — `role="grid"`, `aria-rowcount`/`aria-colcount`/`aria-label`, thread `rowIndex`.
- `src/components/PlaneBody/index.js` (MODIFY) — `data-deck-index` on each per-deck wrapper.
- `src/components/SeatMap/SeatMap.js` (MODIFY) — `focusedCell`, `onGridKeydown`, `onGridFocusin`, roving/focus helpers, seeding effect.
- `src/components/SeatMap/SeatMap.keyboard.test.js` (NEW) — keyboard-nav integration tests.

---

### Task 1: Pure seat-grid-navigation module

Port the Angular `SeatGridNavigationService` (verbatim in the reference digest, section C.4) to a framework-free JS module of pure functions. It has no DOM/React dependency and is fully unit-testable — do it first.

**Files:**
- Create: `src/common/seat-grid-navigation.js`
- Test: `src/common/seat-grid-navigation.test.js`
- Modify: `src/common/index.js`

**Interfaces:**
- Consumes: `decks` = the `content` array (each deck `{ rows: [{ seats: [{ type, status, ... }] }] }`); `ICellPos = { deckIdx, rowIdx, colIdx }` (0-based indices into the data arrays — NOT the 1-based aria indices).
- Produces (all exported from `src/common/seat-grid-navigation.js`):
  - `classifyKey(ev) -> TGridKey | null`
  - `remapForOrientation(key, horizontal, rightToLeft) -> TGridKey`
  - `move(from, key, decks) -> ICellPos` (returns the SAME `from` object reference on a no-op — callers compare with `===`)
  - `initialCell(deckIdx, decks) -> ICellPos`
  - `isInteractive(decks, pos) -> boolean`
  - `PAGE_STEP` constant (= 5)

- [ ] **Step 1: Write the failing test**

Create `src/common/seat-grid-navigation.test.js`:

```js
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `./node_modules/.bin/jest --testPathPattern='seat-grid-navigation'`
Expected: FAIL — `Cannot find module './seat-grid-navigation'`.

- [ ] **Step 3: Port the module (TS→JS, verbatim logic)**

Open the reference digest section **C.4** and port the `SeatGridNavigationService` class to `src/common/seat-grid-navigation.js` as a module of pure functions. Mechanical conversion rules — apply exactly, change no logic:
- Drop all TypeScript: `import { Injectable } ...`, `@Injectable(...)`, the `class` wrapper, every type annotation (`: ICellPos`, `: number`, `ReadonlySet<TSeatStatus>`, `Partial<Record<...>>`, the `interface ICellPos`, the `type TGridKey`).
- Each `private` method becomes a module-level `function` (not exported). Each `public` method becomes an `export function`.
- Replace every `this.<method>(` call with `<method>(` (direct function call).
- Keep `const PAGE_STEP = 5;` (export it) and `const INTERACTIVE_STATUSES = new Set(['available', 'selected', 'preferred', 'extra']);`.
- Preserve the referential-equality no-op contract exactly: wherever the source returns `from`, return the same `from` parameter (do not clone).
- Keep the JSDoc comments (translate none — they are already English) so the behavior notes survive.

The public exports must be: `classifyKey`, `remapForOrientation`, `move`, `initialCell`, `isInteractive`, `PAGE_STEP`. Private helpers: `isSeatCell`, `stepHorizontal`, `stepVertical`, `firstSeatCol`, `lastSeatCol`, `nearestSeatCol`, `firstSeatCellOfDeck`, `lastSeatCellOfDeck`, `skim`, `isSeatInteractive`.

- [ ] **Step 4: Run test to verify it passes**

Run: `./node_modules/.bin/jest --testPathPattern='seat-grid-navigation'`
Expected: PASS — all tests green.

- [ ] **Step 5: Re-export from the common barrel**

Modify `src/common/index.js` — add after the `a11y` export:

```js
export * from './seat-grid-navigation';
```

- [ ] **Step 6: Commit**

```bash
git add src/common/seat-grid-navigation.js src/common/seat-grid-navigation.test.js src/common/index.js
git commit -m "feat(a11y): 2D grid navigation logic (pure module)"
```

---

### Task 2: Grid semantics — seat button, deck/row roles, index threading

Gate on `wcagFlags.gridSemantics`. When on: `JetsSeat` becomes a `<button type="button" role="gridcell">` (real seats) or `<div role="gridcell">` (aisle/empty/index) with accessible name + ARIA + roving tabindex; `JetsRow` gets `role="row"` + `aria-rowindex`; `JetsDeck` gets `role="grid"` + counts + label; `PlaneBody` tags each deck wrapper with `data-deck-index`. When off: DOM is byte-identical to today.

**Files:**
- Modify: `src/components/Seat/JetsSeat.js`, `src/components/Row/index.js`, `src/components/Deck/index.js`, `src/components/PlaneBody/index.js`
- Test: `src/components/Seat/JetsSeat.a11y.test.js`

**Interfaces:**
- Consumes: `wcagFlags` (context), `buildSeatAriaLabel`/`computeSeatPosition` (a11y.js), `LOCALES_MAP`/`DEFAULT_LANG`/`ENTITY_TYPE_MAP`/`ENTITY_STATUS_MAP` (constants). New `JetsSeat` props: `colIndex` (1-based), `rowIndex` (1-based), `rowSeats` (the row's `seats` array, for position). New `JetsRow` prop: `rowIndex` (1-based).
- Produces: DOM contract the keyboard wiring (Task 3) queries — `[role="gridcell"]` cells carrying `aria-rowindex`/`aria-colindex` (1-based) inside a `[role="grid"]`; each deck wrapper carrying `data-deck-index` (0-based, into `content`).

- [ ] **Step 1: Write the failing test**

Create `src/components/Seat/JetsSeat.a11y.test.js`:

```js
import React from 'react';
import { render, screen } from '@testing-library/react';
import { JetsContext } from '../../common';
import { JetsSeat } from './JetsSeat';

const baseCtx = {
  onSeatClick: jest.fn(),
  showTooltip: jest.fn(),
  onTooltipClose: jest.fn(),
  resetSeatJumpTo: jest.fn(),
  seatLabelJumpTo: null,
  params: { tooltipOnHover: false, antiRotation: '', antiScale: 1, isHorizontal: false },
  config: { lang: 'EN', visibleSeatPriceLabels: false },
  colorTheme: {
    defaultPassengerBadgeColor: '#fff',
    defaultPassengerBadgeLabelColor: '#000',
    defaultPassengerBadgeBorderColor: '#000',
    seatStrokeColor: '#000',
    seatArmrestColor: '#ccc',
    seatStrokeWidth: 1,
    seatLabelColor: '#000',
  },
};

const seatData = (over = {}) => ({
  uniqId: 's1',
  letter: 'A',
  type: 'seat',
  status: 'available',
  size: { width: 30, height: 30 },
  number: '14C',
  seatType: 1,
  seatIconType: 1,
  topOffset: 0,
  leftOffset: 0,
  ...over,
});

const renderSeat = (data, ctx) =>
  render(
    <JetsContext.Provider value={ctx}>
      <JetsSeat data={data} colIndex={3} rowIndex={14} rowSeats={[data]} />
    </JetsContext.Provider>
  );

describe('JetsSeat WCAG grid semantics', () => {
  it('renders a plain div with no ARIA when gridSemantics is off (zero-change)', () => {
    renderSeat(seatData(), { ...baseCtx, wcagFlags: { gridSemantics: false, keyboardNavigation: false } });
    const el = screen.getByTestId('jets-seat');
    expect(el.tagName).toBe('DIV');
    expect(el).not.toHaveAttribute('role');
    expect(el).not.toHaveAttribute('aria-label');
    expect(el).not.toHaveAttribute('tabindex');
  });

  it('renders a gridcell button with an accessible name when gridSemantics is on', () => {
    renderSeat(seatData({ price: 12, currency: '€' }), {
      ...baseCtx,
      wcagFlags: { gridSemantics: true, keyboardNavigation: false },
    });
    const el = screen.getByTestId('jets-seat');
    expect(el.tagName).toBe('BUTTON');
    expect(el).toHaveAttribute('role', 'gridcell');
    expect(el).toHaveAttribute('aria-colindex', '3');
    expect(el).toHaveAttribute('aria-rowindex', '14');
    expect(el).toHaveAttribute('aria-label', expect.stringContaining('14C'));
    expect(el).toHaveAttribute('aria-selected', 'false');
    expect(el).toHaveAttribute('tabindex', '0'); // gridSemantics on, keyboardNavigation off -> seat is a tab stop
  });

  it('marks an unavailable seat aria-disabled and omits aria-selected', () => {
    renderSeat(seatData({ status: 'unavailable' }), {
      ...baseCtx,
      wcagFlags: { gridSemantics: true, keyboardNavigation: false },
    });
    const el = screen.getByTestId('jets-seat');
    expect(el).toHaveAttribute('aria-disabled', 'true');
    expect(el).not.toHaveAttribute('aria-selected');
  });

  it('does not activate an unavailable seat on click', () => {
    const onSeatClick = jest.fn();
    renderSeat(seatData({ status: 'unavailable' }), {
      ...baseCtx,
      onSeatClick,
      wcagFlags: { gridSemantics: true, keyboardNavigation: false },
    });
    screen.getByTestId('jets-seat').click();
    expect(onSeatClick).not.toHaveBeenCalled();
  });

  it('renders an aisle cell as a non-button gridcell with tabindex -1', () => {
    renderSeat(seatData({ type: 'aisle', number: undefined, seatType: undefined }), {
      ...baseCtx,
      wcagFlags: { gridSemantics: true, keyboardNavigation: false },
    });
    const el = screen.getByTestId('jets-seat');
    expect(el.tagName).toBe('DIV');
    expect(el).toHaveAttribute('role', 'gridcell');
    expect(el).toHaveAttribute('tabindex', '-1');
    expect(el).toHaveAttribute('aria-label');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `./node_modules/.bin/jest --testPathPattern='JetsSeat.a11y'`
Expected: FAIL — seat still renders a `<div>` with no role/aria.

- [ ] **Step 3: Rewrite `JetsSeat.js` root element**

In `src/components/Seat/JetsSeat.js`:

1. Extend the imports and context destructure:

```js
import { JetsContext, ENTITY_TYPE_MAP, ENTITY_STATUS_MAP, LOCALES_MAP, DEFAULT_LANG, JetsDataHelper, buildSeatAriaLabel, computeSeatPosition } from '../../common';
```
```js
export const JetsSeat = ({ data, colIndex, rowIndex, rowSeats }) => {
  const {
    onSeatClick,
    showTooltip,
    onTooltipClose,
    seatLabelJumpTo,
    resetSeatJumpTo,
    params,
    config,
    colorTheme,
    wcagFlags,
  } = useContext(JetsContext);
```

2. After `const { index, aisle } = ENTITY_TYPE_MAP;` and the existing `componentClassNames`, add the WCAG derivations:

```js
  const gridOn = !!wcagFlags?.gridSemantics;
  const keyboardOn = !!wcagFlags?.keyboardNavigation;
  const isSeatType = type === ENTITY_TYPE_MAP.seat;
  const isInteractiveSeat =
    isSeatType &&
    (status === ENTITY_STATUS_MAP.available ||
      status === ENTITY_STATUS_MAP.selected ||
      status === ENTITY_STATUS_MAP.preferred ||
      status === ENTITY_STATUS_MAP.extra);

  const locale = LOCALES_MAP[config?.lang] ?? LOCALES_MAP[DEFAULT_LANG] ?? {};

  const seatAriaLabel = isSeatType
    ? buildSeatAriaLabel(data, computeSeatPosition(data, { seats: rowSeats ?? [data] }), locale)
    : null;

  const nonSeatAriaLabel = () => {
    if (isSeatType) return null;
    if (type === ENTITY_TYPE_MAP.aisle) return locale['aisle'] || 'aisle';
    if (type === ENTITY_TYPE_MAP.empty) return locale['empty'] || 'empty';
    if (type === ENTITY_TYPE_MAP.index) {
      const rowLabel = locale['row'] || 'Row';
      return number ? `${rowLabel} ${number}` : locale['index'] || rowLabel;
    }
    return locale['empty'] || 'empty';
  };

  const ariaSelected = isInteractiveSeat
    ? status === ENTITY_STATUS_MAP.selected ||
      status === ENTITY_STATUS_MAP.preferred ||
      status === ENTITY_STATUS_MAP.extra
    : null;
  const ariaDisabled = isSeatType && !isInteractiveSeat;

  // Roving tabindex: when keyboard nav is on, every cell starts at -1 and the
  // SeatMap roving effect promotes exactly one to 0. When grid semantics are on
  // but keyboard nav is off, a real seat stays an individual tab stop.
  const rovingTabIndex = keyboardOn ? -1 : isSeatType ? 0 : -1;

  const gridAttrs = gridOn
    ? {
        role: 'gridcell',
        tabIndex: rovingTabIndex,
        ...(colIndex != null ? { 'aria-colindex': colIndex } : {}),
        ...(rowIndex != null ? { 'aria-rowindex': rowIndex } : {}),
        ...(isSeatType
          ? {
              type: 'button',
              ...(seatAriaLabel ? { 'aria-label': seatAriaLabel } : {}),
              ...(ariaSelected === null ? {} : { 'aria-selected': ariaSelected }),
              ...(ariaDisabled ? { 'aria-disabled': 'true' } : {}),
            }
          : { 'aria-label': nonSeatAriaLabel() }),
      }
    : {};

  const RootTag = gridOn && isSeatType ? 'button' : 'div';

  const handleClick = e => {
    if (gridOn && isSeatType && !isInteractiveSeat) return;
    onSeatClick(data, $component, e);
  };
```

3. Replace the returned root element. Change the opening `<div ... onClick={e => onSeatClick(data, $component, e)} ... data-testid="jets-seat">` to use `RootTag`, `handleClick`, and spread `gridAttrs`, and change the matching closing `</div>` to `</RootTag>`:

```jsx
  return (
    <RootTag
      ref={$component}
      style={style}
      className={componentClassNames}
      onClick={handleClick}
      onMouseEnter={params.tooltipOnHover ? e => showTooltip(data, $component, e) : null}
      onMouseLeave={params.tooltipOnHover ? e => onMouseLeave(data, $component, e) : null}
      data-testid="jets-seat"
      {...gridAttrs}
    >
      {/* ...existing children unchanged... */}
    </RootTag>
  );
```

Leave every child (`SeatPriceLabel`, `.jets-seat-number`, `SeatIcon`, passenger badge, index content) exactly as-is.

- [ ] **Step 4: Run the seat test to verify it passes**

Run: `./node_modules/.bin/jest --testPathPattern='JetsSeat'`
Expected: PASS — the new a11y suite green and the existing `JetsSeat` suites still green.

- [ ] **Step 5: Add `role="row"` + `aria-rowindex` and thread indices in `JetsRow`**

Rewrite `src/components/Row/index.js`:

```js
import React, { useContext, useRef } from 'react';
import { JetsContext } from '../../common';
import { JetsSeat } from '../Seat';
import './index.css';

export const JetsRow = ({ seats, top, rowIndex }) => {
  const elementRef = useRef(null);
  const { componentOverrides, wcagFlags } = useContext(JetsContext);
  const gridOn = !!wcagFlags?.gridSemantics;

  const ResolvedJetsSeat = componentOverrides?.JetsSeat ?? JetsSeat;
  const rowAttrs = gridOn ? { role: 'row', ...(rowIndex != null ? { 'aria-rowindex': rowIndex } : {}) } : {};

  return (
    <div className="jets-row" style={{ top }} ref={elementRef} {...rowAttrs}>
      {seats?.map((seat, i) => (
        <ResolvedJetsSeat key={seat.uniqId} data={seat} colIndex={i + 1} rowIndex={rowIndex} rowSeats={seats} />
      ))}
    </div>
  );
};
```

- [ ] **Step 6: Add `role="grid"` + counts + label and thread `rowIndex` in `JetsDeck`**

In `src/components/Deck/index.js`, add `wcagFlags` and `DEFAULT_LANG` to the imports/destructure, compute the grid attributes, spread them on the `.jets-deck` root, and pass `rowIndex={i + 1}` to each row:

```js
import { JetsContext, LOCALES_MAP, DEFAULT_LANG, DEFAULT_DECK_TITLE_HEIGHT, DEFAULT_DECK_PADDING_SIZE } from '../../common';
```
```js
  const { params, wcagFlags } = useContext(JetsContext);
  const gridOn = !!wcagFlags?.gridSemantics;

  const deckRows = rows ?? [];
  const gridLabel = () => {
    const loc = LOCALES_MAP[lang] ?? LOCALES_MAP[DEFAULT_LANG] ?? {};
    const base = loc['gridLabel'] || 'Seat map';
    const ctx = number != null ? `${loc['deck'] || 'Deck'} ${number}` : '';
    return ctx ? `${base} — ${ctx}` : base;
  };
  const colCount = deckRows.reduce((max, r) => Math.max(max, r.seats?.length ?? 0), 0);
  const gridAttrs = gridOn
    ? { role: 'grid', 'aria-label': gridLabel(), 'aria-rowcount': deckRows.length, 'aria-colcount': colCount }
    : {};
```

Change the deck root element to spread `gridAttrs`:

```jsx
    <div className="jets-deck" style={deckStyle} ref={elementRef} {...gridAttrs}>
```

Change the rows map to pass a 1-based `rowIndex`:

```jsx
      {rows.map((row, i) => (
        <JetsRow key={row.uniqId} seats={row.seats} top={row.topOffset} rowIndex={i + 1} />
      ))}
```

- [ ] **Step 7: Tag each deck wrapper with `data-deck-index` in `PlaneBody`**

In `src/components/PlaneBody/index.js`, the per-deck wrapper `<div className="deck-floor tooltip-holder" ...>` is inside a map that may reverse `decks` in horizontal LTR. Compute the ORIGINAL `content` index and set it as `data-deck-index` so the keyboard wiring resolves the correct deck:

Immediately inside the `decks?.map((deck, index) => ...)` callback body, before the returned JSX, add:

```js
              const originalDeckIndex = config?.horizontal && !config?.rightToLeft ? decks.length - 1 - index : index;
```

Then add the attribute to the `deck-floor tooltip-holder` div:

```jsx
                <div
                  data-testid="jets-plane-body-deck"
                  data-deck-index={originalDeckIndex}
                  ref={element => {
                    elementRefs.current[index] = element;
                  }}
                  className="deck-floor tooltip-holder"
```

(Note: the map currently uses an implicit-return ternary `!showOneDeck || index == deckToShow ? (<JSX>) : null`. Convert that arm to a block body — `{ const originalDeckIndex = ...; return (<JSX>); }` — so the `const` has somewhere to live. Keep the `: null` arm.)

- [ ] **Step 8: Run the affected suites**

Run: `./node_modules/.bin/jest --testPathPattern='JetsSeat|Row|Deck|PlaneBody|SeatMap'`
Expected: PASS — new a11y suite green; existing row/deck/planebody/seatmap suites green (DOM additions are gated off by default, so existing snapshot/DOM assertions that render without `wcagFlags` are unaffected).

- [ ] **Step 9: Commit**

```bash
git add src/components/Seat/JetsSeat.js src/components/Seat/JetsSeat.a11y.test.js src/components/Row/index.js src/components/Deck/index.js src/components/PlaneBody/index.js
git commit -m "feat(a11y): grid semantics (role=grid/row/gridcell, ARIA names, indices)"
```

---

### Task 3: Keyboard navigation + roving tabindex wiring

Gate on `wcagFlags.keyboardNavigation`. Add `focusedCell` state and keydown/focus handlers on the seat-map container so Arrow/Home/End/Ctrl+Home/End/PageUp/Down/Ctrl+Arrow move focus across the grid, with roving tabindex keeping exactly one cell in the tab order. Enter/Space activation is handled for free by the native `<button>` (Task 2). Escape closes an open tooltip.

**Files:**
- Modify: `src/components/SeatMap/SeatMap.js`
- Test: `src/components/SeatMap/SeatMap.keyboard.test.js`

**Interfaces:**
- Consumes: the pure nav module (Task 1), the grid DOM contract (Task 2 — `[role="gridcell"]` with 1-based `aria-rowindex`/`aria-colindex`, deck wrappers with `data-deck-index`), the existing `seatMapRef`, `content`, `activeDeck`, `configuration`, `activeTooltip`, `onTooltipClose`.
- Produces: no new public API — internal focus behavior.

- [ ] **Step 1: Write the failing test**

Create `src/components/SeatMap/SeatMap.keyboard.test.js`. Model the mount/fixture on the existing `src/components/SeatMap/SeatMap.integration.test.js` (read it first for the data mocks and render helper). The test renders a `SeatMap` with `config.wcag = { enabled: true }` and a fixture with at least two seat rows, then asserts keyboard behavior:

```js
// Mirror the render/mocks from SeatMap.integration.test.js. Then:
import { fireEvent, screen } from '@testing-library/react';

describe('SeatMap keyboard navigation', () => {
  it('after load exactly one gridcell is in the tab order (tabindex=0)', async () => {
    // ...render SeatMap with config.wcag.enabled=true and a seat fixture, await init...
    const container = screen.getByTestId('jets-seat-map');
    const tabbable = container.querySelectorAll('[role="gridcell"][tabindex="0"]');
    expect(tabbable.length).toBe(1);
  });

  it('ArrowDown moves focus to a different gridcell', async () => {
    // ...render + await init...
    const container = screen.getByTestId('jets-seat-map');
    const first = container.querySelector('[role="gridcell"][tabindex="0"]');
    first.focus();
    fireEvent.keyDown(container, { key: 'ArrowDown' });
    expect(document.activeElement).not.toBe(first);
    expect(document.activeElement.getAttribute('role')).toBe('gridcell');
  });

  it('does nothing when wcag is off (zero-change): no gridcells, arrow keys inert', async () => {
    // ...render SeatMap WITHOUT config.wcag...
    const container = screen.getByTestId('jets-seat-map');
    expect(container.querySelectorAll('[role="gridcell"]').length).toBe(0);
    fireEvent.keyDown(container, { key: 'ArrowDown' }); // must not throw
  });
});
```

If a full `SeatMap` mount proves impractical in the harness, instead unit-test the two imperative helpers by extracting them (see Step 3) against a hand-built DOM fixture that mimics the gridcell markup — but prefer the integration approach mirroring the existing suite.

- [ ] **Step 2: Run test to verify it fails**

Run: `./node_modules/.bin/jest --testPathPattern='SeatMap.keyboard'`
Expected: FAIL — no roving tabindex applied / arrow keys do nothing.

- [ ] **Step 3: Wire the handlers into `SeatMap.js`**

In `src/components/SeatMap/SeatMap.js`:

1. Add to the `'../../common'` import: `classifyKey`, `remapForOrientation`, `move`, `initialCell`. Add `useRef` is already imported; ensure `useEffect`, `useState` are too (they are).

2. Near the other `useState`/`useRef` declarations (around `const [activeDeck, setActiveDeck] = useState(0);`), add:

```js
  const [focusedCell, setFocusedCell] = useState({ deckIdx: 0, rowIdx: 0, colIdx: 0 });
  const focusedCellRef = useRef(focusedCell);
  focusedCellRef.current = focusedCell;
```

3. Add the handlers and helpers (place them alongside the other handler definitions, before `providerValue`). `seatMapRef`, `content`, `activeDeck`, `configuration`, `activeTooltip`, `onTooltipClose`, `wcagFlags` are all already in scope:

```js
  const applyRovingTabindex = pos => {
    const container = seatMapRef.current;
    if (!container) return;
    const focusedRow = String(pos.rowIdx + 1);
    const focusedCol = String(pos.colIdx + 1);
    container.querySelectorAll('[role="gridcell"]').forEach(cell => {
      const isFocused =
        cell.getAttribute('aria-rowindex') === focusedRow && cell.getAttribute('aria-colindex') === focusedCol;
      cell.setAttribute('tabindex', isFocused ? '0' : '-1');
    });
  };

  const focusCell = pos => {
    const container = seatMapRef.current;
    if (!container) return;
    const el = container.querySelector(
      `[role="gridcell"][aria-rowindex="${pos.rowIdx + 1}"][aria-colindex="${pos.colIdx + 1}"]`
    );
    el?.focus?.();
  };

  const onGridKeydown = event => {
    if (wcagFlags?.keyboardNavigation && event.key === 'Escape' && activeTooltip) {
      onTooltipClose();
      event.preventDefault();
      return;
    }
    if (!wcagFlags?.keyboardNavigation) return;

    const rawKey = classifyKey(event.nativeEvent ?? event);
    if (!rawKey) return;

    const key = remapForOrientation(rawKey, configuration.horizontal ?? false, configuration.rightToLeft ?? false);
    const from = focusedCellRef.current;
    const next = move(from, key, content);
    if (next === from) return;

    event.preventDefault();
    event.stopPropagation();
    focusedCellRef.current = next;
    setFocusedCell(next);
    applyRovingTabindex(next);
    focusCell(next);
  };

  const onGridFocusin = event => {
    if (!wcagFlags?.keyboardNavigation) return;
    const el = event.target;
    const rowAttr = el?.getAttribute?.('aria-rowindex');
    const colAttr = el?.getAttribute?.('aria-colindex');
    if (rowAttr == null || colAttr == null) return;
    const rowIdx = parseInt(rowAttr, 10) - 1;
    const colIdx = parseInt(colAttr, 10) - 1;
    if (isNaN(rowIdx) || isNaN(colIdx)) return;
    const deckAttr = el.closest?.('[data-deck-index]')?.getAttribute('data-deck-index');
    const parsedDeck = deckAttr != null ? parseInt(deckAttr, 10) : NaN;
    const deckIdx = !isNaN(parsedDeck) ? parsedDeck : activeDeck;
    const next = { deckIdx, rowIdx, colIdx };
    focusedCellRef.current = next;
    setFocusedCell(next);
    applyRovingTabindex(next);
  };
```

4. Seed the roving anchor after the map has content. Add an effect (after the existing effects):

```js
  useEffect(() => {
    if (!wcagFlags?.keyboardNavigation) return;
    if (!content?.length) return;
    const seed = initialCell(activeDeck, content);
    focusedCellRef.current = seed;
    setFocusedCell(seed);
    const id = setTimeout(() => applyRovingTabindex(seed), 0);
    return () => clearTimeout(id);
  }, [content, activeDeck, wcagFlags?.keyboardNavigation]);
```

5. Attach the handlers to the seat-map container. On the root `<div ref={seatMapRef} className={seatMapClassName} ...>` add:

```jsx
        onKeyDown={onGridKeydown}
        onFocus={onGridFocusin}
```

(React's `onFocus` bubbles, serving as the `focusin` equivalent. Leave the existing `onClick`/style/`data-testid` intact.)

- [ ] **Step 4: Run the keyboard test to verify it passes**

Run: `./node_modules/.bin/jest --testPathPattern='SeatMap'`
Expected: PASS — the keyboard suite green and the existing SeatMap suites still green.

- [ ] **Step 5: Run the full suite (final gate for this wave)**

Run: `./node_modules/.bin/jest`
Expected: PASS — all suites green, no regressions.

- [ ] **Step 6: Commit**

```bash
git add src/components/SeatMap/SeatMap.js src/components/SeatMap/SeatMap.keyboard.test.js
git commit -m "feat(a11y): 2D keyboard navigation + roving tabindex wiring"
```

---

## Self-Review

**Spec coverage (PLAN.md Wave B rows 6–7, Wave C row 8):**
- Seat button + ARIA semantics (row 6) → Task 2 Steps 3–4. ✓
- Grid scaffolding role=grid/row/gridcell (row 7) → Task 2 Steps 5–7. ✓
- 2D keyboard navigation + roving tabindex (row 8) → Task 1 (logic) + Task 3 (wiring). ✓
- Zero-change guarantee → Task 2 Step 1 (plain-div test) + Task 3 Step 1 (wcag-off test). ✓
- Gating: `gridSemantics` gates Task 2 DOM; `keyboardNavigation` gates Task 3 handlers; the implication (`keyboardNavigation` ⇒ `gridSemantics`) is enforced by `getWcagFlags` from Wave 0. ✓

**Type/name consistency:** `wcagFlags`, `gridSemantics`, `keyboardNavigation`, `buildSeatAriaLabel`, `computeSeatPosition`, `classifyKey`/`remapForOrientation`/`move`/`initialCell`/`isInteractive`, `focusedCell`/`ICellPos {deckIdx,rowIdx,colIdx}`, `data-deck-index`, 1-based `aria-rowindex`/`aria-colindex` are used identically across tasks. Seat props `colIndex`/`rowIndex`/`rowSeats` are produced by Row (Task 2) and consumed by Seat (Task 2).

**Placeholder scan:** Task 1 Step 3 references the reference digest for the verbatim source with an exact conversion recipe — the source is a concrete complete file, not a placeholder. All other code steps inline complete code.

**Known limitation (documented, not fixed — parity with Angular):** in horizontal mode the arrow remap is applied but tooltip positioning under CSS rotation is not corrected, and multi-deck (all decks stacked, not single-deck) roving matches by row/col only. Both mirror the Angular source and are recorded in the ACR later (Wave G).

---

## Follow-on

After this wave lands and tests pass, the next step (per the user's request) is to **record Playwright videos** demonstrating each now-visible feature (seats focusable as buttons, screen-reader names, arrow-key navigation, roving single-tab-stop, Escape) against a Storybook story that mounts `JetsSeatMap` with `config.wcag.enabled = true`. That is a separate verification effort, not a code task in this plan.
