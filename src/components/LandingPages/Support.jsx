import React from 'react';
import StandardLayout from '../StandardLayout';
import FormBox from '../FormBox';
import PrimaryButton from '../buttons/PrimaryButton';

const Support = () => {
  const supportEmail = 'support@farewellfinder.com';
  
  const handleContactSupport = () => {
    window.location.href = `mailto:${supportEmail}`;
  };

  return (
    <StandardLayout
      title="Support"
      subtitle="We're here to help with your farewell planning journey"
    >
      <FormBox>
        <div className="form-section">
          <p className="form-description">
            If you have any questions or need assistance with your account or farewell planning, 
            our support team is ready to help you.
          </p>
          
          <div className="content-block">
            <h3>Contact us by email</h3>
            <p>
              Send us an email and we'll get back to you as soon as possible, 
              usually within 24 hours during business days.
            </p>
            <div className="button-container">
              <PrimaryButton onClick={handleContactSupport}>
                Email Support Team
              </PrimaryButton>
              <span className="helper-text">Opens your email client to send a message to {supportEmail}</span>
            </div>
          </div>
          
          <div className="content-block">
            <h3>Support Hours</h3>
            <p>Our team is available Monday through Friday, 9am to 5pm EST.</p>
          </div>
        </div>
      </FormBox>
    </StandardLayout>
  );
};

export default Support;
