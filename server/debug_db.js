const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Problem = require('./models/Problem');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/algovault';

mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log('Connected to MongoDB');

        // Count total problems
        const total = await Problem.countDocuments();
        console.log(`Total Problems: ${total}`);

        // Get distinct platforms
        const platforms = await Problem.distinct('platform');
        console.log('Distinct Platforms:', platforms);

        // Check a few sample documents
        const samples = await Problem.find().limit(5).select('title platform');
        console.log('Sample Docs:', samples);

        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
