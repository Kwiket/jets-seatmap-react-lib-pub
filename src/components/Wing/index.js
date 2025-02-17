import React from 'react';
import { useWings } from './useWings';

import './index.css';

export const JetsWing = ({ wingsInfo }) => {
  const { isWingLeadingVisible, style } = useWings(wingsInfo);

  return (
    <div className="jets-wings-alignment-wrapper" style={style.wrapper}>
      <div className={`jets-wings`} style={style.container} data-testid="jets-wings">
        {isWingLeadingVisible && (
          <>
            <div className={'wing-leading left'} style={style.leading?.left}></div>
            <div className={'wing-leading right'} style={style.leading?.right}></div>
          </>
        )}

        <div className={'wing left'} style={style.wing}></div>
        <div className={'wing right'} style={style.wing}></div>
      </div>
    </div>
  );
};
