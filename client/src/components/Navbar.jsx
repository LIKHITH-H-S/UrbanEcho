import React from 'react';
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/auth');
  };

  return (
    token && (
      <nav className="navbar">
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
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </nav>
    )
  );
};

export default Navbar;
