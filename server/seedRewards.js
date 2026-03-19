const Reward = require('./models/Reward');

const defaultRewards = [
  {
    name: 'Free Coffee',
    description: 'One free coffee at any participating café',
    coinCost: 50,
    category: 'food',
    merchant: 'Urban Café',
    merchantLocation: 'Downtown',
    validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
    terms: 'Show this code at the counter. One per customer.',
    isActive: true,
  },
  {
    name: '10% Off Next Purchase',
    description: '10% discount on your next purchase',
    coinCost: 30,
    category: 'shopping',
    merchant: 'Community Store',
    merchantLocation: 'Main Street',
    validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    terms: 'Valid once. Cannot combine with other offers.',
    isActive: true,
  },
  {
    name: 'Local Cinema Ticket',
    description: 'One movie ticket at the community cinema',
    coinCost: 80,
    category: 'entertainment',
    merchant: 'Echo Cinema',
    merchantLocation: 'Mall Road',
    validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    terms: 'Standard screening only. Subject to availability.',
    isActive: true,
  },
  {
    name: 'Bike Repair Discount',
    description: '₹50 off any bike repair service',
    coinCost: 40,
    category: 'services',
    merchant: 'Green Wheels',
    merchantLocation: 'Station Road',
    validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    terms: 'One use per person. Valid for repairs over ₹200.',
    isActive: true,
  },
  {
    name: 'Plant Sapling',
    description: 'Free native plant sapling from the nursery',
    coinCost: 25,
    category: 'other',
    merchant: 'Eco Nursery',
    merchantLocation: 'Park Lane',
    validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    terms: 'While stocks last. One per household per month.',
    isActive: true,
  },
  {
    name: 'Book Swap Credit',
    description: 'Borrow any one book from the community library',
    coinCost: 20,
    category: 'entertainment',
    merchant: 'Community Library',
    merchantLocation: 'Central Square',
    validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    terms: 'Return within 14 days. Lost books may incur charges.',
    isActive: true,
  },
];

async function seedRewards() {
  // Use same query as API: only rewards that are active and still valid
  const availableQuery = { isActive: true, validUntil: { $gte: new Date() } };
  const availableCount = await Reward.countDocuments(availableQuery);
  if (availableCount > 0) {
    console.log('Available rewards already exist, skipping seed.');
    return;
  }
  try {
    await Reward.insertMany(defaultRewards);
    console.log(`Seeded ${defaultRewards.length} default rewards.`);
  } catch (err) {
    console.error('Seed rewards error:', err.message);
  }
}

module.exports = { seedRewards };
