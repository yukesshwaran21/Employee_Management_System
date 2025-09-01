const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const payrollController = require('../controllers/payrollController');

// Admin: Generate payroll
router.post('/generate', protect, authorize('admin', 'super-admin'), payrollController.generatePayroll);
// Admin: Release payroll
router.put('/release/:id', protect, authorize('admin', 'super-admin'), payrollController.releasePayroll);
// Admin: Get payrolls
router.get('/', protect, authorize('admin', 'super-admin'), payrollController.getAllPayrolls);
// Employee: Get own payrolls
router.get('/me', protect, authorize('employee'), payrollController.getMyPayrolls);

module.exports = router;
