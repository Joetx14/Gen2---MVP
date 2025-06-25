import React from 'react';
import "../styles/ChoiceCard.css";

const ChoiceCard = ({ icon, title, description, isSelected, onClick, className = '' }) => {
  return (
    <div 
      className={`card ${isSelected ? 'selected' : ''} ${className}`} 
      onClick={onClick}
    >
      <div className="icon">{icon}</div>
      <h3 className="choicecard-title">{title}</h3>
      <p className="choicecard-description">{description}</p>
    </div>
  );
};

export default ChoiceCard;
