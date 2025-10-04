const mongoose = require('mongoose');
const User = require('./models/User');

async function resetDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/urbanecho', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Clear existing users
    await User.deleteMany({});
    console.log('Cleared existing users');

    // Create a test user
    const testUser = new User({
      username: 'testuser',
      password: 'testpass123',
      userType: 'volunteer'
    });

    // Save the user (password will be hashed by the pre-save hook)
    await testUser.save();
    console.log('Created test user:');
    console.log('- Username: testuser');
    console.log('- Password: testpass123');
    console.log('- User Type: volunteer');

    // Verify the user was created
    const users = await User.find({});
    console.log('\nCurrent users in database:');
    users.forEach(user => {
      console.log(`- ${user.username} (${user.userType})`);
    });

    console.log('\nDatabase reset complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error resetting database:', error);
    process.exit(1);
  }
}

resetDatabase();
