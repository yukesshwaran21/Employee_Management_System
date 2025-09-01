// This script creates a super-admin user for the Employee Management System
const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function createSuperAdmin() {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const existing = await User.findOne({ email: 'admin@ems.com' });
  if (existing) {
    console.log('Super-admin already exists.');
    mongoose.disconnect();
    return;
  }

  const admin = new User({
    name: 'Super Admin',
    email: 'admin@ems.com',
    password: 'admin123', // Change after first login
    role: 'super-admin',
    status: 'active',
  });
  await admin.save();
  console.log('Super-admin created: admin@ems.com / admin123');
  mongoose.disconnect();
}

createSuperAdmin();
