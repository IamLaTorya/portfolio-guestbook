import mongoose from 'mongoose';

const guestbookSchema = new mongoose.Schema({
    //custom id for the entry document
    _id: { type: String, required: true },
    //reference to the user who authored the entry
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    //display name of the entry author
    displayName: { type: String, required: true, maxlength: 50 },
    //content of the entry message
    message: { type: String, required: true, maxlength: 500 },
    //indicates if the entry has been approved for display
    approved: { type: Boolean, default: false },
    //likes counter, starting at 0
    likes: { type: Number, min: 0, default: 0 },
    //array of user IDs who have liked the entry, select false ensures it is never sent to the client
    likedby: { type: [mongoose.Schema.Types.ObjectId], ref: 'User', select: false, default: [] },
},
    //timestamp for when the entry was created
    { timestamps: true, versionKey: false }
);

guestbookSchema.set('toJSON', { 
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => {
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});

export default mongoose.model('Guestbook', guestbookSchema);