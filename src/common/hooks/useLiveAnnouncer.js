import React, { useCallback, useRef } from 'react';

// Visually-hidden but still readable by screen readers. Deliberately NOT
// `display: none` (or `visibility: hidden`) — either of those removes the
// node from the accessibility tree and the live region would never fire.
const VISUALLY_HIDDEN_STYLE = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  overflow: 'hidden',
  clip: 'rect(0,0,0,0)',
  whiteSpace: 'nowrap',
  border: 0,
  padding: 0,
  margin: '-1px',
};

/**
 * Custom hook backing the WCAG 4.1.3 (Status Messages) live-announcer.
 *
 * Renders a polite `aria-live` region and exposes an `announce` function to
 * push a message into it. The region's text is cleared and re-set on a
 * microtask so that announcing the same message twice in a row (e.g.
 * selecting the same seat number after unselecting it) still produces a
 * fresh announcement — screen readers only speak on a text-content change,
 * so setting identical text back-to-back would otherwise be silently
 * swallowed.
 *
 * @returns {Object} An object containing:
 *  - `announce` {(message: string) => void} - Pushes `message` into the live region.
 *  - `LiveRegion` {() => JSX.Element} - The visually-hidden `aria-live` region to render.
 */
export const useLiveAnnouncer = () => {
  const regionRef = useRef(null);
  const timeoutRef = useRef(null);

  const announce = useCallback(message => {
    const node = regionRef.current;
    if (!node) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    node.textContent = '';
    timeoutRef.current = setTimeout(() => {
      if (regionRef.current) {
        regionRef.current.textContent = message;
      }
      timeoutRef.current = null;
    }, 0);
  }, []);

  const LiveRegion = useCallback(
    () => <div ref={regionRef} aria-live="polite" aria-atomic="true" style={VISUALLY_HIDDEN_STYLE} />,
    []
  );

  return { announce, LiveRegion };
};
