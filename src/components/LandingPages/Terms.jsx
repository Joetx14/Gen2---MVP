import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PageWrapper from '../PageWrapper';
import Footer from '../Footer';
import '../../styles/LandingPages/Terms.css';

// Keep your existing helper components
const TextBlockWithTitle = ({ title, bodyText }) => (
  <div className="text-block">
    <h3 className="h3">{title}</h3>
    <p className="body-text">{bodyText}</p>
  </div>
);

const ListBlockWithTitle = ({ title, summaryText, bodyText, ordered = false }) => (
  <div className="list-block">
    <h3 className="h3">{title}</h3>
    <p className="body-text">{summaryText}</p>
    {ordered ? (
      <ol className="list-items">
        {bodyText.map((item, index) => (
          <li key={index} className="list-item body-text">{item}</li>
        ))}
      </ol>
    ) : (
      <ul className="list-items">
        {bodyText.map((item, index) => (
          <li key={index} className="list-item body-text">{item}</li>
        ))}
      </ul>
    )}
  </div>
);

export default function Terms() {
  // Get the tab from URL params
  const { tab } = useParams();
  const [activeTab, setActiveTab] = useState('terms'); // Default to 'terms'
  
  // Set active tab based on URL parameter
  useEffect(() => {
    if (tab) {
      if (['terms', 'privacy', 'cookies'].includes(tab)) {
        setActiveTab(tab);
      }
    }
  }, [tab]);
  
  return (
    <PageWrapper className="standard">
      <div className="standard-content-wrapper">
        <div className="standard-header">
          <div className="standard-heading h1b">Legal</div>
          <p className="standard-subtitle-text h1sub">Information</p>
        </div>

        <div className="legal-container">
          {/* Tab Navigation */}
          <div className="legal-tabs">
            <button 
              className={`tab-button ${activeTab === 'terms' ? 'active' : ''}`}
              onClick={() => setActiveTab('terms')}
            >
              Terms of Use
            </button>
            <button 
              className={`tab-button ${activeTab === 'privacy' ? 'active' : ''}`}
              onClick={() => setActiveTab('privacy')}
            >
              Privacy Policy
            </button>
            <button 
              className={`tab-button ${activeTab === 'cookies' ? 'active' : ''}`}
              onClick={() => setActiveTab('cookies')}
            >
              Cookie Policy
            </button>
          </div>

          {/* Tab Content */}
          <div className="legal-content">
            {activeTab === 'terms' && (
              <div className="terms-content">
                <TextBlockWithTitle
                  title="Introduction"
                  bodyText="Welcome to Farewell Finder. These Terms and Conditions outline the rules and regulations for the use of Farewell Finder's Website."
                />
                {/* Add more terms content */}
              </div>
            )}
            
            {activeTab === 'privacy' && (
              <div className="privacy-content">
                <TextBlockWithTitle
                  title="Privacy Policy"
                  bodyText="This Privacy Policy describes how your personal information is collected, used, and shared when you visit farewellfinder.com."
                />
                {/* Add more privacy content */}
              </div>
            )}
            
            {activeTab === 'cookies' && (
              <div className="cookies-content">
                <TextBlockWithTitle
                  title="Cookie Policy"
                  bodyText="This Cookie Policy explains how Farewell Finder uses cookies and similar technologies to recognize you when you visit our website."
                />
                {/* Add more cookie content */}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </PageWrapper>
  );
}
