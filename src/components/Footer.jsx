import React, { useState } from 'react';
import '../styles/Footer.css';
import '../styles/typography.css';
import '../styles/variables.css';
import { FaInstagram, FaLinkedin, FaFacebook, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    console.log('Subscribing:', email);
    setSuccess(true);
    setEmail('');
  };

  return (
    <footer className="site-footer">
      <div className="footer__container">
        {/* ROW 1: Newsletter Section */}
        <section className="footer__newsletter">
          <div className="footer__newsletter-inner">
            {/* Left column: Title and subtitle */}
            <div className="newsletter-text">
              <h3 className="newsletter-title">Stay connected</h3>
              <p className="newsletter-subtitle">
                Subscribe to our newsletter to receive more information
              </p>
            </div>

            {/* Right column: Form */}
            <div className="newsletter-form-container">
              <form
                className="newsletter-form"
                onSubmit={handleSubmit}
              >
                <input
                  type="email"
                  className="newsletter-input"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" className="subscribe-btn">
                  <span className="subscribe-btn-text">Subscribe</span>
                  {/* The arrow will be added via CSS for mobile */}
                </button>
              </form>
              {error && <div className="error-message">{error}</div>}
              {success && (
                <div className="success-message-inline">
                  Thank you for subscribing!
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ROW 2: Brand + Navigation */}
        <div className="footer-content">
          <div className="footer-brand">
            <h1 className="footer-logo-text">Farewell Finder</h1>
            <p className="footer-tagline footer-caption">
              Your online destination for final stage life planning
            </p>
            <div className="social-links">
              {/* "Follow us" text will be added via CSS ::before for mobile */}
              <a
                href="https://instagram.com"
                className="social-icon"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
              <a
                href="https://facebook.com"
                className="social-icon"
                aria-label="Facebook"
              >
                <FaFacebook />
              </a>
              <a
                href="mailto:info@farewellfinder.com"
                className="social-icon"
                aria-label="Email"
              >
                <FaEnvelope />
              </a>
            </div>
          </div>

          <div className="footer-nav">
            <div className="footer-nav-column">
              <h4 className="footer-nav-title footer-section-title">Company</h4>
              <ul className="footer-nav-list">
                <li>
                  <a href="/about" className="footer-link">About us</a>
                </li>
                <li>
                  <a href="/partnerships" className="footer-link">Partnerships</a>
                </li>
                <li>
                  <a href="/resources" className="footer-link">Resources</a>
                </li>
              </ul>
            </div>
            <div className="footer-nav-column">
              <h4 className="footer-nav-title footer-section-title">Legal</h4>
              <ul className="footer-nav-list">
                <li>
                  <a href="/terms" className="footer-link">Terms</a>
                </li>
                <li>
                  <a href="/privacy" className="footer-link">Privacy</a>
                </li>
                <li>
                  <a href="/cookies" className="footer-link">Cookies</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* ROW 3: Copyright */}
        <div className="footer-bottom">
          <p className="copyright footer-caption">
            © 2025 Farewell Finder
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
