const express = require('express');
const router = express.Router();
const Problem = require('../models/Problem');
const verifyToken = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');

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
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Configure multer for verification images
const verificationStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/verification/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const verificationUpload = multer({
  storage: verificationStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    console.log('🔍 MULTER FILE FILTER:', file.originalname, file.mimetype);
    if (file.mimetype.startsWith('image/')) {
      console.log('✅ File type accepted');
      cb(null, true);
    } else {
      console.log('❌ File type rejected');
      cb(new Error('Only image files are allowed'), false);
    }
  }
}).single('verificationImage');

// GET all problems (public access) - excludes done problems for volunteers
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;

    let query = {
      status: { $ne: 'done' } // Exclude done problems from general problem list
    };

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
        // Save only modified fields to avoid validating unrelated legacy fields
        problem.save({ validateModifiedOnly: true });
      }
      return problem;
    });

    console.log('Fetched problems (excluding done):', cleanedProblems.length);
    res.json(cleanedProblems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// GET all problems including done (NGOs only)
router.get('/all', verifyToken, async (req, res) => {
  try {
    // Only NGOs can access all problems including done ones
    if (req.user.userType !== 'ngo') {
      return res.status(403).json({ error: 'Only NGOs can access all problems' });
    }

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
        // Save only modified fields to avoid validating unrelated legacy fields
        problem.save({ validateModifiedOnly: true });
      }
      return problem;
    });

    console.log('Fetched all problems (NGO access):', cleanedProblems.length);
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

    // Award coins to volunteer for reporting a problem
    try {
      const CivicCard = require('../models/CivicCard');
      const User = require('../models/User');

      console.log('🏆 Awarding coins for problem report...');
      console.log('Reporter ID:', req.user.userId);

      // Get or create civic card for the volunteer
      let civicCard = await CivicCard.findOne({ user: req.user.userId });

      if (!civicCard) {
        console.log('📋 Creating new civic card for user');
        // Create new civic card if it doesn't exist
        civicCard = new CivicCard({
          user: req.user.userId,
          balance: 0,
          totalEarned: 0,
          totalSpent: 0
        });
        await civicCard.save();

        // Update user with civic card reference
        await User.findByIdAndUpdate(req.user.userId, { civicCard: civicCard._id });
        console.log('✅ Civic card created and linked to user');
      }

      // Award coins for reporting a problem
      const coinsToAward = 10; // Award 10 coins per reported problem
      civicCard.balance += coinsToAward;
      civicCard.totalEarned += coinsToAward;

      await civicCard.save();
      console.log(`✅ Awarded ${coinsToAward} civic coins to volunteer for reporting problem`);
      console.log(`📊 New balance: ${civicCard.balance}`);

    } catch (coinError) {
      console.error('❌ Error awarding reporting coins:', coinError);
      // Don't fail the main operation if coin awarding fails
    }

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

    const problemId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(problemId)) {
      console.log('❌ Invalid problem id:', problemId);
      return res.status(404).json({ error: 'Problem not found' });
    }

    const userId = req.user.userId;
    console.log('✅ Processing upvote for userId:', userId, 'Type:', typeof userId);
    if (!mongoose.Types.ObjectId.isValid(String(userId))) {
      console.log('❌ Invalid user id in token:', userId);
      return res.status(401).json({ error: 'Invalid user token' });
    }
    const userObjectId = new mongoose.Types.ObjectId(String(userId));

    // Atomically add vote only if not exists; increment count accordingly
    const updateResult = await Problem.updateOne(
      { _id: problemId, upvotes: { $ne: userObjectId } },
      { $addToSet: { upvotes: userObjectId }, $inc: { votesCount: 1 } }
    );

    // Fetch latest count
    const updated = await Problem.findById(problemId).select('votesCount');

    if (!updated) {
      console.log('❌ Problem not found after update:', problemId);
      return res.status(404).json({ error: 'Problem not found' });
    }

    if (!updateResult.modifiedCount) {
      console.log('No modification (already voted).');
      return res.json({
        message: 'You have already voted on this problem',
        votesCount: updated.votesCount || 0,
        action: 'already_voted',
        hasVoted: true
      });
    }

    console.log('Vote added successfully. New vote count:', updated.votesCount);
    return res.json({
      message: 'Upvoted successfully',
      votesCount: updated.votesCount || 0,
      action: 'added',
      hasVoted: false
    });

  } catch (err) {
    console.error('Error in upvote route:', err);
    console.error('Error details:', err.message);
    console.error('Error name:', err.name);
    console.error('Error stack:', err.stack);

    // More detailed error logging
    if (err.name === 'ValidationError') {
      console.error('ValidationError details:');
      console.error('  Path:', err.path);
      console.error('  Kind:', err.kind);
      console.error('  Value:', err.value);
      console.error('  Full error object:', JSON.stringify(err, null, 2));
    }

    // Handle CastError (invalid ObjectId) as 404 - problem not found
    if (err.name === 'CastError' && err.path === '_id') {
      return res.status(404).json({ error: 'Problem not found' });
    }

    // Handle other validation errors as 400, but include message for clarity
    if (err.name === 'ValidationError') {
      if (err.path === '_id' || err.kind === 'ObjectId') {
        return res.status(404).json({ error: 'Problem not found' });
      }
      return res.status(400).json({ error: 'Invalid request data: ' + (err.message || 'validation failed') });
    }

    // Generic server error for unexpected issues
    res.status(500).json({ error: 'Internal server error' });
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
    problem.upvotes = problem.upvotes.filter(vote => {
      if (!vote) return false;
      // Keep ObjectIds, strings that look like ObjectIds, or any truthy value
      if (vote instanceof mongoose.Types.ObjectId) return true;
      if (typeof vote === 'string' && vote.length === 24 && /^[0-9a-fA-F]+$/.test(vote)) return true;
      if (vote._id || vote.toString()) return true;
      return false;
    });

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
    // Validate only modified fields to avoid legacy data causing failures
    await problem.save({ validateModifiedOnly: true });

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

// POST verify a problem with photo (NGOs only)
router.post('/:id/verify', verifyToken, verificationUpload, async (req, res) => {
  try {
    console.log('🔍=== VERIFY REQUEST DEBUG ===');
    console.log('Verify request for problem:', req.params.id);
    console.log('User ID from token:', req.user?.userId);
    console.log('User type from token:', req.user?.userType);
    console.log('Request body keys:', Object.keys(req.body));
    console.log('Request file:', req.file);
    console.log('Request files:', req.files);
    console.log('Content-Type:', req.headers['content-type']);

    // Only NGOs can verify problems
    if (req.user.userType !== 'ngo') {
      console.log('❌ User type check failed:', req.user.userType);
      return res.status(403).json({ error: 'Only NGOs can verify problems' });
    }

    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      console.log('❌ Problem not found:', req.params.id);
      return res.status(404).json({ error: 'Problem not found' });
    }

    console.log('✅ Problem found:', problem._id, 'Status:', problem.status);

    if (problem.status !== 'assigned') {
      console.log('❌ Status check failed. Expected: assigned, Got:', problem.status);
      return res.status(400).json({ error: 'Only assigned problems can be verified' });
    }

    // Check if file was uploaded
    if (!req.file) {
      console.log('❌ No file uploaded');
      return res.status(400).json({ error: 'Verification image is required' });
    }

    console.log('✅ File upload successful, updating problem...');

    // Update problem status to verified and add verification image
    problem.status = 'verified';
    problem.verificationImage = `/uploads/verification/${req.file.filename}`;
    problem.verifiedAt = new Date();
    problem.verifiedBy = typeof req.user.userId === 'string' ? new mongoose.Types.ObjectId(req.user.userId) : req.user.userId;

    await problem.save();
    console.log('Problem verified successfully:', problem._id);

    res.json(problem);
  } catch (err) {
    console.error('Error in verify route:', err);
    console.error('Error stack:', err.stack);

    // Handle multer errors specifically
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File size too large. Maximum size is 5MB.' });
      }
      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({ error: 'Unexpected file field. Please use "verificationImage".' });
      }
    }

    // Handle other errors
    if (err.message && err.message.includes('Only image files are allowed')) {
      return res.status(400).json({ error: 'Only image files are allowed' });
    }

    res.status(500).json({ error: 'Error verifying problem: ' + (err.message || 'Unknown error') });
  }
});

// POST submit a problem to government (NGOs only)
router.post('/:id/submit', verifyToken, async (req, res) => {
  try {
    console.log('Submit request for problem:', req.params.id);
    console.log('User ID from token:', req.user?.userId);
    console.log('User type from token:', req.user?.userType);

    // Only NGOs can submit to government
    if (req.user.userType !== 'ngo') {
      console.log('User type check failed:', req.user.userType);
      return res.status(403).json({ error: 'Only NGOs can submit problems to government' });
    }

    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      console.log('Problem not found:', req.params.id);
      return res.status(404).json({ error: 'Problem not found' });
    }

    console.log('Problem found:', problem._id, 'Status:', problem.status);

    if (problem.status !== 'verified') {
      console.log('Status check failed. Expected: verified, Got:', problem.status);
      return res.status(400).json({ error: 'Problem must be verified before submitting to government' });
    }

    // Update problem status to done (submitted to government)
    problem.status = 'done';
    problem.submittedToGovernment = true;
    problem.submittedAt = new Date();

    await problem.save();
    console.log('Problem submitted to government successfully:', problem._id);

    // Award coins to the volunteer who reported the problem
    try {
      const CivicCard = require('../models/CivicCard');
      const User = require('../models/User');

      console.log('🏆 Awarding coins for problem resolution...');
      console.log('Reporter ID:', problem.reporter);

      // Get or create civic card for the volunteer
      let civicCard = await CivicCard.findOne({ user: problem.reporter });

      if (!civicCard) {
        console.log('📋 Creating new civic card for reporter');
        // Create new civic card if it doesn't exist
        civicCard = new CivicCard({
          user: problem.reporter,
          balance: 0,
          totalEarned: 0,
          totalSpent: 0
        });
        await civicCard.save();

        // Update user with civic card reference
        await User.findByIdAndUpdate(problem.reporter, { civicCard: civicCard._id });
        console.log('✅ Civic card created and linked to reporter');
      }

      // Award coins for problem resolution
      const coinsToAward = 40; // Award 40 coins per resolved problem
      civicCard.balance += coinsToAward;
      civicCard.totalEarned += coinsToAward;

      await civicCard.save();
      console.log(`✅ Awarded ${coinsToAward} civic coins to volunteer for problem resolution`);
      console.log(`📊 New balance: ${civicCard.balance}`);

    } catch (coinError) {
      console.error('❌ Error awarding resolution coins:', coinError);
      // Don't fail the main operation if coin awarding fails
    }

    res.json(problem);
  } catch (err) {
    console.error('Error in submit route:', err);
    console.error('Error stack:', err.stack);
    res.status(500).json({ error: 'Error submitting to government: ' + (err.message || 'Unknown error') });
  }
});

router.post('/:id/assign', verifyToken, async (req, res) => {
  try {
    console.log('User ID from token:', req.user.userId);
    console.log('User type from token:', req.user.userType);

    // Only NGOs can assign staff
    if (req.user.userType !== 'ngo') {
      return res.status(403).json({ error: 'Only NGOs can assign staff to problems' });
    }

    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      console.log('Problem not found:', req.params.id);
      return res.status(404).json({ error: 'Problem not found' });
    }

    if (problem.status !== 'pending') {
      return res.status(400).json({ error: 'Only pending problems can be assigned to staff' });
    }

    // Update problem status to assigned
    problem.status = 'assigned';
    problem.assignedTo = typeof req.user.userId === 'string' ? new mongoose.Types.ObjectId(req.user.userId) : req.user.userId;
    problem.assignedAt = new Date();

    await problem.save();
    console.log('Problem assigned to staff successfully:', problem._id);

    res.json(problem);
  } catch (err) {
    console.error('Error in assign route:', err);
    res.status(500).json({ error: 'Error assigning problem to staff' });
  }
});

module.exports = router;
