import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signUp, signIn } from 'aws-amplify/auth';
import StandardLayout from '../StandardLayout';
import FormBox from '../FormBox';
import TextInput from '../TextInput';
import PrimaryButton from '../buttons/PrimaryButton';

import '../../styles/OnboardingForms.css';

const CreatePassword = () => {
  const [email, setEmail] = useState(() => localStorage.getItem('email') || ''); // This will be set from localStorage in a real app
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Basic frontend validation
    if (!email) { // You might want to make this check more robust
      setError('Email is required');
      setIsSubmitting(false);
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      setIsSubmitting(false);
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Create the user (sign up)
      const { isSignUpComplete } = await signUp({
        username: email,
        password: password,
        attributes: {
          email,
        },
      });
      if (isSignUpComplete) {
        // Wait for Cognito to propagate the new user
        await new Promise(res => setTimeout(res, 1500));
        const { isSignedIn } = await signIn(email, password);
        if (isSignedIn) {
          localStorage.removeItem('email');
          navigate('/welcome');
        } else {
          setError('Sign in failed after registration. Please try logging in.');
        }
      } else {
        setError('Sign up incomplete. Please try again.');
      }
    } catch (err) {
      console.error('Sign up error:', err);
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <StandardLayout
      title={
        <>
          <h2 className="h1sub pre-title-subtitle">Create your account</h2>
          <span className="h1">
            Set your <span className="h1b">email</span> and <span className="h1b">password</span> to complete registration.
          </span>
        </>
      }
    >
      <div className="onboarding-form-content">
        <FormBox className="onboarding-formbox">
          <form className="standard-form" onSubmit={handleSubmit} noValidate>
            <TextInput
              label="Email Address"
              value={email}
              onChange={e => {
                setEmail(e.target.value);
                localStorage.setItem('email', e.target.value);
              }}
              // In a real flow, you might want this to be disabled if it's pre-filled
              // disabled={true} 
              type="email"
              required
              autoFocus
            />
            <TextInput
              label="Create Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              type="password"
              placeholder="Create a secure password"
              required
              helperText="Use at least 8 characters"
            />
            <TextInput
              label="Confirm Password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              type="password"
              placeholder="Confirm your password"
              required
            />
            {error && <div className="error-message">{error}</div>}
            <div className="onboarding-button-container">
              <PrimaryButton 
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
              </PrimaryButton>
            </div>
            <p className="privacy-text">
              By creating an account you are accepting our{' '}
              <a href="/terms" target="_blank" rel="noreferrer" className="privacy-link">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" target="_blank" rel="noreferrer" className="privacy-link">
                Privacy Policy
              </a>.
            </p>
          </form>
        </FormBox>
      </div>
    </StandardLayout>
  );
};

export default CreatePassword;