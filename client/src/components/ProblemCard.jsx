import React from 'react';

const ProblemCard = ({ problem }) => {
  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
      <h3>{problem.title}</h3>
      <p>{problem.description}</p>
      <strong>Category:</strong> {problem.category}
    </div>
  );
};

export default ProblemCard;