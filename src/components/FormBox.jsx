import React from 'react';
import '../styles/FormBox.css';

const FormBox = ({ children, className = '' }) => {
  // TEMPORARY: Removed all mobile container logic
  // Just return the basic form box regardless of screen size
  const formBoxClasses = `form-box ${className}`.trim();
  
  return (
    <div className={formBoxClasses}>
      {children}
    </div>
  );
};

export default FormBox;
