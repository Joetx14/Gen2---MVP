import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePlanningData } from '../../context/PlanningDataContext';

import PlanningLayout from './PlanningLayout';
import TextInput from '../TextInput';
import '../../styles/PlanningSteps/Tributes.css';

const TributesSpeaker = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isEditing, returnTo } = location.state || {};
  const { formData, updateFormData } = usePlanningData();
  
  // Initialize from context if available
  const [selectedSpeaker, setSelectedSpeaker] = useState(
    formData.tributes?.speaker?.speakerType || ''
  );
  const [speakerOtherText, setSpeakerOtherText] = useState(
    formData.tributes?.speaker?.speakerOther || ''
  );
  const [musicAndReadings, setMusicAndReadings] = useState(
    formData.tributes?.speaker?.musicAndReadings || ''
  );

  // Add state for showing/hiding examples
  const [showExamples, setShowExamples] = useState(false);
  // Add state to track viewport size
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Check if device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const speakerOptions = [
    { label: 'Friend or Family Member', value: 'friend' },
    { label: 'Religious or Spiritual Leader', value: 'religious' },
    { label: 'Celebrant or Officiant', value: 'officiant' },
    { label: 'Other (please specify)', value: 'other' },
    { label: 'Not applicable / No speaker', value: 'na' },
  ];

  const handleSpeakerChange = (e) => {
    const value = e.target.value;
    setSelectedSpeaker(value);
    // clear out "other" text if they switch away
    if (value !== 'other') setSpeakerOtherText('');
  };

  const handleMusicAndReadingsChange = (e) => {
    setMusicAndReadings(e.target.value);
  };
  const handleGoBack = () => navigate('/tributes-ceremony');
  
  const getStepData = () => {
    // Get the label for the selected speaker type
    const selectedSpeakerOption = speakerOptions.find(option => option.value === selectedSpeaker);
    const speakerLabel = selectedSpeakerOption ? selectedSpeakerOption.label : '';
    
    // Format speaker preference for display (include "other" text if applicable)
    const formattedSpeaker = selectedSpeaker === 'other' && speakerOtherText
      ? `${speakerLabel}: ${speakerOtherText}`
      : speakerLabel;
    
    return {
      tributes: {
        ...formData.tributes, // Preserve existing tributes data
        speaker: {
          speakerType: selectedSpeaker,
          speakerLabel: formattedSpeaker,
          speakerOther: speakerOtherText,
          musicAndReadings: musicAndReadings
        }
      }
    };
  };

  const getNextRoute = () => {
    if (isEditing) {
      return returnTo || '/confirm-wishes';
    } else {
      // Normal flow navigation
      return '/tributes-story';
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
          Voice and Meaning
        </span>
      }
      currentStep={5}
      currentSubStep={2}      onGoBack={handleGoBack}
      continueButtonText={isEditing ? 'Save & Return' : 'Save & Continue'}
      onSkip={() => navigate('/tributes-story')}
      getStepData={getStepData}
      nextRoute={getNextRoute()}
      defaultNavClosed={isMobile}
      formBoxClassName="planning-formbox" // Added prop
    >
 

        {/* Speaker Selection */}
        <div className="tributes-section">
          <div className="tributes-label-container">
            <label className="input-label">
              Speaker or Leader
            </label>
          </div>
          <p className="tributes-text-input-instructions">
            Choose someone who can honor your loved one's memory and guide attendees through the service.
          </p>
          <TextInput
            type="dropdown"
            id="speaker-dropdown"
            name="speaker-dropdown"
            placeholder="Select a speaker type"
            options={speakerOptions}
            value={selectedSpeaker}
            onChange={handleSpeakerChange}
            containerClassName="tributes-field"
          />

          {selectedSpeaker === 'other' && (
            <div className="tributes-other-input-wrapper">
              <label className="input-label">
                Please specify:
              </label>
              <TextInput
                id="speaker-other"
                placeholder="Enter the name or title of the speaker"
                value={speakerOtherText}
                onChange={(e) => setSpeakerOtherText(e.target.value)}
                containerClassName="tributes-field tributes-other-input"
              />
            </div>
          )}
        </div>

        {/* Music & Readings */}
        <div className="tributes-section">
          {/* Single label container with conditional button */}
          <div className="tributes-label-container">
            <label className="input-label">
              Music & Readings
            </label>
            {!isMobile && (
              <button
                className="tributes-prompt-button desktop-prompt-button"
                onClick={() => setShowExamples(!showExamples)}
                type="button"
              >
                {showExamples ? 'Hide examples' : 'Need inspiration?'}
              </button>
            )}
          </div>

          <p className="tributes-text-input-instructions">
            Are there songs, readings, or words that reflect their life and spirit?
          </p>

          {/* Collapsible examples section */}
          {showExamples && (
            <div className="tributes-prompts">
              <h4>Examples of music and readings:</h4>
              <ul>
                <li>"Amazing Grace" sung by the congregation</li>
                <li>The poem "Do Not Stand at My Grave and Weep" read by my daughter</li>
                <li>"What a Wonderful World" played as guests arrive</li>
                <li>A passage from my favorite book, "The Little Prince"</li>
              </ul>
            </div>
          )}

          <TextInput
            id="music-readings"
            value={musicAndReadings}
            onChange={handleMusicAndReadingsChange}
            multiline
            maxLength={1000}
            containerClassName="tributes-field mobile-textarea-container"
            textareaClassName="tributes-textarea farewell-scrollbar"
            placeholder="Are there songs, readings, or words that reflect their life and spirit?"
          
          />

          {/* Only show character count as a warning when approaching limit */}
          {musicAndReadings.length > 900 && (
            <div className={`tributes-char-warning ${musicAndReadings.length > 1000 ? 'exceeded' : ''}`}>
              {musicAndReadings.length > 1000 ? 
                `Character limit exceeded: ${musicAndReadings.length}/1000` : 
                `Characters remaining: ${1000 - musicAndReadings.length}`
              }
            </div>
          )}
          
          {/* Mobile-only button appearing below text box */}
          {isMobile && (
            <button
              className="tributes-prompt-button mobile-prompt-button"
              onClick={() => setShowExamples(!showExamples)}
              type="button"
            >
              {showExamples ? 'Hide examples' : 'Need inspiration?'}
            </button>
          )}
          
      
        </div>
    </PlanningLayout>
  );
};

export default TributesSpeaker;
