import React from 'react';

import './SeatPriceLabel.css';

const CURRENCY_FALLBACK_PLACEHOLDER = '*';

export const SeatPriceLabel = ({ priceValue, currency, maxWidth, wcag = false }) => {
  const fullPrice = `${currency}${priceValue}`;
  const currencySymbol = currency?.toString().charAt(0) || CURRENCY_FALLBACK_PLACEHOLDER;

  // A native `title` renders an inaccessible tooltip: it is not reachable by
  // keyboard or touch and its screen-reader support is inconsistent
  // (a11yproject "Remove title attribute tooltips"). Under WCAG grid semantics
  // the seat button's aria-label already carries the full price, so this label
  // is a purely visual duplicate — drop the tooltip and hide it from assistive
  // tech. Without WCAG the original title is kept so default behaviour is
  // unchanged.
  const a11yProps = wcag ? { 'aria-hidden': 'true' } : { title: fullPrice };

  return (
    <div className="jets-seat-price" style={{ maxWidth }} {...a11yProps}>
      <strong className="currency">{currencySymbol}</strong>
      <span className="priceValue">{priceValue}</span>
    </div>
  );
};
