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
      cb(new Error('Only image files are allowed'));
    }
  }
});

// GET all problems (public access)
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

    // Clean up any malformed data in the response
    const cleanedProblems = problems.map(problem => {
      if (!Array.isArray(problem.upvotes)) {
        console.log('Cleaning malformed upvotes array for problem:', problem._id);
        problem.upvotes = [];
        problem.votesCount = 0;
        problem.save(); // Save the cleaned data
      }
      return problem;
    });

    console.log('Fetched problems:', cleanedProblems.length);
    res.json(cleanedProblems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// POST create new problem (authenticated users only)
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

// POST upvote a problem (authenticated users only)
router.post('/:id/upvote', verifyToken, async (req, res) => {
  try {
    console.log('🔥 UPVOTE REQUEST RECEIVED');
    console.log('Headers:', req.headers);
    console.log('Authorization header:', req.header('Authorization'));
    console.log('Upvote request for problem:', req.params.id);
    console.log('User ID from token:', req.user?.userId);
    console.log('Full user object:', JSON.stringify(req.user, null, 2));

    if (!req.user || !req.user.userId) {
      console.log('❌ No userId in token');
      return res.status(401).json({ error: 'Invalid token - no userId' });
    }

    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      console.log('❌ Problem not found:', req.params.id);
      return res.status(404).json({ error: 'Problem not found' });
    }

    const userId = req.user.userId;
    console.log('✅ Processing upvote for userId:', userId);

    // Ensure upvotes array is valid
    if (!Array.isArray(problem.upvotes)) {
      console.log('Upvotes array is malformed, resetting it');
      problem.upvotes = [];
      problem.votesCount = 0;
    }

    // Filter out any invalid entries in upvotes array
    problem.upvotes = problem.upvotes.filter(vote => vote && (typeof vote === 'string' || vote._id || vote.toString()));

    // Check if user has already voted
    const hasVoted = problem.upvotes.some(vote => {
      const voteId = vote._id || vote.toString() || vote;
      return voteId === userId.toString();
    });

    console.log('User has voted:', hasVoted);
    console.log('Current upvotes array:', problem.upvotes);

    if (hasVoted) {
      // User has already voted - return current state (no unvoting allowed)
      console.log('User already voted on this problem');
      res.json({
        message: 'You have already voted on this problem',
        votesCount: problem.votesCount || 0,
        action: 'already_voted',
        hasVoted: true
      });
    } else {
      // Add vote (first time voting)
      console.log('Adding vote for user:', userId);
      problem.upvotes.push(userId);
      problem.votesCount = problem.upvotes.length;
      await problem.save();
      console.log('Vote added successfully. New vote count:', problem.votesCount);
      res.json({
        message: 'Upvoted successfully',
        votesCount: problem.votesCount,
        action: 'added',
        hasVoted: false
      });
    }

  } catch (err) {
    console.error('Error in upvote route:', err);
    console.error('Error details:', err.message);
    res.status(500).json({ error: 'Error updating vote' });
  }
});

// DELETE remove a vote (authenticated users only)
router.delete('/:id/upvote/:userId', verifyToken, async (req, res) => {
  try {
    const { id, userId } = req.params;

    const problem = await Problem.findById(id);
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    // Ensure upvotes array is valid
    if (!Array.isArray(problem.upvotes)) {
      console.log('Upvotes array is malformed, resetting it');
      problem.upvotes = [];
      problem.votesCount = 0;
      await problem.save();
      return res.status(400).json({ error: 'Invalid vote data' });
    }

    // Filter out any invalid entries in upvotes array
    problem.upvotes = problem.upvotes.filter(vote => vote && (typeof vote === 'string' || vote._id || vote.toString()));

    // Check if the user has voted
    const hasVoted = problem.upvotes.some(vote => {
      const voteId = vote._id || vote.toString() || vote;
      return voteId === userId.toString();
    });

    if (!hasVoted) {
      return res.status(400).json({ error: 'User has not voted on this problem' });
    }

    // Remove the vote
    problem.upvotes = problem.upvotes.filter(vote => {
      const voteId = vote._id || vote.toString() || vote;
      return voteId !== userId.toString();
    });
    problem.votesCount = Math.max(0, problem.votesCount - 1);
    await problem.save();

    res.json({
      message: 'Vote removed successfully',
      votesCount: problem.votesCount,
      action: 'removed'
    });

  } catch (err) {
    console.error('Error removing vote:', err);
    res.status(500).json({ error: 'Error removing vote' });
  }
});

// POST verify a problem (NGOs only)
router.post('/:id/verify', verifyToken, async (req, res) => {
  try {
    console.log('Verify request for problem:', req.params.id);
    console.log('User ID from token:', req.user.userId);
    console.log('User type from token:', req.user.userType);

    // Only NGOs can verify problems
    if (req.user.userType !== 'ngo') {
      return res.status(403).json({ error: 'Only NGOs can verify problems' });
    }

    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      console.log('Problem not found:', req.params.id);
      return res.status(404).json({ error: 'Problem not found' });
    }

    if (problem.status !== 'pending') {
      return res.status(400).json({ error: 'Problem is not in pending status' });
    }

    // Update problem status to verified
    problem.status = 'verified';
    problem.verifiedBy = req.user.userId;
    problem.verifiedAt = new Date();

    await problem.save();
    console.log('Problem verified successfully:', problem._id);

    res.json(problem);
  } catch (err) {
    console.error('Error in verify route:', err);
    res.status(500).json({ error: 'Error verifying problem' });
  }
});

// POST submit to government (NGOs only)
router.post('/:id/submit', verifyToken, async (req, res) => {
  try {
    console.log('Submit to government request for problem:', req.params.id);
    console.log('User ID from token:', req.user.userId);
    console.log('User type from token:', req.user.userType);

    // Only NGOs can submit to government
    if (req.user.userType !== 'ngo') {
      return res.status(403).json({ error: 'Only NGOs can submit problems to government' });
    }

    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      console.log('Problem not found:', req.params.id);
      return res.status(404).json({ error: 'Problem not found' });
    }

    if (problem.status !== 'verified') {
      return res.status(400).json({ error: 'Problem must be verified before submitting to government' });
    }

    // Update problem status to done (submitted to government)
    problem.status = 'done';
    problem.submittedToGovernment = true;
    problem.submittedAt = new Date();

    await problem.save();
    console.log('Problem submitted to government successfully:', problem._id);

    res.json(problem);
  } catch (err) {
    console.error('Error in submit route:', err);
    res.status(500).json({ error: 'Error submitting to government' });
  }
});

module.exports = router;
