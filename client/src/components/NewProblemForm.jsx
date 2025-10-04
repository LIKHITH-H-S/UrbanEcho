import React, { useState } from 'react';
import { createProblem } from '../utils/api';
import './NewProblemForm.css';


const NewProblemForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!category) {
      alert('Please select a category.');
      return;
    }

    try {
      await createProblem({
        title,
        description,
        category,
        location
      });

      alert('Problem submitted successfully!');

      // Increment problems reported counter
      const currentCount = parseInt(localStorage.getItem('problemsReported') || '0');
      localStorage.setItem('problemsReported', (currentCount + 1).toString());

      setTitle('');
      setDescription('');
      setCategory('');
      setLocation('');
    } catch (err) {
      console.error('Error submitting problem:', err);
      alert(err.response?.data?.error || err.message || 'Error submitting problem.');
    }
  };

  return (
    <div className="problemlist-container">
      <div className="problemlist-content">
        <div className="problemlist-header">
          <h1 className="problemlist-title">Report Community Issues</h1>
          <p className="problemlist-subtitle">Help make your community better by reporting problems that need attention</p>
        </div>

        <div className="report-form-wrapper">
          <form onSubmit={handleSubmit} className="problem-card report-form">
            <div className="form-group">
              <label htmlFor="title">Problem Title</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Brief description of the issue"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Detailed Description</label>
              <textarea
                id="description"
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide detailed information about the problem"
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
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
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Street address, landmark, or area"
                required
              />
            </div>

            <button type="submit" className="submit-btn">
              Report This Issue
            </button>
          </form>
        </div>
      </div>
    </div>
  );

};

export default NewProblemForm;
