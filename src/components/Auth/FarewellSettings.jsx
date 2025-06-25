import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import StandardLayout from '../StandardLayout';
import FormBox from '../FormBox';
import TextInput from '../TextInput';
import PrimaryButton from '../buttons/PrimaryButton';
import '../../styles/Auth.css';

const FarewellSettings = () => {
  const { user, updateUserProfile, deleteAccount } = useAuth();
  const navigate = useNavigate();
  
  // State variables
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  
  // Load user data
  useEffect(() => {
    if (user) {
      setName(user.displayName || '');
      setEmail(user.email || '');
      setSubscribed(user.subscribed !== false); // Default to true if not specified
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    
    try {
      await updateUserProfile({
        displayName: name,
        email: email,
        subscribed: subscribed
      });
      setMessage('Profile updated successfully!');
    } catch (error) {
      setMessage(`Error updating profile: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteRequest = async () => {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      return;
    }
    
    setIsLoading(true);
    try {
      await deleteAccount();
      // Redirect to home page after account deletion
      navigate('/');
    } catch (error) {
      setMessage(`Error deleting account: ${error.message}`);
      setIsLoading(false);
    }
  };

  return (
    <StandardLayout
      title="Account Settings"
      subtitle="Manage your profile and account preferences"
    >
      <FormBox>
        <form onSubmit={handleUpdateProfile} className="auth-form">
          <h2>Personal Information</h2>
          
          <TextInput
            id="name"
            name="name"
            label="Full Name"
            placeholder="Your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
            containerClassName="auth-form__input-field"
          />
          
          <TextInput
            id="email"
            name="email"
            type="email"
            label="Email Address"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            containerClassName="auth-form__input-field"
          />
          
          <div className="preference-toggle">
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={subscribed}
                onChange={() => setSubscribed(!subscribed)}
                disabled={isLoading}
              />
              <span className="checkmark"></span>
              Receive updates and notifications
            </label>
            <p className="preference-description">
              We'll send you important updates about your account and farewell planning.
            </p>
          </div>
          
          {message && (
            <p className="auth-form__message" role="alert">
              {message}
            </p>
          )}
          
          <div className="auth-form__button-container">
            <PrimaryButton 
              type="submit" 
              disabled={isLoading} 
              className="auth-form__submit-button"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </PrimaryButton>
          </div>
        </form>
        
        <div className="danger-zone">
          <h2>Delete Account</h2>
          <p>
            This action is permanent and cannot be undone. All your personal information 
            and farewell plans will be permanently removed.
          </p>
          
          {!deleteConfirm ? (
            <button 
              className="delete-account-btn" 
              onClick={handleDeleteRequest}
              disabled={isLoading}
            >
              Delete My Account
            </button>
          ) : (
            <div className="delete-confirmation">
              <p>Are you sure you want to delete your account?</p>
              <div className="delete-actions">
                <button 
                  className="delete-confirm-btn" 
                  onClick={handleDeleteRequest}
                  disabled={isLoading}
                >
                  {isLoading ? 'Deleting...' : 'Yes, Delete My Account'}
                </button>
                <button 
                  className="delete-cancel-btn" 
                  onClick={() => setDeleteConfirm(false)}
                  disabled={isLoading}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </FormBox>
    </StandardLayout>
  );
};

export default FarewellSettings;
