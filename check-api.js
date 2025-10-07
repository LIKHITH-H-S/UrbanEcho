// Simple check of API response
const axios = require('axios');

async function checkAPI() {
  try {
    console.log('🔍 Testing API response...');
    const response = await axios.get('http://localhost:5001/api/problems');
    const problems = response.data;

    console.log(`✅ API returned ${problems.length} problems`);

    if (problems.length > 0) {
      console.log('\n📋 First problem details:');
      const first = problems[0];
      console.log(`Title: ${first.title}`);
      console.log(`Location: ${first.location || 'NO LOCATION'}`);
      console.log(`Category: ${first.category}`);
      console.log(`Description: ${first.description || 'No description'}`);
    }

  } catch (error) {
    console.log('❌ API Error:', error.response?.data || error.message);
  }
}

checkAPI();
