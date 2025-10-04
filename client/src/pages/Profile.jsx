import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState({
    username: '',
    email: '',
    userType: '',
    joinDate: '',
    problemsReported: 0,
    problemsResolved: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Get user data from localStorage
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const userType = localStorage.getItem('userType');
    const registrationDate = localStorage.getItem('registrationDate');

    if (!token) {
      navigate('/login');
      return;
    }

    // Set user data
    setUser({
      username: username || 'User',
      email: username || 'User', // Just show username, not email format
      userType: userType || 'volunteer',
      joinDate: registrationDate ? new Date(registrationDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Not available',
      problemsReported: parseInt(localStorage.getItem('problemsReported') || '0'),
      problemsResolved: parseInt(localStorage.getItem('problemsResolved') || '0')
    });
  }, [navigate]);

  const handleBackToHome = () => {
    navigate('/home');
  };

  return (
    <div className="profile-page">
      <div className="profile-content">
        <div className="profile-header">
          <h1 className="profile-title">My Profile</h1>
          <p className="profile-subtitle">Manage your account and view your activity</p>
        </div>

        <div className="profile-container">
          <div className="profile-card">
            <div className="profile-avatar">
              <svg className="avatar-icon-large" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.3"/>
                <path d="M20 21c0-4.4-3.6-8-8-8s-8 3.6-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
              </svg>
            </div>

            <div className="profile-info">
              <h2 className="profile-name">{user.username}</h2>
              <p className="profile-role">{user.userType === 'volunteer' ? 'Community Volunteer' : 'NGO Organization'}</p>

              <div className="profile-details">
                <div className="detail-item">
                  <span className="detail-label">Username:</span>
                  <span className="detail-value">{user.email}</span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Member Since:</span>
                  <span className="detail-value">{user.joinDate}</span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">User Type:</span>
                  <span className="detail-value">{user.userType}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="stats-card">
            <h3>Activity Summary</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-number">{user.problemsReported}</div>
                <div className="stat-label">Problems Reported</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">{user.problemsResolved}</div>
                <div className="stat-label">Problems Resolved</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">{Math.round((user.problemsResolved / Math.max(user.problemsReported, 1)) * 100)}%</div>
                <div className="stat-label">Resolution Rate</div>
              </div>
            </div>
          </div>

          <div className="actions-card">
            <h3>Quick Actions</h3>
            <div className="action-buttons">
              <button className="action-btn primary" onClick={() => navigate('/report')}>
                Report New Issue
              </button>
              <button className="action-btn secondary" onClick={() => navigate('/problems?userOnly=true')}>
                View My Problems
              </button>
              <button className="action-btn outline" onClick={handleBackToHome}>
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
