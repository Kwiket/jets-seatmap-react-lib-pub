import React, { useContext, useRef } from 'react';
import { JetsContext, LOCALES_MAP } from '../../common';

import './index.css';

const DEFAULT_CABIN_HIGHLIGHT_WIDTH = 3;

export const JetsCabinTitle = ({ top, height, lang, localeKey }) => {
  const { params, colorTheme } = useContext(JetsContext);
  const elementRef = useRef(null);

  const cabinHighlightColors = colorTheme.cabinTitlesHighlightColors;

  const style = {
    color: colorTheme.cabinTitlesLabelColor,
    top,
    height,
    width: params.innerWidth,
  };

  const lLabelsStyle = {
    transform: `translateY(-50%) rotate(-90deg) scale(${params.antiScale})`,
  };

  const rLabelsStyle = {
    transform: `translateY(-50%) rotate(90deg) scale(${params.antiScale})`,
  };

  const lHighLightStyle = {
    height,
    borderRight: `${DEFAULT_CABIN_HIGHLIGHT_WIDTH * params.antiScale}px solid ${cabinHighlightColors[localeKey]}`,
  };

  const rHighLightStyle = {
    height,
    borderLeft: `${DEFAULT_CABIN_HIGHLIGHT_WIDTH * params.antiScale}px solid ${cabinHighlightColors[localeKey]}`,
  };

  return (
    <div className="jets-cabin-title-container" style={style} ref={elementRef}>
      <div className="jets-cabin-title-hl-left" style={lHighLightStyle}>
        <div className="jets-cabin-title-label-left" style={lLabelsStyle}>
          {LOCALES_MAP[lang][localeKey]}
        </div>
      </div>

      <div className="jets-cabin-title-hl-right" style={rHighLightStyle}>
        <div className="jets-cabin-title-label-right" style={rLabelsStyle}>
          {LOCALES_MAP[lang][localeKey]}
        </div>
      </div>
    </div>
  );
};
