import {
  ENTITY_STATUS_MAP,
  ENTITY_TYPE_MAP,
  JetsLocalStorageService,
  DEFAULT_SEAT_PASSENGER_TYPES,
} from '../../common';
import { JetsSeatMapApiService } from './api';
import { JetsContentPreparer } from '../../common/data-preparer';
import { JetsDataHelper } from '../../common/data-helper';

export class JetsSeatMapService {
  constructor(configuration) {
    const { apiUrl, apiAppId, apiKey, colorTheme, apiAuthorizationScheme, apiMetadata } = configuration;

    const localStorage = new JetsLocalStorageService();
    this._api = new JetsSeatMapApiService(apiAppId, apiKey, apiUrl, localStorage, apiAuthorizationScheme, apiMetadata);
    this._preparer = new JetsContentPreparer();
    this._colorTheme = colorTheme;
    this._configuration = configuration;
  }

  getSeatMapData = async (flight, availability, passengers, config) => {
    const { lang, units } = config;
    const planeFeatures = await this._api.getPlaneFeatures(flight, lang, units);

    let { content, params, exits, bulks } = this._preparer.prepareData(planeFeatures, config);

    if (availability) content = this.setAvailabilityHandler(content, availability);

    const activePassenger = passengers?.find(item => item.seat?.seatLabel);
    if (passengers && activePassenger) content = this.setPassengersHandler(content, passengers);

    return { content, params, exits, bulks, availabilityData: planeFeatures?.availabilityData };
  };

  selectSeatHandler = (content, seat, passengersList) => {
    const nextPassenger = this.getNextPassenger(passengersList);
    const passengers = passengersList.map(passenger => {
      if (nextPassenger?.id === passenger.id) {
        const data = {
          price: seat['price'],
          seatLabel: seat['number'],
          currency: seat['currency'],
          priceValue: seat['priceValue'],
        };
        passenger['seat'] = data;
      }

      return passenger;
    });

    const data = this.setPassengersHandler(content, passengers);

    return { data, passengers };
  };

  unselectSeatHandler = (content, seat, passengersList) => {
    const passengers = passengersList.map(passenger => {
      if (seat.passenger?.id === passenger.id) {
        passenger['seat'] = null;
      }

      return passenger;
    });

    const data = this.setPassengersHandler(content, passengers);

    return { data, passengers };
  };

  setAvailabilityHandler = (content, availability) => {
    const { selected, available, unavailable } = ENTITY_STATUS_MAP;
    const wildCardSeatData = availability?.find(item => item.label === '*');

    return (
      content &&
      content.map(deck => {
        const rows = deck.rows.map(row => {
          const seats = row.seats.map(seat => {
            const availableSeatData = availability.find(item => {
              return item.label === seat.number;
            });
            const currencySign =
              this._configuration.currencySign || availableSeatData?.currency || wildCardSeatData?.currency;
            const priceValue = availableSeatData?.price || wildCardSeatData?.price || 0;

            if (availableSeatData) {
              seat['status'] = seat['status'] === selected ? selected : available;
              seat['price'] = `${currencySign} ${priceValue}` || '';
              seat['priceValue'] = priceValue;
              seat['currency'] = currencySign;
              seat['passengerTypes'] =
                availableSeatData.onlyForPassengerType ||
                wildCardSeatData?.onlyForPassengerType ||
                DEFAULT_SEAT_PASSENGER_TYPES;
              seat['additionalProps'] = [
                ...(availableSeatData?.additionalProps || []),
                ...(wildCardSeatData?.additionalProps || []),
              ];
              seat['color'] = JetsDataHelper.validateColor(
                availableSeatData?.color || wildCardSeatData?.color,
                seat?.originalColor
              );
            } else if (seat.type === ENTITY_TYPE_MAP.seat) {
              seat['status'] = wildCardSeatData ? available : unavailable;
              seat['price'] = wildCardSeatData ? `${currencySign} ${priceValue}` : null;
              seat['priceValue'] = priceValue;
              seat['currency'] = currencySign;
              seat['passenger'] = null;
              seat['passengerTypes'] = wildCardSeatData?.onlyForPassengerType || DEFAULT_SEAT_PASSENGER_TYPES;
              seat['additionalProps'] = wildCardSeatData?.additionalProps || [];
              seat['color'] = JetsDataHelper.validateColor(
                wildCardSeatData?.color,
                this._colorTheme.notAvailableSeatsColor
              );
            }

            seat['additionalProps'] = this._preparer.prepareSeatAdditionalProps(seat);

            return seat;
          });

          return { ...row, seats };
        });

        return { ...deck, rows };
      })
    );
  };

  setPassengersHandler = (content, passengers) => {
    const { selected, available, unavailable } = ENTITY_STATUS_MAP;

    return content.map(deck => {
      const rows = deck.rows.map(row => {
        const seats = row.seats.map(seat => {
          const found = passengers.find(passenger => seat.number && passenger?.seat?.seatLabel === seat.number);

          if (found && (seat.status === available || seat.status === selected)) {
            seat['status'] = selected;
            seat['price'] = found.seat?.price || seat['price'];
            seat['passenger'] = found;
          } else if (found && seat.status === unavailable) {
            found['seat'] = null;
          } else if (!found && seat.status === selected) {
            seat['status'] = available;
            seat['passenger'] = null;
          }

          return seat;
        });

        return { ...row, seats };
      });

      return { ...deck, rows };
    });
  };

  calculateTooltipData = (seatData, seatNode, seatMapNode, antiScale, isHorizontal) => {
    const { offsetTop: seatTop, offsetLeft: seatLeft, clientWidth: seatWidth } = seatNode;

    const clientRect = seatMapNode.getBoundingClientRect();
    const parentDeck = seatNode.closest('.tooltip-holder');

    const width = isHorizontal ? clientRect.height : clientRect.width;
    const height = isHorizontal ? clientRect.width : clientRect.height;

    const widthPercent = 0.95;
    const tooltipWidth = `${100 * widthPercent}%`;

    const top = seatTop + seatData.size.height / 2;

    const left = `${100 * (1 - widthPercent) * 0.5}%`;

    return {
      ...seatData,
      top,
      left,
      antiScale,
      width: tooltipWidth,
      seatmapHeight: height,
      seatmapWidth: width,
      activeDeck: parentDeck,
      seatNode,
    };
  };

  getNextPassenger = passengers => {
    return passengers?.find(passenger => !passenger.seat?.seatLabel && !passenger.readOnly);
  };

  addAbbrToPassengers = passengers => {
    return passengers?.map((passenger, index) => {
      passenger['abbr'] = this._getPassengerAbbr(passenger, index + 1);
      return passenger;
    });
  };

  _getPassengerAbbr = (passenger, index) => {
    const { passengerLabel } = passenger;

    if (!passengerLabel) {
      return `P${index}`;
    }

    const label = passengerLabel?.split(' ');
    const abbr =
      label.length > 1
        ? label
            .slice(0, 2)
            .map(n => n[0])
            .join('')
        : passengerLabel.substring(0, 2).toUpperCase();

    return abbr;
  };

  findPassengerBySeatNumber = (passengers, seatNumber) => {
    return passengers.find(passenger => passenger.seat?.seatLabel === seatNumber);
  };

  /**
   * Finds the index of the deck that contains provided seat label.
   *
   * @param { string } seatLabel - The seat label to search for.
   * @param { Array<Object> } decks - The data containing the info about seats / rows / decks.
   * @returns { number } - The index of the deck containing the seatLabel, or -1 if not found.
   */
  getDeckIndexBySeatLabel = (seatLabel, decks) => {
    if (!seatLabel || !decks?.length) return -1;

    return decks.findIndex(
      deck =>
        Array.isArray(deck.rows) &&
        deck.rows.some(row => Array.isArray(row.seats) && row.seats.some(seat => seat.number === seatLabel))
    );
  };

  /**
   * Checks the existence of seats with the provided labels and returns lists of existing and non-existing seat labels.
   *
   * @param { Array<string> } seatLabels - Array of seat labels.
   * @param { Array<Object> } decks - The data containing the info about seats / rows / decks.
   * @returns { Object } An object containing arrays of existing (if found) and non-existing (if not found) seat labels.
   * @property { Array<string> } existingSeatLabels - Array of seat labels that exist in the provided plane data.
   * @property { Array<string> } nonExistingSeatLabels - Array of seat labels that doesn't exist in the provided plane data.
   */
  compareWithDecksSeatsInfo = (seatLabels, decks) => {
    if (!seatLabels || !decks) return;

    const providedSeatLabels = seatLabels.map(seatLabel => seatLabel.toString().toUpperCase());

    const deckSeatLabels = decks.flatMap(deck =>
      deck?.rows?.flatMap(row =>
        row?.seats?.filter(seat => seat?.type === ENTITY_TYPE_MAP.seat).map(seat => seat?.number?.toUpperCase())
      )
    );

    return providedSeatLabels.reduce(
      (acc, number) => {
        if (deckSeatLabels.includes(number)) {
          acc.existingSeatLabels.push(number);
        } else {
          acc.nonExistingSeatLabels.push(number);
        }

        return acc;
      },
      { existingSeatLabels: [], nonExistingSeatLabels: [] }
    );
  };
}
