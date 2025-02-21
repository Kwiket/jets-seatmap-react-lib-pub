import { DEFAULT_LANG, DEFAULT_UNITS, DEFAULT_AUTHORIZATION_SCHEME, JetsApiService } from '../../common';

const API_SUPPORTED_LANGUAGES = [
  'AR',
  'CN',
  'CS',
  'DA',
  'DE',
  'EN',
  'EL',
  'ES',
  'ET',
  'FR',
  'HE',
  'HU',
  'ID',
  'IT',
  'JA',
  'IW',
  'KO',
  'LT',
  'LV',
  'NL',
  'NO',
  'PL',
  'PT',
  'RO',
  'RU',
  'TR',
  'UK',
  'SV',
];

export class JetsSeatMapApiService extends JetsApiService {
  constructor(
    appId,
    key,
    url,
    localStorage = null,
    apiAuthorizationScheme = DEFAULT_AUTHORIZATION_SCHEME,
    apiMetadata = null
  ) {
    super(appId, key, url, localStorage, apiAuthorizationScheme, apiMetadata);
  }

  getPlaneFeatures = async (flight, lang = DEFAULT_LANG, units = DEFAULT_UNITS) => {
    const language = API_SUPPORTED_LANGUAGES.includes(lang) ? lang : DEFAULT_LANG;

    const data = {
      flight,
      lang: language,
      units,
      metadata: this._apiMetadata ?? undefined, // If there's no metadata, omit the property entirely
    };

    const path = 'flight/features/plane/seatmap';
    const availabilityDataKey = 'availabilityData';
    const responseItems = await this.postData(path, data);

    const result = {
      seatDetails: null,
    };

    const cabinClasses = ['F', 'B', 'P', 'E'];

    for (const item of responseItems) {
      switch (item.id) {
        case flight.id:
          if (item && item.error) {
            throw new Error(item.error);
          }
          if (flight.cabinClass && cabinClasses.includes(flight.cabinClass)) {
            const { id, cabin, entertainment, power, wifi } = item;
            result[flight.cabinClass] = {
              cabin,
              entertainment,
              power,
              wifi,
            };
          }
          result.seatDetails = item.seatDetails;
          break;
        case availabilityDataKey: {
          const { id, ...rest } = item;
          result[availabilityDataKey] = { ...rest };
          break;
        }
        default:
          const { id, cabin, entertainment, power, wifi } = item;
          const cabinClass = id.split(':')[1];
          if (cabinClass && cabinClasses.includes(cabinClass)) {
            result[cabinClass] = {
              cabin,
              entertainment,
              power,
              wifi,
            };
          }
          break;
      }
    }

    if (!result.seatDetails) {
      throw new Error(`data is not found for the flight: ${flight.id}`);
    }

    return result;
  };
}
