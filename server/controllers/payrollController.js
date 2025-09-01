const Payroll = require('../models/Payroll');
const Attendance = require('../models/Attendance');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const AuditLog = require('../models/AuditLog');

exports.generatePayroll = async (req, res) => {
  const { month, overtimeRate } = req.body; // month: '2025-09'
  const users = await User.find({ role: 'employee', status: 'active' });
  for (const user of users) {
    const attendances = await Attendance.find({
      user: user._id,
      date: {
        $gte: new Date(`${month}-01`),
        $lte: new Date(`${month}-31`),
      },
    });
    const overtime = attendances.reduce((sum, a) => sum + (a.overtimeHours || 0), 0);
    const totalSalary = user.baseSalary + overtime * (overtimeRate || 1.5) * (user.baseSalary / 160); // Assuming 160 hours/month
    await Payroll.findOneAndUpdate(
      { user: user._id, month },
      {
        user: user._id,
        month,
        baseSalary: user.baseSalary,
        overtimeHours: overtime,
        overtimeRate: overtimeRate || 1.5,
        totalSalary,
        status: 'pending',
      },
      { upsert: true }
    );
  }
  await AuditLog.create({ action: `Payroll generated for ${month}`, performedBy: req.user._id });
  res.json({ message: 'Payroll generated' });
};

exports.releasePayroll = async (req, res) => {
  const payroll = await Payroll.findById(req.params.id).populate('user');
  if (!payroll) return res.status(404).json({ message: 'Payroll not found' });
  payroll.status = 'released';
  payroll.releasedAt = new Date();
  await payroll.save();
  await sendEmail(
    payroll.user.email,
    'Payroll Released',
    `<p>Your salary for ${payroll.month} has been released. Total: ${payroll.totalSalary}</p>`
  );
  await AuditLog.create({ action: `Salary released for ${payroll.user.name} (${payroll.month})`, performedBy: req.user._id });
  res.json({ message: 'Payroll released' });
};

exports.getAllPayrolls = async (req, res) => {
  const payrolls = await Payroll.find().populate('user');
  res.json(payrolls);
};

exports.getMyPayrolls = async (req, res) => {
  const payrolls = await Payroll.find({ user: req.user._id });
  res.json(payrolls);
};
