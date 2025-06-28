import React, { useEffect, useState } from 'react';
import { fetchProblems, upvoteProblem } from '../utils/api';
import AnimatedBackground from '../components/AnimatedBackground';

const ProblemList = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

const loadProblems = async () => {
    try {
      const res = await fetchProblems();
      // Sort problems by highest votes first
      const sorted = [...res].sort((a, b) => (b.votesCount || 0) - (a.votesCount || 0));
      setProblems(sorted);
    } catch (err) {
      console.error('Failed to fetch problems:', err);
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
      alert(err.response?.data?.error || 'Upvote failed');
    }
  };

  useEffect(() => {
    loadProblems();
  }, []);


  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

 return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      <AnimatedBackground />
      <div style={{ padding: '2rem' }}>
        <h2>Problem List</h2>
        {problems.length === 0 ? (
          <p>No problems reported yet.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {problems.map(({ _id, title, description, category, location, createdAt, votesCount }) => (
              <li
                key={_id}
                style={{
                  marginBottom: '1.5rem',
                  padding: '1rem',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  position: 'relative',
                  backgroundColor: '#fff',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                }}
              >
                {/* Upvote Button */}
                <button
  onClick={() => handleUpvote(_id)}
  style={{
    position: 'absolute',
    top: '10px',
    right: '10px',
    backgroundColor: '#f0f0f0',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '18px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.2)'
  }}
  title="Upvote"
>
  👍
</button>


                <h3 style={{ marginTop: 0 }}>{title}</h3>
                <p>{description}</p>
                <p><strong>Category:</strong> {category}</p>
                <p><strong>Location:</strong> {location}</p>
                <p><strong>Votes:</strong> {votesCount || 0}</p>
                <small>Reported on: {new Date(createdAt).toLocaleString()}</small>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ProblemList;
