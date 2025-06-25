// src/components/PlanningSteps/FarewellCareCremation.jsx

import React, { useState } from 'react';
import PlanningLayout from './PlanningLayout';
import ChoiceCard from '../ChoiceCard';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePlanningData } from '../../context/usePlanningData';
import { getNextEditingStep } from '../../utils/editingNavigation';

// Remove unused prop if you're fully using context
const FarewellCareCremation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isEditing, returnTo, skipTributes } = location.state || {};
  const { formData, updateFormData } = usePlanningData();
    // Initialize from context if available, but don't pre-select for new users
  const [selectedCardId, setSelectedCardId] = useState(
    formData.farewellCareDetails?.cremation?.choice || null
  );

  const cremationOptions = [
    {
      id: 'kept-at-home',
      icon: <img src="/Picture/icons/kept-at-home-cremation.svg" alt="Kept at Home Icon" />, 
      title: 'Kept at Home',
      description: 'Offers comfort and a lasting presence with loved ones.',
    },
    {
      id: 'cemetery-placement',
      icon: <img src="/Picture/icons/cemetery-cremation.svg" alt="Cemetery Placement Icon" />, 
      title: 'Cemetery Placement',
      description: 'Eternal remeberance space above or below ground.',
    },
    {
      id: 'scattering',
      icon: <img src="/Picture/icons/scattering-cremation.svg" alt="Scattering Icon" />, 
      title: 'Scattering',
      description: 'Peaceful release to a place meaningful to our memory.',
    },
  ];

  const handleCardClick = (id) => {
    setSelectedCardId(id === selectedCardId ? null : id);
  };

  const handleGoBack = () => {
    if (isEditing) {
      navigate(returnTo || '/confirm-wishes');
    } else {
      navigate('/farewell-care');
    }
  };
  const handleSkip = () => {
    // When skipping, go to tributes
    navigate('/tributes-ceremony');
  };

  // Create getStepData function that returns this step's data
  const getStepData = () => {
    // Only save data if a selection was made
    if (selectedCardId) {
      // Find the selected card to store its details
      const selectedCard = cremationOptions.find(card => card.id === selectedCardId);
      
      if (!selectedCard) {
        console.error('Selected card not found in options');
        return {};
      }
      
      return {
        farewellCareDetails: {
          ...formData.farewellCareDetails,
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
    
    // Return empty object if no selection
    return {};
  };

  // Determine next route based on editing state and selection
  const getNextRoute = () => {
    if (isEditing) {
      if (selectedCardId) {
        const previousChoice = location.state?.currentCareChoice;
        const relevantSteps = location.state?.relevantSteps || [];
        
        // If changing between care types or scattering selected, handle appropriately
        if (selectedCardId === 'scattering') {
          return '/resting-place-scattering';
        }
        
        // Use smart navigation to next relevant step
        return getNextEditingStep(location.pathname, relevantSteps, formData);
      } else {
        const relevantSteps = location.state?.relevantSteps || [];
        return getNextEditingStep(location.pathname, relevantSteps, formData);
      }
    } else if (skipTributes) {
      // Return to previous page when skip tributes is enabled
      return returnTo || '/confirm-wishes';
    } else {
      // NORMAL USER FLOW:
      // Only scattering option needs additional details
      if (selectedCardId === 'scattering') {
        return '/resting-place-scattering';
      } else {
        // Other cremation options don't need additional location details
        return '/tributes-ceremony';
      }
    }
  };
  return (
    <PlanningLayout
     title={<><span className="h1b">Farewell</span> <span className="h1">Care</span></>}
      subtitle="Keeping our memories alive."
      currentStep={3}
      currentSubStep={2} // Correctly identifies as second substep in Farewell Care
      onGoBack={handleGoBack}
      onSkip={handleSkip}
      getStepData={getStepData}
      nextRoute={getNextRoute()}
      skipButtonText={isEditing ? "Cancel" : "Skip"}
      continueButtonText={isEditing ? "Save & Return" : "Save & Continue"}
    >
      <div className="choice-cards-container">
        {cremationOptions.map((card) => (
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

export default FarewellCareCremation;
