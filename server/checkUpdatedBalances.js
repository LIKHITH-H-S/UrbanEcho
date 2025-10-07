const mongoose = require('mongoose');

// Import the models
require('./models/User');
require('./models/CivicCard');

mongoose.connect('mongodb://localhost:27017/urbanecho').then(async () => {
  const User = mongoose.model('User');
  const CivicCard = mongoose.model('CivicCard');

  console.log('🔍 CHECKING UPDATED BALANCES:');
  const users = await User.find({}).populate('civicCard');

  for (const user of users) {
    console.log(`User: ${user.username} (${user.userType})`);
    console.log(`  Balance: ${user.civicCard?.balance || 0} coins`);
    console.log(`  Total Earned: ${user.civicCard?.totalEarned || 0} coins`);
    console.log(`  Total Spent: ${user.civicCard?.totalSpent || 0} coins`);
    console.log('---');
  }

  process.exit(0);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
