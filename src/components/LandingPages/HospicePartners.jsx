import React from 'react';
import PrimaryButton from '../PrimaryButton';
import SecondaryButton from '../SecondaryButton';
import Footer from '../Footer';
import TopNav from '../TopNav';
import '../../styles/LandingPages/Partnerships.css';
import '../../styles/LandingPages/MainLanding.css';

const FEATURES = [
  {
    icon: '/Picture/icons/users.svg',
    title: 'Empower Patients & Families',
    description: 'Provide an easy-to-use platform for end-of-life planning.'
  },
  {
    icon: '/Picture/icons/streamline.svg',
    title: 'Simplify Planning',
    description: 'Streamline the process of documenting wishes, reducing family stress.'
  },
  {
    icon: '/Picture/icons/collaboration.svg',
    title: 'Enhance Collaboration',
    description: 'Enable families to plan together, promoting shared understanding.'
  },
  {
    icon: '/Picture/icons/heart.svg',
    title: 'Support Your Mission',
    description: 'Offer a digital tool that complements compassionate hospice care.'
  }
];

export default function HospicePartnersPage() {
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

      {/* Hero Section */}
      <section className="hero-section partnerships-hero">
        <div className="standard-header">
          <p className="h7">Hospice Partnerships</p>
          <h1 className="h1">
            <span className="h1b">Empower</span> &amp; <span className="h1b">Support</span> Together
          </h1>
          <p className="text">
            Partner with Farewell Finder to enhance end-of-life care through seamless digital planning.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section standard-content-wrapper">
        <div className="features-grid">
          {FEATURES.map(({ icon, title, description }) => (
            <div key={title} className="feature-card">
              <img src={icon} alt="" className="feature-icon" />
              <h3 className="feature-title">{title}</h3>
              <p className="feature-description">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="features-section partnerships-cta-bottom">
        <div className="standard-content-wrapper">
          <h2 className="h1">
            Ready to <span className="h1b">partner</span> with us?
          </h2>
          <p className="h7">
            Join Farewell Finder's hospice directory to provide families with compassionate, digital planning support.
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
