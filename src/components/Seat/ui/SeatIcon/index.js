import React, { useContext } from 'react';
import DOMPurify from 'dompurify';

import { seatTemplateService, seatTemplateUtils } from '../../service';
import { JetsContext } from '../../../../common';

export const SeatIcon = ({ seatType, style }) => {
  const { extraSeatTypeTemplates } = useContext(JetsContext);
  const enrichedExtraSeatTypeTemplates = seatTemplateUtils.getEnrichedSeatTemplates(extraSeatTypeTemplates, { style });
  const sanitizedSeatIcon = DOMPurify.sanitize(
    seatTemplateService.getSeatIcon(seatType, style, enrichedExtraSeatTypeTemplates)
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
