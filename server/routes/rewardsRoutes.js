const express = require('express');
const router = express.Router();
const CivicCard = require('../models/CivicCard');
const Reward = require('../models/Reward');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const Problem = require('../models/Problem');
const RedemptionCode = require('../models/RedemptionCode');
const verifyToken = require('../middleware/authMiddleware');

// Get or create civic card for user
router.get('/civic-card', verifyToken, async (req, res) => {
  try {
    let civicCard = await CivicCard.findOne({ user: req.user.userId });

    if (!civicCard) {
      // Create new civic card for user
      civicCard = new CivicCard({
        user: req.user.userId,
        balance: 0,
        totalEarned: 0,
        totalSpent: 0
      });
      await civicCard.save();

      // Update user with civic card reference
      await User.findByIdAndUpdate(req.user.userId, { civicCard: civicCard._id });
    }

    // Calculate and update badges
    const newBadges = await civicCard.calculateBadges();
    if (newBadges.length > 0) {
      await civicCard.save();
    }

    // Populate user info for response
    await civicCard.populate('user', 'username userType');

    // Get badge information for display
    const badgeInfo = civicCard.achievements.map(badge => civicCard.getBadgeInfo(badge));

    res.json({
      ...civicCard.toObject(),
      badgeInfo,
      newBadges: newBadges.length > 0 ? newBadges.map(badge => civicCard.getBadgeInfo(badge)) : []
    });
  } catch (error) {
    console.error('Error fetching civic card:', error);
    res.status(500).json({ error: 'Failed to fetch civic card' });
  }
});

// Get user transaction history
router.get('/transactions', verifyToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const transactions = await Transaction.find({ user: req.user.userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('reference', 'title')
      .lean();

    const total = await Transaction.countDocuments({ user: req.user.userId });

    res.json({
      transactions,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
        limit
      }
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Get available rewards
router.get('/rewards', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const category = req.query.category;
    const skip = (page - 1) * limit;

    let query = { isActive: true, validUntil: { $gte: new Date() } };

    if (category && category !== 'all') {
      query.category = category;
    }

    // Only show rewards that haven't reached max redemptions
    const rewards = await Reward.find(query)
      .sort({ coinCost: 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Reward.countDocuments(query);

    res.json({
      rewards,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
        limit
      }
    });
  } catch (error) {
    console.error('Error fetching rewards:', error);
    res.status(500).json({ error: 'Failed to fetch rewards' });
  }
});

// Redeem a reward
router.post('/redeem/:rewardId', verifyToken, async (req, res) => {
  try {
    const { rewardId } = req.params;

    // Get reward details
    const reward = await Reward.findById(rewardId);
    if (!reward) {
      return res.status(404).json({ error: 'Reward not found' });
    }

    // Check if reward is still available
    if (!reward.isActive || reward.validUntil < new Date()) {
      return res.status(400).json({ error: 'Reward is no longer available' });
    }

    if (reward.maxRedemptions !== null && reward.currentRedemptions >= reward.maxRedemptions) {
      return res.status(400).json({ error: 'Reward redemption limit reached' });
    }

    // Get user's civic card
    const civicCard = await CivicCard.findOne({ user: req.user.userId });
    if (!civicCard) {
      return res.status(400).json({ error: 'Civic card not found. Please contact support.' });
    }

    // Check if user has enough coins
    if (civicCard.balance < reward.coinCost) {
      return res.status(400).json({
        error: `Insufficient civic coins. You need ${reward.coinCost} coins but only have ${civicCard.balance}`
      });
    }

    // Process redemption
    civicCard.balance -= reward.coinCost;
    civicCard.totalSpent += reward.coinCost;
    civicCard.lastUsed = new Date();

    reward.currentRedemptions += 1;

    // Create transaction record
    const transaction = new Transaction({
      user: req.user.userId,
      type: 'spent',
      amount: reward.coinCost,
      description: `Redeemed: ${reward.name}`,
      reference: reward._id,
      referenceModel: 'Reward',
      balanceAfter: civicCard.balance,
      metadata: {
        rewardName: reward.name,
        merchant: reward.merchant
      }
    });

    // Generate unique redemption code
    const redemptionCode = new RedemptionCode({
      code: RedemptionCode.generateCode(),
      user: req.user.userId,
      reward: reward._id,
      transaction: transaction._id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      metadata: {
        rewardName: reward.name,
        merchant: reward.merchant,
        coinCost: reward.coinCost,
        originalBalance: civicCard.balance + reward.coinCost
      }
    });

    // Save all changes
    await Promise.all([
      civicCard.save(),
      reward.save(),
      transaction.save(),
      redemptionCode.save()
    ]);

    res.json({
      message: 'Reward redeemed successfully!',
      reward: {
        name: reward.name,
        merchant: reward.merchant,
        coinsSpent: reward.coinCost
      },
      newBalance: civicCard.balance,
      transactionId: transaction._id,
      redemptionCode: {
        code: redemptionCode.code,
        expiresAt: redemptionCode.expiresAt,
        instructions: `Show this code at ${reward.merchant} to redeem your reward`
      }
    });

  } catch (error) {
    console.error('Error redeeming reward:', error);
    res.status(500).json({ error: 'Failed to redeem reward' });
  }
});

// Award coins when a problem is resolved (NGO only)
router.post('/award-coins/:problemId', verifyToken, async (req, res) => {
  try {
    // Check if user is NGO
    if (req.user.userType !== 'ngo') {
      return res.status(403).json({ error: 'Only NGOs can award civic coins' });
    }

    const { problemId } = req.params;
    const { coins } = req.body;

    if (!coins || coins <= 0) {
      return res.status(400).json({ error: 'Valid coin amount required' });
    }

    // Get the problem
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    if (problem.status === 'resolved') {
      return res.status(400).json({ error: 'Problem is already resolved' });
    }

    // Get reporter's civic card
    let civicCard = await CivicCard.findOne({ user: problem.reporter });

    if (!civicCard) {
      // Create civic card if it doesn't exist
      civicCard = new CivicCard({
        user: problem.reporter,
        balance: 0,
        totalEarned: 0,
        totalSpent: 0
      });
      await civicCard.save();

      // Update user with civic card reference
      await User.findByIdAndUpdate(problem.reporter, { civicCard: civicCard._id });
    }

    // Award coins
    civicCard.balance += coins;
    civicCard.totalEarned += coins;

    // Update problem status
    problem.status = 'resolved';
    problem.resolvedBy = req.user.userId;
    problem.resolvedAt = new Date();

    // Create transaction record
    const transaction = new Transaction({
      user: problem.reporter,
      type: 'earned',
      amount: coins,
      description: `Problem resolved: ${problem.title}`,
      reference: problem._id,
      referenceModel: 'Problem',
      balanceAfter: civicCard.balance,
      metadata: {
        problemTitle: problem.title,
        awardedBy: req.user.userId
      }
    });

    // Save all changes
    await Promise.all([
      civicCard.save(),
      problem.save(),
      transaction.save()
    ]);

    res.json({
      message: 'Civic coins awarded successfully!',
      coinsAwarded: coins,
      newBalance: civicCard.balance,
      transactionId: transaction._id
    });

  } catch (error) {
    console.error('Error awarding coins:', error);
    res.status(500).json({ error: 'Failed to award civic coins' });
  }
});

// Get dashboard stats for user
router.get('/dashboard-stats', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get civic card info
    const civicCard = await CivicCard.findOne({ user: userId });

    // Get transaction summary
    const totalEarned = await Transaction.aggregate([
      { $match: { user: userId, type: 'earned' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const totalSpent = await Transaction.aggregate([
      { $match: { user: userId, type: 'spent' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // Get recent transactions
    const recentTransactions = await Transaction.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('reference', 'title name');

    res.json({
      civicCard: civicCard || { balance: 0, totalEarned: 0, totalSpent: 0 },
      stats: {
        totalEarned: totalEarned[0]?.total || 0,
        totalSpent: totalSpent[0]?.total || 0,
        transactionCount: recentTransactions.length
      },
      recentTransactions
    });

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
  }
});

// Validate redemption code (for merchants)
router.post('/validate-code', async (req, res) => {
  try {
    const { code, merchantName } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Redemption code is required' });
    }

    // Find the redemption code
    const redemptionCode = await RedemptionCode.findOne({ code })
      .populate('reward', 'name merchant coinCost')
      .populate('user', 'username');

    if (!redemptionCode) {
      return res.status(404).json({ 
        valid: false, 
        error: 'Invalid redemption code' 
      });
    }

    // Check if code is still valid
    if (!redemptionCode.isValid()) {
      return res.status(400).json({ 
        valid: false, 
        error: 'Redemption code has expired or is no longer valid' 
      });
    }

    // Check if merchant matches
    if (merchantName && redemptionCode.reward.merchant !== merchantName) {
      return res.status(400).json({ 
        valid: false, 
        error: 'This code is not valid for this merchant' 
      });
    }

    // Mark code as used
    redemptionCode.status = 'used';
    redemptionCode.usedAt = new Date();
    redemptionCode.usedBy = merchantName || 'Unknown Merchant';
    await redemptionCode.save();

    res.json({
      valid: true,
      reward: {
        name: redemptionCode.reward.name,
        merchant: redemptionCode.reward.merchant,
        coinCost: redemptionCode.reward.coinCost
      },
      user: {
        username: redemptionCode.user.username
      },
      redeemedAt: redemptionCode.usedAt,
      message: 'Redemption code validated successfully!'
    });

  } catch (error) {
    console.error('Error validating redemption code:', error);
    res.status(500).json({ error: 'Failed to validate redemption code' });
  }
});

// Get user's active redemption codes
router.get('/my-codes', verifyToken, async (req, res) => {
  try {
    const codes = await RedemptionCode.find({ 
      user: req.user.userId, 
      status: 'active' 
    })
    .populate('reward', 'name merchant coinCost')
    .sort({ createdAt: -1 });

    res.json({
      codes: codes.map(code => ({
        id: code._id,
        code: code.code,
        reward: code.reward,
        expiresAt: code.expiresAt,
        createdAt: code.createdAt
      }))
    });

  } catch (error) {
    console.error('Error fetching redemption codes:', error);
    res.status(500).json({ error: 'Failed to fetch redemption codes' });
  }
});

module.exports = router;
