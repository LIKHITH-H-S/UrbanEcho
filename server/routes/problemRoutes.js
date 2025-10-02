const express = require('express');
const router = express.Router();
const Problem = require('../models/Problem');
const verifyToken = require('../middleware/authMiddleware');

// Protect POST with verifyToken middleware
router.post('/', verifyToken, async (req, res) => {
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
    });

    await problem.save();
    res.status(201).json(problem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const problems = await Problem.find()
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
    const problem = await Problem.findById(req.params.id);
    if (!problem) return res.status(404).json({ error: 'Problem not found' });

    const userId = req.user.userId;

    if (problem.upvotes.includes(userId)) {
      return res.status(400).json({ error: 'You have already upvoted' });
    }

    problem.upvotes.push(userId);
    problem.votesCount = problem.upvotes.length;

    await problem.save();
    res.json({ message: 'Upvoted successfully', votesCount: problem.votesCount });
  } catch (err) {
    res.status(500).json({ error: 'Error upvoting problem' });
  }
});
module.exports = router;
