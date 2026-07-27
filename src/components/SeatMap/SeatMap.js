import React, { useEffect, useRef, useState, useMemo, useContext } from 'react';

import { JetsSeatMapService } from './service';
import { JetsDataHelper } from '../../common/data-helper';

import {
  DEFAULT_LANG,
  DEFAULT_SEAT_MAP_WIDTH,
  DEFAULT_HORIZONTAL_LAYOUT,
  DEFAULT_VISIBLE_HULL,
  DEFAULT_VISIBLE_WINGS,
  DEFAULT_VISIBLE_CABIN_TITLES,
  DEFAULT_BUILT_IN_TOOLTIP,
  DEFAULT_EXTERNAL_PASSENGER_MANAGEMENT,
  DEFAULT_SHOW_DECK_SELECTOR,
  DEFAULT_SINGLE_DECK_MODE,
  DEFAULT_TOOLTIP_ON_HOVER,
  DEFAULT_RTL,
  DEFAULT_UNITS,
  DEFAULT_SCALE_TYPE,
  DEFAULT_AUTHORIZATION_SCHEME,
  SCALE_TYPES,
  JetsContext,
  ENTITY_STATUS_MAP,
  ENTITY_TYPE_MAP,
  THEME_BACKGROUND_COLOR,
  THEME_DECK_LABEL_TITLE_COLOR,
  THEME_FLOOR_COLOR,
  THEME_SEAT_LABEL_COLOR,
  THEME_SEAT_STROKE_COLOR,
  THEME_SEAT_STROKE_WIDTH,
  THEME_SEAT_ARMREST_COLOR,
  THEME_BULK_BASE_COLOR,
  THEME_BULK_CUT_COLOR,
  THEME_BULK_ICON_COLOR,
  THEME_FLOOR_BULK_ICON_COLOR,
  THEME_DEFAULT_PASSENGER_BADGE_COLOR,
  THEME_DEFAULT_PASSENGER_BADGE_LABEL_COLOR,
  THEME_DEFAULT_PASSENGER_BADGE_BORDER_COLOR,
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
  THEME_FUSELAGE_NOSE_TYPE_DEFAULT,
  THEME_DECK_SELECTOR_FILL_COLOR,
  THEME_DECK_SELECTOR_STROKE_COLOR,
  THEME_DECK_SELECTOR_SIZE,
  THEME_FUSELAGE_OUTLINE_WIDTH,
  THEME_NOT_AVAILABLE_SEATS_COLOR,
  THEME_CABIN_TITLES_WIDTH,
  THEME_CABIN_TITLES_HIGHLIGHT_COLORS,
  THEME_CABIN_TITLES_LABEL_COLOR,
  SEAT_MAP_WIDTH_TO_WINGS_WIDTH_RATIO,
  useEnvironmentInfo,
  useLiveAnnouncer,
  getWcagFlags,
  classifyKey,
  remapForOrientation,
  move,
  initialCell,
  LOCALES_MAP,
  DEFAULT_SEAT_PASSENGER_TYPES,
} from '../../common';
import './index.css';
import { JetsPlaneBody } from '../PlaneBody';
import { JetsDeckSelector } from '../DeckSelector';
import { JetsTooltipGlobal } from '../TooltipGlobal';
import { JetsSeatList } from '../SeatList';

// wcagFlags.alternativeView: media query used by the 'auto' mode to switch
// the default render to the list view on narrow viewports.
const NARROW_VIEWPORT_QUERY = '(max-width: 480px)';

const JETS_SEATMAP_DEFAULT_CONFIG = {
  width: DEFAULT_SEAT_MAP_WIDTH,
  horizontal: DEFAULT_HORIZONTAL_LAYOUT,
  rightToLeft: DEFAULT_RTL,
  visibleFuselage: DEFAULT_VISIBLE_HULL,
  visibleWings: DEFAULT_VISIBLE_WINGS,
  visibleCabinTitles: DEFAULT_VISIBLE_CABIN_TITLES,

  builtInTooltip: DEFAULT_BUILT_IN_TOOLTIP,
  externalPassengerManagement: DEFAULT_EXTERNAL_PASSENGER_MANAGEMENT,

  builtInDeckSelector: DEFAULT_SHOW_DECK_SELECTOR,
  singleDeckMode: DEFAULT_SINGLE_DECK_MODE,

  tooltipOnHover: DEFAULT_TOOLTIP_ON_HOVER,
  lang: DEFAULT_LANG,
  units: DEFAULT_UNITS,
  scaleType: DEFAULT_SCALE_TYPE,

  apiAuthorizationScheme: DEFAULT_AUTHORIZATION_SCHEME,

  hiddenSeatFeatures: [],
  colorTheme: {
    seatMapBackgroundColor: THEME_BACKGROUND_COLOR,

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
    bulkFloorIconColor: THEME_FLOOR_BULK_ICON_COLOR,

    fuselageFillColor: THEME_FUSELAGE_FILL_COLOR,
    fuselageStrokeColor: THEME_FUSELAGE_OUTLINE_COLOR,
    fuselageStrokeWidth: THEME_FUSELAGE_OUTLINE_WIDTH,
    fuselageWindowsColor: THEME_FUSELAGE_WINDOWS_COLOR,
    fuselageWingsColor: THEME_FUSELAGE_WINGS_COLOR,
    fuselageNoseType: THEME_FUSELAGE_NOSE_TYPE_DEFAULT,

    defaultPassengerBadgeColor: THEME_DEFAULT_PASSENGER_BADGE_COLOR,
    defaultPassengerBadgeLabelColor: THEME_DEFAULT_PASSENGER_BADGE_LABEL_COLOR,
    defaultPassengerBadgeBorderColor: THEME_DEFAULT_PASSENGER_BADGE_BORDER_COLOR,
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

    cabinTitlesWidth: THEME_CABIN_TITLES_WIDTH,
    cabinTitlesHighlightColors: THEME_CABIN_TITLES_HIGHLIGHT_COLORS,
    cabinTitlesLabelColor: THEME_CABIN_TITLES_LABEL_COLOR,
  },
};

// Module-level counter so multiple JetsSeatMap instances on the same page
// (wcagFlags.landmarksAndSkipLink) get distinct ids for the landmark heading
// and the skip-link's jump target.
let landmarkIdCounter = 0;

export const JetsSeatMap = ({
  flight,
  availability,
  passengers,
  config = JETS_SEATMAP_DEFAULT_CONFIG,
  currentDeckIndex,
  seatJumpTo,
  onSeatMapInited = data => {
    console.log('JetsSeatMap initialized!', data);
  },
  onSeatSelected = passenger => {
    console.log('Passenger boarded: ', passenger);
  },
  onSeatUnselected = passenger => {
    console.log('Passenger unboarded: ', passenger);
  },
  onTooltipRequested = data => {
    console.log('Tooltip requested: ', data);
  },
  onLayoutUpdated = data => {
    console.log('Layout updated: ', data);
  },
  onSeatMouseLeave = data => {
    console.log('Seat mouse leave: ', data);
  },
  onSeatMouseClick = data => {
    console.log('Seat mouse click: ', data);
  },
  onAvailabilityApplied = data => {
    console.log('Availability applied: ', data);
  },
  componentOverrides,
}) => {
  const { isFirefox } = useEnvironmentInfo();
  const { announce, LiveRegion } = useLiveAnnouncer();

  const colorTheme = JetsDataHelper.mergeColorThemeWithConstraints(
    JETS_SEATMAP_DEFAULT_CONFIG.colorTheme,
    config.colorTheme
  );
  config.colorTheme = colorTheme;
  config.lang = JetsDataHelper.validateLanguage(config.lang);
  const configuration = { ...JETS_SEATMAP_DEFAULT_CONFIG, ...config };

  const wcagFlags = getWcagFlags(configuration);

  // SCALE_TYPES.ZOOM is not fully supported by FF
  if (isFirefox) {
    configuration.scaleType = SCALE_TYPES.SCALE;
  }

  const wingsWidthLimit = configuration.width / SEAT_MAP_WIDTH_TO_WINGS_WIDTH_RATIO;
  const wingsAreTooWide = configuration.colorTheme.wingsWidth > wingsWidthLimit;

  if (wingsAreTooWide) {
    configuration.colorTheme.wingsWidth = wingsWidthLimit;
  }

  const [content, setContent] = useState([]);
  const [isSeatMapInited, setSeatMapInited] = useState(false);
  const [passengersList, setPassengersList] = useState([]);
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [seatLabelJumpTo, setSeatLabelJumpTo] = useState(null);
  const [isSelectAvailable, setSelectAvailable] = useState(false);
  const [activeDeck, setActiveDeck] = useState(0);
  const [params, setParams] = useState(null);
  // wcagFlags.landmarksAndSkipLink: stable ids for the region heading and the
  // skip-link's jump target, generated once per mounted instance.
  const landmarkIdsRef = useRef(null);
  if (landmarkIdsRef.current === null) {
    landmarkIdCounter += 1;
    landmarkIdsRef.current = {
      headingId: `jets-seat-map-heading-${landmarkIdCounter}`,
      skipTargetId: `jets-seat-map-content-${landmarkIdCounter}`,
    };
  }
  const { headingId, skipTargetId } = landmarkIdsRef.current;
  // Focused cell for roving tabindex + keyboard navigation. Kept in a REF, not
  // state, on purpose: mutating it must NOT trigger a React re-render. A
  // re-render between a seat button's mousedown and mouseup rebuilds the seat
  // DOM and cancels the native click, which would force a double-click to open
  // the tooltip. All reads go through focusedCellRef.current.
  const focusedCellRef = useRef({ deckIdx: 0, rowIdx: 0, colIdx: 0 });
  // Which deck the roving anchor was last seeded for; lets the seeding effect
  // re-assert roving on content changes without resetting the user's position.
  const seededDeckRef = useRef(null);

  const [exits, setExits] = useState([]);
  const [bulks, setBulks] = useState([]);
  const [planeFeatures, setPlaneFeatures] = useState(null);

  // wcagFlags.alternativeView: user toggle override. `null` means "follow
  // config / viewport". Set when the user clicks the toggle button so a
  // viewport resize doesn't fight the user's intent.
  const [viewOverride, setViewOverride] = useState(null);
  // Tracks `matchMedia('(max-width: 480px)').matches` for 'auto' mode.
  const [viewportNarrow, setViewportNarrow] = useState(false);

  const hasReceivedFirstParams = useRef(false);
  const seatMapRef = useRef();
  const service = new JetsSeatMapService(configuration);

  const shouldShowOnlyOneDeck = params?.singleDeckMode && content.length > 1;
  const shouldShowBuiltInDeckSelector = params?.builtInDeckSelector && shouldShowOnlyOneDeck;

  // ─── Alternative-view (list vs grid) ────────────────────────────────────
  //
  // Resolved render mode. Reads `wcagFlags.alternativeView` — `viewOverride`
  // (set by the toggle button) wins over it. `'auto'` follows the live
  // `viewportNarrow` flag (`matchMedia('(max-width: 480px)')`).
  const effectiveView = viewOverride
    ? viewOverride
    : wcagFlags.alternativeView === 'list'
    ? 'list'
    : wcagFlags.alternativeView === 'auto'
    ? viewportNarrow
      ? 'list'
      : 'grid'
    : 'grid';

  // The toggle button only renders when the host explicitly opted into
  // 'auto' — pinning 'grid' / 'list' (or leaving the config alone, in which
  // case getWcagFlags returns the 'grid' default) means the host picked a
  // mode and the toggle stays hidden entirely (not just hidden via CSS).
  const showViewToggle = wcagFlags.alternativeView === 'auto';

  const viewToggleLabel =
    effectiveView === 'list'
      ? LOCALES_MAP[configuration.lang]?.['viewAsMap'] || 'View as map'
      : LOCALES_MAP[configuration.lang]?.['viewAsList'] || 'View as list';

  const toggleView = () => {
    setViewOverride(effectiveView === 'list' ? 'grid' : 'list');
  };

  useEffect(() => {
    if (wcagFlags.alternativeView !== 'auto') return;
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mql = window.matchMedia(NARROW_VIEWPORT_QUERY);
    setViewportNarrow(mql.matches);

    const listener = e => setViewportNarrow(e.matches);
    mql.addEventListener('change', listener);
    return () => mql.removeEventListener('change', listener);
  }, [wcagFlags.alternativeView]);

  const ResolvedTooltip = componentOverrides?.JetsTooltip ?? JetsTooltipGlobal;

  useEffect(() => {
    let isMounted = true;

    if (flight?.id) {
      service
        .getPlaneFeatures(flight, configuration.lang, configuration.units)
        .then(planeFeatures => {
          setPlaneFeatures(planeFeatures);
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
    let isMounted = true;
    if (planeFeatures) {
      service.processPlaneFeatures(planeFeatures, availability, passengers, configuration).then(data => {
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
            availabilityData: data?.availabilityData,
            media: data?.media,
            plane: data?.plane,
          });
          hasReceivedFirstParams.current = false;
        }
      });
    }

    return () => {
      isMounted = false;
    };
  }, [planeFeatures, configuration.width]);

  useEffect(() => {
    if (!availability) return;

    const data = service.setAvailabilityHandler(content, availability);

    const providedSeatLabels = availability.map(({ label }) => label);
    const existingSeatsInfo = service.compareWithDecksSeatsInfo(providedSeatLabels, data);

    setPassengers();
    setContent(data);
    setActiveTooltip(null);
    onAvailabilityApplied(existingSeatsInfo);
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

  useEffect(() => {
    if (!seatJumpTo || !content?.length) return;

    const _providedSeatLabel = seatJumpTo?.seatLabel?.toString().trim().toUpperCase();
    const { nonExistingSeatLabels } = service.compareWithDecksSeatsInfo([_providedSeatLabel], content);

    if (nonExistingSeatLabels.includes(_providedSeatLabel)) {
      setActiveTooltip(null);
      resetSeatJumpTo();
      return;
    }

    const seatDeck = service.getDeckIndexBySeatLabel(_providedSeatLabel, content);

    if (seatDeck !== activeDeck) switchDeck(seatDeck);

    setSeatLabelJumpTo(_providedSeatLabel);
  }, [seatJumpTo]);

  useEffect(() => {
    if (!wcagFlags?.keyboardNavigation) {
      seededDeckRef.current = null;
      return;
    }
    if (!content?.length) {
      seededDeckRef.current = null;
      return;
    }
    // Seed the roving anchor to the first interactive seat only on the initial
    // load or when the active deck changes. On plain content mutations (a
    // select/unselect within the same deck) keep the current focused cell — a
    // React re-render there resets each seat's rendered tabindex, so we only
    // need to re-assert the roving tabindex at the existing position, NOT jump
    // the user back to the first seat.
    let pos;
    if (seededDeckRef.current !== activeDeck) {
      seededDeckRef.current = activeDeck;
      pos = initialCell(activeDeck, content);
      focusedCellRef.current = pos;
    } else {
      pos = focusedCellRef.current;
    }
    const id = setTimeout(() => applyRovingTabindex(pos), 0);
    return () => clearTimeout(id);
  }, [content, activeDeck, wcagFlags?.keyboardNavigation]);

  const seatMapClassName = useMemo(() => {
    const _viewModeClassName = params?.isHorizontal ? 'horizontal' : 'vertical';
    const _scaleTypeClassName = configuration.scaleType === SCALE_TYPES.SCALE ? 'scale' : 'zoom';

    return `jets-seat-map ${_viewModeClassName} ${_scaleTypeClassName}`;
  }, [params, configuration]);

  const resetSeatJumpTo = () => {
    setSeatLabelJumpTo(null);
  };

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
      scaleType: configuration.scaleType,
      seatmapElement: seatMapRef.current,
    });
  };

  // When the built-in dialog tooltip closes via a button (Cancel/Select/
  // Unselect) or Escape, keyboard focus would otherwise vanish with the removed
  // tooltip. Return it to the trigger seat so grid navigation resumes. Deferred
  // so the close re-render (content/tooltip) settles before we query the seat.
  // Hover tooltips are excluded.
  const returnFocusToTriggerSeat = () => {
    if (!wcagFlags?.keyboardNavigation || configuration.tooltipOnHover) return;
    setTimeout(() => focusCell(focusedCellRef.current), 0);
  };

  // ─── A11y live announcements ────────────────────────────────────────────
  //
  // All announcements use `polite` politeness — the seat-map is not an
  // emergency UI, so assertive would over-interrupt the screen reader user.
  // Strings are pulled from LOCALES_MAP with an English fallback so missing
  // keys never silently swallow announcements. Gated strictly behind
  // `wcagFlags.liveAnnouncer` so there is zero behavior/DOM change when the
  // flag is off (see `LiveRegion` render gate below).

  const a11yLocale = () => LOCALES_MAP[configuration.lang] || LOCALES_MAP['EN'] || {};

  const announceIfEnabled = message => {
    if (!wcagFlags?.liveAnnouncer) return;
    announce(message);
  };

  const passengerAnnounceLabel = passenger => passenger?.passengerLabel?.trim() || passenger?.abbr?.trim() || '';

  const announceSeatSelected = (seat, passenger) => {
    const locale = a11yLocale();
    const seatWord = locale['seat'] || 'Seat';
    const selectedFor = locale['seatSelectedFor'] || 'selected for';
    const number = seat?.number ?? '';
    const passengerLabel = passengerAnnounceLabel(passenger);
    const currency = seat?.currency ?? '';
    const price = seat?.price;
    const pricePart = price != null ? `, ${currency}${price}` : '';
    announceIfEnabled(`${seatWord} ${number} ${selectedFor} ${passengerLabel}${pricePart}`.trim());
  };

  const announceSeatCleared = seat => {
    const locale = a11yLocale();
    const seatWord = locale['seat'] || 'Seat';
    const clearedWord = locale['seatCleared'] || 'cleared';
    const number = seat?.number ?? '';
    announceIfEnabled(`${seatWord} ${number} ${clearedWord}`.trim());
  };

  const announceMovedToSeat = seat => {
    const locale = a11yLocale();
    const movedTo = locale['movedToSeat'] || locale['moveToSeat'] || 'Moved to seat';
    const number = seat?.number ?? '';
    announceIfEnabled(`${movedTo} ${number}`.trim());
  };

  const onSeatSelect = seat => {
    const nextPassenger = service.getNextPassenger(passengersList);
    const { data, passengers: newPassengers } = service.selectSeatHandler(content, seat, passengersList);

    setContent(data);
    setPassengersList(newPassengers);
    setActiveTooltip(null);

    onSeatSelected(newPassengers);
    announceSeatSelected(seat, nextPassenger);
    returnFocusToTriggerSeat();
  };

  const onSeatUnselect = seat => {
    const { data, passengers: newPassengers } = service.unselectSeatHandler(content, seat, passengersList);

    setContent(data);
    setPassengersList(newPassengers);
    setActiveTooltip(null);

    onSeatUnselected(newPassengers);
    announceSeatCleared(seat);
    returnFocusToTriggerSeat();
  };

  const onTooltipClose = (data, element, event) => {
    if (data && element) {
      const seat = prepareSeatDataForEmit(data);
      onSeatMouseLeave({ seat, element: element.current, event: event.nativeEvent });
    }
    setActiveTooltip(null);
    returnFocusToTriggerSeat();
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

  // WCAG 3.3.1 / 3.3.3: localized, human-readable explanation for why the
  // Select button is disabled. Mirrors isSeatSelectDisabled's own logic so the
  // two never disagree, but returns a message string (or '' when selectable)
  // instead of a boolean. Consumed by the tooltip only when
  // wcagFlags.visibleRestrictionReason is on.
  const getSelectDisabledReason = seatData => {
    const locale = LOCALES_MAP[configuration.lang] || LOCALES_MAP[DEFAULT_LANG];
    const nextPassenger = service.getNextPassenger(passengersList);

    if (!nextPassenger) {
      return locale['noPassengerToSelect'];
    }

    if (
      nextPassenger?.passengerType &&
      seatData.passengerTypes?.length &&
      !seatData.passengerTypes?.includes(nextPassenger?.passengerType)
    ) {
      const allowedTypes = DEFAULT_SEAT_PASSENGER_TYPES;
      const filteredPassengerTypes = seatData.passengerTypes.filter(type => allowedTypes.includes(type));
      const typeStrings = filteredPassengerTypes.map(type => locale[type]);
      return `${locale['seatRestrictions']}: ${typeStrings.join(', ')}`;
    }

    return '';
  };

  const scaleWrapStyle = {
    transform: ` ${params?.rotation} ${params?.offset} scale(${params?.scale})`,
    transformOrigin: 'top left',
    width: params?.innerWidth,
    height: params?.scaledTotalDecksHeight,
  };

  const zoomWrapStyle = {
    transform: ` ${params?.rotation} ${params?.offset}`,
    transformOrigin: 'top left',
    zoom: params?.scale,
    width: params?.innerWidth,
    height: params?.scaledTotalDecksHeight,
  };

  // Imperatively overrides the seats' rendered tabIndex; relies on JetsSeat's rovingTabIndex
  // staying a constant -1 while keyboard nav is on, otherwise React would clobber this on re-render.
  const applyRovingTabindex = pos => {
    const container = seatMapRef.current;
    if (!container) return;
    const focusedRow = String(pos.rowIdx + 1);
    const focusedCol = String(pos.colIdx + 1);
    container.querySelectorAll('[role="gridcell"]').forEach(cell => {
      const isFocused =
        cell.getAttribute('aria-rowindex') === focusedRow && cell.getAttribute('aria-colindex') === focusedCol;
      cell.setAttribute('tabindex', isFocused ? '0' : '-1');
    });
  };

  const focusCell = pos => {
    const container = seatMapRef.current;
    if (!container) return;
    const el = container.querySelector(
      `[role="gridcell"][aria-rowindex="${pos.rowIdx + 1}"][aria-colindex="${pos.colIdx + 1}"]`
    );
    // Focus without the browser's default (jarring) scroll-to-top, then bring
    // the focused seat into view minimally so keyboard users can SEE where the
    // focus ring moved. `block/inline: 'nearest'` scrolls only when the seat is
    // off-screen, and only just enough — no full-page jump.
    el?.focus?.({ preventScroll: true });
    el?.scrollIntoView?.({ block: 'nearest', inline: 'nearest' });
  };

  const onGridKeydown = event => {
    if (wcagFlags?.keyboardNavigation && event.key === 'Escape' && activeTooltip) {
      // onTooltipClose returns focus to the trigger seat (resumes seat nav).
      onTooltipClose();
      event.preventDefault();
      return;
    }
    if (!wcagFlags?.keyboardNavigation) return;

    // While the built-in dialog tooltip is open (click/Enter, not hover) it owns
    // the keyboard — its own handler roves between the action buttons. Pause
    // seat-to-seat navigation until it closes.
    if (wcagFlags?.tooltipDialog && activeTooltip && !configuration.tooltipOnHover) return;

    const rawKey = classifyKey(event.nativeEvent ?? event);
    if (!rawKey) return;

    const key = remapForOrientation(rawKey, configuration.horizontal ?? false, configuration.rightToLeft ?? false);
    const from = focusedCellRef.current;
    const next = move(from, key, content);
    if (next === from) return;

    event.preventDefault();
    event.stopPropagation();
    focusedCellRef.current = next;
    applyRovingTabindex(next);
    focusCell(next);
  };

  const onGridFocusin = event => {
    if (!wcagFlags?.keyboardNavigation) return;
    const el = event.target;
    const rowAttr = el?.getAttribute?.('aria-rowindex');
    const colAttr = el?.getAttribute?.('aria-colindex');
    if (rowAttr == null || colAttr == null) return;
    const rowIdx = parseInt(rowAttr, 10) - 1;
    const colIdx = parseInt(colAttr, 10) - 1;
    if (isNaN(rowIdx) || isNaN(colIdx)) return;
    const deckAttr = el.closest?.('[data-deck-index]')?.getAttribute('data-deck-index');
    const parsedDeck = deckAttr != null ? parseInt(deckAttr, 10) : NaN;
    const deckIdx = !isNaN(parsedDeck) ? parsedDeck : activeDeck;
    const next = { deckIdx, rowIdx, colIdx };
    focusedCellRef.current = next;
    applyRovingTabindex(next);
  };

  // wcagFlags.landmarksAndSkipLink: jump keyboard focus straight past the
  // seat-map content to the target span rendered right after it. Native
  // anchor href jump behavior alone doesn't reliably move focus in every
  // browser, so we do it explicitly and keep href only as a semantic fallback.
  const onSkipLinkClick = event => {
    event.preventDefault();
    const target = document.getElementById(skipTargetId);
    if (!target) return;
    target.focus({ preventScroll: true });
    target.scrollIntoView?.({ block: 'nearest', behavior: 'auto' });
  };

  const providerValue = {
    onSeatClick,
    showTooltip,
    onTooltipClose,
    onSeatSelect,
    onSeatUnselect,
    isSeatSelectDisabled,
    getSelectDisabledReason,
    switchDeck,
    resetSeatJumpTo,
    announceMovedToSeat,
    params,
    config: configuration,
    wcagFlags,
    colorTheme,
    activeTooltip,
    seatLabelJumpTo,
    componentOverrides,
  };

  // wcagFlags.landmarksAndSkipLink: zero DOM change when off — the seat-map
  // root div renders exactly as it does today, unwrapped. When on, the div is
  // wrapped in a <section role="region"> landmark (transparent via
  // display:contents so it never affects the parent's layout of the existing
  // percentage-sized root), preceded by a visually-hidden heading and a skip
  // link, and followed by the skip link's jump target.
  const landmarksOn = !!wcagFlags?.landmarksAndSkipLink;
  const locale = LOCALES_MAP[configuration.lang] || LOCALES_MAP[DEFAULT_LANG];
  const RegionWrapper = landmarksOn ? 'section' : React.Fragment;
  const regionProps = landmarksOn
    ? { className: 'jets-seat-map-region', role: 'region', 'aria-labelledby': headingId }
    : {};

  return (
    <JetsContext.Provider value={providerValue}>
      <RegionWrapper {...regionProps}>
        {landmarksOn && (
          <h2 id={headingId} className="jets-visually-hidden">
            {locale['gridLabel'] || 'Seat map'}
          </h2>
        )}
        {landmarksOn && (
          <a href={`#${skipTargetId}`} className="jets-skip-link" onClick={onSkipLinkClick}>
            {locale['skipSeatMap'] || 'Skip seat map'}
          </a>
        )}
        <div
          ref={seatMapRef}
          className={seatMapClassName}
          style={{
            // List view keeps the host-configured width (its height is
            // content-driven, so it is left to flow). `maxWidth: 100%` keeps a
            // wide configured width from forcing horizontal page scroll on a
            // narrow viewport (the 'auto' mode use case).
            width: effectiveView === 'list' ? configuration.width : configuration.horizontal ? params?.scaledTotalDecksHeight : configuration.width,
            maxWidth: effectiveView === 'list' ? '100%' : undefined,
            height:
              effectiveView === 'list'
                ? null
                : configuration.horizontal
                ? configuration.width
                : params?.scaledTotalDecksHeight,
            fontFamily: colorTheme.fontFamily,
            background: colorTheme.seatMapBackgroundColor,
          }}
          data-testid="jets-seat-map"
          onKeyDown={onGridKeydown}
          onFocus={onGridFocusin}
        >
          {wcagFlags?.liveAnnouncer && <LiveRegion />}
          {activeTooltip && <ResolvedTooltip data={activeTooltip} />}
          {/* The deck selector only drives the grid (which shows one deck at a
              time). The list view already renders every deck, so hide the
              otherwise-inert selector there — deck filtering is offered inside
              the list instead. */}
          {shouldShowBuiltInDeckSelector && effectiveView !== 'list' && (
            <JetsDeckSelector direction={!!activeDeck}></JetsDeckSelector>
          )}
          {/* wcagFlags.alternativeView: toggle button renders only when the
              config is 'auto' — pinned 'grid'/'list' modes never show it. */}
          {content?.length > 0 && showViewToggle && (
            <button
              type="button"
              className="jets-seat-map__view-toggle"
              style={configuration.rightToLeft ? { marginLeft: 0, marginRight: 'auto' } : undefined}
              onClick={toggleView}
            >
              {viewToggleLabel}
            </button>
          )}
          {content?.length > 0 && effectiveView === 'list' ? (
            <JetsSeatList content={content} lang={configuration.lang} />
          ) : (
            <div style={configuration.scaleType === SCALE_TYPES.SCALE ? scaleWrapStyle : zoomWrapStyle}>
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
          )}
        </div>
        {landmarksOn && <span id={skipTargetId} tabIndex={-1}></span>}
      </RegionWrapper>
    </JetsContext.Provider>
  );
};
