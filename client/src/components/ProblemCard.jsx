// ======= ProblemCard.jsx =======
import React from 'react';
import { upvoteProblem } from '../utils/api';

const ProblemCard = ({ problem, onUpvoted }) => {
  const handleUpvote = async () => {
    try {
      console.log('🔥 UPVOTE BUTTON CLICKED');
      console.log('Attempting to upvote problem:', problem._id);
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      console.log('Token present:', !!token);
      console.log('UserId present:', !!userId);
      console.log('Token value:', token ? token.substring(0, 20) + '...' : 'none');

      if (!token) {
        alert('Please login to upvote');
        return;
      }

      if (!userId) {
        alert('User ID not found. Please login again.');
        return;
      }

      console.log('🚀 Making upvote API call...');
      await upvoteProblem(problem._id);
      console.log('✅ Upvote successful - refreshing list');
      onUpvoted(); // Refresh problem list
    } catch (err) {
      console.error('❌ Upvote error:', err);
      console.error('❌ Error response:', err.response?.data);
      console.error('❌ Error status:', err.response?.status);
      console.error('❌ Full error object:', err);

      // More specific error messages
      if (err.response?.status === 401) {
        alert('Authentication failed. Please login again.');
      } else if (err.response?.status === 404) {
        alert('Problem not found.');
      } else if (err.response?.status === 500) {
        alert('Server error. Please try again later.');
      } else {
        alert(err.response?.data?.error || 'Error updating vote');
      }
    }
  };

  return (
    <div style={{ 
      border: '1px solid #ccc', 
      padding: '10px', 
      marginBottom: '10px',
      position: 'relative',
      borderRadius: '8px'
    }}>
      {/* Upvote button top-right */}
      <button 
        onClick={handleUpvote} 
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
          fontSize: '18px'
        }}
        title="Upvote"
      >
        👍 {problem.votesCount || 0}
      </button>

      <h3>{problem.title}</h3>
      <p>{problem.description}</p>
      <strong>Category:</strong> {problem.category}<br/>
      <strong>Location:</strong> {problem.location || 'No location specified'}
    </div>
  );
};

export default ProblemCard;
