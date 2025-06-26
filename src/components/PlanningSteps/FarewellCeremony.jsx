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
    const { formData } = usePlanningData();
    
    // This line is safe and correctly uses optional chaining.
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

  const getStepData = () => {
    if (selectedCardId) {
      const selectedCard = cardOptions.find(card => card.id === selectedCardId);
      
      // *** THE FIX ***
      // This guard clause prevents the component from crashing if the user clicks
      // "Save & continue" without making a selection. In that case, selectedCard
      // would be undefined, and trying to access selectedCard.id would crash the app.
      if (!selectedCard) {
        return {};
      }
      
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
    return {};
  };

  const getNextRoute = () => {
    if (isEditing) {
      const relevantSteps = location.state?.relevantSteps || [];
      const returnTo = location.state?.returnTo || '/confirm-wishes';
      return getNextEditingStep(location.pathname, relevantSteps, formData);
    } else {
      return '/farewell-care';
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
