import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Home from './pages/Home';
import NewProblemForm from './components/NewProblemForm';
import ProblemForm from './components/ProblemForm';
import Navbar from './components/Navbar';
import AuthPage from './pages/AuthPage';
import ProblemList from './pages/ProblemList';
import About from './pages/About';
import LandingPage from './pages/LandingPage';
import Profile from './pages/Profile';
import Rewards from './pages/Rewards';
import Action from './pages/Action';

function App() {
  const isAuthenticated = () => !!localStorage.getItem('token');

  // const hideNavbarPaths = ['/auth', '/login', '/register', '/']; // Not currently used but keeping for future use
  return (
    <>
      {/* Render navbar for authenticated users */}
      {isAuthenticated() && <Navbar />}
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/about" element={<About />} />

        {/* Protected routes - Available for both user types */}
        <Route
          path="/home"
          element={isAuthenticated() ? <Home /> : <Navigate to="/login" />}
        />

        {/* Problem-related routes */}
        <Route
          path="/problems"
          element={isAuthenticated() ? <ProblemList /> : <Navigate to="/login" />}
        />
        <Route
          path="/vote"
          element={isAuthenticated() ? <ProblemList /> : <Navigate to="/login" />}
        />

        {/* Volunteer-specific routes */}
        <Route
          path="/report"
          element={isAuthenticated() ? <NewProblemForm /> : <Navigate to="/login" />}
        />
        <Route
          path="/new"
          element={isAuthenticated() ? <ProblemForm /> : <Navigate to="/login" />}
        />
        <Route
          path="/rewards"
          element={isAuthenticated() ? <Rewards /> : <Navigate to="/login" />}
        />

        {/* NGO-specific routes */}
        <Route
          path="/action"
          element={isAuthenticated() ? <Action /> : <Navigate to="/login" />}
        />

        <Route
          path="/profile"
          element={isAuthenticated() ? <Profile /> : <Navigate to="/login" />}
        />
      </Routes>
    </>
  );
}

export default App;