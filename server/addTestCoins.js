const mongoose = require('mongoose');

// Import the models
require('./models/User');
require('./models/CivicCard');

mongoose.connect('mongodb://localhost:27017/urbanecho').then(async () => {
  const User = mongoose.model('User');
  const CivicCard = mongoose.model('CivicCard');

  // Find the first volunteer user
  const volunteer = await User.findOne({ userType: 'volunteer' });
  if (!volunteer) {
    console.log('No volunteer user found');
    process.exit(1);
  }

  console.log('Found volunteer:', volunteer.username);

  // Get or create civic card
  let civicCard = await CivicCard.findOne({ user: volunteer._id });
  if (!civicCard) {
    civicCard = new CivicCard({
      user: volunteer._id,
      balance: 0,
      totalEarned: 0,
      totalSpent: 0
    });
    await civicCard.save();
    await User.findByIdAndUpdate(volunteer._id, { civicCard: civicCard._id });
    console.log('Created new civic card');
  }

  // Add 100 coins for testing
  const coinsToAdd = 100;
  civicCard.balance += coinsToAdd;
  civicCard.totalEarned += coinsToAdd;
  await civicCard.save();

  console.log('Added', coinsToAdd, 'coins to', volunteer.username);
  console.log('New balance:', civicCard.balance, 'coins');

  process.exit(0);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
