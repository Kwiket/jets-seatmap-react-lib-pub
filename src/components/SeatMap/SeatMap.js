import React, { useEffect, useRef, useState } from 'react';

import { JetsSeatMapService } from './service';
import { JetsDataHelper } from '../../common/data-helper';

import {
  DEFAULT_LANG,
  DEFAULT_SEAT_MAP_WIDTH,
  DEFAULT_HORIZONTAL_LAYOUT,
  DEFAULT_VISIBLE_HULL,
  DEFAULT_VISIBLE_WINGS,
  DEFAULT_BUILT_IN_TOOLTIP,
  DEFAULT_EXTERNAL_PASSENGER_MANAGEMENT,
  DEFAULT_SHOW_DECK_SELECTOR,
  DEFAULT_SINGLE_DECK_MODE,
  DEFAULT_TOOLTIP_ON_HOVER,
  DEFAULT_RTL,
  DEFAULT_UNITS,
  JetsContext,
  ENTITY_STATUS_MAP,
  ENTITY_TYPE_MAP,
  THEME_DECK_LABEL_TITLE_COLOR,
  THEME_FLOOR_COLOR,
  THEME_SEAT_LABEL_COLOR,
  THEME_SEAT_STROKE_COLOR,
  THEME_SEAT_STROKE_WIDTH,
  THEME_SEAT_ARMREST_COLOR,
  THEME_BULK_BASE_COLOR,
  THEME_BULK_CUT_COLOR,
  THEME_BULK_ICON_COLOR,
  THEME_DEFAULT_PASSENGER_BADGE_COLOR,
  THEME_DEFAULT_FONT_FAMILY,
  THEME_DECK_HEIGHT_SPACING,
  THEME_WINGS_WIDTH,
  THEME_DECK_SEPARATION,
  THEME_TOOLTIP_BACKGROUND_COLOR,
  THEME_TOOLTIP_BORDER_COLOR,
  THEME_TOOLTIP_FONT_COLOR,
  THEME_TOOLTIP_ICON_COLOR,
  THEME_TOOLTIP_ICON_BORDER_COLOR,
  THEME_TOOLTIP_ICON_BACKGROUND_COLOR,
  THEME_TOOLTIP_HEADER_COLOR,
  THEME_TOOLTIP_SELECT_BUTTON_TEXT_COLOR,
  THEME_TOOLTIP_SELECT_BUTTON_BACKGROUND_COLOR,
  THEME_TOOLTIP_CANCEL_BUTTON_TEXT_COLOR,
  THEME_TOOLTIP_CANCEL_BUTTON_BACKGROUND_COLOR,
  THEME_FUSELAGE_FILL_COLOR,
  THEME_FUSELAGE_OUTLINE_COLOR,
  THEME_FUSELAGE_WINDOWS_COLOR,
  THEME_FUSELAGE_WINGS_COLOR,
  THEME_DECK_SELECTOR_FILL_COLOR,
  THEME_DECK_SELECTOR_STROKE_COLOR,
  THEME_DECK_SELECTOR_SIZE,
  THEME_FUSELAGE_OUTLINE_WIDTH,
  THEME_NOT_AVAILABLE_SEATS_COLOR,
} from '../../common';
import './index.css';
import { JetsPlaneBody } from '../PlaneBody';
import { JetsDeckSelector } from '../DeckSelector';
import { JetsTooltipGlobal } from '../TooltipGlobal';

export const JetsSeatMap = ({
  flight,
  availability,
  passengers,
  config,
  currentDeckIndex,
  onSeatMapInited,
  onSeatSelected,
  onSeatUnselected,
  onTooltipRequested,
  onLayoutUpdated,
  onSeatMouseLeave,
  onSeatMouseClick,
  componentOverrides,
}) => {
  const colorTheme = JetsDataHelper.mergeColorThemeWithConstraints(
    JetsSeatMap.defaultProps.config.colorTheme,
    config.colorTheme
  );
  config.colorTheme = colorTheme;
  const configuration = { ...JetsSeatMap.defaultProps.config, ...config };

  const [content, setContent] = useState([]);
  const [isSeatMapInited, setSeatMapInited] = useState(false);
  const [passengersList, setPassengersList] = useState([]);
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [isSelectAvailable, setSelectAvailable] = useState(false);
  const [activeDeck, setActiveDeck] = useState(0);
  const [params, setParams] = useState(null);

  const [exits, setExits] = useState([]);
  const [bulks, setBulks] = useState([]);

  const hasReceivedFirstParams = useRef(false);
  const seatMapRef = useRef();
  const service = new JetsSeatMapService(configuration);

  const shouldShowOnlyOneDeck = params?.singleDeckMode && content.length > 1;
  const shouldShowBuiltInDeckSelector = params?.builtInDeckSelector && shouldShowOnlyOneDeck;

  useEffect(() => {
    let isMounted = true;

    if (flight?.id) {
      service
        .getSeatMapData(flight, availability, passengers, configuration)
        .then(data => {
          if (isMounted) {
            setParams(data.params);
            setContent(data.content);
            setExits(data.exits);
            setBulks(data.bulks);
            setSeatMapInited(true);
            onSeatMapInited({
              heightInPx: data.params?.isHorizontal ? data.params?.innerWidth : data.params?.totalDecksHeight,
              widthInPx: data.params?.isHorizontal ? data.params?.totalDecksHeight : data.params?.innerWidth,
              scaleFactor: data.params?.scale,
              decksCount: data.content?.length,
              currentDeckIndex: activeDeck,
            });
            hasReceivedFirstParams.current = false;
          }
        })
        .catch(err => {
          if (isMounted) {
            onSeatMapInited({
              heightInPx: undefined,
              widthInPx: undefined,
              scaleFactor: undefined,
              decksCount: undefined,
              currentDeckIndex: undefined,
              error: err.message,
            });
          }
        });
    }

    return () => {
      isMounted = false;
    };
  }, [flight]);

  useEffect(() => {
    const data = service.setAvailabilityHandler(content, availability);
    setPassengers();
    setContent(data);
    setActiveTooltip(null);
  }, [availability]);

  useEffect(() => {
    setPassengers();
    setActiveTooltip(null);
  }, [passengers]);

  useEffect(() => {
    if (!hasReceivedFirstParams.current && params) {
      hasReceivedFirstParams.current = true;
      switchDeck(currentDeckIndex);
      scrollRTL();
      emitSeatmapData();
    }
  }, [params]);

  useEffect(() => {
    scrollRTL();
    emitSeatmapData();
  }, [activeDeck]);

  useEffect(() => {
    switchDeck(currentDeckIndex);
  }, [currentDeckIndex]);

  const scrollRTL = () => {
    if (params?.isHorizontal && params?.rightToLeft) {
      seatMapRef.current.parentElement.scrollLeft = params.totalDecksHeight;
    }
  };

  const switchDeck = value => {
    if (!shouldShowOnlyOneDeck || content.length < 2) {
      return;
    }

    let nextDeck = (activeDeck + 1) % content.length;

    if (value !== undefined) {
      if (value < 0 || value > content.length - 1) {
        return;
      }

      nextDeck = value;
    }

    const scaledTotalDecksHeight = `${params?.separateDeckHeights[nextDeck] * (params.scale || 1)}px`;
    const totalDecksHeight = params?.separateDeckHeights[nextDeck];

    setParams({ ...params, scaledTotalDecksHeight, totalDecksHeight });
    setActiveDeck(nextDeck);
    setActiveTooltip(null);
  };

  const setPassengers = () => {
    passengers = service.addAbbrToPassengers(passengers);

    const data = service.setPassengersHandler(content, passengers || []);

    setContent(data);
    setPassengersList(passengers);
  };

  const onSeatClick = (data, element, event) => {
    const shouldSelectOnClick = params?.tooltipOnHover && !params?.isTouchDevice;

    if (shouldSelectOnClick) {
      if (params.externalPassengerManagement) {
        // if (!params.builtInTooltip) {
        const seat = prepareSeatDataForEmit(data);
        onSeatMouseClick({ seat, element: element.current, event: event.nativeEvent });
        // }
        return;
      }

      if (data?.passenger) {
        if (data?.passenger?.readOnly) {
          return;
        }
        onSeatUnselect(data);
      } else {
        if (isSeatSelectDisabled(data)) {
          return;
        }
        onSeatSelect(data);
      }
    } else {
      showTooltip(data, element, event);
    }
  };

  const emitSeatmapData = () => {
    if (!params) {
      return;
    }

    const deckHeight = params?.separateDeckHeights[activeDeck];
    const height = shouldShowOnlyOneDeck ? deckHeight : params?.totalDecksHeight;

    const data = {
      heightInPx: params?.isHorizontal ? params?.innerWidth : height,
      widthInPx: params?.isHorizontal ? height : params?.innerWidth,
      scaleFactor: params?.scale,
      decksCount: content?.length,
      currentDeckIndex: activeDeck,
    };
    onLayoutUpdated(data);
  };

  const prepareSeatDataForEmit = data => {
    const tmpData = { ...data, label: data.number };
    delete tmpData.number;
    delete tmpData.leftOffset;
    delete tmpData.topOffset;
    delete tmpData.size;

    return tmpData;
  };

  const showTooltip = (data, element, event) => {
    const seat = prepareSeatDataForEmit(data);
    onTooltipRequested({ seat, element: element.current, event: event.nativeEvent });

    if (!params.builtInTooltip) {
      return;
    }

    const notAvailable =
      data.type !== ENTITY_TYPE_MAP.seat ||
      (data.status !== ENTITY_STATUS_MAP.available && data.status !== ENTITY_STATUS_MAP.selected);

    if (notAvailable) return;

    const nextPassenger = service.getNextPassenger(passengersList);
    const tooltipData = service.calculateTooltipData(
      data,
      element.current,
      seatMapRef.current,
      params?.antiScale,
      params?.isHorizontal
    );

    setSelectAvailable(!!nextPassenger);
    setActiveTooltip({
      ...tooltipData,
      nextPassenger,
      lang: configuration.lang,
      seatmapElement: seatMapRef.current,
    });
  };

  const onSeatSelect = seat => {
    const { data, passengers: newPassengers } = service.selectSeatHandler(content, seat, passengersList);

    setContent(data);
    setPassengersList(newPassengers);
    setActiveTooltip(null);

    onSeatSelected(newPassengers);
  };

  const onSeatUnselect = seat => {
    const { data, passengers: newPassengers } = service.unselectSeatHandler(content, seat, passengersList);

    setContent(data);
    setPassengersList(newPassengers);
    setActiveTooltip(null);

    onSeatUnselected(newPassengers);
  };

  const onTooltipClose = (data, element, event) => {
    if (data && element) {
      const seat = prepareSeatDataForEmit(data);
      onSeatMouseLeave({ seat, element: element.current, event: event.nativeEvent });
    }
    setActiveTooltip(null);
  };

  const isSeatSelectDisabled = seatData => {
    const nextPassenger = service.getNextPassenger(passengersList);
    return (
      !nextPassenger ||
      (nextPassenger?.passengerType &&
        seatData.passengerTypes?.length &&
        !seatData.passengerTypes?.includes(nextPassenger?.passengerType))
    );
  };

  const scaleTransformValue = ` ${params?.rotation} ${params?.offset} scale(${params?.scale})`;

  const scaleWrapStyle = {
    transform: scaleTransformValue,
    transformOrigin: 'top left',
    width: params?.innerWidth,
    height: params?.scaledTotalDecksHeight,
  };

  const providerValue = {
    onSeatClick,
    showTooltip,
    onTooltipClose,
    onSeatSelect,
    onSeatUnselect,
    isSeatSelectDisabled,
    switchDeck,
    params,
    colorTheme,
    activeTooltip,
    componentOverrides,
  };

  return (
    <JetsContext.Provider value={providerValue}>
      <div
        ref={seatMapRef}
        className="jets-seat-map"
        style={{
          width: configuration.horizontal ? params?.scaledTotalDecksHeight : configuration.width,
          height: configuration.horizontal ? configuration.width : params?.scaledTotalDecksHeight,
          fontFamily: colorTheme.fontFamily,
        }}
      >
        {activeTooltip && <JetsTooltipGlobal data={activeTooltip} />}
        {shouldShowBuiltInDeckSelector && <JetsDeckSelector direction={!!activeDeck}></JetsDeckSelector>}
        <div style={scaleWrapStyle}>
          <JetsPlaneBody
            showOneDeck={shouldShowOnlyOneDeck}
            activeDeck={activeDeck}
            content={content}
            exits={exits}
            bulks={bulks}
            isSeatMapInited={isSeatMapInited}
            config={configuration}
          />
        </div>
      </div>
    </JetsContext.Provider>
  );
};

JetsSeatMap.defaultProps = {
  config: {
    width: DEFAULT_SEAT_MAP_WIDTH,
    horizontal: DEFAULT_HORIZONTAL_LAYOUT,
    rightToLeft: DEFAULT_RTL,
    visibleFuselage: DEFAULT_VISIBLE_HULL,
    visibleWings: DEFAULT_VISIBLE_WINGS,

    builtInTooltip: DEFAULT_BUILT_IN_TOOLTIP,
    externalPassengerManagement: DEFAULT_EXTERNAL_PASSENGER_MANAGEMENT,

    builtInDeckSelector: DEFAULT_SHOW_DECK_SELECTOR,
    singleDeckMode: DEFAULT_SINGLE_DECK_MODE,

    tooltipOnHover: DEFAULT_TOOLTIP_ON_HOVER,
    lang: DEFAULT_LANG,
    units: DEFAULT_UNITS,
    colorTheme: {
      deckLabelTitleColor: THEME_DECK_LABEL_TITLE_COLOR,
      floorColor: THEME_FLOOR_COLOR,

      seatLabelColor: THEME_SEAT_LABEL_COLOR,
      seatStrokeColor: THEME_SEAT_STROKE_COLOR,
      seatStrokeWidth: THEME_SEAT_STROKE_WIDTH,
      seatArmrestColor: THEME_SEAT_ARMREST_COLOR,

      notAvailableSeatsColor: THEME_NOT_AVAILABLE_SEATS_COLOR,

      bulkBaseColor: THEME_BULK_BASE_COLOR,
      bulkCutColor: THEME_BULK_CUT_COLOR,
      bulkIconColor: THEME_BULK_ICON_COLOR,

      fuselageFillColor: THEME_FUSELAGE_FILL_COLOR,
      fuselageStrokeColor: THEME_FUSELAGE_OUTLINE_COLOR,
      fuselageStrokeWidth: THEME_FUSELAGE_OUTLINE_WIDTH,
      fuselageWindowsColor: THEME_FUSELAGE_WINDOWS_COLOR,
      fuselageWingsColor: THEME_FUSELAGE_WINGS_COLOR,

      defaultPassengerBadgeColor: THEME_DEFAULT_PASSENGER_BADGE_COLOR,
      fontFamily: THEME_DEFAULT_FONT_FAMILY,

      deckHeightSpacing: THEME_DECK_HEIGHT_SPACING,

      wingsWidth: THEME_WINGS_WIDTH,
      deckSeparation: THEME_DECK_SEPARATION,

      tooltipBackgroundColor: THEME_TOOLTIP_BACKGROUND_COLOR,
      tooltipHeaderColor: THEME_TOOLTIP_HEADER_COLOR,
      tooltipBorderColor: THEME_TOOLTIP_BORDER_COLOR,
      tooltipFontColor: THEME_TOOLTIP_FONT_COLOR,
      tooltipIconColor: THEME_TOOLTIP_ICON_COLOR,
      tooltipIconBorderColor: THEME_TOOLTIP_ICON_BORDER_COLOR,
      tooltipIconBackgroundColor: THEME_TOOLTIP_ICON_BACKGROUND_COLOR,
      tooltipSelectButtonTextColor: THEME_TOOLTIP_SELECT_BUTTON_TEXT_COLOR,
      tooltipSelectButtonBackgroundColor: THEME_TOOLTIP_SELECT_BUTTON_BACKGROUND_COLOR,
      tooltipCancelButtonTextColor: THEME_TOOLTIP_CANCEL_BUTTON_TEXT_COLOR,
      tooltipCancelButtonBackgroundColor: THEME_TOOLTIP_CANCEL_BUTTON_BACKGROUND_COLOR,

      deckSelectorStrokeColor: THEME_DECK_SELECTOR_STROKE_COLOR,
      deckSelectorFillColor: THEME_DECK_SELECTOR_FILL_COLOR,
      deckSelectorSize: THEME_DECK_SELECTOR_SIZE,
      exitIconUrlLeft: null,
      exitIconUrlRight: null,
    },
  },
  onSeatMapInited: data => {
    console.log('JetsSeatMap initialized!', data);
  },
  onSeatSelected: passenger => {
    console.log('Passenger boarded: ', passenger);
  },
  onSeatUnselected: passenger => {
    console.log('Passenger unboarded: ', passenger);
  },
  onTooltipRequested: data => {
    console.log('Tooltip requested: ', data);
  },
  onLayoutUpdated: data => {
    console.log('Layout updated: ', data);
  },
  onSeatMouseLeave: data => {
    console.log('Seat mouse leave: ', data);
  },
  onSeatMouseClick: data => {
    console.log('Seat mouse click: ', data);
  },
};
