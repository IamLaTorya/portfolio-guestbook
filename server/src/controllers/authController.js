// controllers/authController.js
const User = require('../models/User');
// Controller for handling user registration
exports.register = async (req, res) => {
    try {
        // Extract username and password from the request body
        const { username, password } = req.body;
        // Create a new User instance with the provided username and password
        const newAccount = new User({
            username: username.toLowerCase().trim(),
            password: password // Hashing will be added in Commit 12
            // role defaults to 'user', isActive defaults to true, tokenVersion defaults to 1
        });
        // Save the new user to the database
        const savedUser = await newAccount.save();

        // Convert to JSON object to remove internal password fields if handled by schema transforms
        const userResponse = savedUser.toJSON();
        // Prepare the response object to exclude sensitive information like the password
        return res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: userResponse.id || userResponse._id,
                username: userResponse.username,
                role: userResponse.role
            }
        });

    } catch (err) {
        // Catch duplicate username (MongoDB error code 11000)
        if (err.code === 11000) {
            return res.status(409).json({ error: 'Username is already taken.' });
        }
        return res.status(400).json({ error: err.message });
    }
};
