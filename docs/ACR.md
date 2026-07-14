# Accessibility Conformance Report — `@seatmaps.com/react-lib`

**Standard:** WCAG 2.2, Level A and AA (Level AAA out of scope).
**Date:** 2026-07-14.
**Scope:** the `JetsSeatMap` component shipped from `@seatmaps.com/react-lib`,
its sub-components (`JetsSeat`, `JetsDeckSelector`, `TooltipGlobal` /
`TooltipGlobal.view`, `JetsSeatList`, and the decorative chrome —
`PlaneBody`, `Nose`, `Tail`, `Wing`, `DeckSeparator`, `Bulk`, `DeckExit`,
`NotInit`, `NoData`), and the built-in `useLiveAnnouncer` / `LiveRegion`.

**Conformance model:** every criterion below is evaluated **with the
relevant `config.wcag` flag(s) enabled**, since the accessibility layer is
entirely opt-in. When `config.wcag` is unset (or `enabled: false` and no
flag explicitly set), the library renders exactly as it did before this
work — plain `<div>` seats, no ARIA, no keyboard handling — and every
criterion below that depends on a flag reverts to **Does not support**.
This report describes the conformance the library is *capable of*, which
consumers reach by opting in.

**Out of scope:** the host page that embeds the widget. Criteria that can
only be met at the document or session level (page title, language of
page/parts, authentication, redundant entry, the page-level ACR itself)
are flagged below as *Host responsibility*.

**Conformance values used in the tables**

- **Supports** — the widget fully meets the success criterion when the
  relevant flag(s) are enabled.
- **Partially supports** — the widget meets most of the criterion; see
  the *How met* column for the residual gap.
- **Does not support** — the criterion is in scope and is not met (or
  only met when a flag is off by default and left off).
- **Not applicable** — the criterion applies to content the widget does
  not produce (e.g. audio, video, forms).
- **Host responsibility** — the criterion can only be met by the host
  page; the widget exposes the inputs/outputs the host needs to satisfy
  it.

**Where** references point at the file path in the published library plus
the SHA of the commit that introduced the behaviour, on the `WCAG` branch
of `Kwiket/jets-seatmap-react-lib-pub`.

---

## Principle 1 — Perceivable

### Guideline 1.1 — Text Alternatives

| SC | Title | Level | Conformance | How met | Where |
|---|---|---|---|---|---|
| 1.1.1 | Non-text Content | A | Supports | Decorative SVGs (fuselage, wings, nose, tail, deck separators, bulk, deck exits, deck-selector glyph, tooltip amenity/measurement icons, seat-inner SVG) carry `aria-hidden="true"`, always-on regardless of `config.wcag`. Functional seats expose an accessible name via `aria-label` (`src/common/a11y.js#buildSeatAriaLabel`, e.g. `"14C, aisle, extra legroom, available, €12"`) when `gridSemantics` is enabled. | `aria-hidden` on decorative graphics (commit `82d28b5`); `src/common/a11y.js` (commit `5b94009`); wiring in `src/components/Seat/JetsSeat.js` (commit `05e19d4`). |

### Guideline 1.2 — Time-based Media

| SC | Title | Level | Conformance | How met | Where |
|---|---|---|---|---|---|
| 1.2.1 | Audio-only and Video-only (Prerecorded) | A | Not applicable | The widget renders no audio or video. | — |
| 1.2.2 | Captions (Prerecorded) | A | Not applicable | No prerecorded media. | — |
| 1.2.3 | Audio Description or Media Alternative (Prerecorded) | A | Not applicable | No prerecorded media. | — |
| 1.2.4 | Captions (Live) | AA | Not applicable | No live media. | — |
| 1.2.5 | Audio Description (Prerecorded) | AA | Not applicable | No prerecorded media. | — |

### Guideline 1.3 — Adaptable

| SC | Title | Level | Conformance | How met | Where |
|---|---|---|---|---|---|
| 1.3.1 | Info and Relationships | A | Supports (`gridSemantics`) | Seats render as `<button type="button" role="gridcell">` with `aria-colindex`/`aria-rowindex`, `aria-selected`, `aria-disabled`. Aisle/empty/index cells are `role="gridcell"` `<div>`s with a descriptive `aria-label`. The alternative list view (`alternativeView`) is a semantic `<table>` with `<caption>`, `scope="col"` headers, `<thead>`/`<tbody>`. The tooltip (`tooltipDialog`) is `role="dialog"` with `aria-describedby` wiring to amenities and, when present, the restriction reason. | `src/components/Seat/JetsSeat.js` (commit `05e19d4`); `src/components/SeatList/SeatList.js` (commit `5b2914b`); `src/components/TooltipGlobal/TooltipGlobal.js` / `.view.js` (commits `972a228`, `d746d65`). |
| 1.3.2 | Meaningful Sequence | A | Supports | DOM order matches visual reading order: deck-selector → grid (row 1 col 1 … row N col M) → tooltip-when-open. The alternative list view follows row-then-seat order via `flatSeats`. | `src/components/SeatMap/SeatMap.js`; `src/components/SeatList/SeatList.js` (commit `5b2914b`). |
| 1.3.3 | Sensory Characteristics | A | Supports | Accessible names and locale strings reference seats by number (`"14C"`), position (window/aisle/middle) and price — never colour or spatial cue alone. | `src/common/a11y.js#buildSeatAriaLabel` (commit `5b94009`). |
| 1.3.4 | Orientation | AA | Supports | The widget does not lock orientation; `wcag.alternativeView: 'auto'` switches to the list view below a 480 CSS px viewport width regardless of orientation. | `src/components/SeatMap/SeatMap.js` (commit `5b2914b`). |
| 1.3.5 | Identify Input Purpose | AA | Not applicable | The widget has no user-input fields mapped to the WCAG input-purpose taxonomy. The tooltip's Select/Unselect/Cancel are actions, not data entry. | — |

### Guideline 1.4 — Distinguishable

| SC | Title | Level | Conformance | How met | Where |
|---|---|---|---|---|---|
| 1.4.1 | Use of Color | A | Supports | State is never carried by colour alone: unavailable seats render a visible cross, selected seats render a passenger badge, restricted seats carry a visible `seatRestrictionMessage`-style reason in the tooltip (`visibleRestrictionReason`). | `src/components/Seat/JetsSeat.js`; `src/components/TooltipGlobal/TooltipGlobal.view.js` (commit `d746d65`). |
| 1.4.2 | Audio Control | A | Not applicable | The widget produces no audio. | — |
| 1.4.3 | Contrast (Minimum) | AA | Host responsibility | The library ships **no** default AA-contrast colour theme; `colorTheme` is entirely consumer-supplied. A `config.wcag.defaultColorTheme` flag exists in the resolver (`src/common/wcag-flags.js`) reserved for a future AA-contrast palette, but no such palette is implemented yet — the flag currently has no visible effect. Consumers are responsible for auditing their own `colorTheme` for ≥4.5:1 text contrast. | `src/common/wcag-flags.js` (flag reserved, unimplemented); host `colorTheme`. |
| 1.4.4 | Resize Text | AA | Supports | Seat-grid and tooltip typography use relative units; the component does not pin font-size in unscalable units for text nodes. | `src/components/Seat/JetsSeat.css`; tooltip CSS. |
| 1.4.5 | Images of Text | AA | Supports | No images of text. Seat labels, prices and tooltip text are live text; SVG geometry is decorative only. | — |
| 1.4.10 | Reflow | AA | Supports | The seat grid is a 2D spatial diagram and falls under the canonical "2D layout required for meaning" exception. `wcag.alternativeView` provides a single-column semantic `<table>` view that reflows without horizontal scrolling for users who cannot use the 2D layout. | `src/components/SeatList/SeatList.js` (commit `5b2914b`). |
| 1.4.11 | Non-text Contrast | AA | Supports (`gridSemantics`) | `:focus-visible { outline: 2px solid #d81b60; outline-offset: 2px; }` (or equivalent) is applied to seat buttons and tooltip buttons when the relevant flag is enabled. A `@media (forced-colors: active)` rule keeps the ring and seat borders visible under Windows High Contrast even when the flag is off for the base decorative elements. Consumer-supplied `colorTheme` borders are the consumer's own responsibility for the ≥3:1 budget. | `src/components/Seat/JetsSeat.css` (commit `05e19d4`); forced-colors rules across `DeckSeparator/`, `DeckExit/`, `DeckSelector/`, `Seat/` (commit `d42d555`). |
| 1.4.12 | Text Spacing | AA | Supports | No CSS pins `line-height`, `letter-spacing` or `word-spacing` to non-overridable values on grid or tooltip text. | `src/components/Seat/JetsSeat.css`; tooltip CSS. |
| 1.4.13 | Content on Hover or Focus | AA | Supports (`tooltipDialog`) | The tooltip is **dismissable** (Escape closes it and returns focus to the trigger seat), **hoverable** (pointer can move onto the tooltip without it closing), and **persistent** (stays open until dismissed or focus moves away). Keyboard focus on a seat opens the tooltip with the same behaviour as pointer hover. | `src/components/TooltipGlobal/TooltipGlobal.js` (commits `0e93fa8`, `972a228`). |

---

## Principle 2 — Operable

### Guideline 2.1 — Keyboard Accessible

| SC | Title | Level | Conformance | How met | Where |
|---|---|---|---|---|---|
| 2.1.1 | Keyboard | A | Supports (`keyboardNavigation`) | Every interactive surface is reachable and operable from the keyboard: `ArrowUp/Down/Left/Right` (1 cell), `Home`/`End` (row ends), `Ctrl+Home`/`Ctrl+End` (first/last interactable seat), `PageUp`/`PageDown` (±5 rows), `Ctrl+Arrow` (skip to next interactable seat), `Enter`/`Space` (activate), `Escape` (close tooltip). The two-deck deck-selector switch and the tooltip's Select/Unselect/Cancel buttons are native `<button>`s reachable via Tab. | `src/common/seat-grid-navigation.js` + wiring (`onGridKeydown`/`onGridFocusin`) in `src/components/SeatMap/SeatMap.js` (commit `1abc507`). |
| 2.1.2 | No Keyboard Trap | A | Supports | The tooltip is non-modal (no focus trap, no `aria-modal`); Tab leaves the tooltip and continues into the next document focusable. Escape returns focus to the trigger seat. | `src/components/TooltipGlobal/TooltipGlobal.js` (commit `972a228`). |
| 2.1.4 | Character Key Shortcuts | A | Supports | The widget binds no single-character shortcut. All bindings either require a modifier (`Ctrl+Arrow`, `Ctrl+Home/End`) or are intrinsic widget keys (arrow, `Home`, `End`, `PageUp/Down`, `Enter`, `Space`, `Escape`) consistent with the APG Grid pattern. | `src/common/seat-grid-navigation.js` (commit `1abc507`). |

### Guideline 2.2 — Enough Time

| SC | Title | Level | Conformance | How met | Where |
|---|---|---|---|---|---|
| 2.2.1 | Timing Adjustable | A | Not applicable | The widget enforces no time limits. | — |
| 2.2.2 | Pause, Stop, Hide | A | Not applicable | The widget has no auto-updating, auto-scrolling or auto-moving content. `seatJumpTo` scroll is user/host-triggered. | — |

### Guideline 2.3 — Seizures and Physical Reactions

| SC | Title | Level | Conformance | How met | Where |
|---|---|---|---|---|---|
| 2.3.1 | Three Flashes or Below Threshold | A | Supports | The widget contains no flashing content. | — |

### Guideline 2.4 — Navigable

| SC | Title | Level | Conformance | How met | Where |
|---|---|---|---|---|---|
| 2.4.1 | Bypass Blocks | A | Supports (`landmarksAndSkipLink`) | The widget wraps itself in `<section role="region" aria-labelledby="…">` with a visually-hidden `<h2>` heading and a skip link (visible only on keyboard focus, via `.jets-skip-link`) that moves focus to a target rendered immediately after the widget's content. | `src/components/SeatMap/SeatMap.js` (commit `8615629`). |
| 2.4.2 | Page Titled | A | Host responsibility | The widget cannot set `<title>`. | host page. |
| 2.4.3 | Focus Order | A | Supports (`keyboardNavigation`) | One Tab stop into the grid (roving `tabindex`); arrow keys move focus in spatial reading order inside the grid; tooltip buttons follow their trigger seat in focus order; focus returns to the trigger seat on tooltip close. | `src/components/SeatMap/SeatMap.js` (commit `1abc507`); tooltip focus restoration (commit `972a228`). |
| 2.4.4 | Link Purpose (In Context) | A | Not applicable | The widget renders no links other than the `landmarksAndSkipLink` skip link, whose purpose ("Skip seat map") is self-describing from its text alone. | — |
| 2.4.5 | Multiple Ways | AA | Not applicable | The widget is a single component within a single page; multiple-ways applies to the site. | host page. |
| 2.4.6 | Headings and Labels | AA | Supports (`landmarksAndSkipLink` / `gridSemantics`) | The widget's visually-hidden heading is descriptive (`"Seat map"`, localised via `gridLabel`). Every interactive control has a label (seat `aria-label`, tooltip button text, deck-selector `aria-label`). | `src/components/SeatMap/SeatMap.js` (commit `8615629`); `src/common/a11y.js` (commit `5b94009`). |
| 2.4.7 | Focus Visible | AA | Supports (`gridSemantics`) | `:focus-visible` outline applies to the seat button and tooltip buttons; the forced-colors rule keeps the ring visible in Windows High Contrast. | `src/components/Seat/JetsSeat.css` (commit `05e19d4`); `src/components/TooltipGlobal/TooltipGlobal.css` (commit `972a228`); forced-colors (commit `d42d555`). |
| 2.4.11 | Focus Not Obscured (Minimum) | AA *(new in 2.2)* | Partially supports (`keyboardNavigation`) | The focused cell is scrolled into view (`scrollIntoView({ block: 'nearest', inline: 'nearest' })`) on every keyboard-driven focus transition and on `Ctrl+Arrow`/skip-link jumps. The widget cannot see host-level sticky headers/footers — if the host pins overlays around the widget, the host must add its own scroll-margin to keep the focused seat clear. | `src/components/SeatMap/SeatMap.js` (commit `1abc507`). |
| 2.4.12 | Focus Not Obscured (Enhanced) | AAA | Not applicable | AAA, out of scope. | — |
| 2.4.13 | Focus Appearance | AAA | Not applicable | AAA, out of scope. The focus indicator exceeds the AA minimum but no formal AAA claim is made. | — |

### Guideline 2.5 — Input Modalities

| SC | Title | Level | Conformance | How met | Where |
|---|---|---|---|---|---|
| 2.5.1 | Pointer Gestures | A | Supports | All interactions are single-pointer single-tap (click/tap on a seat or tooltip button). No multi-point or path-based gestures. | — |
| 2.5.2 | Pointer Cancellation | A | Supports | All buttons use default click semantics: `down` does not commit, `up`-outside aborts the activation. | native `<button>` semantics, `src/components/Seat/JetsSeat.js`. |
| 2.5.3 | Label in Name | A | Supports (`gridSemantics`) | Each button's accessible name (`aria-label`) begins with or contains its visible text (seat number `"14C"`, tooltip button text `"Select"`/`"Unselect"`/`"Cancel"`). | `src/common/a11y.js#buildSeatAriaLabel` (commit `5b94009`). |
| 2.5.4 | Motion Actuation | A | Not applicable | The widget does not respond to device motion. | — |
| 2.5.7 | Dragging Movements | AA *(new in 2.2)* | Not applicable | The widget exposes no drag-based interaction. | — |
| 2.5.8 | Target Size (Minimum) | AA *(new in 2.2)* | Partially supports (`alternativeView`) | Seat-button footprint in the default grid layout depends on the consumer's `width`/`colorTheme` configuration and is not independently guaranteed by the library at ≥24×24 CSS px for every possible configuration. For narrow viewports, `wcag.alternativeView: 'auto'` switches to the `JetsSeatList` table view (≤480px), whose row targets are comfortably larger than the grid's seat buttons. Hosts that pin `alternativeView: 'grid'` on narrow viewports remain responsible for verifying target size for their own `width`/theme combination. | `src/components/SeatList/SeatList.js` (commit `5b2914b`). |

---

## Principle 3 — Understandable

### Guideline 3.1 — Readable

| SC | Title | Level | Conformance | How met | Where |
|---|---|---|---|---|---|
| 3.1.1 | Language of Page | A | Host responsibility | `<html lang>` is set by the host. The widget's own locale strings are selected from `config.lang` / `LOCALES_MAP`, so they match the host's chosen language. | host page; `src/common` locale tables. |
| 3.1.2 | Language of Parts | AA | Host responsibility | If a region of the host page is in a different language than `<html lang>`, the host adds the per-region `lang` attribute. The widget renders content only in `config.lang`. | host page. |

### Guideline 3.2 — Predictable

| SC | Title | Level | Conformance | How met | Where |
|---|---|---|---|---|---|
| 3.2.1 | On Focus | A | Supports | Focusing a seat does not cause an unexpected change of context. With `tooltipOnHover`/`tooltipDialog` it opens a non-modal tooltip — the same UX as pointer hover, a widely-understood hint surface, not a context change. | `src/components/Seat/JetsSeat.js`. |
| 3.2.2 | On Input | A | Supports | Activating a seat (`Enter`/`Space`/click) triggers the documented, deterministic `onSeatClick` flow and callback events; no implicit navigation. | `src/components/Seat/JetsSeat.js`. |
| 3.2.3 | Consistent Navigation | AA | Supports | The deck-selector, grid keyboard model and tooltip behaviour are consistent across every mounted instance of the widget. | — |
| 3.2.4 | Consistent Identification | AA | Supports (`gridSemantics`) | Equivalent UI is identified consistently: every seat button follows the same `aria-label` structure; every Select button is named "Select" per locale. | `src/common/a11y.js` (commit `5b94009`). |
| 3.2.6 | Consistent Help | A *(new in 2.2)* | Host responsibility | The widget exposes no help affordance. If the host page exposes one, keeping it consistent across pages is the host's concern. | host page. |

### Guideline 3.3 — Input Assistance

| SC | Title | Level | Conformance | How met | Where |
|---|---|---|---|---|---|
| 3.3.1 | Error Identification | A | Supports (`visibleRestrictionReason`) | When a seat cannot be selected, the tooltip renders a visible reason line under the disabled Select button, wired to it via `aria-describedby`. | `src/components/TooltipGlobal/TooltipGlobal.js` / `.view.js` (commit `d746d65`). |
| 3.3.2 | Labels or Instructions | A | Supports | Every actionable control carries either a visible label (tooltip buttons, list-view filters/headers) or an `aria-label` (seat cells, deck-selector). | `src/common/a11y.js`; `src/components/SeatList/SeatList.js`; `src/components/DeckSelector/index.js`. |
| 3.3.3 | Error Suggestion | AA | Supports (`visibleRestrictionReason`) | The restriction reason text identifies the constraint blocking selection (e.g. a passenger-type restriction), giving the user actionable information rather than a bare "unavailable". | `src/components/TooltipGlobal/TooltipGlobal.js` (commit `d746d65`). |
| 3.3.4 | Error Prevention (Legal, Financial, Data) | AA | Not applicable | Seat selection is reversible (Unselect button; Escape cancels the tooltip without committing). No legal or financial transaction is finalised inside the widget. | — |
| 3.3.7 | Redundant Entry | A *(new in 2.2)* | Host responsibility | The widget contains no multi-step form. Passenger/payment forms surrounding the widget are the host's concern. | host page. |
| 3.3.8 | Accessible Authentication (Minimum) | AA *(new in 2.2)* | Host responsibility | The widget does not authenticate the user. | host page. |
| 3.3.9 | Accessible Authentication (Enhanced) | AAA | Not applicable | AAA, out of scope. | — |

---

## Principle 4 — Robust

### Guideline 4.1 — Compatible

| SC | Title | Level | Conformance | How met | Where |
|---|---|---|---|---|---|
| 4.1.1 | Parsing | A | Not applicable | Obsoleted by WCAG 2.2; included for completeness. React renders well-formed DOM. | — |
| 4.1.2 | Name, Role, Value | A | Supports (`gridSemantics`, `tooltipDialog`, `landmarksAndSkipLink`) | Every interactive element is a native `<button>` or carries an explicit ARIA role (`gridcell`, `dialog`, `region`, `switch`). Name comes from `aria-label` or visible text. State is `aria-selected`/`aria-disabled`/`aria-checked` as appropriate. Unavailable seats use `aria-disabled="true"` rather than the native `disabled` attribute so they remain focusable. | `src/components/Seat/JetsSeat.js` (commit `05e19d4`); `src/components/TooltipGlobal/TooltipGlobal.js` (commit `972a228`); `src/components/DeckSelector/index.js` (commit `8615629`). |
| 4.1.3 | Status Messages | AA | Supports (`liveAnnouncer`) | A custom `useLiveAnnouncer` hook renders a visually-hidden `aria-live="polite"` region and announces seat select, unselect, and jump-to-seat (`seatJumpTo`). All strings are localised. The widget does not announce the running selected-seat total — that remains the host's responsibility (see README *Host responsibilities*). | `src/common/hooks/useLiveAnnouncer.js` (commit `d614ecc`). |

---

## Override Responsibility

When the host swaps a default component via `componentOverrides`, the
override inherits the ARIA contract the default implementation provides.
The library cannot enforce this at compile time — a custom component that
ships without the contract silently regresses the conformance claims above.

- **`JetsSeat`** — a custom seat MUST render an activatable element with
  `role="gridcell"` when `gridSemantics` is on (the default is a
  `<button type="button">`; a `<div>` substitute needs `role="button"` in
  addition, plus `Enter`/`Space` handling), pass through the accessible
  name and `aria-selected`/`aria-disabled`, honour the roving `tabindex`
  contract (exactly one cell per deck at `0`, the rest at `-1`), use
  `aria-disabled="true"` rather than the native `disabled` attribute for
  unavailable seats, and preserve the `.jets-seat` class and
  `data-testid`/seat-number attributes the parent queries for focus
  restoration and `seatJumpTo`.
- **`JetsTooltip` / `TooltipGlobal.view`** — a custom tooltip MUST carry
  `role="dialog"` (without `aria-modal`) when `tooltipDialog` is on,
  provide an accessible name, wire `aria-describedby` to the amenities
  block and (when present) the restriction-reason text, auto-focus the
  primary action on open, close on `Escape`, and restore focus to the
  trigger seat.
- **`JetsNotInit`** — a custom loading-state component SHOULD carry
  `role="status"` (or render inside a live region) and provide a visible,
  localised loading message rather than relying on decorative imagery
  alone.

---

## Known Limitations

- **Horizontal layout.** `config.horizontal` rotates the seat map via CSS
  (`rotate`); keyboard navigation and tooltip positioning are not
  re-mapped for the rotated axes. This is a known, documented limitation
  — parity with the sibling Angular library, which has the same gap.
  Tracked for a future iteration; does not regress any AA claim made for
  the default (vertical) layout.
- **Default colour theme.** `config.wcag.defaultColorTheme` exists as a
  resolver flag but has no implementation behind it yet — enabling it has
  no visible effect. Contrast remains entirely the consumer's
  `colorTheme` responsibility (SC 1.4.3, 1.4.11).
- **Target size in grid mode.** SC 2.5.8 is only fully addressed via the
  `alternativeView` list/auto modes; the default grid view's seat-button
  footprint depends on consumer-supplied `width` and `colorTheme` and is
  not independently guaranteed at ≥24×24 CSS px for every configuration.
- **Deck-selector semantics.** `landmarksAndSkipLink` applies
  `role="switch"`/`aria-checked` semantics only to the common two-deck
  toggle case. A `role="tablist"`/`role="tab"` pattern for 3+ decks is
  not yet implemented.

---

## References

- WCAG 2.2 specification — [https://www.w3.org/TR/WCAG22/](https://www.w3.org/TR/WCAG22/).
- ARIA Authoring Practices Guide, Grid pattern —
  [https://www.w3.org/WAI/ARIA/apg/patterns/grid/](https://www.w3.org/WAI/ARIA/apg/patterns/grid/).
- Sibling library's Accessibility Conformance Report (behavioural
  reference for this port) — `jets-seatmap-angular-lib`, `docs/ACR.md`,
  branch `WCAG`.
- Implementation plan and per-commit decisions —
  [`docs/wcag/PLAN.md`](./wcag/PLAN.md).
