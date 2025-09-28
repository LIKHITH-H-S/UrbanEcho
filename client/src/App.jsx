import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Home from './pages/Home';
import ReportDetails from './pages/ReportDetails';
import NewProblemForm from './components/NewProblemForm';
import ProblemForm from './components/ProblemForm';
import Navbar from './components/Navbar';
import AuthPage from './pages/AuthPage';
import ProblemList from './pages/ProblemList';
import About from './pages/About';
import LandingPage from './pages/LandingPage';  // Add this import
import './App.css';

function App() {
  const isAuthenticated = () => !!localStorage.getItem('token');
  const location = useLocation();

  const hideNavbarPaths = ['/auth', '/login', '/register', '/'];
  const hideNavbar = hideNavbarPaths.includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected routes */}
        <Route
          path="/home"
          element={isAuthenticated() ? <Home /> : <Navigate to="/login" />}
        />
        <Route
          path="/problems"
          element={isAuthenticated() ? <ProblemList /> : <Navigate to="/login" />}
        />
        <Route
          path="/report"
          element={isAuthenticated() ? <NewProblemForm /> : <Navigate to="/login" />}
        />
        <Route
          path="/new"
          element={isAuthenticated() ? <ProblemForm /> : <Navigate to="/login" />}
        />
        <Route
          path="/reports/:reportId"
          element={isAuthenticated() ? <ReportDetails /> : <Navigate to="/login" />}
        />
        <Route
          path="/about"
          element={isAuthenticated() ? <About /> : <Navigate to="/login" />}
        />

        {/* Redirect old home route to new landing page */}
        <Route path="/dashboard" element={<Navigate to="/home" />} />
      </Routes>
    </>
  );
}

export default App;