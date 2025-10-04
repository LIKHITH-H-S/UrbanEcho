const express = require('express');
const router = express.Router();
const Problem = require('../models/Problem');
const verifyToken = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Protect POST with verifyToken middleware
router.post('/', verifyToken, upload.single('image'), async (req, res) => {
  try {
    const { title, description, category, location } = req.body;

    if (!title || !category || !location) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    const problem = new Problem({
      reporter: req.user.userId,
      title,
      description,
      category,
      location,
      image: req.file ? `/uploads/${req.file.filename}` : null,
    });

    await problem.save();
    res.status(201).json(problem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;

    let query = {};
    if (userId) {
      query.reporter = userId;
    }

    const problems = await Problem.find(query)
      .sort({ createdAt: -1 })
      .populate('reporter', 'username userType');
      console.log('Fetched problems:', problems);
    res.json(problems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id/upvote', verifyToken, async (req, res) => {
  try {
    console.log('Upvote request for problem:', req.params.id);
    console.log('User ID from token:', req.user.userId);

    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      console.log('Problem not found:', req.params.id);
      return res.status(404).json({ error: 'Problem not found' });
    }

    const userId = req.user.userId;
    console.log('Checking if user already upvoted:', userId);

    // Check if user has already voted
    const hasVoted = problem.upvotes.includes(userId);
    console.log('User has voted:', hasVoted);

    if (hasVoted) {
      // Remove vote
      console.log('Removing vote for user:', userId);
      problem.upvotes = problem.upvotes.filter(id => id.toString() !== userId.toString());
      problem.votesCount = Math.max(0, problem.votesCount - 1);
      await problem.save();
      console.log('Vote removed successfully. New vote count:', problem.votesCount);
      res.json({ message: 'Vote removed successfully', votesCount: problem.votesCount, action: 'removed' });
    } else {
      // Add vote
      console.log('Adding vote for user:', userId);
      problem.upvotes.push(userId);
      problem.votesCount = problem.upvotes.length;
      await problem.save();
      console.log('Vote added successfully. New vote count:', problem.votesCount);
      res.json({ message: 'Upvoted successfully', votesCount: problem.votesCount, action: 'added' });
    }

  } catch (err) {
    console.error('Error in upvote route:', err);
    res.status(500).json({ error: 'Error updating vote' });
  }
});
module.exports = router;
