/// src/components/InviteCode.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { generateClient } from 'aws-amplify/api';
// Removed: import { getPromoCodeByCode } from '../../graphql/queries';
import StandardLayout from '../StandardLayout';
import FormBox from '../FormBox';
import TextInput from '../TextInput';
import PrimaryButton from '../buttons/PrimaryButton';
import '../../styles/OnboardingForms.css';

const InviteCode = () => {
  const nav = useNavigate();
  const location = useLocation();
  const fromLanding = location.state?.fromLanding || false;
  const client = generateClient();
  // --- state ---
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // -------------

  // Example: If you want to check promo codes in the backend, use Gen 2 client
  // async function checkPromoCode(code) {
  //   const result = await client.models.PromoCode.list({ filter: { code: { eq: code } } });
  //   return result.items.length > 0 ? result.items[0] : null;
  // }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // 1. Define the list of valid invite codes directly in the code.
    // This check is case-sensitive.
    const validCodes = ['farewell2025', 'Farewell2025'];

    // 2. Check if the entered code is in our list.
    if (validCodes.includes(code)) {
      // 3. If the code is valid, save the code and navigate.
      console.log('Valid invite code entered locally. Proceeding to create password.');
      localStorage.setItem('promoCode', code);
      nav('/create-password');
    } else {
      // 4. If the code is invalid, show an error message immediately.
      setError('The invite code you entered is not valid.');
      setIsLoading(false); // Stop the loading indicator
    }
  };

  return (
    <StandardLayout
      title={
        <span className="h1">
          <span className="h1b">Farewell</span> plans that celebrate you
        </span>
      }
      subtitle="Because how we say goodbye matters."
      className="invite-page"
    >
      {/* Use onboarding-form-content instead of invite-content */}
      <div className="onboarding-form-content">
        <FormBox className="onboarding-formbox">
          <form className="standard-form" onSubmit={handleSubmit} noValidate>
            <TextInput
              label="Invite Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter your invite code"
              error={error}
              required
            />
            
            <div className="onboarding-button-container">
              <PrimaryButton 
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? 'Verifying...' : 'Continue'}
              </PrimaryButton>            </div>
              {/* Use the shared privacy text container */}
            <div className="onboarding-privacy-container">
              <p className="privacy-text">
                By proceeding you are accepting our{' '}
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

export default InviteCode;