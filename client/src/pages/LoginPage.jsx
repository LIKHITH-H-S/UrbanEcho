// In src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './AuthPage.css';
import './LoginPage.css'; // Add this import for toggle styles
import { login } from '../utils/api';

const LoginPage = () => {
  const [userType, setUserType] = useState('volunteer'); // 'volunteer' or 'ngo'
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await login({
        username: formData.username,
        password: formData.password,
        userType: userType
      });

      const data = response?.data;
      if (!data?.token) {
        setError('Login failed: no token received.');
        return;
      }

      // Save the token and user info to localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('userType', data.userType || userType);
      localStorage.setItem('username', data.username || formData.username);
      if (data.userId) {
        localStorage.setItem('userId', typeof data.userId === 'string' ? data.userId : String(data.userId));
      }

      // Full page redirect so the app reads auth from localStorage reliably
      if (userType === 'ngo') {
        window.location.href = '/problems';
      } else {
        window.location.href = '/home';
      }
    } catch (err) {
      console.error('Login error:', err);
      const message = err.response?.data?.error || err.response?.data?.message || err.message || 'Login failed. Please check your credentials.';
      setError(message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h2>Welcome Back</h2>
            <p>Sign in to continue to UrbanEcho</p>
          </div>

          <div className="user-type-toggle">
            <div className="toggle-container">
              <button
                type="button"
                className={`toggle-btn ${userType === 'volunteer' ? 'active' : ''}`}
                onClick={() => setUserType('volunteer')}
              >
                Volunteer
              </button>
              <button
                type="button"
                className={`toggle-btn ${userType === 'ngo' ? 'active' : ''}`}
                onClick={() => setUserType('ngo')}
              >
                NGO
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </div>

            {error && <div className="error-message" role="alert">{error}</div>}

            <button type="submit" className="auth-button">
              Sign In as {userType === 'volunteer' ? 'Volunteer' : 'NGO'}
            </button>
          </form>

          <div className="auth-footer">
            <p>Don't have an account? <Link to="/register">Sign up</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;