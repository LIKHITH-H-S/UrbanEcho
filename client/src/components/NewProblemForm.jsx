import React, { useState } from 'react';
import axios from 'axios';


const NewProblemForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Waste');
  const [location, setLocation] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to report a problem.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/problems', {
        title,
        description,
        category,
        location
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      alert('Problem submitted successfully!');
      setTitle('');
      setDescription('');
      setCategory('Waste');
      setLocation('');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Error submitting problem.');
    }
  };

  return (
  <div className="container">
    <div className="card">
      <h2>Report a Problem</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title</label>
        <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />

        <label htmlFor="description">Description</label>
        <textarea id="description" rows="4" value={description} onChange={(e) => setDescription(e.target.value)} />

        <label htmlFor="category">Category</label>
        <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} required>
          <option value="">Select Category</option>
          <option value="Sanitation">Sanitation</option>
          <option value="Water Supply">Water Supply</option>
          <option value="Roads">Roads</option>
          <option value="Electricity">Electricity</option>
        </select>

        <label htmlFor="location">Location</label>
        <input id="location" type="text" value={location} onChange={(e) => setLocation(e.target.value)} required />

        <button type="submit">Submit</button>
      </form>
    </div>
  </div>
);

};

export default NewProblemForm;
