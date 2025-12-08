const CONFIG_MOCK = {
  width: 400,

  horizontal: false,
  rightToLeft: false,

  visibleFuselage: true,
  visibleWings: true,
  visibleCabinTitles: true,
  customCabinTitles: { F: 'First', B: 'Business', P: 'Premium', E: 'Economy' },

  builtInDeckSelector: true,
  singleDeckMode: true,

  builtInTooltip: true,
  externalPassengerManagement: false,
  tooltipOnHover: false,

  lang: 'EN',

  apiUrl: process.env.JETS_BASE_API_URL,
  apiAppId: process.env.JETS_APP_ID,
  apiKey: process.env.JETS_PRIVATE_KEY,

  scaleType: 'zoom',

  visibleSeatPriceLabels: false,

  colorTheme: {
    seatMapBackgroundColor: '#fff',

    deckLabelTitleColor: 'black',
    deckHeightSpacing: 0,

    wingsWidth: 85,
    deckSeparation: 0,

    floorColor: '#595959',
    seatLabelColor: 'black',
    seatStrokeColor: 'rgb(230, 230, 230)',
    seatStrokeWidth: 1,
    seatArmrestColor: '#cccccc',
    notAvailableSeatsColor: 'dimgrey',

    bulkBaseColor: 'dimgrey',
    bulkCutColor: 'lightgrey',
    bulkIconColor: 'darkslategray',

    defaultPassengerBadgeColor: 'darkred',
    fontFamily: 'Montserrat, sans-serif',

    tooltipBackgroundColor: 'rgb(255,255,255)',
    tooltipHeaderColor: '#4f6f8f',
    tooltipBorderColor: 'rgb(255,255,255)',
    tooltipFontColor: '#4f6f8f',
    tooltipIconColor: '#4f6f8f',
    tooltipIconBorderColor: '#4f6f8f',
    tooltipIconBackgroundColor: '#fff',
    tooltipSelectButtonTextColor: '#fff',
    tooltipSelectButtonBackgroundColor: 'rgb(42, 85, 128)',
    tooltipCancelButtonTextColor: '#fff',
    tooltipCancelButtonBackgroundColor: 'rgb(55, 55, 55)',

    deckSelectorStrokeColor: '#fff',
    deckSelectorFillColor: 'rgba(55, 55, 55, 0.5)',
    deckSelectorSize: 30,

    fuselageStrokeWidth: 10,

    fuselageFillColor: 'lightgrey',
    fuselageStrokeColor: 'darkgrey',

    fuselageWindowsColor: 'darkgrey',
    fuselageWingsColor: 'rgba(55, 55, 55, 0.5)',
    fuselageNoseType: 'by-type',

    exitIconUrlLeft: 'https://panorama.quicket.io/icons/exit-left.svg',
    exitIconUrlRight: 'https://panorama.quicket.io/icons/exit-right.svg',

    cabinTitlesWidth: 85,
    customSeatColorRanges: [
      {
        color: '#c7683d', // CSS-compatible color value
        range: [1, 2.99], // score range [min, max] (inclusive)
      },
      {
        color: '#e6be3f',
        range: [3, 4.99],
      },
      {
        color: '#4071b9',
        range: [5, 6.5],
      },
      {
        color: '#8fb947',
        range: [6.51, 10],
      },
    ],
  },
  // hiddenSeatFeatures: ['limitedRecline', 'getColdByExit', 'doNotRecline', 'wingInWindow', 'nearLavatory', 'nearGalley'],
};

export default CONFIG_MOCK;
