import React, { useState } from 'react';
import { JetsButton } from '../Button';
import { JetsSeatMap } from '../SeatMap';
import { FLIGHT_MOCK, AVAILABILITY_MOCK, PASSENGERS_MOCK, CONFIG_MOCK } from './constants';

import './index.css';

export const DemoComponent = () => {
  const getDefaultConfig = () => {
    const baseConfig = { ...CONFIG_MOCK };

    delete baseConfig.apiAppId;
    delete baseConfig.apiKey;
    delete baseConfig.apiUrl;

    return baseConfig;
  };

  const [config, setConfig] = useState(getDefaultConfig());
  const [flight, setFlight] = useState(null);
  const [availability, setAvailability] = useState(null);
  const [passengers, setPassengers] = useState(null);
  const [defaultConfig, setDefaultConfig] = useState(JSON.stringify(getDefaultConfig(), null, 2));
  const [defaultFlight, setDefaultFlight] = useState(JSON.stringify(FLIGHT_MOCK, null, 2));
  const [defaultAvailability, setDefaultAvailability] = useState(JSON.stringify(AVAILABILITY_MOCK, null, 2));
  const [defaultPassengers, setDefaultPassengers] = useState(JSON.stringify(PASSENGERS_MOCK, null, 2));
  const [defaultDeckIndex, setDefaultDeckIndex] = useState(0);
  const [deckIndex, setDeckIndex] = useState(0);
  const [defaultSeatJumpTo, setDefaultSeatJumpTo] = useState(JSON.stringify({ seatLabel: '41A' }));
  const [seatJumpTo, setSeatJumpTo] = useState(null);

  const onSetConfig = () => {
    const incomingConfig = JSON.parse(defaultConfig);
    setConfig({
      ...incomingConfig,
      apiUrl: incomingConfig.apiUrl || process.env.STORYBOOK_JETS_BASE_API_URL,
      apiAppId: incomingConfig.apiAppId || process.env.STORYBOOK_JETS_APP_ID,
      apiKey: incomingConfig.apiKey || process.env.STORYBOOK_JETS_PRIVATE_KEY,
    });
  };

  const onSetFlight = () => {
    setFlight(JSON.parse(defaultFlight));
  };

  const onSetAvailability = () => {
    setAvailability(JSON.parse(defaultAvailability));
  };

  const onSetPassengers = () => {
    setPassengers(JSON.parse(defaultPassengers));
  };

  const onConfigChange = e => {
    setDefaultConfig(e.target.value);
  };

  const onFlightChange = e => {
    setDefaultFlight(e.target.value);
  };

  const onAvailabilityChange = e => {
    setDefaultAvailability(e.target.value);
  };

  const onPassengersChange = e => {
    setDefaultPassengers(e.target.value);
  };

  const onDeckChange = e => {
    setDefaultDeckIndex(e.target.value);
  };

  const onSetDeck = () => {
    setDeckIndex(defaultDeckIndex);
  };

  const onSetDefaultSeatJumpTo = e => {
    setDefaultSeatJumpTo(e.target.value);
  };

  const onSetSeatJumpTo = () => {
    setSeatJumpTo(JSON.parse(defaultSeatJumpTo));
  };

  return (
    <div className="jets-demo">
      <div className="jets-demo--controllers">
        <a href="https://github.com/Kwiket/jets-seatmap-react-lib-pub/blob/version-3/README.md" target="_blank">
          REACT LIB SEATMAP INTEGRATION DOCUMENTATION
        </a>
        <div className="jets-demo--controller">
          <textarea onChange={e => onConfigChange(e)} defaultValue={defaultConfig} />
          <JetsButton className="jets-btn jets-demo--btn" content="1.INIT SEAT MAP" onClick={onSetConfig} />
        </div>
        <div className="jets-demo--controller">
          <textarea onChange={e => onFlightChange(e)} defaultValue={defaultFlight} />
          <JetsButton className="jets-btn jets-demo--btn" content="2.SET FLIGHT" onClick={onSetFlight} />
        </div>
        <div className="jets-demo--controller">
          <textarea onChange={e => onAvailabilityChange(e)} defaultValue={defaultAvailability} />
          <JetsButton className="jets-btn jets-demo--btn" content="3.SET AVAILABILITY" onClick={onSetAvailability} />
        </div>
        <div className="jets-demo--controller">
          <textarea onChange={e => onPassengersChange(e)} defaultValue={defaultPassengers} />
          <JetsButton className="jets-btn jets-demo--btn" content="4.SET PASSENGERS" onClick={onSetPassengers} />
        </div>
        <div className="jets-demo--controller">
          <textarea onChange={e => onDeckChange(e)} defaultValue={0} />
          <JetsButton className="jets-btn jets-demo--btn" content="5.SET DECK" onClick={onSetDeck} />
        </div>
        <div className="jets-demo--controller">
          <textarea onChange={e => onSetDefaultSeatJumpTo(e)} defaultValue={defaultSeatJumpTo} />
          <JetsButton className="jets-btn jets-demo--btn" content="6.SEAT JUMP TO" onClick={onSetSeatJumpTo} />
        </div>
      </div>
      <div className="jets-demo--seat-map">
        <JetsSeatMap
          flight={flight}
          config={config}
          availability={availability}
          passengers={passengers}
          currentDeckIndex={deckIndex}
          seatJumpTo={seatJumpTo}
        />
      </div>
    </div>
  );
};
