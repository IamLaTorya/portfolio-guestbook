// Routes for handling guestbook-related endpoints
import express from 'express';
const router = express.Router();

import { getApprovedEntries, createEntry } from '../controllers/guestbookController.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { generateGuestbookId } from '../middleware/generateId.js';

// GET /api/guestbook - Public access, anyone can call this
router.get('/', getApprovedEntries);

// POST /api/guestbook - Requires authentication and generates a custom ID
router.post('/', requireAuth, generateGuestbookId, createEntry);

export default router;
