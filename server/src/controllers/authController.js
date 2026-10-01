// controllers/authController.js
import User from '../models/User.js';
// import bcrypt for password hashing
import bcrypt from 'bcrypt';
// import jwt for token generation
import jwt from 'jsonwebtoken';

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

// Controller for handling user login
export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validation check
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required.' });
        }
        // Find the user by username in the database
        const user = await User.findOne({ username: username.toLowerCase().trim() }).select('+password');
        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password.' });
        }
        // Compare the provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid username or password.' });
        }
        // Generate a JWT token for the logged-in user
        const token = jwt.sign(
            { id: user.id || user._id, role: user.role, tokenVersion: user.tokenVersion },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // Token expires in 1 hour
        );

        // Prepare the response object to exclude sensitive information like the password
        return res.status(200).json({
            message: 'User logged in successfully',
            token: token,
            user: {
                id: user.id || user._id,
                username: user.username,
                role: user.role
            }
        });

    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};
