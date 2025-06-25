import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import PrimaryButton from '../buttons/PrimaryButton';
import SecondaryButton from '../buttons/SecondaryButton';
import TextInput from '../TextInput';
import PageWrapper from '../PageWrapper';
import '../../styles/LandingPages/ContactPage.css';

const ContactPage = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentSelection, setCurrentSelection] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [submissionError, setSubmissionError] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({ mode: "onSubmit" });

  const onApiErrors = (e) => {
    setSubmissionError(true);
    setIsSubmitted(true);
    console.error(e);
  };

  const onApiSuccess = () => {
    setIsSubmitted(true);
  };

  const onSubmit = (data) => {
    fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        company: data.company || '',
        message: data.message || '',
        contactType: currentSelection
      }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(onApiSuccess)
    .catch(onApiErrors);
  };

  const handleButtonClick = (userType) => {
    setCurrentSelection(userType);
    setCurrentStep(2);
  };

  return (
    <PageWrapper activePage="contact">
      <section className="contact-section">
        <div className="standard-content-wrapper">
          <div className="contact-header">
            <p className="h7">Contact</p>
            <h1 className="h1">
              We're here for <span className="h1b">you</span>
            </h1>
          </div>

          <div className="contact-form-container">
            {!isSubmitted && (
              <p className="contact-step-indicator">
                {currentStep}/2 Complete your information
              </p>
            )}

            {isSubmitted && (
              <div className="contact-success">
                <img 
                  src="/Picture/message_delivered.svg" 
                  alt="Message sent" 
                  className="contact-success-image" 
                />
                <h2 className="h3">Thank you!</h2>
                <p className="text">We've received your message and will be in touch shortly.</p>
                <PrimaryButton asLink href="/">Back to home</PrimaryButton>
              </div>
            )}

            {!isSubmitted && (
              <form 
                id="contact-us"
                className="contact-form"
                onSubmit={handleSubmit(onSubmit)}
              >
                {currentStep === 1 && (
                  <div className="contact-options">
                    <div 
                      className={`contact-option-card ${currentSelection === 'business' ? 'selected' : ''}`}
                      onClick={() => handleButtonClick("business")}
                    >
                      <img src="/Picture/icons/briefcase.svg" alt="Business" className="contact-icon" />
                      <p className="contact-option-text">I am a business</p>
                    </div>
                    
                    <div 
                      className={`contact-option-card ${currentSelection === 'individual' ? 'selected' : ''}`}
                      onClick={() => handleButtonClick("individual")}
                    >
                      <img src="/Picture/icons/person.svg" alt="Individual" className="contact-icon" />
                      <p className="contact-option-text">I am an individual</p>
                    </div>
                    
                    <div 
                      className={`contact-option-card ${currentSelection === 'provider' ? 'selected' : ''}`}
                      onClick={() => handleButtonClick("provider")}
                    >
                      <img src="/Picture/icons/healthcare.svg" alt="Healthcare" className="contact-icon" />
                      <p className="contact-option-text">I am a healthcare provider</p>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <>
                    {(currentSelection === 'business' || currentSelection === 'provider') && (
                      <div className="input-group">
                        <label htmlFor="company" className="input-label">Business name</label>
                        <TextInput
                          id="company"
                          placeholder="Enter your business name"
                          error={errors.company?.message}
                          {...register("company", {
                            required: "Business name is required",
                          })}
                        />
                      </div>
                    )}

                    <div className="input-group">
                      <label htmlFor="name" className="input-label">Contact name</label>
                      <TextInput
                        id="name"
                        placeholder="Enter your contact name"
                        error={errors.name?.message}
                        {...register("name", {
                          required: "Name is required",
                        })}
                      />
                    </div>

                    <div className="input-group">
                      <label htmlFor="email" className="input-label">Email</label>
                      <TextInput
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        error={errors.email?.message}
                        {...register("email", {
                          required: "Email is required",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Please enter a valid email",
                          },
                        })}
                      />
                    </div>

                    <div className="input-group">
                      <label htmlFor="message" className="input-label">Message (Optional)</label>
                      <TextInput
                        id="message"
                        type="textarea"
                        rows={3}
                        placeholder="Ask us any questions you have"
                        error={errors.message?.message}
                        {...register("message")}
                      />
                    </div>

                    <div className="form-button-container">
                      <PrimaryButton type="submit" fullWidth>Submit</PrimaryButton>
                    </div>
                  </>
                )}
              </form>
            )}
          </div>

          <p className="contact-privacy-text">
            By submitting this form, you agree to receive communications from Farewell Finder. 
            We respect your privacy and will not share your information with third parties 
            without your consent. You can unsubscribe at any time.
          </p>
        </div>
      </section>

      <section className="newsletter-section">
        <div className="standard-content-wrapper">
          <div className="newsletter-container">
            <h2 className="h2">Stay connected</h2>
            <p className="text">Subscribe to our newsletter to receive more information</p>
            
            <form className="newsletter-form">
              <TextInput 
                type="email" 
                placeholder="Email address" 
                className="newsletter-input" 
              />
              <PrimaryButton type="submit" className="newsletter-button">
                <span className="newsletter-button-text">→</span>
              </PrimaryButton>
            </form>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
};

export default ContactPage;
