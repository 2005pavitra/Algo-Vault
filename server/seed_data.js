const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Problem = require('./models/Problem');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/algovault';

mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log('Connected to MongoDB');

        // Check for existing CodeChef problem
        const existing = await Problem.findOne({ platform: 'CodeChef' });
        if (existing) {
            console.log('CodeChef problem already exists:', existing.title);
        } else {
            const newProblem = new Problem({
                title: 'Test CodeChef Problem',
                code: 'import java.util.*; class CodeChef { }',
                platform: 'CodeChef',
                tags: ['test', 'array'],
                srsData: {
                    nextReviewDate: new Date() // Due now
                }
            });
            await newProblem.save();
            console.log('Created dummy CodeChef problem');
        }

        // Check for existing LeetCode problem
        const existingLC = await Problem.findOne({ platform: 'LeetCode' });
        if (!existingLC) {
            const newLC = new Problem({
                title: 'Test LeetCode Problem',
                code: 'class Solution { }',
                platform: 'LeetCode',
                tags: ['test'],
                srsData: {
                    nextReviewDate: new Date() // Due now
                }
            });
            await newLC.save();
            console.log('Created dummy LeetCode problem');
        }

        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
