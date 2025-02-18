import {
  DEFAULT_DECK_PADDING_SIZE,
  DEFAULT_INDEX_ROW_HEIGHT,
  ENTITY_TYPE_MAP,
  LOCALE_EN,
  LOCALES_MAP,
  SEAT_MEASUREMENTS_ICONS,
  SEAT_SIZE_BY_TYPE,
  THEME_FUSELAGE_OUTLINE_WIDTH,
} from '../../common';

export function createIconObject({ key, iconLookup, value, title }) {
  return {
    key,
    icon: iconLookup[key] ?? '',
    title: title ? title : LOCALE_EN[key],
    uniqId: MOCK_UNIQUE_ID,
    value,
  };
}

export const MOCK_UNIQUE_ID = '_random';

export const DEFAULT_CLASS_CODE = 'E';
export const DEFAULT_SEAT_SCHEME = 'S-';
export const DEFAULT_ROW_NUMBER = 1;
export const DEFAULT_SEAT_TYPE = 0;
export const DEFAULT_TOP_OFFSET = 0;

export function createSeatDetailsDeck(overrides = {}) {
  const rows = overrides?.rows ?? [createSeatDetailsRow()];

  return {
    rows,
    bulks: [],
    exits: [],
    ...overrides,
  };
}

export function createSeatDetailsRow(overrides = {}) {
  const seats = overrides?.seats ?? [createSeatDetailsSeat()];

  return {
    seats,
    seatScheme: DEFAULT_SEAT_SCHEME,
    classCode: DEFAULT_CLASS_CODE,
    number: DEFAULT_ROW_NUMBER,
    topOffset: DEFAULT_TOP_OFFSET,
    seatType: DEFAULT_SEAT_TYPE,
    ...overrides,
  };
}

export const DEFAULT_SEAT_LETTER = 'A';
export const DEFAULT_SEAT_DIMENSIONS = {
  width: SEAT_SIZE_BY_TYPE[DEFAULT_SEAT_TYPE][0],
  height: SEAT_SIZE_BY_TYPE[DEFAULT_SEAT_TYPE][1],
};

export const ALL_SEAT_SIZES_BY_TYPE = SEAT_SIZE_BY_TYPE.map((current, index) => ({
  seatType: index,
  width: current[0],
  height: current[1],
}));

export const SEAT_FEATURES_WITH_LOCALES = Object.entries(LOCALES_MAP)
  .map(current => {
    return {
      lang: current[0],
      localeMap: current[1],
      features: [
        'restrictedLegroom',
        'extraLegroom',
        'noFloorStorage',
        'noOverheadStorage',
        'limitedOverheadStorage',
        'trayTableInArmrest',
        'getColdByExit',
        'misalignedWindow',
        'noWindow',
        'doNotRecline',
        'limitedRecline',
        'storageBoxBetweenWall',
        'nearLavatory',
        'nearGalley',
        'nearStairs',
        'wingInWindow',
        'standardSeat',
        'reservedCrewSeat',
        'bassinet',
        'babyBassinet',
      ],
    };
  })
  .flatMap(current => {
    const langLocaleWithSingleFeatures = [];
    for (const feature of current.features) {
      langLocaleWithSingleFeatures.push({
        lang: current.lang,
        localeMap: current.localeMap,
        feature: feature,
      });
    }
    return langLocaleWithSingleFeatures;
  });

export function createSeatDetailsSeat(overrides = {}) {
  return {
    letter: DEFAULT_SEAT_LETTER,
    topOffset: DEFAULT_TOP_OFFSET,
    ...overrides,
  };
}

export function createExpectedResponse({ content, params = createParams(), exits = [[]], bulks = [[]] }) {
  return {
    content,
    params,
    exits,
    bulks,
  };
}

export const DEFAULT_DECK_NUMBER = 1;

export function createPreparedDeck(overrides = {}) {
  return {
    height: DEFAULT_INDEX_ROW_HEIGHT + DEFAULT_SEAT_DIMENSIONS.height,
    number: DEFAULT_DECK_NUMBER,
    rows: [createPreparedRow()],
    uniqId: MOCK_UNIQUE_ID,
    width: DEFAULT_SEAT_DIMENSIONS.width * 2 + DEFAULT_DECK_PADDING_SIZE * 2 + THEME_FUSELAGE_OUTLINE_WIDTH * 2,
    wingsInfo: {
      finish: 0,
      length: 0,
      start: 0,
    },
    ...overrides,
  };
}

export function createPreparedRow(overrides = {}) {
  const seats = overrides?.seats ?? [createPreparedSeat(), createPreparedAisle()];

  return {
    cabinHeight: DEFAULT_SEAT_DIMENSIONS.height,
    classCode: DEFAULT_CLASS_CODE,
    height: DEFAULT_SEAT_DIMENSIONS.height,
    isFirstInCabin: true,
    number: DEFAULT_ROW_NUMBER,
    seatScheme: DEFAULT_SEAT_SCHEME,
    seatType: DEFAULT_SEAT_TYPE,
    seats: seats,
    topOffset: DEFAULT_INDEX_ROW_HEIGHT + DEFAULT_TOP_OFFSET,
    uniqId: MOCK_UNIQUE_ID,
    width: DEFAULT_SEAT_DIMENSIONS.width * 2,
    ...overrides,
  };
}

export function createPreparedSeat(overrides = {}) {
  return {
    classCode: DEFAULT_CLASS_CODE,
    classType: 'Economy',
    features: [],
    letter: DEFAULT_SEAT_LETTER,
    measurements: [
      createIconObject({
        key: 'pitch',
        iconLookup: SEAT_MEASUREMENTS_ICONS,
      }),
      createIconObject({
        key: 'width',
        iconLookup: SEAT_MEASUREMENTS_ICONS,
      }),
      createIconObject({
        key: 'recline',
        iconLookup: SEAT_MEASUREMENTS_ICONS,
      }),
    ],
    number: `${DEFAULT_ROW_NUMBER}${DEFAULT_SEAT_LETTER}`,
    seatIconType: DEFAULT_SEAT_TYPE,
    seatType: 'E-0',
    size: DEFAULT_SEAT_DIMENSIONS,
    status: 'available',
    topOffset: DEFAULT_TOP_OFFSET,
    type: ENTITY_TYPE_MAP.seat,
    uniqId: MOCK_UNIQUE_ID,
    ...overrides,
  };
}

export function createPreparedAisle(overrides) {
  return {
    letter: DEFAULT_ROW_NUMBER,
    size: DEFAULT_SEAT_DIMENSIONS,
    status: 'disabled',
    type: ENTITY_TYPE_MAP.aisle,
    uniqId: MOCK_UNIQUE_ID,
    ...overrides,
  };
}

export function createParams(overrides) {
  const rowHeight = DEFAULT_INDEX_ROW_HEIGHT + DEFAULT_SEAT_DIMENSIONS.height;

  return {
    antiRotation: '',
    antiScale: 1,
    innerWidth: 0,
    isTouchDevice: false,
    offset: '',
    rotation: '',
    scale: 1,
    scaledTotalDecksHeight: `${rowHeight}px`,
    separateDeckHeights: [rowHeight],
    totalDecksHeight: rowHeight,
    ...overrides,
  };
}

export const CUSTOM_SEAT_TOP_OFFSET = 9;
export const CUSTOM_ROW_TOP_OFFSET = 19;
export const CUSTOM_BULK_TOP_OFFSET = 29;
export const CUSTOM_EXIT_TOP_OFFSET = 39;
export const CUSTOM_LARGE_TOP_OFFSET = 109;
