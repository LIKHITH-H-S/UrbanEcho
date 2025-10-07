// Clear all problems from database
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/urbanecho', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Problem = require('./server/models/Problem');

async function clearAllProblems() {
  try {
    console.log('🗑️  Clearing all problems from database...');

    // Get count before deletion
    const countBefore = await Problem.countDocuments();
    console.log(`📊 Found ${countBefore} problems in database`);

    if (countBefore === 0) {
      console.log('✅ No problems to delete - database is already empty');
      return;
    }

    // Delete all problems
    const deleteResult = await Problem.deleteMany({});
    console.log(`✅ Successfully deleted ${deleteResult.deletedCount} problems`);

    // Verify deletion
    const countAfter = await Problem.countDocuments();
    console.log(`📊 Problems remaining: ${countAfter}`);

    if (countAfter === 0) {
      console.log('🎉 Database cleared successfully! Ready for your own problems.');
    } else {
      console.log('⚠️  Some problems may still remain');
    }

  } catch (error) {
    console.error('❌ Error clearing problems:', error);
  } finally {
    mongoose.connection.close();
  }
}

clearAllProblems();
