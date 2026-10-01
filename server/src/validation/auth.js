// validation/auth.js
export const validateRegisterInput = (req, res, next) => {
    // Validate the registration input
    const { username, password } = req.body;
    // Validate username and password input
    if (!username || typeof username !== 'string' || username.trim().length < 3 || username.trim().length > 30) {
        // If the username is invalid, return an error response immediately
        return res.status(400).json({ error: 'Username must be between 3 and 30 characters.' });
    }
    // Validate password input
    if (!password || typeof password !== 'string' || password.length < 6) {
        // If the password is invalid, return an error response immediately
        return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }
    // If both username and password are valid, proceed to the next middleware
    next();
};