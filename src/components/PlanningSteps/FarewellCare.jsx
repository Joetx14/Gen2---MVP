import React, { useState } from 'react';
import PlanningLayout from './PlanningLayout';
import ChoiceCard from '../ChoiceCard';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePlanningData } from '../../context/PlanningDataContext';
import { getNextEditingStep, getPreviousEditingStep } from '../../utils/editingNavigation';

const FarewellCare = ({ setFarewellCareChoice, isEditing, returnTo }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { formData, updateFormData } = usePlanningData();
  
  // Initialize from context if available
  const [selectedCardId, setSelectedCardId] = useState(
    formData.farewellCare?.choice || null
  );

  const careOptions = [
    {
      id: 'burial',
      icon: <img src="/Picture/icons/casket-picture.svg" alt="Casket Icon" />,
      title: 'Burial',
      description: 'Timeless resting place, where memories can continue to be shared.',
    },
    {
      id: 'cremation',
      icon: <img src="/Picture/icons/cremation.svg" alt="Cremation Icon" />,
      title: 'Cremation',
      description: 'Supports any type of remeberance or ways to honor a life well lived.',
    },
    {
      id: 'alternatives',
      icon: <img src="/Picture/icons/alternatives.svg" alt="Alternatives Icon" />,
      title: 'Alternatives',
      description:'Personalized farewells such as keepsakes, donation, or eco-conscious.',
    },
  ];

  const handleCardClick = (id) => {
    setSelectedCardId(id === selectedCardId ? null : id);
  };
  const handleGoBack = () => {
    if (isEditing) {
      const relevantSteps = location.state?.relevantSteps || [];
      const previousStep = getPreviousEditingStep('/farewell-care', relevantSteps, returnTo);
      navigate(previousStep, { state: location.state });
    } else {
      navigate('/farewell-ceremony');
    }
  };
  const handleSkip = () => {
    // Skip directly to tributes
    navigate('/tributes-ceremony');
  };

  // Create getStepData function that returns this step's data
  const getStepData = () => {
    // Save the selected option to context
    if (selectedCardId) {
      // Find selected card and save details
      const selectedCard = careOptions.find(card => card.id === selectedCardId);
      
      return {
        farewellCare: {
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

  // Determine next route based on editing state and selection
  const getNextRoute = () => {
    if (!selectedCardId) {
      return '/tributes-ceremony'; // Default route if no selection
    }

    if (isEditing) {
      const previousChoice = location.state?.currentCareChoice;
      const relevantSteps = location.state?.relevantSteps || [];
      
      // If changing between care types, ensure we collect the new details
      if (previousChoice !== selectedCardId) {
        // Route to appropriate details page based on new selection
        if (selectedCardId === 'cremation') {
          return '/farewell-care-cremation';
        }
        
        if (selectedCardId === 'burial') {
          return '/farewell-care-burial';
        }
        
        if (selectedCardId === 'alternatives') {
          return '/care-alternatives';
        }
      }
      
      // Use smart navigation to next relevant step or return to confirm wishes
      return getNextEditingStep('/farewell-care', relevantSteps, formData);
    } else {
      // Normal flow - routing based on selection
      if (selectedCardId === 'cremation') {
        return '/farewell-care-cremation';
      } else if (selectedCardId === 'burial') {
        return '/farewell-care-burial';
      } else if (selectedCardId === 'alternatives') {
        return '/care-alternatives';
      } else {
        return '/tributes-ceremony'; // Default route
      }
    }
  };
  return (
    <PlanningLayout
      title={<><span className="h1b">Farewell</span> <span className="h1">Care</span></>}
      subtitle="Honoring our wishes and remains."
      currentStep={3}
      currentSubStep={1} // First substep - main choice
      onGoBack={handleGoBack}
      getStepData={getStepData}
      nextRoute={getNextRoute()}
      onSkip={handleSkip} // Add this line to enable skip functionality
    >
      <div className="choice-cards-container">
        {careOptions.map((card) => (
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

export default FarewellCare;
