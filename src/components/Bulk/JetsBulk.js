import React, { useContext, useEffect, useRef, useState } from 'react';
import DOMPurify from 'dompurify';

import { Sticker } from './ui/Sticker';

import './index.css';

import { DECK_ITEM_ALIGN_MAP, DEFAULT_STYLE_POSITION, SCALE_TYPES } from '../../common/constants';
import { BULK_TEMPLATE_MAP } from './constants';
import { JetsContext, useEnvironmentInfo } from '../../common';

const DEFAULT_SCALE_BULK_COEFF = 0.7;
const SCALE_TO_BULK_COEFF_MAP = { 26: 1, 27: 1, 28: 1 };

export const JetsBulk = ({ id, type, align, width, height, iconType, xOffset, topOffset }) => {
  const { params, config, colorTheme } = useContext(JetsContext);
  const { bulkBaseColor, bulkCutColor, bulkIconColor } = colorTheme;
  const [stickerWrapperHeight, setStickerWrapperHeight] = useState(0);
  const $component = useRef(null);

  const { isSafari } = useEnvironmentInfo();

  const [style, setStyle] = useState(() => {
    const scaleBulkCoeff = SCALE_TO_BULK_COEFF_MAP[id] || DEFAULT_SCALE_BULK_COEFF;

    const updatedWidth = Math.floor(width * scaleBulkCoeff);
    const updatedHeight = Math.floor(height * scaleBulkCoeff);

    const leftAlignment = align === DECK_ITEM_ALIGN_MAP.left ? Math.max(xOffset, 0) : DEFAULT_STYLE_POSITION;
    const rightAlignment = align === DECK_ITEM_ALIGN_MAP.right ? Math.max(xOffset, 0) : DEFAULT_STYLE_POSITION;
    const centerOfThePlane = params.innerWidth / 2;
    const halfOfTheBulk = updatedWidth / 2;

    const centerAlignment =
      align === DECK_ITEM_ALIGN_MAP.center && xOffset
        ? Math.floor(xOffset * scaleBulkCoeff + centerOfThePlane - halfOfTheBulk)
        : DEFAULT_STYLE_POSITION;

    return {
      top: topOffset,
      left: align === DECK_ITEM_ALIGN_MAP.left ? leftAlignment : centerAlignment,
      right: rightAlignment,
      width: updatedWidth,
      height: updatedHeight,
      transform: align === DECK_ITEM_ALIGN_MAP.right ? 'scaleX(-1)' : '',
    };
  });

  const addFontSizeToBulk = () => {
    const coeffFontSize = 10;
    const bulkFontSize = style.width > style.height ? style.width / coeffFontSize : style.height / coeffFontSize;

    const updatedStyle = { ...style };

    updatedStyle.fontSize = `${Math.round(bulkFontSize)}px`;

    setStyle(updatedStyle);
  };

  const onLoadBulk = () => {
    if (!$component.current) return;

    const $bulkBase = $component.current.querySelector('.bulk-base');

    if (!$bulkBase) return;

    const clientRect = $bulkBase.getBoundingClientRect();
    const bulkPartHeight = params?.isHorizontal ? clientRect.width : clientRect.height;

    // we should ignore anti-scale for Safari when scaleType is set to 'zoom'
    // to avoid incorrect positioning of bulk-stickers
    const shouldIgnoreAntiScale = isSafari && config?.scaleType === SCALE_TYPES.ZOOM;
    const preparedBulkPartHeight = shouldIgnoreAntiScale ? bulkPartHeight : bulkPartHeight * params?.antiScale;

    const preparedStickerWrapperHeight = Math.round(style.height - preparedBulkPartHeight * DEFAULT_SCALE_BULK_COEFF);

    setStickerWrapperHeight(preparedStickerWrapperHeight);
  };

  useEffect(() => {
    addFontSizeToBulk();
    onLoadBulk();
  }, []);

  let coloredBulkSVG = BULK_TEMPLATE_MAP.get(id);
  if (!coloredBulkSVG) {
    // console.log('coloredBulkSVG is not found:', id);
    return <div className="bulk" ref={$component}></div>;
  }
  coloredBulkSVG = coloredBulkSVG?.replace('$baseColor', bulkBaseColor);
  coloredBulkSVG = coloredBulkSVG?.replace('$cutColor', bulkCutColor);
  coloredBulkSVG = coloredBulkSVG?.split('$stickerColor').join(bulkIconColor);
  const sanitizedColoredBulkSVG = DOMPurify.sanitize(coloredBulkSVG);

  return (
    <div className="bulk" style={style} ref={$component} data-testid="jets-bulk">
      <div
        className="bulk__icon"
        dangerouslySetInnerHTML={{
          __html: sanitizedColoredBulkSVG,
        }}
      />
      {
        <div
          className="bulk__sticker_wrap"
          style={{
            height: `${stickerWrapperHeight}px`,
          }}
        >
          <Sticker iconType={iconType} />
        </div>
      }
    </div>
  );
};
