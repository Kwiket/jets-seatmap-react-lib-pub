import React from 'react';
import './index.css';

const CURRENCY_FALLBACK_PLACEHOLDER = '*';

export const SeatPriceLabel = ({ cost, currency, maxWidth }) => {
  const fullPrice = `${currency}${cost}`;
  const currencySymbol = currency?.toString().charAt(0) || CURRENCY_FALLBACK_PLACEHOLDER;

  return (
    <div className="jets-seat-price" title={fullPrice} style={{ maxWidth }}>
      <strong className="currency">{currencySymbol}</strong>
      <span className="cost">{cost}</span>
    </div>
  );
};
