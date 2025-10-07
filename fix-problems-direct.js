// Direct database update for problems without location
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/urbanecho', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Problem = require('./server/models/Problem');

async function fixProblems() {
  try {
    console.log('🔧 Directly updating problems with location data...');

    // Update all problems that don't have location
    const result = await Problem.updateMany(
      {
        $or: [
          { location: { $exists: false } },
          { location: null },
          { location: '' }
        ]
      },
      {
        $set: { location: 'City Center' } // Default location
      }
    );

    console.log(`✅ Updated ${result.modifiedCount} problems with location data`);

    // Show a few updated problems
    const sampleProblems = await Problem.find({}).limit(3).select('title location category');
    console.log('\n📋 Sample of updated problems:');
    sampleProblems.forEach(problem => {
      console.log(`- ${problem.title}: ${problem.location} (${problem.category})`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

fixProblems();
