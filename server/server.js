
require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:3000', 'https://employee-management-system-y69g.onrender.com'],
  credentials: true
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
});
app.use(limiter);

// Ensure CORS headers for all API routes (including preflight)
app.options('/api/*', cors({
  origin: ['http://localhost:3000', 'https://employee-management-system-y69g.onrender.com'],
  credentials: true
}));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/employees', require('./routes/employee'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/payroll', require('./routes/payroll'));
app.use('/api/leave', require('./routes/leave'));
app.use('/api/department', require('./routes/department'));
app.use('/api/shift', require('./routes/shift'));
app.use('/api/audit', require('./routes/audit'));
app.use('/api/notification', require('./routes/notification'));

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.message || err);
  res.status(500).json({ message: 'Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
