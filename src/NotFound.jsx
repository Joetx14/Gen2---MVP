// src/components/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={{
      textAlign: 'center',
      padding: '3rem 1rem',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      <h1>Page Not Found</h1>
      <p>We couldn't find the page you were looking for.</p>
      <p>
        <Link to="/" style={{
          color: 'var(--color-brand-blue-medium)',
          textDecoration: 'underline'
        }}>
          Return to Home
        </Link>
      </p>
    </div>
  );
};

export default NotFound;
