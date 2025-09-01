const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const departmentController = require('../controllers/departmentController');

// Admin: CRUD departments
router.post('/', protect, authorize('admin', 'super-admin'), departmentController.createDepartment);
router.get('/', departmentController.getDepartments);
router.put('/:id', protect, authorize('admin', 'super-admin'), departmentController.updateDepartment);
router.delete('/:id', protect, authorize('admin', 'super-admin'), departmentController.deleteDepartment);

module.exports = router;
