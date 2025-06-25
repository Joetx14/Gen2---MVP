import React from 'react';
import PrimaryButton from '../buttons/PrimaryButton';
import SecondaryButton from '../buttons/SecondaryButton';
import Footer from '../Footer';
import TopNav from '../TopNav';
import '../../styles/LandingPages/MainLanding.css';

const FEATURES = [
  {
    icon: '/Picture/LP-Note-Write.svg',
    title: 'Peace of Mind',
    description: "Know your wishes are clear — and your loved ones won't be left guessing."
  },
  {
    icon: '/Picture/LP-Heart.svg',
    title: 'Guided Simplicity',
    description: 'Plan with ease — guided every step, not just handed a checklist.'
  },
  {
    icon: '/Picture/LP-Rose.svg',
    title: 'Personal Legacy',
    description: "Celebrate your life with a farewell that honors what mattered most to you."
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
        <PrimaryButton asLink href="/login" className="nav-login-btn">Log in</PrimaryButton> {/* Changed from /invite to /login */}
      </TopNav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <img src="/Picture/HERO-Landing.svg" alt="Couple watching sunset landscape" className="hero-bg" />
          
          <div className="form-box">
            <div className="standard-header">
              <p className="h7">Welcome to Farewell Finder</p>              <h1 className="h1">
                <span className="h1b">Personalized</span> end-of-life planning made <span className="h1b">simple</span>
              </h1>
              <p className="hero-tagline">
               Farewells are more than paperwork — we help shape and share your goodbye, your way.
              </p>
            </div>
            <div className="button-row">
              <PrimaryButton asLink href="/login" className="nav-login-btn">Log in</PrimaryButton> {/* Use same style as TopNav */}
              <SecondaryButton asLink href="/invite">Have an invite code?</SecondaryButton> {/* Kept as /invite */}
            </div>            <p className="hero-tagline">
              You haven't registered yet?{' '}
              <a href="/waitlist" className="waitlist-link">Join the waitlist</a>
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

      <Footer />
    </div>
  );
}
