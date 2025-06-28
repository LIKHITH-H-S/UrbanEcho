import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchReportById, postCommentOnReport } from '../utils/api';

const ReportDetails = () => {
  const { reportId } = useParams();
  const [report, setReport] = useState(null);
  const [user, setUser] = useState('');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [postingComment, setPostingComment] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchReportById(reportId)
      .then((data) => setReport(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [reportId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user.trim() || !text.trim()) return;

    setPostingComment(true);
    try {
      const res = await postCommentOnReport(reportId, { user, text });
      setReport((prev) => ({
        ...prev,
        comments: [...(prev.comments || []), res.comment],
      }));
      setUser('');
      setText('');
    } catch (err) {
      console.error('Failed to post comment:', err);
      alert('Failed to post comment. Try again.');
    }
    setPostingComment(false);
  };

  if (loading) return <p>Loading report...</p>;
  if (!report) return <p>Report not found.</p>;

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', fontFamily: 'Arial, sans-serif' }}>
      <h2>{report.title}</h2>
      <p>{report.description}</p>

      <h3>Comments</h3>
      <ul>
        {(report.comments || []).map((comment, idx) => (
          <li key={idx}>
            <strong>{comment.user}:</strong> {comment.text}
          </li>
        ))}
      </ul>

      <form onSubmit={handleCommentSubmit}>
        <input
          type="text"
          placeholder="Your name"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          required
          style={{ width: '100%', marginBottom: '0.5rem', padding: '0.5rem' }}
        />
        <textarea
          placeholder="Your comment"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
          rows={3}
          style={{ width: '100%', marginBottom: '0.5rem', padding: '0.5rem' }}
        />
        <button type="submit" disabled={postingComment} style={{ padding: '0.5rem 1rem' }}>
          {postingComment ? 'Posting...' : 'Post Comment'}
        </button>
      </form>
    </div>
  );
};

export default ReportDetails;
