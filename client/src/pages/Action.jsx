import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom'; // Not used in this component
import './Action.css';

const Action = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, pending, verified, done

  useEffect(() => {
    loadProblems();
  }, []);

  const loadProblems = async () => {
    setLoading(true);
    setError('');
    try {
      console.log('🚀 Loading problems for NGO actions...');
      const token = localStorage.getItem('token');

      if (!token) {
        setError('Authentication required');
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:5001/api/problems', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Problems loaded for NGO:', data.length);
      setProblems(data);
    } catch (err) {
      console.error('❌ Failed to load problems:', err);
      setError('Failed to load problems. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyProblem = async (problemId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/problems/${problemId}/verify`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedProblem = await response.json();
      console.log('✅ Problem verified:', updatedProblem);

      // Update local state
      setProblems(prev => prev.map(problem =>
        problem._id === problemId ? updatedProblem : problem
      ));

      alert('Problem verified and sent to government!');
    } catch (err) {
      console.error('❌ Failed to verify problem:', err);
      alert('Failed to verify problem. Please try again.');
    }
  };

  const handleSubmitToGovernment = async (problemId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/problems/${problemId}/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedProblem = await response.json();
      console.log('✅ Problem submitted to government:', updatedProblem);

      // Update local state
      setProblems(prev => prev.map(problem =>
        problem._id === problemId ? updatedProblem : problem
      ));

      alert('Problem submitted to government successfully!');
    } catch (err) {
      console.error('❌ Failed to submit to government:', err);
      alert('Failed to submit to government. Please try again.');
    }
  };

  const getStatusBadge = (problem) => {
    switch(problem.status) {
      case 'verified':
        return <span className="status-badge verified">✅ Verified</span>;
      case 'done':
        return <span className="status-badge done">🏆 Done</span>;
      case 'pending':
      default:
        return <span className="status-badge pending">⏳ Pending</span>;
    }
  };

  const filteredProblems = problems.filter(problem => {
    if (filter === 'all') return true;
    return problem.status === filter;
  });

  if (loading) return (
    <div className="action-page">
      <div className="action-container">
        <div className="loading-message">Loading NGO actions...</div>
      </div>
    </div>
  );

  if (error) return (
    <div className="action-page">
      <div className="action-container">
        <div className="error-message">{error}</div>
      </div>
    </div>
  );

  return (
    <div className="action-page">
      <div className="action-container">
        <div className="action-header">
          <h1 className="action-title">NGO Action Center</h1>
          <p className="action-subtitle">Manage community problems and coordinate with government</p>
        </div>

        <div className="action-content">
          <div className="action-filters">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All Problems ({problems.length})
            </button>
            <button
              className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
              onClick={() => setFilter('pending')}
            >
              Pending ({problems.filter(p => p.status === 'pending').length})
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

          <div className="problems-section">
            {filteredProblems.length === 0 ? (
              <div className="no-problems">
                <p>No problems found in this category.</p>
              </div>
            ) : (
              <div className="problems-grid">
                {filteredProblems.map((problem) => (
                  <div key={problem._id} className="problem-card">
                    {problem.image && (
                      <div className="problem-image">
                        <img src={`http://localhost:5001${problem.image}`} alt={problem.title} />
                      </div>
                    )}

                    <div className="problem-content">
                      <div className="problem-header">
                        <h3 className="problem-title">{problem.title}</h3>
                        <div className="problem-location">📍 {problem.location}</div>
                      </div>

                      <p className="problem-description">{problem.description}</p>

                      <div className="problem-footer">
                        <div className="problem-meta">
                          <span className="reporter">Reported by: {problem.reporter?.username || 'Unknown'}</span>
                          <span className="date">Date: {new Date(problem.createdAt).toLocaleDateString()}</span>
                        </div>

                        <div className="problem-status-section">
                          {getStatusBadge(problem)}

                          <div className="action-buttons">
                            {problem.status === 'pending' && (
                              <button
                                className="verify-btn"
                                onClick={() => handleVerifyProblem(problem._id)}
                              >
                                ✅ Verify & Send to Govt
                              </button>
                            )}

                            {problem.status === 'verified' && (
                              <button
                                className="submit-btn"
                                onClick={() => handleSubmitToGovernment(problem._id)}
                              >
                                📤 Submit to Government
                              </button>
                            )}

                            {problem.status === 'done' && (
                              <span className="completed-text">✅ Completed by Government</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Action;
