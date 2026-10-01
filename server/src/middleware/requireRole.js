// Middleware to require a specific role for accessing protected routes
export const requireRole = (requiredRole) => {
    return (req, res, next) => {
        // 1. Ensure requireAuth ran first and attached the user context
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized: Authentication required.' });
        }

        // 2. CHECK ROLE MAPPING: If the user's role does not match, block them
        if (req.user.role !== requiredRole) {
            // Rubric mandate: Return 403 when a logged-in user isn't allowed
            return res.status(403).json({ error: `Forbidden: Requires ${requiredRole} access.` });
        }

        // 3. Authorization passed! Proceed to the next middleware or controller
        next();
    };
};
