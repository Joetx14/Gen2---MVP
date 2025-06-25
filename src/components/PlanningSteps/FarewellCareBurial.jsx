// src/components/PlanningSteps/FarewellCareBurial.jsx

import React, { useState } from 'react';
import PlanningLayout from './PlanningLayout';
import ChoiceCard from '../ChoiceCard';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePlanningData } from '../../context/usePlanningData';
import { getNextEditingStep } from '../../utils/editingNavigation';

const FarewellCareBurial = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { formData, updateFormData } = usePlanningData();

  // Extract navigation state (prioritize router state, fallback to defaults)
  const prevState = location.state || {};
  const previousPage = prevState.previousPage || '/farewell-care';
  const isEditing = prevState.isEditing || false;
  const returnTo = prevState.returnTo || '/confirm-wishes';
  const skipTributes = prevState.skipTributes || false;

  // Local selection state
  const [selectedCardId, setSelectedCardId] = useState(
    formData.farewellCareDetails?.burial?.choice || null
  );

  const burialOptions = [
    {
      id: 'traditional-burial',
      icon: <img src="/Picture/icons/headstone.svg" alt="Headstone Icon" />,
      title: 'Traditional Burial',
      description: 'Timeless place of remembrance in a cemetery or family plot.',
    },
    {
      id: 'green-burial',
      icon: <img src="/Picture/icons/green-burial.svg" alt="Green Burial Icon" />, 
      title: 'Green Burial',
      description: 'Natural return to the earth, honoring both life and the environment.',
    },
    {
      id: 'special-memorial',
      icon: <img src="/Picture/icons/special-memorial.svg" alt="Special Memorial Icon" />, 
      title: 'Special Memorial',
      description: 'Lasting tribute such as a dedicated space that reflects a cherished life.',
    },
  ];

  const handleCardClick = (id) => {
    setSelectedCardId(id === selectedCardId ? null : id);
  };

  const handleGoBack = () => {
    if (isEditing) {
      return navigate(returnTo);
    }
    navigate(previousPage);
  };
  const handleSkip = () => {
    if (isEditing) {
      return navigate(returnTo);
    }
    if (skipTributes) {
      return navigate(returnTo);
    }
    // Proceed to resting-place-burial step, preserving context
    navigate('/resting-place-burial', {
      state: { previousPage, isEditing, returnTo, skipTributes }
    });
  };

  // Create getStepData function that returns this step's data
  const getStepData = () => {
    // Save burial selection if chosen
    if (selectedCardId) {
      const selectedCard = burialOptions.find(card => card.id === selectedCardId);
      return {
        farewellCareDetails: {
          ...formData.farewellCareDetails,
          burial: {
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

  // Determine next route based on editing state
  const getNextRoute = () => {
    if (isEditing) {
      // Get the editing context from the location state
      const relevantSteps = location.state?.relevantSteps || [];
      
      // Calculate the next step using the utility
      return getNextEditingStep(location.pathname, relevantSteps, formData);
    }
    
    // For skip tributes or normal flow
    if (skipTributes) {
      return returnTo;
    }
    
    // Navigate to resting place burial instead of tributes ceremony
    return '/resting-place-burial';
  };
  return (
    <PlanningLayout
     title={<><span className="h1b">Farewell</span> <span className="h1">Care</span></>}
      subtitle="Keeping memories alive. "
      currentStep={3}
      currentSubStep={2}
      onGoBack={handleGoBack}
      onSkip={handleSkip}
      getStepData={getStepData}
      nextRoute={getNextRoute()}
      skipButtonText={isEditing ? "Cancel" : "Skip"}
      continueButtonText={isEditing ? "Save & Return" : "Save & Continue"}
    >
      <div className="choice-cards-container">
        {burialOptions.map((card) => (
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

export default FarewellCareBurial;
