const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  clockIn: { type: Date },
  clockOut: { type: Date },
  totalHours: { type: Number, default: 0 },
  overtimeHours: { type: Number, default: 0 },
  ip: { type: String },
  location: { type: String },
  isLate: { type: Boolean, default: false },
  isEarly: { type: Boolean, default: false },
});

AttendanceSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', AttendanceSchema);
