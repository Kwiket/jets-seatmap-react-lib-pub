import React from 'react';
import { render, act } from '@testing-library/react';
import { useLiveAnnouncer } from './useLiveAnnouncer';

jest.useFakeTimers();

const TestHost = ({ onReady }) => {
  const { announce, LiveRegion } = useLiveAnnouncer();
  onReady(announce);
  return <LiveRegion />;
};

const setup = () => {
  let announce;
  const utils = render(<TestHost onReady={fn => (announce = fn)} />);
  return { ...utils, announce: msg => announce(msg) };
};

describe('useLiveAnnouncer', () => {
  it('renders a live region with the required ARIA attributes', () => {
    const { container } = setup();
    const region = container.querySelector('[aria-live]');
    expect(region).not.toBeNull();
    expect(region.getAttribute('aria-live')).toBe('polite');
    expect(region.getAttribute('aria-atomic')).toBe('true');
  });

  it('is visually hidden without using display:none', () => {
    const { container } = setup();
    const region = container.querySelector('[aria-live]');
    expect(region.style.display).not.toBe('none');
    expect(region.style.position).toBe('absolute');
    expect(region.style.width).toBe('1px');
    expect(region.style.height).toBe('1px');
    expect(region.style.overflow).toBe('hidden');
    expect(region.style.clip).toBe('rect(0px, 0px, 0px, 0px)');
    expect(region.style.whiteSpace).toBe('nowrap');
    expect(region.style.margin).toBe('-1px');
  });

  it('setting a message updates the region text content', () => {
    const { container, announce } = setup();
    const region = container.querySelector('[aria-live]');

    act(() => {
      announce('Seat 14C selected for John Doe');
      jest.runAllTimers();
    });

    expect(region.textContent).toBe('Seat 14C selected for John Doe');
  });

  it('clears the text before re-setting it, so identical messages are re-announced', () => {
    const { container, announce } = setup();
    const region = container.querySelector('[aria-live]');

    act(() => {
      announce('Seat 14C cleared');
      jest.runAllTimers();
    });
    expect(region.textContent).toBe('Seat 14C cleared');

    // Announcing the exact same message again must clear the node first
    // (synchronously) before the timer re-sets the text — otherwise a screen
    // reader sees no text-content change and stays silent.
    act(() => {
      announce('Seat 14C cleared');
    });
    expect(region.textContent).toBe('');

    act(() => {
      jest.runAllTimers();
    });
    expect(region.textContent).toBe('Seat 14C cleared');
  });

  it('a later announce cancels a pending earlier one', () => {
    const { container, announce } = setup();
    const region = container.querySelector('[aria-live]');

    act(() => {
      announce('first message');
      announce('second message');
      jest.runAllTimers();
    });

    expect(region.textContent).toBe('second message');
  });
});
