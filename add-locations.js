// Add location data to existing problems that don't have it
const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/urbanecho', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Problem = require('./server/models/Problem');

async function addLocationToProblems() {
  try {
    console.log('🔍 Finding problems without location data...');

    // Find all problems that don't have location or have empty location
    const problemsWithoutLocation = await Problem.find({
      $or: [
        { location: { $exists: false } },
        { location: null },
        { location: '' }
      ]
    });

    console.log(`Found ${problemsWithoutLocation.length} problems without location data`);

    if (problemsWithoutLocation.length === 0) {
      console.log('✅ All problems already have location data!');
      return;
    }

    // Update each problem with a default location
    const defaultLocations = [
      'Downtown Area',
      'Main Street',
      'City Center',
      'Residential District',
      'Commercial Zone',
      'Industrial Area',
      'Park District',
      'Shopping Center'
    ];

    for (let i = 0; i < problemsWithoutLocation.length; i++) {
      const problem = problemsWithoutLocation[i];
      const randomLocation = defaultLocations[i % defaultLocations.length];

      console.log(`📍 Adding location "${randomLocation}" to problem: ${problem.title}`);

      problem.location = randomLocation;
      await problem.save({ validateModifiedOnly: true });
    }

    console.log('✅ Successfully added location data to all problems!');

    // Show updated problems
    const allProblems = await Problem.find({}).sort({ createdAt: -1 });
    console.log('\n📋 Updated problems list:');
    allProblems.forEach((problem, index) => {
      console.log(`${index + 1}. ${problem.title} - Location: ${problem.location}`);
    });

  } catch (error) {
    console.error('❌ Error updating problems:', error);
  } finally {
    mongoose.connection.close();
  }
}

addLocationToProblems();
