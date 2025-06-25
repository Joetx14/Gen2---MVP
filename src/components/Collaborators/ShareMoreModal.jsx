import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Collaborators/ShareMoreModal.css'; 

const CollaboratorManager = () => {
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [removedCollaborator, setRemovedCollaborator] = useState('');

  const handleRemoveCollaborator = (name) => {
    // Process removal...
    
    // Then show the modal
    setRemovedCollaborator(name);
    setShowRemoveModal(true);
  };

  return (
    <div>
      {/* Your existing JSX for managing collaborators */}
      
      {showRemoveModal && (
        <ShareMoreModal
          modalType="removeSuccess"
          collaboratorName={removedCollaborator}
          onClose={() => {
            setShowRemoveModal(false);
            navigate('/collaborator/dashboard');
          }}
        />
      )}
    </div>
  );
};

const ShareMoreModal = ({ 
  collaboratorName = '',
  onClose, 
  onShareMore 
}) => {
  const navigate = useNavigate();
  // Extract first name for more personal messaging
  const firstName = collaboratorName.split(' ')[0];

  return (
    <div className="modal-backdrop">
      <div className="modal-container">
        <button 
          className="modal-close" 
          onClick={() => navigate('/confirm-wishes')}
          aria-label="Return to wishes"
        >
          <img src="/Picture/exit-x.svg" alt="Close" />
        </button>
        
        <div className="modal-content">
          <div className="modal-icon">
            <img src="/Picture/high-five.svg" alt="High five" />
          </div>
          
          <h2 className="modal-heading">Wishes Shared with {collaboratorName}!</h2>
          
          <p className="modal-message">
            Your farewell wishes are now accessible to {firstName}.
            <br />
            <span className="support-message">Your support helps us continue this service.</span>
          </p>
          
          <div className="modal-actions">
            <button 
              className="primary-action" 
              onClick={() => navigate('/donation')}
            >
              Donate to support our work
            </button>
            
            <button 
              className="secondary-action"
              onClick={onShareMore}
            >
              Share with someone else
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareMoreModal;
