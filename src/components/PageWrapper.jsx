// src/components/PageWrapper.js
import React from 'react';
import '../styles/PageWrapper.css';

const PageWrapper = ({ children, className = '', ...props }) => {
  return (
    <div className={`page-wrapper ${className}`} {...props}>
      <div className="page-content">
        {children}
      </div>
    </div>
  );
};

export default PageWrapper;
