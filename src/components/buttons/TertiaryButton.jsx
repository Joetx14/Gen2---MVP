// Clean TertiaryButton – no arrow, no extra markup
import React from 'react';
import '../styles/TertiaryButton.css';

export default function TertiaryButton({ children, className, ...props }) {
  return (
    <button 
      className={`tertiary-button ${className || ""}`} 
      {...props}
    >
      {children}
    </button>
  );
}
