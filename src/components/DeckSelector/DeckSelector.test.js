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
});
