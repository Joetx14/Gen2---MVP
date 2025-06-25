import React, { createContext, useState, useContext, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe("pk_live_51RXnXYG0OYrUVFvzvxfcvFJxJHtFuIUzTZqOx7RZvDj8Es79dfrOIjG0O3AyZtFFo0UJ6oTguE0xw8PfcjFG06K600pplwA7ej");

// Create the context
const PaymentContext = createContext();

// Custom hook to use the payment context
export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};

export const PaymentProvider = ({ children }) => {
  const [clientSecret, setClientSecret] = useState('');
  const [paymentError, setPaymentError] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('idle'); // 'idle', 'loading', 'succeeded', 'failed'

  // Create a payment intent
  const createPaymentIntent = async (amount, isRecurring = false) => {
    if (amount <= 0) {
      setPaymentError('Amount must be greater than zero.');
      return null;
    }

    setPaymentStatus('loading');
    setPaymentError(null);

    try {
      const response = await fetch('http://localhost:4242/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          amount: amount, 
          isRecurring,
          // Let the server decide which payment methods to enable
          automatic_payment_methods: { enabled: true }
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create payment intent');
      }

      setClientSecret(data.clientSecret);
      setPaymentStatus('idle');
      return data.clientSecret;
    } catch (error) {
      console.error('Payment intent creation failed:', error);
      setPaymentError(error.message || 'Failed to connect to payment service');
      setPaymentStatus('failed');
      return null;
    }
  };

  // Confirm a payment with Stripe
  const confirmPayment = async (stripe, elements, billingDetails) => {
    if (!stripe || !elements || !clientSecret) {
      setPaymentError('Payment cannot be processed at this time.');
      return { error: { message: 'Payment cannot be processed at this time.' } };
    }

    setPaymentStatus('loading');

    try {
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/dashboard?payment_success=true`,
          payment_method_data: {
            billing_details: billingDetails,
          },
        },
        redirect: 'if_required',
      });

      if (result.error) {
        setPaymentError(result.error.message);
        setPaymentStatus('failed');
        return result;
      }

      // Payment succeeded or requires further action (handled by redirect)
      setPaymentStatus('succeeded');
      return result;
    } catch (error) {
      console.error('Payment confirmation failed:', error);
      setPaymentError(error.message || 'An unexpected error occurred');
      setPaymentStatus('failed');
      return { error };
    }
  };

  // Get options for Stripe Elements
  const getElementsOptions = () => ({
    clientSecret,
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#c05f68',
        colorBackground: '#f8fafc',
        colorText: '#455778',
      },
    },
  });

  const value = {
    // State
    clientSecret,
    paymentError,
    paymentStatus,
    stripePromise,
    
    // Methods
    createPaymentIntent,
    confirmPayment,
    setPaymentError,
    getElementsOptions,
    
    // Helper methods
    clearPaymentState: () => {
      setClientSecret('');
      setPaymentError(null);
      setPaymentStatus('idle');
    },
  };

  return <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>;
};

export default PaymentContext;
