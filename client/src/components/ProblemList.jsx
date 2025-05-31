import React, { useEffect, useState } from 'react';
import { createProblem } from '../utils/api';
import { fetchProblems } from '../utils/api';
import ProblemCard from './ProblemCard';

export default function ProblemList() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadProblems() {
      try {
        const data = await fetchProblems();
        setProblems(data);
      } catch (err) {
        setError('Failed to load problems');
      } finally {
        setLoading(false);
      }
    }
    loadProblems();
  }, []);

  if (loading) return <p>Loading problems...</p>;
  if (error) return <p style={{color: 'red'}}>{error}</p>;

 return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', fontFamily: 'Arial, sans-serif' }}>
      <h2>Problem List</h2>
      {problems.length === 0 && <p>No problems reported yet.</p>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {problems.map(({ _id, title, description, createdAt }) => (
          <li 
            key={_id} 
            style={{
              backgroundColor: '#f9f9f9',
              marginBottom: '1rem',
              padding: '1rem',
              borderRadius: '8px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
            }}
          >
            <h3 style={{ margin: '0 0 0.5rem 0' }}>{title}</h3>
            <p>{description}</p>
            <small style={{ color: '#666' }}>
              Reported on: {new Date(createdAt).toLocaleDateString()}
            </small>
          </li>
        ))}
      </ul>
    </div>
  );
}