const mongoose = require('mongoose');

const ShiftSchema = new mongoose.Schema({
  name: { type: String, required: true },
  startTime: { type: String, required: true }, // e.g., '09:00'
  endTime: { type: String, required: true },   // e.g., '17:00'
  isNightShift: { type: Boolean, default: false },
});

module.exports = mongoose.model('Shift', ShiftSchema);
