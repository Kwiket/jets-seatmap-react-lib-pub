import React, { useContext, useRef, useState, useLayoutEffect } from 'react';
import { JetsContext } from '../../common';

import './index.css';

const tailStyledSVG =
  style => `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"viewBox="0 0 200 240">
<style type="text/css">
	.tail-filling-straight{fill:${style.straightFillColor};stroke:${style.outlineColor};stroke-width:${style.strokeWidth};stroke-miterlimit:10;}
	.tail-filling{fill:${style.hullColor};}
	.tail-outline{fill:none;stroke:${style.outlineColor};stroke-width:${style.strokeWidth};stroke-miterlimit:10;}
	.tail-dotted-line{fill:none;stroke:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:0.9808,5.8847;}
</style>
<path class="tail-filling-straight" d="M2.3764 38.4678C1.77473 34.9207 1.5 31.332 1.5 27.7342V0H198.5V27.4086C198.5 31.2224 198.193 35.0136 197.521 38.7678C195.33 51.0122 189.575 81.2872 181.452 110.102C182.301 112.913 184.9 118.976 188.5 120.732C192.1 122.488 196.333 122.927 198 122.927V218.049L130.887 214.175C120.953 227.148 110.019 237.073 99.7 237.073C89.3766 237.073 78.4376 227.148 68.5 214.175L1.5 218.049V122.927C3.5 123.171 8.3 123.073 11.5 120.732C14.7 118.39 17.1667 112.669 18 110.102C9.94364 81.049 4.41928 50.5116 2.3764 38.4678Z"/>
<path class="tail-filling" fill-rule="evenodd" clip-rule="evenodd" d="M124.773 31.1309C115.407 34.9612 106.068 38.7806 99.7 38.7806C93.0698 38.7806 83.4079 34.9465 73.7369 31.1086C64.0079 27.2479 54.2698 23.3834 47.6 23.4153C37.9662 23.5188 14.2876 27.4678 5.61475 28.9143C5.40053 28.95 5.19547 28.9842 5 29.0168H1.5V33.1388C1.5 33.1388 7.66764 72.8413 18 110.102C17.1667 112.669 14.7 118.39 11.5 120.732C8.3 123.073 3.5 123.171 1.5 122.927V218.049L68.5 214.175C78.4376 227.148 89.3766 237.073 99.7 237.073C110.019 237.073 120.953 227.148 130.887 214.175L198 218.049V122.927C196.333 122.927 192.1 122.488 188.5 120.732C184.9 118.976 182.301 112.913 181.452 110.102C191.956 72.8413 198.5 33.1388 198.5 33.1388V29.0168H194.897L194.408 28.9387C185.443 27.5034 160.229 23.4668 150.2 23.4147C143.718 23.383 134.232 27.2625 124.773 31.1309Z"/>
<path class="tail-dotted-line" d="M5 29.0168C13.1094 27.6652 37.7283 23.5213 47.6 23.4152C60.9 23.3518 86.4 38.7806 99.7 38.7806C112.5 38.7806 137.3 23.3514 150.2 23.4147C160.417 23.4679 186.396 27.6566 194.897 29.0168" />
<path class="tail-outline" d="M1.5 0V27.7342C1.5 31.332 1.77473 34.9207 2.3764 38.4678C4.41928 50.5116 9.94364 81.049 18 110.102M18 110.102C22.7259 127.145 28.3231 143.676 34.6 155.665C38.0428 162.218 51.8691 192.465 68.5 214.175M18 110.102C17.1667 112.669 14.7 118.39 11.5 120.732C8.3 123.073 3.5 123.171 1.5 122.927V218.049L68.5 214.175M198.5 0V27.4086C198.5 31.2224 198.193 35.0136 197.521 38.7678C195.33 51.0122 189.575 81.2872 181.452 110.102M181.452 110.102C176.647 127.145 171.014 143.676 164.8 155.665C161.356 162.18 147.524 192.451 130.887 214.175M181.452 110.102C182.301 112.913 184.9 118.976 188.5 120.732C192.1 122.488 196.833 122.927 198.5 122.927V218.049L130.887 214.175M68.5 214.175C78.4376 227.148 89.3766 237.073 99.7 237.073C110.019 237.073 120.953 227.148 130.887 214.175"/>
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
