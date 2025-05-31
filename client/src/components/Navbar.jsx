import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Navbar() {
  const activeStyle = {
    fontWeight: 'bold',
    color: '#007bff',
    textDecoration: 'underline',
  };

  return (
    <nav 
      style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '2rem',
        padding: '1rem',
        backgroundColor: '#f8f9fa',
        borderBottom: '1px solid #ddd',
        fontFamily: 'Arial, sans-serif'
      }}
    >
      <NavLink 
        to="/problems" 
        style={({ isActive }) => (isActive ? activeStyle : { color: '#555', textDecoration: 'none' })}
      >
        Problem List
      </NavLink>

      <NavLink 
        to="/report" 
        style={({ isActive }) => (isActive ? activeStyle : { color: '#555', textDecoration: 'none' })}
      >
        Report a Problem
      </NavLink>
    </nav>
  );
}
