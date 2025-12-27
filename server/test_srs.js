const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testSRS() {
    try {
        console.log("1. Creating a new problem...");
        const createRes = await axios.post(`${API_URL}/save-problem`, {
            title: `SRS Test Problem ${Date.now()}`,
            code: 'console.log("test")',
            platform: 'Other',
            url: 'http://test.com'
        });
        const problemId = createRes.data.problemId;
        console.log(`   Problem created with ID: ${problemId}`);

        console.log("2. Reviewing Problem (Good)...");
        const reviewRes = await axios.post(`${API_URL}/problems/${problemId}/review`, {
            rating: 'good'
        });
        console.log(`   Review response:`, reviewRes.data);

        console.log("   Extension (Interval) check: If first review 'good', interval should be 1 or 6 (depending on logic, usually 1 for first time).");

    } catch (error) {
        console.error("Test failed:", error.response ? error.response.data : error.message);
    }
}

testSRS();
