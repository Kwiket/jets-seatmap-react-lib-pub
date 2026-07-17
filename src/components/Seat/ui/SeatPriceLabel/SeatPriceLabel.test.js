import { render, screen } from '@testing-library/react';

import { SeatPriceLabel } from './SeatPriceLabel';

describe('SeatPriceLabel', () => {
  it('keeps the native title tooltip by default (non-WCAG behaviour unchanged)', () => {
    render(<SeatPriceLabel priceValue={12} currency="€" maxWidth={40} />);

    const label = screen.getByText('12').closest('.jets-seat-price');
    expect(label).toHaveAttribute('title', '€12');
    expect(label).not.toHaveAttribute('aria-hidden');
  });

  it('drops the title and hides the label from assistive tech under WCAG', () => {
    // The seat button already carries the full price in its aria-label, so the
    // visual label must not add an inaccessible title tooltip.
    render(<SeatPriceLabel priceValue={12} currency="€" maxWidth={40} wcag />);

    const label = screen.getByText('12').closest('.jets-seat-price');
    expect(label).not.toHaveAttribute('title');
    expect(label).toHaveAttribute('aria-hidden', 'true');
  });
});
