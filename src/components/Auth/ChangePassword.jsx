// src/components/ResetPassword.jsx (renamed from ChangePassword.jsx)

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { confirmResetPassword } from 'aws-amplify/auth'; // 1. Import the Amplify function
import StandardLayout from '../StandardLayout';
import FormBox from '../FormBox';
import TextInput from '../TextInput';
import PrimaryButton from '../buttons/PrimaryButton';
import '../../styles/Auth.css';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation(); // 2. Get location to access the state passed from the previous page

  const [email, setEmail] = useState('');
  const [confirmationCode, setConfirmationCode] = useState(''); // 3. Add state for the code
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // 4. Get the email from the location state when the component mounts
    if (location.state?.email) {
      setEmail(location.state.email);
    } else {
      // If no email is present, the user got here by mistake. Send them back.
      setError('No email address provided. Please start the password reset process again.');
      setTimeout(() => navigate('/forgot-password'), 4000);
    }
  }, [location.state, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!confirmationCode || !newPassword || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      // 5. Call the real Amplify function with all required info
      await confirmResetPassword({
        username: email,
        confirmationCode,
        newPassword,
      });

      setMessage('Your password has been successfully reset! Redirecting to login...');
      setIsLoading(false);

      // 6. Navigate to login page with a success message
      setTimeout(() => {
        navigate('/login', { 
          state: { 
            message: 'Password successfully reset. Please log in.',
            email: email 
          } 
        });
      }, 3000);

    } catch (err) {
      console.error('Error resetting password:', err);
      if (err.name === 'CodeMismatchException') {
        setError('Invalid confirmation code. Please check the code and try again.');
      } else {
        setError(err.message || 'An error occurred. Please try again.');
      }
      setIsLoading(false);
    }
  };

  return (
    <StandardLayout
      title="Reset Your Password"
      subtitle="Please create a new password for your account."
      className="reset-password-page"
    >
      <FormBox>
        {message && <p className="auth-form__message success" role="alert">{message}</p>}
        
        {/* Only show the form if there is no success message */}
        {!message && (
          <form onSubmit={handleSubmit} className="auth-form">
            <p className="auth-form__instruction">
              A password reset code has been sent to <strong>{email}</strong>. Please enter the code and your new password below.
            </p>
            
            {/* 7. Add a new input for the confirmation code */}
            <TextInput
              id="confirmationCode"
              name="confirmationCode"
              type="text"
              label="Reset Code"
              placeholder="Enter the code from your email"
              value={confirmationCode}
              onChange={(e) => setConfirmationCode(e.target.value)}
              disabled={isLoading}
              containerClassName="auth-form__input-field"
            />
            
            <TextInput
              id="newPassword"
              name="newPassword"
              type="password"
              label="New Password"
              placeholder="Enter your new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={isLoading}
              containerClassName="auth-form__input-field"
            />
            
            <TextInput
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              label="Confirm New Password"
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
              containerClassName="auth-form__input-field"
            />

            {error && <p className="auth-form__message error" role="alert">{error}</p>}
            
            <div className="auth-form__button-container">
              <PrimaryButton type="submit" disabled={isLoading} className="auth-form__submit-button">
                {isLoading ? 'Resetting...' : 'Set New Password'}
              </PrimaryButton>
            </div>
            
            <div className="auth-form__links">
              <Link to="/login" className="auth-form__link">Back to Login</Link>
            </div>
          </form>
        )}
      </FormBox>
    </StandardLayout>
  );
};

export default ResetPassword;