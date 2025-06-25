import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import StandardLayout from '../StandardLayout';
import FormBox from '../FormBox';
import PrimaryButton from '../buttons/PrimaryButton';

const CollaboratorWelcome = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { planOwnerName, farewellPlanId } = location.state || {};

  const handleContinue = () => {
    // Navigate to the read-only view of the plan owner's wishes
    navigate('/collaborator/plan-view', { 
      state: { 
        planOwnerName,
        farewellPlanId 
      } 
    });
  };

  return (
    <StandardLayout
      title={
        <>
          <span className="h1">Welcome to </span>
          <span className="h1b">{planOwnerName || 'their'}</span>
          <span className="h1"> farewell plan</span>
        </>
      }
      subtitle={
        <span className="h1sub">
          You've been invited to view their personal farewell wishes and planning details.
        </span>
      }
    >
      <div className="onboarding-form-content">
        <FormBox className="onboarding-formbox">
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h3>Thank you for accepting the invitation</h3>
            <p>
              <strong>{planOwnerName}</strong> has thoughtfully planned their farewell wishes and wants to share them with you.
            </p>
            <p>
              This is a meaningful gift - they trust you to understand and honor their final wishes when the time comes.
            </p>
            <p>
              You'll be able to view all the details they've carefully considered, from ceremony preferences to special requests.
            </p>
          </div>

          <div className="onboarding-button-container">
            <PrimaryButton onClick={handleContinue}>
              View Their Farewell Plan
            </PrimaryButton>
          </div>
        </FormBox>

        <div style={{ textAlign: 'center', marginTop: '2rem', color: '#666' }}>
          <p>
            <small>
              As a collaborator, you have read-only access to view their wishes. 
              Only {planOwnerName} can make changes to their plan.
            </small>
          </p>
        </div>
      </div>
    </StandardLayout>
  );
};

export default CollaboratorWelcome;
