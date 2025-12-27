const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    code: {
        type: String, // Storing code as string for now
        required: true
    },
    platform: {
        type: String,
        enum: ['LeetCode', 'CodeChef', 'Other'],
        default: 'LeetCode'
    },
    tags: [{
        type: String
    }],
    // Spaced Repetition System Data
    srsData: {
        nextReviewDate: {
            type: Date,
            default: Date.now
        },
        lastReviewed: {
            type: Date,
            default: null
        },
        lastDifficulty: {
            type: String,
            default: null
        },
        interval: {
            type: Number,
            default: 1 // Initial interval in days
        },
        easeFactor: {
            type: Number,
            default: 2.5
        },
        repetitions: {
            type: Number,
            default: 0
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Problem', problemSchema);
