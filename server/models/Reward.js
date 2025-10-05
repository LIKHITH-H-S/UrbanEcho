const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  coinCost: {
    type: Number,
    required: true,
    min: 1
  },
  category: {
    type: String,
    enum: ['food', 'entertainment', 'shopping', 'services', 'other'],
    required: true
  },
  merchant: {
    type: String,
    required: true
  },
  merchantLocation: {
    type: String,
    required: true
  },
  image: {
    type: String, // URL to reward image
    default: null
  },
  validUntil: {
    type: Date,
    required: true
  },
  maxRedemptions: {
    type: Number,
    default: null // null means unlimited
  },
  currentRedemptions: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  terms: {
    type: String,
    required: true
  }
}, { timestamps: true });

// Virtual for available redemptions
rewardSchema.virtual('availableRedemptions').get(function() {
  if (this.maxRedemptions === null) return null; // unlimited
  return Math.max(0, this.maxRedemptions - this.currentRedemptions);
});

// Ensure virtual fields are serialized
rewardSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Reward', rewardSchema);
