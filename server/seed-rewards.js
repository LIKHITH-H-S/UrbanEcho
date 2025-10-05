const mongoose = require('mongoose');
const Reward = require('./models/Reward');

async function seedRewards() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/urbanecho', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Clear existing rewards
    await Reward.deleteMany({});
    console.log('Cleared existing rewards');

    // Create sample rewards from popular brands
    const rewards = [
      {
        name: 'Zomato Food Delivery',
        description: '₹100 off on food delivery orders above ₹299',
        coinCost: 80,
        category: 'food',
        merchant: 'Zomato',
        merchantLocation: 'Pan India',
        validUntil: new Date('2025-12-31'),
        maxRedemptions: 500,
        terms: 'Valid on orders above ₹299. Cannot be combined with other offers.'
      },
      {
        name: 'Swiggy Instamart',
        description: '20% off on grocery delivery from Swiggy Instamart',
        coinCost: 90,
        category: 'shopping',
        merchant: 'Swiggy',
        merchantLocation: 'Pan India',
        validUntil: new Date('2025-12-31'),
        maxRedemptions: 300,
        terms: 'Valid on orders above ₹500. Maximum discount ₹200.'
      },
      {
        name: 'Uber Ride Credit',
        description: '₹50 off on your next Uber ride',
        coinCost: 60,
        category: 'services',
        merchant: 'Uber',
        merchantLocation: 'Pan India',
        validUntil: new Date('2025-12-31'),
        maxRedemptions: 1000,
        terms: 'Valid for one ride only. Cannot be combined with other promotions.'
      },
      {
        name: 'Amazon Shopping',
        description: '₹200 off on Amazon orders above ₹999',
        coinCost: 120,
        category: 'shopping',
        merchant: 'Amazon',
        merchantLocation: 'Pan India',
        validUntil: new Date('2025-12-31'),
        maxRedemptions: 400,
        terms: 'Valid on orders above ₹999. Not applicable on certain categories.'
      },
      {
        name: 'Flipkart Electronics',
        description: '15% off on electronics and gadgets',
        coinCost: 100,
        category: 'shopping',
        merchant: 'Flipkart',
        merchantLocation: 'Pan India',
        validUntil: new Date('2025-12-31'),
        maxRedemptions: 250,
        terms: 'Valid on electronics only. Maximum discount ₹500.'
      },
      {
        name: 'Myntra Fashion',
        description: '₹150 off on fashion and lifestyle products',
        coinCost: 85,
        category: 'shopping',
        merchant: 'Myntra',
        merchantLocation: 'Pan India',
        validUntil: new Date('2025-12-31'),
        maxRedemptions: 350,
        terms: 'Valid on orders above ₹799. Not applicable on sale items.'
      },
      {
        name: 'BookMyShow Movies',
        description: 'Buy 1 Get 1 Free on movie tickets',
        coinCost: 70,
        category: 'entertainment',
        merchant: 'BookMyShow',
        merchantLocation: 'Pan India',
        validUntil: new Date('2025-12-31'),
        maxRedemptions: 200,
        terms: 'Valid for regular shows only. Not applicable on premium formats.'
      },
      {
        name: 'Spotify Premium',
        description: '1 month free Spotify Premium subscription',
        coinCost: 150,
        category: 'entertainment',
        merchant: 'Spotify',
        merchantLocation: 'Pan India',
        validUntil: new Date('2025-12-31'),
        maxRedemptions: 100,
        terms: 'For new users only. Cannot be combined with other offers.'
      },
      {
        name: 'McDonald\'s Meal',
        description: 'Free McAloo Tikki Burger with any meal combo',
        coinCost: 45,
        category: 'food',
        merchant: 'McDonald\'s',
        merchantLocation: 'Pan India',
        validUntil: new Date('2025-12-31'),
        maxRedemptions: 800,
        terms: 'Valid with any meal combo purchase. Cannot be exchanged for cash.'
      },
      {
        name: 'Blinkit Quick Delivery',
        description: '₹75 off on quick grocery delivery',
        coinCost: 55,
        category: 'shopping',
        merchant: 'Blinkit',
        merchantLocation: 'Pan India',
        validUntil: new Date('2025-12-31'),
        maxRedemptions: 600,
        terms: 'Valid on orders above ₹199. Delivery within 10 minutes.'
      },
      {
        name: 'JioMart Shopping',
        description: '₹100 off on JioMart grocery orders',
        coinCost: 65,
        category: 'shopping',
        merchant: 'JioMart',
        merchantLocation: 'Pan India',
        validUntil: new Date('2025-12-31'),
        maxRedemptions: 400,
        terms: 'Valid on orders above ₹399. Free delivery on orders above ₹499.'
      },
      {
        name: 'Nykaa Beauty',
        description: '20% off on beauty and personal care products',
        coinCost: 95,
        category: 'shopping',
        merchant: 'Nykaa',
        merchantLocation: 'Pan India',
        validUntil: new Date('2025-12-31'),
        maxRedemptions: 200,
        terms: 'Valid on beauty products only. Maximum discount ₹300.'
      },
      {
        name: 'JioCinema Premium',
        description: '1 month free JioCinema Premium subscription',
        coinCost: 110,
        category: 'entertainment',
        merchant: 'JioCinema',
        merchantLocation: 'Pan India',
        validUntil: new Date('2025-12-31'),
        maxRedemptions: 150,
        terms: 'For new users only. Access to premium content and live sports.'
      },
      {
        name: 'Airtel Thanks App',
        description: '₹50 Airtel Thanks cashback on recharge',
        coinCost: 40,
        category: 'services',
        merchant: 'Airtel',
        merchantLocation: 'Pan India',
        validUntil: new Date('2025-12-31'),
        maxRedemptions: 1000,
        terms: 'Valid on recharge above ₹199. Cashback credited within 24 hours.'
      },
      {
        name: 'Ajio Fashion',
        description: '₹120 off on fashion and lifestyle shopping',
        coinCost: 75,
        category: 'shopping',
        merchant: 'Ajio',
        merchantLocation: 'Pan India',
        validUntil: new Date('2025-12-31'),
        maxRedemptions: 300,
        terms: 'Valid on orders above ₹599. Free shipping on orders above ₹999.'
      }
    ];

    // Insert rewards
    const createdRewards = await Reward.insertMany(rewards);
    console.log(`Created ${createdRewards.length} rewards:`);
    createdRewards.forEach(reward => {
      console.log(`- ${reward.name} (${reward.coinCost} coins) at ${reward.merchant}`);
    });

    console.log('\nRewards seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding rewards:', error);
    process.exit(1);
  }
}

seedRewards();
