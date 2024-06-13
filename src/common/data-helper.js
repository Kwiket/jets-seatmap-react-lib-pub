import {
  DEFAULT_DECK_PADDING_SIZE,
  THEME_FUSELAGE_OUTLINE_WIDTH,
  FUSELAGE_HEIGHT_TO_WIDTH_RATIO,
  ENTITY_TYPE_MAP,
  SCALE_TYPES,
} from './constants';

export class JetsDataHelper {
  constructor() {}

  getSeatMapParams = (decks, config) => {
    const decksWidths = decks.map(deck => deck.width);
    const maxDeckWidth = Math.max(...decksWidths) + config?.colorTheme?.fuselageStrokeWidth * 2 || 0;

    const decksWings = decks.map(deck => deck.wingsInfo.length);
    const isWingsExist = Math.max(...decksWings) > 0;

    const scaleCoefs = this._calculateSeatMapScale(maxDeckWidth, config.width);
    const rotationCoefs = this._calculateSeatMapRotation(
      config.horizontal,
      config.rightToLeft,
      scaleCoefs.scale,
      config.scaleType
    );

    // hardcoded 2.4 from tail and nose proportions
    const hullSize = config.visibleFuselage ? maxDeckWidth * FUSELAGE_HEIGHT_TO_WIDTH_RATIO : 0;
    const deckSpacings = config?.colorTheme?.deckHeightSpacing * decks.length * 2 || 0;
    const separatorSize = config.singleDeckMode ? 0 : (decks.length - 1) * (config?.colorTheme?.deckSeparation || 0);

    const totalDecksHeight =
      decks.map(deck => deck.height).reduce((a, b) => a + b, 0) + hullSize + separatorSize + deckSpacings;

    const separateDeckHeights = decks.map(deck => deck.height + hullSize + separatorSize + deckSpacings);

    const isTouchDevice = navigator.maxTouchPoints || 'ontouchstart' in document.documentElement;

    return {
      ...scaleCoefs,
      ...rotationCoefs,
      innerWidth: maxDeckWidth,

      isTouchDevice,
      tooltipOnHover: config.tooltipOnHover,

      builtInTooltip: config?.builtInTooltip,
      externalPassengerManagement: config?.externalPassengerManagement,

      builtInDeckSelector: config?.builtInDeckSelector,
      singleDeckMode: config?.singleDeckMode,

      totalDecksHeight,
      separateDeckHeights,

      visibleFuselage: config.visibleFuselage,
      visibleWings: config.visibleWings && isWingsExist,
      visibleCabinTitles: config.visibleCabinTitles,
      scaledTotalDecksHeight: totalDecksHeight ? `${totalDecksHeight * (scaleCoefs.scale || 1)}px` : '100%',
    };
  };

  getDeckInnerWidth(biggestRowWidth, config) {
    return biggestRowWidth + DEFAULT_DECK_PADDING_SIZE * 2 + THEME_FUSELAGE_OUTLINE_WIDTH * 2 || config.width;
  }

  getDeckInnerWidthWithWings(deck, isWingsExist, config) {
    const wingsSpace = config?.visibleWings && isWingsExist ? config.colorTheme.wingsWidth : 0;
    const cabinTitlesSpace = config?.visibleCabinTitles ? config.colorTheme.cabinTitlesWidth : 0;

    return deck.width + Math.max(wingsSpace, cabinTitlesSpace) * 2;
  }

  findWidestDeckRow = rows => {
    const sorted = [...rows]
      .filter(r => !!r.number)
      .sort((a, b) => {
        return b.width - a.width;
      });

    return sorted[0];
  };

  findBiggestDeckRow = rows => {
    const sorted = [...rows].sort((a, b) => {
      const seatsRegex = /S/g;
      const bSeatsCount = b.seatScheme.match(seatsRegex).length;
      const aSeatsCount = a.seatScheme.match(seatsRegex).length;
      return bSeatsCount - aSeatsCount;
    });

    return this.assignAllLettersForBiggestRow(sorted[0], rows);
  };

  assignAllLettersForBiggestRow = (biggestRow, rows) => {
    const biggestRowCopy = { ...biggestRow, seats: biggestRow.seats.map(seat => ({ ...seat })) };
    try {
      const biggestRowLetters = this.rowLetters(biggestRowCopy);

      const otherLettersRow = rows.find(row => {
        if (row.seatScheme === biggestRowCopy.seatScheme) {
          const rowLetters = this.rowLetters(row);
          if (biggestRowLetters !== rowLetters) {
            return row;
          }
        }
      });

      if (otherLettersRow) {
        biggestRowCopy.seats.forEach((element, index) => {
          element.letter = `${element.letter} - ${otherLettersRow.seats[index].letter}`;
        });
      }
    } catch (error) {
      console.error('Error at assignAllLettersForBiggestRow', error);
    }

    return biggestRowCopy;
  };

  rowLetters = row => {
    const knownElementTypes = {
      [ENTITY_TYPE_MAP.aisle]: '-',
      [ENTITY_TYPE_MAP.empty]: ' ',
    };
    return row.seats.map(element => knownElementTypes[element.type] || element.letter).join();
  };

  getDefaultSeatSizeByClass = classCode => {
    if (!classCode || !SEAT_SIZE_BY_CLASS[classCode]) return DEFAULT_SEAT_SIZE;

    return SEAT_SIZE_BY_CLASS[classCode];
  };

  _calculateSeatMapRotation = (isHorizontal, isRtl, scale, scaleType) => {
    let rotation = '';
    let offset = '';
    let antiRotation = '';

    // RTL\LTR handled differently afterwards
    if (isHorizontal) {
      rotation = 'rotate(90deg)';
      offset = scaleType === SCALE_TYPES.ZOOM ? `translateY(${-100 / scale}%)` : `translateY(-100%)`;
      antiRotation = 'rotate(-90deg)';
    }

    return { rotation, offset, antiRotation, isHorizontal, rightToLeft: isRtl };
  };

  _calculateSeatMapScale = (innerWidth, outerWidth) => {
    const scale = outerWidth / innerWidth || 1;
    const antiScale = innerWidth / outerWidth || 1;

    return { scale, antiScale };
  };

  _calculateDecksHeight = (decks, bulks, exits) => {
    return decks?.map((deck, deckIndex) => {
      const deckBulks = bulks[deckIndex];
      const deckExits = exits[deckIndex];
      return this.calculateDeckHeight(deck.rows, deckBulks, deckExits);
    });
  };

  calculateDeckHeight = (rows, deckBulks, deckExits) => {
    if (!rows.length) return 0;

    // const lastRow = rows.at(-1);
    const lastRow = rows[rows.length - 1];
    const { topOffset: lastRowTopOffset, seats: lastRowSeats } = lastRow;
    const lowestSeat = this._findLowestSeat(lastRowSeats);
    const { height: lastBulkHeight, topOffset: lastBulkTopOffset } = this._calculateLastElementHeight(deckBulks);

    const { height: lastExitHeight, topOffset: lastExitTopOffset } = this._calculateLastElementHeight(deckExits);

    const lowestSeatBoundary = lastRowTopOffset + lowestSeat.topOffset + lowestSeat.size.height;
    const lowestBulkBoundary = lastBulkTopOffset + lastBulkHeight;
    const lowestExitBoundary = lastExitTopOffset + lastExitHeight;

    const maxElementTopOffset = Math.max(lowestSeatBoundary, lowestBulkBoundary, lowestExitBoundary);
    const preparedHeight = Math.round(maxElementTopOffset);

    return preparedHeight;
  };

  _findLowestSeat = seats => {
    let lowestBottomBoundary = 0;
    const filteredSeats = seats.filter(seat => seat.letter && !Number.isInteger(seat.letter));
    let lowest = filteredSeats[0];

    for (const seat of filteredSeats) {
      const { width, height } = seat.size;
      const seatBottomBoundary = (seat.topOffset || 0) + height;
      if (lowestBottomBoundary < seatBottomBoundary) {
        lowestBottomBoundary = seatBottomBoundary;
        lowest = seat;
      }
    }

    return lowest;
  };

  _calculateLastElementHeight = elements => {
    const initialAcc = {
      topOffset: 0,
      height: 0,
    };

    return elements?.reduce((acc, { topOffset, height }) => {
      if (topOffset > acc.topOffset) {
        acc.topOffset = topOffset;
        acc.height = height || 150; //FIXME: exits without height ???
      }

      return acc;
    }, initialAcc);
  };

  static validateColor(strColor, defaultColor) {
    return this._isColor(strColor) ? strColor : defaultColor;
  }

  static _isColor(strColor) {
    const s = new Option().style;
    s.color = strColor;
    return s.color !== '';
  }

  static mergeColorThemeWithConstraints = (defaultTheme, theme) => {
    let merged = { ...defaultTheme, ...this._filterInvalidColors(theme) };

    for (let k in _colorThemeConstraints) {
      merged[k] = _colorThemeConstraints[k](merged[k]);
    }

    return merged;
  };

  static _filterInvalidColors(theme) {
    Object.keys(theme).reduce((acc, key) => {
      const isNamedAsColor = key.toLowerCase().includes('color');

      if (!isNamedAsColor) {
        acc[key] = theme[key];
        return acc;
      }

      const isValidColor = this._isColor(theme[key]);

      if (isValidColor) {
        acc[key] = theme[key];
      } else {
        console.warn('config.colorTheme', key, 'has invalid color', theme[key]);
      }
      return acc;
    }, {});

    return theme;
  }
}

const _colorThemeConstraints = {
  fuselageStrokeWidth: value => {
    return Math.min(Math.max(10, value), 18);
  },
};
