// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const problemRoutes = require('./routes/problemRoutes');
const app = express();
app.use(cors());
app.use(express.json());
const morgan = require('morgan');
app.use(morgan('dev'));

const Report = require('./models/Report'); //
// Sample route
app.get('/', (req, res) => {
  res.send('UrbanEcho API Running');
});
app.use('/problems', problemRoutes);
// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/UrbanEcho', { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('MongoDB Connected'))
.catch((err) => console.error('Mongo Error:', err));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});





const reportRoutes = require('./routes/reportRoutes');
app.use('/api/reports', reportRoutes);


process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1); // Optional: exit gracefully
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1); // Optional: exit gracefully
});
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  process.exit(0);
});
