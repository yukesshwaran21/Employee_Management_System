const Payroll = require('../models/Payroll');
const Attendance = require('../models/Attendance');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const sendSMS = require('../utils/sendSMS');
const PDFDocument = require('pdfkit');
const fs = require('fs');
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
    // Bonus for punctuality: e.g., if no late arrivals in month
    let bonus = 0;
    const punctualDays = attendances.filter(a => a.clockIn && a.clockIn.getHours() <= 9).length;
    if (punctualDays >= attendances.length * 0.9) bonus += 1000; // Example bonus
    // Performance bonus placeholder (can be expanded)
    // Calculate total salary
    const totalSalary = user.baseSalary + overtime * (overtimeRate || 1.5) * (user.baseSalary / 160) + bonus;
    // Generate payslip PDF
    const doc = new PDFDocument();
    const payslipPath = `./payslips/${user._id}_${month}.pdf`;
    doc.pipe(fs.createWriteStream(payslipPath));
    doc.fontSize(20).text('Salary Payslip', { align: 'center' });
    doc.fontSize(12).text(`Employee: ${user.name}`);
    doc.text(`Month: ${month}`);
    doc.text(`Base Salary: ${user.baseSalary}`);
    doc.text(`Overtime Hours: ${overtime}`);
    doc.text(`Overtime Rate: ${overtimeRate || 1.5}`);
    doc.text(`Bonus: ${bonus}`);
    doc.text(`Total Salary: ${totalSalary}`);
    doc.end();
    await Payroll.findOneAndUpdate(
      { user: user._id, month },
      {
        user: user._id,
        month,
        baseSalary: user.baseSalary,
        overtimeHours: overtime,
        overtimeRate: overtimeRate || 1.5,
        bonus,
        totalSalary,
        status: 'pending',
        payslip: payslipPath,
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
  if (payroll.user.phone) {
    await sendSMS(payroll.user.phone, `Your salary for ${payroll.month} has been released. Total: ${payroll.totalSalary}`);
  }
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
