const mongoose = require('mongoose');

const redemptionCodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
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
  transaction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'used', 'expired', 'cancelled'],
    default: 'active'
  },
  usedAt: {
    type: Date,
    default: null
  },
  usedBy: {
    type: String, // Store name or merchant ID
    default: null
  },
  expiresAt: {
    type: Date,
    required: true
  },
  qrCodeData: {
    type: String, // Base64 encoded QR code data
    required: true
  },
  metadata: {
    rewardName: String,
    merchant: String,
    coinCost: Number,
    originalBalance: Number
  }
}, { timestamps: true });

// Generate unique redemption code
redemptionCodeSchema.statics.generateCode = function() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Check if code is valid for redemption
redemptionCodeSchema.methods.isValid = function() {
  return this.status === 'active' && this.expiresAt > new Date();
};

module.exports = mongoose.model('RedemptionCode', redemptionCodeSchema);
