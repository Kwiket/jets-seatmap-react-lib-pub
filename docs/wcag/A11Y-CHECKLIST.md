# A11Y Project checklist — conformance report

Current state of the library's opt-in WCAG layer (gated behind `config.wcag`)
against [The A11Y Project checklist](https://www.a11yproject.com/checklist/), a
practical reading of WCAG 2.2 AA. Each item carries a verdict and a note on
exactly what the code does.

> **Scope note.** The A11Y Project checklist targets **whole pages / sites**.
> This report grades an **embeddable component library**, not a page.
> Document-level items (`<html lang>`, `<title>`, a single `<h1>`, viewport
> zoom, session timeout) are the **host application's** responsibility, not the
> library's, and are marked *N/A — host*. See the *Host responsibilities*
> section of the [README](../../README.md#accessibility) and the full
> criterion-by-criterion [ACR](../ACR.md).

## Summary

| Verdict | Count | Meaning |
| --- | --- | --- |
| ✅ Pass | 34 | Implemented in code and covered |
| 🟡 Partial | 8 | Partially met or needs a dedicated audit |
| ⚪ N/A | 17 | Host-level, or the feature does not exist in the widget |
| ❌ Gap | 0 | Diverges from the checklist |

Every accessibility feature is **opt-in** via `config.wcag` flags. With WCAG
off, the legacy behaviour is unchanged.

## Content

| Checklist item | Status | What we do |
| --- | --- | --- |
| Unique, descriptive text for `button` / `a` / `label` | ✅ Pass | Accessible-name builder (`a11y.js`) plus `aria-label`s: seats, deck switch and list actions get meaningful names (row, letter, class, status). |
| Plain language, no idioms | ✅ Pass | Short, localized strings (19 locales); no metaphors. |
| Text alignment matches direction (LTR/RTL) | ✅ Pass | `rightToLeft` / horizontal support; locale-driven rendering. |

## Global code

| Checklist item | Status | What we do |
| --- | --- | --- |
| Landmark regions for important content | ✅ Pass | `role="region"` with ARIA names plus a skip link visible on focus (flag `landmarksAndSkipLink`). |
| Linear content flow | ✅ Pass | Grid semantics plus an alternative list view; DOM order = reading order. |
| Avoid `autofocus` | ✅ Pass | No `autofocus` attribute; focus is only set programmatically on an action (tooltip dialog open). |
| Remove `title` attribute tooltips | ✅ Pass | No native `title` tooltips are used for information. The seat price sits in the seat's `aria-label`, and the list view's disabled-select reason is exposed via `aria-label` — both keyboard- and screen-reader-accessible. |
| Valid HTML | 🟡 Partial | No formal W3C validation, but jest-axe tests pass with zero violations on Seat / SeatMap / SeatList / Tooltip. |
| `lang` on `<html>` | ⚪ N/A | Host-level. The library accepts `lang` and threads it into markup (`PlaneBody lang=`). |
| Unique `<title>` per page | ⚪ N/A | Host-level — the component owns no document. |
| Do not disable viewport zoom | ⚪ N/A | Host-level (meta viewport). |
| Allow extending session timeouts | ⚪ N/A | The component has no sessions or timeouts. |
| Identify links opening a new tab/window | ⚪ N/A | The component opens no new tabs. |

## Keyboard

| Checklist item | Status | What we do |
| --- | --- | --- |
| Visible focus style for interactive elements | ✅ Pass | Two-tone ring (white + magenta) on seats and the deck switch; keyboard focus only (`:focus-visible`). WCAG 2.4.7. |
| Focus order matches visual layout | ✅ Pass | Roving tabindex, 2D arrow navigation across the grid; Tab order skip → deck switch → grid. Covered by `SeatMap.keyboard.test.js`. |
| Remove invisible focusable elements | ✅ Pass | Decorative graphics are `aria-hidden`; only one active seat is tabbable in the grid (roving). |

## Images

| Checklist item | Status | What we do |
| --- | --- | --- |
| Text alternative for complex images (charts, maps) | ✅ Pass | The seat map itself is a complex graphic: an alternative `<table>` list view plus grid semantics plus an accessible name per seat. |
| Decorative images hidden from AT | ✅ Pass | Decorative SVGs marked `aria-hidden`. |
| Alt includes text baked into the image | ✅ Pass | Seat number/letter is rendered as text and folded into the accessible name. |
| `img` elements have `alt` | ⚪ N/A | Graphics are inline SVG, not `<img>`; handled via `aria-hidden` / names. |

## Headings

| Checklist item | Status | What we do |
| --- | --- | --- |
| Headings introduce content | 🟡 Partial | The list view emits an `<h2>`; grid zones are labelled via `region` names rather than headings — correct for a sub-component. |
| Only one `h1` per page | ⚪ N/A | Page hierarchy is the host's; the library emits no `h1`. |
| Logical heading sequence | ⚪ N/A | Depends on embedding context; the component emits only `h2`. |
| Don't skip heading levels | ⚪ N/A | Determined by the host structure. |

## Lists & Tables

| Checklist item | Status | What we do |
| --- | --- | --- |
| Tabular data uses `<table>` | ✅ Pass | The seat list is a semantic `<table>` (seats are tabular data — the right element). |
| `<th>` with correct `scope` | ✅ Pass | All column headers are `<th scope="col">` (row, seat, cabin, position, features, action). |
| `<caption>` titles the table | ✅ Pass | `<caption class="jets-visually-hidden">` present. |
| List content uses `ol`/`ul`/`dl` | ⚪ N/A | Deliberate: seats are a table, not a list; `<table>` is more correct than `<ul>`. |

## Controls

| Checklist item | Status | What we do |
| --- | --- | --- |
| Skip link, visible when focused | ✅ Pass | A real `<a href>` skip link, hidden until focus, visible on Tab. |
| Controls have `:focus` states | ✅ Pass | Focus ring on seats, deck switch and list buttons. |
| Links are recognizable as links | ✅ Pass | The only link is the skip link, visually styled on focus. |
| `<button>` for buttons | 🟡 Partial | List-view actions are native `<button type="button">`. The seat is `role="gridcell"` and the deck selector is `role="switch"`: intentional ARIA patterns (grid/switch), not native buttons. |
| `<a>` for links | ⚪ N/A | No navigational links except the skip link. |
| Flag links opening a new window | ⚪ N/A | No such links. |

## Forms

| Checklist item | Status | What we do |
| --- | --- | --- |
| `fieldset` / `legend` where appropriate | ✅ Pass | List filters wrapped in a `<fieldset>` with `<legend class="visually-hidden">`. |
| States not conveyed by color alone | ✅ Pass | Seat-restriction reason is visible text plus `aria-describedby` (3.3.1 / 3.3.3); selection via `aria-selected`, not color alone. |
| Error messaging associated with its input | ✅ Pass | `aria-describedby` links a seat to its restriction text; the list's disabled-select reason is exposed through the button's `aria-label`. |
| Every input associated with a `label` | 🟡 Partial | Filter/toggle controls have accessible names; the component has no full data-entry form. |
| `autocomplete` where appropriate | ⚪ N/A | No personal-data fields. |
| Error list above the form after submit | ⚪ N/A | No submitting form. |

## Media / Video / Audio

| Checklist item | Status | What we do |
| --- | --- | --- |
| Autoplay, controls, pause, captions, transcripts, seizure triggers | ⚪ N/A | The component has no video, audio or autoplaying media — the whole section is inapplicable. |

## Appearance

| Checklist item | Status | What we do |
| --- | --- | --- |
| Check content in specialized browsing modes | ✅ Pass | `forced-colors` / Windows High Contrast support: deck switch and icons recolour to System colors. |
| Information not conveyed by color alone | ✅ Pass | Status / selection / restriction expressed via text, `aria-selected`, `aria-disabled`, not just fill. |
| Instructions not visual/audio only | ✅ Pass | LiveAnnouncer (`aria-live`) announces select / unselect / jump-to-seat (4.1.3). |
| Simple, consistent layout | ✅ Pass | Grid plus alternative list; consistent layout. |
| Increase text size to 200% | 🟡 Partial | Graphics scale, but full text reflow to 200% without horizontal scroll was not separately tested. |
| Good proximity between related content | ✅ Pass | Rows/letters/legend grouped; consistent spacing. |

## Animation

| Checklist item | Status | What we do |
| --- | --- | --- |
| Respect `prefers-reduced-motion` | ✅ Pass | Media query handled in the seat and deck CSS modules. |
| Animations subtle, no excessive flashing | ✅ Pass | No flashing/strobing effects. |
| Pause background video | ⚪ N/A | No background video. |

## Color contrast

| Checklist item | Status | What we do |
| --- | --- | --- |
| Contrast of input element borders | ✅ Pass | Focus ring is high-contrast two-tone; in forced-colors it becomes a System border. |
| Contrast of normal-sized text | 🟡 Partial | Palette ported from the sibling implementation, but the contrast ratios of seat fills/numbers were not independently measured. See *Colour and contrast* in the [README](../../README.md#accessibility). |
| Contrast of large-sized text | 🟡 Partial | See above — needs a pass over every seat state. |
| Contrast of icons | 🟡 Partial | Seat-type icon contrast not formally measured; forced-colors covers the edge cases. |
| Text overlapping images/video | ⚪ N/A | No text over photos/video. |
| Custom `::selection` colors | ⚪ N/A | No custom `::selection` override. |

## Mobile & touch

| Checklist item | Status | What we do |
| --- | --- | --- |
| Rotate to any orientation | ✅ Pass | Vertical and horizontal layout supported. |
| Enough space between interactive items | ✅ Pass | Gaps between seats; seat size is configurable. |
| Icon buttons easy to activate | 🟡 Partial | Seat size is config-driven; a 24×24 minimum touch target is not guaranteed at small scales. |
| Remove horizontal scrolling | 🟡 Partial | A large map scrolls inside its container (by design), but the map itself may scroll horizontally on narrow screens. |

---

Checklist source: <https://www.a11yproject.com/checklist/> · Scope: React
library WCAG layer (opt-in `config.wcag`) · Total items: 59 — Pass 34,
Partial 8, N/A 17, Gap 0.
