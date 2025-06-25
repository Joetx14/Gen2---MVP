import React from 'react';
import PrimaryButton from '../buttons/PrimaryButton';
import SecondaryButton from '../buttons/SecondaryButton';
import Footer from '../Footer';
import TopNav from '../TopNav';
import '../../styles/LandingPages/AboutUs.css';

const AboutUs = () => {
  return (
    <div className="landing-page">
      <TopNav>
        <a href="/partnerships" className="nav-link">Partnerships</a>
        <a href="/resources" className="nav-link">Resources</a>
        <a href="/about" className="nav-link">About Us</a>
        <a href="/contact" className="nav-link">Contact</a>
        <PrimaryButton asLink href="/login">Log in</PrimaryButton>
      </TopNav>

      {/* Hero Section */}
      <section className="about-hero-section">
        <div className="standard-content-wrapper">
          <div className="about-hero-content">
            <p className="h7">About us</p>
            <h1 className="h1">
              Farewell Finder was born from a vision to transform the way we say <span className="h1b">farewell</span>
            </h1>
            <div className="about-divider"></div>
            <div className="about-hero-image-container">
              <img 
                src="/Picture/womenembracing.svg" 
                alt="Women hugging with foliage around image" 
                className="about-hero-image" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* A Simple Personalized Space */}
      <section className="about-personalized-section">
        <div className="standard-content-wrapper">
          <h2 className="h1">
            A simple, <span className="h1b">personalized</span> space
          </h2>
          <div className="about-two-column">
            <div className="about-app-preview">
              <img 
                src="/Picture/ApplicationExample.svg" 
                alt="Graphic showing example UI for application"
                className="about-app-image"
              />
            </div>
            <div className="about-text-column">
              <p className="text">
                Our platform connects families with a comprehensive resource to
                guide them in all stages of end of life planning; we build a
                seamless bridge from traditional planning practices to modern
                consumer expectations.
              </p>
              <PrimaryButton asLink href="/waitlist">Join the waitlist</PrimaryButton>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="about-offerings-section">
        <div className="standard-content-wrapper">
          <h2 className="h1">
            What we <span className="h1b">offer</span>
          </h2>
          <div className="about-offerings-grid">
            <div className="about-offering-card">
              <img src="/Picture/icons/hand-rose.svg" alt="Hand holding rose" className="offering-icon" />
              <h3 className="h3">Personalized End-of-Life Planning</h3>
              <p className="text">Create custom farewell events that reflect the personality and wishes of your loved one</p>
            </div>
            <div className="about-offering-card">
              <img src="/Picture/icons/newspaper.svg" alt="Newspaper" className="offering-icon" />
              <h3 className="h3">Enhanced Digital Memorial Pages</h3>
              <p className="text">Share memories and messages, creating a rich tapestry of tribute</p>
            </div>
            <div className="about-offering-card">
              <img src="/Picture/icons/hand-click.svg" alt="Hand clicking button" className="offering-icon" />
              <h3 className="h3">Provider Directory</h3>
              <p className="text">Find the most suitable services to meet your unique needs</p>
            </div>
            <div className="about-offering-card">
              <img src="/Picture/icons/heart-hands.svg" alt="Hands holding hearts" className="offering-icon" />
              <h3 className="h3">Collaborative Tools</h3>
              <p className="text">Facilitate planning with family and friends, no matter where they are</p>
            </div>
            <div className="about-offering-card">
              <img src="/Picture/icons/vault.svg" alt="Vault" className="offering-icon" />
              <h3 className="h3">Document Vault</h3>
              <p className="text">Securely store and manage critical documents</p>
            </div>
            <div className="about-offering-card">
              <img src="/Picture/icons/envelope-heart.svg" alt="Envelope with heart" className="offering-icon" />
              <h3 className="h3">Last Wishes Documentation</h3>
              <p className="text">Clearly outline your final wishes, providing guidance and peace of mind for your loved ones</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="about-mission-section">
        <div className="standard-content-wrapper">
          <div className="about-mission-header">
            <p className="h7">Our mission is straightforward</p>
            <h2 className="h1">
              We know that planning a <span className="h1b">goodbye</span> for a loved one is a deeply personal and often overwhelming task.
            </h2>
          </div>
          <div className="about-mission-content">
            <div className="about-mission-text">
              <p className="text">
                That's why we've developed a comprehensive platform that not
                only eases the logistical burdens but also honors the uniqueness
                of each individual's life story.
              </p>
              <SecondaryButton asLink href="/contact">Contact us and learn more</SecondaryButton>
            </div>
            <div className="about-mission-image-container">
              <img 
                src="/Picture/women_in_hammock.webp" 
                alt="Woman sitting in hammock looking at tablet" 
                className="about-mission-image" 
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUs;
