// src/components/PlanningSteps/TributesCeremony.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePlanningData } from '../../context/PlanningDataContext';

import PlanningLayout from './PlanningLayout';
import TextInput from '../TextInput';

// Keep only Tributes-specific styles
import '../../styles/PlanningSteps/Tributes.css';

const TributesCeremony = () => {  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state || {};

  // Dynamic previous page based on user's journey
  const getDynamicPreviousPage = () => {
    const { formData } = usePlanningData();
    
    // Check the user's farewell care choice to determine the correct previous page
    const farewellCareChoice = formData.farewellCare?.choice;
    const cremationChoice = formData.farewellCareDetails?.cremation?.choice;
    const alternativeChoice = formData.farewellCareDetails?.alternatives?.choice;
    
    if (farewellCareChoice === 'cremation' && cremationChoice === 'scattering') {
      return '/resting-place-scattering';
    }
    if (farewellCareChoice === 'burial') {
      return '/resting-place-burial';
    }
    if (farewellCareChoice === 'alternatives') {
      if (alternativeChoice === 'return-to-nature') {
        return '/resting-place-nature';
      }
      if (alternativeChoice === 'memorialization') {
        return '/resting-place-memorial';
      }
      if (alternativeChoice === 'donate-body') {
        return '/resting-place-donate';
      }
    }
    // Default fallback
    return '/resting-place';
  };

  const previousPage = locationState.previousPage || getDynamicPreviousPage();
  const isEditing = locationState.isEditing || false;
  const returnTo = locationState.returnTo || '/confirm-wishes';

  const { formData, updateFormData } = usePlanningData();

  const [religiousPreference, setReligiousPreference] = useState(
    formData.tributes?.ceremony?.religiousPreferenceValue || ''
  );
  const [religiousOtherText, setReligiousOtherText] = useState(
    formData.tributes?.ceremony?.religiousOtherText || ''
  );
  const [ceremonyLocation, setCeremonyLocation] = useState(
    formData.tributes?.ceremony?.ceremonySetting || ''
  );
  const [showPrompts, setShowPrompts] = useState(false); // For Ceremony Location prompts

  const religiousOptions = [
    { label: 'No religious preference', value: 'none' },
    { label: 'Christianity', value: 'christianity' },
    { label: 'Islam', value: 'islam' },
    { label: 'Judaism', value: 'judaism' },
    { label: 'Buddhism', value: 'buddhism' },
    { label: 'Hinduism', value: 'hinduism' },
    { label: 'Spiritual but not Religious', value: 'spiritual' },
    { label: 'Other (please specify)', value: 'other' },
    { label: 'Prefer not to answer', value: 'na' }
  ];

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth <= 768);
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);
  const handleGoBack = () => {
    if (isEditing) {
      navigate(returnTo);
    } else {
      navigate(previousPage);
    }
  };

  const getStepData = () => {
    const selectedOption = religiousOptions.find(o => o.value === religiousPreference);
    const label = selectedOption ? selectedOption.label : '';
    const formatted = (religiousPreference === 'other' && religiousOtherText)
      ? `${label}: ${religiousOtherText}`
      : label;

    return {
      tributes: {
        ...formData.tributes,
        ceremony: {
          religiousPreference: formatted,
          religiousPreferenceValue: religiousPreference,
          religiousOtherText,
          ceremonySetting: ceremonyLocation
        }
      }
    };
  };
  const getNextRoute = () => {
    if (isEditing) {
      return returnTo;
    } else {
      return '/tributes-speaker';
    }
  };

  return (
    <PlanningLayout
      title="Farewell Tributes"
      subtitle="Spirit and Setting"
      currentStep={5}
      currentSubStep={1}      onGoBack={handleGoBack}
      // Using handleSkip makes it consistent with other defined handlers,
      // or use '/tributes-story' if that's the desired skip target similar to TributesSpeaker.
      // For now, aligning with TributesSpeaker's direct navigation target for onSkip:
      onSkip={() => navigate(isEditing ? returnTo : '/tributes-story')}
      getStepData={getStepData}
      nextRoute={getNextRoute()}
      formBoxClassName="planning-formbox"
      continueButtonText={isEditing ? 'Save & Return' : 'Save & Continue'} // Added for consistency like TributesSpeaker
      defaultNavClosed={isMobile} // Added for consistency like TributesSpeaker
    >
      {/* Religious Preference Section */}
      <div className="tributes-section">
        <div className="tributes-label-container">
          <label htmlFor="religious-preference-dropdown" className="input-label">
            Religious or Spiritual Preference
          </label>
        </div>
        
        <TextInput
          type="dropdown"
          id="religious-preference-dropdown"
          name="religiousPreference"
          placeholder="Search, add or select one from the list"
          options={religiousOptions}
          value={religiousPreference}
          onChange={(e) => setReligiousPreference(e.target.value)}
          containerClassName="tributes-field"
        />
        
        {religiousPreference === 'other' && (
          <div className="tributes-other-input-wrapper">
            <label htmlFor="religious-other" className="input-label secondary-label">
              Please specify:
            </label>
            <TextInput
              id="religious-other"
              name="religiousOtherText"
              placeholder="Enter your preference here"
              value={religiousOtherText}
              onChange={e => setReligiousOtherText(e.target.value)}
              containerClassName="tributes-field"
              inputClassName="tributes-single-input"
            />
          </div>
        )}
      </div>

      {/* Ceremony Location Section */}
      <div className="tributes-section">
        <div className="tributes-label-container">
          <label htmlFor="ceremony-location" className="input-label">
            Ceremony Location & Setting
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

        {/* Moved example paragraph before the prompts to align with TributesSpeaker structure */}
        <p className="tributes-text-input-example tributes-text-input-instructions"> {/* Added instruction class for potential style reuse if applicable */}
          Example: 'A beachside gathering at sunset, with waves in the background and close family.'
        </p>

        {showPrompts && (
          <div className="tributes-prompts">
            <h4>Consider these questions:</h4>
            <ul>
              <li>What places were meaningful to your loved one?</li>
              <li>What time of day feels most appropriate?</li>
              <li>Should the setting be intimate or open to many?</li>
              <li>What elements of nature would they appreciate?</li>
            </ul>
          </div>
        )}

        <TextInput
          id="ceremony-location"
          name="ceremonyLocation"
          value={ceremonyLocation}
          onChange={e => setCeremonyLocation(e.target.value)}
          multiline
          containerClassName="tributes-field mobile-textarea-container"
          textareaClassName="tributes-textarea farewell-scrollbar"
          placeholder="What kind of setting feels right for your ceremony?"
        />
        
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

export default TributesCeremony;
