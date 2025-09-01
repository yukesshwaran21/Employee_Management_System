const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const auditController = require('../controllers/auditController');

// Admin: Get audit logs
router.get('/', protect, authorize('admin', 'super-admin'), auditController.getAuditLogs);

module.exports = router;
