import { render } from '@testing-library/react';

import { MockJetsContextProvider } from '../../__mocks__/MockJetsContext';

import { JetsTooltipGlobal } from './index';
import { activeTooltipData } from './__fixtures__';

let axe, toHaveNoViolations;
try {
  // eslint-disable-next-line global-require
  ({ axe, toHaveNoViolations } = require('jest-axe'));
} catch (e) {
  // jest-axe not installed in this environment — the suite skips.
}
const describeAxe = axe ? describe : describe.skip;
if (toHaveNoViolations) expect.extend({ toHaveNoViolations });

const setup = ({ data = {}, config = {}, params = {}, events = {}, wcagFlags } = {}) => ({
  ...render(
    <MockJetsContextProvider config={config} params={params} events={events} wcagFlags={wcagFlags}>
      <JetsTooltipGlobal data={{ ...activeTooltipData(data) }} />
    </MockJetsContextProvider>
  ),
});

describeAxe('JetsTooltipGlobal axe a11y', () => {
  it('renders the default (non-dialog) tooltip with no axe violations', async () => {
    const { container } = setup();

    const results = await axe(container, { rules: { 'color-contrast': { enabled: false } } });
    expect(results).toHaveNoViolations();
  });

  it('renders the tooltip as a dialog with no axe violations when wcagFlags.tooltipDialog is on', async () => {
    const { container } = setup({ wcagFlags: { tooltipDialog: true } });

    const results = await axe(container, { rules: { 'color-contrast': { enabled: false } } });
    expect(results).toHaveNoViolations();
  });

  it('renders the tooltip with a visible restriction reason and no axe violations', async () => {
    const { container } = setup({
      wcagFlags: { tooltipDialog: true, visibleRestrictionReason: true },
      events: { isSeatSelectDisabled: () => true, getSelectDisabledReason: () => 'No passenger available to select' },
    });

    const results = await axe(container, { rules: { 'color-contrast': { enabled: false } } });
    expect(results).toHaveNoViolations();
  });
});
