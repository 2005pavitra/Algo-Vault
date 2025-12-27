const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String, // Hashed password
        required: true,
        minlength: 6
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    leetcodeSession: {
        type: String,
        required: false
    },
    leetcodeUsername: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('User', userSchema);
