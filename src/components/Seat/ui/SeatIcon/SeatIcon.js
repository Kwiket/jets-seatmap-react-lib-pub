import React from 'react';
import DOMPurify from 'dompurify';

import { seatTemplateService } from '../../service';

export const SeatIcon = ({ seatType, style }) => {
  const sanitizedSeatIcon = DOMPurify.sanitize(seatTemplateService.getSeatIcon(seatType, style));
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
