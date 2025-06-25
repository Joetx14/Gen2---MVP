// src/components/TopNav.jsx

import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import '../styles/TopNav.css';


const TopNav = () => {
  const { isAuthenticated, isLoading, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const accountButtonRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Debug auth state changes
  useEffect(() => {
    console.log("TopNav: Auth state:", { 
      isAuthenticated, 
      isLoading, 
      currentUser: user ? 'User exists' : 'No user',
      pathname: location.pathname 
    });
  }, [isAuthenticated, isLoading, user, location.pathname]);

  // Toggle mobile menu
  const toggleMenu = () => {
    const newMenuState = !isMenuOpen;
    setIsMenuOpen(newMenuState);
    
    // If mobile menu is opening, make sure account panel is closed
    if (newMenuState) {
      setAccountMenuOpen(false);
      // Add body class to prevent scrolling while menu is open
      document.body.classList.add('menu-open');
    } else {
      // Remove body class when menu is closed
      document.body.classList.remove('menu-open');
    }
  };

  // Toggle account dropdown
  const toggleAccount = () => {
    setAccountMenuOpen(prev => !prev);
    // If the account panel is opening, close the mobile menu (so they don't overlap)
    if (!accountMenuOpen) setIsMenuOpen(false);
  };

  // If you click outside either menu, close whichever is open
  const handleClickOutside = e => {
    // 1) mobile menu
    if (
      isMenuOpen &&
      menuRef.current &&
      !menuRef.current.contains(e.target) &&
      !e.target.closest('.nav-toggle')
    ) {
      setIsMenuOpen(false);
    }
    // 2) account dropdown
    if (
      accountMenuOpen &&
      accountButtonRef.current &&
      !accountButtonRef.current.contains(e.target) &&
      !e.target.closest('.menu-drop-panel')
    ) {
      setAccountMenuOpen(false);
    }
  };

  useEffect(() => {
    if (isMenuOpen || accountMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen, accountMenuOpen]);

  // Handle logout
  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Derive “FirstName’s Farewell Wishes”
  let headerLabel = '';
  if (user) {
    // If displayName exists, take the first word; otherwise, take the email local-part
    const rawName =      user.displayName?.trim() ||
      user.email?.split('@')[0] ||
      '';
    const firstName = rawName.split(' ')[0];
    headerLabel = `${firstName}’s Farewell Wishes`;
  }

  // Helper to highlight active link
  const isActive = path => location.pathname.startsWith(path);

  return (
    <nav className="top-nav">
      <div className={`nav-container ${isMenuOpen ? 'menu-open' : ''}`}>
        {/* Logo */}
        <Link to="/" className="nav-logo">
          <h1 className="logo-text">Farewell Finder</h1>
        </Link>

        {/* Hamburger toggle (visible on mobile) */}
        <button
          className="nav-toggle"
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
          onClick={toggleMenu}
        >
          <span className="hamburger-icon" />
        </button>        {/* MAIN NAV: both desktop and mobile dropdown */}        <div ref={menuRef} className={`navbar ${isMenuOpen ? 'is-active' : ''}`}>          {/* Pre-login links shown in the top nav bar */}
          {!isLoading && !isAuthenticated && (
            <>
              <Link
                to="/partnerships"
                className="nav-link"
                data-active={isActive('/partnerships')}
              >
                Partnerships
              </Link>
              <Link
                to="/resources"
                className="nav-link"
                data-active={isActive('/resources')}
              >
                Resources
              </Link>
              <Link
                to="/about"
                className="nav-link"
                data-active={isActive('/about')}
              >
                About Us
              </Link>
              <Link
                to="/contact"
                className="nav-link"
                data-active={isActive('/contact')}
              >
                Contact
              </Link>
            </>
          )}          {/* Post-login links ONLY shown in mobile menu */}
          {!isLoading && isAuthenticated && isMenuOpen && (
            <>
              <Link
                to="/confirm-wishes"
                className="nav-link nav-link--auth"
                data-active={isActive('/confirm-wishes')}
                onClick={() => setIsMenuOpen(false)}
              >
                Farewell Plan
              </Link>
              <Link
                to="/shared-wishes"
                className="nav-link nav-link--auth"
                data-active={isActive('/shared-wishes')}
                onClick={() => setIsMenuOpen(false)}
              >
                Shared Wishes
              </Link>
              <Link
                to="/change-password"
                className="nav-link nav-link--auth"
                onClick={() => setIsMenuOpen(false)}
              >
                Change Password
              </Link>
              <Link
                to="/farewell-settings"
                className="nav-link nav-link--auth"
                onClick={() => setIsMenuOpen(false)}
              >
                Farewell Settings
              </Link>
              <Link
                to="/resources"
                className="nav-link nav-link--auth"
                onClick={() => setIsMenuOpen(false)}
              >
                Resources
              </Link>
              <Link
                to="/support"
                className="nav-link nav-link--auth"
                onClick={() => setIsMenuOpen(false)}
              >
                Support
              </Link>
            </>
          )}

          <div className="nav-spacer" />          {/* Login/Logout remains the same */}
          <div className="login-wrapper">
            {isLoading ? (
              <span className="loading-text">Loading…</span>
            ) : isAuthenticated ? (
              <div className="account-wrapper">
                {/* Restore "My Account" button that triggers dropdown */}
                <button
                  ref={accountButtonRef}
                  className="auth-button"
                  onClick={toggleAccount}
                  aria-label={accountMenuOpen ? 'Close account menu' : 'Open account menu'}
                  aria-expanded={accountMenuOpen}
                >
                  My Account
                </button>
                
                {/* Restore dropdown menu with navigation options */}
                {accountMenuOpen && (
                  <div className="menu-drop" role="menu">
                    <div className="menu-drop-panel is-active">                      {/* User name header if available */}
                      {user?.displayName && (
                        <div className="menu-drop-header">
                          <span className="menu-user-name">{user.displayName}'s Farewell Wishes</span>
                        </div>
                      )}
                      
                      {/* Main navigation links */}
                      <Link to="/confirm-wishes" className="menu-drop-item" onClick={() => setAccountMenuOpen(false)}>
                        Farewell Plan
                      </Link>
                      <Link to="/shared-wishes" className="menu-drop-item" onClick={() => setAccountMenuOpen(false)}>
                        Shared Wishes
                      </Link>
                      <Link to="/change-password" className="menu-drop-item" onClick={() => setAccountMenuOpen(false)}>
                        Change Password
                      </Link>
                      <Link to="/farewell-settings" className="menu-drop-item" onClick={() => setAccountMenuOpen(false)}>
                        Farewell Settings
                      </Link>
                      
                      <div className="menu-drop-divider" />
                      
                      {/* Secondary links */}
                      <Link to="/resources" className="menu-drop-item" onClick={() => setAccountMenuOpen(false)}>
                        Resources
                      </Link>
                      <Link to="/support" className="menu-drop-item" onClick={() => setAccountMenuOpen(false)}>
                        Support
                      </Link>
                      
                      <div className="menu-drop-divider" />
                      
                      {/* Decorative leaf */}
                      <div className="menu-drop-decoration">
                        <img src="/Picture/dropwdown-leaf.svg" alt="" />
                      </div>
                      
                      {/* Log Out button (red) */}
                      <div className="menu-drop-footer">
                        <button 
                          className="auth-button logout-button"
                          onClick={handleLogout}
                          aria-label="Log out of your account"
                        >
                          Log Out
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="auth-button login-button">
                Log in
              </Link>
            )}
          </div>
        </div>

        {/* Add a clickable overlay behind the mobile menu */}
        {isMenuOpen && (
          <div 
            className="nav-overlay" 
            onClick={() => setIsMenuOpen(false)}
            aria-hidden="true"
          />
        )}
      </div>
    </nav>
  );
};

export default TopNav;

