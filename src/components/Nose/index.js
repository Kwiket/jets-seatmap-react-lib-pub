import React, { useContext, useLayoutEffect, useRef, useState } from 'react';
import { JetsContext, THEME_FUSELAGE_NOSE_TYPE_DEFAULT } from '../../common';
import { noseTemplateService } from './service';

import './index.css';

const SVG_WIDTH = 200; /// SVG is 200px wide originally

export const JetsNose = ({ isFull }) => {
  const { params, colorTheme } = useContext(JetsContext);
  const [realSize, setRealSize] = useState(0);

  const elementRef = useRef(null);

  const { fuselageFillColor, fuselageStrokeColor, fuselageWindowsColor, floorColor, fuselageNoseType } = colorTheme;

  const strokeWidth = colorTheme.fuselageStrokeWidth / (params.innerWidth / SVG_WIDTH);

  const noseStyle = {
    hullColor: fuselageFillColor,
    windowColor: fuselageWindowsColor,
    outlineColor: fuselageStrokeColor,
    straightFillColor: isFull ? fuselageFillColor : floorColor,
    strokeWidth: strokeWidth,
  };

  useLayoutEffect(() => {
    setRealSize(elementRef.current.getBoundingClientRect().width);
  }, []);

  const noseType =
    fuselageNoseType === THEME_FUSELAGE_NOSE_TYPE_DEFAULT ? THEME_FUSELAGE_NOSE_TYPE_DEFAULT : params.noseType;
  const content = noseTemplateService.getNoseImage(noseType, noseStyle);

  const shouldJoinTop = false;
  const shouldJoinBottom = isFull || true;

  const bottomMargin = params?.isHorizontal && !params?.rightToLeft ? shouldJoinTop : shouldJoinBottom;
  const topMargin = params?.isHorizontal && !params?.rightToLeft ? shouldJoinBottom : shouldJoinTop;

  const rotation = params?.isHorizontal && !params?.rightToLeft ? 'rotate(180deg)' : '';
  const distanceFromBorder = (1.5 - strokeWidth * 0.5) * (params.innerWidth / SVG_WIDTH) * 0.5; // 1.5 is a pixel distance of outline from SVG border

  const style = {
    transform: `${rotation} scale(${(realSize + distanceFromBorder) / realSize})`,
    fill: fuselageStrokeColor,
    marginTop: topMargin ? '-16px' : '',
    marginBottom: bottomMargin ? '-16px' : '',
  };

  return (
    <div
      className={`jets-nose ${isFull ? '' : 'cut'}`}
      style={style}
      ref={elementRef}
      dangerouslySetInnerHTML={{
        __html: content,
      }}
      data-testid="jets-nose"
    ></div>
  );
};
