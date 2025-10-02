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
      setError(err.response?.data?.error || 'Failed to report problem');
    }
  };

  return (
    <div className="report-container">
      <AnimatedBackground />
      <div className="report-content">
        <div className="report-header">
          <h1 className="report-title">Report Community Issues</h1>
          <p className="report-subtitle">Help make your community better by reporting problems that need attention</p>
        </div>

        <form onSubmit={handleSubmit} className="report-form">
          <div className="form-group">
            <label htmlFor="title">Problem Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Brief description of the issue"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Detailed Description</label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Provide detailed information about the problem"
              rows="4"
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
            >
              <option value="">Select a category</option>
              <option value="Waste">Waste Management</option>
              <option value="Roads">Roads & Infrastructure</option>
              <option value="Water">Water & Sanitation</option>
              <option value="Electricity">Electricity</option>
              <option value="Safety">Public Safety</option>
              <option value="Environment">Environment</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Street address, landmark, or area"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <button type="submit" className="submit-btn">
            Report This Issue
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportProblem;
