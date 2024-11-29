import React, { useMemo } from 'react';

const FF_BROWSER_KEY = 'firefox';
const CHROME_BROWSER_KEY = 'chrome';
const SAFARI_BROWSER_KEY = 'safari';
const EDGE_BROWSER_KEY = 'edge';

/**
 * Custom hook to access information about the user's environment (e.g. browser info, operating system info, etc.)
 *
 * @returns {Object} An object containing:
 *  - `isFirefox` {boolean} - Indicates if the current browser is Firefox
 *  - `isChrome` {boolean} - Indicates if the current browser is Chrome
 *  - `isSafari` {boolean} - Indicates if the current browser is Safari
 *  - `isEdge` {boolean} - Indicates if the current browser is Edge
 */
export const useEnvironmentInfo = () => {
  const [isFirefox, isChrome, isSafari, isEdge] = useMemo(() => {
    const userAgent = navigator.userAgent.toLowerCase();

    const _isFirefox = userAgent.includes(FF_BROWSER_KEY);
    const _isChrome = userAgent.includes(CHROME_BROWSER_KEY);
    const _isSafari = userAgent.includes(SAFARI_BROWSER_KEY) && !userAgent.includes(CHROME_BROWSER_KEY);
    const _isEdge = userAgent.includes(EDGE_BROWSER_KEY);

    return [_isFirefox, _isChrome, _isSafari, _isEdge];
  }, []);

  return { isFirefox, isChrome, isSafari, isEdge };
};
