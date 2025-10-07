const mongoose = require('mongoose');

// Import the models
require('./models/User');
require('./models/CivicCard');

mongoose.connect('mongodb://localhost:27017/urbanecho').then(async () => {
  const User = mongoose.model('User');
  const CivicCard = mongoose.model('CivicCard');

  console.log('🔍 CHECKING ACTUAL BALANCES IN DATABASE:');
  const users = await User.find({}).populate('civicCard');

  for (const user of users) {
    console.log(`User: ${user.username}`);
    console.log(`  Civic Card: ${user.civicCard ? 'EXISTS' : 'MISSING'}`);
    console.log(`  Balance: ${user.civicCard?.balance || 0}`);
    console.log(`  Total Earned: ${user.civicCard?.totalEarned || 0}`);
    console.log(`  Card ID: ${user.civicCard?._id || 'N/A'}`);
    console.log('---');
  }

  // Check if we need to give a user some coins for testing
  const testUser = users.find(u => u.userType === 'volunteer');
  if (testUser && (!testUser.civicCard || testUser.civicCard.balance === 0)) {
    console.log(`\n💡 For testing, you can run:`);
    console.log(`   node -e \\"Update user balance for testing...\\"`);
  }

  process.exit(0);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
