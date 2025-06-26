// src/components/PlanningSteps/FarewellCareCremation.jsx
import React, { useState } from 'react';
import PlanningLayout from './PlanningLayout';
import ChoiceCard from '../ChoiceCard';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePlanningData } from '../../context/usePlanningData';
import { getNextEditingStep } from '../../utils/editingNavigation';

const FarewellCareCremation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isEditing, returnTo, skipTributes } = location.state || {};
  const { formData } = usePlanningData(); // Removed updateFormData as it's handled by PlanningLayout
  
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
    navigate('/tributes-ceremony');
  };

  const getStepData = () => {
    if (selectedCardId) {
      const selectedCard = cremationOptions.find(card => card.id === selectedCardId);
      
      if (!selectedCard) {
        console.error('Selected card not found in options');
        return {};
      }
      
      // *** THE FIX ***
      // This now correctly structures the data for this specific step,
      // ensuring we don't accidentally merge old data from other user paths (like burial).
      return {
        farewellCareDetails: {
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
    return {};
  };

  const getNextRoute = () => {
    if (isEditing) {
        const relevantSteps = location.state?.relevantSteps || [];
        return getNextEditingStep(location.pathname, relevantSteps, formData);
    } 
    
    if (skipTributes) {
      return returnTo || '/confirm-wishes';
    } 
    
    // NORMAL USER FLOW:
    if (selectedCardId === 'scattering') {
      return '/resting-place-scattering';
    } 
    
    return '/tributes-ceremony';
  };
  
  return (
    <PlanningLayout
     title={<><span className="h1b">Farewell</span> <span className="h1">Care</span></>}
      subtitle="Keeping our memories alive."
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
