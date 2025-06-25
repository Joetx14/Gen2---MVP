import React from 'react';
import '../../styles/PlanningSteps/StepNav.css';

const StepNav = ({ currentStep, currentSubStep, steps, isOpen, onToggle }) => {
  return (
    <>
      {/* Desktop & Tablet Sidebar Navigation */}
      <nav className={`step-nav ${isOpen ? 'open' : 'closed'}`}>  
        <div className={`step-nav-bg ${isOpen ? 'open' : 'closed'}`}>
          <button
            className="stepnav-toggle"
            onClick={onToggle}
            aria-label={isOpen ? 'Collapse navigation' : 'Expand navigation'}
          >
            <img
              src={isOpen ? '/Picture/nav-arrow-left.svg' : '/Picture/nav-arrow-right.svg'}
              alt=""
              className="stepnav-toggle-icon"
            />
          </button>

          <ul className="step-nav-list">
            {steps.map((step, index) => {
              const isComplete = step.id < currentStep;
              const isActive = step.id === currentStep;

              return (
                <li
                  key={step.key || step.id}
                  className={`step-nav-item ${isComplete ? 'complete' : isActive ? 'active' : 'future'}`}
                >
                  {/* Main step indicator with centered substeps below it */}
                  <div className="step-indicator-column">
                    {/* Main step indicator circle */}
                    <div className={`step-nav-indicator ${isComplete ? 'complete' : isActive ? 'active' : 'future'}`}>
                      {isComplete ? (
                        <img
                          src="/Picture/checkmark.svg"
                          alt="Completed"
                          className="step-checkmark-icon"
                        />
                      ) : isActive ? (
                        <span className="step-number-checkmark">
                          {String(step.id).padStart(2, '0')}
                        </span>
                      ) : (
                        <span className="step-number">
                          {String(step.id).padStart(2, '0')}
                        </span>
                      )}
                    </div>

                    {/* Substep indicators for active step */}
                    {isActive && step.substeps && step.substeps.length > 0 && (
                      <div className="substep-container">
                        {step.substeps.map((substep, i) => {
                          const subIndex = i + 1;
                          const subComplete = currentSubStep > subIndex;
                          const subActive = currentSubStep === subIndex;
                          return (
                            <React.Fragment key={substep.key || substep.id || substep.path || i}>
                              <div
                                className={`substep-indicator ${
                                  subComplete ? 'complete' : subActive ? 'current' : 'future'
                                }`}
                              />
                              {/* Add connector with 2 dots between substeps */}
                              {i < step.substeps.length - 1 && (
                                <div
                                  className={`substep-connector ${
                                    step.substeps[i+1].id <= currentSubStep ? 'complete' : ''
                                  }`}
                                  aria-hidden="true"
                                />
                              )}
                            </React.Fragment>
                          );
                        })}
                      </div>
                    )}

                    {/* Vertical connector line below each step except last */}
                    {index < steps.length - 1 && (
                      <div className={`step-vertical-line ${isComplete ? 'complete' : ''}`} />
                    )}
                  </div>

                  {/* Step label for open state */}
                  {isOpen && (
                    <div className="step-content-column">
                      <span className="nav-step">{step.label}</span>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Mobile Bottom Step Navigation */}
      <div className="mobile-step-nav mobile-only">
        <div className="mobile-step-indicators">
          {steps.map((step, index) => {
            const isComplete = step.id < currentStep;
            const isActive = step.id === currentStep;

            return (
              <React.Fragment key={step.key || step.id}>
                <div 
                  className={`mobile-step-dot ${
                    isComplete ? 'complete' :
                    isActive ? 'current' :
                    'future'
                  }`}
                  aria-label={`Step ${step.id}: ${step.label} ${isComplete ? 'complete' : isActive ? 'current' : 'upcoming'}`}
                >
                  {isComplete && (
                    <img
                      src="/Picture/checkmark.svg"
                      alt=""
                      className="mobile-checkmark-icon"
                    />
                  )}
                  {isActive && (
                    <span className="mobile-step-number">
                      {String(step.id).padStart(2, '0')}
                    </span>
                  )}
                </div>

                {/* only render connector if not the last */}
                {index < steps.length - 1 && (
                  <div
                    className={`mobile-step-connector ${
                      isComplete ? 'complete' : ''
                    }`}
                    aria-hidden="true"
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default StepNav;
