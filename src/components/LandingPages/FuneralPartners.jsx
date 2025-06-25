import React from 'react';
import PrimaryButton from '../PrimaryButton';
import SecondaryButton from '../SecondaryButton';
import Footer from '../Footer';
import TopNav from '../TopNav';
import '../../styles/LandingPages/MainLanding.css';

const FEATURES = [
  {
    icon: '/Picture/icons/handshake.svg', 
    title:'Connect with families', 
    description: "Dedicated to assisting families in finding the most suitable services for their individual needs."
  },
  {
    icon: '/Picture/icons/mountains.svg',
    title: 'Grow Your Business',
    description: "Our platform supports funeral homes with enhanced marketing, customer engagement, and business growth."
  },
  {
    icon: '/Picture/icons/lightbulb.svg',
    title: 'Elevate Your Services',
    description: "Align your service with consumer preferences, increase visibility, cater to modern needs, and succeed."
  },
];

export default function MainLanding() {
  return (
    <div className="landing-page">
      {/* Top Navigation - UPDATE LOGIN LINK */}
      <TopNav>
        <a href="/partnerships" className="nav-link">Partnerships</a>
        <a href="/resources" className="nav-link">Resources</a>
        <a href="/about" className="nav-link">About Us</a>
        <a href="/contact" className="nav-link">Contact</a>
        <PrimaryButton asLink href="/login">Log in</PrimaryButton> {/* Changed from /invite to /login */}
      </TopNav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <img src="/LargeFamilyConsult.svg" alt="FuneralHomesConsult" className="hero-bg" />
          
          <div className="form-box">
            <div className="standard-header">
              <p className="h7">Partnerships</p>
              <h1 className="h1">
                <span className="h1b">Connect</span> with families in need. 
              </h1>
              <p className="text">
                Whether you're planning ahead or supporting a loved one, Farewell Finder helps you navigate end-of-life wishes with clarity and ease.
              </p>
            </div>
            <div className="button-row">
              <PrimaryButton asLink href="/login">Log in</PrimaryButton> {/* Changed from /invite to /login */}
              <SecondaryButton asLink href="/invite">I have an access code</SecondaryButton> {/* Kept as /invite */}
            </div>
            <p className="text-sm">
              You haven't registered yet?{' '}
              <a href="/waitlist" className="privacy-link">Join the waitlist</a>
            </p>
          </div>
        </div>
      </section>

      {/* Features Section - KEEP START MY PLAN BUTTON POINTING TO INVITE */}
      <section className="features-section standard-content-wrapper">
        <h2 className="h1">
          The <span className="h1b">Farewell</span> experience
        </h2>
        <p className="h7">Plan with clarity—so your wishes are honored and your loved ones aren't left guessing.</p>
        
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
          <PrimaryButton asLink href="/invite">Start my plan</PrimaryButton> {/* Keep as /invite */}
          <SecondaryButton asLink href="/about">Learn more about us</SecondaryButton>
        </div>
      </section>
          {/* Row 3: Stay Competitive */}
      <section className="features-section partnerships-competitive-section">
        <div className="standard-content-wrapper partnerships-two-column">
          {/* Left Column: Image */}
          <div className="partnerships-image-container">
            <img
              src="/Picture/FamilyConsult.svg"
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
            Join Farewell Finder’s directory to connect with families and grow your business.
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
}
