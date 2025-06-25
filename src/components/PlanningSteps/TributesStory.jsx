import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePlanningData } from '../../context/PlanningDataContext';

import PlanningLayout from './PlanningLayout';
import TextInput from '../TextInput';

import '../../styles/PlanningSteps/Tributes.css';

const TributesStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isEditing, returnTo } = location.state || {};
  const { formData, updateFormData } = usePlanningData();

  const [lifeStory, setLifeStory] = useState(formData.tributes?.lifeStory || '');
  const [showPrompts, setShowPrompts] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const MAX_STORY_CHARS = 2000;

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIfMobile();

    window.addEventListener('resize', checkIfMobile);

    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const handleGoBack = () => {
    if (isEditing) {
      navigate(returnTo || '/confirm-wishes');
    } else {
      navigate('/tributes-speaker');
    }
  };

  const handleSkip = () => {
    if (isEditing) {
      navigate(returnTo || '/confirm-wishes');
    } else {
      navigate('/confirm-wishes');
    }
  };
  const getStepData = () => {
    return {
      tributes: {
        ...formData.tributes,
        lifeStory: lifeStory
      }
    };
  };

  const getNextRoute = () => {
    if (isEditing) {
      return returnTo || '/confirm-wishes';
    } else {
      return '/confirm-wishes';
    }
  };

  return (
    <PlanningLayout
      title={
        <>
          <span className="h1b">Farewell</span>{' '}
          <span className="h1">Tributes</span>
        </>
      }
      subtitle={
        <span className="h1sub">
          Your Life Story
        </span>
      }
      currentStep={5}
      currentSubStep={3}      onGoBack={handleGoBack}
      skipButtonText={isEditing ? 'Cancel' : 'Skip'}
      onSkip={handleSkip}
      continueButtonText={isEditing ? 'Save & Return' : 'Save & Continue'}
      getStepData={getStepData}
      nextRoute={getNextRoute()}
      showSkipButton={true}
      defaultNavClosed={isMobile}
      formBoxClassName="planning-formbox" // Added prop
    >
      <div className="tributes-section">
        <div className="tributes-label-container">
          <label className="input-label">
            Life Story & Special Memories
          </label>
          {!isMobile && (
            <button
              className="tributes-prompt-button desktop-prompt-button"
              onClick={() => setShowPrompts(!showPrompts)}
              type="button"
            >
              {showPrompts ? 'Hide prompts' : 'Need inspiration?'}
            </button>
          )}
        </div>

        <p className="tributes-text-input-instructions">
          Share key moments, achievements, or stories that you'd like remembered about your life.
        </p>

        {showPrompts && (
          <div className="tributes-prompts">
            <h4>Consider these elements of your story:</h4>
            <ul>
              <li>Important achievements or milestones you're proud of</li>
              <li>People who influenced your life's path</li>
              <li>Lessons you've learned that you want to pass on</li>
              <li>Meaningful experiences that shaped who you are</li>
              <li>Values that have guided your decisions</li>
            </ul>
          </div>
        )}

        <TextInput
          id="life-story-input"
          value={lifeStory}
          onChange={e => {
            if (e.target.value.length <= MAX_STORY_CHARS) {
              setLifeStory(e.target.value);
            }
          }}
          multiline
          maxLength={MAX_STORY_CHARS}
          containerClassName="tributes-field mobile-textarea-container"
          textareaClassName="tributes-textarea farewell-scrollbar"
          placeholder="Share key elements of your life story here..."
        />

        {lifeStory.length > (MAX_STORY_CHARS * 0.9) && (
          <div className={`tributes-char-warning ${lifeStory.length > MAX_STORY_CHARS ? 'exceeded' : ''}`}>
            {lifeStory.length > MAX_STORY_CHARS ? 
              `Character limit exceeded: ${lifeStory.length}/${MAX_STORY_CHARS}` : 
              `Characters remaining: ${MAX_STORY_CHARS - lifeStory.length}`
            }
          </div>
        )}

        {isMobile && (
          <button
            className="tributes-prompt-button mobile-prompt-button"
            onClick={() => setShowPrompts(!showPrompts)}
            type="button"
          >
            {showPrompts ? 'Hide prompts' : 'Need inspiration?'}
          </button>
        )}
      </div>
    </PlanningLayout>
  );
};

export default TributesStory;
