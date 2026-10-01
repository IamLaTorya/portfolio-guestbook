// routes/auth.js
// Define the authentication routes for the API
import express from 'express';
const router = express.Router();
import { register, login } from '../controllers/authController.js';
import { validateRegisterInput } from '../validation/auth.js';

// POST /api/auth/register
router.post('/register', validateRegisterInput, register);
// POST /api/auth/login
router.post('/login', login);

export default router;