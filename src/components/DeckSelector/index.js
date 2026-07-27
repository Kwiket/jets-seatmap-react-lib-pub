import React, { useContext, useRef } from 'react';
import { JetsContext, LOCALES_MAP, DEFAULT_LANG } from '../../common';

import './index.css';

const buttonSVG = stroke => `
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 384.97 384.97" >
<g>
	<g>
		<path fill="${stroke}" d="M360.909,0H24.061C10.767,0,0,10.767,0,24.061v336.848c0,13.293,10.767,24.061,24.061,24.061h336.848
			c13.281,0,24.061-10.767,24.061-24.061V24.061C384.97,10.767,374.191,0,360.909,0z M360.909,360.909H24.061V24.061h336.848
			V360.909z"/>
		<path fill="${stroke}" d="M59.935,240.666c0,6.785,5.883,12.151,12.56,11.97h239.92
			c10.671,0.289,16.602-12.872,8.927-20.476l-120.291-119.1c-4.74-4.692-12.403-4.523-17.191,0L63.664,232.065
			C61.379,234.242,59.935,237.274,59.935,240.666z M192.461,138.589l91.021,90.119H101.427L192.461,138.589z"/>
	</g>
</g>
</svg>
`;

export const JetsDeckSelector = ({ direction }) => {
  const { params, config, wcagFlags, colorTheme, switchDeck } = useContext(JetsContext);
  const elementRef = useRef(null);

  const { deckSelectorStrokeColor, deckSelectorFillColor, deckSelectorSize } = colorTheme;

  const style = {
    transform: `rotate(${180 * Number(direction)}deg)`,
    background: deckSelectorFillColor,
    height: deckSelectorSize,
    width: deckSelectorSize,
    left: params?.rightToLeft ? 'auto' : 0,
    right: params?.rightToLeft ? 0 : 'auto',
  };

  // wcagFlags.landmarksAndSkipLink: minimal role=switch semantics for the
  // common 2-deck toggle case. `direction` already carries the "is a
  // non-default deck active" signal (SeatMap passes `!!activeDeck`), so it
  // doubles as the checked state. Full tablist semantics for 3+ decks is out
  // of scope here and should be a follow-up.
  const switchOn = !!wcagFlags?.landmarksAndSkipLink;
  // Once it is exposed as a switch it must also be keyboard-operable (WCAG
  // 2.1.1 Keyboard): make it a tab stop and toggle the deck on Enter/Space.
  // switchDeck() is called with NO argument so it toggles — passing a truthy
  // value would be read as an explicit deck index.
  const onSwitchKeyDown = e => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault();
      switchDeck();
    }
  };
  const switchAttrs = switchOn
    ? {
        role: 'switch',
        'aria-checked': !!direction,
        'aria-label': (LOCALES_MAP[config?.lang] || LOCALES_MAP[DEFAULT_LANG])['switchDeck'] || 'Switch deck',
        tabIndex: 0,
        onKeyDown: onSwitchKeyDown,
      }
    : {};

  const glyphHtml = { __html: buttonSVG(deckSelectorStrokeColor) };

  // Only wrap the decorative glyph in an aria-hidden span when the selector is
  // actually exposed to assistive tech (role=switch, i.e. `landmarksAndSkipLink`
  // — which `enabled` also implies). With WCAG off the glyph is injected
  // straight onto the div, keeping the exact version-3 DOM so no consumer CSS
  // selector (e.g. `.jets-deck-selector > svg`) shifts.
  if (!switchOn) {
    return (
      <div
        className={`jets-deck-selector`}
        style={style}
        ref={elementRef}
        onClick={e => switchDeck()}
        dangerouslySetInnerHTML={glyphHtml}
      ></div>
    );
  }

  return (
    <div className={`jets-deck-selector`} style={style} ref={elementRef} onClick={e => switchDeck()} {...switchAttrs}>
      <span aria-hidden="true" style={{ display: 'contents' }} dangerouslySetInnerHTML={glyphHtml}></span>
    </div>
  );
};
