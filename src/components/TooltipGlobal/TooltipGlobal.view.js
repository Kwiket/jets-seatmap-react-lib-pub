import React from 'react';

import { LOCALES_MAP } from '../../common';

import { JetsButton } from '../Button';

import './TooltipGlobal.css';

const CANCEL_BTN_KEY = 'cancel';
const SELECT_BTN_KEY = 'select';
const UNSELECT_BTN_KEY = 'unselect';

export const JetsTooltipGlobalView = ({
  colorTheme,
  data,
  elementRef,
  featureListStyle,
  finalListOfFeatures,
  headerStyle,
  isSeatSelectDisabled,
  params,
  passengerLabel,
  pointerStyle,
  pointerStyleHorizontal,
  shouldHideButtons,
  rootStyle,
  onSeatSelect,
  onSeatUnselect,
  onTooltipClose,
}) => {
  const {
    tooltipFontColor,
    tooltipIconColor,
    tooltipIconBorderColor,
    tooltipIconBackgroundColor,
    tooltipSelectButtonTextColor,
    tooltipSelectButtonBackgroundColor,
    tooltipCancelButtonTextColor,
    tooltipCancelButtonBackgroundColor,
  } = colorTheme;
  const { number, classType, measurements, price, passenger, lang, rowName, name: seatName } = data;

  const handleSeatSelect = () => onSeatSelect(data);

  const handleSeatUnselect = () => onSeatUnselect(data);

  const handleTooltipClose = e => onTooltipClose(null, null, e);

  return (
    <div
      style={rootStyle}
      className={`jets-tooltip ${params?.isHorizontal ? 'horizontal' : ''}`}
      ref={elementRef}
      onMouseLeave={params.tooltipOnHover ? handleTooltipClose : null}
    >
      <div className="jets-tooltip--arrow-pointer" style={pointerStyle}></div>
      <div className="jets-tooltip--arrow-pointer-horizontal" style={pointerStyleHorizontal}></div>
      <div className={`jets-tooltip--body ${shouldHideButtons ? 'no-buttons' : ''}`}>
        <div className="jets-tooltip--content">
          <div className="jets-tooltip--header" style={headerStyle}>
            <div className="jets-tooltip--header-title">
              {seatName || rowName || classType} {number}
            </div>
            <div className="jets-tooltip--header-price">{price}</div>
          </div>

          <div className="jets-tooltip--passenger-name" style={featureListStyle}>
            {passengerLabel}
          </div>

          <div className="jets-tooltip--features" style={featureListStyle}>
            <ul>
              {finalListOfFeatures.map(({ uniqId, title, icon, value, cssClass }) => (
                <li className={`jets-tooltip--feature ${cssClass || ''}`} key={uniqId}>
                  {icon ? (
                    <span
                      className={`svg_span ${cssClass ? cssClass + '-icon' : ''}`}
                      dangerouslySetInnerHTML={{
                        __html: icon,
                      }}
                    ></span>
                  ) : (
                    <span>{title}</span>
                  )}
                  <div
                    className={`${cssClass ? cssClass + '-label' : ''}`}
                    style={cssClass ? {} : { color: tooltipFontColor }}
                  >
                    {value}
                  </div>
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
            onClick={handleTooltipClose}
            content={LOCALES_MAP[lang][CANCEL_BTN_KEY]}
            className="jets-btn jets-tooltip--btn"
            style={{ color: tooltipCancelButtonTextColor, backgroundColor: tooltipCancelButtonBackgroundColor }}
          />
          {passenger ? (
            <JetsButton
              disabled={data?.passenger?.readOnly}
              onClick={handleSeatUnselect}
              content={LOCALES_MAP[lang][UNSELECT_BTN_KEY]}
              className="jets-btn jets-tooltip--btn "
              style={{ color: tooltipSelectButtonTextColor, backgroundColor: tooltipSelectButtonBackgroundColor }}
            />
          ) : (
            <JetsButton
              disabled={isSeatSelectDisabled}
              onClick={handleSeatSelect}
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
