const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const employeeController = require('../controllers/employeeController');

// Admin: Get all employees
router.get('/', protect, authorize('admin', 'super-admin'), employeeController.getAllEmployees);
// Admin: Approve/reject employee
router.put('/approve/:id', protect, authorize('admin', 'super-admin'), employeeController.approveEmployee);
// Admin: Deactivate employee
router.put('/deactivate/:id', protect, authorize('admin', 'super-admin'), employeeController.deactivateEmployee);
// Employee: Get own profile
router.get('/me', protect, employeeController.getMyProfile);
// Employee: Update own profile
router.put('/me', protect, employeeController.updateMyProfile);
// Admin: Edit any employee
router.put('/:id', protect, authorize('admin', 'super-admin'), employeeController.updateEmployee);
// Admin: Create sub-admin
router.post('/subadmin', protect, authorize('super-admin'), employeeController.createSubAdmin);

module.exports = router;
