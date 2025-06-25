// src/components/PlanningSteps/RestingPlaceScattering.jsx

import React, { useState } from 'react';
import PlanningLayout from './PlanningLayout';
import ChoiceCard from '../ChoiceCard';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePlanningData } from '../../context/PlanningDataContext';
import { getNextEditingStep } from '../../utils/editingNavigation';

const RestingPlaceScattering = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { formData, updateFormData } = usePlanningData();

  // Extract state parameters but DON'T navigate immediately
  const { isEditing, returnTo, skipTributes, previousPage } = location.state || {};

  // Initialize from context if available
  const [selectedCardId, setSelectedCardId] = useState(
    formData.restingPlace?.cremation?.choice || null
  );

  const restingOptions = [
    {
      id: 'nature',
      icon: <img src="/Picture/icons/tree-simple.svg" alt="Return to Nature Icon" />, 
      title: 'Nature',
      description: 'Return to the earth in a forest, lake, or other meaningful natural setting.',
    },
    {
      id: 'aerial',
      icon: <img src="/Picture/icons/cloud-aerial.svg" alt="Aerial Icon" />, 
      title: 'Aerial',
      description: 'A symbolic farewell in the sky, releasing your ashes into the wind.',
    },
    {
      id: 'meaningful-location',
      icon: <img src="/Picture/icons/heart-meaningful.svg" alt="Meaningful Location Icon" />, 
      title: 'Meaningful Location',
      description: 'A special place tied to your life, memories, or personal journey.',
    },
  ];

  const handleCardClick = (id) => {
    setSelectedCardId(id === selectedCardId ? null : id);
  };

  // FIXED: Handle edit mode in handleGoBack
  const handleGoBack = () => {
    if (isEditing) {
      return navigate(returnTo || '/confirm-wishes');
    }
    navigate(previousPage || '/farewell-care-cremation');
  };

  // Update handleSkip with dynamic paths
  const handleSkip = () => {
    if (isEditing) {
      return navigate(returnTo || '/confirm-wishes');
    }
    if (skipTributes) {
      return navigate(returnTo || '/confirm-wishes');
    }
    navigate('/tributes-ceremony', { 
      state: {
        previousPage: location.pathname,
        isEditing: false,
        returnTo: '/confirm-wishes'
      }
    });
  };
  // Update handleSaveContinue with dynamic paths
  const getStepData = () => {
    // Only save data if a selection was made
    if (selectedCardId) {
      // Find the selected card to store its details
      const selectedCard = restingOptions.find(card => card.id === selectedCardId);
      
      return {
        restingPlace: {
          ...formData.restingPlace, // Preserve existing resting place data
          cremation: {
            choice: selectedCardId,
            details: {
              id: selectedCard.id,
              title: selectedCard.title,
              description: selectedCard.description
            }
          }
        }
      };
    }
    return null;
  };

  const getNextRoute = () => {
    // Smart navigation logic
    if (isEditing) {
      // Get the editing context from the location state
      const relevantSteps = location.state?.relevantSteps || [];
      const returnTo = location.state?.returnTo || '/confirm-wishes';
      
      // Calculate the next step using the utility
      const nextStep = getNextEditingStep(location.pathname, relevantSteps, formData);
      
      // Return the next logical step, or back to the summary if finished
      return nextStep;
    }
    
    // For skip tributes or normal flow
    if (skipTributes) {
      return returnTo || '/confirm-wishes';
    }
    
    return '/tributes-ceremony';
  };

  return (
    <PlanningLayout
     title={<><span className="h1b">Resting</span> <span className="h1">Place</span></>}
      subtitle="Choose where your ashes will be released."
      currentStep={4} // Resting Place is step 4
      currentSubStep={2} // Adding substep indicator - second screen in cremation flow      onGoBack={handleGoBack}
      onSkip={handleSkip}
      getStepData={getStepData}
      nextRoute={getNextRoute()}
      skipButtonText={isEditing ? "Cancel" : "Skip"}
      continueButtonText={isEditing ? "Save & Return" : "Save & Continue"}
    >
      <div className="choice-cards-container">
        {restingOptions.map((card) => (
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

// FIXED: Export matches component name
export default RestingPlaceScattering;
