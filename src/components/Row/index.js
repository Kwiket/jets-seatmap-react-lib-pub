import React, { useContext, useRef } from 'react';
import { JetsContext } from '../../common';
import { JetsSeat } from '../Seat';
import './index.css';

export const JetsRow = ({ seats, top, rowIndex }) => {
  const elementRef = useRef(null);
  const { componentOverrides, wcagFlags } = useContext(JetsContext);
  const gridOn = !!wcagFlags?.gridSemantics;

  const ResolvedJetsSeat = componentOverrides?.JetsSeat ?? JetsSeat;
  const rowAttrs = gridOn ? { role: 'row', ...(rowIndex != null ? { 'aria-rowindex': rowIndex } : {}) } : {};

  return (
    <div className="jets-row" style={{ top }} ref={elementRef} {...rowAttrs}>
      {seats?.map((seat, i) => (
        <ResolvedJetsSeat key={seat.uniqId} data={seat} colIndex={i + 1} rowIndex={rowIndex} rowSeats={seats} />
      ))}
    </div>
  );
};
