import React, { useContext, useLayoutEffect, useRef, useState } from 'react';
import { JetsContext } from '../../common';

import './index.css';

const noseStyledSVG =
  style => `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="200" height="214" viewBox="0 0 200 214">

<style type="text/css">
	.nose-filling-straight{fill:${style.straightFillColor};}
	.nose-filling{fill:${style.hullColor};}
	.nose-outline{fill:none;stroke:${style.outlineColor};stroke-width:${style.strokeWidth};stroke-linejoin:round;stroke-miterlimit:10;}
	.nose-windows{fill:${style.windowColor};}
	.nose-dotted-line{fill:none;stroke:none;stroke-width:${style.strokeWidth};stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:0.9715,5.8292;}
</style>
	
<path class="nose-filling-straight" d="M1.5 213.5H198.5L198.3 189.5V189.5C198.432 183.009 197.551 176.63 195.513 170.466C183.455 134.002 137.233 2 100 2C62.7343 2.08626 16.4645 134.331 4.45578 170.661C2.43787 176.766 1.5 183.07 1.5 189.5V189.5L1.5 213.5Z" />
<path class="nose-filling" d="M1.5 191C1.5 191 2.03703 191.308 3 191C9.75537 188.837 37.4722 179.675 47.8 179.5C61.1 179.4 86.8 190 100.1 190C113 190 137.9 179.5 150.8 179.6C163 179.7 197.1 191 197.1 191H198.5V189.4V189.4C198.5 182.97 197.562 176.666 195.544 170.561C183.535 134.232 137.266 2 100 2C62.7343 2.08626 16.4645 134.331 4.45578 170.661C2.43787 176.766 1.5 183.07 1.5 189.5V189.5V191Z" />
<path class="nose-dotted-line" d="M5 190C14.0715 187.075 38.297 179.661 47.8 179.5C61.1 179.4 86.8 190 100.1 190C113 190 137.9 179.5 150.8 179.6C161.176 179.685 187.392 187.554 195 190"/>
<path class="nose-outline" d="M198.5 213.5V190.435C198.5 183.385 197.47 176.464 195.252 169.772C182.801 132.214 136.97 2 100 2C63.0303 2 17.199 132.214 4.7484 169.772C2.53029 176.464 1.5 183.385 1.5 190.435V213.5" />
<path class="nose-windows" d="M143 102.9L138.8 118.7C149.8 122 160 126.4 160 126.4C160 126 151 111.4 147.6 107.2C146.4 105.7 145 104.3 143 102.9Z" fill="white"/>
<path class="nose-windows" d="M140.4 101.2C137.9 99.9 134.6 98.6 130 97.3C118.8 94.1 101 94 101 94V114.4C101 114.4 120.9 114.4 130 116.4C131.9 116.8 133.9 117.3 135.9 117.9L140.4 101.2Z" fill="white"/>
<path class="nose-windows" d="M57 102.9C55 104.3 53.7 105.7 52.4 107.2C49 111.4 40 126 40 126.4C40 126.4 50.2 122 61.2 118.7L57 102.9Z" fill="white"/>
<path class="nose-windows" d="M70.0001 97.3C65.4001 98.6 62.1001 99.9 59.6001 101.2L64.1001 117.8C66.1001 117.2 68.1001 116.7 70.0001 116.3C79.1001 114.3 98.0001 114.3 98.0001 114.3V94C98.0001 94 81.2001 94.1 70.0001 97.3Z" fill="white"/>
</svg>
`;

const SVG_WIDTH = 200; /// SVG is 200px wide originally

export const JetsNose = ({ isFull }) => {
  const { params, colorTheme } = useContext(JetsContext);
  const [realSize, setRealSize] = useState(0);

  const elementRef = useRef(null);

  const { fuselageFillColor, fuselageStrokeColor, fuselageWindowsColor, floorColor } = colorTheme;

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

  const content = noseStyledSVG(noseStyle);

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
