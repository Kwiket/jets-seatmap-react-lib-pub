import { render, screen, fireEvent } from '@testing-library/react';

import { MockJetsContextProvider } from '../../__mocks__/MockJetsContext';

import { JetsDeckSelector } from './index';

const setup = ({ direction = false, params = {}, config = {}, wcagFlags, events = {} } = {}) => ({
  ...render(
    <MockJetsContextProvider config={config} params={params} wcagFlags={wcagFlags} events={events}>
      <JetsDeckSelector direction={direction} />
    </MockJetsContextProvider>
  ),
});

describe('JetsDeckSelector', () => {
  it('renders no role/aria-checked/aria-label when wcag.landmarksAndSkipLink is off (zero-change)', () => {
    setup({ direction: false, wcagFlags: undefined });

    const selector = document.querySelector('.jets-deck-selector');
    expect(selector.getAttribute('role')).toBeNull();
    expect(selector.getAttribute('aria-checked')).toBeNull();
    expect(selector.getAttribute('aria-label')).toBeNull();
  });

  it('renders no switch semantics when wcag is enabled but landmarksAndSkipLink is explicitly off', () => {
    setup({ direction: true, wcagFlags: { enabled: true, landmarksAndSkipLink: false } });

    const selector = document.querySelector('.jets-deck-selector');
    expect(selector.getAttribute('role')).toBeNull();
    expect(selector.getAttribute('aria-checked')).toBeNull();
  });

  it('renders role=switch with aria-checked=false and a localized aria-label for the default (first) deck', () => {
    setup({ direction: false, wcagFlags: { enabled: true, landmarksAndSkipLink: true } });

    const selector = screen.getByRole('switch');
    expect(selector.getAttribute('aria-checked')).toBe('false');
    expect(selector.getAttribute('aria-label')).toBe('Switch deck');
  });

  it('renders role=switch with aria-checked=true for a non-default active deck', () => {
    setup({ direction: true, wcagFlags: { enabled: true, landmarksAndSkipLink: true } });

    const selector = screen.getByRole('switch');
    expect(selector.getAttribute('aria-checked')).toBe('true');
  });

  it('does not change the existing click-to-switch-deck behavior when the flag is on', () => {
    const switchDeck = jest.fn();
    setup({
      direction: false,
      wcagFlags: { enabled: true, landmarksAndSkipLink: true },
      events: { switchDeck },
    });

    const selector = screen.getByRole('switch');
    expect(selector.className).toBe('jets-deck-selector');

    fireEvent.click(selector);
    expect(switchDeck).toHaveBeenCalledTimes(1);
  });

  it('is a keyboard tab stop (tabindex=0) when the switch semantics are on', () => {
    setup({ direction: false, wcagFlags: { enabled: true, landmarksAndSkipLink: true } });

    const selector = screen.getByRole('switch');
    expect(selector.getAttribute('tabindex')).toBe('0');
  });

  it('toggles the deck on Enter and Space, calling switchDeck with no argument (toggle, not jump-to-index)', () => {
    const switchDeck = jest.fn();
    setup({
      direction: false,
      wcagFlags: { enabled: true, landmarksAndSkipLink: true },
      events: { switchDeck },
    });

    const selector = screen.getByRole('switch');
    fireEvent.keyDown(selector, { key: 'Enter' });
    fireEvent.keyDown(selector, { key: ' ' });

    expect(switchDeck).toHaveBeenCalledTimes(2);
    expect(switchDeck).toHaveBeenNthCalledWith(1);
    expect(switchDeck).toHaveBeenNthCalledWith(2);
  });

  it('injects the glyph directly on the div (no wrapper span) when the flag is off — version-3 DOM preserved', () => {
    setup({ direction: false, wcagFlags: undefined });

    const selector = document.querySelector('.jets-deck-selector');
    // Direct-child SVG: consumer CSS like `.jets-deck-selector > svg` keeps matching.
    expect(selector.querySelector(':scope > svg')).not.toBeNull();
    expect(selector.querySelector(':scope > span')).toBeNull();
  });

  it('wraps the glyph in an aria-hidden span when the switch semantics are on', () => {
    setup({ direction: false, wcagFlags: { enabled: true, landmarksAndSkipLink: true } });

    const selector = document.querySelector('.jets-deck-selector');
    const wrapper = selector.querySelector(':scope > span');
    expect(wrapper).not.toBeNull();
    expect(wrapper.getAttribute('aria-hidden')).toBe('true');
    expect(wrapper.querySelector('svg')).not.toBeNull();
  });

  it('is not a tab stop and ignores keyboard when the flag is off (zero-change)', () => {
    const switchDeck = jest.fn();
    setup({ direction: false, wcagFlags: undefined, events: { switchDeck } });

    const selector = document.querySelector('.jets-deck-selector');
    expect(selector.getAttribute('tabindex')).toBeNull();

    fireEvent.keyDown(selector, { key: 'Enter' });
    expect(switchDeck).not.toHaveBeenCalled();
  });
});
