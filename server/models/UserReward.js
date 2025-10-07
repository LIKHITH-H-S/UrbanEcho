const mongoose = require('mongoose');

const userRewardSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reward: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reward',
    required: true
  },
  coinsSpent: {
    type: Number,
    required: true
  },
  claimedAt: {
    type: Date,
    default: Date.now
  },
  redeemedAt: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    enum: ['claimed', 'redeemed', 'expired'],
    default: 'claimed'
  },
  redemptionCode: {
    type: String,
    default: null
  }
}, { timestamps: true });

// Compound index to prevent duplicate claims
userRewardSchema.index({ user: 1, reward: 1 }, { unique: true });

module.exports = mongoose.model('UserReward', userRewardSchema);
