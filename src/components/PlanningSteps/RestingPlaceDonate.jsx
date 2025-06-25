// src/components/PlanningSteps/RestingPlaceDonate.jsx

import React, { useState } from 'react';
import PlanningLayout from './PlanningLayout';
import ChoiceCard from '../ChoiceCard';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePlanningData } from '../../context/usePlanningData';
import { getNextEditingStep, getPreviousEditingStep } from '../../utils/editingNavigation';

const RestingPlaceDonate = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const prevState = location.state || {};

  // Extract navigation context with defaults
  const previousPage = prevState.previousPage || '/resting-place';
  const isEditing = prevState.isEditing || false;
  const returnTo = prevState.returnTo || '/confirm-wishes';
  const skipTributes = prevState.skipTributes || false;

  const { formData, updateFormData } = usePlanningData();

  // Selection state
  const [selectedCardId, setSelectedCardId] = useState(
    formData.restingPlace?.donation?.choice || null
  );

  const donationOptions = [
    {
      id: 'donate-science',
      icon: <img src="/Picture/icons/science-building.svg" alt="Donate to Science Icon" />,
      title: 'Donate to Science',
      description: 'Advance research and medical education by gifting your body to science.',
    },
    {
      id: 'donate-organs',
      icon: <img src="/Picture/icons/heart-held-hands.svg" alt="Donate Organs Icon" />,
      title: 'Donate Organs',
      description: 'Give the gift of life and healing through organ and tissue donation.',
    },
    {
      id: 'donate-cause',
      icon: <img src="/Picture/icons/lightbulb.svg" alt="Donate to Cause Icon" />,
      title: 'Support a Cause',
      description: 'Choose a meaningful organization to support in your memory.',
    },
  ];

  const handleCardClick = (id) => {
    setSelectedCardId(id === selectedCardId ? null : id);
  };
  const handleGoBack = () => {
    if (isEditing) {
      const relevantSteps = location.state?.relevantSteps || [];
      const previousStep = getPreviousEditingStep('/resting-place-donate', relevantSteps, returnTo);
      navigate(previousStep, { state: location.state });
    } else {
      navigate(previousPage);
    }
  };
  const handleSkip = () => {
    // When skipping in edit mode, use smart navigation
    if (isEditing) {
      const relevantSteps = location.state?.relevantSteps || [];
      const nextStep = getNextEditingStep('/resting-place-donate', relevantSteps, formData);
      return navigate(nextStep, { state: location.state });
    }
    
    if (skipTributes) {
      return navigate(returnTo || '/confirm-wishes');
    }
    
    // When continuing the flow normally, go to tributes with clean state
    navigate('/tributes-ceremony', {
      state: {
        previousPage: location.pathname,
        isEditing: false,  // Explicitly false for forward navigation
        returnTo: '/confirm-wishes'  // Standard return point
      }
    });
  };
  const getStepData = () => {
    // Persist selection
    if (selectedCardId) {
      const selected = donationOptions.find(card => card.id === selectedCardId);
      return {
        restingPlace: {
          ...formData.restingPlace,
          donation: {
            choice: selectedCardId,
            details: {
              id: selected.id,
              title: selected.title,
              description: selected.description,
            }
          }
        }
      };
    }
    return null;
  };

  const getNextRoute = () => {
    // Smart navigation based on editing context
    if (isEditing) {
      const relevantSteps = location.state?.relevantSteps || [];
      const nextStep = getNextEditingStep('/resting-place-donate', relevantSteps, formData);
      return nextStep;
    }
    
    if (skipTributes) {
      return returnTo || '/confirm-wishes';
    }
    
    return '/tributes-ceremony';
  };

  return (
    <PlanningLayout
     title={<><span className="h1b">Resting</span> <span className="h1">Place</span></>}
      subtitle="How the final gift will be remembered."
      currentStep={4}
      currentSubStep={1}      onGoBack={handleGoBack}
      onSkip={handleSkip}
      getStepData={getStepData}
      nextRoute={getNextRoute()}
      skipButtonText={isEditing ? 'Cancel' : 'Skip'}
      continueButtonText={isEditing ? 'Save & Return' : 'Save & Continue'}
      showSkipButton={true}
    >
      <div className="choice-cards-container">
        {donationOptions.map(card => (
          <ChoiceCard
            key={card.id}
            icon={card.icon}
            title={card.title}
            description={card.description}
            isSelected={selectedCardId === card.id}
            onClick={() => handleCardClick(card.id)}
          />
        ))}
      </div>
    </PlanningLayout>
  );
};

export default RestingPlaceDonate;
