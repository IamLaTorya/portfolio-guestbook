import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    // Unique username for logging in
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true, // Ensure the username is always stored in lowercase to avoid case sensitivity issues
        minlength: 3,
        maxlength: 30
    },

    // Hashed password. select: false ensures it is NEVER accidentally leaked in API responses.
    password: {
        type: String,
        required: true,
        select: false
    },

    // Authorization level. 'admin' users can approve guestbook entries.
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    // Track if the user account is active
    isActive: {
        type: Boolean,
        default: true
    },
    // Track the version of the authentication token
    tokenVersion: { type: Number, default: 1 },
    // Optional: Track when the account was created
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('User', userSchema);
