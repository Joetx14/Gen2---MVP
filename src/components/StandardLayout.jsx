// src/components/StandardLayout.jsx
import React from 'react';
import PageWrapper from './PageWrapper';
import Footer from './Footer';
import '../styles/StandardLayout.css';

const StandardLayout = ({ 
  title, 
  subtitle, 
  subtitlePosition = 'below', // New prop with default 'below'
  children, 
  includeFooter = true,
  className = ''
}) => {
  // Helper function to safely render title
  const renderTitle = () => {
    // If title is a string with spaces, split it
    if (title && typeof title === 'string' && title.includes(' ')) {
      return (
        <>
          <span className="h1b">{title.split(' ')[0]}</span>{' '}
          <span className="h1">{title.split(' ').slice(1).join(' ')}</span>
        </>
      );
    } 
    // Otherwise, just return the title as is
    return title;
  };

  // Check if this is the login page
  const isLoginPage = className.includes('login-page');

  return (
    <PageWrapper className={`standard ${className}`}>
      <div className="standard-content-wrapper">
        <div className="standard-header">
          {/* For login page, render subtitle before title */}
          {isLoginPage && subtitle && (
            <p className="standard-subtitle-text h1sub">{subtitle}</p>
          )}
          
          {title && (
            <div className="standard-heading h1b">
              {renderTitle()}
            </div>
          )}
          
          {/* For non-login pages, render subtitle after title */}
          {!isLoginPage && subtitle && (
            <p className="standard-subtitle-text h1sub">{subtitle}</p>
          )}
        </div>

        <div className="standard-form-box-wrapper">
          {children}
        </div>
      </div>
      
      {includeFooter && <Footer />}
    </PageWrapper>
  );
};

export default StandardLayout;
