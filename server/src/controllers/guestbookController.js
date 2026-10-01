// Controller for handling guestbook-related routes
import Guestbook from '../models/Guestbook.js';

// GET /api/guestbook (approved entries only)
export const getApprovedEntries = async (req, res) => {
    try {
        // Query MongoDB strictly for approved entries, sorted from newest to oldest
        const entries = await Guestbook.find({ approved: true })
            .populate('author', 'username')
            .sort({ createdAt: -1 });

        // When res.json is called, your schema's toJSON transform automatically:
        // 1. Converts _id to id
        // 2. Removes __v and hidden arrays like likedBy
        return res.status(200).json(entries);

    } catch (err) {
        return res.status(500).json({ error: 'Failed to retrieve guestbook entries.' });
    }
};
