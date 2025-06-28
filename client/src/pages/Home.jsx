// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchProblems } from '../utils/api';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [solvedCount, setSolvedCount] = useState(0);

 useEffect(() => {
    fetchProblems()
      .then(data => {
        setProblems(data.slice(0, 3)); // for preview
        const solved = data.filter(problem => problem.status === 'Resolved' || problem.status === 'Solved');
        setSolvedCount(solved.length);
      })
      .catch(err => console.error("Error fetching problems:", err));
  }, []);

  return (
    <div className="home-wrapper">
      <div className="animated-bg"></div>
      <div className="home-overlay">
        {/* Welcome Section */}
        <section className="welcome-section">
          <h1 className="animated-text">Welcome to <span className="highlight">UrbanEcho</span></h1>
          <p className="subtitle">Connecting Communities for a Smarter City</p>
        </section>

        {/* Quick Stats */}
        <section className="quick-stats">
        <div className="stat">📌 Total Problems Reported: <strong>{problems.length}</strong></div>
        <div className="stat">✅ Problems Resolved: <strong>{solvedCount}</strong></div>
      </section>

        {/* Recent Problems Preview */}
       <section className="recent-problems">
        <h2>🆕 Recent Reports</h2>
        <ul>
          {problems.length === 0 ? (
            <li>No recent problems available.</li>
          ) : (
            problems.map((problem) => (
              <li key={problem._id}>📍 {problem.title} — {problem.location}</li>
            ))
          )}
        </ul>
      </section>

        {/* Report Button */}
        <div className="report-button-wrapper">
          <button onClick={() => navigate('/report')}>Report a Problem</button>
        </div>
      </div>
    </div>
  );
};

export default Home;
