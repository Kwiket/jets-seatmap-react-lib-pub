import React, { createContext } from 'react';

import { configData, paramsData } from '../__fixtures__';
import { CONFIG_MOCK } from '../components/Demo/constants';
import { JetsDataHelper } from '../common/data-helper';

jest.mock('../common', () => ({
  ...jest.requireActual('../common'),
  JetsContext: MockJetsContext,
}));

const MockJetsContext = createContext();

const MockJetsContextProvider = ({ children, componentOverrides = {}, config = {}, params = {}, events = {} }) => {
  const mergedConfig = configData(config);
  const colorTheme = JetsDataHelper.mergeColorThemeWithConstraints(CONFIG_MOCK.colorTheme, config.colorTheme || {});
  mergedConfig.colorTheme = colorTheme;
  mergedConfig.lang = JetsDataHelper.validateLanguage(mergedConfig.lang);

  return (
    <MockJetsContext.Provider
      value={{
        config: mergedConfig,
        colorTheme: mergedConfig.colorTheme,
        componentOverrides,
        isSeatSelectDisabled: () => false,
        params: {
          ...paramsData(params),
          // config should take precedent over passed param data
          builtInTooltip: !!mergedConfig.builtInTooltip,
          builtInDeckSelector: !!mergedConfig.builtInDeckSelector,
          builtInTooltip: !!mergedConfig.builtInTooltip,
          externalPassengerManagement: !!mergedConfig.externalPassengerManagement,
          hiddenSeatFeatures: mergedConfig.hiddenSeatFeatures || [],
          isHorizontal: !!mergedConfig.horizontal,
          rightToLeft: !!mergedConfig.rightToLeft,
          singleDeckMode: !!mergedConfig.singleDeckMode,
          tooltipOnHover: !!mergedConfig.tooltipOnHover,
          visibleCabinTitles: !!mergedConfig.visibleCabinTitles,
          visibleFuselage: !!mergedConfig.visibleFuselage,
          visibleWings: !!mergedConfig.visibleWings,
        },
        seatLabelJumpTo: null,
        onSeatClick: jest.fn(),
        onSeatSelect: jest.fn(),
        onSeatUnselect: jest.fn(),
        onTooltipClose: jest.fn(),
        resetSeatJumpTo: jest.fn(),
        showTooltip: jest.fn(),
        switchDeck: jest.fn(),
        ...events,
      }}
    >
      {children}
    </MockJetsContext.Provider>
  );
};

export { MockJetsContext, MockJetsContextProvider };
