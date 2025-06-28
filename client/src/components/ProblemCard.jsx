// ======= ProblemCard.jsx =======
import React from 'react';
import { upvoteProblem } from '../utils/api';

const ProblemCard = ({ problem, onUpvoted }) => {
  const handleUpvote = async () => {
    try {
      await upvoteProblem(problem._id);
      onUpvoted(); // Refresh problem list
    } catch (err) {
      console.error('Upvote error:', err);
      alert(err.response?.data?.error || 'Error upvoting');
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
      <strong>Category:</strong> {problem.category}
    </div>
  );
};

export default ProblemCard;
