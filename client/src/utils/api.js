import axios from 'axios';

// Create an axios instance with your backend base URL
const api = axios.create({
  baseURL: 'http://localhost:5000',  // Adjust this if your backend runs on a different URL
});

// Function to fetch all problems
export const fetchProblems = async () => {
  const response = await api.get('/problems'); // adjust endpoint as needed
  return response.data;
};

// Function to create a new problem
export const createProblem = async (problemData) => {
  const response = await api.post('/problems', problemData); // adjust endpoint as needed
  return response.data;
};
