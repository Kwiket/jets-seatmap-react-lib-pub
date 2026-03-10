import React from 'react';
import './Button.css';

export const JetsButton = ({
  content = 'Btn',
  onClick = () => {},
  className = 'jets-btn',
  disabled = false,
  active = false,
  ...attrs
}) => {
  return (
    <button {...attrs} className={className} onClick={onClick} disabled={disabled}>
      {content}
    </button>
  );
};
