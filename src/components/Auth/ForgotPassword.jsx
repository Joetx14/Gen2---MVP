// src/components/ForgotPassword.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { resetPassword } from 'aws-amplify/auth'; // 1. Import the Amplify function
import StandardLayout from '../StandardLayout';
import FormBox from '../FormBox';
import TextInput from '../TextInput';
import PrimaryButton from '../buttons/PrimaryButton';
import '../../styles/Auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // 2. We'll use navigate to move to the next step

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!email.trim()) {
      setError('Please enter your email address.');
      setIsLoading(false);
      return;
    }

    try {
      // 3. Call the real Amplify resetPassword function
      await resetPassword({ username: email });
      
      // 4. On success, navigate to the reset screen and pass the email
      // This is crucial for the next step.
      navigate('/reset-password', {
        state: { email: email }
      });

    } catch (err) {
      console.error('Error sending reset password code:', err);
      // It's best practice not to reveal if an email exists or not.
      // So we show a generic error, but you could handle specific errors if you prefer.
      if (err.name === 'UserNotFoundException') {
        setError('If an account with that email exists, a code has been sent.');
      } else {
        setError(err.message || 'An error occurred. Please try again.');
      }
      setIsLoading(false);
    }
  };

  return (
    <StandardLayout
      title="Forgot Password?"
      subtitle="We'll help you reset it."
      className="forgot-password-page"
    >
      <FormBox>
        <form onSubmit={handleSubmit} className="auth-form">
          <p className="auth-form__instruction">
            Enter the email address associated with your account. If found, we'll send a code to reset your password.
          </p>
          <TextInput
            id="email"
            name="email"
            type="email"
            label="Email Address"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            containerClassName="auth-form__input-field"
            aria-describedby={error ? "auth-message" : undefined}
          />
          <div className="auth-form__button-container">
            <PrimaryButton type="submit" disabled={isLoading} className="auth-form__submit-button">
              {isLoading ? 'Sending...' : 'Send Reset Code'}
            </PrimaryButton>
          </div>
          {error && <p id="auth-message" className="auth-form__message error" role="alert">{error}</p>}
          <div className="auth-form__links">
            <Link to="/login" className="auth-form__link">Back to Login</Link>
          </div>
        </form>
      </FormBox>
    </StandardLayout>
  );
};

export default ForgotPassword;