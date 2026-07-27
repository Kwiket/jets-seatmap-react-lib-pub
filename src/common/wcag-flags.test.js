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
