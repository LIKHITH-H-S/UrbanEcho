// In LandingPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <nav className="main-nav">
        <div className="logo-container">
          <img src="/ue.jpg" alt="UrbanEcho" className="logo" />
          <h1>UrbanEcho</h1>
        </div>
        <div className="auth-actions">
          <Link to="/login" className="login-btn">Login</Link>
          <Link to="/register" className="register-btn">Sign Up</Link>
        </div>
      </nav>

      <div className="hero">
        <div className="hero-content">
          <h1>Your Voice Shapes Your City</h1>
          <p className="tagline">Report, track, and resolve local issues in real-time</p>
          
          <div className="cta-buttons">
            <Link to="/register" className="cta-primary">Get Started</Link>
            <Link to="/about" className="cta-secondary">Learn More</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;