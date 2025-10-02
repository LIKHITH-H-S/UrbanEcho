import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001', // Fixed: Changed from 5000 to 5001 to match server port
});

// Fetch all problems
export const fetchProblems = async () => {
  const response = await axios.get('http://localhost:5001/problems');
  return response.data;
};


// Create a new problem (requires auth token)
export const createProblem = async (problemData) => {
  const token = localStorage.getItem('token');
  const response = await axios.post('http://localhost:5001/problems', problemData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
export const register = async (userData) => {
  try {
    const response = await axios.post('http://localhost:5001/api/auth/register', userData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response;
  } catch (error) {
    console.error('Register API Error:', error);
    // More detailed error handling
    if (error.response) {
      // Server responded with error status
      throw new Error(error.response.data.error || 'Registration failed');
    } else if (error.request) {
      // Network error
      throw new Error('Network error - please check if server is running');
    } else {
      // Other error
      throw new Error('Registration failed - please try again');
    }
  }
};

export const login = async (credentials) => {
  try {
    const response = await axios.post('http://localhost:5001/api/auth/login', credentials, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response;
  } catch (error) {
    console.error('Login API Error:', error);
    throw error;
  }
};

// Post a comment on a report
export const postCommentOnReport = async (reportId, commentData) => {
  const response = await api.post(`/reports/${reportId}/comments`, commentData);
  return response.data;
};

// Fetch single report by id
export const fetchReportById = async (reportId) => {
  const response = await api.get(`/reports/${reportId}`);
  return response.data;
};

export const upvoteProblem = async (problemId) => {
  const token = localStorage.getItem('token');
  const response = await axios.post(`http://localhost:5001/problems/${problemId}/upvote`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export default api;