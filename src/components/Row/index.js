import React, { useContext, useRef } from 'react';
import { JetsContext } from '../../common';
import { JetsSeat } from '../Seat';
import './index.css';

export const JetsRow = ({ seats, top }) => {
  const elementRef = useRef(null);
  const { componentOverrides } = useContext(JetsContext);

  const ResolvedJetsSeat = componentOverrides?.JetsSeat ?? JetsSeat;
  return (
    <div className="jets-row" style={{ top }} ref={elementRef}>
      {seats?.map(seat => (
        <ResolvedJetsSeat key={seat.uniqId} data={seat} />
      ))}
    </div>
  );
};
