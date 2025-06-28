import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProblem } from '../utils/api';
import AnimatedBackground from '../components/AnimatedBackground';
import './ReportProblem.css';

const ReportProblem = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    location: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await createProblem(form);
      setSuccess('Problem reported!');
      setTimeout(() => navigate('/problems'), 1000);
    } catch (err) {
      console.error("Submission Error:", err);
      setError(err.response?.data?.error || 'Failed to report problem');
    }
  };

  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      <AnimatedBackground />
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ position: 'relative', zIndex: 2 }}></div>
      <h2>Report a Problem</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} rows="4" />
        <select name="category" value={form.category} onChange={handleChange}>
  <option value="Waste">Waste</option>
  <option value="Roa<AnimatedBackground />d">Roads</option>
  <option value="Water">Water</option>
  <option value="Electricity">Electricity</option>
  <option value="Other">Other</option>
</select>
        <input type="text" name="location" placeholder="Location" value={form.location} onChange={handleChange} required />
        <button type="submit">Submit</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
    </div>

  );
};

export default ReportProblem;
