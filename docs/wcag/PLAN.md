# Plan: WCAG 2.2 AA for `@seatmaps.com/react-lib`

> **Source of truth:** `docs/wcag/PLAN.md` in the `jets-seatmap-react-lib-pub` repository, branch `WCAG` (created from `origin/version-3`).
>
> This is a port of the already-completed WCAG 2.2 AA work from the sibling repository `jets-seatmap-angular-lib` (branch `WCAG`, `docs/wcag/PLAN.md`, 17 commits). The Angular plan is the reference and the "behavioural source of truth". This document records how the same result is reproduced in the React library, **entirely behind opt-in flags**, so that consumers who do not enable WCAG see absolutely no change.
>
> **Cross-session protocol:**
> 1. At the start of a new session, read the "Status", "Progress tracking", "Decisions log", and "Open questions" sections.
> 2. The current focus is stated in "Status" — continue from there.
> 3. After each completed commit: tick the checkbox in "Progress tracking", add the SHA, update "Status.Next".
> 4. Decisions made when choosing between plan options — record in the "Decisions log" with a date.

---

## Status

- **Last updated:** 2026-07-13 — plan drafted and approved. Implementation not started. The `WCAG` branch contains only this document.
- **Current wave:** Wave 0 (foundation) — next to execute.
- **Scope:** full parity with Angular (all 17 commits), grouped into waves 0 / A–G. Implementation is incremental — the document is meant to be returned to and finished wave by wave.
- **Blockers:** none.

## Context

The goal is to bring the React library `@seatmaps.com/react-lib` (`jets-seatmap-react-lib-pub`) to WCAG 2.2 level AA (with WCAG 2.1 AA as the mandatory minimum), so that an ACR/VPAT can be published. Today the seat map component is fully inaccessible: seats are `<div>` elements with no ARIA semantics and no role, there is not a single `aria-*` attribute, there is no keyboard navigation and no focus styles, the tooltip has no `role`, and there is no live region for screen readers. The following criteria fail: 1.1.1, 1.3.1, 1.4.3, 1.4.11, 1.4.13, 2.1.1, 2.4.1, 2.4.3, 2.4.7, 2.4.11, 2.5.8, 3.3.1, 3.3.3, 4.1.2, 4.1.3.

Stack: React 18, plain JavaScript (no TypeScript), React Context (`JetsContext`) for state, Rollup for the build (CJS + ESM), Jest + jsdom + Testing Library for unit/integration, Storybook for previews. The main branch is `version-3`. The public API of `JetsSeatMap` is a contract: changes must be additive only; DOM changes are acceptable as long as the CSS classes (`.jets-seat`, `.jets-row`, ...) and `data-*` attributes (`data-testid`) that consumers may rely on are preserved.

**Fundamental principle:** all WCAG functionality is hidden behind `config.wcag`. Without that sub-object (or with `enabled: false`), the flag resolver returns everything as `false`, and rendering / DOM / behaviour are identical to the current library.

---

## Toggle model (opt-in contract) — mirror of Angular

An exact reproduction of the Angular model (`IWcagConfig` + `getWcagFlags`). Because the React library is plain JS, the "interface" is described with JSDoc and the resolver is an ordinary pure function.

### `config.wcag` shape

| Field | Type | Default | Purpose |
|---|---|---|---|
| `enabled` | boolean | `false` | Master shortcut: when `true`, every sub-flag below defaults to `true` unless explicitly set to `false`. |
| `defaultColorTheme` | boolean | `false` | Use the AA-contrast palette (`WCAG_COLOR_THEME`) as the base for merging `config.colorTheme` instead of the historical one. |
| `liveAnnouncer` | boolean | `false` | Announce select / unselect / jump through a custom live region (`aria-live="polite"`). |
| `visibleRestrictionReason` | boolean | `false` | Visible explanation line under a disabled Select button in the tooltip + `aria-describedby`. |
| `landmarksAndSkipLink` | boolean | `false` | Landmark region with a heading + a skip link that jumps past the map. |
| `gridSemantics` | boolean | `false` | ARIA grid semantics (`role="grid"/"row"/"gridcell"`, `aria-row/colindex/count`, seats as buttons). |
| `keyboardNavigation` | boolean | `false` | 2D arrow navigation with roving tabindex. **Implies `gridSemantics`.** |
| `tooltipDialog` | boolean | `false` | Tooltip as a non-modal `role="dialog"` (auto-focus, Escape, focus return). |
| `alternativeView` | `'grid' \| 'list' \| 'auto'` | `'grid'` | Three-state render mode (not a boolean). `'auto'` switches to list below 480px. |

### `getWcagFlags(config)` — resolution rules

A port of `projects/seatmap-lib/src/lib/utils/wcag-flags.ts`. A pure function in `src/common/wcag-flags.js`. Rules, in order:

1. Every individual flag defaults to `false` (pre-WCAG parity).
2. When `wcag.enabled === true`, any flag equal to `undefined` becomes `true`. Flags explicitly set to `false` stay `false` — this is what lets a consumer say "everything on except, say, liveAnnouncer".
3. `keyboardNavigation` requires `gridSemantics`: if `gridSemantics` resolves to `false`, `keyboardNavigation` is forced to `false` (otherwise arrow keys silently break — they locate cells by `aria-rowindex`/`aria-colindex`).
4. `alternativeView` is three-state: read from `wcag.alternativeView`, then fall back to the deprecated top-level `config.alternativeView`, then `'grid'`.

The resolved flag set is placed into `JetsContext` (which already carries `config`, `params`, `colorTheme`), so components read flags from context rather than reaching into `config.wcag?` directly.

### Three always-on "free" features

Three features are not tied to flags and are always enabled, because they change neither the visuals nor the behaviour for a regular user (decision approved 2026-07-13):
- `aria-hidden="true"` on decorative SVGs — invisible to sighted users;
- `@media (prefers-reduced-motion: reduce)` — only fires when the user has that OS setting;
- `@media (forced-colors: active)` — only fires in Windows High Contrast.

---

## Gap analysis against WCAG 2.2 A/AA criteria

| Criterion | Current React status | Required | Flag |
|---|---|---|---|
| 1.1.1 Non-text content (A) | FAIL | Decorative SVGs (fuselage, nose, tail, wings, separators, bulk, exits, amenity icons) get `aria-hidden`. Functional graphics get an accessible name on the seat button. | always-on / `gridSemantics` |
| 1.3.1 Info & Relationships (A) | FAIL | Grid semantics: `role="grid"` per deck, `role="row"` + `aria-rowindex`, `role="gridcell"` + `aria-colindex`, `aria-selected/disabled/rowcount/colcount`. | `gridSemantics` |
| 1.4.1 Use of Color (A) | PARTIAL | Cross for unavailable / checkmark for selected already exist in the theme. Document in README as mandatory. | docs |
| 1.4.3 Contrast text (AA) | FAIL | Default `THEME_*` colours (`constants.js`) are not verified for 4.5:1. Assemble `WCAG_COLOR_THEME`. Replace the disabled `opacity` with a discrete token. | `defaultColorTheme` |
| 1.4.10 Reflow (AA) | EXEMPT | The map is a 2D diagram (the "2D layout required for meaning" exception). Formally not violated; the list view is motivated via 2.5.8. | `alternativeView` |
| 1.4.11 Non-text contrast (AA) | FAIL | Focus ring 2px ≥3:1. State borders ≥3:1. | `gridSemantics` |
| 1.4.13 Content on hover/focus (AA) | FAIL | `tooltipOnHover` does not open the tooltip on keyboard focus; it closes instantly when the cursor leaves (not hoverable); no Esc. Open on focus, close with a delay, keep open while focus/cursor is inside, Esc closes. | `tooltipDialog` |
| 2.1.1 Keyboard (A) | FAIL | Full keyboard navigation over the grid: Arrow/Home/End/Ctrl+Home/End/PageUp/Down/Ctrl+Arrow/Enter/Space/Esc. | `keyboardNavigation` |
| 2.1.2 No keyboard trap (A) | PASS | No trap. Preserve: tooltip non-modal, Tab exits naturally. | — |
| 2.4.1 Bypass blocks (A) | FAIL | `role="region"` + visually-hidden heading + skip link to an anchor after the grid. | `landmarksAndSkipLink` |
| 2.4.3 Focus order (A) | N/A | After the grid — one tab stop (roving). Order: deck selector → grid → tooltip → the element after the skip link. | `keyboardNavigation` |
| 2.4.7 Focus visible (AA) | FAIL | `:focus-visible { outline: 2px solid; outline-offset: 2px; }` on seat button, tooltip buttons, deck selector. | `gridSemantics` |
| 2.4.11 Focus not obscured (AA) | UNCERTAIN | Guarantee `scrollIntoView` on the focused cell. Host sticky headers are a host responsibility. | `keyboardNavigation` |
| 2.5.7 Dragging (AA) | N/A | No dragging. | — |
| 2.5.8 Target size (AA) | UNCERTAIN | Minimum 24×24 CSS px on the seat button. Under a narrow layout — list view as an alternative path. | `alternativeView` |
| 3.3.1 / 3.3.3 Error id/suggestion (A/AA) | FAIL | The disabled Select button in the tooltip does not state a reason. Add a reason + suggestion. | `visibleRestrictionReason` |
| 4.1.2 Name, Role, Value (A) | FAIL | The seat is currently a `<div>` with no role/name. Becomes `<button type="button" role="gridcell">` with `aria-label`, `aria-selected`, `aria-disabled` (not native `disabled`), `aria-describedby`. | `gridSemantics` |
| 4.1.3 Status messages (AA) | FAIL | Live region (polite): "Seat 14C selected, €12", "unselected", "not available for infant", "Moved to seat 14C". The running total is a host responsibility. | `liveAnnouncer` |

---

## Target architecture (React specifics)

### Grid semantics (full APG Layout Grid pattern)

`role="grid"` on the deck container (per deck), `role="row"` + `aria-rowindex` on each row, `role="gridcell"` on each position (including `aisle`/`empty`/`unavailable`). Every cell is focus-reachable.

- Every `gridcell` has a tabindex (roving): one `0`, the rest `-1`.
- Unavailable seats are `<button>` **without** the HTML `disabled` attribute (it removes focusability), with `aria-disabled="true"`. The click/Enter handler is a no-op, but focus and the aria-label work.
- Aisle / empty are non-buttons (`<div role="gridcell" tabindex="-1" aria-label="aisle">`), not activatable but reachable with arrows.
- Skim mode: Ctrl+Arrow jumps only across interactable seats; PageUp/Down move ±5 rows across interactable seats.

### Roving + 2D keyboard navigation

A pure module `src/common/seat-grid-navigation.js` (a port of `SeatGridNavigationService`, unit-tested) + a thin `useSeatGridNavigation` hook for state and wiring into `SeatMap`.

State: `focusedCell: { deckIdx, rowIdx, colIdx }`. Changed via `onKeyDown` on the grid container. On each change — recompute the roving tabindex and imperatively `focus()` the focused cell (reusing the existing `seatLabelJumpTo` / `data-*` query mechanism).

Bindings: `ArrowLeft/Right` (±1 col), `ArrowUp/Down` (±1 row, nearest col by leftOffset), `Home`/`End` (row ends), `Ctrl+Home`/`Ctrl+End` (first/last interactable), `PageUp/Down` (±5 rows), `Ctrl+Arrow` (skim), `Enter`/`Space` (existing `onSeatClick` flow), `Esc` (close tooltip).

### Tooltip as a non-modal dialog

- `role="dialog"` **without** `aria-modal` (the map does not overlay, click-outside closes — existing flow).
- `aria-labelledby` on the heading (seat name + number), `aria-describedby` on amenities and (when present) on the restriction reason.
- **No focus trap** — it would break click-outside-to-close.
- Auto-focus on the primary action: Select if available; Unselect if occupied; otherwise Cancel.
- `Escape` on the tooltip root → close.
- On close — return focus to the trigger seat button (store `lastTriggerElement` / ref in `SeatMap`).
- A `sidePanel`-like inline variant (if introduced) is `role="region"`, not a dialog, with no auto-focus.

### LiveAnnouncer — custom implementation (no `@angular/cdk`)

React has no CDK. Decision (approved 2026-07-13): a custom `useLiveAnnouncer` hook + a hidden `aria-live="polite"` region (a `LiveRegion` component), mounted at the `SeatMap` root when `liveAnnouncer=true`. Zero new runtime dependencies, tree-shake-safe. It announces: select, unselect, jump-to-seat, and an attempt to select a restricted seat. All strings go through locales, politeness `polite`. It does **not** announce the running total (host responsibility).

### Alternative list view

A new component `src/components/SeatList/` (`JetsSeatList`). A semantic `<table>` with a `<caption>` (visually hidden), a `<thead>` (row / seat / cabin / position / features / price / status / action), and a `<tbody>`. Filters in a `<fieldset role="group">`: window-only, aisle-only, extra legroom, exit row, sort by price. It emits the **same** callbacks (`onSeatSelected`/`onSeatUnselected`) and uses the same `service` for select/unselect — state stays in sync with the grid. Activated via `config.wcag.alternativeView` (`'grid'|'list'|'auto'`); `'auto'` uses `matchMedia('(max-width: 480px)')`; a toggle button in the header appears when the mode is not forced. Exported from `src/index.js`. Its ACR motivation is closing **2.5.8 (target size)**.

### Accessible-name builder

A pure module `src/common/a11y.js`: `buildSeatAriaLabel(seat, position, locale)` and `computeSeatPosition(row, seatIndex)`. It produces: available `"14C, aisle, extra legroom, available, €12"`; selected `"14C, window, selected for John Doe"`; unavailable `"14B, middle, unavailable"`; restricted `"12A, window, exit row, not available for infant"`. Position is derived from the index within `row.seats`.

### SVG accessibility and forced-colors

Decorative SVGs (`PlaneBody`, `Nose`, `Tail`, `Wing`, `DeckSeparator`, bulk, exits, tooltip amenity icons, inner seat SVG, passenger badge, price pill, cross for unavailable) get `aria-hidden="true"`. The aria-label on the seat button is the single source of truth. For forced-colors: hardcoded `fill`/`stroke` in inline SVGs → CSS variables / `currentColor`; `@media (forced-colors: active)` rules (outline for focus, `CanvasText` for icons).

### prefers-reduced-motion

`scrollIntoView` uses `behavior: reduce ? 'auto' : 'smooth'`. Hover effects and the deck-selector rotation are wrapped in `@media (prefers-reduced-motion: no-preference)`.

### Deck selector

`N = 2`: `<button role="switch" aria-checked aria-label="Switch to {nextDeckTitle}">`. `N ≥ 3`: `role="tablist"` + N `role="tab"` + `aria-controls` + arrow navigation. After switching — focus the first interactable seat of the new deck (via the live region + roving update).

---

## Divergences from Angular (deliberate)

1. **No `@angular/cdk`.** `LiveAnnouncer` → a custom `useLiveAnnouncer` + `aria-live` region, no CDK equivalent and no new runtime dependencies.
2. **Services → hooks, logic stays pure.** `SeatGridNavigationService` → a pure `seat-grid-navigation.js` module + a `useSeatGridNavigation` hook. Unit tests run the pure module (as Angular ran the service).
3. **Plain JS, no TS interfaces.** `IWcagConfig` is described via JSDoc; the contract is enforced by the runtime resolver `getWcagFlags` + tests.
4. **Tests.** jest-axe (unit, mirror of Angular commit 16) + Playwright + `@axe-core/playwright` (e2e) against built **Storybook stories** (self-contained, no API credentials) + `@storybook/addon-a11y` for manual checks. Playwright is a new runner in this repo.
5. **Horizontal gap.** In horizontal mode (CSS `rotate`) the keyboard/tooltip are not adjusted for the rotation — a known limitation, also present in Angular. **Not fixed** here; recorded as a known limitation in the ACR.

---

## Commit plan (waves)

Full parity — 17 logical commits, grouped into waves by dependency. Implementation is incremental.

### Wave 0 — foundation (enables nothing visually)
| # | Commit | Content |
|---|---|---|
| 1 | `feat(a11y): config.wcag flags + getWcagFlags resolver` | `src/common/wcag-flags.js` + `.test.js`; `config.wcag` in defaultProps (`SeatMap.js`); resolved flags passed into `JetsContext`. |
| 2 | `feat(a11y): accessible-name builder + locale keys` | `src/common/a11y.js` + `.test.js`; ARIA keys across all 18 locales in `i18n.languages.js`. |

### Wave A — always-on "free"
| # | Commit | Content |
|---|---|---|
| 3 | `feat(a11y): hide decorative graphics from AT` | `aria-hidden` on all decorative SVGs and duplicates (passenger badge, price pill, cross, amenity icons). |
| 4 | `feat(a11y): prefers-reduced-motion` | `scrollIntoView` smooth→auto; hover/rotation behind `@media (prefers-reduced-motion)`. |
| 5 | `feat(a11y): forced-colors / Windows High Contrast` | inline-SVG fill/stroke → CSS variables/`currentColor`; `@media (forced-colors: active)`. |

### Wave B — seat semantics (`gridSemantics`)
| # | Commit | Content |
|---|---|---|
| 6 | `feat(a11y): seat is a button with ARIA semantics` | `Seat/JetsSeat.js`: `<div>`→`<button type="button" role="gridcell">`; `aria-label/selected/disabled`, roving tabindex, `aria-colindex`; `:focus-visible`. Preserve `.jets-seat` + `data-testid`. Behind `gridSemantics`. |
| 7 | `feat(a11y): grid scaffolding (role=grid/row/gridcell)` | `SeatMap`/`Deck`/`Row`/`Seat`: `role="grid"` + `aria-row/colcount` on the deck, `role="row"` + `aria-rowindex`, aisle/empty as `gridcell`. Behind `gridSemantics`. |

### Wave C — keyboard (`keyboardNavigation`)
| # | Commit | Content |
|---|---|---|
| 8 | `feat(a11y): 2D keyboard navigation + roving tabindex` | Pure `src/common/seat-grid-navigation.js` + `.test.js`; `useSeatGridNavigation` hook; wiring `onKeyDown`/focus into `SeatMap`. Behind `keyboardNavigation` (implies `gridSemantics`). |

### Wave D — tooltip (`tooltipDialog`, `visibleRestrictionReason`)
| # | Commit | Content |
|---|---|---|
| 9 | `fix(a11y): hover-tooltip focus-aware + dismissable (1.4.13)` | Focus-triggered tooltip; delayed close with a relatedTarget check; Esc. |
| 10 | `feat(a11y): tooltip is a non-modal dialog` | `role="dialog"`, `aria-labelledby/describedby`, auto-focus primary, Esc, focus return to the trigger. Behind `tooltipDialog`. |
| 11 | `feat(a11y): expose seat-restriction reasoning (3.3.1/3.3.3)` | Visible reason under a disabled Select + `aria-describedby`; extend `isSeatSelectDisabled` to return a reason. Behind `visibleRestrictionReason`. |

### Wave E — announcements and landmarks (`liveAnnouncer`, `landmarksAndSkipLink`)
| # | Commit | Content |
|---|---|---|
| 12 | `feat(a11y): LiveAnnouncer for selection/jump/restrictions` | `useLiveAnnouncer` + `LiveRegion` component; polite announcements on select/unselect/jump/blocked. Behind `liveAnnouncer`. |
| 13 | `feat(a11y): landmarks + skip link + deck-selector semantics` | `role="region"` + visually-hidden heading + skip link; deck selector → `switch` (N=2) / `tablist` (N≥3) + arrow navigation. Behind `landmarksAndSkipLink`. |

### Wave F — alternative view (`alternativeView`)
| # | Commit | Content |
|---|---|---|
| 14 | `feat(a11y): alternative list view + wcag.alternativeView` | New `src/components/SeatList/` (`JetsSeatList`) + filters/sort; wired through the same `service`; `matchMedia(480px)` for `auto`; toggle button; exported from `src/index.js`. |

### Wave G — palette, tests, docs (`defaultColorTheme`)
| # | Commit | Content |
|---|---|---|
| 15 | `feat(a11y): AA-contrast default color tokens` | `WCAG_COLOR_THEME` in `constants.js`; behind `defaultColorTheme` it merges as the base instead of the historical one. A discrete disabled token instead of `opacity`. |
| 16 | `test(a11y): jest-axe unit + @axe-core/playwright e2e` | jest-axe `*.a11y.test.js` (seat-map, seat, tooltip, seat-list, 3-deck tablist); Storybook a11y stories; Playwright `e2e/a11y/*.spec.js` against Storybook (axe + tab cycle + arrow nav + dialog + focus restoration). npm scripts `test:a11y` / `e2e:a11y`. |
| 17 | `docs(a11y): README + ACR + override responsibility` | README — Accessibility section (what is covered, what is host); `docs/ACR.md` — full WCAG 2.2 A+AA matrix; override responsibility with `componentOverrides`. |

---

## Critical files

**Modified:**
- `src/components/Seat/JetsSeat.js` — `<div>`→button, ARIA, focus styles, keyboard.
- `src/components/SeatMap/SeatMap.js` — `config.wcag` defaults, flags into context, focus state, keyboard handler, LiveAnnouncer, landmarks.
- `src/components/SeatMap/service.js` — reuse select/unselect for the list view.
- `src/components/Row/index.js` — `role="row"`, `aria-rowindex`.
- `src/components/Deck/index.js` — `role="grid"`, `aria-row/colcount`.
- `src/components/TooltipGlobal/TooltipGlobal.js` + `TooltipGlobal.view.js` — dialog, focus management, Esc, restriction reasoning.
- `src/components/DeckSelector/index.js` — switch/tablist semantics.
- `src/components/PlaneBody/index.js`, `Nose/`, `Tail/`, `Wing` (if present), `DeckSeparator/`, `Bulk/JetsBulk.js`, `DeckExit/` — `aria-hidden`, replace hardcoded SVG fill.
- `src/common/constants.js` — `WCAG_COLOR_THEME`, ARIA constants.
- `src/common/i18n.languages.js` — ARIA keys across all 18 locales.
- `src/common/context.js` — carry the resolved flags.
- `src/index.js` — export `JetsSeatList`.

**New:**
- `src/common/wcag-flags.js` (+ `.test.js`)
- `src/common/a11y.js` (+ `.test.js`)
- `src/common/seat-grid-navigation.js` (+ `.test.js`)
- `src/common/hooks/useSeatGridNavigation.js`
- `src/common/hooks/useLiveAnnouncer.js` + `LiveRegion` component
- `src/components/SeatList/` (index.js + .css + .test.js + .a11y.test.js)
- `e2e/a11y/*.spec.js` (Playwright) + playwright config
- `docs/ACR.md`

---

## Reuse

- `LOCALES_MAP` / `i18n.languages.js` — the extension pattern for ARIA strings.
- `service.selectSeatHandler` / `unselectSeatHandler` — for the list view, no duplication.
- The `data-testid` / seat-label mechanism — for focus management (roving `focus()`).
- The `seatLabelJumpTo` flow — extended for keyboard and LiveAnnouncer.
- The `componentOverrides` infrastructure — only responsibility documentation is added.
- `isSeatSelectDisabled` — extended to return a reason.
- `JetsContext` — the channel for the resolved WCAG flags.

---

## Verification

After each commit:
1. **Unit:** `pnpm test` — existing + new a11y specs green, coverage ≥85% does not drop.
2. **Build:** `pnpm run build-lib` — Rollup CJS+ESM with no errors.
3. **Prettier:** staged files formatted (husky pre-commit).

After the series:
4. **jest-axe:** `pnpm run test:a11y` — no violations.
5. **Playwright/axe:** `pnpm run e2e:a11y` against Storybook — all a11y scenarios green.
6. **Keyboard-only manual:** Tab enters the map (one stop) → Arrow moves focus → Home/End/Ctrl+Home/End/PageUp/Down → Ctrl+Arrow skim → Enter opens the tooltip → Esc closes + returns focus → Tab inside the tooltip cycles. Toggle the list view. Deck selector (switch/tablist).
7. **NVDA / VoiceOver:** each seat announces row/col/button/label/status; the select announcement goes through the live region; the tooltip is a dialog; the list view is a table.
8. **High-contrast (Edge/Firefox forced-colors):** borders, focus ring, icons visible.
9. **prefers-reduced-motion:** no smooth scroll, no hover effects, instant deck rotation.
10. **200% zoom / 320px:** auto-mode switches to the list below 480px; content is not lost.
11. **ACR review:** `docs/ACR.md` matches the implementation.

**Regression guarantee (most important):** a dedicated test asserts that with a `config` that has no `wcag` (and with `wcag.enabled=false`) the DOM snapshot is identical to the pre-WCAG output — not a single `role`/`aria-*`/`tabindex`, seats remain `<div>`.

---

## Progress tracking

| # | Wave | Commit | Status | SHA | Date | Notes |
|---|---|---|---|---|---|---|
| 0 | — | Plan copy in `docs/wcag/PLAN.md` | [ ] | — | 2026-07-13 | this document |
| 1 | 0 | `config.wcag flags + getWcagFlags` | [ ] | — | — | |
| 2 | 0 | `accessible-name builder + locale keys` | [ ] | — | — | |
| 3 | A | `hide decorative graphics from AT` | [ ] | — | — | always-on |
| 4 | A | `prefers-reduced-motion` | [ ] | — | — | always-on |
| 5 | A | `forced-colors / Windows High Contrast` | [ ] | — | — | always-on |
| 6 | B | `seat is a button with ARIA semantics` | [ ] | — | — | `gridSemantics` |
| 7 | B | `grid scaffolding (role=grid/row/gridcell)` | [ ] | — | — | `gridSemantics` |
| 8 | C | `2D keyboard navigation + roving tabindex` | [ ] | — | — | `keyboardNavigation` |
| 9 | D | `hover-tooltip focus-aware + dismissable` | [ ] | — | — | `tooltipDialog` |
| 10 | D | `tooltip is a non-modal dialog` | [ ] | — | — | `tooltipDialog` |
| 11 | D | `expose seat-restriction reasoning` | [ ] | — | — | `visibleRestrictionReason` |
| 12 | E | `LiveAnnouncer for selection/jump` | [ ] | — | — | `liveAnnouncer` |
| 13 | E | `landmarks + skip link + deck-selector` | [ ] | — | — | `landmarksAndSkipLink` |
| 14 | F | `alternative list view` | [ ] | — | — | `alternativeView` |
| 15 | G | `AA-contrast default color tokens` | [ ] | — | — | `defaultColorTheme` |
| 16 | G | `jest-axe unit + @axe-core/playwright e2e` | [ ] | — | — | |
| 17 | G | `README + ACR + override responsibility` | [ ] | — | — | |

---

## Decisions log

- **2026-07-13 — Toggle model:** an exact mirror of Angular `IWcagConfig` + `getWcagFlags`. Master `enabled` + 7 granular boolean flags + three-state `alternativeView`. `keyboardNavigation` implies `gridSemantics`.
- **2026-07-13 — Three always-on features:** `aria-hidden` on decoration, `prefers-reduced-motion`, `forced-colors` — no flags, always enabled (they do not change visuals/behaviour for a non-AT user).
- **2026-07-13 — LiveAnnouncer:** a custom `useLiveAnnouncer` + `aria-live` region, no `@angular/cdk` equivalent and no new runtime dependencies. `react-aria-live` rejected.
- **2026-07-13 — Tests:** jest-axe (unit) + Playwright + `@axe-core/playwright` (e2e against Storybook) + `@storybook/addon-a11y`.
- **2026-07-13 — Branch:** `WCAG` from `origin/version-3`, in a separate git worktree, so the user's working checkout is not touched. PR → `version-3`.
- **2026-07-13 — Scope:** full parity (17 commits), incremental implementation by wave.
- **2026-07-13 — Horizontal gap:** not fixed (parity with Angular), recorded as a known limitation in the ACR.

---

## Responsibility boundaries (host responsibility)

Marked in the ACR as "Host responsibility"; the library does not solve them:
- 1.4.2 Audio Control — no audio.
- 2.4.2 Page Titled — host.
- 3.1.1 / 3.1.2 Language of Page/Parts — host (`<html lang>`).
- 1.3.5 Identify Input Purpose — no inputs in the library.
- 2.5.5 Target Size (Enhanced) — AAA, outside AA scope.
- 3.3.7 / 3.3.8 Redundant Entry / Accessible Authentication — host.
- The running total of selected seats — host (receives the select/unselect callbacks).

---

## Open questions / blockers

- (none open)
