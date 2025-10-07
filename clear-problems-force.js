// Force clear all problems - more robust version
const mongoose = require('mongoose');
require('dotenv').config();

async function clearProblems() {
  try {
    console.log('🗑️  Force clearing all problems...');

    // Connect with explicit options
    await mongoose.connect('mongodb://localhost:27017/urbanecho', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const Problem = mongoose.model('Problem', new mongoose.Schema({
      title: String,
      description: String,
      location: String,
      category: String,
      upvotes: [mongoose.Schema.Types.ObjectId],
      votesCount: Number,
      status: String,
      reporter: mongoose.Schema.Types.ObjectId
    }, { collection: 'problems' }));

    // Count before deletion
    const countBefore = await Problem.countDocuments();
    console.log(`📊 Found ${countBefore} problems`);

    if (countBefore > 0) {
      // Delete all problems
      const result = await Problem.deleteMany({});
      console.log(`✅ Deleted ${result.deletedCount} problems`);
    }

    // Verify
    const countAfter = await Problem.countDocuments();
    console.log(`📊 Remaining problems: ${countAfter}`);

    console.log('🎉 Database cleared!');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
  }
}

clearProblems();
