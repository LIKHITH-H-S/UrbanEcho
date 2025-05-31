import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ReportDetails = ({ reportId }) => {
  const [report, setReport] = useState(null);
  const [user, setUser] = useState('');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch report data
  useEffect(() => {
    axios.get(`http://localhost:5000/api/reports/${reportId}`)
      .then(res => setReport(res.data))
      .catch(err => console.error(err));
  }, [reportId]);

  // Handle new comment submission
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`http://localhost:5000/api/reports/${reportId}/comments`, { user, text });
      setReport(prev => ({
        ...prev,
        comments: [...prev.comments, res.data.comment]
      }));
      setUser('');
      setText('');
    } catch (err) {
      console.error('Failed to post comment:', err);
    }
    setLoading(false);
  };

  if (!report) return <p>Loading...</p>;

  return (
    <div className="report-details">
      <h2>{report.title}</h2>
      <p>{report.description}</p>

      <h3>Comments</h3>
      <ul>
        {(report.comments || []).map((comment, idx) => (
          <li key={idx}><strong>{comment.user}:</strong> {comment.text}</li>
        ))}
      </ul>

      <form onSubmit={handleCommentSubmit}>
        <input
          type="text"
          placeholder="Your name"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Your comment"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>Post Comment</button>
      </form>
    </div>
  );
};

export default ReportDetails;
