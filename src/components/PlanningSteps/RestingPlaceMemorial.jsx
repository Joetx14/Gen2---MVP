// src/components/PlanningSteps/RestingPlaceMemorial.jsx

import React, { useState } from 'react';
import PlanningLayout from './PlanningLayout';
import ChoiceCard from '../ChoiceCard';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePlanningData } from '../../context/usePlanningData';
import { getNextEditingStep } from '../../utils/editingNavigation';

const RestingPlaceMemorial = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isEditing, returnTo, skipTributes, previousPage } = location.state || {};
  const { formData, updateFormData } = usePlanningData();
  
  // Initialize from context if available
  const [selectedCardId, setSelectedCardId] = useState(
    formData.restingPlace?.memorial?.choice || null
  );

  const memorialOptions = [
    {
      id: 'keepsake-jewelry',
      icon: <img src="/Picture/icons/hand-diamond.svg" alt="Keepsake Jewelry Icon" />, 
      title: 'Keepsake Jewelry',
      description: 'Turn ashes into meaningful jewelry, carrying your loved one close every day.',
    },
    {
      id: 'memorial-art',
      icon: <img src="/Picture/icons/pictureframe.svg" alt="Memorial Art Icon" />, 
      title: 'Memorial Art',
      description: 'Create lasting artwork from ashes—paintings, pottery, or glass as a tribute.',
    },
    {
      id: 'living-space',
      icon: <img src="/Picture/icons/flowers.svg" alt="Living Space Icon" />, 
      title: 'Living Space',
      description: 'Design a garden or tribute space where loved ones can gather and reflect.',
    },
  ];

  const handleCardClick = (id) => {
    setSelectedCardId(id === selectedCardId ? null : id);
  };

  const handleGoBack = () => {
    if (isEditing) {
      return navigate(returnTo || '/confirm-wishes');
    }
    navigate(previousPage || '/care-alternatives');
  };

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
  const getStepData = () => {
    // Only save data if a selection was made
    if (selectedCardId) {
      // Find the selected card to store its details
      const selectedCard = memorialOptions.find(card => card.id === selectedCardId);
      
      return {
        restingPlace: {
          ...formData.restingPlace, // Preserve other resting place details
          memorial: {
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
      subtitle=" Lasting ways to keep our memories close."
      currentStep={4} // Changed from 6 to 4 - Resting Place is step 4
      currentSubStep={2} // Adding substep - this appears to be a second step after initial choice      onGoBack={handleGoBack}
      onSkip={handleSkip}
      getStepData={getStepData}
      nextRoute={getNextRoute()}
      skipButtonText={isEditing ? "Cancel" : "Skip"}
      continueButtonText={isEditing ? "Save & Return" : "Save & Continue"}
    >
      <div className="choice-cards-container">
        {memorialOptions.map((card) => (
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

export default RestingPlaceMemorial;
