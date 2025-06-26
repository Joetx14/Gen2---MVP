// src/components/Donation.jsx (Updated for PaymentElement Integration)

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useNavigate, useLocation } from "react-router-dom";
import StandardLayout from "../StandardLayout";
import FormBox from "../FormBox";
import TextInput from "../TextInput";
import { usePlanningData } from '../../context/usePlanningData';
import "../../styles/Paywalls/Donation.css"; // Ensure this path is correct

const DonationFormContent = ({ 
  donationAmount, 
  firstName, 
  lastName, 
  setPaymentError,
  setIsSubmitting, 
  navigate, 
  clientSecret, 
  isRecurring 
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    console.log('DonationFormContent mounted');
    console.log('Stripe initialized:', !!stripe);
    console.log('Elements initialized:', !!elements);
  }, [stripe, elements]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsProcessing(true);
    setIsSubmitting(true);

    if (!stripe || !elements) {
      setPaymentError("Stripe is not loaded yet. Please try again in a moment.");
      setIsProcessing(false);
      setIsSubmitting(false);
      return;
    }

    setPaymentError(null);

    try {
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/dashboard?payment_success=true`,
          payment_method_data: {
            billing_details: {
              name: `${firstName} ${lastName}`.trim(),
              email: firstName ? `${firstName.toLowerCase()}@example.com` : undefined,
            }
          }
        },
        redirect: 'if_required',
      });

      if (result.error) {
        console.error("[Stripe error]", result.error);
        setPaymentError(result.error.message || "An unexpected error occurred during payment.");
        setIsProcessing(false);
        setIsSubmitting(false);
      } else {
        // Payment initiated successfully
        navigate('/dashboard?payment_success=true');
      }
    } catch (error) {
      console.error("Payment confirmation error:", error);
      setPaymentError("An unexpected error occurred. Please try again.");
      setIsProcessing(false);
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <div style={{ marginBottom: '20px' }}>
        <PaymentElement 
          options={{
            layout: 'tabs'
          }}
        />
      </div>
      
      <button
        type="submit"
        className="pay-button"
        disabled={!stripe || !elements || isProcessing}
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: '#c05f68',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer'
        }}
      >
        {isProcessing ? (
          <span>Processing...</span>
        ) : (
          <span>Pay ${donationAmount.toFixed(2)}</span>
        )}
      </button>
    </form>
  );
};


const Donation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { routeToLastStep } = usePlanningData();
  const returnToPlanning = location.state?.returnToPlanning;
  const lastStep = location.state?.lastStep;

  const [isRecurring, setIsRecurring] = useState(true);
  const monthlyAmounts = [3, 9]; // Changed 3 to 3.9 as per previous discussion
  const oneTimeAmounts = [10, 25];

  const [donationAmount, setDonationAmount] = useState(monthlyAmounts[0]); // Default to 3.9
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [paymentError, setPaymentError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // Used to control overall form submission state
  const [isCustomAmount, setIsCustomAmount] = useState(false);
  const [customAmount, setCustomAmount] = useState("");
  const [clientSecret, setClientSecret] = useState(""); // State to store client secret from backend
  const [stripeError, setStripeError] = useState(null);
  const [stripePromise, setStripePromise] = useState(null);

  useEffect(() => {
    let isMounted = true;
    import('@stripe/stripe-js').then(({ loadStripe }) => {
      if (isMounted) {
        setStripePromise(loadStripe('pk_test_51RXnXYG0OYrUVFvzGJONOsFdtY0ib6iFfSkvdpOEV9YTk1TQ4FjGvf2xp5G4a6wHZlMpfuKP8SrCi5kQ8R9uSKyB00ZTz09Pol'));
      }
    });
    return () => { isMounted = false; };
  }, []);

  // Effect to fetch clientSecret whenever donationAmount or isRecurring changes
  useEffect(() => {
    const fetchClientSecret = async () => {
      if (donationAmount <= 0) {
        setClientSecret("");
        setPaymentError("Donation amount must be greater than zero.");
        return;
      }
      
      setPaymentError(null);
      
      try {
        console.log("Fetching client secret for amount:", donationAmount);
        // Convert to cents for Stripe
        const donationAmountInCents = Math.round(donationAmount * 100);
        
        const response = await fetch("https://us-central1-farewell-app.cloudfunctions.net/createPaymentIntent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            amount: donationAmountInCents,
            isRecurring 
          }),
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(
            errorData && errorData.error 
              ? errorData.error 
              : `HTTP error! Status: ${response.status}`
          );
        }
        
        const data = await response.json();
        console.log("Client secret received:", data.clientSecret ? "✓" : "✗");
        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error("Error fetching client secret:", error);
        setPaymentError(`Failed to initialize payment: ${error.message}`);
      }
    };
    
    fetchClientSecret();
  }, [donationAmount, isRecurring]); // Re-fetch when donationAmount or isRecurring changes

  // Update donation amount and custom amount state on toggle
  useEffect(() => {
    // If we're toggling and custom amount was active, default to it
    // otherwise set to standard
    if (isCustomAmount && parseFloat(customAmount) > 0) {
      setDonationAmount(parseFloat(customAmount));
    } else {
      setDonationAmount(isRecurring ? monthlyAmounts[0] : oneTimeAmounts[0]); // Default to first amount
      setIsCustomAmount(false); // Ensure custom is not selected if default is used
    }
    setCustomAmount(""); // Clear custom amount input
  }, [isRecurring]);


  const handleRecurringToggle = (recurring) => {
    setIsRecurring(recurring);
    // Amount will be set by the useEffect depending on isRecurring
  };

  const handleAmountSelect = (amount) => {
    setDonationAmount(amount);
    setIsCustomAmount(false);
  };

  const handleCustomAmountSelect = () => {
    setIsCustomAmount(true);
    // If a non-custom amount was selected, copy it to customAmount input
    if (!isCustomAmount) {
      setCustomAmount(donationAmount.toString());
    }
  };

  const handleCustomAmountChange = (e) => {
    const value = e.target.value.replace(/[^\d.]/g, '');
    const parts = value.split('.');
    if (parts.length > 2) return; // Prevent multiple decimal points
    if (parts[1] && parts[1].length > 2) parts[1] = parts[1].substring(0, 2); // Limit to 2 decimal places
    const sanitized = parts.join('.');
    setCustomAmount(sanitized);
    setDonationAmount(parseFloat(sanitized) || 0);
  };

  const handleExit = () => {
    if (returnToPlanning && lastStep) {
      navigate(lastStep);
    } else {
      navigate("/confirm-wishes");
    }
  };

  const handleSuccess = () => {
    if (returnToPlanning && lastStep) {
      navigate(lastStep);
    } else {
      navigate("/dashboard");
    }
  };

  // Initialize the options object for Stripe Elements
  const stripeElementsOptions = useMemo(() => {
    return clientSecret ? {
      clientSecret,
      appearance: {
        theme: 'stripe',
        variables: {
          colorPrimary: '#c05f68',
          colorBackground: '#ffffff',
          colorText: '#30313d',
          fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
          borderRadius: '4px',
        },
      },
      loader: 'auto',
    } : null;
  }, [clientSecret]);

  // Add a function to handle Checkout redirect
  const handleCheckoutRedirect = async () => {
    try {
      setIsSubmitting(true);
      // Convert to cents for Stripe
      const donationAmountInCents = Math.round(donationAmount * 100);
      
      const response = await fetch("https://us-central1-farewell-app.cloudfunctions.net/createCheckoutSession", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          amount: donationAmountInCents, 
          isRecurring,
          successUrl: `${window.location.origin}/dashboard?success=true`,
          cancelUrl: `${window.location.origin}/donation?canceled=true`
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || `HTTP error ${response.status}`);
      }
      
      const { url } = await response.json();
      console.log("Redirecting to checkout:", url);
      window.location.href = url;
    } catch (error) {
      console.error("Error redirecting to checkout:", error);
      setPaymentError(`Failed to redirect to checkout: ${error.message}`);
      setIsSubmitting(false);
    }
  };

  return (
    <StandardLayout
      title={<><span className="h1b">Support</span> <span className="h1">Our Cause</span></>}
      subtitle={<span className="h1sub">And secure access to Farewell for life!</span>}
      hideFooter={true}
      showFooter={false}
    >
      <div className="donation-container">
        <FormBox className="donation-form-box">
          <button type="button" className="exit-button" onClick={handleExit} aria-label="Close donation form">
            <img src="/Picture/exit-x.svg" alt="Close" />
          </button>

          <div className="impact-message">
            Your contribution helps families navigate end-of-life planning with dignity and care.
          </div>

          <div className="contribution-tabs" role="tablist">
            <button
              type="button"
              className={`tab ${isRecurring ? 'active' : ''}`}
              onClick={() => handleRecurringToggle(true)}
              role="tab"
              aria-selected={isRecurring}
              aria-controls="monthly-donation-panel"
              id="monthly-tab"
            >
              <span className="tab-label">Monthly</span>
              <span className="tab-benefit">Help us grow</span>
            </button>
            <button
              type="button"
              className={`tab ${!isRecurring ? 'active' : ''}`}
              onClick={() => handleRecurringToggle(false)}
              role="tab"
              aria-selected={!isRecurring}
              aria-controls="one-time-donation-panel"
              id="one-time-tab"
            >
              <span className="tab-label">One-time</span>
              <span className="tab-benefit">Quick support</span>
            </button>
          </div>

          <div
            className="amount-selection"
            role="tabpanel"
            id={isRecurring ? 'monthly-donation-panel' : 'one-time-donation-panel'}
            aria-labelledby={isRecurring ? 'monthly-tab' : 'one-time-tab'}
          >
            <label className="form-label" id="select-amount-label">Select an amount</label>
            <div className="amount-options" role="radiogroup" aria-labelledby="select-amount-label">
              {(isRecurring ? monthlyAmounts : oneTimeAmounts).map(amount => (
                <button
                  key={amount}
                  type="button"
                  className={`amount-option ${donationAmount === amount && !isCustomAmount ? 'selected' : ''}`}
                  onClick={() => handleAmountSelect(amount)}
                  role="radio"
                  aria-checked={donationAmount === amount && !isCustomAmount}
                >
                  ${amount}
                </button>
              ))}
              <button
                type="button"
                className={`amount-option ${isCustomAmount ? 'selected' : ''}`}
                onClick={handleCustomAmountSelect}
                role="radio"
                aria-checked={isCustomAmount}
              >
                Custom
              </button>
            </div>
            {isCustomAmount && (
              <div className="custom-amount">
                <div className="input-with-prefix">
                  <span className="currency-prefix" aria-hidden="true">$</span>
                  <input
                    className="custom-amount-input" // Use your custom-amount-input class
                    type="text"
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                    placeholder="0.00"
                    aria-label="Custom donation amount"
                    inputMode="decimal"
                    autoFocus // Auto-focus when custom is selected
                  />
                </div>
              </div>
            )}
            <div className="amount-summary" aria-live="polite">
              <span className="amount-label">{isRecurring ? 'Monthly donation:' : 'One-time donation:'}</span>
              <span className="amount-value">${donationAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* Stripe Elements wrapper */}
          {clientSecret && donationAmount > 0 ? (
            <Elements
              stripe={stripePromise}
              options={stripeElementsOptions}
            >
              <DonationFormContent
                donationAmount={donationAmount}
                firstName={firstName}
                lastName={lastName}
                setPaymentError={setPaymentError}
                setIsSubmitting={setIsSubmitting}
                navigate={navigate}
                clientSecret={clientSecret}
                isRecurring={isRecurring}
              />
            </Elements>
          ) : (
            <div className="loading-payment-section">
              {paymentError ? (
                <p className="error-message">{paymentError}</p>
              ) : (
                <p>Loading payment options...</p>
              )}
            </div>
          )}

          {stripeError && (
            <div className="error-message full-width">
              {stripeError}
            </div>
          )}

          <div className="privacy-note">
            <p className="donation-privacy-text">
              Your payment information is secure. By proceeding, you agree to our <a href="/terms" target="_blank" rel="noopener noreferrer">Terms of Service</a> and <a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.
            </p>
          </div>

          <p className="unlock-message">
            By completing this support, you'll immediately unlock access to all future features of Farewell at no additional cost.
          </p>

          {/* Debug panel - remove in production */}
          {process.env.NODE_ENV !== 'production' && (
            <div style={{ marginTop: '20px', padding: '10px', background: '#f5f5f5', borderRadius: '5px' }}>
              <h4>Debug Info</h4>
              <div>Client Secret: {clientSecret ? '✅ Received' : '❌ Missing'}</div>
              <div>Amount: ${donationAmount}</div>
              <div>Recurring: {isRecurring ? 'Yes' : 'No'}</div>
              <div>Error: {paymentError || stripeError || 'None'}</div>
              {/* Debug panel - Test connection button */}
              <button
                type="button" 
                onClick={() => {
                  // Convert to cents for Stripe
                  const donationAmountInCents = Math.round(donationAmount * 100);
                  
                  fetch("https://us-central1-farewell-app.cloudfunctions.net/createPaymentIntent", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ amount: donationAmountInCents, isRecurring }),
                  })
                  .then(res => res.json())
                  .then(data => {
                    console.log("Test request successful:", data);
                    alert("Test successful - see console");
                  })
                  .catch(err => {
                    console.error("Test request failed:", err);
                    alert("Test failed - see console");
                  });
                }}
                style={{ marginTop: '10px', padding: '5px 10px' }}
              >
                Test Connection
              </button>
            </div>
          )}

          {/* Add a button to trigger Checkout */}
          <button 
            type="button"
            onClick={handleCheckoutRedirect}
            className="pay-button"
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            Try Stripe Checkout Instead
          </button>
        </FormBox>
      </div>
    </StandardLayout>
  );
};

export default Donation;
