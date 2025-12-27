const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const axios = require('axios');
const Problem = require('./models/Problem');
const { calculateNextReview } = require('./utils/srs');
const { verifyToken } = require('./middleware/authMiddleware');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/algovault';
console.log(`Attempting to connect to MongoDB at: ${MONGO_URI}`);
console.log("ALGO-VAULT SERVER V2 UPDATED - STARTING...");

mongoose.connect(MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
})
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

// Routes
const authRoutes = require('./routes/auth');

app.use(cors());
app.use(express.json());

// Request Logger
app.use((req, res, next) => {
    console.log(`[INCOMING] ${req.method} ${req.originalUrl}`);
    next();
});

// Mount Auth Routes
app.use('/api/auth', authRoutes);
app.use('/api/leetcode', require('./routes/leetcode'));

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

// Get heatmap data
app.get('/api/heatmap/:username', verifyToken, async (req, res) => {
    try {
        const { username } = req.params;
        const { platform } = req.query;

        console.log(`[Heatmap] Fetching for user: ${username}, platform: ${platform}`);

        // Base match object (removed username filter as Problem model doesn't have it yet)
        let matchStage = {};

        if (platform && platform !== 'All') {
            matchStage.platform = new RegExp(platform, 'i');
        }

        console.log('[Heatmap] Match Stage:', matchStage);

        const heatmapData = await Problem.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        console.log(`[Heatmap] Found ${heatmapData.length} entries`);

        const formattedData = heatmapData.map(item => ({
            date: item._id,
            count: item.count
        }));

        res.json(formattedData);
    } catch (error) {
        console.error('Error fetching heatmap data:', error);
        res.status(500).json({ error: 'Failed to fetch heatmap data' });
    }
});

// Get review problems (SRS based)
app.get('/api/problems/review', verifyToken, async (req, res) => {
    try {
        const { platform } = req.query;
        const now = new Date();

        console.log(`[Review] Fetching reviews. Platform: ${platform}`);

        // Removed username filter
        let query = {
            'srsData.nextReviewDate': { $lte: now }
        };

        if (platform && platform !== 'All') {
            query.platform = new RegExp(platform, 'i');
        }

        console.log('[Review] Query:', query);

        // Fetch due items
        const dueProblems = await Problem.find(query).sort({ 'srsData.nextReviewDate': 1 });
        console.log(`[Review] Found ${dueProblems.length} problems`);

        res.json(dueProblems);
    } catch (error) {
        console.error('Error fetching review problems:', error);
        res.status(500).json({ error: 'Failed to fetch review problems' });
    }
});

app.post('/api/problems/:id/review', async (req, res) => {
    const { id } = req.params;
    const { rating } = req.body;

    try {
        const problem = await Problem.findById(id);
        if (!problem) {
            return res.status(404).json({ error: 'Problem not found' });
        }

        const { interval, easeFactor, repetitions } = problem.srsData;

        // Map string rating to number (0-3)
        const ratingMap = { 'again': 0, 'hard': 1, 'good': 2, 'easy': 3 };
        const numericRating = ratingMap[rating.toLowerCase()] ?? 2; // Default to 'good' if invalid

        // Calculate new SRS data
        const result = calculateNextReview(numericRating, interval, easeFactor, repetitions || 0);

        problem.srsData.interval = result.interval;
        problem.srsData.easeFactor = result.easeFactor;
        problem.srsData.repetitions = result.repetitions;
        problem.srsData.lastReviewed = new Date();
        problem.srsData.lastDifficulty = rating;

        const nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + result.interval);
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
