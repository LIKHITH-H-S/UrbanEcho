import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Navbar.css';

const activeStyle = {
  color: '#00c4cc',
  fontWeight: 'bold',
  textDecoration: 'underline',
};

const Navbar = () => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/auth');
  };

  return (
    token && (
      <nav className="navbar">
        <div className="navbar-container">
          <a href="/" className="logo" aria-label="Home">
            <img src="/ue.jpg" alt="UrbanEcho" />
          </a>
          <div className="nav-center">
            <NavLink to="/" className="nav-item" style={({ isActive }) => (isActive ? activeStyle : undefined)}>
              Home
            </NavLink>
            <NavLink to="/problems" className="nav-item" style={({ isActive }) => (isActive ? activeStyle : undefined)}>
              Problem List
            </NavLink>
            <NavLink to="/report" className="nav-item" style={({ isActive }) => (isActive ? activeStyle : undefined)}>
              Report a Problem
            </NavLink>
            <NavLink to="/about" className="nav-item" style={({ isActive }) => (isActive ? activeStyle : undefined)}>
              About
            </NavLink>
          </div>
          <div className="profile" onMouseLeave={() => setMenuOpen(false)}>
            <button
              className="avatar-btn"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(v => !v)}
              title="Account"
              aria-label="Account menu"
            >
              {/* User-in-circle icon */}
              <svg className="avatar-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                <circle cx="12" cy="9" r="3" fill="currentColor" />
                <path d="M6 18c1.6-2.4 4-3.5 6-3.5s4.4 1.1 6 3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            {menuOpen && (
              <div className="profile-menu" role="menu">
                <button className="menu-item" role="menuitem" onClick={() => { setMenuOpen(false); navigate('/profile'); }}>My Profile</button>
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
