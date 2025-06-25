import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import PrimaryButton from '../buttons/PrimaryButton';
import SecondaryButton from '../buttons/SecondaryButton';
import Footer from '../Footer';
import TopNav from '../TopNav';
import ChoiceCard from '../ChoiceCard';
import '../../styles/LandingPages/Waitlist.css';

const WaitlistPage = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentSelection, setCurrentSelection] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [submissionError, setSubmissionError] = useState(false);
  
  const stepMessages = [
    "", 
    "Select your sign-up type", 
    "Complete your information"
  ];

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
    // Replace with your API call
    const isBusiness = currentSelection === "business";
    
    fetch('/api/waitlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        company: data.company || '',
        message: data.message || '',
        isBusiness
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
    <div className="landing-page">
      <TopNav>
        <a href="/partnerships" className="nav-link">Partnerships</a>
        <a href="/resources" className="nav-link">Resources</a>
        <a href="/about" className="nav-link">About Us</a>
        <a href="/contact" className="nav-link">Contact</a>
        <PrimaryButton asLink href="/login">Log in</PrimaryButton>
      </TopNav>

      <section className="waitlist-section">
        <div className="standard-content-wrapper">
          <div className="waitlist-header">
            <p className="h7">Waitlist</p>
            <h1 className="h1">We're here for <span className="h1b">you</span></h1>
          </div>

          <div className="waitlist-form-container">
            {!isSubmitted && (
              <p className="waitlist-step-indicator">
                {currentStep}/2 {stepMessages[currentStep]}
              </p>
            )}

            {isSubmitted && (
              <div className="waitlist-success">
                <img 
                  src="/Picture/message_delivered.svg" 
                  alt="Success" 
                  className="waitlist-success-image" 
                />
                <h2 className="h3">Done!</h2>
                <p className="text">We will get in touch with you soon.</p>
                <PrimaryButton asLink href="/">Back home</PrimaryButton>
              </div>
            )}

            {!isSubmitted && (
              <form 
                className="waitlist-form"
                onSubmit={handleSubmit(onSubmit)}
              >
                {currentStep === 1 && (
                  <div className="waitlist-options">
                    <ChoiceCard
                      icon={<img src="/Picture/icons/hand-leaf.svg" alt="Individual" />}
                      title="I'm an individual"
                      description="Join our waitlist for early access to end-of-life planning tools"
                      onClick={() => handleButtonClick("individual")}
                    />
                    <ChoiceCard
                      icon={<img src="/Picture/icons/handshake.svg" alt="Business" />}
                      title="I am a business"
                      description="Partner with us to reach more families and grow your business"
                      onClick={() => handleButtonClick("business")}
                    />
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="waitlist-selected-option">
                    <div className="waitlist-selection-card">
                      <img 
                        src={currentSelection === "business" 
                          ? "/Picture/icons/handshake.svg" 
                          : "/Picture/icons/hand-leaf.svg"} 
                        alt="Selection" 
                        className="waitlist-selection-icon"
                      />
                      <p className="h3">
                        {currentSelection === "business" 
                          ? "I am a business" 
                          : "I am an individual"}
                      </p>
                    </div>
                    
                    <SecondaryButton 
                      type="button"
                      onClick={() => {
                        setCurrentSelection(currentSelection === "business" ? "individual" : "business");
                      }}
                    >
                      Change: {currentSelection === "business" ? "I am an individual" : "I am a business"}
                    </SecondaryButton>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="waitlist-input-fields">
                    {currentSelection === "business" && (
                      <div className="form-field">
                        <label htmlFor="company" className="form-label">Business name</label>
                        <input
                          type="text"
                          id="company"
                          placeholder="Enter your company name"
                          className={`form-input ${errors.company ? 'form-input-error' : ''}`}
                          {...register("company", {
                            required: currentSelection === "business" ? "Company name is required" : false,
                          })}
                        />
                        {errors.company && (
                          <p className="form-error">{errors.company.message}</p>
                        )}
                      </div>
                    )}

                    <div className="form-field">
                      <label htmlFor="name" className="form-label">Contact name</label>
                      <input
                        type="text"
                        id="name"
                        placeholder="Enter your name"
                        className={`form-input ${errors.name ? 'form-input-error' : ''}`}
                        {...register("name", {
                          required: "Name is required",
                        })}
                      />
                      {errors.name && (
                        <p className="form-error">{errors.name.message}</p>
                      )}
                    </div>

                    <div className="form-field">
                      <label htmlFor="email" className="form-label">Email</label>
                      <input
                        type="email"
                        id="email"
                        placeholder="Enter your email"
                        className={`form-input ${errors.email ? 'form-input-error' : ''}`}
                        {...register("email", {
                          required: "Email is required",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Please enter a valid email",
                          },
                        })}
                      />
                      {errors.email && (
                        <p className="form-error">{errors.email.message}</p>
                      )}
                    </div>

                    <div className="form-field">
                      <label htmlFor="message" className="form-label">Message (Optional)</label>
                      <textarea
                        id="message"
                        rows="3"
                        placeholder="Message"
                        className="form-textarea"
                        {...register("message")}
                      ></textarea>
                    </div>

                    <PrimaryButton type="submit">Submit</PrimaryButton>
                  </div>
                )}
              </form>
            )}
          </div>

          <p className="waitlist-privacy-text">
            By joining the waitlist, you agree to receive communications from Farewell Finder regarding updates, exclusive offers, and early access to our platform. We respect your privacy and will not share your information with third parties without your consent. You can unsubscribe at any time.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default WaitlistPage;
