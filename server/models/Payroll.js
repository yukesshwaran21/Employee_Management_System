const mongoose = require('mongoose');

const PayrollSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  month: { type: String, required: true }, // e.g., '2025-09'
  baseSalary: { type: Number, required: true },
  overtimeHours: { type: Number, default: 0 },
  overtimeRate: { type: Number, default: 1.5 },
  bonus: { type: Number, default: 0 },
  totalSalary: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'released'], default: 'pending' },
  payslip: { type: String }, // PDF file path or URL
  releasedAt: { type: Date },
});

PayrollSchema.index({ user: 1, month: 1 }, { unique: true });

module.exports = mongoose.model('Payroll', PayrollSchema);
