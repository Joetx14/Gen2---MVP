import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { usePlanningData } from '../../context/PlanningDataContext';
import StepNav from './StepNav';
import FormBox from '../FormBox';
import PrimaryButton from '../buttons/PrimaryButton';
import SecondaryButton from '../buttons/SecondaryButton';
import GoBackButton from '../buttons/GoBackButton';
import PageWrapper from '../PageWrapper';

import '../../styles/PlanningSteps/PlanningLayout.css';

const PlanningLayout = ({
  title,
  subtitle,
  currentStep,
  currentSubStep = 0,
  onGoBack,
  onSkip,
  getStepData, // Use getStepData to fetch data from the child component
  nextRoute,   // Use nextRoute to determine the next page
  showNavButtons = true,
  buttonsRowClassName = '',
  rightButtonsClassName = '',
  formBoxClassName = '',
  defaultNavClosed = false,
  continueButtonText = 'Save & continue', // Add prop for button text
  skipButtonText = 'Skip for now',       // Add prop for skip button text
  children,
}) => {
  const location = useLocation();
  const navigate = useNavigate(); // Use navigate hook for routing
  const { formData, updateFormData, trackStepVisit } = usePlanningData();
  const NAV_PREFERENCE_KEY = 'farewellNavOpenPreference'; // Defined constant inside the component

  // Track the user's current step for resume functionality
  useEffect(() => {
    if (location.pathname.includes('/farewell-') || location.pathname.includes('/tributes-')) {
      trackStepVisit(location.pathname);
    }
  }, [location.pathname, trackStepVisit]);

  const isMobile = useCallback(() => window.innerWidth <= 768, []);

  const [navOpen, setNavOpen] = useState(() => {
    if (isMobile()) return false;
    const storedPreference = localStorage.getItem(NAV_PREFERENCE_KEY);
    return storedPreference !== null ? storedPreference === 'true' : !defaultNavClosed;
  });

  // Handle window resize to adjust nav state
  useEffect(() => {
    const handleResize = () => {
      setNavOpen(!isMobile());
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile]);

  // Save nav preference to local storage
  useEffect(() => {
    if (!isMobile()) {
      localStorage.setItem(NAV_PREFERENCE_KEY, navOpen.toString());
    }
  }, [navOpen, isMobile]);

  // Define the save and continue handler
  const handleSaveAndContinue = () => {
    if (getStepData) {
      const stepData = getStepData();
      updateFormData(stepData);
    }
    if (nextRoute) {
      navigate(nextRoute);
    }
  };
  
  // Define steps for the navigation
  const steps = [
    { id: 1, label: 'Essential Details', key: 'basicInfo' },
    { id: 2, label: 'Farewell Ceremony', key: 'ceremony' },
    { id: 3, label: 'Farewell Care', key: 'care' },
    { id: 4, label: 'Resting Place', key: 'resting' },
    { id: 5, label: 'Farewell Tributes', key: 'tributes' },
    { id: 6, label: 'Confirm Wishes', key: 'confirm' },
  ];

  const buttonsRowClasses = `form-buttons-row ${buttonsRowClassName}`.trim();
  const rightButtonsClasses = `form-right-buttons ${rightButtonsClassName}`.trim();

  return (
    <PageWrapper>
      <div className={`planning-page-container ${navOpen ? 'nav-open' : 'nav-closed'}`}>
        {/* Desktop Step Nav */}
        <aside className="planning-stepnav desktop-only">
          <StepNav
            currentStep={currentStep}
            currentSubStep={currentSubStep}
            steps={steps}
            isOpen={navOpen}
            onToggle={() => setNavOpen(prev => !prev)}
          />
        </aside>

        {/* Mobile Step Nav at the bottom */}
        <div className="mobile-only">
           <StepNav currentStep={currentStep} steps={steps} isOpen={false} />
        </div>
        
        <main className={`planning-form-container ${navOpen ? 'nav-open' : 'nav-closed'}`}>
           <div className="standard-formbox">
              <header className="planning-header">
                <h1 className="planning-heading">{title}</h1>
                {subtitle && <h2 className="planning-subtitle h1sub">{subtitle}</h2>}
              </header>

              <FormBox className={`planning-formbox ${formBoxClassName}`.trim()}>
                <div className="form-content">
                  {children}
                </div>

                {showNavButtons && (
                  <>
                    {/* Desktop Buttons */}
                    <div className={`${buttonsRowClasses} desktop-buttons`}>
                      {onGoBack && <GoBackButton onClick={onGoBack}>Go back</GoBackButton>}
                      <div className={rightButtonsClasses}>
                        {onSkip && <SecondaryButton onClick={onSkip}>{skipButtonText}</SecondaryButton>}
                        <PrimaryButton onClick={handleSaveAndContinue}>{continueButtonText}</PrimaryButton>
                      </div>
                    </div>

                    {/* Mobile Buttons */}
                    <div className="mobile-buttons-container">
                      <PrimaryButton onClick={handleSaveAndContinue} className="mobile-primary-button button-text">
                        {continueButtonText}
                      </PrimaryButton>
                      <div className="mobile-tertiary-buttons">
                        {onGoBack && (
                          <button onClick={onGoBack} className="mobile-back-button tertiary-button-text">
                            <img src="/Picture/goback--arrow-right.svg" alt="" className="button-arrow left-arrow" />
                            Back
                          </button>
                        )}
                        {onSkip && (
                          <button onClick={onSkip} className="mobile-skip-button tertiary-button-text">
                            {skipButtonText}
                            <img src="/Picture/arrow-right.svg" alt="" className="button-arrow right-arrow" />
                          </button>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </FormBox>
          </div>
        </main>
      </div>
    </PageWrapper>
  );
};

export default PlanningLayout;
