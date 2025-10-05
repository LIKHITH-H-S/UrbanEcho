// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');
const app = express();
const authRoutes = require('./routes/authRoutes');
const problemRoutes = require('./routes/problemRoutes');
const rewardsRoutes = require('./routes/rewardsRoutes');

// Set default JWT_SECRET if not provided
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'your-super-secret-jwt-key-change-this-in-production';
  console.log('⚠️ Using default JWT_SECRET. Please set JWT_SECRET environment variable in production.');
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/rewards', rewardsRoutes);

// Database connection
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/urbanecho';
console.log('Connecting to MongoDB with URI:', mongoURI);

mongoose.connect(mongoURI)
.then(() => {
  console.log('MongoDB connected successfully');
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Server setup
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  process.exit(0);
});