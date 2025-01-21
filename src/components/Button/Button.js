import React from 'react';
import './Button.css';

export const JetsButton = ({ content, onClick, className, disabled, active, ...attrs }) => {
  return (
    <button {...attrs} className={className} onClick={onClick} disabled={disabled}>
      {content}
    </button>
  );
};

JetsButton.defaultProps = {
  content: 'Btn',
  className: 'jets-btn',
  disabled: false,
  active: false,
  onClick: () => {},
};
