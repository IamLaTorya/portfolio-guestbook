// Middleware for generating a custom guestbook ID
import Counter from '../models/Counter.js';
// This middleware generates a unique guestbook ID using a counter document in MongoDB.
export const generateGuestbookId = async (req, res, next) => {
    try {
        // Atomically find and increment the guestbook sequence
        const counter = await Counter.findOneAndUpdate(
            { _id: 'guestbook_id' },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );

        // Pad the sequence to a 4-digit string (e.g., 7 -> "0007")
        const paddedSequence = String(counter.seq).padStart(4, '0');

        // Attach the custom string ID to req.body so the controller can read it
        req.body._id = `GB-${paddedSequence}`;

        next();
    } catch (err) {
        return res.status(500).json({ error: 'Failed to generate custom ID.' });
    }
};
