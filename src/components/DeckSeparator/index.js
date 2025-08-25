import React, { useContext, useRef } from 'react';
import { JetsContext } from '../../common';

import './index.css';

export const JetsDeckSeparator = ({ width }) => {
  const { params, colorTheme } = useContext(JetsContext);
  const elementRef = useRef(null);

  const style = {
    height: colorTheme.deckSeparation,
    background: colorTheme.fuselageFillColor,
  };

  return <div className={`jets-deck-separator`} data-testid="jets-deck-separator" style={style} ref={elementRef}></div>;
};
