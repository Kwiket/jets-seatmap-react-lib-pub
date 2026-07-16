export const preview = {
  parameters: {
    // Land on the auto-loading WCAG demo by default. The "Demo" story is a
    // manual step-by-step integration playground (click 1.INIT → 2.SET FLIGHT …)
    // that intentionally shows nothing until driven, so it is a poor first
    // impression; put the working WCAG map first.
    options: {
      storySort: {
        order: ['WCAG Demo', 'Demo', '*'],
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};
