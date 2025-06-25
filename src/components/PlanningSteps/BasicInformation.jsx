// src/components/PlanningSteps/BasicInformation.jsx

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePlanningData } from '../../context/usePlanningData';
import { getNextEditingStep } from '../../utils/editingNavigation';

import PlanningLayout from './PlanningLayout';
import TextInput from '../TextInput';
import PrimaryButton from '../buttons/PrimaryButton';

import '../../styles/PlanningSteps/BasicInformation.css';

export default function BasicInformation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { formData, updateFormData } = usePlanningData();

  const { isEditing, returnTo } = location.state || {};

  const [firstName, setFirstName] = useState(formData.basicInformation?.firstName || '');
  const [lastName, setLastName] = useState(formData.basicInformation?.lastName || '');
  const [dateOfBirth, setDateOfBirth] = useState(formData.basicInformation?.dateOfBirth || '');
  const [veteranStatus, setVeteranStatus] = useState(formData.basicInformation?.veteranStatus || '');
  const [relationshipStatus, setRelationshipStatus] = useState(formData.basicInformation?.relationshipStatus || '');

  const veteranOptions = [
    { value: 'yes', label: 'Veteran' },
    { value: 'no', label: 'Non-Veteran' },
    { value: 'na', label: 'Prefer not to say' },
  ];
  const handleSubmit = (e) => {
    e.preventDefault();
    updateFormData({
      basicInformation: { firstName, lastName, dateOfBirth, veteranStatus, relationshipStatus }
    });
    if (isEditing && returnTo) {
      navigate(returnTo);
    } else {
      navigate('/farewell-ceremony');
    }
  };

  // Create getStepData function that returns this step's data
  const getStepData = () => {
    return {
      basicInformation: { 
        firstName, 
        lastName, 
        dateOfBirth, 
        veteranStatus, 
        relationshipStatus 
      }
    };
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
      return '/farewell-ceremony';
    }
  };


  return (
    <PlanningLayout
      currentStep={1}
      title={<><span className="h1">Essential</span> <span className="h1b">Farewell</span> <span className="h1">details</span></>}
      subtitle="About the honoree."
      getStepData={getStepData}
      nextRoute={getNextRoute()}
      showNavButtons={false}
    >
      <form className="basic-info-form" onSubmit={handleSubmit}>
        <div className="basic-info-form-grid">
          <TextInput
            id="firstName"
            label="First Name"
            placeholder="Enter first name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            containerClassName="basic-info-form-field"
          />
          <TextInput
            id="lastName"
            label="Last Name"
            placeholder="Enter last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            containerClassName="basic-info-form-field"
          />
          <TextInput
            id="dateOfBirth"
            name="dateOfBirth"
            label="Year of Birth"
            placeholder="YYYY"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            required
            containerClassName="basic-info-form-field"
          />
          <TextInput
            type="dropdown"
            id="veteranStatus"
            label="Veteran Status"
            options={veteranOptions}
            value={veteranStatus}
            onChange={(e) => setVeteranStatus(e.target.value)}
            placeholder="Select one"
            containerClassName="basic-info-form-field"
          />
        </div>
        <div className="form-buttons-row" style={{ display: 'flex', justifyContent: 'center' }}>
          <PrimaryButton type="submit">
            Save &amp; continue
          </PrimaryButton>
        </div>
      </form>
    </PlanningLayout>
  );
}
