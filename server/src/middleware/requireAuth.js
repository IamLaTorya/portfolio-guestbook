import jwt from 'jsonwebtoken';
import User from '../models/User.js';
// Middleware to require authentication for protected routes
export const requireAuth = async (req, res, next) => {
    try {
        // 1. Get the Authorization header (Format: Bearer <token>)
        const authHeader = req.headers.authorization;
        // Check if the Authorization header exists and starts with 'Bearer '
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Unauthorized: No token provided.' });
        }

        // 2. Extract the actual token string
        const token = authHeader.split(' ')[1];

        // 3. Verify the token using your secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 4. Load the user from the database to run security checks
        const user = await User.findById(decoded.id);

        // 5. Run safety validations: User must exist, be active, and token versions must match
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized: User no longer exists.' });
        }
        // Check if the user is active
        if (!user.isActive) {
            return res.status(401).json({ error: 'Unauthorized: This account has been deactivated.' });
        }
        // Check if the token version in the database matches the one in the decoded token
        if (user.tokenVersion !== decoded.tokenVersion) {
            return res.status(401).json({ error: 'Unauthorized: Token is no longer valid.' });
        }

        // 6. Security checks passed! Attach the user object to the request context
        req.user = user;
        next();

    } catch (err) {
        // Catch expired or tampered tokens and safely return a 401
        return res.status(401).json({ error: 'Unauthorized: Invalid or expired token.' });
    }
};
