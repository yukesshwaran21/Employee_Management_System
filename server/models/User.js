const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  password: { type: String, required: true },
  role: { type: String, enum: ['employee', 'admin', 'super-admin'], default: 'employee' },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  designation: { type: String },
  status: { type: String, enum: ['pending', 'active', 'inactive', 'rejected'], default: 'pending' },
  isEmailVerified: { type: Boolean, default: false },
  profilePhoto: { type: String },
  leaveBalance: {
    casual: { type: Number, default: 12 },
    sick: { type: Number, default: 8 },
    earned: { type: Number, default: 10 },
  },
  baseSalary: { type: Number, default: 0 },
  shift: { type: mongoose.Schema.Types.ObjectId, ref: 'Shift' },
  isActive: { type: Boolean, default: true }, // for soft delete
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
