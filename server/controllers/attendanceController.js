const Attendance = require('../models/Attendance');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');

exports.clockIn = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0,0,0,0);
    let attendance = await Attendance.findOne({ user: req.user._id, date: today });
    if (attendance && attendance.clockIn) return res.status(400).json({ message: 'Already clocked in' });
    // Detect late/early based on shift
    let isLate = false;
    let isEarly = false;
    let shiftStart = 9; // Default 9 AM
    try {
      if (req.user.shift) {
        const Shift = require('../models/Shift');
        const shift = await Shift.findById(req.user.shift);
        if (shift && shift.startTime) {
          const hour = parseInt(shift.startTime.split(':')[0]);
          if (!isNaN(hour)) shiftStart = hour;
        }
      }
    } catch (err) {
      // Log error but continue with default shiftStart
      console.error('Shift lookup error:', err.message);
    }
    const now = new Date();
    if (now.getHours() > shiftStart) isLate = true;
    if (now.getHours() < shiftStart) isEarly = true;
    // Safely access location
    const location = req.body && req.body.location ? req.body.location : '';
    attendance = new Attendance({
      user: req.user._id,
      date: today,
      clockIn: now,
      ip: req.ip,
      location,
      isLate,
      isEarly,
    });
    await attendance.save();
    await AuditLog.create({ action: `Employee clocked in`, performedBy: req.user._id });
    res.json({ message: 'Clocked in' });
  } catch (err) {
    console.error('ClockIn error:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};

exports.clockOut = async (req, res) => {
  const today = new Date();
  today.setHours(0,0,0,0);
  let attendance = await Attendance.findOne({ user: req.user._id, date: today });
  if (!attendance || !attendance.clockIn) return res.status(400).json({ message: 'Not clocked in' });
  if (attendance.clockOut) return res.status(400).json({ message: 'Already clocked out' });
  attendance.clockOut = new Date();
  const diff = (attendance.clockOut - attendance.clockIn) / (1000 * 60 * 60);
  attendance.totalHours = diff;
  attendance.overtimeHours = diff > 8 ? diff - 8 : 0;
  await attendance.save();
  await AuditLog.create({ action: `Employee clocked out`, performedBy: req.user._id });
  res.json({ message: 'Clocked out', totalHours: attendance.totalHours, overtime: attendance.overtimeHours });
};

exports.getMyAttendance = async (req, res) => {
  const records = await Attendance.find({ user: req.user._id });
  res.json(records);
};

exports.getAttendanceSummary = async (req, res) => {
  const { from, to } = req.query;
  const filter = {};
  if (from && to) {
    filter.date = { $gte: new Date(from), $lte: new Date(to) };
  }
  const summary = await Attendance.aggregate([
    { $match: filter },
    {
      $group: {
        _id: '$user',
        totalDays: { $sum: 1 },
        totalHours: { $sum: '$totalHours' },
        overtime: { $sum: '$overtimeHours' },
      },
    },
  ]);
  res.json(summary);
};
