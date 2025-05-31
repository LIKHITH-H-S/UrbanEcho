// In App.jsx or your main router file
import React from 'react';
import { Routes, Route } from 'react-router-dom'; 

import ReportDetails from './pages/ReportDetails';
import ProblemList from './components/ProblemList';
import NewProblemForm from './components/NewProblemForm';
import ProblemForm from './components/ProblemForm';
import { useParams } from 'react-router-dom';

import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
function App() {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
         <Route path="/problems" element={<ProblemList />} />
  <Route path="/report" element={<NewProblemForm />} />
      </Routes>
  );
}


export default App;