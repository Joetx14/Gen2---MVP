import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { useCollaborators } from '../../context/useCollaborators';
import { generateClient } from 'aws-amplify/api';
import { Collaborator } from '../../models';
import StandardLayout from '../StandardLayout';
import FormBox from '../FormBox';
import PrimaryButton from '../buttons/PrimaryButton';
import Login from '../Auth/Login';

const InviteAcceptance = () => {
  const { inviteId } = useParams();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { updateCollaborator } = useCollaborators();
  const navigate = useNavigate();
  const [invite, setInvite] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const client = generateClient();

  useEffect(() => {
    if (inviteId) {
      fetchInviteDetails();
    }
  }, [inviteId]);

  useEffect(() => {
    // If user becomes authenticated and we have a pending invite, process it
    if (isAuthenticated && invite && invite.status === 'pending') {
      processInviteAcceptance();
    }
  }, [isAuthenticated, invite]);

  const fetchInviteDetails = async () => {
    try {
      const collaborator = await client.models.Collaborator.get({ id: inviteId });
      if (collaborator) {
        setInvite(collaborator);
        
        // If user is not authenticated, store the invite ID for later processing
        if (!isAuthenticated) {
          localStorage.setItem('pendingInviteId', inviteId);
        }
      } else {
        setError('Invalid or expired invitation.');
      }
    } catch (err) {
      console.error('Error fetching invite:', err);
      setError('Unable to load invitation details.');
    } finally {
      setIsLoading(false);
    }
  };

  const processInviteAcceptance = async () => {
    try {
      await updateCollaborator(inviteId, { 
        status: 'accepted',
        respondedAt: new Date().toISOString()
      });
      
      // Clear pending invite from localStorage
      localStorage.removeItem('pendingInviteId');
      
      // Navigate to collaborator welcome screen
      navigate('/collaborator/welcome', { 
        state: { 
          planOwnerName: invite.planOwnerName,
          farewellPlanId: invite.farewellPlanCollaboratorsId 
        } 
      });
    } catch (err) {
      console.error('Error accepting invite:', err);
      setError('Failed to accept invitation. Please try again.');
    }
  };

  const handleLoginClick = () => {
    setShowLogin(true);
  };

  if (authLoading || isLoading) {
    return (
      <StandardLayout
        title={<span className="h1">Loading...</span>}
        subtitle={<span className="h1sub">Please wait while we process your invitation.</span>}
      >
        <div className="onboarding-form-content">
          <FormBox className="onboarding-formbox">
            <p>Loading invitation details...</p>
          </FormBox>
        </div>
      </StandardLayout>
    );
  }

  if (error) {
    return (
      <StandardLayout
        title={<span className="h1">Invitation Error</span>}
        subtitle={<span className="h1sub">There was a problem with your invitation.</span>}
      >
        <div className="onboarding-form-content">
          <FormBox className="onboarding-formbox">
            <p className="error-message">{error}</p>
            <PrimaryButton onClick={() => navigate('/')}>
              Return to Homepage
            </PrimaryButton>
          </FormBox>
        </div>
      </StandardLayout>
    );
  }

  if (showLogin) {
    return <Login />;
  }

  if (isAuthenticated && invite?.status === 'accepted') {
    // Invite already accepted, redirect to plan view
    navigate('/collaborator/welcome', { 
      state: { 
        planOwnerName: invite.planOwnerName,
        farewellPlanId: invite.farewellPlanCollaboratorsId 
      } 
    });
    return null;
  }

  return (
    <StandardLayout
      title={
        <>
          <span className="h1">You're invited to view </span>
          <span className="h1b">{invite?.planOwnerName || 'someone'}'s</span>
          <span className="h1"> farewell plan</span>
        </>
      }
      subtitle={
        <span className="h1sub">
          {invite?.planOwnerName} has shared their farewell wishes with you.
        </span>
      }
    >
      <div className="onboarding-form-content">
        <FormBox className="onboarding-formbox">
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <p>
              <strong>{invite?.planOwnerName}</strong> has invited you to view and collaborate on their farewell plan.
            </p>
            <p>
              To continue, please sign in to your account or create a new one.
            </p>
          </div>

          {!isAuthenticated && (
            <div className="onboarding-button-container">
              <PrimaryButton onClick={handleLoginClick}>
                Sign In to Continue
              </PrimaryButton>
            </div>
          )}
        </FormBox>
      </div>
    </StandardLayout>
  );
};

export default InviteAcceptance;
