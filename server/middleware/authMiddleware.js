const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    console.log(`[AUTH] Verifying token for: ${req.originalUrl}`);
    const token = req.header('Authorization');
    if (!token) {
        console.log('[AUTH] No token provided');
        return res.status(401).json({ error: 'Access denied' });
    }

    try {
        const verified = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET || 'secret_token_123');
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json({ error: 'Invalid token' });
    }
};

module.exports = { verifyToken };
