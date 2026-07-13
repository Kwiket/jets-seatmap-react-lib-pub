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
