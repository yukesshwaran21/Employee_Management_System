const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const authController = require('../controllers/authController');

// Register
router.post('/register', authController.register);
// Login
router.post('/login', authController.login);
// Email verification
router.get('/verify/:token', authController.verifyEmail);
// Get current user
router.get('/me', protect, authController.getMe);

module.exports = router;
