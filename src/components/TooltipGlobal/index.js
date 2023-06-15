import React, { useContext, useRef, useLayoutEffect, useState } from 'react';
import { JetsButton } from '../Button';
import { DEFAULT_SEAT_PASSENGER_TYPES, JetsContext, LOCALES_MAP, DEFAULT_FEATURES_RENDER_LIMIT } from '../../common';
import './index.css';

const CANCEL_BTN_KEY = 'cancel';
const SELECT_BTN_KEY = 'select';
const UNSELECT_BTN_KEY = 'unselect';
const PASSENGER_KEY = 'passenger';
const RESTRICTION_KEY = 'seatRestrictions';

export const JetsTooltipGlobal = ({ data }) => {
  const { isSeatSelectDisabled, onTooltipClose, onSeatSelect, onSeatUnselect, colorTheme, params } =
    useContext(JetsContext);

  const elementRef = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);
  const [tooltipWidth, setTooltipWidth] = useState(0);
  const [position, setPosition] = useState(0);

  const {
    tooltipBackgroundColor,
    tooltipHeaderColor,
    tooltipBorderColor,
    tooltipFontColor,
    tooltipIconColor,
    tooltipIconBorderColor,
    tooltipIconBackgroundColor,
    tooltipSelectButtonTextColor,
    tooltipSelectButtonBackgroundColor,
    tooltipCancelButtonTextColor,
    tooltipCancelButtonBackgroundColor,
  } = colorTheme;

  const {
    number,
    classType,
    top,
    left,
    features,
    measurements,
    price,
    passenger,
    nextPassanger,
    passengerTypes,
    lang,
    rowName,
    antiScale,
    // transformOrigin,
    width,
    seatmapHeight,
    seatmapWidth,
    seatmapElement,
    // pointerOffset,
    seatNode,
    additionalProps,
  } = data;

  const pointerHeight = 14;
  const pointerWidth = 16;
  const seatHeight = data.size.height / antiScale;
  const seatWidth = data.size.width / antiScale;

  const parentRow = seatNode.closest('.jets-row');
  const parentRowRect = parentRow.getBoundingClientRect();

  const seatRect = seatNode.getBoundingClientRect();
  const seatmapRect = seatmapElement.getBoundingClientRect();

  const seatY = seatRect.top - seatmapRect.top;
  const seatX = seatRect.left - seatmapRect.left;
  const rowY = parentRowRect.top - document.body.getBoundingClientRect().top;

  const seatmapParentRect = seatmapElement.parentElement.getBoundingClientRect();

  const keyForPosition = params?.isHorizontal ? 'left' : 'top';
  const keyForSize = params?.isHorizontal ? 'width' : 'height';
  const seatmapParentCenter = seatmapParentRect[keyForPosition] + seatmapParentRect[keyForSize] * 0.5;

  const allowedLeft = tooltipWidth < seatX;
  const allowedRight = (seatX + tooltipWidth) < seatmapRect.width;
  const preferredLeft = parentRowRect[keyForPosition] > seatmapParentCenter;

  const negatePositionVertical = Number(rowY > tooltipHeight);
  const negatePositionHorizontal = Number(allowedLeft) * Number(preferredLeft);

  const relativeSeatY = tooltipHeight - seatY;

  const posDiff = Math.min(relativeSeatY - pointerWidth, 0);

  const horizontalPointerOffset = tooltipHeight - relativeSeatY + posDiff;

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
    left: seatX,
    transform: `rotate(${180 * (1 - negatePositionVertical)}deg)`,
    borderColor: `${tooltipBorderColor} transparent transparent transparent`,
    display: params?.isHorizontal ? 'none' : '',
  };

  const pointerLeftPercentage = params?.rightToLeft ? negatePositionHorizontal : 1 - negatePositionHorizontal;

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

  const finalListOfFeatures = [...(features || []), ...(additionalProps || [])].slice(0, DEFAULT_FEATURES_RENDER_LIMIT);

  return (
    <div
      style={style}
      className={`jets-tooltip ${params?.isHorizontal ? 'horizontal' : ''}`}
      // className={`jets-tooltip`}
      ref={elementRef}
      onMouseLeave={params.tooltipOnHover ? onTooltipClose : null}
    >
      <div className="jets-tooltip--arrow-pointer" style={pointerStyle}></div>
      <div className="jets-tooltip--arrow-pointer-horizontal" style={pointerStyleHorizontal}></div>
      <div className={`jets-tooltip--body ${shouldHideButtons ? 'no-buttons' : ''}`}>
        <div className="jets-tooltip--content">
          <div className="jets-tooltip--header" style={headerStyle}>
            <div className="jets-tooltip--header-title">
              {rowName || classType} {number}
            </div>
            <div className="jets-tooltip--header-price">{price}</div>
          </div>

          <div className="jets-tooltip--passenger-name" style={featureListStyle}>
            {passengerLabel.length ? passengerLabel : restrictionsLabel}
          </div>

          <div className="jets-tooltip--features" style={featureListStyle}>
            <ul>
              {finalListOfFeatures.map(({ uniqId, title, icon, value }) => (
                <li className="jets-tooltip--feature" key={uniqId}>
                  {icon ? (
                    <span
                      className="svg_span"
                      dangerouslySetInnerHTML={{
                        __html: icon,
                      }}
                    ></span>
                  ) : (
                    <span>{title}</span>
                  )}
                  <div style={{ color: tooltipFontColor }}>{value}</div>
                </li>
              ))}
              {finalListOfFeatures.length % 2 == 1 && <li className="jets-tooltip--feature">&nbsp;</li>}
            </ul>
          </div>

          <div className="jets-tooltip--measurements">
            {measurements.map(({ uniqId, title, icon, value }) => (
              <div
                style={{ borderColor: tooltipIconBorderColor, background: tooltipIconBackgroundColor }}
                className="jets-tooltip--measurement"
                key={uniqId}
              >
                {icon ? (
                  <span
                    className="svg_span"
                    style={{ fill: tooltipIconColor }}
                    dangerouslySetInnerHTML={{
                      __html: icon,
                    }}
                  ></span>
                ) : (
                  <span></span>
                )}
                <div className="jets-tooltip--measurement-box">
                  <div className="jets-tooltip--measurement-value">{title}</div>
                  <div className="jets-tooltip--measurement-value">{value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="jets-tooltip--btns-block">
          <JetsButton
            onClick={onTooltipClose}
            content={LOCALES_MAP[lang][CANCEL_BTN_KEY]}
            className="jets-btn jets-tooltip--btn"
            style={{ color: tooltipCancelButtonTextColor, backgroundColor: tooltipCancelButtonBackgroundColor }}
          />
          {passenger ? (
            <JetsButton
              onClick={() => onSeatUnselect(data)}
              content={LOCALES_MAP[lang][UNSELECT_BTN_KEY]}
              className="jets-btn jets-tooltip--btn "
              style={{ color: tooltipSelectButtonTextColor, backgroundColor: tooltipSelectButtonBackgroundColor }}
            />
          ) : (
            <JetsButton
              disabled={isSeatSelectDisabled(data)}
              onClick={() => onSeatSelect(data)}
              content={LOCALES_MAP[lang][SELECT_BTN_KEY]}
              className="jets-btn jets-tooltip--btn "
              style={{ color: tooltipSelectButtonTextColor, backgroundColor: tooltipSelectButtonBackgroundColor }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
