// src/components/PlanningSteps/RestingPlaceNature.jsx

import React, { useState } from 'react';
import PlanningLayout from './PlanningLayout';
import ChoiceCard from '../ChoiceCard';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePlanningData } from '../../context/usePlanningData';
import { getNextEditingStep } from '../../utils/editingNavigation';

const RestingPlaceNature = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isEditing, returnTo, skipTributes } = location.state || {};
  const { formData, updateFormData } = usePlanningData();
  
  // Initialize from context if available
  const [selectedCardId, setSelectedCardId] = useState(
    formData.restingPlace?.nature?.choice || null
  );

  const natureOptions = [
    {
      id: 'natural-burial',
      icon: <img src="/Picture/icons/heart-stem-hands.svg" alt="Natural Burial Icon" />, 
      title: 'Natural Burial',
      description: 'Return to earth and enrich the soil, supporting new life.',
    },
    {
      id: 'ocean-return',
      icon: <img src="/Picture/icons/wave.svg" alt="Ocean Return Icon" />, 
      title: 'Ocean Return',
      description: 'A symbolic return to sea to become part of the ocean\'s natural cycle.',
    },
    {
      id: 'tree-planting',
      icon: <img src="/Picture/icons/tree-nature.svg" alt="Tree Planting Icon" />, 
      title: 'Tree Planting',
      description: 'Ashes can be planted in biodegradable urns that grow a tree as a living memorial.',
    },
  ];

  const handleCardClick = (id) => {
    setSelectedCardId(id === selectedCardId ? null : id);
  };

  const handleGoBack = () => {
    if (isEditing) {
      navigate(returnTo || '/confirm-wishes');
    } else {
      navigate('/care-alternatives'); // Make sure this is your correct previous page
    }
  };

  const handleSkip = () => {
    if (isEditing || skipTributes) {
      navigate(returnTo || '/confirm-wishes');
    } else {
      navigate('/tributes-ceremony', { 
        state: {
          previousPage: location.pathname, // Dynamic path instead of hardcoded
          isEditing: false,
          returnTo: '/confirm-wishes'
        }
      });
    }
  };
  const getStepData = () => {
    // Only save data if a selection was made
    if (selectedCardId) {
      // Find the selected card to store its details
      const selectedCard = natureOptions.find(card => card.id === selectedCardId);
      
      return {
        restingPlace: {
          ...formData.restingPlace, // Preserve existing resting place data
          nature: {
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
      subtitle=" Honoring their connection to nature."
      currentStep={4} // Corrected from 5 to 4 - Resting Place is step 4
      currentSubStep={2} // Adding substep indicator - typically this would be the second step in this flow      onGoBack={handleGoBack}
      onSkip={handleSkip}
      getStepData={getStepData}
      nextRoute={getNextRoute()}
      skipButtonText={isEditing ? "Cancel" : "Skip"}
      continueButtonText={isEditing ? "Save & Return" : "Save & Continue"}
    >
      <div className="choice-cards-container">
        {natureOptions.map((card) => (
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

export default RestingPlaceNature;
