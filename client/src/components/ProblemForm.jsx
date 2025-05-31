import React, { useState } from 'react';
import { createProblem } from '../utils/api';

export default function ProblemForm({ onProblemCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const newProblem = await createProblem({ title, description });
      setTitle('');
      setDescription('');
      if (onProblemCreated) onProblemCreated(newProblem);
    } catch (err) {
      setError('Failed to submit problem');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{
      maxWidth: '600px',
      margin: '1rem auto',
      padding: '1rem',
      border: '1px solid #ddd',
      borderRadius: '8px',
      background: '#fefefe'
    }}>
      <h3>Report a Problem</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ marginBottom: '0.5rem' }}>
        <label>Title:</label><br />
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
          style={{ width: '100%', padding: '0.5rem' }}
        />
      </div>
      <div style={{ marginBottom: '0.5rem' }}>
        <label>Description:</label><br />
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
          rows={4}
          style={{ width: '100%', padding: '0.5rem' }}
        />
      </div>
      <button type="submit" disabled={submitting} style={{
        padding: '0.5rem 1rem',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '4px'
      }}>
        {submitting ? 'Submitting...' : 'Submit Problem'}
      </button>
    </form>
  );
}
