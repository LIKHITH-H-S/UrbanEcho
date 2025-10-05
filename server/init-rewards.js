const mongoose = require('mongoose');
const User = require('./models/User');
const CivicCard = require('./models/CivicCard');
const Reward = require('./models/Reward');

async function initializeRewardsSystem() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/urbanecho', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Create civic cards for existing users who don't have one
    const usersWithoutCards = await User.find({ civicCard: null });
    console.log(`Found ${usersWithoutCards.length} users without civic cards`);

    for (const user of usersWithoutCards) {
      const civicCard = new CivicCard({
        user: user._id,
        balance: 0,
        totalEarned: 0,
        totalSpent: 0
      });

      await civicCard.save();
      await User.findByIdAndUpdate(user._id, { civicCard: civicCard._id });

      console.log(`Created civic card for user: ${user.username}`);
    }

    // Seed rewards if none exist
    const existingRewards = await Reward.countDocuments();
    if (existingRewards === 0) {
      console.log('Seeding initial rewards...');

      const rewards = [
        {
          name: 'Coffee at Local Cafe',
          description: 'Free medium coffee at participating local cafes',
          coinCost: 50,
          category: 'food',
          merchant: 'Downtown Coffee House',
          merchantLocation: 'Main Street, Downtown',
          validUntil: new Date('2025-12-31'),
          maxRedemptions: 100,
          terms: 'Valid for one medium coffee only. Cannot be combined with other offers.'
        },
        {
          name: 'Movie Ticket Discount',
          description: '50% off movie tickets at City Cinema',
          coinCost: 100,
          category: 'entertainment',
          merchant: 'City Cinema',
          merchantLocation: 'Entertainment District',
          validUntil: new Date('2025-12-31'),
          maxRedemptions: 50,
          terms: 'Valid for regular screenings only. Not valid for 3D or premium formats.'
        },
        {
          name: 'Local Restaurant Meal',
          description: '₹200 off your bill at participating restaurants',
          coinCost: 150,
          category: 'food',
          merchant: 'Various Local Restaurants',
          merchantLocation: 'City-wide',
          validUntil: new Date('2025-12-31'),
          maxRedemptions: 200,
          terms: 'Minimum bill of ₹500 required. Valid at participating restaurants only.'
        },
        {
          name: 'Gym Membership Discount',
          description: '20% off monthly gym membership',
          coinCost: 200,
          category: 'services',
          merchant: 'FitLife Gym',
          merchantLocation: 'Sports Complex Area',
          validUntil: new Date('2025-12-31'),
          maxRedemptions: 30,
          terms: 'Valid for new memberships only. Cannot be combined with other offers.'
        },
        {
          name: 'Bookstore Voucher',
          description: '₹100 voucher at City Bookstore',
          coinCost: 75,
          category: 'shopping',
          merchant: 'City Bookstore',
          merchantLocation: 'Cultural District',
          validUntil: new Date('2025-12-31'),
          maxRedemptions: 75,
          terms: 'Valid for books and stationery only. Minimum purchase of ₹200 required.'
        },
        {
          name: 'Pizza Combo Deal',
          description: 'Free pizza combo meal at participating pizza places',
          coinCost: 120,
          category: 'food',
          merchant: 'Local Pizza Chain',
          merchantLocation: 'Multiple locations',
          validUntil: new Date('2025-12-31'),
          maxRedemptions: 150,
          terms: 'Valid for medium pizza combo only. Extra toppings charged separately.'
        }
      ];

      await Reward.insertMany(rewards);
      console.log(`Created ${rewards.length} rewards`);
    } else {
      console.log(`Found ${existingRewards} existing rewards`);
    }

    console.log('\n✅ Rewards system initialized successfully!');
    console.log('\n📋 Summary:');
    console.log(`- Civic cards created for ${usersWithoutCards.length} users`);
    console.log(`- Total rewards available: ${await Reward.countDocuments()}`);

    process.exit(0);
  } catch (error) {
    console.error('Error initializing rewards system:', error);
    process.exit(1);
  }
}

initializeRewardsSystem();
