import React, { useContext } from 'react';
import DOMPurify from 'dompurify';

import { seatTemplateService } from '../../service';
import { JetsContext } from '../../../../common';

export const SeatIcon = ({ seatType, style }) => {
  const { extraSeatTypeTemplates } = useContext(JetsContext);
  const sanitizedSeatIcon = DOMPurify.sanitize(
    seatTemplateService.getSeatIcon(seatType, style, extraSeatTypeTemplates)
  );

  return (
    <div
      className="jets-seat-svg"
      dangerouslySetInnerHTML={{
        __html: sanitizedSeatIcon,
      }}
    />
  );
};

export default SeatIcon;
