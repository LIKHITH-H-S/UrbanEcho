import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000', // Assuming your backend API base path
});

// Fetch all problems
export const fetchProblems = async () => {
  const response = await axios.get('http://localhost:5000/problems');
  return response.data;
};


// Create a new problem (requires auth token)
export const createProblem = async (problemData) => {
  const token = localStorage.getItem('token');
  const response = await axios.post('http://localhost:5000/problems', problemData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const register = async (userData) => {
  const response = await api.post('/api/auth/register', userData);
  return response.data;
};

export const login = async (credentials) => {
  const response = await api.post('/api/auth/login', credentials);
  return response.data;
};
// Fetch single report by id
export const fetchReportById = async (reportId) => {
  const response = await api.get(`/reports/${reportId}`);
  return response.data;
};

export const upvoteProblem = async (problemId) => {
  const token = localStorage.getItem('token');
  const response = await axios.post(`http://localhost:5000/problems/${problemId}/upvote`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Post a comment on a report
export const postCommentOnReport = async (reportId, commentData) => {
  const response = await api.post(`/reports/${reportId}/comments`, commentData);
  return response.data;
};

export default api;