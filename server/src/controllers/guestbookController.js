// Controller for handling guestbook-related routes
import Guestbook from '../models/Guestbook.js';
import { createEntrySchema } from '../validation/guestbookValidation.js';
// GET /api/guestbook (approved entries only)
export const getApprovedEntries = async (req, res) => {
    try {
        // Query MongoDB strictly for approved entries, sorted from newest to oldest
        const entries = await Guestbook.find({ approved: true })
            .populate({ path: 'author', select: 'username' })
            .sort({ createdAt: -1 });

        // When res.json is called, your schema's toJSON transform automatically:
        // 1. Converts _id to id
        // 2. Removes __v and hidden arrays like likedBy
        return res.status(200).json(entries);

    } catch (err) {
        console.error('Error retrieving guestbook entries:', err);
        return res.status(500).json({ error: 'Failed to retrieve guestbook entries.' });
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

// POST /api/guestbook (create a new entry)
export const createEntry = async (req, res, next) => {
    try {// Validate and create a new guestbook entry
        const validatedData = createEntrySchema.parse(req.body);
        
        const customId = req.body._id;
        // Create the entry using fields explicitly defined (ignoring fake req.body.approved hacks)
        const newEntry = new Guestbook({
            _id: customId,
            author: req.user.id,         // Populated securely by your requireAuth middleware
            displayName: validatedData.displayName,
            message: validatedData.message
            // approved, likes, and likedBy fall back to schema defaults automatically
        });

        const savedEntry = await newEntry.save();
        return res.status(201).json(savedEntry);

    } catch (err) {
        // Handle Zod validation errors
        next(err);
    }
};

// POST /api/guestbook/:id/like (Authenticated Users Only)
export const likeEntry = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        // Find the guestbook entry
        const entry = await Guestbook.findById(id).select('+likedBy');
        if (!entry) {
            return res.status(404).json({ error: 'Guestbook entry not found.' });
        }

        //Safely check if the string user ID exists in the ObjectId array
        const hasLiked = entry.likedBy.some(uid => uid.toString() === userId.toString());

        // Add the user's ID to the likedBy array if not already present
        if (!hasLiked) {
            entry.likedBy.push(userId);
            entry.likes += 1; // Increment the likes count when a user likes the entry
            await entry.save();
        } else {
            //a 400 error response for duplicates
            return res.status(400).json({ error: 'You have already liked this entry.' });
        }

        // Return the updated entry with the likedBy field included 
        return res.status(200).json(entry);
    } catch (err) {
        console.error('Error liking guestbook entry:', err);
        return res.status(500).json({ error: 'Failed to like guestbook entry.' });
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

// DELETE /api/guestbook/:id (Admin Only)
export const deleteEntry = async (req, res) => {
    try {// Delete a guestbook entry by its custom ID
        const { id } = req.params;
        // Attempt to find and delete the entry by its custom ID
        const deletedEntry = await Guestbook.findByIdAndDelete(id);
        // If no entry was found and deleted, return 404
        if (!deletedEntry) {
            return res.status(404).json({ error: 'Guestbook entry not found.' });
        }
        // Return 200 with a success message if the entry was successfully deleted
        return res.status(200).json({ message: 'Guestbook entry deleted successfully.' });
    } catch (err) {
        // Log the error for debugging purposes
        console.error('Error deleting guestbook entry:', err);
        return res.status(500).json({ error: 'Failed to delete guestbook entry.' });
    }
};