const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, department, designation } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });
    user = new User({ name, email, password, phone, department, designation });
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
    res.status(500).json({ message: err.message });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(400).json({ message: 'Invalid token' });
    if (user.status !== 'pending') return res.status(400).json({ message: 'Already verified' });
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
