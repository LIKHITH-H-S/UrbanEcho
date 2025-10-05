import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Navbar.css';

const activeStyle = {
  color: '#10b981',
  fontWeight: '600',
  background: 'rgba(255, 255, 255, 0.05)',
  textShadow: '0 0 8px rgba(16, 185, 129, 0.5)',
};

const Navbar = () => {
  const token = localStorage.getItem('token');
  const userType = localStorage.getItem('userType');
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  console.log('🔍 Navbar Debug:', {
    token: token ? 'present' : 'missing',
    userType: userType,
    homeRoute: token ? '/home' : '/',
    shouldRender: !!token
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('username');
    localStorage.removeItem('registrationDate');
    localStorage.removeItem('problemsReported');
    localStorage.removeItem('problemsResolved');
    navigate('/');
  };

  // Determine home route based on authentication status
  const homeRoute = token ? '/home' : '/';

  return (
    token && (
      <nav className="navbar">
        <div className="navbar-container">
          <div className="logo-section">
            <a href={homeRoute} className="logo" aria-label="Home">
              <img src="/ue.jpg" alt="UrbanEcho Logo" />
            </a>
            <a href={homeRoute} className="brand-title" aria-label="Home">
              UrbanEcho
            </a>
          </div>
          <div className="nav-center">
            <NavLink to={homeRoute} className="nav-item" style={({ isActive }) => (isActive ? activeStyle : undefined)}>
              Home
            </NavLink>

            {/* Show navigation based on user type - NO MIXING */}
            {userType === 'volunteer' ? (
              <>
                <NavLink to="/vote" className="nav-item" style={({ isActive }) => (isActive ? activeStyle : undefined)}>
                  Vote
                </NavLink>
                <NavLink to="/report" className="nav-item" style={({ isActive }) => (isActive ? activeStyle : undefined)}>
                  Report a Problem
                </NavLink>
                <NavLink to="/rewards" className="nav-item" style={({ isActive }) => (isActive ? activeStyle : undefined)}>
                  Echo Rewards
                </NavLink>
              </>
            ) : userType === 'ngo' ? (
              <>
                <NavLink to="/problems" className="nav-item" style={({ isActive }) => (isActive ? activeStyle : undefined)}>
                  Problems List
                </NavLink>
                <NavLink to="/action" className="nav-item" style={({ isActive }) => (isActive ? activeStyle : undefined)}>
                  Action
                </NavLink>
              </>
            ) : null}

            <NavLink to="/about" className="nav-item" style={({ isActive }) => (isActive ? activeStyle : undefined)}>
              About
            </NavLink>
          </div>
          <div className="profile">
            <button
              className="avatar-btn"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(v => !v)}
              title="Account"
              aria-label="Account menu"
            >
              {/* Profile icon */}
              <svg className="avatar-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.3"/>
                <path d="M20 21c0-4.4-3.6-8-8-8s-8 3.6-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
              </svg>
            </button>
            {menuOpen && (
              <div className="profile-menu" role="menu" onMouseLeave={() => setMenuOpen(false)}>
                <button className="menu-item profile" role="menuitem" onClick={() => { setMenuOpen(false); navigate('/profile'); }}>My Profile</button>
                <button className="menu-item danger" role="menuitem" onClick={() => { setMenuOpen(false); handleLogout(); }}>Logout</button>
              </div>
            )}
          </div>
        </div>
      </nav>
    )
  );
};

export default Navbar;
