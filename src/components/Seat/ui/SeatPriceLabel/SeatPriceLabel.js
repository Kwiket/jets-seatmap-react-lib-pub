import React from 'react';

import './SeatPriceLabel.css';

const CURRENCY_FALLBACK_PLACEHOLDER = '*';

export const SeatPriceLabel = ({ priceValue, currency, maxWidth }) => {
  const fullPrice = `${currency}${priceValue}`;
  const currencySymbol = currency?.toString().charAt(0) || CURRENCY_FALLBACK_PLACEHOLDER;

  return (
    <div className="jets-seat-price" title={fullPrice} style={{ maxWidth }}>
      <strong className="currency">{currencySymbol}</strong>
      <span className="priceValue">{priceValue}</span>
    </div>
  );
};
