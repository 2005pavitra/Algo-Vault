const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const axios = require('axios');
const Problem = require('./models/Problem');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/algovault';

app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => {
    res.send('Algo-Vault Server Running');
});

// Endpoint to receive problem data from Extension
app.post('/api/save-problem', async (req, res) => {
    try {
        const { platform, payload, url } = req.body;
        console.log(`Received submission for ${platform}`);

        // TODO: Better parsing logic based on platform to extract title/code/tags accurately
        // For now, we save the raw payload components or defaults

        let title = "Unknown Problem";
        let code = "// Code not parsed yet";
        let tags = [];

        if (platform === 'LeetCode') {
            // Logic to extract from LeetCode payload if available
            // Usually payload contains question_id or similar. 
            // We might need to fetch problem details using question_id if not in payload.
            // For this scaffold, we'll try to guess or just use the URL as reference.
            if (payload && payload.question_id) {
                title = `LeetCode Problem ${payload.question_id}`;
            }
            if (payload && payload.typed_code) {
                code = payload.typed_code;
            }
        }

        // Check if problem already exists to update or create new
        // Ideally we check by some unique ID (like leetcode question_id)

        const newProblem = new Problem({
            title: title || `Problem from ${url}`,
            code: code,
            platform: platform,
            tags: tags,
            // srsData defaults will apply
        });

        await newProblem.save();
        console.log('Problem saved successfully');
        res.status(200).json({ message: 'Problem saved', problemId: newProblem._id });
    } catch (error) {
        console.error('Error saving problem:', error);
        res.status(500).json({ error: 'Failed to save problem' });
    }
});

// Endpoint to get Heatmap data (LeetCode adapter)
app.get('/api/heatmap/:username', async (req, res) => {
    const { username } = req.params;
    try {
        const query = `
            query userProfileCalendar($username: String!) {
                matchedUser(username: $username) {
                    submissionCalendar
                }
            }
        `;

        const response = await axios.post('https://leetcode.com/graphql', {
            query,
            variables: { username }
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Referer': 'https://leetcode.com'
            }
        });

        const calendarStr = response.data?.data?.matchedUser?.submissionCalendar;

        if (!calendarStr) {
            return res.status(404).json({ error: 'User not found or no data' });
        }

        const calendarData = JSON.parse(calendarStr);
        // Format: { "unix_timestamp": count, ... }
        // Convert to [{ date: "YYYY-MM-DD", count: N }]

        const heatmapData = Object.entries(calendarData).map(([timestamp, count]) => {
            const date = new Date(parseInt(timestamp) * 1000); // timestamp is in seconds
            const dateString = date.toISOString().split('T')[0];
            return { date: dateString, count: count };
        });

        res.json(heatmapData);

    } catch (error) {
        console.error('Error fetching heatmap:', error.message);
        res.status(500).json({ error: 'Failed to fetch heatmap data' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
