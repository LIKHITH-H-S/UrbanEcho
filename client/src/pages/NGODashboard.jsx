// src/pages/NGODashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css'; // Reuse existing home styles

const NGODashboard = () => {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalProblems: 0,
    resolvedProblems: 0,
    activeVolunteers: 0,
    totalUpvotes: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');

    if (!token) {
      navigate('/auth');
      return;
    }

    if (userType !== 'ngo') {
      navigate('/home');
      return;
    }

    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      // Fetch problems
      const problemsResponse = await fetch('http://localhost:5000/api/problems', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!problemsResponse.ok) {
        throw new Error('Failed to fetch problems');
      }

      const problemsData = await problemsResponse.json();

      // Filter for volunteer problems
      const volunteerProblems = problemsData.filter(problem =>
        problem.reporter?.userType === 'volunteer'
      );

      setProblems(volunteerProblems);

      // Calculate stats
      const resolvedCount = volunteerProblems.filter(p =>
        p.status === 'Resolved' || p.status === 'Solved'
      ).length;

      const totalUpvotes = volunteerProblems.reduce((sum, p) => sum + (p.upvotes || 0), 0);

      setStats({
        totalProblems: volunteerProblems.length,
        resolvedProblems: resolvedCount,
        activeVolunteers: new Set(volunteerProblems.map(p => p.reporter?.username).filter(Boolean)).size,
        totalUpvotes,
      });

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="home-wrapper">
        <div className="loading">Loading NGO dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-wrapper">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="home-wrapper">
      <div className="animated-bg"></div>
      <div className="home-overlay">
        {/* Welcome Section */}
        <section className="welcome-section">
          <h1 className="animated-text">NGO Dashboard</h1>
          <p className="subtitle">Managing Community Impact</p>
        </section>

        {/* Stats Cards */}
        <section className="quick-stats">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-info">
                <span className="stat-number">{stats.totalProblems}</span>
                <span className="stat-label">Total Reports</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-info">
                <span className="stat-number">{stats.resolvedProblems}</span>
                <span className="stat-label">Resolved</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-info">
                <span className="stat-number">{stats.activeVolunteers}</span>
                <span className="stat-label">Active Volunteers</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">👍</div>
              <div className="stat-info">
                <span className="stat-number">{stats.totalUpvotes}</span>
                <span className="stat-label">Total Upvotes</span>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Volunteer Activity */}
        <section className="recent-problems">
          <h2>🆕 Recent Volunteer Reports</h2>
          <div className="problems-preview">
            {problems.length === 0 ? (
              <p>No recent volunteer reports available.</p>
            ) : (
              problems.slice(0, 5).map((problem) => (
                <div key={problem._id} className="problem-preview-item">
                  <div className="problem-info">
                    <h4>{problem.title}</h4>
                    <p>{problem.location}</p>
                    <span className="problem-meta">
                      By: {problem.reporter?.username || 'Anonymous'} •
                      👍 {problem.upvotes || 0} •
                      {new Date(problem.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <button
                    className="view-btn-small"
                    onClick={() => navigate(`/reports/${problem._id}`)}
                  >
                    View
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button
              className="action-btn primary"
              onClick={() => navigate('/volunteer-reports')}
            >
              View All Reports
            </button>
            <button
              className="action-btn secondary"
              onClick={() => navigate('/about')}
            >
              Learn More
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default NGODashboard;
