import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { signIn } from 'aws-amplify/auth';
import { usePlanningData } from '../../context/PlanningDataContext'; 
import FormBox from '../FormBox';
import TextInput from '../TextInput';
import PrimaryButton from '../buttons/PrimaryButton';
import StandardLayout from '../StandardLayout';


import '../../styles/OnboardingForms.css';

const Login = () => {
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailErr, setEmailErr] = useState('');
  const [passwordErr, setPasswordErr] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const { formData } = usePlanningData();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check for success message from registration
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      if (location.state?.email) {
        setEmail(location.state.email);
      }
    }
  }, [location.state]);
    const handleLogin = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setEmailErr('');
    setPasswordErr('');
    setGeneralError('');
    
    // Validate form
    let isValid = true;
    if (!email) {
      setEmailErr('Email is required');
      isValid = false;
    }
    if (!password) {
      setPasswordErr('Password is required');
      isValid = false;
    }
    
    if (!isValid) return;
    
    setIsLoading(true);    try {
      // Authenticate with AWS Amplify
      console.log('🔐 Attempting sign in with:', { email, passwordLength: password.length });
      console.log('📧 Email format check:', /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
      
      const signInResult = await signIn({
        username: email,
        password: password
      });

      console.log('✅ Sign in result:', signInResult);
      console.log('🔑 isSignedIn:', signInResult.isSignedIn);
      console.log('🔄 nextStep:', signInResult.nextStep);      if (signInResult.isSignedIn) {
        console.log('User is signed in successfully');
        
        // Check if user has existing planning data
        const hasExistingPlan = formData._metadata?.lastVisitedStep || 
                               formData._metadata?.completedSteps?.length > 0 ||
                               Object.keys(formData.basicInformation || {}).length > 0;
        
        if (hasExistingPlan) {
          // Redirect to welcome back screen for returning users
          navigate('/welcome-back');
        } else {
          // New user or no existing data, redirect to welcome screen
          navigate('/welcome');
        }
      } else {
        // Handle cases where sign in is not complete (e.g., requires verification)
        console.log('❓ Sign in not complete. NextStep details:', signInResult.nextStep);
        console.log('📋 NextStep type:', signInResult.nextStep?.signInStep);
        console.log('📝 Additional info:', signInResult.nextStep?.additionalInfo);
          // Handle different next steps
        if (signInResult.nextStep?.signInStep === 'CONFIRM_SIGN_UP') {
          // For MVP: Auto-confirm the user instead of requiring email verification
          setGeneralError('Account needs verification. Attempting to verify automatically...');
          console.log('📧 User needs verification - attempting auto-confirm for MVP');
          
          // Try to auto-confirm the user (this is a temporary MVP solution)
          try {
            const { confirmSignUp } = await import('aws-amplify/auth');
            // For MVP, we'll use a dummy confirmation code since we're bypassing verification
            await confirmSignUp({
              username: email,
              confirmationCode: '000000' // This won't work, but let's see the error
            });
          } catch (confirmError) {
            console.log('Auto-confirm failed (expected):', confirmError);
            setGeneralError('Please contact support to verify your account for this MVP.');
          }
        } else if (signInResult.nextStep?.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
          setGeneralError('Password change required. Please contact support.');
          console.log('🔐 User needs to change password');
        } else if (signInResult.nextStep?.signInStep === 'CONFIRM_SIGN_IN_WITH_SMS_MFA') {
          setGeneralError('SMS verification required. This is not currently supported.');
          console.log('📱 SMS MFA required');
        } else {
          setGeneralError('Sign in incomplete. Please check your credentials.');
          console.log('❓ Unknown sign-in step required');
        }
      }} catch (error) {
      console.error("❌ Login error details:");
      console.error("- Error name:", error.name);      console.error("- Error message:", error.message);
      console.error("- Error code:", error.code);
      console.error("- Full error:", error);
      console.error("- Email used:", email);
      console.error("- Password length:", password.length);
      
      // Log additional debugging info
      if (error.$response) {
        console.error("- Response status:", error.$response.statusCode);
        console.error("- Response body:", error.$response.body);
      }
        // Handle specific AWS Amplify errors
      if (error.name === 'NotAuthorizedException') {
        setPasswordErr('Incorrect username or password');
        console.error('🚫 This usually means wrong password or user needs confirmation');
      } else if (error.name === 'UserNotFoundException') {
        setEmailErr('No account found with this email address');
        console.error('👤 User not found - check if registration completed successfully');
      } else if (error.name === 'TooManyRequestsException') {
        setGeneralError('Too many login attempts. Please try again later.');
      } else if (error.name === 'UserNotConfirmedException') {
        setGeneralError('Account not verified. Please check your email for verification link.');
        console.error('📧 User exists but not confirmed - check email verification');
      } else if (error.name === 'InvalidParameterException') {
        setGeneralError('Invalid login parameters. Please check your email format.');
        console.error('⚠️ Invalid parameters - likely email format issue');
      } else {
        setGeneralError(error.message || 'Login failed. Please try again.');
        console.error('❓ Unhandled error type:', error.name);
      }
    } finally {
      setIsLoading(false);
    }  };
  
  return (
    <StandardLayout
      title={
        <>
          <h2 className="h1sub pre-title-subtitle">Good to see you again. Your plans, your pace.</h2>
          <span className="h1">
            Let's continue your <span className="h1b">farewell</span> <span className="h1">journey.</span>
          </span>
        </>
      }
      className="login-page"
    >
      <div className="onboarding-form-content">
        <FormBox className="onboarding-formbox">
          <form className="standard-form" onSubmit={handleLogin} noValidate>            <TextInput
              label="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailErr('');
              }}
              type="email"
              error={emailErr}
              required
            />
            
            {/* Password field with integrated toggle button */}
            <TextInput
              label="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordErr('');
                setGeneralError('');
              }}
              type="password"  // Just use "password" - let TextInput handle toggling
              error={passwordErr}
              required            />

            {/* Display success message */}
            {successMessage && (
              <div className="success-message" style={{ 
                color: '#27ae60', 
                fontSize: '14px', 
                marginTop: '10px',
                textAlign: 'center',
                backgroundColor: '#d5f4e6',
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #27ae60'
              }}>
                {successMessage}
              </div>
            )}

            {/* Display general error message */}
            {generalError && (
              <div className="error-message" style={{ 
                color: '#e74c3c', 
                fontSize: '14px', 
                marginTop: '10px',
                textAlign: 'center' 
              }}>
                {generalError}
              </div>
            )}

            {/* Move forgot password link here - directly under password field */}
            <div className="forgot-password-link">
              <Link to="/forgot-password">Forgot password?</Link>
            </div>

            {/* Button remains after the forgotten password link */}
            <div className="onboarding-button-container">
              <PrimaryButton 
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Log In'}
              </PrimaryButton>
            </div>
              <div className="onboarding-privacy-container">
              <p className="privacy-text">
                By logging in you are accepting our{' '}
                <Link to="/terms" className="privacy-link">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="privacy-link">
                  Privacy Policy
                </Link>.
              </p>
            </div>
          </form>
        </FormBox>
      </div>
    </StandardLayout>
  );
};

export default Login;
