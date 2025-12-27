const axios = require('axios');
const jwt = require('jsonwebtoken');

const API_URL = 'http://localhost:5000/api';
// Generic token for testing - assuming middleware accepts any valid signature or we need a real one?
// The middleware verifies against process.env.JWT_SECRET.
// I'll create a dummy token.
const token = jwt.sign({ _id: 'dummy', username: 'Pavitra' }, 'secret'); // Default secret in authMiddleware was 'secret'

const runTests = async () => {
    try {
        const config = { headers: { Authorization: `Bearer ${token}` } };

        console.log('--- Testing Heatmap ---');
        const heatmapAll = await axios.get(`${API_URL}/heatmap/Pavitra?platform=All`, config);
        console.log('Heatmap (All):', heatmapAll.data.length, 'entries');

        const heatmapLC = await axios.get(`${API_URL}/heatmap/Pavitra?platform=LeetCode`, config);
        console.log('Heatmap (LeetCode):', heatmapLC.data.length, 'entries');

        const heatmapCC = await axios.get(`${API_URL}/heatmap/Pavitra?platform=CodeChef`, config);
        console.log('Heatmap (CodeChef):', heatmapCC.data.length, 'entries');


        console.log('\n--- Testing Review ---');
        const reviewAll = await axios.get(`${API_URL}/problems/review?platform=All`, config);
        console.log('Review (All):', reviewAll.data.length, 'problems');

        const reviewLC = await axios.get(`${API_URL}/problems/review?platform=LeetCode`, config);
        console.log('Review (LeetCode):', reviewLC.data.length, 'problems');
        if (reviewLC.data.length > 0) console.log('Sample LC:', reviewLC.data[0].platform);

        const reviewCC = await axios.get(`${API_URL}/problems/review?platform=CodeChef`, config);
        console.log('Review (CodeChef):', reviewCC.data.length, 'problems');
        if (reviewCC.data.length > 0) console.log('Sample CC:', reviewCC.data[0].platform);

    } catch (error) {
        console.error('Test Failed:', error.response ? error.response.data : error.message);
    }
};

runTests();
