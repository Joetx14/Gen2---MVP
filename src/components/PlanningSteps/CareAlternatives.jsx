// src/components/PlanningSteps/CareAlternatives.jsx

import React, { useState } from 'react';
import PlanningLayout from './PlanningLayout';
import ChoiceCard from '../ChoiceCard';
import { useNavigate, useLocation } from 'react-router-dom'; // Add useLocation
import { usePlanningData } from '../../context/usePlanningData';

const CareAlternatives = ({ setAlternativeChoice }) => {
  const navigate = useNavigate();
  const location = useLocation(); // Get location for state
  const { formData, updateFormData } = usePlanningData();
  
  // Check if in edit mode and where to return to
  const { isEditing, returnTo, skipTributes } = location.state || {};
  
  // Initialize from context if available
  const [selectedCardId, setSelectedCardId] = useState(
    formData.farewellCareDetails?.alternatives?.choice || null
  );

  const alternativesOptions = [
    {
      id: 'memorialization',
      icon: <img src="/Picture/icons/special-memorial.svg" alt="Memorialization Icon" />,
      title: 'Memorialization',
      description: 'Lasting remembrance with a dedicated space, monument, or meaningful art.',
    },
    {
      id: 'return-to-nature',
      icon: <img src="/Picture/icons/green-burial.svg" alt="Return to Nature Icon" />,
      title: 'Return to Nature',
      description: 'Become one with the earth, nurturing our environment and future growth.',
    },
    {
      id: 'donate-body',
      icon: <img src="/Picture/icons/heart-meaningful.svg" alt="Donate Body Icon" />,
      title: 'Gift Remains',
      description: 'Supporting medical advancement and a legacy of helping others.',
    },
  ];

  const handleCardClick = (id) => {
    setSelectedCardId(id === selectedCardId ? null : id);
  };

  const handleGoBack = () => {
    if (isEditing || skipTributes) {
      navigate(returnTo || '/confirm-wishes');
    } else {
      navigate('/farewell-care');
    }
  };

  const handleSkip = () => {
    if (isEditing || skipTributes) {
      navigate(returnTo || '/confirm-wishes');
    } else {
      navigate('/tributes-ceremony'); // Skip directly to tributes
    }
  };
  const getStepData = () => {
    if (selectedCardId) {
      const selectedCard = alternativesOptions.find(card => card.id === selectedCardId);
      
      // Maintain backwards compatibility with props
      if (setAlternativeChoice) {
        setAlternativeChoice(selectedCardId);
      }
      
      return {
        farewellCareDetails: {
          alternatives: {
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
    // If in edit mode, return to the confirmation page
    if (isEditing || skipTributes) {
      return returnTo || '/confirm-wishes';
    }
    
    // Dynamic routing based on selection
    if (selectedCardId === 'memorialization') {
      return '/resting-place-memorial';
    } else if (selectedCardId === 'return-to-nature') {
      return '/resting-place-nature';
    } else if (selectedCardId === 'donate-body') {
      return '/resting-place-donate';
    }
    
    // Default route if no selection or unknown selection
    return '/tributes-ceremony';
  };
  return (
    <PlanningLayout
      title={<><span className="h1b">Farewell</span> <span className="h1">Care</span></>}
      subtitle="Personalized tributes for unique legacies"
      currentStep={4}
      onGoBack={handleGoBack}
      onSkip={handleSkip}
      getStepData={getStepData}
      nextRoute={getNextRoute()}
      skipButtonText={isEditing ? "Cancel" : "Skip"}
      continueButtonText={isEditing ? "Save & Return" : "Save & Continue"}
      hideSkipButton={isEditing && !selectedCardId} // Hide skip button if editing and no selection
    >
      <div className="choice-cards-container">
        {alternativesOptions.map((card) => (
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

export default CareAlternatives;
