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
  constructor(appId, key, url, localStorage = null, apiAuthorizationScheme = DEFAULT_AUTHORIZATION_SCHEME) {
    super(appId, key, url, localStorage, apiAuthorizationScheme);
  }

  getPlaneFeatures = async (flight, lang = DEFAULT_LANG, units = DEFAULT_UNITS) => {
    const language = API_SUPPORTED_LANGUAGES.includes(lang) ? lang : DEFAULT_LANG;

    const data = { flight, lang: language, units };

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
          if (flight.cabinClass) {
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

  getSeatTypesUpdates = async param => {
    // @TODO: replace it with real data
    const mockData = {
      46: {
        template:
          '<svg version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 275 1230" width="275" height="1230"> <g class="seat"> <polyline fill="${style.fillColor}" stroke="${style.strokeColor}" stroke-width="${style.strokeWidth}" stroke-miterlimit="4.8"  points="0,983.4 128,983.4 128,912.2 0,912.2 "/> <polyline fill="rgb(184, 184, 184)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8"  points="0,1225 275,1225 275,1179.3 0,1179.3 "/> <path fill="rgb(235, 235, 235)" d="M0,1220h265v-118.2h10V1230H0"/> <polygon fill="${style.fillColor}" points="0,505 79.3,505 177.6,46.3 0,46.3 "/> <polyline fill="rgb(184, 184, 184)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8"  points="0,50.2 176.2,50.2 153.6,157.2 213.4,157.3 212,7.7 0,6.2 "/> <path fill="rgb(169, 169, 169)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M0,828.5h126.6c0,0-0.9,77.7,0,78.7L0,906.8"/> <polygon fill="rgb(235, 235, 235)" points="275,995.6 265,995.6 265,704.2 205.1,508.2 205.1,507.4 209.1,159.2 208.4,10 0,10 0,0 218.4,0 219.1,159.3 215.1,506.8 275,702.8 	"/> <path fill="${style.fillColor}" stroke="${style.strokeColor}" stroke-width="${style.strokeWidth}" stroke-miterlimit="4.8"  d="M80.2,1166.7h132.5v-97.6c0-2.7-1.7-4.9-4.1-5.3c-10.8-1.6-40.9-6-62-6c-21.2,0-51.4,4.4-62.1,6c-2.4,0.4-4.1,2.7-4.1,5.3C80.2,1069.1,80.2,1166.7,80.2,1166.7z"/> <path fill="${style.fillColor}" stroke="${style.strokeColor}" stroke-width="${style.strokeWidth}" stroke-miterlimit="4.8"  d="M80.4,1192.3c0,2.2,1.1,4,2.7,4.9c7.1,3.6,27.9,12.5,63.6,11.8c35.4-0.7,56-8.5,63.1-12c1.7-0.9,2.8-2.7,2.8-4.9v-52.9H80.2L80.4,1192.3L80.4,1192.3z"/> <path fill="rgb(255, 255, 255)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M109.8,1162.7c5.5-1.3,19.8-4.4,36.7-4.4c16.7,0,31.3,3.1,36.7,4.4c1.3,0.4,2.2,1.5,2.2,2.9v6.7v1.1v6.7c0,1.5-0.9,2.5-2.2,2.9c-5.5,1.3-19.8,4.4-36.7,4.4s-31.3-3.1-36.7-4.4c-1.3-0.4-2.2-1.5-2.2-2.9v-6.7v-1.1v-6.7C107.6,1164.3,108.5,1163,109.8,1162.7z"/> <path fill="rgb(184, 184, 184)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8"  d="M211,1197.1h-3.7V1080c-0.1-3.9,2.1-6.9,5.8-7h3.1c8.8-0.2,9.2,6.9,9.2,15.8l0.5,31.6c0.1,1.6-0.1,3.3-0.5,4.8l-8,66.4C217,1194.7,214.3,1197.1,211,1197.1z"/> <path fill="rgb(184, 184, 184)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8"  d="M75.6,1191.5l-8-66.4c-0.5-1.5-0.6-3.2-0.5-4.8l0.5-31.6c0.1-8.8,0.4-15.9,9.2-15.8h3.1c3.7,0.1,5.9,3.1,5.8,7v117.2H82C78.7,1197.1,76,1194.7,75.6,1191.5z"/> <ellipse fill="rgb(235, 235, 235)" stroke="rgb(147, 147, 147)" stroke-width="1.2" stroke-miterlimit="4.8" cx="44.7" cy="878.8" rx="33.6" ry="27"/> <path fill="rgb(147, 147, 147)" d="M48.3,906.1h-7.2v-17.2c0-1.8,1.5-3.3,3.3-3.3h0.7c1.8,0,3.3,1.5,3.3,3.3L48.3,906.1L48.3,906.1z"/> <path fill="rgb(235, 235, 235)" d="M132,915H0v-10h132"/> <path fill="rgb(235, 235, 235)" d="M122.6,911.3v-99.1h10v99.1"/> <path fill="rgb(235, 235, 235)" d="M132.6,884.2v99.1h-10v-99.1"/> <polygon fill="rgb(235, 235, 235)" points="132,701.9 122,701.9 122,680.8 72.3,513.8 0,513.8 0,503.8 79.7,503.8 132,679.4"/> <polyline fill="none" stroke="rgb(235, 235, 235)" stroke-width="2" stroke-miterlimit="4.8" stroke-dasharray="4.4" points="0,492.9 59.8,492.9 133.3,161.3 0,161.3"/> <path fill="rgb(255, 255, 255)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M97.8,119.4c-7.1,1.6-25.5,5.5-47.2,5.5c-21.5,0-40.2-3.8-47.2-5.5c-1.7-0.5-2.8-1.9-2.8-3.6v-8.3v-1.4v-8.3c0-1.9,1.2-3.1,2.8-3.6c7.1-1.6,25.5-5.5,47.2-5.5s40.2,3.8,47.2,5.5c1.7,0.5,2.8,1.9,2.8,3.6v8.3v1.4v8.3C100.6,117.4,99.4,119,97.8,119.4z"/> </g> </svg>',
        size: [130, 150],
      },
      47: {
        template:
          '<svg version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 550 325" width="550" height="325"> <g class="seat"> <polyline fill="${style.fillColor}" stroke="${style.strokeColor}" stroke-width="${style.strokeWidth}" stroke-miterlimit="4.8" points="544.4,80.9 36.5,80.9 36.5,9.7 544.4,9.7 "/> <path fill="${style.fillColor}" stroke="${style.strokeColor}" stroke-width="${style.strokeWidth}" stroke-miterlimit="4.8" d="M336.3,314.6h132.5V217c0-2.7-1.7-4.9-4.1-5.3c-10.8-1.6-40.9-6-62-6c-21.2,0-51.4,4.4-62.1,6c-2.4,0.4-4.1,2.7-4.1,5.3C336.3,217,336.3,314.6,336.3,314.6z"/> <path fill="${style.fillColor}" stroke="${style.strokeColor}" stroke-width="${style.strokeWidth}" stroke-miterlimit="4.8" d="M468.7,320v-32.9H336.3"/> <path fill="rgb(255, 255, 255)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M363.7,318v3.3v-1.1v-6.7c0-1.3,0.9-2.6,2.2-2.9c5.5-1.3,19.8-4.4,36.7-4.4c16.7,0,31.3,3.1,36.7,4.4c1.3,0.4,2.2,1.5,2.2,2.9v6.7v1.1V318"/> <path fill="rgb(184, 184, 184)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M463.4,320v-92.1c-0.1-3.9,2.1-6.9,5.8-7h3.1c8.8-0.2,9.2,6.9,9.2,15.8l0.5,31.6c0.1,1.6-0.1,3.3-0.5,4.8l-5.6,46.9"/> <path fill="rgb(184, 184, 184)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M329.2,318.7l-5.5-45.7c-0.5-1.5-0.6-3.2-0.5-4.8l0.5-31.6c0.1-8.8,0.4-15.9,9.2-15.8h3.1c3.7,0.1,5.9,3.1,5.8,7v91.3"/> <rect fill="rgb(184, 184, 184)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" x="8" y="5.4" width="32.4" height="220.4"/> <path fill="rgb(255, 255, 255)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M487,117.9c-1.6-7.1-5.5-25.5-5.5-47.2c0-21.5,3.8-40.2,5.5-47.2c0.5-1.7,1.9-2.8,3.6-2.8h8.3h1.4h8.3c1.9,0,3.1,1.2,3.6,2.8 c1.6,7.1,5.5,25.5,5.5,47.2s-3.8,40.2-5.5,47.2c-0.5,1.7-1.9,2.8-3.6,2.8h-8.3h-1.4h-8.3C489,120.7,487.4,119.5,487,117.9z"/> <path fill="rgb(147, 147, 147)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M274.9,320.8H7.4V205.7h223.9c24.1,0,43.6,19.5,43.6,43.6V320.8z"/> <polygon fill="rgb(235, 235, 235)" points="550,129.2 550,0 548.8,0 1.2,0 0,0 0,2.8 0,322.2 0,325 1.2,325 548.8,325 550,325 550,202.8 540,202.8 540,315 10,315 10,10 540,10 540,129.2 "/> <path fill="none" stroke="rgb(235, 235, 235)" stroke-width="2" stroke-miterlimit="4.8" stroke-dasharray="4.4" d="M398.2,128.3l46.5-47"/> <path fill="none" stroke="rgb(235, 235, 235)" stroke-width="2" stroke-miterlimit="4.8" stroke-dasharray="4.4" d="M546.2,128.4h-506"/> </g> </svg>',
        size: [150, 170],
      },
      48: {
        template:
          '<svg version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 550 325" width="550" height="325"> <g class="seat" transform="scale(-1, 1) translate(-550,0)"> <polyline fill="${style.fillColor}" stroke="${style.strokeColor}" stroke-width="${style.strokeWidth}" stroke-miterlimit="4.8" points="544.4,80.9 36.5,80.9 36.5,9.7 544.4,9.7 "/> <path fill="${style.fillColor}" stroke="${style.strokeColor}" stroke-width="${style.strokeWidth}" stroke-miterlimit="4.8" d="M336.3,314.6h132.5V217c0-2.7-1.7-4.9-4.1-5.3c-10.8-1.6-40.9-6-62-6c-21.2,0-51.4,4.4-62.1,6c-2.4,0.4-4.1,2.7-4.1,5.3C336.3,217,336.3,314.6,336.3,314.6z"/> <path fill="${style.fillColor}" stroke="${style.strokeColor}" stroke-width="${style.strokeWidth}" stroke-miterlimit="4.8" d="M468.7,320v-32.9H336.3"/> <path fill="rgb(255, 255, 255)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M363.7,318v3.3v-1.1v-6.7c0-1.3,0.9-2.6,2.2-2.9c5.5-1.3,19.8-4.4,36.7-4.4c16.7,0,31.3,3.1,36.7,4.4c1.3,0.4,2.2,1.5,2.2,2.9v6.7v1.1V318"/> <path fill="rgb(184, 184, 184)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M463.4,320v-92.1c-0.1-3.9,2.1-6.9,5.8-7h3.1c8.8-0.2,9.2,6.9,9.2,15.8l0.5,31.6c0.1,1.6-0.1,3.3-0.5,4.8l-5.6,46.9"/> <path fill="rgb(184, 184, 184)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M329.2,318.7l-5.5-45.7c-0.5-1.5-0.6-3.2-0.5-4.8l0.5-31.6c0.1-8.8,0.4-15.9,9.2-15.8h3.1c3.7,0.1,5.9,3.1,5.8,7v91.3"/> <rect fill="rgb(184, 184, 184)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" x="8" y="5.4" width="32.4" height="220.4"/> <path fill="rgb(255, 255, 255)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M487,117.9c-1.6-7.1-5.5-25.5-5.5-47.2c0-21.5,3.8-40.2,5.5-47.2c0.5-1.7,1.9-2.8,3.6-2.8h8.3h1.4h8.3c1.9,0,3.1,1.2,3.6,2.8 c1.6,7.1,5.5,25.5,5.5,47.2s-3.8,40.2-5.5,47.2c-0.5,1.7-1.9,2.8-3.6,2.8h-8.3h-1.4h-8.3C489,120.7,487.4,119.5,487,117.9z"/> <path fill="rgb(147, 147, 147)" stroke="rgb(235, 235, 235)" stroke-width="1.2" stroke-miterlimit="4.8" d="M274.9,320.8H7.4V205.7h223.9c24.1,0,43.6,19.5,43.6,43.6V320.8z"/> <polygon fill="rgb(235, 235, 235)" points="550,129.2 550,0 548.8,0 1.2,0 0,0 0,2.8 0,322.2 0,325 1.2,325 548.8,325 550,325 550,202.8 540,202.8 540,315 10,315 10,10 540,10 540,129.2 "/> <path fill="none" stroke="rgb(235, 235, 235)" stroke-width="2" stroke-miterlimit="4.8" stroke-dasharray="4.4" d="M398.2,128.3l46.5-47"/> <path fill="none" stroke="rgb(235, 235, 235)" stroke-width="2" stroke-miterlimit="4.8" stroke-dasharray="4.4" d="M546.2,128.4h-506"/> </g> </svg>',
        size: [122, 218],
      },
    };

    return mockData;
  };
}
