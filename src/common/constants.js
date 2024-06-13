import {
  LOCALE_EN,
  LOCALE_RU,
  LOCALE_CN,
  LOCALE_DE,
  LOCALE_ES,
  LOCALE_PL,
  LOCALE_AR,
  LOCALE_FR,
  LOCALE_CS,
  LOCALE_PT,
  LOCALE_IT,
  LOCALE_UK,
  LOCALE_JA,
  LOCALE_KO,
  LOCALE_TR,
} from './i18n.languages';

export const SCALE_TYPES = {
  ZOOM: 'zoom',
  SCALE: 'scale',
};

//#region Entity

export const ENTITY_STATUS_MAP = {
  available: 'available',
  unavailable: 'unavailable',
  selected: 'selected',
  preferred: 'preferred',
  extra: 'extra',
  disabled: 'disabled',
};

export const ENTITY_TYPE_MAP = {
  seat: 'seat',
  aisle: 'aisle',
  empty: 'empty',
  index: 'index',
};

export const ENTITY_SCHEME_MAP = {
  seat: 'S',
  empty: 'E',
  aisle: '-',
};

export const CLASS_CODE_MAP = {
  f: 'First',
  b: 'Business',
  p: 'Premium economy',
  e: 'Economy',
};

//#endregion

//#region Localization

export const LOCALES_MAP = {
  CN: LOCALE_CN,
  DE: LOCALE_DE,
  EN: LOCALE_EN,
  ES: LOCALE_ES,
  PL: LOCALE_PL,
  RU: LOCALE_RU,
  AR: LOCALE_AR,
  CS: LOCALE_CS,
  FR: LOCALE_FR,
  PT: LOCALE_PT,
  UK: LOCALE_UK,
  IT: LOCALE_IT,
  JA: LOCALE_JA,
  KO: LOCALE_KO,
  TR: LOCALE_TR,
};

//#endregion

//#region Configuration

export const DEFAULT_LANG = 'EN';

export const DEFAULT_UNITS = 'metric';

export const DEFAULT_SCALE_TYPE = SCALE_TYPES.SCALE;

export const DEFAULT_SEAT_MARGIN = 3;

export const DEFAULT_SEAT_MAP_WIDTH = 350;

export const DEFAULT_HORIZONTAL_LAYOUT = false;

export const DEFAULT_VISIBLE_HULL = false;

export const DEFAULT_VISIBLE_WINGS = false;

export const DEFAULT_VISIBLE_CABIN_TITLES = false;

export const DEFAULT_BUILT_IN_TOOLTIP = true;

export const DEFAULT_EXTERNAL_PASSENGER_MANAGEMENT = false;

export const DEFAULT_SHOW_DECK_SELECTOR = true;

export const DEFAULT_SINGLE_DECK_MODE = true;

export const DEFAULT_TOOLTIP_ON_HOVER = false;

export const DEFAULT_RTL = false;

export const DEFAULT_TOOLTIP_WIDTH = 260;

export const DEFAULT_SEAT_PASSENGER_TYPES = ['ADT', 'CHD', 'INF'];

export const DEFAULT_FEATURES_RENDER_LIMIT = 12;

// FUSELAGE_HEIGHT_TO_WIDTH_RATIO is a sum of Nose SVG h/w and Tail SVG h/w
// see this params in SVG
// width="200" height="214" viewBox="0 0 200 214"
// divide height/width for each and add them together (remember that actual clipping rect is viewBox, use its values when available)
export const FUSELAGE_HEIGHT_TO_WIDTH_RATIO = 2.4;

export const SEAT_SIZE_BY_TYPE = [
  [100, 100],
  [122, 218],
  [150, 170],
  [100, 100],
  [122, 200],
  [200, 200],
  [200, 200],
  [140, 200],
  [150, 200],
  [150, 200],
  [200, 150],
  [200, 150],
  [200, 185],
  [200, 185],
  [120, 150],
  [150, 175],
  [150, 175],
  [185, 175],
  [185, 175],
  [255, 175],
  [130, 330],
  [130, 330],
  [200, 400],
  [200, 400],
  [200, 365],
  [200, 365],
  [200, 200],
  [200, 200],
  [200, 200],
  [200, 200],
  [200, 265],
  [200, 265],
  [200, 330],
  [200, 330],
  [200, 200],
  [200, 200],
  [550, 435],
  [550, 435],
  [550, 435],
  [550, 435],
  [275, 1230],
  [275, 1230],
  [550, 325],
  [550, 325],
  [550, 325],
  [550, 325],
];

export const DEFAULT_SEAT_SIZE = {
  width: 86,
  height: 100,
};

export const DEFAULT_SEAT_CLASS = 'E';

export const DEFAULT_DECK_PADDING_SIZE = 10;

export const DEFAULT_DECK_TITLE_HEIGHT = 80;

export const DEFAULT_INDEX_ROW_HEIGHT = 120;

export const DECK_ITEM_ALIGN_MAP = {
  left: 'left',
  right: 'right',
  center: 'center',
};

export const DEFAULT_STYLE_POSITION = 'auto';

//#endregion

//#region Theme

export const THEME_FLOOR_COLOR = 'rgb(30,60,90)';

export const THEME_DECK_LABEL_TITLE_COLOR = 'rgb(255,255,255)';
export const THEME_DECK_HEIGHT_SPACING = 200;
export const THEME_WINGS_WIDTH = 30;
export const THEME_DECK_SEPARATION = 50;

export const THEME_SEAT_LABEL_COLOR = 'rgb(255,255,255)';
export const THEME_SEAT_ARMREST_COLOR = 'rgb(185,186,186)';
export const THEME_SEAT_STROKE_WIDTH = 1;
export const THEME_SEAT_STROKE_COLOR = 'rgb(237, 237, 237)';

export const THEME_NOT_AVAILABLE_SEATS_COLOR = 'dimgrey';

export const THEME_BULK_BASE_COLOR = 'rgb(186, 199, 213)';
export const THEME_BULK_CUT_COLOR = 'rgb(148, 168, 190)';
export const THEME_BULK_ICON_COLOR = 'rgb(70, 81, 94)';

export const THEME_FUSELAGE_FILL_COLOR = 'lightgray';
export const THEME_FUSELAGE_OUTLINE_WIDTH = 12;
export const THEME_FUSELAGE_OUTLINE_COLOR = 'darkgrey';
export const THEME_FUSELAGE_WINDOWS_COLOR = 'darkgrey';
export const THEME_FUSELAGE_WINGS_COLOR = 'darkgrey';

export const THEME_DEFAULT_PASSENGER_BADGE_COLOR = '#1157ce';
export const THEME_DEFAULT_FONT_FAMILY = 'Montserrat, sans-serif';

export const THEME_TOOLTIP_BACKGROUND_COLOR = 'rgb(255,255,255)';
export const THEME_TOOLTIP_HEADER_COLOR = '#4f6f8f';
export const THEME_TOOLTIP_BORDER_COLOR = 'rgb(255,255,255)';
export const THEME_TOOLTIP_FONT_COLOR = '#4f6f8f';
export const THEME_TOOLTIP_ICON_COLOR = '#4f6f8f';
export const THEME_TOOLTIP_ICON_BORDER_COLOR = '#4f6f8f';
export const THEME_TOOLTIP_ICON_BACKGROUND_COLOR = '#f2f5f8';

export const THEME_TOOLTIP_SELECT_BUTTON_TEXT_COLOR = 'rgb(255, 255, 255)';
export const THEME_TOOLTIP_SELECT_BUTTON_BACKGROUND_COLOR = 'rgb(0, 122, 255)';
export const THEME_TOOLTIP_CANCEL_BUTTON_TEXT_COLOR = 'rgb(0, 24, 51)';
export const THEME_TOOLTIP_CANCEL_BUTTON_BACKGROUND_COLOR = 'rgb(237, 240, 243)';

export const THEME_DECK_SELECTOR_FILL_COLOR = '#fff';
export const THEME_DECK_SELECTOR_STROKE_COLOR = 'rgba(50, 50, 50, 0.5)';
export const THEME_DECK_SELECTOR_SIZE = 25;

export const THEME_CABIN_TITLES_WIDTH = 80;
export const THEME_CABIN_TITLES_LABEL_COLOR = '#00BFFF';
export const THEME_CABIN_TITLES_HIGHLIGHT_COLORS = { F: '#BDB76B', B: '#FF8C00', P: '#8FBC8F', E: '#1E90FF' };
//#endregion
