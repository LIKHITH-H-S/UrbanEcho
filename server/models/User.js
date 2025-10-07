const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User schema definition
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    enum: ['volunteer', 'ngo'],
    default: 'volunteer',
  },
  civicCard: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CivicCard',
    default: null
  },
  coins: {
    type: Number,
    default: 0,
    min: 0
  },
  totalCoinsEarned: {
    type: Number,
    default: 0,
    min: 0
  },
  problemsReported: {
    type: Number,
    default: 0
  },
  problemsResolved: {
    type: Number,
    default: 0
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('User', userSchema);
