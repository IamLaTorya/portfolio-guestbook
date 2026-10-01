// controllers/authController.js
import User from '../models/User.js';
// import bcrypt for password hashing
import bcrypt from 'bcrypt';

// Controller for handling user registration
export const register = async (req, res) => {
    try {
        // Extract username and password from the request body
        const { username, password } = req.body;
        // Hash the password before saving it to the database
        const hashedPassword = await bcrypt.hash(password, 12);
        // Create a new User instance with the provided username and password
        const newAccount = new User({
            username: username.toLowerCase().trim(),
            password: hashedPassword // Hashing will now be applied before saving to the database
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
