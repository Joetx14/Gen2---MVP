import React, { useState } from 'react';
import getIcon, { getTributeIcon } from '../Icons';
import '../../styles/PlanningSteps/ConfirmWishes.css';

const ConfirmWishesDisplay = ({ formData, isReadOnly, onEdit }) => {
  const [expandedFields, setExpandedFields] = useState({});

  const toggleFieldExpand = (fieldId, event) => {
    event.preventDefault();
    setExpandedFields(prev => ({ ...prev, [fieldId]: !prev[fieldId] }));
  };

  // Create a component for truncated text fields
  const TruncatedField = ({ fieldId, content, expanded, onToggle }) => {
    const [isOverflowing, setIsOverflowing] = useState(false);
    const textRef = React.useRef(null);
    
    // Check if content overflows on mount and window resize
    React.useEffect(() => {
      const checkOverflow = () => {
        if (textRef.current) {
          const hasOverflow = textRef.current.scrollHeight > textRef.current.clientHeight;
          setIsOverflowing(hasOverflow);
        }
      };
      
      checkOverflow();
      window.addEventListener('resize', checkOverflow);
      return () => window.removeEventListener('resize', checkOverflow);
    }, [content]);    return (
      <div className="truncated-field-container">
        <div className={`tribute-content ${expanded ? 'expanded' : 'collapsed'}`}>
          <div
            ref={textRef}
            className={`choice-card-description ${!expanded ? 'truncate' : ''}`}
          >
            {content}
          </div>
        </div>
        
        {/* Always show button when content can be truncated, regardless of current state */}
        {(isOverflowing || expanded) && (
          <button
            onClick={(e) => onToggle(fieldId, e)}
            className={`more-options-button ${expanded ? 'expanded' : ''}`}
            aria-expanded={expanded}
            aria-label={expanded ? "Show less content" : "Show more content"}
          >
            {/* Different content based on state */}
            {!expanded ? (
              <span className="dots-icon">⋯</span>
            ) : (
              <span className="dots-icon expanded">⋯</span>
            )}
            
          </button>
        )}
      </div>
    );
  };

  if (!formData || Object.keys(formData).length === 0 || !formData.basicInformation) {
    return <p>No planning data available to display.</p>;
  }

  // Simplify complex conditional logic for resting place sections
  const shouldShowCremationRestingPlace =
    formData.farewellCare?.choice === 'cremation' &&
    formData.farewellCareDetails?.cremation?.choice === 'scattering' &&
    formData.restingPlace?.cremation?.details;

  const shouldShowBurialRestingPlace =
    formData.farewellCare?.choice === 'burial' &&
    formData.restingPlace?.burial?.details;

  const shouldShowNatureRestingPlace =
    formData.farewellCare?.choice === 'alternatives' &&
    formData.farewellCareDetails?.alternatives?.choice === 'return-to-nature' &&
    formData.restingPlace?.nature?.details;

  const shouldShowMemorialRestingPlace =
    formData.farewellCare?.choice === 'alternatives' &&
    formData.farewellCareDetails?.alternatives?.choice === 'memorialization' &&
    formData.restingPlace?.memorial?.details;

  const shouldShowDonationRestingPlace =
    formData.farewellCare?.choice === 'alternatives' &&
    formData.farewellCareDetails?.alternatives?.choice === 'donate-body' &&
    formData.restingPlace?.donation?.details;

  return (
    <div className="confirm-wishes-container-display">
      {/* Basic Information Section */}
      <div className="confirm-section essential-details-section">
        <div className="section-header">
          <h2>Farewell Wishes for</h2>
        </div>
        <div className="section-content">
          <div className="choice-container">
            {!isReadOnly && onEdit && (
              <button
                onClick={() => onEdit('basicInfo')}
                className="card-edit-button"
                aria-label="Edit Personal Information"
              >
                <img src="/Picture/editpencil.svg" alt="Edit" />
              </button>
            )}
            <div className="choice-display">
              <div className="choice-details">
                <h3 className="choice-card-title feature-title">
                  {formData.basicInformation?.firstName} {formData.basicInformation?.lastName}
                </h3>
                <p className="choice-card-description">Birth Year: {formData.basicInformation?.dateOfBirth}</p>
                {formData.basicInformation?.veteranStatus && (
                  <p className="choice-card-description">Veteran Status: {formData.basicInformation.veteranStatus}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ceremony Section */}
      {formData.farewellCeremony?.details && (
        <div className="confirm-section">
          <div className="section-header">
            <h2>Farewell Ceremony</h2>
          </div>
          <div className="section-content">
            <div className="choice-container">
              {!isReadOnly && onEdit && (
                <button
                  onClick={() => onEdit('ceremony')}
                  className="card-edit-button"
                  aria-label="Edit Ceremony"
                >
                  <img src="/Picture/editpencil.svg" alt="Edit" />
                </button>
              )}
              <div className="choice-display">
                <div className="choice-icon">
                  {getIcon('ceremony', formData.farewellCeremony.choice)}
                </div>
                <div className="choice-details">
                  <h3 className="choice-card-title">{formData.farewellCeremony.details.title}</h3>
                  <p className="choice-card-description">{formData.farewellCeremony.details.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Care Section */}
      {formData.farewellCare?.details && (
        <div className="confirm-section">
          <div className="section-header">
            <h2>Farewell Care</h2>
          </div>
          <div className="section-content">
            <div className="choice-container">
              {!isReadOnly && onEdit && (
                <button
                  onClick={() => onEdit('care')}
                  className="card-edit-button"
                  aria-label="Edit Care Option"
                >
                  <img src="/Picture/editpencil.svg" alt="Edit" />
                </button>
              )}
              <div className="choice-display">
                <div className="choice-icon">
                  {getIcon('care', formData.farewellCare.choice)}
                </div>
                <div className="choice-details">
                  <h3 className="choice-card-title">{formData.farewellCare.details.title}</h3>
                  <p className="choice-card-description">{formData.farewellCare.details.description}</p>
                </div>
              </div>
            </div>

            {/* Cremation Sub-details */}
            {formData.farewellCare?.choice === 'cremation' && formData.farewellCareDetails?.cremation?.details && (
              <div className="subchoice-container">
                {!isReadOnly && onEdit && (
                  <button
                    onClick={() => onEdit('careDetails')}
                    className="card-edit-button"
                    aria-label="Edit Cremation Details"
                  >
                    <img src="/Picture/editpencil.svg" alt="Edit" />
                  </button>
                )}
                <div className="choice-display">
                  <div className="choice-icon">
                    {getIcon('cremation', formData.farewellCareDetails.cremation.choice)}
                  </div>
                  <div className="choice-details">
                    <h4 className="choice-card-title">{formData.farewellCareDetails.cremation.details.title}</h4>
                    <p className="choice-card-description">{formData.farewellCareDetails.cremation.details.description}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Burial Sub-details */}
            {formData.farewellCare?.choice === 'burial' && formData.farewellCareDetails?.burial?.details && (
              <div className="subchoice-container">
                {!isReadOnly && onEdit && (
                  <button
                    onClick={() => onEdit('careDetails')}
                    className="card-edit-button"
                    aria-label="Edit Burial Details"
                  >
                    <img src="/Picture/editpencil.svg" alt="Edit" />
                  </button>
                )}
                <div className="choice-display">
                  <div className="choice-icon">
                    {getIcon('burial', formData.farewellCareDetails.burial.choice)}
                  </div>
                  <div className="choice-details">
                    <h4 className="choice-card-title">{formData.farewellCareDetails.burial.details.title}</h4>
                    <p className="choice-card-description">{formData.farewellCareDetails.burial.details.description}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Alternatives Sub-details */}
            {formData.farewellCare?.choice === 'alternatives' && formData.farewellCareDetails?.alternatives?.details && (
              <div className="subchoice-container">
                {!isReadOnly && onEdit && (
                  <button
                    onClick={() => onEdit('careDetails')}
                    className="card-edit-button"
                    aria-label="Edit Alternative Care Details"
                  >
                    <img src="/Picture/editpencil.svg" alt="Edit" />
                  </button>
                )}
                <div className="choice-display">
                  <div className="choice-icon">
                    {getIcon('alternatives', formData.farewellCareDetails.alternatives.choice)}
                  </div>
                  <div className="choice-details">
                    <h4 className="choice-card-title">{formData.farewellCareDetails.alternatives.details.title}</h4>
                    <p className="choice-card-description">{formData.farewellCareDetails.alternatives.details.description}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Resting Place Section */}
      {(formData.restingPlace?.cremation?.choice ||
        formData.restingPlace?.burial?.choice ||
        formData.restingPlace?.nature?.choice ||
        formData.restingPlace?.memorial?.choice ||
        formData.restingPlace?.donation?.choice) && (
        <div className="confirm-section">
          <div className="section-header">
            <h2>Resting Place</h2>
          </div>
          <div className="section-content">
            {/* Cremation Scattering Resting Place */}
            {shouldShowCremationRestingPlace && (
              <div className="choice-container">
                {!isReadOnly && onEdit && (
                  <button
                    onClick={() => onEdit('restingPlace')}
                    className="card-edit-button"
                    aria-label="Edit Resting Place"
                  >
                    <img src="/Picture/editpencil.svg" alt="Edit" />
                  </button>
                )}
                <div className="choice-display">
                  <div className="choice-icon">
                    {getIcon('restingPlace', formData.restingPlace.cremation.choice)}
                  </div>
                  <div className="choice-details">
                    <h4 className="choice-card-title">{formData.restingPlace.cremation.details.title}</h4>
                    <p className="choice-card-description">{formData.restingPlace.cremation.details.description}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Burial Resting Place */}
            {shouldShowBurialRestingPlace && (
              <div className="choice-container">
                {!isReadOnly && onEdit && (
                  <button
                    onClick={() => onEdit('restingPlace')}
                    className="card-edit-button"
                    aria-label="Edit Burial Resting Place"
                  >
                    <img src="/Picture/editpencil.svg" alt="Edit" />
                  </button>
                )}
                <div className="choice-display">
                  <div className="choice-icon">
                    {getIcon('restingPlace', formData.restingPlace.burial.choice)}
                  </div>
                  <div className="choice-details">
                    <h4 className="choice-card-title">{formData.restingPlace.burial.details.title}</h4>
                    <p className="choice-card-description">{formData.restingPlace.burial.details.description}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Nature Resting Place */}
            {shouldShowNatureRestingPlace && (
              <div className="choice-container">
                {!isReadOnly && onEdit && (
                  <button
                    onClick={() => onEdit('restingPlace')}
                    className="card-edit-button"
                    aria-label="Edit Resting Place"
                  >
                    <img src="/Picture/editpencil.svg" alt="Edit" />
                  </button>
                )}
                <div className="choice-display">
                  <div className="choice-icon">
                    {getIcon('restingPlace', formData.restingPlace.nature.choice)}
                  </div>
                  <div className="choice-details">
                    <h4 className="choice-card-title">{formData.restingPlace.nature.details.title}</h4>
                    <p className="choice-card-description">{formData.restingPlace.nature.details.description}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Memorial Resting Place */}
            {shouldShowMemorialRestingPlace && (
              <div className="choice-container">
                {!isReadOnly && onEdit && (
                  <button
                    onClick={() => onEdit('restingPlace')}
                    className="card-edit-button"
                    aria-label="Edit Resting Place"
                  >
                    <img src="/Picture/editpencil.svg" alt="Edit" />
                  </button>
                )}
                <div className="choice-display">
                  <div className="choice-icon">
                    {getIcon('restingPlace', formData.restingPlace.memorial.choice)}
                  </div>
                  <div className="choice-details">
                    <h4 className="choice-card-title">{formData.restingPlace.memorial.details.title}</h4>
                    <p className="choice-card-description">{formData.restingPlace.memorial.details.description}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Donation Resting Place */}
            {shouldShowDonationRestingPlace && (
              <div className="choice-container">
                {!isReadOnly && onEdit && (
                  <button
                    onClick={() => onEdit('restingPlace')}
                    className="card-edit-button"
                    aria-label="Edit Resting Place"
                  >
                    <img src="/Picture/editpencil.svg" alt="Edit" />
                  </button>
                )}
                <div className="choice-display">
                  <div className="choice-icon">
                    {getIcon('restingPlace', formData.restingPlace.donation.choice)}
                  </div>
                  <div className="choice-details">
                    <h4 className="choice-card-title">{formData.restingPlace.donation.details.title}</h4>
                    <p className="choice-card-description">{formData.restingPlace.donation.details.description}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tributes Section */}
      <div className="confirm-section">
        <div className="section-header">
          <h2>Farewell Tributes</h2>
        </div>
        <div className="section-content">
          {/* Ceremony Essentials */}
          <div className="tribute-item">
            {!isReadOnly && onEdit && (
              <button
                onClick={() => onEdit('tributes-ceremony')}
                className="card-edit-button"
                aria-label="Edit Ceremony Essentials"
              >
                <img src="/Picture/editpencil.svg" alt="Edit" />
              </button>
            )}
            <div className="choice-display">
              <div className="choice-icon">{getTributeIcon('ceremony')}</div>
              <div className="choice-details">
                <h3 className="choice-card-title">Ceremony Essentials</h3>
                <p className="choice-card-description">
                  <strong>Religious/Spiritual Preference:</strong>{' '}
                  {formData.tributes?.ceremony?.religiousPreference || 'Not specified'}
                </p>
                <TruncatedField
                  fieldId="ceremonySetting"
                  content={<><strong>Setting:</strong>{' '}
                    {formData.tributes?.ceremony?.ceremonySetting || 'Not specified'}</>}
                  expanded={expandedFields['ceremonySetting']}
                  onToggle={toggleFieldExpand}
                />
              </div>
            </div>
          </div>

          {/* Honoring Your Legacy */}
          <div className="tribute-item">
            {!isReadOnly && onEdit && (
              <button
                onClick={() => onEdit('tributes-speaker')}
                className="card-edit-button"
                aria-label="Edit Legacy Details"
              >
                <img src="/Picture/editpencil.svg" alt="Edit" />
              </button>
            )}
            <div className="choice-display">
              <div className="choice-icon">{getTributeIcon('speaker')}</div>
              <div className="choice-details">
                <h3 className="choice-card-title">Honoring Your Legacy</h3>
                <p className="choice-card-description">
                  <strong>Speaker/Leader:</strong>{' '}
                  {formData.tributes?.speaker?.speakerLabel || 'Not specified'}
                </p>
                <TruncatedField
                  fieldId="musicReadings"
                  content={<><strong>Music & Readings:</strong>{' '}
                    {formData.tributes?.speaker?.musicAndReadings || 'Not specified'}</>}
                  expanded={expandedFields['musicReadings']}
                  onToggle={toggleFieldExpand}
                />
              </div>
            </div>
          </div>

          {/* Meaningful Details (Story) */}
          {formData.tributes?.story && (
            <div className="tribute-item">
              {!isReadOnly && onEdit && (
                <button
                  onClick={() => onEdit('tributes-story')}
                  className="card-edit-button"
                  aria-label="Edit Story"
                >
                  <img src="/Picture/editpencil.svg" alt="Edit" />
                </button>
              )}
              <div className="choice-display">
                <div className="choice-icon">{getTributeIcon('story')}</div>
                <div className="choice-details">
                  <h3 className="choice-card-title">Meaningful Details</h3>
                  <TruncatedField
                    fieldId="story"
                    content={formData.tributes?.story?.text || 'Not specified'}
                    expanded={expandedFields['story']}
                    onToggle={toggleFieldExpand}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfirmWishesDisplay;
