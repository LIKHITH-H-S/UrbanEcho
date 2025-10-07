// In LandingPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <nav className="main-nav">
        <div className="logo-container">
          <h1>UrbanEcho</h1>
        </div>
        <div className="auth-actions">
          <Link to="/login" className="login-btn">Login</Link>
          <Link to="/register" className="register-btn">Sign Up</Link>
        </div>
      </nav>

      <div className="hero">
        <div className="hero-content">
          <h1>Building a Better Community Together</h1>
          <p className="tagline">UrbanEcho rewards civic engagement through gamification, digital rewards, and smart civic tools. Make your community better while earning civic coins.</p>

          <div className="cta-buttons">
            <Link to="/register" className="cta-primary">Get Started</Link>
            <Link to="/about" className="cta-secondary">Learn More</Link>
          </div>
        </div>
      </div>

      {/* Community Impact Section */}
      <section className="community-impact">
        <div className="container">
          <div className="impact-content">
            <div className="impact-text">
              <h2>Join the Civic Revolution</h2>
              <p>Every report, every upvote, every community action counts. UrbanEcho transforms civic participation into an engaging, rewarding experience that brings neighbors together to create positive change.</p>
              <div className="how-it-works">
                <div className="works-step">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h4>Report</h4>
                    <p>Identify and report local issues in your community with photos and descriptions</p>
                  </div>
                </div>
                <div className="works-step">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h4>Vote</h4>
                    <p>Upvote the most important issues to help prioritize community needs</p>
                  </div>
                </div>
                <div className="works-step">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <h4>Track</h4>
                    <p>Follow progress in real-time and get notified when issues are resolved</p>
                  </div>
                </div>
                <div className="works-step">
                  <div className="step-number">4</div>
                  <div className="step-content">
                    <h4>Earn</h4>
                    <p>Collect Civic Coins as rewards for your positive contributions to the community</p>
                  </div>
                </div>
                <div className="works-step">
                  <div className="step-number">5</div>
                  <div className="step-content">
                    <h4>Benefit</h4>
                    <p>Redeem coins for rewards or donate them to community causes</p>
                  </div>
                </div>
                <div className="works-step">
                  <div className="step-number">6</div>
                  <div className="step-content">
                    <h4>Share</h4>
                    <p>Share your success stories and inspire others to join the civic movement</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;