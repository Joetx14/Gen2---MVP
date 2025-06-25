import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PlanningLayout from './PlanningLayout';
import ChoiceCard from '../ChoiceCard';
import { usePlanningData } from '../../context/usePlanningData';
import { getNextEditingStep } from '../../utils/editingNavigation';

const FarewellCeremony = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isEditing, returnTo } = location.state || {};
    const { formData, updateFormData } = usePlanningData();
    
    // Initialize from context if available
    const [selectedCardId, setSelectedCardId] = useState(
      formData.farewellCeremony?.choice || null
    );
  
    const cardOptions = [
      {
        id: 'memorial-service',
        icon: <img src="/Picture/icons/memorial-service.svg" alt="Memorial Service Icon" />,
        title: 'Memorial Service',
        description: 'Gathering held to honor a life with flexibility in location and timing.',
      },
      {
        id: 'celebration-of-life',
        icon: <img src="/Picture/icons/celebration-of-life.svg" alt="Celebration of Life Icon" />,
        title: 'Celebration of Life',
        description: 'Joyful gathering often focused on celebrating a unique life lived.',
      },
      {
        id: 'traditional-funeral',
        icon: <img src="/Picture/icons/reef.svg" alt="Reef Icon" />,
        title: 'Traditional Funeral',
        description: 'Respected choice with you present during a formal farewell.',
      },
    ];
  
    const handleCardClick = (id) => {
      setSelectedCardId(id === selectedCardId ? null : id);
    };
  
    const handleGoBack = () => {
      navigate('/basic-information');
    };
  
  const handleSkip = () => {
    navigate('/farewell-care');
  };

  // Create getStepData function that returns this step's data
  const getStepData = () => {
    // Only return data if a selection was made
    if (selectedCardId) {
      // Find the selected card to store its details
      const selectedCard = cardOptions.find(card => card.id === selectedCardId);
      
      return {
        farewellCeremony: {
          choice: selectedCardId,
          details: {
            id: selectedCard.id,
            title: selectedCard.title,
            description: selectedCard.description
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
      const returnTo = location.state?.returnTo || '/confirm-wishes';
      
      // Calculate the next step using the utility
      return getNextEditingStep(location.pathname, relevantSteps, formData);
    } else {
      return '/farewell-care'; // Normal flow to next page
    }
  };
  
  return (
    <PlanningLayout
      title={<><span className="h1b">Farewell</span> <span className="h1">Ceremony</span></>}
      subtitle="Celebrating life and legacy."
      currentStep={2}
      onGoBack={handleGoBack}    
      onSkip={handleSkip}        
      getStepData={getStepData}
      nextRoute={getNextRoute()}
      skipButtonText={isEditing ? "Cancel" : "Skip"}
      continueButtonText={isEditing ? "Save & Return" : "Save & Continue"}
      formBoxClassName="planning-formbox"
    >
        <div className="choice-cards-container">
          {cardOptions.map((card) => (
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
  
  export default FarewellCeremony;

