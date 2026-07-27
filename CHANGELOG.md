# Changelog

All notable changes to `@seatmaps.com/react-lib` are documented in this
file. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/); this project
loosely adheres to [Semantic Versioning](https://semver.org/).

## [3.1.0] — WCAG 2.2 AA accessibility (opt-in)

Adds an opt-in WCAG 2.2 Level AA accessibility layer, gated entirely
behind `config.wcag`, plus a full
[Accessibility Conformance Report](docs/ACR.md) and a new *Accessibility*
section in the [README](README.md).

**Fully opt-in — no change when `config.wcag` is unset.** Every seat
renders as the same `<div class="jets-seat">` it always has, with no new
roles, attributes, or behaviour, unless a consumer explicitly turns on
`config.wcag`.

### Added

- `feat(a11y)`: `config.wcag` flags + `getWcagFlags` resolver
  (`src/common/wcag-flags.js`). Master `enabled` shortcut plus granular
  boolean flags (`gridSemantics`, `keyboardNavigation`, `tooltipDialog`,
  `liveAnnouncer`, `visibleRestrictionReason`, `landmarksAndSkipLink`) and
  a three-state `alternativeView: 'grid' | 'list' | 'auto'`.
  `keyboardNavigation` implies `gridSemantics`.
- `feat(a11y)`: accessible-name builder (`src/common/a11y.js`) producing
  ARIA labels for every seat (e.g. `"14C, aisle, extra legroom, available,
  €12"`).
- `feat(a11y)`: decorative graphics (fuselage, wings, nose, tail, deck
  separators, bulk, deck exits, amenity icons) get `aria-hidden="true"`.
  Always-on, independent of `config.wcag`.
- `feat(a11y)`: `prefers-reduced-motion` respected for the loading-state
  animation. Always-on.
- `feat(a11y)`: `forced-colors` (Windows High Contrast) support — focus
  rings, seat borders and decorative markers stay visible instead of
  disappearing under forced colours.
- `feat(a11y)`: grid semantics behind `gridSemantics` — seats become
  `<button role="gridcell">` with `aria-label`/`aria-selected`/
  `aria-disabled`, rows/decks carry `aria-rowindex`/`aria-colindex`, and a
  visible `:focus-visible` ring is added.
- `feat(a11y)`: 2D keyboard navigation behind `keyboardNavigation` —
  arrow keys, `Home`/`End`, `Ctrl+Home`/`Ctrl+End`, `PageUp`/`PageDown`,
  `Ctrl+Arrow` skim, roving `tabindex`, and scroll-into-view on focus
  change.
- `feat(a11y)`: the built-in tooltip becomes a non-modal `role="dialog"`
  behind `tooltipDialog` — auto-focus on the primary action, arrow-key
  roving between its buttons, `Escape` to close with focus restored to
  the trigger seat, and seat-grid keyboard navigation paused while open.
- `feat(a11y)`: visible seat-restriction reason behind
  `visibleRestrictionReason` — a reason line renders under a disabled
  Select button, wired via `aria-describedby`.
- `feat(a11y)`: `LiveAnnouncer` behind `liveAnnouncer` — a custom
  `useLiveAnnouncer` hook mounts a polite `aria-live` region announcing
  seat select / unselect / jump-to-seat. No new runtime dependency.
- `feat(a11y)`: landmarks + skip link behind `landmarksAndSkipLink` — the
  widget wraps itself in a `role="region"` landmark with a visually-hidden
  heading and a keyboard-only skip link, and the two-deck deck-selector
  gets `role="switch"`/`aria-checked` semantics.
- `feat(a11y)`: alternative list view (`JetsSeatList`) behind
  `wcag.alternativeView` (`'grid' | 'list' | 'auto'`) — a semantic
  `<table>` of every seat with filters and price sorting. `'auto'`
  switches to it below a 480px viewport and shows a view-toggle button;
  `'grid'`/`'list'` are pinned with no toggle.

### Changed

- `fix(tooltip)`: a downward-opening tooltip now flips above the seat when
  opening below would push its action buttons out of the nearest scroll
  container (`overflow: auto/scroll/hidden` ancestor) or the viewport.
  This is a genuine bug fix (previously the buttons could land off-screen),
  and it applies to **all vertical seat maps regardless of `config.wcag`** —
  the one behavioural change that is not gated behind the accessibility
  flags. Horizontal maps are unaffected.

### Docs

- `docs(a11y)`: README *Accessibility* section (flag reference, enabling
  instructions, always-on behaviours, and host responsibilities) +
  `docs/ACR.md` (full WCAG 2.2 A+AA conformance matrix, override
  responsibilities, and known limitations) + this CHANGELOG.

### Known limitations

- Horizontal layout (`config.horizontal`) rotates the seat map via CSS;
  keyboard navigation and tooltip positioning are not re-mapped for the
  rotated axes. Documented in `docs/ACR.md`.
- `config.wcag.defaultColorTheme` is a reserved flag with no palette
  implemented behind it yet — colour/contrast remains the consumer's
  `colorTheme` responsibility.

[3.1.0]: https://github.com/Kwiket/jets-seatmap-react-lib-pub/compare/v3.0.77...v3.1.0
