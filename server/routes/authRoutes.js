const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');
const Problem = require('../models/Problem');

// Register
router.post('/register', async (req, res) => {
  const { username, password, userType = 'volunteer', role } = req.body;

  // Support both 'userType' and 'role' fields for backward compatibility
  const finalUserType = userType || role || 'volunteer';

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create user (password will be hashed by the pre-save hook in User model)
    const user = new User({
      username,
      password, // Don't hash here - let the User model handle it
      userType: finalUserType
    });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({
      token,
      userId: user._id,
      userType: user.userType,
      username: user.username,
      message: 'Login successful'
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Get user statistics
router.get('/stats/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    console.log('Stats request for userId:', userId);

    // Validate userId format (should be a valid ObjectId)
    if (!userId || userId === 'test' || userId.length !== 24) {
      console.log('Invalid userId format:', userId);
      return res.json({
        problemsReported: 0,
        problemsResolved: 0
      });
    }

    // Get count of problems reported by this user
    const problemsReported = await Problem.countDocuments({ reporter: userId });
    console.log('Problems reported count:', problemsReported);

    // For now, problems resolved is 0 (you can implement this later if needed)
    const problemsResolved = 0;

    res.json({
      problemsReported,
      problemsResolved
    });
  } catch (err) {
    console.error('Error fetching user stats:', err);
    res.status(500).json({ error: 'Server error while fetching statistics' });
  }
});

module.exports = router;
