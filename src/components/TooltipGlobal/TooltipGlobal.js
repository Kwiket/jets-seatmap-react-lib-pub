import React, { useContext, useRef, useLayoutEffect, useState } from 'react';
import {
  DEFAULT_SEAT_PASSENGER_TYPES,
  JetsContext,
  LOCALES_MAP,
  DEFAULT_FEATURES_RENDER_LIMIT,
  SCALE_TYPES,
  useEnvironmentInfo,
} from '../../common';
import { JetsTooltipGlobalView } from './TooltipGlobal.view';

const PASSENGER_KEY = 'passenger';
const RESTRICTION_KEY = 'seatRestrictions';

export const JetsTooltipGlobal = ({ data }) => {
  const { componentOverrides, isSeatSelectDisabled, onTooltipClose, onSeatSelect, onSeatUnselect, colorTheme, params } =
    useContext(JetsContext);

  const { isSafari } = useEnvironmentInfo();

  const elementRef = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);
  const [tooltipWidth, setTooltipWidth] = useState(0);
  const [position, setPosition] = useState(0);

  const { tooltipBackgroundColor, tooltipHeaderColor, tooltipBorderColor, tooltipFontColor } = colorTheme;

  const {
    top,
    left,
    features,
    passenger,
    passengerTypes,
    lang,
    antiScale,
    scaleType,
    width,
    seatmapHeight,
    seatmapWidth,
    seatmapElement,
    seatNode,
    additionalProps,
  } = data;

  // TODO rewrite this
  const pointerHeight = 14;
  const pointerWidth = 16;
  const pointerCSSOffset = -16;
  const seatHeight = data.size.height / antiScale;
  const seatWidth = data.size.width / antiScale;

  const widthDiff = (seatWidth - pointerWidth + pointerCSSOffset / 2) / 2;

  const parentRow = seatNode.closest('.jets-row');
  const parentRowRect = parentRow.getBoundingClientRect();

  const seatRect = seatNode.getBoundingClientRect();
  const seatmapRect = seatmapElement.getBoundingClientRect();
  const seatmapParentRect = seatmapElement.parentElement.getBoundingClientRect();

  let seatY = seatRect.top - seatmapRect.top;
  let seatX = seatRect.left - seatmapRect.left;
  let rowSeatY = seatRect.top - seatmapParentRect.top;

  // here we recalculate the values using zoomCorrectionKoef for Safari browser
  // to avoid incorrect positioning of the tooltip
  if (isSafari) {
    const zoomCorrectionKoef = scaleType === SCALE_TYPES.ZOOM ? antiScale : 1;

    seatY = seatRect.top / zoomCorrectionKoef - seatmapRect.top;
    seatX = seatRect.left / zoomCorrectionKoef - seatmapRect.left;
    rowSeatY = seatRect.top / zoomCorrectionKoef - seatmapParentRect.top;
  }

  const keyForPosition = params?.isHorizontal ? 'left' : 'top';
  const keyForSize = params?.isHorizontal ? 'width' : 'height';
  const seatmapParentCenter = seatmapParentRect[keyForPosition] + seatmapParentRect[keyForSize] * 0.5;

  const allowedLeft = tooltipWidth < seatX;
  // const allowedRight = seatX + tooltipWidth < seatmapRect.width;
  const preferredLeft = parentRowRect[keyForPosition] > seatmapParentCenter;

  const negatePositionVertical = Number(rowSeatY > tooltipHeight);
  const negatePositionHorizontal = Number(allowedLeft) * Number(preferredLeft);

  const relativeSeatY = tooltipHeight - seatY;

  const posDiff = Math.min(relativeSeatY - pointerWidth, 0);

  const horizontalPointerOffset = tooltipHeight - relativeSeatY + posDiff - pointerCSSOffset / 6;

  const styleLeft = seatX + seatHeight - (tooltipWidth + seatHeight + pointerHeight) * negatePositionHorizontal;
  const styleTop = seatY + seatHeight - (tooltipHeight + seatHeight + pointerHeight) * negatePositionVertical;

  const style = {
    maxHeight: params?.isHorizontal ? seatmapHeight : 'auto',
    maxWidth: params?.isHorizontal ? seatmapWidth * 1.5 : 'auto',

    width: params?.isHorizontal ? 'auto' : width,
    top: params?.isHorizontal ? `calc(${left} - ${posDiff}px)` : styleTop,
    left: params?.isHorizontal ? styleLeft : left,

    background: tooltipBackgroundColor,
    borderColor: tooltipBorderColor,
    borderStyle: 'solid',
    color: tooltipFontColor,
  };

  const pointerStyle = {
    top: negatePositionVertical * tooltipHeight,
    left: seatX + widthDiff,
    transform: `rotate(${180 * (1 - negatePositionVertical)}deg)`,
    borderColor: `${tooltipBorderColor} transparent transparent transparent`,
    display: params?.isHorizontal ? 'none' : '',
  };

  const pointerStyleHorizontal = {
    left: `${negatePositionHorizontal * 100}%`,
    top: horizontalPointerOffset,
    transform: `rotate(${180 * negatePositionHorizontal}deg)`,
    borderColor: `transparent ${tooltipBorderColor} transparent transparent`,
    display: params?.isHorizontal ? '' : 'none',
  };

  useLayoutEffect(() => {
    setPosition(elementRef.current.getBoundingClientRect().top - document.body.getBoundingClientRect().top);
    setTooltipHeight(elementRef.current.clientHeight);
    setTooltipWidth(elementRef.current.clientWidth);
  }, [data, tooltipHeight]);

  const headerStyle = {
    color: tooltipHeaderColor,
    direction: params.rightToLeft ? 'rtl' : 'ltr',
  };

  const featureListStyle = {
    direction: params.rightToLeft ? 'rtl' : 'ltr',
  };

  const shouldHideButtons = params?.tooltipOnHover && !params?.isTouchDevice;

  let passengerLabel = '';
  if (passenger) {
    passengerLabel = passenger?.passengerLabel || `${LOCALES_MAP[lang][PASSENGER_KEY]} ${passenger?.id}`;
  }

  let restrictionsLabel = '';
  if (passengerTypes) {
    const existingRestrictions = DEFAULT_SEAT_PASSENGER_TYPES;
    const filteredPassengerTypes = passengerTypes.filter(type => existingRestrictions.includes(type));
    let typeStrings = filteredPassengerTypes.map(type => LOCALES_MAP[lang][type]);
    const isRestrictionApplied = filteredPassengerTypes.length < existingRestrictions.length;
    restrictionsLabel = isRestrictionApplied ? `${LOCALES_MAP[lang][RESTRICTION_KEY]}: ${typeStrings.join(', ')}` : '';
  }

  const filteredFeatures = (features || []).filter(f => !params.hiddenSeatFeatures.includes(f.key));
  const finalListOfFeatures = [...filteredFeatures, ...(additionalProps || [])].slice(0, DEFAULT_FEATURES_RENDER_LIMIT);

  const ResolvedTooltip = componentOverrides?.JetsTooltipView ?? JetsTooltipGlobalView;

  return (
    <ResolvedTooltip
      colorTheme={colorTheme}
      data={data}
      elementRef={elementRef}
      featureListStyle={featureListStyle}
      finalListOfFeatures={finalListOfFeatures}
      headerStyle={headerStyle}
      isSeatSelectDisabled={isSeatSelectDisabled(data)}
      params={params}
      passengerLabel={passengerLabel.length ? passengerLabel : restrictionsLabel}
      pointerStyle={pointerStyle}
      pointerStyleHorizontal={pointerStyleHorizontal}
      rootStyle={style}
      shouldHideButtons={shouldHideButtons}
      onTooltipClose={onTooltipClose}
      onSeatSelect={onSeatSelect}
      onSeatUnselect={onSeatUnselect}
    />
  );
};
