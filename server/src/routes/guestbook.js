// Routes for handling guestbook-related endpoints
import express from 'express';
const router = express.Router();
import { getApprovedEntries } from '../controllers/guestbookController.js';

// GET /api/guestbook - Public access, anyone can call this
router.get('/', getApprovedEntries);

export default router;
