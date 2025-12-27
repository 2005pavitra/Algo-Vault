const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register Route
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        user = new User({
            username,
            email,
            password: hashedPassword
        });

        await user.save();
        console.log("REGISTER DEBUG: User saved:", user.username, user.email);

        // Create JWT Token
        const payload = {
            user: {
                id: user.id,
                username: user.username
            }
        };
        console.log("REGISTER DEBUG: Payload to sign:", JSON.stringify(payload));

        jwt.sign(
            payload,
            process.env.JWT_SECRET || 'secret_token_123', // Use env in prod
            { expiresIn: '30d' }, // 30 days
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Login Route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid Credentials' });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid Credentials' });
        }

        console.log("LOGIN DEBUG: User found:", user.username, user.email);

        // Create JWT Token
        const payload = {
            user: {
                id: user.id,
                username: user.username
            }
        };

        console.log("LOGIN DEBUG: Payload to sign:", JSON.stringify(payload));

        jwt.sign(
            payload,
            process.env.JWT_SECRET || 'secret_token_123',
            { expiresIn: '30d' },
            (err, token) => {
                if (err) throw err;
                console.log("LOGIN DEBUG: Token generated successfully");
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get User (Verify Token)
router.get('/user', async (req, res) => {
    // Basic middleware embedded for now, or use auth middleware
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_token_123');
        const user = await User.findById(decoded.user.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
});

module.exports = router;
