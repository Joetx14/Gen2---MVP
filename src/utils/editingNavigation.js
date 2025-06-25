// src/utils/editingNavigation.js

/**
 * Determines the relevant planning steps that need to be edited based on user choices
 * This creates a focused editing experience instead of going through all steps
 */

export const getRelevantEditingSteps = (formData, editingSection) => {
  const relevantSteps = {
    ceremony: ['/farewell-ceremony'],
    
    care: ['/farewell-care'],
    
    careDetails: (() => {
      const careChoice = formData.farewellCare?.choice;
      const steps = ['/farewell-care'];
      
      if (careChoice === 'cremation') {
        steps.push('/farewell-care-cremation');
      } else if (careChoice === 'burial') {
        steps.push('/farewell-care-burial');
      } else if (careChoice === 'alternatives') {
        steps.push('/care-alternatives');
      }
      
      return steps;
    })(),
    
    restingPlace: (() => {
      const careChoice = formData.farewellCare?.choice;
      const steps = [];
      
      // Start with care page to show context
      steps.push('/farewell-care');
      
      if (careChoice === 'cremation') {
        steps.push('/farewell-care-cremation');
        
        // Add resting place steps based on cremation choice
        const cremationChoice = formData.farewellCare?.cremation?.choice;
        if (cremationChoice === 'scattering') {
          steps.push('/resting-place-scattering');
        } else if (cremationChoice === 'memorial') {
          steps.push('/resting-place-memorial');
        }
      } else if (careChoice === 'burial') {
        steps.push('/farewell-care-burial');
        steps.push('/resting-place-burial');
      } else if (careChoice === 'alternatives') {
        steps.push('/care-alternatives');
        
        // Add alternative-specific resting place
        const altChoice = formData.farewellCare?.alternatives?.choice;
        if (altChoice === 'return-to-nature') {
          steps.push('/resting-place-nature');
        } else if (altChoice === 'donate-to-science') {
          steps.push('/resting-place-donate');
        }
      }
      
      return steps;
    })(),
    
    tributes: ['/tributes-ceremony', '/tributes-speaker', '/tributes-story'],
    
    'tributes-ceremony': ['/tributes-ceremony'],
    'tributes-speaker': ['/tributes-speaker'],
    'tributes-story': ['/tributes-story']
  };
  
  return relevantSteps[editingSection] || [];
};

/**
 * Gets the next step in the editing flow based on current step and relevant steps
 */
export const getNextEditingStep = (currentStep, relevantSteps, formData) => {
  const currentIndex = relevantSteps.indexOf(currentStep);
  
  if (currentIndex === -1 || currentIndex === relevantSteps.length - 1) {
    // If at end of relevant steps or not found, return to confirm wishes
    return '/confirm-wishes';
  }
  
  return relevantSteps[currentIndex + 1];
};

/**
 * Gets the previous step in the editing flow
 */
export const getPreviousEditingStep = (currentStep, relevantSteps, returnTo) => {
  const currentIndex = relevantSteps.indexOf(currentStep);
  
  if (currentIndex <= 0) {
    // If at beginning, return to confirm wishes
    return returnTo || '/confirm-wishes';
  }
  
  return relevantSteps[currentIndex - 1];
};

/**
 * Determines if we should skip tributes based on the editing context
 */
export const shouldSkipTributes = (editingSection) => {
  const skipTributeSections = ['care', 'careDetails', 'restingPlace'];
  return skipTributeSections.includes(editingSection);
};

/**
 * Creates navigation state for editing with relevant steps context
 */
export const createEditingNavState = (editingSection, formData, returnTo = '/confirm-wishes') => {
  const relevantSteps = getRelevantEditingSteps(formData, editingSection);
  
  return {
    isEditing: true,
    returnTo,
    editingSection,
    relevantSteps,
    skipTributes: shouldSkipTributes(editingSection),
    fromConfirmScreen: true
  };
};
