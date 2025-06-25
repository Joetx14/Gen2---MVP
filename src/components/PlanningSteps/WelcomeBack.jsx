import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlanningData } from '../context/PlanningDataContext';
import ShareMoreModal from './Collaborators/ShareMoreModal'; // Full path if exists



const WelcomeBackModal = ({ isOpen, onClose, userName }) => {
  const navigate = useNavigate();
  const { formData } = usePlanningData();
  
  if (!isOpen) return null;
  
  const resumePlanning = () => {
    const lastStep = formData._metadata?.lastVisitedStep;
    navigate(lastStep || '/basic-information');
    onClose();
  };
  
  const startOver = () => {
    navigate('/basic-information');
    onClose();
  };
  
  return (
    <ShareMoreModal
      modalType="welcomeBack"
      onClose={onClose}
      title={`Welcome back, ${userName || 'Friend'}!`}
      message="You have a plan in progress. Would you like to continue where you left off?"
      icon="/Picture/high-five.svg"
      primaryButtonText="Resume Planning"
      primaryButtonAction={resumePlanning}
      secondaryButtonText="Start Over"
      secondaryButtonAction={startOver}
    />
  );
};

export default WelcomeBackModal;