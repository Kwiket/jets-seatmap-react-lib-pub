import React, { useContext, useEffect, useRef, useState } from 'react';
import { JetsContext, ENTITY_TYPE_MAP } from '../../common';
import { SeatIcon } from './ui/SeatIcon';

import './index.css';

const PASSENGER_BADGE_SIZE_COEF = 0.8;

export const JetsSeat = ({ data }) => {
  const { onSeatClick, showTooltip, onTooltipClose, params, colorTheme } = useContext(JetsContext);
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
  } = data;
  const { index, aisle } = ENTITY_TYPE_MAP;
  const componentClassNames = `jets-seat jets-${type} jets-${status} jets-seat-r-${rotation}`;

  const $component = useRef();

  const [passengerStyle, setPassengerStyle] = useState(() => {
    return {
      width: size.width * PASSENGER_BADGE_SIZE_COEF,
      height: size.width * PASSENGER_BADGE_SIZE_COEF,
      // left: size.width / 2 - size.width * (PASSENGER_BADGE_SIZE_COEF / 2),
      // top: size.height / 2 - size.width * (PASSENGER_BADGE_SIZE_COEF / 2),
      backgroundColor: colorTheme.defaultPassengerBadgeColor,
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

  const onMouseLeave = (data, $component, e) => {
    if (!e?.relatedTarget?.className?.includes('tooltip')) {
      onTooltipClose(data, $component, e);
    }
  };

  return (
    <div
      ref={$component}
      style={style}
      className={componentClassNames}
      onClick={e => onSeatClick(data, $component, e)}
      onMouseEnter={params.tooltipOnHover ? e => showTooltip(data, $component, e) : null}
      onMouseLeave={params.tooltipOnHover ? e => onMouseLeave(data, $component, e) : null}
    >
      {seatType && type !== index ? (
        <>
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
        <div style={indexContentStyle}>{getSeatContent()}</div>
      )}
    </div>
  );
};
