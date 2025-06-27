// src/components/PlanningSteps/ConfirmWishes.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlanningData } from '../../context/usePlanningData';
import { useAuth } from '../../context/useAuth';
import { useCollaborators } from '../../context/useCollaborators';
import { createEditingNavState } from '../../utils/editingNavigation';

import PrimaryButton from '../buttons/PrimaryButton';
import SecondaryButton from '../buttons/SecondaryButton';
import ConfirmWishesDisplay from './ConfirmWishesDisplay'; // USE THE DISPLAY COMPONENT
import '../../styles/PlanningSteps/ConfirmWishes.css';

const ConfirmWishes = () => {
  const {
  formData,
  updateFormData, // ✅ Use this
  isLoading: isPlanningDataLoading,
  error: planningDataError,
} = usePlanningData();

  const { isAuthenticated, isLoading: isAuthLoading, user } = useAuth(); // Auth state

  // Add this debug code at the top of your ConfirmWishes component
  useEffect(() => {
    console.log("Auth state:", { isAuthenticated, user });
  }, [isAuthenticated, user]);

  const collaboratorsContext = useCollaborators();
  const collaborators = collaboratorsContext?.collaborators || [];
  const isCollaboratorsLoading = collaboratorsContext?.isLoading || false;

  const [isSubmitting, setIsSubmitting] = useState(false); // Local state for "Save & Share" action
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const handleEdit = (sectionKey) => {
    // Use the new editing navigation utility
    const editNavState = createEditingNavState(sectionKey, formData, '/confirm-wishes');
    
    switch (sectionKey) {
      case 'ceremony':
        navigate('/farewell-ceremony', { state: editNavState });
        break;
        
      case 'care':
        navigate('/farewell-care', {
          state: {
            ...editNavState,
            currentCareChoice: formData.farewellCare?.choice
          }
        });
        break;
        
      case 'careDetails':
        const careChoice = formData.farewellCare?.choice;
        if (careChoice === 'cremation') {
          const cremationOption = formData.farewellCareDetails?.cremation?.choice;
          if (cremationOption === 'scattering') {
            navigate('/resting-place-scattering', {
              state: {
                ...editNavState,
                source: 'cremation',
                skipTributes: true
              }
            });
          } else {
            navigate('/farewell-care-cremation', {
              state: {
                ...editNavState,
                skipTributes: true
              }
            });
          }
        } else if (careChoice === 'burial') {
          navigate('/farewell-care-burial', {
            state: {
              ...editNavState,
              skipTributes: true
            }
          });
        } else if (careChoice === 'alternatives') {
          navigate('/care-alternatives', {
            state: {
              ...editNavState,
              skipTributes: true
            }
          });
        } else {
          navigate('/farewell-care', {
            state: {
              ...editNavState,
              skipTributes: true
            }
          });
        }
        break;
        
      case 'tributes-ceremony':
        navigate('/tributes-ceremony', { state: editNavState });
        break;
      case 'tributes-speaker':
        navigate('/tributes-speaker', { state: editNavState });
        break;
      case 'tributes-story':
        navigate('/tributes-story', { state: editNavState });
        break;
      case 'restingPlace':
        const careType = formData.farewellCare?.choice;
        if (careType === 'cremation' && formData.farewellCareDetails?.cremation?.choice === 'scattering') {
          navigate('/resting-place-scattering', { state: editNavState });
        } else if (careType === 'alternatives') {
          const altChoice = formData.farewellCareDetails?.alternatives?.choice;
          if (altChoice === 'memorialization') {
            navigate('/resting-place-memorial', { state: editNavState });
          } else if (altChoice === 'return-to-nature') {
            navigate('/resting-place-nature', { state: editNavState });
          } else if (altChoice === 'donate-body') {
            navigate('/resting-place-donate', { state: editNavState });
          }
        } else if (careType === 'burial') {
          navigate('/resting-place-burial', { state: editNavState });
        }
        break;
      case 'basicInfo':
        navigate('/basic-information', { state: editNavState });
        break;
      default:
        navigate('/basic-information', { state: editNavState });
    }
  };

  // Restore real backend save/auth logic
  const handleSaveAndShare = async () => {
  setIsSubmitting(true);
  setSubmitError(null);
  try {
    await updateFormData(formData); // ✅ Use updateFormData
    navigate('/add-collaborators', { state: { fromConfirmWishes: true } });
  } catch (error) {
    console.error('Error:', error);
    setSubmitError('An error occurred while saving your plan. Please try again.');
  } finally {
    setIsSubmitting(false);
  }
};

  const handleGoBack = () => {
    navigate('/tributes-story'); // Assuming this is the correct previous step
  };

  // Updated handleManageCollaborators to remove the auth check
  const handleManageCollaborators = () => {
    // No authentication check needed since this is a protected route
    navigate('/collaborator/dashboard');
  };

  // Add this near the top of your component, after the header but before the ConfirmWishesDisplay component
  const handleViewCollaborators = () => {
    navigate('/collaborator/dashboard');
  };

  // This loading state is for the overall page readiness before major content display
  const pageInitialLoadInProgress = isAuthLoading || (isPlanningDataLoading && (!formData || !formData.basicInformation));

  if (pageInitialLoadInProgress) {
    return <div className="loading-container" style={{ textAlign: 'center', padding: '50px' }}>Loading your plan details...</div>;
  }

  if (planningDataError && (!formData || !formData.basicInformation)) {
    return (
      <div className="error-container" style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
        Error loading your plan: {planningDataError}.
        <br />
        <SecondaryButton onClick={() => window.location.reload()} style={{ marginTop: '1rem' }}>
          Try Again
        </SecondaryButton>
      </div>
    );
  }

  return (
    <div className="confirm-wishes-page-wrapper">
      <div className="confirm-wishes-header-container">
        <h1>
          <span className="h1b">Farewell</span>
          <span className="h1">Wishes</span>
        </h1>
        <span className="h1sub">Confirm your choices before your share. You can update them anytime.</span>
      </div>

      {/* Only show "Shared With" button when collaborators exist */}
      {collaborators && collaborators.length > 0 && (
        <div className="page-header-actions">
          <div className="collaborators-container">
            <button 
              className="shared-with-button"
              onClick={handleViewCollaborators}
              aria-label="View people this plan is shared with"
            >
              <span className="shared-with-text">Shared With</span>
              <div className="collaborator-avatars">
                {collaborators.slice(0, 3).map((collaborator, index) => (
                  <div 
                    key={collaborator.id}
                    className="collaborator-avatar" 
                    title={collaborator.name || collaborator.fullName}
                  >
                    {(collaborator.name || collaborator.fullName || "").charAt(0)}
                  </div>
                ))}
                {collaborators.length > 3 && (
                  <div className="collaborator-more">+{collaborators.length - 3}</div>
                )}
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Use the display component */}
      <ConfirmWishesDisplay
        formData={formData}
        isReadOnly={false} // Owner is never read-only here
        onEdit={handleEdit}
      />

      {submitError && (
        <p className="error-message" style={{ color: 'red', textAlign: 'center', marginTop: '1rem' }}>
          {submitError}
        </p>
      )}

      <div className="confirm-actions">
        <SecondaryButton onClick={handleGoBack} disabled={isSubmitting}>
          <span className="go-back-icon" aria-hidden="true">←</span> Go back
        </SecondaryButton>

        {/* "Save & Share" Button */}
        <PrimaryButton
          onClick={handleSaveAndShare}
          // Only disable during actual submission, remove auth loading check
          disabled={isSubmitting}
          // Remove conditional styling based on authentication
          style={{ width: '15rem', height: '4rem' }}
        >
          {isSubmitting ? 'Saving...' : 'Save & Share'}
        </PrimaryButton>
      </div>
    </div>
  );
};

export default ConfirmWishes;
