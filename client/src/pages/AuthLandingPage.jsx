import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthLandingPage.css';

const AuthLandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="auth-container">
      <div className="auth-left">
        <div className="logo">UrbanEcho</div>
        <h2>Login to Your Account</h2>
        <p>Access city issues, submit reports, and stay updated</p>
        <div className="auth-form">
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <button onClick={() => navigate('/login')}>Login</button>
        </div>
      </div>

      <div className="auth-right">
        <h2>New Here?</h2>
        <p>Register to report problems and improve your city experience</p>
        <button className="signup-button" onClick={() => navigate('/register')}>
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default AuthLandingPage;
