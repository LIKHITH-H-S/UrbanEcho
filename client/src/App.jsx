import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Home from './pages/Home';
import ReportDetails from './pages/ReportDetails';
// import ProblemList from './components/ProblemList';
import NewProblemForm from './components/NewProblemForm';
import ProblemForm from './components/ProblemForm';
import Navbar from './components/Navbar';
import AuthPage from './pages/AuthPage';
import ProblemList from './pages/ProblemList';
import About from './pages/About';

import './App.css';

function App() {
  const isAuthenticated = () => !!localStorage.getItem('token');
  const location = useLocation();

  const hideNavbarPaths = ['/auth', '/login', '/register'];
  const hideNavbar = hideNavbarPaths.includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route
          path="/"
          element={isAuthenticated() ? <Home /> : <Navigate to="/auth" />}
        />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/problems"
          element={isAuthenticated() ? <ProblemList /> : <Navigate to="/auth" />}
        />
        <Route
          path="/report"
          element={isAuthenticated() ? <NewProblemForm /> : <Navigate to="/auth" />}
        />
        <Route
          path="/new"
          element={isAuthenticated() ? <ProblemForm /> : <Navigate to="/auth" />}
        />
        <Route
          path="/reports/:reportId"
          element={isAuthenticated() ? <ReportDetails /> : <Navigate to="/auth" />}
        />
        <Route
          path="/about"
          element={isAuthenticated() ? <About /> : <Navigate to="/auth" />}
        />
      </Routes>
    </>
  );
}

export default App;
