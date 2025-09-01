// Get employees by designation
exports.getByDesignation = async (req, res) => {
  const { designation } = req.query;
  const employees = await User.find({ designation });
  res.json(employees);
};
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const AuditLog = require('../models/AuditLog');

exports.getAllEmployees = async (req, res) => {
  const employees = await User.find({ role: 'employee' });
  res.json(employees);
};

exports.approveEmployee = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  user.status = 'active';
  await user.save();
  await sendEmail(user.email, 'Account Approved', '<p>Your account is approved. You can now login.</p>');
  await AuditLog.create({ action: `Admin approved employee ${user.name}`, performedBy: req.user._id });
  res.json({ message: 'Employee approved' });
};

exports.deactivateEmployee = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  user.isActive = false;
  await user.save();
  await AuditLog.create({ action: `Admin deactivated employee ${user.name}`, performedBy: req.user._id });
  res.json({ message: 'Employee deactivated (soft delete)' });
};

exports.getMyProfile = async (req, res) => {
  res.json(req.user);
};

exports.updateMyProfile = async (req, res) => {
  const updates = req.body;
  delete updates.role;
  delete updates.status;
  const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
  res.json(user);
};

exports.updateEmployee = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(user);
};

exports.createSubAdmin = async (req, res) => {
  const { name, email, password } = req.body;
  let user = await User.findOne({ email });
  if (user) return res.status(400).json({ message: 'User already exists' });
  user = new User({ name, email, password, role: 'admin', status: 'active' });
  await user.save();
  res.status(201).json({ message: 'Sub-admin created' });
};
