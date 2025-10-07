// Check current problems in database
const axios = require('axios');

async function checkProblems() {
  try {
    console.log('🔍 Checking current problems in database...');

    // Get all problems
    const response = await axios.get('http://localhost:5001/api/problems');
    const problems = response.data;

    console.log(`Found ${problems.length} problems:`);
    console.log('=====================================');

    problems.forEach((problem, index) => {
      console.log(`${index + 1}. Problem ID: ${problem._id}`);
      console.log(`   Title: ${problem.title}`);
      console.log(`   Location: ${problem.location || 'NO LOCATION'}`);
      console.log(`   Category: ${problem.category}`);
      console.log(`   Description: ${problem.description || 'No description'}`);
      console.log(`   Upvotes: ${problem.votesCount || 0}`);
      console.log('   -----------------------------------');
    });

  } catch (error) {
    console.log('❌ Error fetching problems:', error.response?.data || error.message);
  }
}

checkProblems();
