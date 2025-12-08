import React, { useContext, useRef, useState, useLayoutEffect } from 'react';
import { JetsContext } from '../../common';

import './index.css';

const tailStyledSVG =
  style => `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 200 80">
<style type="text/css">
	.tail-filling-straight{fill:${style.straightFillColor};stroke:${style.outlineColor};stroke-width:${style.strokeWidth};stroke-miterlimit:10;}
	.tail-filling{fill:${style.hullColor};}
	.tail-outline{fill:none;stroke:${style.outlineColor};stroke-width:${style.strokeWidth};stroke-miterlimit:10;}
	.tail-dotted-line{fill:none;stroke:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:0.9808,5.8847;}
</style>
<path class="tail-filling-straight" d="M2.4,38.5c-0.6-3.5-0.9-7.1-0.9-10.7V0h197v27.4c0,3.8-0.3,7.6-1,11.4c-1.3,7.4-3.9,21.3-7.6,37.5H9.7
	C6.1,59.8,3.6,45.8,2.4,38.5z"/>
<path class="tail-filling" fill-rule="evenodd" clip-rule="evenodd" d="M9.7,76.3C4.5,52.2,1.5,33.1,1.5,33.1V29H5c0.2,0,0.4-0.1,0.6-0.1c8.7-1.4,32.4-5.4,42-5.5
	c6.7,0,16.4,3.8,26.1,7.7c9.7,3.8,19.3,7.7,26,7.7c6.4,0,15.7-3.8,25.1-7.6c9.5-3.9,18.9-7.7,25.4-7.7c10,0.1,35.2,4.1,44.2,5.5
	l0.5,0.1h3.6v4.1c0,0-3.1,19-8.6,43.1H9.7z"/>
<path class="tail-dotted-line" d="M5,29c8.1-1.4,32.7-5.5,42.6-5.6c13.3-0.1,38.8,15.4,52.1,15.4c12.8,0,37.6-15.4,50.5-15.4c10.2,0.1,36.2,4.2,44.7,5.6"/>
<path class="tail-outline" d="M9.7,76.1h180.2"/>
<path class="tail-outline" d="M12.9,76.3H9.7C6.1,59.8,3.6,45.8,2.4,38.5c-0.6-3.5-0.9-7.1-0.9-10.7V0 M186.7,76.3h3.3c3.6-16.2,6.3-30.1,7.6-37.5
	c0.7-3.8,1-7.5,1-11.4V0"/>
</svg>`;

const SVG_WIDTH = 200; /// SVG is 200px wide originally

export const JetsTail = ({ isFull }) => {
  const { params, colorTheme } = useContext(JetsContext);
  const [realSize, setRealSize] = useState(0);
  const elementRef = useRef(null);

  const { fuselageFillColor, fuselageStrokeColor, floorColor } = colorTheme;

  const strokeWidth = colorTheme.fuselageStrokeWidth / (params.innerWidth / SVG_WIDTH);

  const tailStyle = {
    hullColor: fuselageFillColor,
    outlineColor: fuselageStrokeColor,
    straightFillColor: isFull ? fuselageFillColor : floorColor,
    strokeWidth: strokeWidth,
  };

  useLayoutEffect(() => {
    setRealSize(elementRef.current.getBoundingClientRect().width);
  }, []);

  const content = tailStyledSVG(tailStyle);

  const shouldJoinTop = isFull || true;
  const shouldJoinBottom = false;

  const bottomMargin = params?.isHorizontal && !params?.rightToLeft ? shouldJoinTop : shouldJoinBottom;
  const topMargin = params?.isHorizontal && !params?.rightToLeft ? shouldJoinBottom : shouldJoinTop;

  const rotation = params?.isHorizontal && !params?.rightToLeft ? 'rotate(180deg)' : '';
  const distanceFromBorder = (1.5 - strokeWidth * 0.5) * (params.innerWidth / SVG_WIDTH) * 0.5; // 1.5 is a pixel distance of outline from SVG border

  const style = {
    transform: `${rotation} scale(${(realSize + distanceFromBorder) / realSize})`,
    fill: fuselageStrokeColor,
    marginTop: topMargin ? '-16px' : '',
    marginBottom: bottomMargin ? '-8px' : '',
  };

  return (
    <div
      className={`jets-tail ${isFull ? '' : 'cut'}`}
      style={style}
      ref={elementRef}
      dangerouslySetInnerHTML={{
        __html: content,
      }}
      data-testid="jets-tail"
    ></div>
  );
};
