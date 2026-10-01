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

// POST /api/guestbook (create a new entry)
export const createEntry = async (req, res) => {
    try {
        const { _id, displayName, message } = req.body;

        // Create the entry using fields explicitly defined (ignoring fake req.body.approved hacks)
        const newEntry = new Guestbook({
            _id: _id,                    // Populated safely by your generateGuestbookId middleware
            author: req.user.id,         // Populated securely by your requireAuth middleware
            displayName: displayName,
            message: message
            // approved, likes, and likedBy fall back to schema defaults automatically
        });

        const savedEntry = await newEntry.save();
        return res.status(201).json(savedEntry);

    } catch (err) {
        // Return 409 for duplicate keys (Mongoose error code 11000)
        if (err.code === 11000) {
            return res.status(409).json({ error: 'Conflict: Duplicate ID generated.' });
        }
        // Return 400 for structural schema validation failures
        return res.status(400).json({ error: err.message });
    }
};

// GET /api/guestbook/pending (Admin Only)
export const getPendingEntries = async (req, res) => {
    try {
        // Query MongoDB strictly for unapproved entries, sorted from newest to oldest
        const pendingEntries = await Guestbook.find({ approved: false })
            .populate('author', 'username')
            .sort({ createdAt: -1 });

        // Your working toJSON transform will automatically strip likedBy from these as well!
        return res.status(200).json(pendingEntries);
    } catch (err) {
        return res.status(500).json({ error: 'Failed to retrieve pending entries.' });
    }
};

// PATCH /api/guestbook/:id/approve (Admin Only)
export const approveEntry = async (req, res) => {
    try {
        const { id } = req.params;

        // Find entry and update approved to true
        // { new: true } returns the updated document instead of the old one
        const updatedEntry = await Guestbook.findByIdAndUpdate(
            id,
            { approved: true },
            { new: true }
        ).populate('author', 'username');

        // If no entry exists with that custom string ID (e.g., GB-9999), return 404
        if (!updatedEntry) {
            return res.status(404).json({ error: 'Guestbook entry not found.' });
        }

        return res.status(200).json(updatedEntry);
    } catch (err) {
        return res.status(500).json({ error: 'Failed to approve guestbook entry.' });
    }
};

