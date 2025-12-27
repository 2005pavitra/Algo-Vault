const express = require('express');
const router = express.Router();
const axios = require('axios');
const User = require('../models/User');
const { verifyToken } = require('../middleware/authMiddleware');

// @route   POST api/leetcode/credentials
// @desc    Save LeetCode credentials for the authenticated user
// @access  Private
console.log("--> LeetCode Routes Loaded");

// Debug middleware for this router
router.use((req, res, next) => {
    console.log(`[LEETCODE_ROUTER] Hit: ${req.method} ${req.url}`);
    next();
});

router.get('/health', (req, res) => {
    res.json({ status: 'LeetCode Router OK' });
});

router.post('/credentials', verifyToken, async (req, res) => {
    // req.user has the structure { user: { id: ..., username: ... }, iat: ..., exp: ... }
    const userId = req.user.user.id;
    console.log(`[LEETCODE_HANDLER] Entered credentials handler. User ID: ${userId}`);
    const { leetcodeUsername, leetcodeSession } = req.body;

    if (!leetcodeUsername) {
        return res.status(400).json({ error: 'Please provide a username' });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            console.log(`[LEETCODE_HANDLER] User not found for ID: ${userId}`);
            return res.status(404).json({ error: 'User not found' });
        }
        console.log(`[LEETCODE_HANDLER] User found: ${user.username}`);

        user.leetcodeUsername = leetcodeUsername;
        if (leetcodeSession) {
            user.leetcodeSession = leetcodeSession;
        }
        await user.save();

        res.json({ message: 'LeetCode credentials saved successfully' });
    } catch (error) {
        console.error('Error saving credentials:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// @route   GET api/leetcode/progress
// @desc    Fetch LeetCode progress using stored credentials
// @access  Private
router.get('/progress', verifyToken, async (req, res) => {
    try {
        const userId = req.user.user.id;
        const user = await User.findById(userId);
        if (!user || !user.leetcodeUsername) {
            return res.status(400).json({ error: 'LeetCode username not found.' });
        }

        const query = `
            query getUserProfile($username: String!) {
                allQuestionsCount {
                    difficulty
                    count
                }
                matchedUser(username: $username) {
                    submitStats {
                        acSubmissionNum {
                            difficulty
                            count
                            submissions
                        }
                    }
                }
            }
        `;

        const headers = {
            'Content-Type': 'application/json',
            'Referer': 'https://leetcode.com',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        };

        if (user.leetcodeSession) {
            headers['Cookie'] = `LEETCODE_SESSION=${user.leetcodeSession}`;
        }

        const response = await axios.post(
            'https://leetcode.com/graphql',
            {
                query,
                variables: { username: user.leetcodeUsername }
            },
            { headers }
        );

        if (response.data.errors) {
            console.error('LeetCode API Errors:', response.data.errors);
            return res.status(400).json({ error: 'Failed to fetch data from LeetCode. Check your credentials.' });
        }

        const data = response.data.data;
        res.json(data);

    } catch (error) {
        console.error('Error fetching LeetCode progress:', error.message);
        res.status(500).json({ error: 'Failed to fetch LeetCode progress' });
    }
});

module.exports = router;
