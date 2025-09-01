const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const shiftController = require('../controllers/shiftController');

// Admin: CRUD shifts
router.post('/', protect, authorize('admin', 'super-admin'), shiftController.createShift);
router.get('/', protect, shiftController.getShifts);
router.put('/:id', protect, authorize('admin', 'super-admin'), shiftController.updateShift);
router.delete('/:id', protect, authorize('admin', 'super-admin'), shiftController.deleteShift);

module.exports = router;
