import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { register } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import './AuthPage.css';

const RegisterPage = () => {
  const [userType, setUserType] = useState('volunteer'); // 'volunteer' or 'ngo'
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await register({
        username: formData.username,
        password: formData.password,
        userType: userType
      });

      // Store registration date and initial activity data
      const registrationDate = new Date().toISOString();
      localStorage.setItem('registrationDate', registrationDate);
      localStorage.setItem('problemsReported', '0');
      localStorage.setItem('problemsResolved', '0');

      navigate('/login'); // Redirect to login after registration
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h2>Create Account</h2>
            <p>Join UrbanEcho and start making a difference</p>
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
                placeholder="Choose a username"
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
                placeholder="Create a password"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="auth-button">
              Create {userType === 'volunteer' ? 'Volunteer' : 'NGO'} Account
            </button>
          </form>

          <div className="auth-footer">
            <p>Already have an account? <Link to="/login">Sign in</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
