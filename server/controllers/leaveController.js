// Get calendar data for team availability
exports.getCalendar = async (req, res) => {
  const leaves = await Leave.find({ status: 'approved' }).populate('user');
  const calendar = leaves.map(l => ({
    user: l.user.name,
    type: l.type,
    from: l.from,
    to: l.to,
    days: l.days
  }));
  res.json(calendar);
};
const Leave = require('../models/Leave');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const AuditLog = require('../models/AuditLog');

exports.applyLeave = async (req, res) => {
  const { type, from, to, reason } = req.body;
  const days = (new Date(to) - new Date(from)) / (1000 * 60 * 60 * 24) + 1;
  const leave = new Leave({
    user: req.user._id,
    type,
    from,
    to,
    days,
    reason,
  });
  await leave.save();
  res.json({ message: 'Leave applied' });
};

exports.getMyLeaves = async (req, res) => {
  const leaves = await Leave.find({ user: req.user._id });
  res.json(leaves);
};

exports.decideLeave = async (req, res) => {
  const { status, adminComment } = req.body;
  const leave = await Leave.findById(req.params.id).populate('user');
  if (!leave) return res.status(404).json({ message: 'Leave not found' });
  leave.status = status;
  leave.adminComment = adminComment;
  leave.decidedAt = new Date();
  await leave.save();
  if (status === 'approved') {
    // Deduct leave balance
    const user = await User.findById(leave.user._id);
    user.leaveBalance[leave.type] -= leave.days;
    await user.save();
    await sendEmail(user.email, 'Leave Approved', `<p>Your leave is approved.</p>`);
  } else {
    await sendEmail(leave.user.email, 'Leave Rejected', `<p>Your leave is rejected.</p>`);
  }
  await AuditLog.create({ action: `Leave ${status} for ${leave.user.name}`, performedBy: req.user._id });
  res.json({ message: `Leave ${status}` });
};

exports.getAllLeaves = async (req, res) => {
  const leaves = await Leave.find().populate('user');
  res.json(leaves);
};
