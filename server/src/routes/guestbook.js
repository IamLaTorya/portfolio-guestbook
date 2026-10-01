// Routes for handling guestbook-related endpoints
import express from 'express';
const router = express.Router();

import { getApprovedEntries, createEntry, getPendingEntries, approveEntry } from '../controllers/guestbookController.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireRole } from '../middleware/requireRole.js';
import { generateGuestbookId } from '../middleware/generateId.js';

// GET /api/guestbook - Public access, anyone can call this
router.get('/', getApprovedEntries);

// POST /api/guestbook - Requires authentication and generates a custom ID
router.post('/', requireAuth, generateGuestbookId, createEntry);

// GET /api/guestbook/pending - Admin Only
router.get('/pending', requireAuth, requireRole('admin'), getPendingEntries);

// PATCH /api/guestbook/:id/approve - Admin Only
router.patch('/:id/approve', requireAuth, requireRole('admin'), approveEntry);

// GET /api/guestbook/pending - Admin Only (duplicate comment removed)
export default router;
