import React, { useState } from 'react';
import PlanningLayout from './PlanningLayout';
import ChoiceCard from '../ChoiceCard';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePlanningData } from '../../context/PlanningDataContext';
import { getNextEditingStep } from '../../utils/editingNavigation';

const RestingPlaceBurial = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isEditing, returnTo, skipTributes, previousPage } = location.state || {};
  const { formData, updateFormData } = usePlanningData();
  
  // Initialize from context if available
  const [selectedCardId, setSelectedCardId] = useState(
    formData.restingPlace?.burial?.choice || null
  );

  const burialOptions = [
    {
      id: 'family-plot',
      icon: <img src="/Picture/icons/3-headstone.svg" alt="Family Plot Icon" />, 
      title: 'Family Plot',
      description: 'Comforting place of legacy, tradition and shared remembrance.',
    },
    {
      id: 'cemetery-placement',
      icon: <img src="/Picture/icons/heart-meaningful.svg" alt="Cemetery Icon" />, 
      title: 'Cemetery',
      description: 'Peaceful setting with everlasting tribute to cherished memories.',
    },
    {
      id: 'ocean-return',
      icon: <img src="/Picture/icons/wave.svg" alt="Ocean Return Icon" />, 
      title: 'Ocean Burial',
      description: 'Serene and timeless return to the natural world.',
    },
  ];

  const handleCardClick = (id) => {
    setSelectedCardId(id === selectedCardId ? null : id);
  };

  const handleGoBack = () => {
    if (isEditing) {
      return navigate(returnTo || '/confirm-wishes');
    }
    navigate(previousPage || '/farewell-care-burial');
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
      const selectedCard = burialOptions.find(card => card.id === selectedCardId);
      
      return {
        restingPlace: {
          ...formData.restingPlace, // Preserve existing resting place data
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
      subtitle="Timeless spaces to honor each journey."
      currentStep={4} // Resting Place is step 4
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

export default RestingPlaceBurial;
