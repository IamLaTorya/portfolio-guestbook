import mongoose from 'mongoose';

const guestbookSchema = new mongoose.Schema({
    //custom id for the entry document
    _id: { type: String, required: true },
    //reference to the user who authored the entry
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    //display name of the entry author
    displayName: { type: String, required: true, maxlength: 50, trim: true },
    //content of the entry message
    message: { type: String, required: true, maxlength: 500, trim: true },
    //indicates if the entry has been approved for display
    approved: { type: Boolean, default: false },
    //likes counter, starting at 0
    likes: { type: Number, min: 0, default: 0 },
    //array of user IDs who have liked the entry, select false ensures it is never sent to the client
    likedBy: { type: [mongoose.Schema.Types.ObjectId], ref: 'User', select: false, default: [] },
},
    //timestamp for when the entry was created
    { timestamps: true, versionKey: false }
);
// Custom JSON and object transformation for the guestbook schema. It automatically converts _id to id, removes __v and likedby fields for security reasons.
guestbookSchema.set('toJSON', { 
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => {
        ret.id = ret._id;    // Convert _id to id for client-side usage
        delete ret._id;      // Remove the original _id field
        delete ret.__v;      // Remove the version key
        delete ret.likedBy;  // Security: remove sensitive data from responses
        return ret;
    }
});
guestbookSchema.set('toObject', { virtuals: true});

export default mongoose.model('Guestbook', guestbookSchema);