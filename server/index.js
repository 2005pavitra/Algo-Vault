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
        const { title, code, platform, tags, url } = req.body;
        console.log(`Received submission from ${platform}: ${title}`);

        if (!code) {
            return res.status(400).json({ error: 'No code provided' });
        }

        // Check if problem already exists to update or create new
        const existingProblem = await Problem.findOne({ title: title, platform: platform });

        if (existingProblem) {
            existingProblem.code = code;
            existingProblem.srsData.nextReviewDate = new Date(); // Reset SRS on new submission? Optional.
            await existingProblem.save();
            console.log('Problem updated successfully');
            return res.status(200).json({ message: 'Problem updated', problemId: existingProblem._id });
        }

        const newProblem = new Problem({
            title: title || `Problem from ${url}`,
            code: code,
            platform: platform || 'Unknown',
            tags: tags || [],
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

// Endpoint to get Heatmap data (Local Algo-Vault stats)
app.get('/api/heatmap/:username', async (req, res) => {
    // Username param is kept for route compatibility but ignored for local stats
    try {
        const heatmapData = await Problem.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        // Transform to standard format: [{ date: "YYYY-MM-DD", count: N }]
        const formattedData = heatmapData.map(item => ({
            date: item._id,
            count: item.count
        }));

        console.log('Generated local heatmap data:', formattedData);
        res.json(formattedData);

    } catch (error) {
        console.error('Error fetching heatmap:', error.message);
        res.status(500).json({ error: 'Failed to fetch heatmap data' });
    }
});

// Endpoint to fetch problems due for review
app.get('/api/problems/review', async (req, res) => {
    try {
        // Find problems where nextReviewDate is less than or equal to now
        const now = new Date();
        const dueProblems = await Problem.find({
            'srsData.nextReviewDate': { $lte: now }
        });

        console.log(`Found ${dueProblems.length} problems due for review`);
        res.json(dueProblems);
    } catch (error) {
        console.error('Error fetching review problems:', error);
        res.status(500).json({ error: 'Failed to fetch problems' });
    }
});

// Endpoint to update SRS data for a problem
app.post('/api/problems/:id/review', async (req, res) => {
    const { id } = req.params;
    const { rating } = req.body; // 'again', 'hard', 'good', 'easy'

    try {
        const problem = await Problem.findById(id);
        if (!problem) {
            return res.status(404).json({ error: 'Problem not found' });
        }

        // Simplified Spaced Repetition Logic
        // In a real app, use a robust algorithm like SM-2
        let { interval, easeFactor } = problem.srsData;

        switch (rating) {
            case 'again': // Fail
                interval = 1;
                easeFactor = Math.max(1.3, easeFactor - 0.2);
                break;
            case 'hard':
                interval = interval * 1.2;
                easeFactor = Math.max(1.3, easeFactor - 0.15);
                break;
            case 'good':
                interval = interval * easeFactor;
                // Ease factor stays same
                break;
            case 'easy':
                interval = interval * easeFactor * 1.3;
                easeFactor = easeFactor + 0.15;
                break;
            default:
                // Default to 'good' behavior if unknown
                interval = interval * easeFactor;
        }

        // Apply logic
        problem.srsData.interval = Math.round(interval); // Keep interval as integer days
        problem.srsData.easeFactor = easeFactor;

        // Calculate next date
        const nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + problem.srsData.interval);
        problem.srsData.nextReviewDate = nextDate;

        await problem.save();
        console.log(`Updated problem ${problem.title} SRS: interval=${problem.srsData.interval}, next=${nextDate.toISOString().split('T')[0]}`);

        res.json({ message: 'Review recorded', nextReviewDate: nextDate });
    } catch (error) {
        console.error('Error updating review:', error);
        res.status(500).json({ error: 'Failed to record review' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
