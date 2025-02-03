import React, { createContext } from 'react';
import { CONFIG_MOCK } from '../components/Demo/constants';
import { JetsDataHelper } from '../common/data-helper';

jest.mock('../common', () => ({
  ...jest.requireActual('../common'),
  JetsContext: MockJetsContext,
}));

const MockJetsContext = createContext();

const MockJetsContextProvider = ({ children, componentOverrides = {}, config = {}, params = {}, events = {} }) => {
  const mergedConfig = { ...CONFIG_MOCK, ...config };
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
          tooltipOnHover: !!mergedConfig.tooltipOnHover,
          builtInTooltip: !!mergedConfig.builtInTooltip,
          externalPassengerManagement: !!mergedConfig.externalPassengerManagement,
          builtInDeckSelector: !!mergedConfig.builtInDeckSelector,
          singleDeckMode: !!mergedConfig.singleDeckMode,
          visibleFuselage: !!mergedConfig.visibleFuselage,
          visibleWings: !!mergedConfig.visibleWings,
          visibleCabinTitles: !!mergedConfig.visibleCabinTitles,
          hiddenSeatFeatures: !!mergedConfig.hiddenSeatFeatures,
          ...params,
        },
        onSeatClick: jest.fn(),
        onSeatSelect: jest.fn(),
        onSeatUnselect: jest.fn(),
        onTooltipClose: jest.fn(),
        resetSeatJumpTo: jest.fn(),
        seatLabelJumpTo: jest.fn(),
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
