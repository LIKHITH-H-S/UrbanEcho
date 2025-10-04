import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchProblems, upvoteProblem } from '../utils/api';
import AnimatedBackground from '../components/AnimatedBackground';
import './ProblemList.css';

const ProblemList = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userVotes, setUserVotes] = useState(new Set()); // Track which problems user has voted on
  const location = useLocation();
  const navigate = useNavigate();

  // Check if we should show only user's problems
  const urlParams = new URLSearchParams(location.search);
  const userOnly = urlParams.get('userOnly') === 'true';

  // Initialize user votes when component mounts or problems change
  useEffect(() => {
    const initializeUserVotes = () => {
      const currentUserId = localStorage.getItem('userId');
      console.log('🔍 Initializing user votes for userId:', currentUserId);
      if (currentUserId && problems.length > 0) {
        const votes = new Set();
        problems.forEach(problem => {
          if (problem.upvotes && problem.upvotes.includes(currentUserId)) {
            votes.add(problem._id);
          }
        });
        console.log('📋 User votes initialized:', Array.from(votes));
        setUserVotes(votes);
      }
    };

    initializeUserVotes();
  }, [problems]); // Add problems to dependency array

const loadProblems = async () => {
    setError('');
    setLoading(true);
    try {
      console.log('🚀 Loading problems from API...');
      const currentUserId = localStorage.getItem('userId');

      let problemsData;
      if (userOnly && currentUserId) {
        // Fetch only current user's problems
        problemsData = await fetchProblems(currentUserId);
        console.log('✅ User-specific problems loaded:', problemsData?.length || 0);
      } else {
        // Fetch all problems
        problemsData = await fetchProblems();
        console.log('✅ All problems loaded:', problemsData?.length || 0);
      }

      let filtered = problemsData ? [...problemsData] : [];

      // Sort problems by highest votes first
      const sorted = filtered.sort((a, b) => (b.votesCount || 0) - (a.votesCount || 0));
      setProblems(sorted);

      console.log('📊 Problems loaded:', sorted.length);
      console.log('🔐 Current userId in localStorage:', currentUserId);
    } catch (err) {
      console.error('❌ Failed to fetch problems:', err);
      setError('Failed to fetch problems. Please try again later.');
      setProblems([]); // Ensure problems is empty on error
    } finally {
      setLoading(false);
    }
  };
   const handleUpvote = async (id) => {
    console.log('🔥 UPVOTE BUTTON CLICKED for problem ID:', id);
    console.log('Current vote state for this problem:', userVotes.has(id));
    console.log('Current userId in localStorage:', localStorage.getItem('userId'));
    console.log('Current token in localStorage:', localStorage.getItem('token'));

    // Check if user is logged in
    const token = localStorage.getItem('token');
    const currentUserId = localStorage.getItem('userId');

    if (!token) {
      console.log('❌ No token found - user not logged in');
      alert('You must be logged in to vote!');
      return;
    }

    if (!currentUserId) {
      console.log('❌ No userId found - user ID not stored');
      alert('User ID not found. Please log in again.');
      return;
    }

    try {
      console.log('🚀 Making API call to upvote problem:', id);
      const result = await upvoteProblem(id);
      console.log('✅ Upvote API call successful:', result);

      // Update local vote state
      setUserVotes(prev => {
        const newVotes = new Set(prev);
        if (newVotes.has(id)) {
          newVotes.delete(id); // Remove vote if already voted
          console.log('🗑️ Vote removed locally');
        } else {
          newVotes.add(id); // Add vote if not voted
          console.log('➕ Vote added locally');
        }
        return newVotes;
      });

      // Update the specific problem's vote count locally for immediate feedback
      setProblems(prev => prev.map(problem => {
        if (problem._id === id) {
          const hasVoted = userVotes.has(id);
          const newCount = hasVoted ?
            Math.max(0, (problem.votesCount || 0) - 1) : // Decrease if removing vote
            (problem.votesCount || 0) + 1; // Increase if adding vote
          console.log('📊 Vote count updated:', problem.votesCount, '→', newCount);
          return {
            ...problem,
            votesCount: newCount
          };
        }
        return problem;
      }));

    } catch (err) {
      console.error('❌ Upvote failed:', err.response?.data?.error || err.message);
      console.error('❌ Full error object:', err);
      alert(err.response?.data?.error || 'Vote failed. Please try again.');
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
          <h1 className="problemlist-title">
            {userOnly ? 'My Reported Problems' : 'Community Problem Reports'}
          </h1>
          <p className="problemlist-subtitle">
            {userOnly
              ? 'View and manage problems you\'ve reported to the community'
              : 'Help us prioritize issues by voting on the problems that matter most to you'
            }
          </p>
        </div>

        {problems.length === 0 ? (
          <div className="no-problems">
            <p>
              {userOnly
                ? "You haven't reported any problems yet. Start making a difference in your community!"
                : "No problems reported yet. Be the first to report an issue in your community!"
              }
            </p>
          </div>
        ) : (
          <div className="problems-grid">
            {problems.map(({ _id, title, description, category, location, createdAt, votesCount, image, reporter }) => (
              <div key={_id} className="problem-card">
                {image && (
                  <div className="problem-image">
                    <img src={image} alt={title} />
                  </div>
                )}
                <div className="problem-header">
                  <h3 className="problem-title">{title}</h3>
                  <div className="problem-location">📍 {location}</div>
                </div>

                <p className="problem-description">{description}</p>

                <div className="problem-footer">
                  {reporter && (
                    <div className="problem-reporter">Reported by: {reporter.username}</div>
                  )}
                  <div className="problem-footer-right">
                    <span className={`problem-status status-${category?.toLowerCase() || 'pending'}`}>
                      {category || 'Pending'}
                    </span>
                    <div className="problem-votes">
                      <button
                        className={`upvote-btn ${userVotes.has(_id) ? 'voted' : 'not-voted'}`}
                        onClick={() => handleUpvote(_id)}
                        title={userVotes.has(_id) ? "Remove your vote" : "Upvote this problem"}
                      >
                        {userVotes.has(_id) ? '👎' : '👍'} {votesCount || 0}
                      </button>
                    </div>
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
