// routes/auth.js
// Define the authentication routes for the API
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateRegisterInput } = require('../validation/auth');

// POST /api/auth/register
router.post('/register', validateRegisterInput, authController.register);

module.exports = router;
