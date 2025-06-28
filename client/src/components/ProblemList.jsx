import React, { useEffect, useState } from 'react';
import { fetchProblems } from '../utils/api';

const ProblemList = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProblems = () => {
    setLoading(true);
    fetchProblems()
      .then((data) => {
        console.log('Fetched problems:', data); 
        setProblems(data);
        setError(null);
      })
      .catch((err) => {
        console.error("Error fetching problems:", err);
        setError('Failed to load problems. Please check your connection or try again.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProblems();
  }, []);

  if (loading) return <p>Loading problems...</p>;

  if (error) {
    return (
      <div style={{ color: 'red', textAlign: 'center' }}>
        <p>{error}</p>
        <button
          onClick={loadProblems}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#007BFF',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '10px'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>Problem List</h2>
      {problems.length === 0 ? (
        <p>No problems reported yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {problems.map(({ _id, title, description, createdAt }) => (
            <li key={_id} className="card" style={{
              backgroundColor: '#f9f9f9',
              marginBottom: '1rem',
              padding: '1rem',
              borderRadius: '8px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
            }}>
              <h3>{title}</h3>
              <p>{description}</p>
              <small>Reported on: {new Date(createdAt).toLocaleDateString()}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProblemList;
