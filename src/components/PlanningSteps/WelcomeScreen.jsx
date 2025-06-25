import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePlanningData } from '../../context/usePlanningData';
import { useAuth } from '../../context/useAuth';

import FormBox from '../FormBox';
import StandardLayout from '../StandardLayout'; // Make sure this is imported!
import PrimaryButton from '../buttons/PrimaryButton';

import '../../styles/StandardLayout.css';
import '../../styles/PlanningSteps/WelcomeScreen.css';


const sections = [
  {
    iconSrc: '/Picture/LP-Note-Write.svg', 
    altText: 'Plan and Update Icon',
    title: 'Plan with Confidence',
    text: ' Create and revisit your farewell anytime. Your life may change — your legacy can grow with it.',
  },
  {
    iconSrc: '/Picture/email.svg',
    altText: 'Share Icon',
    title: 'Share with Clarity',
    text: 'Make your wishes known, so the people you love don’t have to guess — or carry the burden alone.',
  },
];

const WelcomeScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { formData } = usePlanningData();

  // Determine if user is returning (has plan data)
  const isReturningUser = !!(
    formData && (
      (formData._metadata && formData._metadata.lastVisitedStep) ||
      (formData.basicInformation && Object.keys(formData.basicInformation).length > 0)
    )
  );

  // Log auth state when component mounts
  useEffect(() => {
    console.log("WelcomeScreen mounted, current auth state:", isAuthenticated, "isReturningUser:", isReturningUser);
  }, [isAuthenticated, isReturningUser]);

  const handleBeginClick = () => {
    navigate('/basic-information');
  };

  const handleResumeClick = () => {
    const lastStep = formData._metadata?.lastVisitedStep || '/basic-information';
    navigate(lastStep);
  };

  const handleStartFreshClick = () => {
    // Optionally clear storage or reset plan data here
    window.localStorage.removeItem('farewell-planning-data');
    navigate('/basic-information');
  };

  return (
    <StandardLayout
      title={
        <>
          <span className="h1">{isReturningUser ? 'Welcome' : 'Your'}</span>&nbsp;
          <span className="h1b">{isReturningUser ? 'back!' : 'farewell'}</span>&nbsp;
          <span className="h1">{isReturningUser ? '' : 'is more than a will'}</span>
        </>
      }
      subtitle={
        <span className="h1sub">
          {isReturningUser
            ? "We found your existing farewell plan. What would you like to do?"
            : "We're here to shape your legacy — your voice, your way."}
        </span>
      }
    >
      <FormBox className="standard-formbox">
        <div className="welcome-features">
          {sections.map((section, index) => (
            <div key={index} className="feature-item">
              <div className="feature-icon-container">
                <img src={section.iconSrc} alt={section.altText} className="feature-icon" />
              </div>
              <div className="feature-text-container">
                <h3 className="feature-title">{section.title}</h3>
                <p className="feature-description">{section.text}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="invite-primary-button" style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          {isReturningUser ? (
            <>
              <PrimaryButton onClick={handleResumeClick}>
                Resume Planning
              </PrimaryButton>
              <PrimaryButton onClick={handleStartFreshClick} style={{ background: '#fff', color: '#333', border: '2px solid #ccc' }}>
                Start Fresh
              </PrimaryButton>
            </>
          ) : (
            <PrimaryButton onClick={handleBeginClick}>
              Start Planning
            </PrimaryButton>
          )}
        </div>
      </FormBox>
    </StandardLayout>
  );
}

export default WelcomeScreen;
