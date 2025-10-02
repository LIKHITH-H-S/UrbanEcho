import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
import VolunteerReports from './pages/VolunteerReports';
import NGODashboard from './pages/NGODashboard';

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
        <Route path="/about" element={<About />} />

        {/* Protected routes */}
        <Route
          path="/home"
          element={isAuthenticated() ? <Home /> : <Navigate to="/login" />}
        />
        <Route
          path="/problems"
          element={isAuthenticated() && localStorage.getItem('userType') === 'volunteer' ? <ProblemList /> : <Navigate to="/home" />}
        />
        <Route
          path="/report"
          element={isAuthenticated() && localStorage.getItem('userType') === 'volunteer' ? <NewProblemForm /> : <Navigate to="/home" />}
        />
        <Route
          path="/new"
          element={isAuthenticated() && localStorage.getItem('userType') === 'volunteer' ? <ProblemForm /> : <Navigate to="/home" />}
        />
        <Route
          path="/volunteer-reports"
          element={isAuthenticated() && localStorage.getItem('userType') === 'ngo' ? <VolunteerReports /> : <Navigate to="/home" />}
        />
        <Route
          path="/ngo-dashboard"
          element={isAuthenticated() && localStorage.getItem('userType') === 'ngo' ? <NGODashboard /> : <Navigate to="/home" />}
        />
      </Routes>
    </>
  );
}

export default App;