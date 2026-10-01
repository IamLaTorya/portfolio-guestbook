// routes/auth.js
// Define the authentication routes for the API
import express from 'express';
const router = express.Router();
import { register } from '../controllers/authController.js';
import { validateRegisterInput } from '../validation/auth.js';

// POST /api/auth/register
router.post('/register', validateRegisterInput, register);

export default router;