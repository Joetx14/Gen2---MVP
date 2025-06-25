import React from 'react';
import PrimaryButton from '../buttons/PrimaryButton';
import SecondaryButton from '../buttons/SecondaryButton';
import ChoiceCard from '../ChoiceCard';
import Footer from '../Footer';
import TopNav from '../TopNav';
import '../../styles/LandingPages/Partnerships.css';
import '../../styles/LandingPages/MainLanding.css';

const FuneralPartnersPage = () => {
 const FEATURES = [
  {
    icon: '/Picture/icons/handshake.svg', 
    title: 'Attract more families', 
    description: "Connect with individuals actively planning end-of-life arrangements."
  },
  {
    icon: '/Picture/icons/mountains.svg',
    title: 'Grow Your Business',
    description: "Simplify outreach and information sharing with digital tools."
  },
  {
    icon: '/Picture/icons/lightbulb.svg',
    title: 'Built for tomorrow',
    description: "Align with todays consumer digital expectations."
  },
];

  return (
    <div className="landing-page">
      {/* Top Navigation */}
      <TopNav>
        <a href="/partnerships" className="nav-link">Partnerships</a>
        <a href="/resources" className="nav-link">Resources</a>
        <a href="/about" className="nav-link">About Us</a>
        <a href="/contact" className="nav-link">Contact</a>
        <PrimaryButton asLink href="/login">Log in</PrimaryButton>
      </TopNav>

      {/* Hero Section - Two Column Layout */}
      <section className="hero-section partnerships-hero">
        <div className="hero-two-column">
          {/* Left Column: Form Box with Text */}
          <div className="partnerships-hero-left">
            <div className="standard-header">
              <p className="h7">Partnerships</p>
              <h1 className="h1">
                <span className="h1b">Connect</span> with more families. 
              </h1>
              <p className="text">
                Today's families are online. Farewell Finder provides the simple, powerful tools digital you need to secure your future.
              </p>
            </div>
            <div className="button-row">
              <PrimaryButton asLink href="/contact">Contact Us</PrimaryButton>
              <SecondaryButton asLink href="/waitlist">Join the waitlist</SecondaryButton>
            </div>
          </div>
          
          {/* Right Column: Image */}
          <div className="partnerships-hero-right">
            <img 
              src="/Picture/family-leaf-vector.svg" 
              alt="FuneralHomesConsult" 
              className="partnerships-hero-image" 
            />
          </div>
        </div>
      </section>

      {/* Features Section with unique class */}
      <section className="features-section partnerships-difference-section">
        <div className="standard-content-wrapper">
          <h2 className="h1">
            The <span className="h1b">Farewell</span> difference
          </h2>
          <p className="h7">Bringing Your Service Online, Without the Hassle</p>
          
          <div className="features-grid">
            {FEATURES.map(({ icon, title, description }) => (
              <div key={title} className="feature-card">
                <img src={icon} alt="" className="feature-icon" />
                <h3 className="feature-title">{title}</h3>
                <p className="feature-description">{description}</p>
              </div>
            ))}
          </div>
          
          <div className="button-row">
            <PrimaryButton asLink href="/invite">Start my plan</PrimaryButton>
            <SecondaryButton asLink href="/about">Learn more about us</SecondaryButton>
          </div>
        </div>
      </section>
          
      {/* Row 3: Stay Competitive */}
      <section className="features-section partnerships-competitive-section">
        <div className="standard-content-wrapper partnerships-two-column">
          {/* Left Column: Image */}
          <div className="partnerships-image-container">
            <img
              src="/Picture/Squareleafconsult.svg"
              alt="Funeral director consulting with family"
              className="partnerships-image"
            />
          </div>
          {/* Right Column: Text */}
          <div className="partnerships-text-section">
            <h2 className="h1">
              Stay <span className="h1b">competitive</span>
            </h2>
            <p className="text">
              Partnering with Farewell Finder showcases dedication to innovation
              and meets evolving family needs.
            </p>
            <SecondaryButton asLink href="/waitlist">Join the waitlist</SecondaryButton>
          </div>
        </div>
      </section>

      {/* Row 4: Ready to Partner */}
      <section className="features-section partnerships-cta-bottom">
        <div className="standard-content-wrapper">
          <h2 className="h1">
            Ready to <span className="h1b">partner</span> with us?
          </h2>
          <p className="h7">
            Join Farewell Finder's directory to connect with families and grow your business.
          </p>
          <div className="button-row partnerships-cta-buttons">
            <PrimaryButton asLink href="/contact">Contact Us</PrimaryButton>
            <SecondaryButton asLink href="/waitlist">Join the waitlist</SecondaryButton>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FuneralPartnersPage;
