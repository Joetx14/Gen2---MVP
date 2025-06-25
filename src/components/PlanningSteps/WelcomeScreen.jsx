import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePlanningData } from '../../context/usePlanningData';
import { useAuth } from '../../context/useAuth';

import FormBox from '../FormBox';
import StandardLayout from '../StandardLayout';
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
  const { formData, isLoading } = usePlanningData();
  const { user, isAuthenticated, isLoading: authIsLoading, error: authError } = useAuth();

  // A user is considered "new" only if they've just signed up.
  const isNewUser = location.state?.isNewUser === true;

  // A user is a "returning user with data" if they are NOT new and have some plan data.
  const isReturningWithData = !isNewUser && !!(
    formData && (
      (formData._metadata && formData._metadata.lastVisitedStep) ||
      (formData.basicInformation && Object.keys(formData.basicInformation).length > 0)
    )
  );

  const handleBeginClick = () => {
    // New users always start at the beginning.
    navigate('/basic-information');
  };

  const handleResumeClick = () => {
    // For returning users, decide where to send them.
    const lastVisitedStep = formData?._metadata?.lastVisitedStep;
    const isPlanCompleted = formData?._metadata?.isCompleted;

    if (isPlanCompleted) {
      navigate('/confirm-wishes');
    } else if (lastVisitedStep) {
      navigate(lastVisitedStep);
    } else {
      // Fallback for returning users with no specific last step.
      navigate('/basic-information');
    }
  };

  const handleStartFreshClick = () => {
    // We should clear their old data before starting over.
    // This assumes you have a function to clear data, otherwise, we can use localStorage.
    // clearPlanningData(); 
    navigate('/basic-information', { state: { startFresh: true } });
  };

  if (isLoading || authIsLoading) {
    // Debug: Show both loading states and user info
    return (
      <div className="app-loading">
        Loading...<br />
        <span style={{ color: 'red', fontWeight: 'bold' }}>Debug: WelcomeScreen is waiting for plan data or authentication to finish.</span>
        <br />
        <div style={{ color: 'blue', marginTop: 8 }}>
          <div>authIsLoading: {String(authIsLoading)}</div>
          <div>isLoading (plan): {String(isLoading)}</div>
          <div>isAuthenticated: {String(isAuthenticated)}</div>
          <div>User: {user ? JSON.stringify(user) : 'null'}</div>
          <div>Auth Error: {authError || 'none'}</div>
        </div>
        <br />If this never disappears, check your network, backend, or authentication state.
      </div>
    );
  }

  return (
    <StandardLayout
      title={
        <>
          <span className="h1">{isReturningWithData ? 'Welcome' : 'Your'}</span>&nbsp;
          <span className="h1b">{isReturningWithData ? 'back!' : 'farewell'}</span>&nbsp;
          <span className="h1">{isReturningWithData ? '' : 'is more than a will'}</span>
        </>
      }
      subtitle={
        <span className="h1sub">
          {isReturningWithData
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
          {isReturningWithData ? (
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
