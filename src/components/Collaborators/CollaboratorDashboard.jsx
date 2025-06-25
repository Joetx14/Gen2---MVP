import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { usePlanningData } from '../../context/usePlanningData';
import { generateClient } from 'aws-amplify/api';
import { Collaborator } from '../../models';
import PrimaryButton from '../buttons/PrimaryButton';
import FormBox from '../FormBox';
import StandardLayout from '../StandardLayout';
import ShareMoreModal from './ShareMoreModal';
import '../../styles/Collaborators/CollaboratorDashboard.css';

const CollaboratorDashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { currentPlanId } = usePlanningData();
  const [collaborators, setCollaborators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removedCollaborator, setRemovedCollaborator] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [expandedDetails, setExpandedDetails] = useState(null);
  const detailsRef = useRef(null);
  const client = generateClient();

  useEffect(() => {
    // Fetch collaborators list
    const fetchCollaborators = async () => {
      if (isAuthenticated && currentPlanId) {
        try {
          setLoading(true);
          console.log('Fetching collaborators for plan:', currentPlanId);
          // Query collaborators for the current plan using Gen 2 data client
          const response = await client.models.Collaborator.list({
            filter: {
              farewellPlanCollaboratorsId: {
                eq: currentPlanId
              }
            }
          });
          const collaboratorData = response.items || [];
          console.log('Raw collaborator data:', collaboratorData);
          // Transform data for the UI
          const transformedCollaborators = collaboratorData.map(collaborator => ({
            id: collaborator.id,
            name: collaborator.name || collaborator.email.split('@')[0],
            email: collaborator.email,
            relationship: collaborator.role || 'Collaborator',
            status: collaborator.status,
            invitedAt: collaborator.invitedAt
          }));
          console.log('Transformed collaborators:', transformedCollaborators);
          setCollaborators(transformedCollaborators);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching collaborators:', error);
          setLoading(false);
        }
      } else {
        console.log('Not fetching collaborators - authenticated:', isAuthenticated, 'planId:', currentPlanId);
        setLoading(false);
      }
    };
    
    fetchCollaborators();
  }, [isAuthenticated, user, currentPlanId, client]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (detailsRef.current && !detailsRef.current.contains(event.target)) {
        setExpandedDetails(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [detailsRef]);

  const handleRemoveCollaborator = async (collaboratorId) => {
    try {
      console.log('Removing collaborator:', collaboratorId);
      
      // Find the collaborator to be removed for the success modal
      const collaboratorToRemove = collaborators.find(c => c.id === collaboratorId);
      
      // Call GraphQL mutation to delete the collaborator
      const response = await client.graphql({
        query: deleteCollaborator,
        variables: {
          input: {
            id: collaboratorId
          }
        }
      });
      
      console.log('Collaborator deleted successfully:', response.data.deleteCollaborator);
      
      // Remove from state to update UI immediately
      setCollaborators(collaborators.filter(c => c.id !== collaboratorId));
      
      // Show success modal
      setRemovedCollaborator(collaboratorToRemove);
      
    } catch (error) {
      console.error('Error removing collaborator:', error);
      // You could add error state handling here
    }
  };

  const toggleDetails = (id) => {
    setExpandedDetails(expandedDetails === id ? null : id);
  };

  const closeRemoveModal = () => {
    setRemovedCollaborator(null);
  };
  
  const handleShareWishes = () => {
    navigate('/add-collaborator');
  };
  
  const handleShareMore = () => {
    setShowShareModal(false);
    navigate('/add-collaborator');
  };

  return (
    <StandardLayout
      title={
        <>
          <span className="h1b">Shared </span>
          <span className="h1">Wishes</span>
        </>
      }
      subtitle={
        <span className="h1sub">Update who can view your Farewell Wishes — add trusted people or remove access as needed.</span>
      }
      hideFooter={true}
      showFooter={false}
    >
      <div className="collaborator-dashboard-container">
        <FormBox className="collaborator-form-box">
          <div className="current-collaborators-section">
            <h2 className="section-title">Current Collaborators</h2>
            
            {loading ? (
              <div className="loading-indicator">Loading collaborators...</div>
            ) : collaborators.length === 0 ? (
              <div className="no-collaborators-message">
                <p>You haven't shared your wishes with anyone yet.</p>
              </div>
            ) : (
              <div className="collaborator-cards">
                <div className="collaborator-card header">
                  <div className="collaborator-name">Name</div>
                  <div className="collaborator-email">Email</div>
                  <div className="collaborator-relationship">Relationship</div>
                  <div className="collaborator-actions">Remove</div>
                </div>
                
                {collaborators.map((collaborator) => (
                  <div key={collaborator.id} className="collaborator-card">
                    <div className="collaborator-name">{collaborator.name}</div>
                    <div className="collaborator-email">{collaborator.email}</div>
                    <div className="collaborator-relationship">{collaborator.relationship || 'Not specified'}</div>
                    
                    {/* Mobile-only details button */}
                    <div className="mobile-details">
                      <div className="details-dropdown" ref={detailsRef}>
                        <button 
                          className="more-button" 
                          onClick={() => toggleDetails(collaborator.id)}
                          aria-label="Show more details"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#34547A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="1"></circle>
                            <circle cx="12" cy="5" r="1"></circle>
                            <circle cx="12" cy="19" r="1"></circle>
                          </svg>
                        </button>
                        
                        {expandedDetails === collaborator.id && (
                          <div className="details-dropdown-content show">
                            <div className="detail-item">
                              <span className="detail-label">Email:</span>
                              <span>{collaborator.email}</span>
                            </div>
                            <div className="detail-item">
                              <span className="detail-label">Relationship:</span>
                              <span>{collaborator.relationship || 'Not specified'}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="collaborator-actions">
                      <button 
                        className="remove-button" 
                        onClick={() => handleRemoveCollaborator(collaborator.id)}
                        aria-label={`Remove ${collaborator.name}`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B93636" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 6h18"></path>
                          <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="share-button-container">
              <PrimaryButton onClick={handleShareWishes} className="share-wishes-btn">
                Share Wishes
              </PrimaryButton>
            </div>
          </div>
        </FormBox>
      </div>
      
      {removedCollaborator && (
        <ShareMoreModal 
          modalType="removeSuccess"
          collaboratorName={removedCollaborator.name} 
          onClose={closeRemoveModal} 
        />
      )}
      
      {showShareModal && (
        <ShareMoreModal
          modalType="shareMore"
          isReturningUser={true}
          onClose={() => setShowShareModal(false)}
          onShareMore={handleShareMore}
        />
      )}
    </StandardLayout>
  );
};

export default CollaboratorDashboard;
