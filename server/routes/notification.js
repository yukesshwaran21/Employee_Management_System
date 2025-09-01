const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const notificationController = require('../controllers/notificationController');

// Get notifications
router.get('/', protect, notificationController.getNotifications);
// Mark as read
router.put('/read/:id', protect, notificationController.markAsRead);

module.exports = router;
