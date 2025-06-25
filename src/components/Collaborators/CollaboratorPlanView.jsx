import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { generateClient } from 'aws-amplify/api';
import { FarewellPlan } from '../../models';
import StandardLayout from '../StandardLayout';
import FormBox from '../FormBox';

const CollaboratorPlanView = () => {
  const location = useLocation();
  const { planOwnerName, farewellPlanId } = location.state || {};
  const [planData, setPlanData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const client = generateClient();

  useEffect(() => {
    if (farewellPlanId) {
      fetchPlanData();
    }
  }, [farewellPlanId]);

  const fetchPlanData = async () => {
    try {
      const plan = await client.models.FarewellPlan.get({ id: farewellPlanId });
      if (plan) {
        setPlanData(plan);
      } else {
        setError('Plan not found or access denied.');
      }
    } catch (err) {
      console.error('Error fetching plan:', err);
      setError('Unable to load plan details.');
    } finally {
      setIsLoading(false);
    }
  };

  const parseJsonSafely = (jsonString) => {
    try {
      return JSON.parse(jsonString || '{}');
    } catch {
      return {};
    }
  };

  if (isLoading) {
    return (
      <StandardLayout
        title={<span className="h1">Loading Plan...</span>}
        subtitle={<span className="h1sub">Please wait while we load the farewell plan.</span>}
      >
        <div className="onboarding-form-content">
          <FormBox className="onboarding-formbox">
            <p>Loading plan details...</p>
          </FormBox>
        </div>
      </StandardLayout>
    );
  }

  if (error) {
    return (
      <StandardLayout
        title={<span className="h1">Unable to Load Plan</span>}
        subtitle={<span className="h1sub">There was a problem accessing the plan.</span>}
      >
        <div className="onboarding-form-content">
          <FormBox className="onboarding-formbox">
            <p className="error-message">{error}</p>
          </FormBox>
        </div>
      </StandardLayout>
    );
  }

  const basicInfo = parseJsonSafely(planData?.basicInformation);
  const ceremony = parseJsonSafely(planData?.farewellCeremony);
  const care = parseJsonSafely(planData?.farewellCare);
  const careDetails = parseJsonSafely(planData?.farewellCareDetails);
  const restingPlace = parseJsonSafely(planData?.restingPlace);
  const tributes = parseJsonSafely(planData?.tributes);

  return (
    <StandardLayout
      title={
        <>
          <span className="h1">{planOwnerName}'s </span>
          <span className="h1b">farewell</span>
          <span className="h1"> wishes</span>
        </>
      }
      subtitle={
        <span className="h1sub">
          Here are the details they've carefully planned for their farewell.
        </span>
      }
    >
      <div className="onboarding-form-content">
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          
          {/* Basic Information */}
          {Object.keys(basicInfo).length > 0 && (
            <FormBox className="onboarding-formbox" style={{ marginBottom: '2rem' }}>
              <h3>Personal Information</h3>
              {basicInfo.firstName && <p><strong>Name:</strong> {basicInfo.firstName} {basicInfo.lastName}</p>}
              {basicInfo.birthYear && <p><strong>Birth Year:</strong> {basicInfo.birthYear}</p>}
              {basicInfo.veteranStatus && <p><strong>Veteran Status:</strong> {basicInfo.veteranStatus}</p>}
            </FormBox>
          )}

          {/* Ceremony Preferences */}
          {Object.keys(ceremony).length > 0 && (
            <FormBox className="onboarding-formbox" style={{ marginBottom: '2rem' }}>
              <h3>Ceremony Preferences</h3>
              {ceremony.ceremonyType && <p><strong>Type of Service:</strong> {ceremony.ceremonyType}</p>}
              {ceremony.religiousPreference && <p><strong>Religious Preference:</strong> {ceremony.religiousPreference}</p>}
              {ceremony.ceremonyLocation && <p><strong>Location:</strong> {ceremony.ceremonyLocation}</p>}
              {ceremony.speakerLeader && <p><strong>Officiant:</strong> {ceremony.speakerLeader}</p>}
              {ceremony.speakerOther && <p><strong>Other Officiant:</strong> {ceremony.speakerOther}</p>}
            </FormBox>
          )}

          {/* Care Preferences */}
          {Object.keys(care).length > 0 && (
            <FormBox className="onboarding-formbox" style={{ marginBottom: '2rem' }}>
              <h3>Care Preferences</h3>
              {care.farewellCareType && <p><strong>Care Type:</strong> {care.farewellCareType}</p>}
              {careDetails.burialOptions && <p><strong>Burial Options:</strong> {careDetails.burialOptions}</p>}
              {careDetails.cremationOptions && <p><strong>Cremation Options:</strong> {careDetails.cremationOptions}</p>}
              {careDetails.alternativeOptions && <p><strong>Alternative Options:</strong> {careDetails.alternativeOptions}</p>}
              {careDetails.memorialization && <p><strong>Memorialization:</strong> {careDetails.memorialization}</p>}
            </FormBox>
          )}

          {/* Resting Place */}
          {Object.keys(restingPlace).length > 0 && (
            <FormBox className="onboarding-formbox" style={{ marginBottom: '2rem' }}>
              <h3>Resting Place</h3>
              {restingPlace.location && <p><strong>Location:</strong> {restingPlace.location}</p>}
              {restingPlace.specificWishes && <p><strong>Specific Wishes:</strong> {restingPlace.specificWishes}</p>}
            </FormBox>
          )}

          {/* Tributes and Personal Touches */}
          {Object.keys(tributes).length > 0 && (
            <FormBox className="onboarding-formbox" style={{ marginBottom: '2rem' }}>
              <h3>Tributes and Personal Touches</h3>
              {tributes.musicAndReadings && (
                <div style={{ marginBottom: '1rem' }}>
                  <strong>Music and Readings:</strong>
                  <p style={{ marginLeft: '1rem', fontStyle: 'italic' }}>{tributes.musicAndReadings}</p>
                </div>
              )}
              {tributes.legacyReflections && (
                <div style={{ marginBottom: '1rem' }}>
                  <strong>Legacy Reflections:</strong>
                  <p style={{ marginLeft: '1rem', fontStyle: 'italic' }}>{tributes.legacyReflections}</p>
                </div>
              )}
              {tributes.specialRequests && (
                <div style={{ marginBottom: '1rem' }}>
                  <strong>Special Requests:</strong>
                  <p style={{ marginLeft: '1rem', fontStyle: 'italic' }}>{tributes.specialRequests}</p>
                </div>
              )}
            </FormBox>
          )}

          {/* Footer message */}
          <div style={{ textAlign: 'center', marginTop: '3rem', padding: '2rem', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
            <p style={{ color: '#666', margin: 0 }}>
              These wishes were thoughtfully prepared by <strong>{planOwnerName}</strong>.
              <br />
              Thank you for taking the time to understand and honor their final wishes.
            </p>
          </div>
        </div>
      </div>
    </StandardLayout>
  );
};

export default CollaboratorPlanView;
