const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const attendanceController = require('../controllers/attendanceController');

// Employee: Clock in
router.post('/clockin', protect, authorize('employee'), attendanceController.clockIn);
// Employee: Clock out
router.post('/clockout', protect, authorize('employee'), attendanceController.clockOut);
// Employee: Get own attendance
router.get('/me', protect, authorize('employee'), attendanceController.getMyAttendance);
// Admin: Get attendance summary
router.get('/summary', protect, authorize('admin', 'super-admin'), attendanceController.getAttendanceSummary);

module.exports = router;
