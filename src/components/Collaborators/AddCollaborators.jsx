import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { usePlanningData } from '../../context/usePlanningData';
import { generateClient } from 'aws-amplify/api';
import { Collaborator } from '../../models';

// Import components
import StandardLayout from '../StandardLayout'; 
import TextInput from '../TextInput';
import FormBox from '../FormBox';
import PrimaryButton from '../buttons/PrimaryButton';
import ShareSuccessModal from './ShareMoreModal';

import '../../styles/ButtonMaster.css';
import '../../styles/Collaborators/AddCollaborators.css';


const relationshipOptions = [
  { value: 'family', label: 'Family Member' },
  { value: 'friend', label: 'Friend' },
  { value: 'coworker', label: 'Colleague/Co-worker' },
  { value: 'caregiver', label: 'Caregiver' },
  { value: 'other', label: 'Other' }
];

const AddCollaborators = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const { isLoading: authIsLoading, user } = useAuth ? useAuth() : { isLoading: false, user: null };
  const { formData, currentPlanId } = usePlanningData();
  const client = generateClient();

  // State variables
  const [collaboratorFullName, setCollaboratorFullName] = useState('');
  const [collaboratorEmail, setCollaboratorEmail] = useState('');
  const [relationship, setRelationship] = useState('');
  const [personalMessage, setPersonalMessage] = useState('');
  const [submitError, setSubmitError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInviteAcceptFlow, setIsInviteAcceptFlow] = useState(false);
  const [inviteData, setInviteData] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successInfo, setSuccessInfo] = useState({ name: '' });

  // Add these new state variables
  const [fieldsTouched, setFieldsTouched] = useState({
    fullName: false,
    email: false
  });

  // Create a function to track field interaction
  const handleFieldTouch = (fieldName) => {
    setFieldsTouched(prev => ({
      ...prev,
      [fieldName]: true
    }));
  };

  // Add this email validation function at the top of your component
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // These are just placeholders; replace with your actual logic
  const isReturningUser = false;
  const fromConfirmWishes = false;
  const buttonsRowClasses = "buttons-row";
  const rightButtonsClasses = "right-buttons";

  // Define the variable at the top of your component
  const formButtonsRow = "form-buttons-row";

  // If you have an inviteId in params or location, set it here
  const inviteId = params.inviteId || null;

  useEffect(() => {
    if (inviteId) {
      setIsInviteAcceptFlow(true);
      // Fetch invite details if you need them
    } else {
      setIsInviteAcceptFlow(false);
    }
    // reset fields
    setCollaboratorFullName('');
    setCollaboratorEmail('');
    setRelationship('');
    setPersonalMessage('');
  }, [inviteId]);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    // Form validation
    if (!collaboratorFullName.trim() && !collaboratorEmail.trim()) {
      setSubmitError("Please enter a name and email address.");
      setFieldsTouched({ fullName: true, email: true });
      return;
    }
    
    if (!collaboratorEmail.trim() || !isValidEmail(collaboratorEmail)) {
      setSubmitError("Please enter a valid email address.");
      setFieldsTouched(prev => ({ ...prev, email: true }));
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Get current user ID and plan information
      if (!user?.userId) {
        throw new Error("User not authenticated");
      }

      // Determine the farewell plan ID to associate with
      let planId = currentPlanId;
      
      // If we don't have a current plan ID from context, we need to handle this case
      if (!planId) {
        // For now, throw an error - in a production app you might want to create a plan first
        throw new Error("No farewell plan found. Please create your farewell plan first.");
      }

      // Get plan owner name from user data or basic information
      let planOwnerName = user.attributes?.name || 
                         user.attributes?.given_name || 
                         formData?.basicInformation?.firstName || 
                         user.attributes?.email?.split('@')[0] || 
                         'Plan Owner';

      // Add last name if available
      if (formData?.basicInformation?.lastName) {
        planOwnerName = `${formData.basicInformation.firstName || planOwnerName} ${formData.basicInformation.lastName}`;
      } else if (user.attributes?.family_name) {
        planOwnerName = `${user.attributes.given_name || planOwnerName} ${user.attributes.family_name}`;
      }

      // Prepare collaborator data
      const collaboratorInput = {
        name: collaboratorFullName.trim() || null,
        email: collaboratorEmail.trim(),
        planOwnerId: user.userId,
        planOwnerName: planOwnerName,
        farewellPlanCollaboratorsId: planId,
        invitedAt: new Date().toISOString(),
        status: 'pending',
        role: relationship || 'viewer'
      };

      console.log('Creating collaborator with input:', collaboratorInput);

      // Call the GraphQL mutation
      // This will trigger the sendCollaboratorInvite Lambda function to send the email
      const response = await client.graphql({
        query: createCollaborator,
        variables: {
          input: collaboratorInput
        }
      });

      const newCollaborator = response.data.createCollaborator;
      console.log('Collaborator created successfully:', newCollaborator);

      // Show success modal
      setSuccessInfo({
        name: collaboratorFullName || collaboratorEmail
      });
      setShowSuccessModal(true);
      setIsSubmitting(false);

      // Reset form fields for potential next invite
      setCollaboratorFullName('');
      setCollaboratorEmail('');
      setRelationship('');
      setPersonalMessage('');
      setFieldsTouched({ fullName: false, email: false });
      
    } catch (error) {
      console.error('Error creating collaborator:', error);
      let errorMessage = "Unable to share your wishes. Please try again.";
      
      // Provide more specific error messages
      if (error.message?.includes('not authenticated')) {
        errorMessage = "Please sign in to share your wishes.";
      } else if (error.message?.includes('No farewell plan')) {
        errorMessage = "Please complete your farewell plan before sharing.";
      } else if (error.errors && error.errors.length > 0) {
        errorMessage = error.errors[0].message || errorMessage;
      }
      
      setSubmitError(errorMessage);
      setIsSubmitting(false);
    }
  };

  // Replace legacy add collaborator logic with Gen 2 data client
  const handleAddCollaborator = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      const newCollaborator = await client.models.Collaborator.create({
        name: collaboratorFullName,
        email: collaboratorEmail,
        role: relationship,
        personalMessage,
        status: 'pending',
        planOwnerId: user?.userId,
        planOwnerName: user?.attributes?.name || user?.attributes?.email || 'Unknown User',
        farewellPlanCollaboratorsId: currentPlanId,
        invitedAt: new Date().toISOString()
      });
      setShowSuccessModal(true);
      setSuccessInfo({ name: collaboratorFullName });
      setCollaboratorFullName('');
      setCollaboratorEmail('');
      setRelationship('');
      setPersonalMessage('');
    } catch (err) {
      setSubmitError(err.message || 'Failed to add collaborator.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add a function to handle "Share with someone else"
  const handleShareMore = () => {
    setShowSuccessModal(false);
    setCollaboratorFullName('');
    setCollaboratorEmail('');
    setRelationship('');
    setPersonalMessage('');
  };

  const handleGoBack = () => {
    if (location.key !== "default" && location.pathname !== "/") {
      navigate(-1);
    } else {
      navigate(isInviteAcceptFlow ? '/' : '/confirm-wishes');
    }
  };

  const handleSkip = () => {
    navigate('/collaborator/dashboard');
  };

  const handleExit = () => {
    navigate('/donation');
  };

  const getIntroText = () => {
    if (isReturningUser) {
      return "Add, edit, or remove people who can access your farewell wishes.";
    } else if (fromConfirmWishes) {
      return "Your wishes have been saved. Now share them with people you trust.";
    } else {
      return "Add people who can access your farewell wishes.";
    }
  };

  if (authIsLoading) {
    return (
      <StandardLayout 
        title={
          <>
            <span className="h1b">Loading</span>{' '}
            <span className="h1">Information</span>
          </>
        }
        subtitle={<span className="h1sub">Please wait</span>}
      >
        <div className="form-box-container">
          <div className="form-box" style={{ textAlign: 'center', padding: '20px' }}>
            Loading your information...
          </div>
        </div>
      </StandardLayout>
    );
  }

  // If you really need that condition, re-enable it here:
  const showNavButtons = true;

  return (
    <StandardLayout
      title={
        <>
          <span className="h1b">Share</span>{' '}
          <span className="h1">Your Wishes</span>
        </>
      }
      subtitle={<span className="h1sub">{getIntroText()}</span>}
      onGoBack={handleGoBack}
      onSaveContinue={handleSubmit}
      continueButtonText={isInviteAcceptFlow ? "Accept Invitation" : "Share Wishes"}
      showSkipButton={false}
      hideFooter={true}
      showFooter={false}
      mobileResponsive={true}
    >
      <div className="add-collaborators-container">
        <FormBox className="collaborator-form-box">
          {/* Exit button needs to be the first element inside FormBox */}
          <button 
            className="form-exit-button" 
            onClick={handleExit}
            aria-label="Exit to donation screen"
          >
            <img src="/Picture/exit-x.svg" alt="Exit" />
          </button>

          <form className="collaborator-form" onSubmit={handleSubmit}>

            {/* Full Name */}
            <div className="form-field">
              <TextInput
                label="Full Name"
                id="collaboratorFullName"
                value={collaboratorFullName}
                onChange={(e) => {
                  setCollaboratorFullName(e.target.value);
                  handleFieldTouch('fullName');
                }}
                onBlur={() => handleFieldTouch('fullName')}
                placeholder="First & Last Name"
                required={!!collaboratorFullName.trim() || !!collaboratorEmail.trim()}
              />
            </div>

            {/* Email */}
            <div className="form-field">
              <TextInput
                label="Email Address"
                id="collaboratorEmail"
                type="email"
                value={collaboratorEmail}
                onChange={(e) => {
                  setCollaboratorEmail(e.target.value);
                  handleFieldTouch('email');
                }}
                onBlur={() => handleFieldTouch('email')}
                placeholder={isInviteAcceptFlow ? "Your Email Address" : "Enter their email address"}
                required={!!collaboratorFullName.trim() || !!collaboratorEmail.trim()}
                disabled={isInviteAcceptFlow && inviteData?.invitedEmail}
              />
            </div>

            {/* Relationship */}
            <div className="form-field">
              <TextInput
                type="dropdown"
                label={`Relationship ${isInviteAcceptFlow ? "to the Plan Owner" : "to You"} (Optional)`}
                options={relationshipOptions}
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                placeholder="Choose from dropdown"
              />
            </div>

            {/* Personal Message */}
            <div className="form-field">
              <TextInput
                label={`Personal Message ${isInviteAcceptFlow ? "to the Plan Owner" : "to Them"} (Optional)`}
                id="personalMessage"
                multiline
                value={personalMessage}
                onChange={(e) => setPersonalMessage(e.target.value)}
                placeholder={isInviteAcceptFlow 
                  ? "Add a note for the plan owner..." 
                  : "Write a short note to let them know why you're sharing..."
                }
                textareaClassName="tributes-textarea farewell-scrollbar"
                style={{ minHeight: '7rem' }}
              />
            </div>

            {/* Only show error if a field was touched */}
            {submitError && (fieldsTouched.fullName || fieldsTouched.email) && (
              <div className="error-helper">{submitError}</div>
            )}

            {showNavButtons && (
              <div className="button-container-centered">
                <PrimaryButton 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="centered-button"
                >
                  {isInviteAcceptFlow ? "Accept Invitation" : "Share Wishes"}
                </PrimaryButton>
              </div>
            )}

          </form>

          {showSuccessModal && (
            <ShareSuccessModal 
              collaboratorName={successInfo.name}
              onClose={() => navigate('/donation')}
              onShareMore={handleShareMore}
            />
          )}
        </FormBox>
      </div>
    </StandardLayout>
  );
};

export default AddCollaborators;
