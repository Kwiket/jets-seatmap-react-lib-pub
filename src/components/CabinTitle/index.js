import React, { useContext, useRef } from 'react';
import { JetsContext, LOCALES_MAP } from '../../common';

import './index.css';

const DEFAULT_CABIN_HIGHLIGHT_WIDTH = 3;

export const JetsCabinTitle = ({ top, height, lang, localeKey }) => {
  const { params, colorTheme, config } = useContext(JetsContext);
  const elementRef = useRef(null);

  const cabinHighlightColors = colorTheme.cabinTitlesHighlightColors;
  const title =
    config.customCabinTitles && config.customCabinTitles[localeKey]
      ? config.customCabinTitles[localeKey]
      : LOCALES_MAP[lang][localeKey];

  const style = {
    color: colorTheme.cabinTitlesLabelColor,
    top,
    height,
    width: params.innerWidth,
  };

  const lLabelsStyle = {
    transform: `translateY(-50%) rotate(-90deg)`,
    zoom: params.antiScale,
  };

  const rLabelsStyle = {
    transform: `translateY(-50%) rotate(90deg)`,
    zoom: params.antiScale,
  };

  const lHighlightStyle = {
    height,
    borderRight: `${DEFAULT_CABIN_HIGHLIGHT_WIDTH * params.antiScale}px solid ${cabinHighlightColors[localeKey]}`,
  };

  const rHighlightStyle = {
    height,
    borderLeft: `${DEFAULT_CABIN_HIGHLIGHT_WIDTH * params.antiScale}px solid ${cabinHighlightColors[localeKey]}`,
  };

  return (
    <div className="jets-cabin-title-container" style={style} ref={elementRef}>
      <div className="jets-cabin-title-hl-left" style={lHighlightStyle}>
        <div className="jets-cabin-title-label-left" style={lLabelsStyle}>
          {title}
        </div>
      </div>

      <div className="jets-cabin-title-hl-right" style={rHighlightStyle}>
        <div className="jets-cabin-title-label-right" style={rLabelsStyle}>
          {title}
        </div>
      </div>
    </div>
  );
};
