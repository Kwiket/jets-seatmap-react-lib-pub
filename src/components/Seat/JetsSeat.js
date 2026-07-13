import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  JetsContext,
  ENTITY_TYPE_MAP,
  ENTITY_STATUS_MAP,
  LOCALES_MAP,
  DEFAULT_LANG,
  JetsDataHelper,
  buildSeatAriaLabel,
  computeSeatPosition,
} from '../../common';
import { SeatIcon } from './ui/SeatIcon';
import { SeatPriceLabel } from './ui/SeatPriceLabel';

import './JetsSeat.css';

const PASSENGER_BADGE_SIZE_COEF = 0.8;

export const JetsSeat = ({ data, colIndex, rowIndex, rowSeats }) => {
  const {
    onSeatClick,
    showTooltip,
    onTooltipClose,
    seatLabelJumpTo,
    resetSeatJumpTo,
    params,
    config,
    colorTheme,
    wcagFlags,
  } = useContext(JetsContext);
  const {
    letter,
    type,
    status,
    size,
    passenger,
    color,
    rotation,
    seatType,
    seatIconType,
    topOffset,
    leftOffset,
    number,
    price,
    priceValue,
    currency,
  } = data;
  const { index, aisle } = ENTITY_TYPE_MAP;
  const componentClassNames = `jets-seat jets-${type} jets-${status} ${!!rotation ? `jets-seat-r-${rotation}` : ''}`;
  const showSeatPriceLabel = price && config?.visibleSeatPriceLabels;

  const gridOn = !!wcagFlags?.gridSemantics;
  const keyboardOn = !!wcagFlags?.keyboardNavigation;
  const isSeatType = type === ENTITY_TYPE_MAP.seat;
  const isInteractiveSeat =
    isSeatType &&
    (status === ENTITY_STATUS_MAP.available ||
      status === ENTITY_STATUS_MAP.selected ||
      status === ENTITY_STATUS_MAP.preferred ||
      status === ENTITY_STATUS_MAP.extra);

  const locale = LOCALES_MAP[config?.lang] ?? LOCALES_MAP[DEFAULT_LANG] ?? {};

  const seatAriaLabel = isSeatType
    ? buildSeatAriaLabel(data, computeSeatPosition(data, { seats: rowSeats ?? [data] }), locale)
    : null;

  const nonSeatAriaLabel = () => {
    if (isSeatType) return null;
    if (type === ENTITY_TYPE_MAP.aisle) return locale['aisle'] || 'aisle';
    if (type === ENTITY_TYPE_MAP.empty) return locale['empty'] || 'empty';
    if (type === ENTITY_TYPE_MAP.index) {
      const rowLabel = locale['row'] || 'Row';
      return number ? `${rowLabel} ${number}` : locale['index'] || rowLabel;
    }
    return locale['empty'] || 'empty';
  };

  const ariaSelected = isInteractiveSeat
    ? status === ENTITY_STATUS_MAP.selected ||
      status === ENTITY_STATUS_MAP.preferred ||
      status === ENTITY_STATUS_MAP.extra
    : null;
  const ariaDisabled = isSeatType && !isInteractiveSeat;

  // Roving tabindex: when keyboard nav is on, every cell starts at -1 and the
  // SeatMap roving effect promotes exactly one to 0. When grid semantics are on
  // but keyboard nav is off, a real seat stays an individual tab stop.
  const rovingTabIndex = keyboardOn ? -1 : isSeatType ? 0 : -1;

  const gridAttrs = gridOn
    ? {
        role: 'gridcell',
        tabIndex: rovingTabIndex,
        ...(colIndex != null ? { 'aria-colindex': colIndex } : {}),
        ...(rowIndex != null ? { 'aria-rowindex': rowIndex } : {}),
        ...(isSeatType
          ? {
              type: 'button',
              ...(seatAriaLabel ? { 'aria-label': seatAriaLabel } : {}),
              ...(ariaSelected === null ? {} : { 'aria-selected': ariaSelected }),
              ...(ariaDisabled ? { 'aria-disabled': 'true' } : {}),
            }
          : { 'aria-label': nonSeatAriaLabel() }),
      }
    : {};

  const RootTag = gridOn && isSeatType ? 'button' : 'div';

  const handleClick = e => {
    if (gridOn && isSeatType && !isInteractiveSeat) return;
    onSeatClick(data, $component, e);
  };

  const $component = useRef();

  const [passengerStyle, setPassengerStyle] = useState(() => {
    return {
      width: size.width * PASSENGER_BADGE_SIZE_COEF,
      height: size.width * PASSENGER_BADGE_SIZE_COEF,
      // left: size.width / 2 - size.width * (PASSENGER_BADGE_SIZE_COEF / 2),
      // top: size.height / 2 - size.width * (PASSENGER_BADGE_SIZE_COEF / 2),
      backgroundColor: colorTheme.defaultPassengerBadgeColor,
      color: colorTheme.defaultPassengerBadgeLabelColor,
      border: `1px solid ${colorTheme.defaultPassengerBadgeBorderColor}`,
      transform: params?.antiRotation,
    };
  });

  const getSeatContent = () => {
    if (type === index || type === aisle) return ''; //letter;

    if (passenger) return passenger.abbr || 'P';

    return '';
  };

  let rtlStyle = '';
  if (params?.isHorizontal && (type === aisle || type === index)) {
    rtlStyle = params.rightToLeft ? '' : 'rotate(180deg)';
  }

  const style = {
    width: size.width,
    height: size.height,
    top: topOffset,
    left: leftOffset,
    transform: rtlStyle,
  };

  const svgStyle = {
    strokeColor: colorTheme.seatStrokeColor,
    armrestColor: colorTheme.seatArmrestColor,
    fillColor: color,
    strokeWidth: colorTheme.seatStrokeWidth,
  };

  const indexContentStyle = {
    transform: `${params?.antiRotation} scale(${params.antiScale})`,
    color: colorTheme.seatLabelColor,
    zIndex: 100,
  };

  const updatePassengerStyle = () => {
    if (!$component.current) return;

    const $seatSvg = $component.current.querySelector('.seat');

    if (!$seatSvg) return;
    const newPassengerStyle = { ...passengerStyle };
    // const { height } = $seatSvg.getBoundingClientRect();
    // const preparedHeight = height * params.antiScale;
    // newPassengerStyle.top = preparedHeight / 2 - newPassengerStyle.height / 2;

    if (passenger?.passengerColor) {
      newPassengerStyle.backgroundColor = passenger.passengerColor;
    }

    setPassengerStyle(newPassengerStyle);
  };

  useEffect(() => {
    if (!passenger) return;

    updatePassengerStyle();
  }, [passenger]);

  useEffect(() => {
    if (!seatLabelJumpTo || number?.toUpperCase() !== seatLabelJumpTo?.toUpperCase()) return;

    $component.current?.scrollIntoView();

    showTooltip(data, $component, { nativeEvent: null });
    resetSeatJumpTo();
  }, [seatLabelJumpTo]);

  const onMouseLeave = (data, $component, e) => {
    if (!e?.relatedTarget?.className?.includes('tooltip')) {
      onTooltipClose(data, $component, e);
    }
  };

  return (
    <RootTag
      ref={$component}
      style={style}
      className={componentClassNames}
      onClick={handleClick}
      onMouseEnter={params.tooltipOnHover ? e => showTooltip(data, $component, e) : null}
      onMouseLeave={params.tooltipOnHover ? e => onMouseLeave(data, $component, e) : null}
      data-testid="jets-seat"
      {...gridAttrs}
    >
      {seatType && type !== index ? (
        <>
          {showSeatPriceLabel && <SeatPriceLabel priceValue={priceValue} currency={currency} maxWidth={size.width} />}
          <div className={`jets-seat-number ST-${seatIconType}`}>{`${number}`}</div>
          <SeatIcon seatType={seatType} style={svgStyle} />
          {passenger && (
            <div className="jets-seat-passenger" style={passengerStyle}>
              <div style={{ transform: params?.isHorizontal && !params?.rightToLeft ? 'rotate(180deg)' : '' }}>
                {getSeatContent()}
              </div>
            </div>
          )}
        </>
      ) : (
        <div style={indexContentStyle} data-testid="jets-seat-index">
          {getSeatContent()}
        </div>
      )}
    </RootTag>
  );
};
