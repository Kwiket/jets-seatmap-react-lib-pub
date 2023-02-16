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

export const LOCALIZATION_EN = {
  restrictedLegroom: 'Constrained Legroom',
  extraLegroom: 'Extra Legroom',
  noFloorStorage: 'No underseat storage',
  noOverheadStorage: 'Limited storage space',
  limitedOverheadStorage: 'Limited storage space',
  trayTableInArmrest: 'Tray table in the armrest',
  getColdByExit: 'Close to exit, drafts and chilly',
  misalignedWindow: 'Partial or missing window view',
  noWindow: 'Partial or missing window view',
  doNotRecline: 'Restricted recline, backaches possible',
  limitedRecline: 'Restricted recline, backaches possible',
  storageBoxBetweenWall: 'Storage box between wall',
  nearLavatory: 'Close to restrooms',
  nearGalley: 'Close to galleys',
  nearStairs: 'Stairs, heavy traffic area',
  wingInWindow: 'Wing from window view',
  standardSeat: 'Standard seat',
  reservedCrewSeat: 'Reserved',
  bassinet: 'Baby bassinet available',
  babyBassinet: 'Baby bassinet available',
  audio_video_ondemand: 'Audio & Video On Demand',
  audioVideo: 'Audio & Video On Demand',
  wifi_enabled: 'WiFi enabled',
  wifiEnabled: 'WiFi enabled',
  usbPlug: 'USB plug',
  usbPowerPlug: 'USB & power plug',
  powerPlug: 'Power plug',
  power: 'Power plug',
  pitch: 'Pitch',
  recline: 'Recline',
  width: 'Width',
  cancel: 'Cancel',
  select: 'Select',
  unselect: 'Unselect',
  deck: 'Deck',
  personalTvInArmrest: 'Personal TV in armrest',
  invertedSeat: 'Reverse seat',
};

export const LOCALIZATION_CN = {
  restrictedLegroom: '腿部空间较小',
  extraLegroom: '腿部空间较大',
  noFloorStorage: '前面无座位',
  noOverheadStorage: '行李柜较小',
  limitedOverheadStorage: '行李柜较小',
  trayTableInArmrest: '托盘桌在扶手里',
  getColdByExit: '靠近紧急出口，较冷',
  misalignedWindow: '部分窗户或无窗户',
  noWindow: '部分窗户或无窗户',
  doNotRecline: '后仰角度小，可能背疼',
  limitedRecline: '后仰角度小，可能背疼',
  storageBoxBetweenWall: '牆間儲物箱',
  nearLavatory: '靠近洗手间',
  nearGalley: '靠近厨房',
  nearStairs: '楼梯，来往人流较多',
  wingInWindow: '机翼在窗外视线内',
  standardSeat: '标准座位',
  reservedCrewSeat: '已预订',
  bassinet: '有婴儿摇篮',
  babyBassinet: '有婴儿摇篮',
  audio_video_ondemand: '自选式机上视听娱乐系统',
  audioVideo: '自选式机上视听娱乐系统',
  wifi_enabled: '有WiFi',
  wifiEnabled: '有WiFi',
  usbPlug: 'USB端口',
  usbPowerPlug: 'USB端口及电源插座',
  powerPlug: '电源插座',
  power: '电源插座',
  pitch: '座位间距',
  width: '座位宽度',
  recline: '倾斜度',
  cancel: '取消',
  select: '選擇',
  unselect: '取消選擇',
  deck: '甲板',
  personalTvInArmrest: '扶手里的个人电视',
  invertedSeat: '倒座',
};

export const LOCALIZATION_RU = {
  restrictedLegroom: 'Мало места для ног',
  extraLegroom: 'Много места для ног',
  noFloorStorage: 'Нет места для ручной клади под сиденьем',
  noOverheadStorage: 'Нет полки для ручной клади',
  limitedOverheadStorage: 'Полка ручной клади ограничена в размерах',
  trayTableInArmrest: 'Откидной столик в подлокотнике',
  getColdByExit: 'Возле выхода',
  misalignedWindow: 'Иллюминатор смещён',
  noWindow: 'Иллюминатор отстутсвует',
  doNotRecline: 'Спинка кресла не отклоняется',
  limitedRecline: 'Ограниченное отклонение спинки кресла',
  storageBoxBetweenWall: 'Ящик для хранения в стене',
  nearLavatory: 'Около туалета',
  nearGalley: 'Около буфета-кухни',
  nearStairs: 'Рядом с лестницей, активное движение',
  wingInWindow: 'Место возле крыла самолёта',
  standardSeat: 'Стандартное сиденье',
  reservedCrewSeat: 'Зарезервированное персоналом',
  bassinet: 'Рядом с детской кроваткий',
  babyBassinet: 'Рядом с детской кроваткой',
  audio_video_ondemand: 'Развлекательная аудио- и видеопрограмма',
  audioVideo: 'Развлекательная аудио- и видеопрограмма',
  wifi_enabled: 'Наличие WiFi',
  wifiEnabled: 'Наличие WiFi',
  usbPlug: 'Наличие USB-порта',
  usbPowerPlug: 'Наличие розетки и USB-порта',
  powerPlug: 'Розетка',
  power: 'Розетка',
  pitch: 'Длинна',
  width: 'Ширина',
  recline: 'Наклон',
  cancel: 'Закрыть',
  select: 'Выбрать',
  unselect: 'Убрать',
  deck: 'Этаж',
  personalTvInArmrest: 'Персональный телевизор в подлокотнике',
  invertedSeat: 'Сиденье заднего хода',
};

export const LOCALES_MAP = {
  EN: LOCALIZATION_EN,
  RU: LOCALIZATION_RU,
  CN: LOCALIZATION_CN,
};

//#endregion

//#region Configuration

export const DEFAULT_FEATURES_LIST = ['seatDetails', 'cabin', 'entertainment', 'power', 'wifi', 'seatMapLink'];

export const DEFAULT_LANG = 'EN';

export const DEFAULT_UNITS = 'metric';

export const DEFAULT_SEAT_MARGIN = 3;

export const DEFAULT_SEAT_MAP_WIDTH = 350;

export const DEFAULT_TOOLTIP_WIDTH = 260;

export const SEAT_SIZE_MAP = {
  F: {
    width: 124,
    height: 200,
  },
  B: {
    width: 124,
    height: 200,
  },
  P: {
    width: 106,
    height: 120,
  },
  E: {
    width: 106,
    height: 120,
  },
};

export const DEFAULT_SEAT_SIZE = {
  width: 86,
  height: 100,
};

export const DEFAULT_SEAT_CLASS = 'E';

export const DEFAULT_DECK_TITLE_HEIGHT = 100;

export const DEFAULT_INDEX_ROW_HEIGHT = 300;

export const DECK_ITEM_ALIGN_MAP = {
  left: 'left',
  right: 'right',
};

export const DEFAULT_STYLE_POSITION = 'auto';

//#endregion

//#region Theme

export const BASE_SEAT_COLOR = '#ccc';

export const BASE_ARMREST_COLOR = 'rgb(185,186,186)';

export const BASE_PASSENGER_BADGE_COLOR = '#1157ce';

export const BASE_SEAT_STROKE_WIDTH = 1;

export const SEAT_STATUS_COLOR_MAP = {
  available: 'rgb(237, 237, 237)',
  default: BASE_SEAT_COLOR,
};

//#endregion
