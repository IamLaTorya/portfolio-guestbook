// models/Counter.js
import mongoose from 'mongoose';

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // The name of the sequence (e.g., 'guestbook_id')
  seq: { type: Number, default: 0 }       // The current count
});

export default mongoose.model('Counter', counterSchema);