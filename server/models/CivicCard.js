const mongoose = require('mongoose');

const civicCardSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  cardNumber: {
    type: String,
    unique: true
  },
  balance: {
    type: Number,
    default: 0,
    min: 0
  },
  totalEarned: {
    type: Number,
    default: 0,
    min: 0
  },
  totalSpent: {
    type: Number,
    default: 0,
    min: 0
  },
  memberSince: {
    type: Date,
    default: Date.now
  },
  achievements: [{
    type: String,
    enum: [
      'bronze_level', 'silver_level', 'gold_level', 'platinum_level', 'diamond_level',
      'community_hero', 'eco_warrior', 'problem_solver', 'early_adopter', 'milestone_achiever',
      'first_report', 'top_reporter', 'community_champion', 'sustainability_champion',
      'quick_responder', 'veteran_member', 'social_impact', 'innovation_leader'
    ]
  }],
  level: {
    type: Number,
    default: 1,
    min: 1,
    max: 10
  },
  experiencePoints: {
    type: Number,
    default: 0,
    min: 0
  },
  nextLevelProgress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  isActive: {
    type: Boolean,
    default: true
  },
  issuedDate: {
    type: Date,
    default: Date.now
  },
  lastUsed: {
    type: Date,
    default: null
  }
}, { timestamps: true });

// Generate unique card number
civicCardSchema.pre('save', async function(next) {
  if (!this.cardNumber) {
    // Generate a unique 16-digit card number
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.cardNumber = `CC${timestamp.slice(-8)}${random}`;
  }
  next();
});

// Method to calculate and award badges based on user activity
civicCardSchema.methods.calculateBadges = async function() {
  const Problem = require('./Problem');
  const User = require('./User');
  
  // Get user's problem count
  const problemCount = await Problem.countDocuments({ reporter: this.user });
  const user = await User.findById(this.user);
  const memberDays = Math.floor((Date.now() - this.memberSince) / (1000 * 60 * 60 * 24));
  
  const newBadges = [];
  
  // Level-based badges
  if (this.balance >= 1000 && !this.achievements.includes('diamond_level')) {
    newBadges.push('diamond_level');
  } else if (this.balance >= 500 && !this.achievements.includes('platinum_level')) {
    newBadges.push('platinum_level');
  } else if (this.balance >= 200 && !this.achievements.includes('gold_level')) {
    newBadges.push('gold_level');
  } else if (this.balance >= 100 && !this.achievements.includes('silver_level')) {
    newBadges.push('silver_level');
  } else if (this.balance >= 50 && !this.achievements.includes('bronze_level')) {
    newBadges.push('bronze_level');
  }
  
  // Activity-based badges
  if (problemCount >= 1 && !this.achievements.includes('first_report')) {
    newBadges.push('first_report');
  }
  
  if (problemCount >= 5 && !this.achievements.includes('problem_solver')) {
    newBadges.push('problem_solver');
  }
  
  if (problemCount >= 10 && !this.achievements.includes('community_hero')) {
    newBadges.push('community_hero');
  }
  
  if (problemCount >= 20 && !this.achievements.includes('top_reporter')) {
    newBadges.push('top_reporter');
  }
  
  if (memberDays >= 30 && !this.achievements.includes('early_adopter')) {
    newBadges.push('early_adopter');
  }
  
  if (memberDays >= 90 && !this.achievements.includes('veteran_member')) {
    newBadges.push('veteran_member');
  }
  
  if (this.totalEarned >= 500 && !this.achievements.includes('milestone_achiever')) {
    newBadges.push('milestone_achiever');
  }
  
  // Add new badges to achievements
  this.achievements = [...new Set([...this.achievements, ...newBadges])];
  
  return newBadges;
};

// Method to get badge information
civicCardSchema.methods.getBadgeInfo = function(badgeType) {
  const badgeInfo = {
    bronze_level: { name: 'Bronze Level', icon: '🥉', description: 'Earned 50+ civic coins' },
    silver_level: { name: 'Silver Level', icon: '🥈', description: 'Earned 100+ civic coins' },
    gold_level: { name: 'Gold Level', icon: '🥇', description: 'Earned 200+ civic coins' },
    platinum_level: { name: 'Platinum Level', icon: '💎', description: 'Earned 500+ civic coins' },
    diamond_level: { name: 'Diamond Level', icon: '💠', description: 'Earned 1000+ civic coins' },
    community_hero: { name: 'Community Hero', icon: '🦸', description: 'Reported 10+ problems' },
    eco_warrior: { name: 'Eco Warrior', icon: '🌱', description: 'Environmental champion' },
    problem_solver: { name: 'Problem Solver', icon: '🔧', description: 'Reported 5+ problems' },
    early_adopter: { name: 'Early Adopter', icon: '🚀', description: 'Member for 30+ days' },
    milestone_achiever: { name: 'Milestone Achiever', icon: '🎯', description: 'Earned 500+ total coins' },
    first_report: { name: 'First Report', icon: '📝', description: 'Made your first report' },
    top_reporter: { name: 'Top Reporter', icon: '⭐', description: 'Reported 20+ problems' },
    community_champion: { name: 'Community Champion', icon: '🏆', description: 'Community leader' },
    sustainability_champion: { name: 'Sustainability Champion', icon: '♻️', description: 'Environmental advocate' },
    quick_responder: { name: 'Quick Responder', icon: '⚡', description: 'Fast problem reporter' },
    veteran_member: { name: 'Veteran Member', icon: '👴', description: 'Member for 90+ days' },
    social_impact: { name: 'Social Impact', icon: '🤝', description: 'Made a difference' },
    innovation_leader: { name: 'Innovation Leader', icon: '💡', description: 'Creative problem solver' }
  };
  
  return badgeInfo[badgeType] || { name: 'Unknown Badge', icon: '🏅', description: 'Mystery achievement' };
};

module.exports = mongoose.model('CivicCard', civicCardSchema);
