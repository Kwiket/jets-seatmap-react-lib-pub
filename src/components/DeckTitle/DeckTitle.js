import React, { useContext, useRef } from 'react';
import { JetsContext, LOCALES_MAP, DEFAULT_DECK_TITLE_HEIGHT } from '../../common';

import './index.css';

export const JetsDeckTitle = ({ number, lang, localeKey }) => {
  const { params, colorTheme } = useContext(JetsContext);
  const elementRef = useRef(null);

  const style = {
    transform: `scale(${params.antiScale}) translateY(30px)`,
    height: `${DEFAULT_DECK_TITLE_HEIGHT}px`,
    color: colorTheme.deckLabelTitleColor,
  };

  return (
    <div className="jets-deck--title" style={style} ref={elementRef}>
      {LOCALES_MAP[lang][localeKey]}: {number}
    </div>
  );
};
