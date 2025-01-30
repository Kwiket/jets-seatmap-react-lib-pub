import React, { useContext, useRef } from 'react';
import { JetsContext, LOCALES_MAP, DEFAULT_DECK_TITLE_HEIGHT, SCALE_TYPES } from '../../common';
import { useEnvironmentInfo } from '../../common/hooks/useEnvironmentInfo';

import './DeckTitle.css';

export const JetsDeckTitle = ({ number, lang, localeKey }) => {
  const { config, params, colorTheme } = useContext(JetsContext);
  const elementRef = useRef(null);

  const { isSafari } = useEnvironmentInfo();

  const shouldAdjustScaling = isSafari && config?.scaleType === SCALE_TYPES.ZOOM;

  const style = {
    transform: shouldAdjustScaling ? undefined : `scale(${params.antiScale}) translateY(30px)`,
    zoom: shouldAdjustScaling ? params.antiScale : undefined,
    height: `${DEFAULT_DECK_TITLE_HEIGHT}px`,
    color: colorTheme.deckLabelTitleColor,
  };

  return (
    <div className="jets-deck--title" style={style} ref={elementRef}>
      {LOCALES_MAP[lang][localeKey]}: {number}
    </div>
  );
};
