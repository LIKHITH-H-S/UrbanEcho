// src/pages/VolunteerReports.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProblemList.css'; // Reuse existing styles

const VolunteerReports = () => {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

    fetchProblems();
  }, [navigate]);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/problems', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch problems');
      }

      const data = await response.json();

      // Filter to show only problems reported by volunteers and sort by upvotes
      const volunteerProblems = data
        .filter(problem => problem.reporter?.userType === 'volunteer')
        .sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));

      setProblems(volunteerProblems);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async (problemId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/problems/${problemId}/upvote`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to upvote');
      }

      const result = await response.json();

      // Refresh problems to show updated upvote count
      fetchProblems();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="problem-list-container">
        <div className="loading">Loading volunteer reports...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="problem-list-container">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="problem-list-container">
      <div className="problem-list-header">
        <h1>Volunteer Reports</h1>
        <p>Problems reported by volunteers in your community</p>
      </div>

      <div className="problems-grid">
        {problems.length === 0 ? (
          <div className="no-problems">
            <p>No volunteer reports available yet.</p>
          </div>
        ) : (
          problems.map((problem) => (
            <div key={problem._id} className="problem-card">
              <div className="problem-header">
                <h3 className="problem-title">{problem.title}</h3>
                <div className="problem-status">
                  <span className={`status-badge ${problem.status?.toLowerCase()}`}>
                    {problem.status || 'Pending'}
                  </span>
                </div>
              </div>

              <div className="problem-details">
                <p className="problem-description">{problem.description}</p>

                <div className="problem-meta">
                  <span className="location">📍 {problem.location}</span>
                  <span className="reported-by">
                    Reported by: {problem.reporter?.username || 'Anonymous'}
                  </span>
                  <span className="date">
                    {new Date(problem.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="problem-actions">
                  <button
                    className="upvote-btn"
                    onClick={() => handleUpvote(problem._id)}
                    title="Upvote this problem"
                  >
                    👍 {problem.upvotes || 0}
                  </button>

                  <button
                    className="view-btn"
                    onClick={() => navigate(`/reports/${problem._id}`)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default VolunteerReports;
