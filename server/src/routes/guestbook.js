// Routes for handling guestbook-related endpoints
import express from 'express';
const router = express.Router();

import { getApprovedEntries, createEntry, getPendingEntries, approveEntry, likeEntry, deleteEntry } from '../controllers/guestbookController.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireRole } from '../middleware/requireRole.js';
import { generateGuestbookId } from '../middleware/generateId.js';
import { validateGuestbookInput } from '../validation/guestbookValidation.js';

// GET /api/guestbook - Public access, anyone can call this
router.get('/', getApprovedEntries);

// GET /api/guestbook/pending - Admin Only
router.get('/pending', requireAuth, requireRole('admin'), getPendingEntries);

// POST /api/guestbook - Requires authentication and generates a custom ID
router.post('/', requireAuth, validateGuestbookInput, generateGuestbookId, createEntry);

// POST /api/guestbook/:id/like - Authenticated Users Only
router.post('/:id/like', requireAuth, likeEntry);

// PATCH /api/guestbook/:id/approve - Admin Only
router.patch('/:id/approve', requireAuth, requireRole('admin'), approveEntry);

// DELETE /api/guestbook/:id - Admin Only
router.delete('/:id', requireAuth, requireRole('admin'), deleteEntry);

export default router;
