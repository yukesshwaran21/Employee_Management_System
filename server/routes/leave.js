const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const leaveController = require('../controllers/leaveController');

// Employee: Apply for leave
router.post('/apply', protect, authorize('employee'), leaveController.applyLeave);
// Employee: Get own leaves
router.get('/me', protect, authorize('employee'), leaveController.getMyLeaves);
// Admin: Approve/reject leave
router.put('/decide/:id', protect, authorize('admin', 'super-admin'), leaveController.decideLeave);
// Admin: Get all leaves
router.get('/', protect, authorize('admin', 'super-admin'), leaveController.getAllLeaves);

module.exports = router;
