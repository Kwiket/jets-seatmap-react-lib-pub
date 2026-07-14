import React from 'react';
import { JetsSeatMap } from '../SeatMap';
import { CONFIG_MOCK, PASSENGERS_MOCK } from './constants';

// Auto-loading demo with WCAG turned on. Creds come from the Storybook env
// (STORYBOOK_JETS_* injected by the launch script) so no secrets live here.
const config = {
  ...CONFIG_MOCK,
  width: 400,
  apiUrl: process.env.STORYBOOK_JETS_BASE_API_URL,
  apiAppId: process.env.STORYBOOK_JETS_APP_ID,
  apiKey: process.env.STORYBOOK_JETS_PRIVATE_KEY,
  wcag: { enabled: true },
};

const flight = {
  id: '1111',
  airlineCode: 'EK',
  flightNo: '2',
  departureDate: '2026-12-19',
  departure: 'LHR',
  arrival: 'DXB',
  cabinClass: 'A',
  passengerType: 'ADT',
};

export default {
  title: 'WCAG Demo',
  component: JetsSeatMap,
};

export const KeyboardEnabled = () => (
  // The map is placed in a fixed-height scroll container (like a real host
  // page would), so keyboard navigation scrolls WITHIN this frame instead of
  // scrolling the whole page.
  <div style={{ padding: 24 }}>
    <div style={{ height: '80vh', overflow: 'auto', border: '1px solid #d0d0d0', display: 'inline-block' }}>
      <JetsSeatMap flight={flight} config={config} passengers={PASSENGERS_MOCK} />
    </div>
  </div>
);
