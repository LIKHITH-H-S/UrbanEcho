import React, { useEffect, useState } from 'react';
import { fetchProblems, upvoteProblem } from '../utils/api';
import AnimatedBackground from '../components/AnimatedBackground';
import './ProblemList.css';

const ProblemList = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

const loadProblems = async () => {
    setError('');
    try {
      const res = await fetchProblems();
      // Sort problems by highest votes first
      const sorted = [...res].sort((a, b) => (b.votesCount || 0) - (a.votesCount || 0));
      setProblems(sorted);
    } catch (err) {
      console.error('Failed to fetch problems:', err);
      setError('Failed to fetch problems. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
   const handleUpvote = async (id) => {
    try {
      await upvoteProblem(id);
      loadProblems(); // Refresh the list after upvote
    } catch (err) {
      console.error('Upvote failed:', err.response?.data?.error || err.message);
      setError(err.response?.data?.error || 'Upvote failed');
      alert(err.response?.data?.error || 'Upvote failed');
    }
  };

  useEffect(() => {
    loadProblems();
  }, []);

  if (loading) return (
    <div className="problemlist-container">
      <div className="loading-message">Loading problems...</div>
    </div>
  );

  if (error) return (
    <div className="problemlist-container">
      <div className="error-message">{error}</div>
    </div>
  );

  return (
    <div className="problemlist-container">
      <AnimatedBackground />
      <div className="problemlist-content">
        <div className="problemlist-header">
          <h1 className="problemlist-title">Community Problem Reports</h1>
          <p className="problemlist-subtitle">Help us prioritize issues by voting on the problems that matter most to you</p>
        </div>

        {problems.length === 0 ? (
          <div className="no-problems">
            <p>No problems reported yet. Be the first to report an issue in your community!</p>
          </div>
        ) : (
          <div className="problems-grid">
            {problems.map(({ _id, title, description, category, location, createdAt, votesCount }) => (
              <div key={_id} className="problem-card">
                <div className="problem-header">
                  <h3 className="problem-title">{title}</h3>
                  <div className="problem-location">📍 {location}</div>
                </div>

                <p className="problem-description">{description}</p>

                <div className="problem-footer">
                  <span className={`problem-status status-${category?.toLowerCase() || 'pending'}`}>
                    {category || 'Pending'}
                  </span>
                  <div className="problem-votes">
                    <button
                      className="upvote-btn"
                      onClick={() => handleUpvote(_id)}
                      title="Upvote this problem"
                    >
                      👍 {votesCount || 0}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemList;
