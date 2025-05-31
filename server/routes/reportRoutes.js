const express = require('express');
const router = express.Router();
const Report = require('../models/Report');

router.post('/:id/comments', async (req, res) => {
  const { user, text } = req.body;

  if (!user || !text) {
    return res.status(400).json({ error: 'User and text are required' });
  }

  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    const comment = { user, text };
    report.comments.push(comment);
    await report.save();

    res.status(201).json({ message: 'Comment added successfully', comment });
  } catch (err) {
    console.error("Error while adding comment:", err);  // 👈 Print actual error
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

// GET: Fetch all reports
router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) || 1; // default page 1
  const limit = parseInt(req.query.limit) || 10; // default 10 per page
  try {
    const reports = await Report.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    const total = await Report.countDocuments();
    res.json({ total, page, pages: Math.ceil(total / limit), reports });
  } catch (err) {
    console.error('Error fetching reports:', err);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});


// GET: Fetch a single report by ID
router.get('/:id', async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ error: 'Report not found' });
    res.json(report);
  } catch (err) {
    console.error('Error fetching report:', err);
    res.status(500).json({ error: 'Failed to fetch report' });
  }
});

// PATCH /api/reports/:id/upvote
router.patch('/:id/upvote', async (req, res) => {
  try {
    const reportId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(reportId)) {
      return res.status(400).json({ error: 'Invalid report ID' });
    }

    const report = await Report.findById(reportId);
    if (!report) return res.status(404).json({ error: 'Report not found' });

    report.upvotes = (report.upvotes || 0) + 1;
    await report.save();

    res.json({ message: 'Upvoted!', upvotes: report.upvotes });
  } catch (err) {
    console.error('Upvote error:', err);
    res.status(500).json({ error: 'Failed to upvote' });
  }
});




module.exports = router;
