const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, department, designation, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User with this email already exists.' });
    // Enforce only one super-admin
    if (role === 'super-admin') {
      const superAdminExists = await User.findOne({ role: 'super-admin' });
      if (superAdminExists) return res.status(403).json({ message: 'Super-admin already exists.' });
    }
    user = new User({ name, email, password, phone, department, designation, role });
    await user.save();
    // Email verification token
    const verifyToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    const verifyUrl = `${process.env.CLIENT_URL}/verify/${verifyToken}`;
    await sendEmail(
      user.email,
      'Verify your email',
      `<p>Please verify your email by clicking <a href="${verifyUrl}">here</a>.</p>`
    );
    res.status(201).json({ message: 'Registration successful. Please verify your email.' });
  } catch (err) {
    // Handle duplicate key error (MongoDB)
    if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
      return res.status(400).json({ message: 'Email already registered.' });
    }
    // Validation errors
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: 'Internal server error. Please try again later.' });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
  if (!user) return res.status(400).json({ message: 'Invalid token' });
  if (user.isEmailVerified) return res.status(400).json({ message: 'Already verified' });
  user.isEmailVerified = true;
  user.status = 'pending'; // Still needs admin approval
  await user.save();
  res.json({ message: 'Email verified. Awaiting admin approval.' });
  } catch (err) {
    res.status(400).json({ message: 'Invalid or expired token' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    if (user.status !== 'active') return res.status(403).json({ message: 'Account not active' });
    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    const token = generateToken(user._id, user.role);
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMe = async (req, res) => {
  res.json(req.user);
};
