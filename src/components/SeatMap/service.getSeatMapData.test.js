import { JetsSeatMapApiService } from './api';
import { createPassenger, createSeatsMapService } from './service.test';
import {
  DEFAULT_DECK_PADDING_SIZE,
  DEFAULT_DECK_TITLE_HEIGHT,
  DEFAULT_INDEX_ROW_HEIGHT,
  SEAT_FEATURES_ICONS,
  SEAT_MEASUREMENTS_ICONS,
  THEME_FUSELAGE_OUTLINE_WIDTH,
  Utils,
} from '../../common';
import {
  ALL_SEAT_SIZES_BY_TYPE,
  createExpectedResponse,
  createIconObject,
  createParams,
  createPreparedAisle,
  createPreparedDeck,
  createPreparedRow,
  createPreparedSeat,
  createSeatDetailsDeck,
  createSeatDetailsRow,
  createSeatDetailsSeat,
  CUSTOM_BULK_TOP_OFFSET,
  CUSTOM_EXIT_TOP_OFFSET,
  CUSTOM_LARGE_TOP_OFFSET,
  CUSTOM_ROW_TOP_OFFSET,
  CUSTOM_SEAT_TOP_OFFSET,
  DEFAULT_SEAT_DIMENSIONS,
  DEFAULT_TOP_OFFSET,
  MOCK_UNIQUE_ID,
  SEAT_FEATURES_WITH_LOCALES,
} from './service.getSeatMapData.testUtils';

beforeEach(() => {
  jest.resetAllMocks();
});

jest.mock('../../common/utils');
jest.mock('../../components/SeatMap/api');

describe('JetsSeatMapService getSeatMapData', () => {
  describe('getSeatMapData', () => {
    beforeEach(() => {
      Utils.generateId = jest.fn().mockReturnValue(MOCK_UNIQUE_ID);
      JetsSeatMapApiService.prototype.getPlaneFeatures = jest.fn().mockImplementation(() => {});
    });

    function initServiceAndMocks(planeFeatures) {
      const service = createSeatsMapService();

      const mockGetPlaneFeatures = jest.fn().mockImplementation(() => planeFeatures);
      JetsSeatMapApiService.prototype.getPlaneFeatures = mockGetPlaneFeatures;

      const mockSetAvailabilityHandler = jest
        .spyOn(service, 'setAvailabilityHandler')
        .mockImplementation(content => content);
      const mockSetPassengersHandler = jest
        .spyOn(service, 'setPassengersHandler')
        .mockImplementation(content => content);

      return { service, mockGetPlaneFeatures, mockSetAvailabilityHandler, mockSetPassengersHandler };
    }

    it.each([
      [
        'should return empty content, exits, bulks, default params if no decks supplied',
        {
          planeFeatures: {
            seatDetails: {
              decks: [],
            },
          },
          expectedResponse: {
            content: [],
            params: createParams({
              scaledTotalDecksHeight: '100%',
              separateDeckHeights: [],
              totalDecksHeight: 0,
            }),
            exits: [],
            bulks: [],
          },
        },
      ],
      [
        'should return empty object if no response from API',
        {
          planeFeatures: null,
          expectedResponse: {},
        },
      ],
      [
        'should add audioVideo to rows if present in API data',
        {
          planeFeatures: {
            seatDetails: {
              decks: [createSeatDetailsDeck()],
            },
            E: {
              cabin: {},
              entertainment: {
                exists: true,
                summary: 'mockEntertainment',
              },
            },
          },
          expectedResponse: createExpectedResponse({
            content: [
              createPreparedDeck({
                rows: [
                  createPreparedRow({
                    seats: [
                      createPreparedSeat({
                        features: [
                          createIconObject({
                            key: 'audioVideo',
                            iconLookup: SEAT_FEATURES_ICONS,
                            value: 'mockEntertainment',
                          }),
                        ],
                      }),
                      createPreparedAisle(),
                    ],
                  }),
                ],
              }),
            ],
          }),
        },
      ],
      [
        'should add power to rows if present in API data',
        {
          planeFeatures: {
            seatDetails: {
              decks: [createSeatDetailsDeck()],
            },
            E: {
              cabin: {},
              power: {
                exists: true,
                summary: 'mockPower',
              },
            },
          },
          expectedResponse: createExpectedResponse({
            content: [
              createPreparedDeck({
                rows: [
                  createPreparedRow({
                    seats: [
                      createPreparedSeat({
                        features: [
                          createIconObject({
                            key: 'power',
                            iconLookup: SEAT_FEATURES_ICONS,
                            value: 'mockPower',
                          }),
                        ],
                      }),
                      createPreparedAisle(),
                    ],
                  }),
                ],
              }),
            ],
          }),
        },
      ],
      [
        'should add wifi to rows if present in API data',
        {
          planeFeatures: {
            seatDetails: {
              decks: [createSeatDetailsDeck()],
            },
            E: {
              cabin: {},
              wifi: {
                exists: true,
                summary: 'mockWifi',
              },
            },
          },
          expectedResponse: createExpectedResponse({
            content: [
              createPreparedDeck({
                rows: [
                  createPreparedRow({
                    seats: [
                      createPreparedSeat({
                        features: [
                          createIconObject({
                            key: 'wifi',
                            iconLookup: SEAT_FEATURES_ICONS,
                            value: 'mockWifi',
                            title: 'wifi',
                          }),
                        ],
                      }),
                      createPreparedAisle(),
                    ],
                  }),
                ],
              }),
            ],
          }),
        },
      ],
      [
        'should add audioVideo, power, & wifi only to rows in correct cabin class',
        {
          planeFeatures: {
            seatDetails: {
              decks: [
                createSeatDetailsDeck({
                  rows: [
                    createSeatDetailsRow(),
                    createSeatDetailsRow({
                      classCode: 'B',
                    }),
                  ],
                }),
              ],
            },
            B: {
              cabin: {},
              entertainment: {
                exists: true,
                summary: 'mockEntertainment',
              },
              power: {
                exists: true,
                summary: 'mockPower',
              },
              wifi: {
                exists: true,
                summary: 'mockWifi',
              },
            },
          },
          expectedResponse: createExpectedResponse({
            content: [
              createPreparedDeck({
                rows: [
                  createPreparedRow({
                    seats: [createPreparedSeat(), createPreparedAisle()],
                  }),
                  createPreparedRow({
                    classCode: 'B',
                    seats: [
                      createPreparedSeat({
                        classCode: 'B',
                        classType: 'Business',
                        features: [
                          createIconObject({
                            key: 'audioVideo',
                            iconLookup: SEAT_FEATURES_ICONS,
                            value: 'mockEntertainment',
                          }),
                          createIconObject({
                            key: 'power',
                            iconLookup: SEAT_FEATURES_ICONS,
                            value: 'mockPower',
                          }),
                          createIconObject({
                            key: 'wifi',
                            iconLookup: SEAT_FEATURES_ICONS,
                            value: 'mockWifi',
                            title: 'wifi',
                          }),
                        ],
                        seatType: 'B-0',
                      }),
                      createPreparedAisle(),
                    ],
                  }),
                ],
              }),
            ],
          }),
        },
      ],
      [
        'should correctly populate seats across multiple decks',
        {
          planeFeatures: {
            seatDetails: {
              decks: [
                createSeatDetailsDeck(),
                createSeatDetailsDeck({
                  rows: [
                    createSeatDetailsRow({
                      classCode: 'B',
                      number: 2,
                    }),
                  ],
                }),
              ],
            },
          },
          expectedResponse: createExpectedResponse({
            bulks: [[], []],
            content: [
              createPreparedDeck({
                height: DEFAULT_DECK_TITLE_HEIGHT + DEFAULT_INDEX_ROW_HEIGHT + DEFAULT_SEAT_DIMENSIONS.height,
                rows: [
                  createPreparedRow({
                    topOffset: DEFAULT_DECK_TITLE_HEIGHT + DEFAULT_INDEX_ROW_HEIGHT + DEFAULT_TOP_OFFSET,
                  }),
                ],
              }),
              createPreparedDeck({
                height: DEFAULT_DECK_TITLE_HEIGHT + DEFAULT_INDEX_ROW_HEIGHT + DEFAULT_SEAT_DIMENSIONS.height,
                number: 2,
                rows: [
                  createPreparedRow({
                    topOffset: DEFAULT_DECK_TITLE_HEIGHT + DEFAULT_INDEX_ROW_HEIGHT + DEFAULT_TOP_OFFSET,
                    classCode: 'B',
                    number: 2,
                    seats: [
                      createPreparedSeat({
                        classCode: 'B',
                        classType: 'Business',
                        number: '2A',
                        seatType: 'B-0',
                      }),
                      createPreparedAisle({
                        letter: 2,
                      }),
                    ],
                  }),
                ],
              }),
            ],
            exits: [[], []],
            params: createParams({
              scaledTotalDecksHeight: `${
                (DEFAULT_DECK_TITLE_HEIGHT + DEFAULT_INDEX_ROW_HEIGHT + DEFAULT_SEAT_DIMENSIONS.height) * 2
              }px`,
              separateDeckHeights: [
                DEFAULT_DECK_TITLE_HEIGHT + DEFAULT_INDEX_ROW_HEIGHT + DEFAULT_SEAT_DIMENSIONS.height,
                DEFAULT_DECK_TITLE_HEIGHT + DEFAULT_INDEX_ROW_HEIGHT + DEFAULT_SEAT_DIMENSIONS.height,
              ],
              totalDecksHeight:
                (DEFAULT_DECK_TITLE_HEIGHT + DEFAULT_INDEX_ROW_HEIGHT + DEFAULT_SEAT_DIMENSIONS.height) * 2,
            }),
          }),
        },
      ],
      [
        'should use first rows topOffset as basis for minimum topOffset applied to all rows if smaller than bulks & exits',
        {
          planeFeatures: {
            seatDetails: {
              decks: [
                createSeatDetailsDeck({
                  rows: [
                    createSeatDetailsRow({
                      topOffset: CUSTOM_ROW_TOP_OFFSET,
                      seats: [createSeatDetailsSeat({ topOffset: CUSTOM_SEAT_TOP_OFFSET })],
                    }),
                  ],
                }),
              ],
            },
          },
          expectedResponse: createExpectedResponse({
            content: [
              createPreparedDeck({
                height:
                  DEFAULT_SEAT_DIMENSIONS.height +
                  DEFAULT_INDEX_ROW_HEIGHT +
                  CUSTOM_ROW_TOP_OFFSET +
                  CUSTOM_SEAT_TOP_OFFSET,
                rows: [
                  createPreparedRow({
                    seats: [
                      createPreparedSeat({
                        topOffset: CUSTOM_SEAT_TOP_OFFSET,
                      }),
                      createPreparedAisle(),
                    ],
                    topOffset: DEFAULT_INDEX_ROW_HEIGHT + CUSTOM_ROW_TOP_OFFSET,
                  }),
                ],
                width:
                  DEFAULT_SEAT_DIMENSIONS.width * 2 + DEFAULT_DECK_PADDING_SIZE * 2 + THEME_FUSELAGE_OUTLINE_WIDTH * 2,
              }),
            ],
            params: createParams({
              scaledTotalDecksHeight: `${
                DEFAULT_INDEX_ROW_HEIGHT +
                CUSTOM_ROW_TOP_OFFSET +
                DEFAULT_SEAT_DIMENSIONS.height +
                CUSTOM_SEAT_TOP_OFFSET
              }px`,
              separateDeckHeights: [
                DEFAULT_INDEX_ROW_HEIGHT +
                  CUSTOM_ROW_TOP_OFFSET +
                  DEFAULT_SEAT_DIMENSIONS.height +
                  CUSTOM_SEAT_TOP_OFFSET,
              ],
              totalDecksHeight:
                DEFAULT_INDEX_ROW_HEIGHT +
                CUSTOM_ROW_TOP_OFFSET +
                DEFAULT_SEAT_DIMENSIONS.height +
                CUSTOM_SEAT_TOP_OFFSET,
            }),
          }),
        },
      ],
      [
        'should use bulks topOffset as basis for minimum topOffset applied to all rows if smaller than exits & rows',
        {
          planeFeatures: {
            seatDetails: {
              decks: [
                createSeatDetailsDeck({
                  rows: [
                    createSeatDetailsRow({
                      topOffset: CUSTOM_LARGE_TOP_OFFSET,
                      seats: [createSeatDetailsSeat({ topOffset: CUSTOM_LARGE_TOP_OFFSET })],
                    }),
                  ],
                  bulks: [
                    {
                      topOffset: CUSTOM_BULK_TOP_OFFSET,
                    },
                  ],
                  exits: [
                    {
                      topOffset: CUSTOM_LARGE_TOP_OFFSET,
                    },
                  ],
                }),
              ],
            },
          },
          expectedResponse: createExpectedResponse({
            bulks: [
              [
                {
                  topOffset: DEFAULT_INDEX_ROW_HEIGHT + CUSTOM_BULK_TOP_OFFSET,
                  uniqId: MOCK_UNIQUE_ID,
                },
              ],
            ],
            content: [
              createPreparedDeck({
                height:
                  DEFAULT_SEAT_DIMENSIONS.height +
                  DEFAULT_INDEX_ROW_HEIGHT +
                  CUSTOM_LARGE_TOP_OFFSET +
                  CUSTOM_LARGE_TOP_OFFSET,
                rows: [
                  createPreparedRow({
                    seats: [
                      createPreparedSeat({
                        topOffset: CUSTOM_LARGE_TOP_OFFSET,
                      }),
                      createPreparedAisle(),
                    ],
                    topOffset: DEFAULT_INDEX_ROW_HEIGHT + CUSTOM_LARGE_TOP_OFFSET,
                  }),
                ],
                width:
                  DEFAULT_SEAT_DIMENSIONS.width * 2 + DEFAULT_DECK_PADDING_SIZE * 2 + THEME_FUSELAGE_OUTLINE_WIDTH * 2,
              }),
            ],
            exits: [
              [
                {
                  topOffset: DEFAULT_INDEX_ROW_HEIGHT + CUSTOM_LARGE_TOP_OFFSET,
                  uniqId: MOCK_UNIQUE_ID,
                },
              ],
            ],
            params: createParams({
              scaledTotalDecksHeight: `${
                DEFAULT_INDEX_ROW_HEIGHT +
                CUSTOM_LARGE_TOP_OFFSET +
                DEFAULT_SEAT_DIMENSIONS.height +
                CUSTOM_LARGE_TOP_OFFSET
              }px`,
              separateDeckHeights: [
                DEFAULT_INDEX_ROW_HEIGHT +
                  CUSTOM_LARGE_TOP_OFFSET +
                  DEFAULT_SEAT_DIMENSIONS.height +
                  CUSTOM_LARGE_TOP_OFFSET,
              ],
              totalDecksHeight:
                DEFAULT_INDEX_ROW_HEIGHT +
                CUSTOM_LARGE_TOP_OFFSET +
                DEFAULT_SEAT_DIMENSIONS.height +
                CUSTOM_LARGE_TOP_OFFSET,
            }),
          }),
        },
      ],
      [
        'should use exits topOffset as basis for minimum topOffset applied to all rows if smaller than bulks & rows',
        {
          planeFeatures: {
            seatDetails: {
              decks: [
                createSeatDetailsDeck({
                  rows: [
                    createSeatDetailsRow({
                      topOffset: CUSTOM_LARGE_TOP_OFFSET,
                      seats: [createSeatDetailsSeat({ topOffset: CUSTOM_LARGE_TOP_OFFSET })],
                    }),
                  ],
                  bulks: [
                    {
                      topOffset: CUSTOM_LARGE_TOP_OFFSET,
                    },
                  ],
                  exits: [
                    {
                      topOffset: CUSTOM_EXIT_TOP_OFFSET,
                    },
                  ],
                }),
              ],
            },
          },
          expectedResponse: createExpectedResponse({
            bulks: [
              [
                {
                  topOffset: DEFAULT_INDEX_ROW_HEIGHT + CUSTOM_LARGE_TOP_OFFSET,
                  uniqId: MOCK_UNIQUE_ID,
                },
              ],
            ],

            content: [
              createPreparedDeck({
                height:
                  DEFAULT_SEAT_DIMENSIONS.height +
                  DEFAULT_INDEX_ROW_HEIGHT +
                  CUSTOM_LARGE_TOP_OFFSET +
                  CUSTOM_LARGE_TOP_OFFSET,
                rows: [
                  createPreparedRow({
                    seats: [
                      createPreparedSeat({
                        topOffset: CUSTOM_LARGE_TOP_OFFSET,
                      }),
                      createPreparedAisle(),
                    ],
                    topOffset: DEFAULT_INDEX_ROW_HEIGHT + CUSTOM_LARGE_TOP_OFFSET,
                  }),
                ],
                width:
                  DEFAULT_SEAT_DIMENSIONS.width * 2 + DEFAULT_DECK_PADDING_SIZE * 2 + THEME_FUSELAGE_OUTLINE_WIDTH * 2,
              }),
            ],
            exits: [
              [
                {
                  topOffset: DEFAULT_INDEX_ROW_HEIGHT + CUSTOM_EXIT_TOP_OFFSET,
                  uniqId: MOCK_UNIQUE_ID,
                },
              ],
            ],
            params: createParams({
              scaledTotalDecksHeight: `${
                DEFAULT_INDEX_ROW_HEIGHT +
                CUSTOM_LARGE_TOP_OFFSET +
                DEFAULT_SEAT_DIMENSIONS.height +
                CUSTOM_LARGE_TOP_OFFSET
              }px`,
              separateDeckHeights: [
                DEFAULT_INDEX_ROW_HEIGHT +
                  CUSTOM_LARGE_TOP_OFFSET +
                  DEFAULT_SEAT_DIMENSIONS.height +
                  CUSTOM_LARGE_TOP_OFFSET,
              ],
              totalDecksHeight:
                DEFAULT_INDEX_ROW_HEIGHT +
                CUSTOM_LARGE_TOP_OFFSET +
                DEFAULT_SEAT_DIMENSIONS.height +
                CUSTOM_LARGE_TOP_OFFSET,
            }),
          }),
        },
      ],
    ])(
      '%s',
      async (
        _,
        {
          config = {
            lang: 'EN',
            units: 'metric',
          },
          planeFeatures,
          expectedResponse,
        }
      ) => {
        const { service, mockGetPlaneFeatures, mockSetAvailabilityHandler, mockSetPassengersHandler } =
          initServiceAndMocks(planeFeatures);

        const flight = {
          name: 'mockFlight',
        };
        const availability = null;
        const passengers = null;
        const response = await service.getSeatMapData(flight, availability, passengers, config);

        expect(response).toEqual({
          content: expectedResponse.content,
          bulks: expectedResponse.bulks,
          exits: expectedResponse.exits,
          params: expectedResponse.params,
          availabilityData: planeFeatures?.availabilityData,
        });

        expect(mockGetPlaneFeatures).toHaveBeenCalledTimes(1);
        expect(mockGetPlaneFeatures).toHaveBeenCalledWith(flight, config.lang, config.units);
        expect(mockSetAvailabilityHandler).not.toHaveBeenCalled();
        expect(mockSetPassengersHandler).not.toHaveBeenCalled();
      }
    );

    it('should call setAvailabilityHandler with content if availability present', async () => {
      const planeFeatures = {
        seatDetails: {
          decks: [createSeatDetailsDeck()],
        },
      };

      const { service, mockSetAvailabilityHandler } = initServiceAndMocks(planeFeatures);

      const flight = {
        name: 'mockFlight',
      };
      const availability = {
        name: 'mockAvailability',
      };
      const passengers = null;
      const config = {
        lang: 'EN',
        units: 'metric',
      };
      const response = await service.getSeatMapData(flight, availability, passengers, config);

      const expectedResponse = createExpectedResponse({
        content: [createPreparedDeck()],
      });

      expect(response).toEqual(expectedResponse);

      expect(mockSetAvailabilityHandler).toHaveBeenCalledTimes(1);
      expect(mockSetAvailabilityHandler).toHaveBeenCalledWith(expectedResponse.content, availability);
    });

    it('should call setPassengersHandler with content if passengers present', async () => {
      const planeFeatures = {
        seatDetails: {
          decks: [createSeatDetailsDeck()],
        },
      };

      const { service, mockSetPassengersHandler } = initServiceAndMocks(planeFeatures);

      const flight = {
        name: 'mockFlight',
      };
      const availability = null;
      const passengers = [createPassenger('33A')];
      const config = {
        lang: 'EN',
        units: 'metric',
      };
      const response = await service.getSeatMapData(flight, availability, passengers, config);

      const expectedResponse = createExpectedResponse({
        content: [createPreparedDeck()],
      });

      expect(response).toEqual(expectedResponse);

      expect(mockSetPassengersHandler).toHaveBeenCalledTimes(1);
      expect(mockSetPassengersHandler).toHaveBeenCalledWith(expectedResponse.content, passengers);
    });

    describe('should support adding all seat types', () => {
      it.each(ALL_SEAT_SIZES_BY_TYPE)(
        'should allow adding seats with seatType %s',
        async ({ seatType, width, height }) => {
          const planeFeatures = {
            seatDetails: {
              decks: [
                createSeatDetailsDeck({
                  rows: [
                    createSeatDetailsRow({
                      seatType: seatType,
                    }),
                  ],
                }),
              ],
            },
          };
          const { service } = initServiceAndMocks(planeFeatures);

          const flight = {
            name: 'mockFlight',
          };
          const availability = null;
          const passengers = null;
          const config = {
            lang: 'EN',
            units: 'metric',
          };
          const response = await service.getSeatMapData(flight, availability, passengers, config);

          const expectedContent = [
            createPreparedDeck({
              height: DEFAULT_INDEX_ROW_HEIGHT + height,
              rows: [
                createPreparedRow({
                  cabinHeight: height,
                  height: height,
                  seatType: seatType,
                  seats: [
                    createPreparedSeat({
                      seatIconType: seatType,
                      seatType: `E-${seatType}`,
                      size: {
                        height: height,
                        width: width,
                      },
                    }),
                    createPreparedAisle({
                      size: {
                        height: height,
                        width: width,
                      },
                    }),
                  ],
                  width: width * 2,
                }),
              ],
              width: width * 2 + DEFAULT_DECK_PADDING_SIZE * 2 + THEME_FUSELAGE_OUTLINE_WIDTH * 2,
            }),
          ];

          expect(response.content).toEqual(expectedContent);
        }
      );
    });

    describe('should support adding all seat features with localised text', () => {
      it.each(SEAT_FEATURES_WITH_LOCALES)(
        'should support adding seats with feature %s',
        async ({ lang, localeMap, feature }) => {
          const planeFeatures = {
            seatDetails: {
              decks: [
                createSeatDetailsDeck({
                  rows: [
                    createSeatDetailsRow({
                      seats: [
                        createSeatDetailsSeat({
                          features: {
                            [feature]: 'mockFeature',
                          },
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            },
          };
          const { service } = initServiceAndMocks(planeFeatures);

          const flight = {
            name: 'mockFlight',
          };
          const availability = null;
          const passengers = null;
          const config = {
            lang: lang,
            units: 'metric',
          };
          const response = await service.getSeatMapData(flight, availability, passengers, config);

          const expectedRecline = ['doNotRecline', 'limitedRecline', 'prereclinedSeat'].includes(feature)
            ? '- -'
            : undefined;
          const expectedContent = [
            createPreparedDeck({
              rows: [
                createPreparedRow({
                  seats: [
                    createPreparedSeat({
                      features: [
                        createIconObject({
                          key: feature,
                          iconLookup: SEAT_FEATURES_ICONS,
                          title: localeMap[feature],
                          value: 'mockFeature',
                        }),
                      ],
                      measurements: [
                        createIconObject({
                          key: 'pitch',
                          iconLookup: SEAT_MEASUREMENTS_ICONS,
                          title: localeMap['pitch'],
                        }),
                        createIconObject({
                          key: 'width',
                          iconLookup: SEAT_MEASUREMENTS_ICONS,
                          title: localeMap['width'],
                        }),
                        createIconObject({
                          key: 'recline',
                          iconLookup: SEAT_MEASUREMENTS_ICONS,
                          title: localeMap['recline'],
                          value: expectedRecline,
                        }),
                      ],
                    }),
                    createPreparedAisle(),
                  ],
                }),
              ],
            }),
          ];

          expect(response.content).toEqual(expectedContent);
        }
      );
    });
  });
});
