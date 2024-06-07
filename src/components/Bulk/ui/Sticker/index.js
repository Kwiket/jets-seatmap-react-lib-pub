import React, { useEffect, useRef, useState, useContext } from 'react';
import { STICKER_TEMPLATE_MAP } from '../../constants';
import { JetsContext, SCALE_TYPES } from '../../../../common';

export const Sticker = ({ iconType }) => {
  const [componentClassName, setComponentClassName] = useState('');
  const $component = useRef();
  const { params, colorTheme, config } = useContext(JetsContext);

  const { bulkIconColor } = colorTheme;

  const preparedIconType = iconType ? iconType.toLowerCase().trim() : '';

  const onLoadSticker = () => {
    if (!$component.current) return;

    const { width, height } = $component.current.getBoundingClientRect();
    const orientationCheck = params?.isHorizontal ? height > width : width > height;

    const stickerClass = orientationCheck ? 'bulk__sticker--album' : 'bulk__sticker--portrait';

    setComponentClassName(stickerClass);
  };

  useEffect(() => {
    onLoadSticker();
  }, []);

  let coloredStickerSVG = STICKER_TEMPLATE_MAP.get(preparedIconType);
  // if (preparedIconType && !coloredStickerSVG) {
  //   console.log('NOT SUPPORTED STICKER:', preparedIconType);
  // }
  coloredStickerSVG = preparedIconType && coloredStickerSVG?.replace('$stickerColor', bulkIconColor);
  const bulkStickerClass = config.scaleType === SCALE_TYPES.ZOOM ? 'zoomed_bulk__sticker' : 'bulk__sticker';

  return (
    <div className={`${bulkStickerClass} ${componentClassName}`} ref={$component}>
      {preparedIconType && (
        <div
          className="bulk__icon"
          dangerouslySetInnerHTML={{
            __html: coloredStickerSVG,
          }}
        />
      )}
    </div>
  );
};
