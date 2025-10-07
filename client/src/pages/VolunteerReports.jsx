// src/pages/VolunteerReports.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProblemList.css';

const VolunteerReports = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('pending'); // 'pending' or 'assigned'

  const navigate = useNavigate();

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
      const response = await fetch('http://localhost:5001/api/problems/all', {
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
      const response = await fetch(`http://localhost:5001/api/problems/${problemId}/upvote`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to upvote');
      }

      // Refresh problems to show updated vote count
      fetchProblems();
    } catch (err) {
      console.error('Error upvoting:', err);
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

        {/* Filter Buttons */}
        <div className="filter-buttons">
          <button
            className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending ({problems.filter(p => p.status === 'pending').length})
          </button>
          <button
            className={`filter-btn ${filter === 'assigned' ? 'active' : ''}`}
            onClick={() => setFilter('assigned')}
          >
            Assigned ({problems.filter(p => p.status === 'assigned').length})
          </button>
          <button
            className={`filter-btn ${filter === 'verified' ? 'active' : ''}`}
            onClick={() => setFilter('verified')}
          >
            Verified ({problems.filter(p => p.status === 'verified').length})
          </button>
          <button
            className={`filter-btn ${filter === 'done' ? 'active' : ''}`}
            onClick={() => setFilter('done')}
          >
            Done ({problems.filter(p => p.status === 'done').length})
          </button>
        </div>
      </div>

      <div className="problems-grid">
        {(() => {
          const filteredProblems = problems.filter(problem => problem.status === filter);

          if (filteredProblems.length === 0) {
            return (
              <div className="no-problems">
                <p>No {filter} problems found.</p>
              </div>
            );
          }

          return filteredProblems.map((problem) => (
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

                  {/* NGO Action Buttons */}
                  {localStorage.getItem('userType') === 'ngo' && (
                    <div className="ngo-actions">
                      {problem.status === 'pending' && (
                        <button
                          className="action-btn assign-btn"
                          onClick={() => handleAssignStaff(problem._id)}
                        >
                          Assign Staff
                        </button>
                      )}

                      {problem.status === 'assigned' && (
                        <span className="status-badge assigned">Assigned to Staff</span>
                      )}

                      {problem.status === 'verified' && (
                        <span className="status-badge verified">Verified</span>
                      )}

                      {problem.status === 'sent_to_government' && (
                        <span className="status-badge sent">Sent to Government</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        })()}
      </div>
    </div>
  );
};

export default VolunteerReports;
