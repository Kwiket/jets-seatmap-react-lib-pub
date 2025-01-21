import { render, screen, fireEvent } from '@testing-library/react';
import { JetsButton } from './index';

const setup = ({ content, className, onClick, disabled, attribute }) => {
  render(
    <JetsButton content={content} className={className} onClick={onClick} disabled={disabled} attribute={attribute} />
  );
};

describe('JetsButton', () => {
  it('should render the button content correctly', () => {
    setup({ content: 'Cancel' });
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('should render the button class correctly', () => {
    setup({ content: 'Cancel', className: 'some-class' });
    expect(screen.getByText('Cancel')).toHaveClass('some-class');
  });

  it('should call the onClick function correctly', () => {
    const handleClick = jest.fn();
    setup({ content: 'Cancel', onClick: handleClick });
    fireEvent.click(screen.getByText('Cancel'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should render the button as disabled', () => {
    setup({ content: 'Cancel', disabled: true });
    expect(screen.getByText('Cancel')).toBeDisabled();
  });

  it('should render the button with an extra attribute', () => {
    setup({ content: 'Cancel', attribute: 'an attribute' });
    expect(screen.getByText('Cancel')).toHaveAttribute('attribute', 'an attribute');
  });
});
