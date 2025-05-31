import React, { useState } from 'react';
import { createProblem } from '../utils/api';


export default function NewProblemForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccessMsg('');

    if (!title.trim() || !description.trim()) {
      setError('Both title and description are required.');
      setSubmitting(false);
      return;
    }

    try {
      await createProblem({ title, description });
      setSuccessMsg('Problem reported successfully!');
      setTitle('');
      setDescription('');
    } catch (err) {
      setError('Failed to report the problem. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      style={{
        maxWidth: '600px',
        margin: '2rem auto',
        padding: '1.5rem',
        border: '1px solid #ddd',
        borderRadius: '10px',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}
    >
      <h2 style={{ marginBottom: '1rem' }}>Report a New Problem</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMsg && <p style={{ color: 'green' }}>{successMsg}</p>}

      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="title" style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 'bold' }}>Title</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          disabled={submitting}
          style={{
            width: '100%',
            padding: '0.5rem',
            fontSize: '1rem',
            borderRadius: '5px',
            border: '1px solid #ccc'
          }}
          placeholder="Enter problem title"
          required
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="description" style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 'bold' }}>Description</label>
        <textarea
          id="description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          disabled={submitting}
          rows={5}
          style={{
            width: '100%',
            padding: '0.5rem',
            fontSize: '1rem',
            borderRadius: '5px',
            border: '1px solid #ccc',
            resize: 'vertical'
          }}
          placeholder="Describe the problem in detail"
          required
        />
      </div>

      <button 
        type="submit" 
        disabled={submitting} 
        style={{
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          padding: '0.75rem 1.5rem',
          fontSize: '1rem',
          borderRadius: '5px',
          cursor: submitting ? 'not-allowed' : 'pointer'
        }}
      >
        {submitting ? 'Submitting...' : 'Report Problem'}
      </button>
    </form>
  );
}
