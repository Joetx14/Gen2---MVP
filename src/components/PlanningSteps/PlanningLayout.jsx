import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { usePlanningData } from '../../context/PlanningDataContext';
import StepNav from './StepNav';
import FormBox from '../FormBox';
import PrimaryButton from '../buttons/PrimaryButton';
import SecondaryButton from '../buttons/SecondaryButton';
import GoBackButton from '../buttons/GoBackButton';
import PageWrapper from '../PageWrapper';
import MobileStepNav from './StepNav';

import '../../styles/PlanningSteps/PlanningLayout.css';

const NAV_PREFERENCE_KEY = 'farewellNavOpenPreference'; // Defined localStorage key

const PlanningLayout = ({
  title,
  subtitle,
  currentStep,
  currentSubStep = 0,
  onGoBack,
  onSkip,
  // REMOVE onSaveContinue
  // ADD getStepData and nextRoute
  getStepData,
  nextRoute,
  showNavButtons = true,
  buttonsRowClassName = '',
  rightButtonsClassName = '',
  formBoxClassName = '',
  defaultNavClosed = false,
  children,
}) => {
  const location = useLocation();
  const navigate = useNavigate(); // Add navigate hook
  const { formData, updateFormData, trackStepVisit } = usePlanningData(); // Add trackStepVisit
  
  // Track visit when component mounts or path changes
  useEffect(() => {
    // Only track actual planning steps (not modal or special routes)
    if (location.pathname.includes('/planning') || 
        location.pathname.includes('/farewell-') || 
        location.pathname.includes('/tribute')) {
      trackStepVisit(location.pathname);
    }
  }, [location.pathname, trackStepVisit]);

  // isMobile function is now memoized with useCallback for stability in useEffect dependencies
  const isMobile = useCallback(() => window.innerWidth <= 768, []);

  const [navOpen, setNavOpen] = useState(() => {
    // Check if currently mobile - if so, nav should always be closed initially regardless of preference
    if (isMobile()) {
      return false;
    }
    const storedPreference = localStorage.getItem(NAV_PREFERENCE_KEY);
    if (storedPreference !== null) {
      return storedPreference === 'true'; // Convert string from localStorage to boolean
    }
    return !defaultNavClosed; // Default if no preference stored and not mobile
  });

  // Create the centralized handler function
  const handleSaveAndContinue = async () => {
    if (!getStepData || !nextRoute) {
      console.warn('getStepData or nextRoute not provided to PlanningLayout');
      return;
    }
    try {
      // Get the latest data from the child component
      const stepData = getStepData();
      // Save using the context function (await for backend save)
      await updateFormData(stepData);
      // Navigate to the next step
      navigate(nextRoute);
    } catch (error) {
      console.error('Error saving and continuing:', error);
    }
  };

  // useEffect for handling resize and applying stored preferences
  useEffect(() => {
    const handleResize = () => {
      if (isMobile()) {
        setNavOpen(false); // Visually close on mobile
      } else {
        // When resizing back to desktop, re-apply stored preference or default
        const storedPreference = localStorage.getItem(NAV_PREFERENCE_KEY);
        if (storedPreference !== null) {
          setNavOpen(storedPreference === 'true');
        } else {
          // If no preference, use default (e.g. !defaultNavClosed or true if nav should generally be open on desktop)
          setNavOpen(!defaultNavClosed);
        }
      }
    };

    window.addEventListener('resize', handleResize);
    // Initial check on mount (after useState has run)
    // This ensures that if the component mounts on mobile, navOpen is false.
    // If it mounts on desktop, useState has already handled preference/default.
    if (isMobile()) {
        setNavOpen(false);
    }

    return () => window.removeEventListener('resize', handleResize);
  }, [defaultNavClosed, isMobile]); // isMobile is now a stable dependency

  // useEffect specifically for saving the toggle preference on desktop
  useEffect(() => {
    if (!isMobile()) { // Only save preference if on desktop
      localStorage.setItem(NAV_PREFERENCE_KEY, navOpen.toString());
    }
  }, [navOpen, isMobile]); // Effect runs when navOpen or isMobile changes

  // Get appropriate Resting Place substeps based on care choice
  const getRestingPlaceSubsteps = () => {
    const careChoice = formData?.farewellCare?.choice;

    switch (careChoice) {
      case 'cremation':
        return [
          { label: 'Cremation Options', path: '/resting-place/cremation' },
          { label: 'Scattering Location', path: '/resting-place/scattering' },
        ];
      case 'burial':
        return [
          { label: 'Burial Options', path: '/resting-place/burial' },
          { label: 'Gravesite Location', path: '/resting-place/gravesite' },
        ];
      default:
        return [];
    }
  };

  const steps = [
    { id: 1, label: 'Essential Details', key: 'essential-details' },
    { id: 2, label: 'Farewell Ceremony', key: 'farewell-ceremony' },
    {
      id: 3,
      label: 'Farewell Care',
      key: 'farewell-care',
      substeps: [
        { label: 'Care Choice', path: '/farewell-care', key: 'care-choice' },
        { label: 'Care Details', path: '/farewell-care-details', key: 'care-details' }
      ]
    },
    {
      id: 4,
      label: 'Resting Place',
      key: 'resting-place',
      substeps: getRestingPlaceSubsteps().map((step, idx) => ({ ...step, key: step.path || idx }))
    },
    {
      id: 5,
      label: 'Farewell Tributes',
      key: 'farewell-tributes',
      substeps: [
        { label: 'Setting & Spirit', path: '/tributes/setting', key: 'setting-spirit' },
        { label: 'Voice & Meaning', path: '/tributes/voice', key: 'voice-meaning' },
        { label: 'Legacy Reflections', path: '/tributes/legacy', key: 'legacy-reflections' }
      ]
    },
    { id: 6, label: 'Confirm Wishes', key: 'confirm-wishes' },
  ];

  const buttonsRowClasses = `form-buttons-row ${buttonsRowClassName}`.trim();
  const rightButtonsClasses = `form-right-buttons ${rightButtonsClassName}`.trim();

  return (
    <PageWrapper>
      <div className={`planning-page-container ${navOpen ? 'nav-open' : ''}`}>
        {/* Desktop Step Nav */}
        <aside className="planning-stepnav desktop-only">
          <StepNav
            currentStep={currentStep}
            currentSubStep={currentSubStep}
            steps={steps}
            isOpen={navOpen}
            onToggle={() => setNavOpen((prev) => !prev)}
          />
        </aside>

        {/* Mobile Step Nav - Bottom positioned */}
        <div className="mobile-only">
          <MobileStepNav 
            currentStep={currentStep} 
            steps={steps}
          />
        </div>

        <div className={`planning-form-container ${navOpen ? 'nav-open' : 'nav-closed'}`}>
<div className="standard-formbox">
  <header className="planning-header">
    <h1 className="planning-heading">
      {(() => {
        if (title && typeof title === 'string' && title.includes(' ')) {
          return (
            <>
              <span className="h1b">{title.split(' ')[0]}</span>{' '}
              <span className="h1">{title.split(' ').slice(1).join(' ')}</span>
            </>
          );
        } else if (title) {
          return <span className="h1">{title}</span>;
        }
        return null;
      })()}
    </h1>
    {subtitle && <h2 className="planning-subtitle h1sub">{subtitle}</h2>}
  </header>

            <FormBox className={`planning-formbox ${formBoxClassName}`.trim()}>
              <div className="form-content">
                {children}
              </div>

              {showNavButtons && (
                <>
                  {/* Desktop version of buttons */}
                  <div className={`${buttonsRowClasses} desktop-buttons`}>
                    {onGoBack && (
                      <GoBackButton onClick={onGoBack}>Go back</GoBackButton>
                    )}
                    <div className={rightButtonsClasses}>
                      {onSkip && (
                        <SecondaryButton onClick={onSkip}>
                          Skip for now
                        </SecondaryButton>
                      )}
                      {getStepData && nextRoute && (
                        <PrimaryButton onClick={handleSaveAndContinue}>
                          Save & continue
                        </PrimaryButton>
                      )}
                    </div>
                  </div>

                  {/* Mobile version of buttons */}
                  <div className="mobile-buttons-container">
                    {getStepData && nextRoute && (
                      <PrimaryButton 
                        onClick={handleSaveAndContinue} 
                        className="mobile-primary-button button-text"
                      >
                        Save & continue
                      </PrimaryButton>
                    )}
                    
                    <div className="mobile-tertiary-buttons">
                      {onGoBack && (
                        <button 
                          onClick={onGoBack} 
                          className="mobile-back-button tertiary-button-text"
                          aria-label="Go back to previous step"
                        >
                          <img 
                            src="/Picture/goback--arrow-right.svg" 
                            alt="" 
                            className="button-arrow left-arrow"
                            width="16"
                            height="16"
                            aria-hidden="true"
                          />
                          Back
                        </button>
                      )}
                      
                      {onSkip && (
                        <button 
                          onClick={onSkip} 
                          className="mobile-skip-button tertiary-button-text"
                          aria-label="Skip this step"
                        >
                          Skip
                          <img 
                            src="/Picture/arrow-right.svg" 
                            alt="" 
                            className="button-arrow right-arrow"
                            width="16" 
                            height="16"
                            aria-hidden="true"
                          />
                        </button>
                      )}
                    </div>
                  </div>
                </>
              )}
            </FormBox>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default PlanningLayout;
