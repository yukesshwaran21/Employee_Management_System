const Notification = require('../models/Notification');
const sendEmail = require('./sendEmail');
const sendSMS = require('./sendSMS');
const User = require('../models/User');

/**
 * Create a notification for a user
 */
const createNotification = async ({ userId, type, message }) => {
  await Notification.create({ user: userId, type, message });
};

/**
 * Send notification to user (DB, email, SMS)
 */
const notifyUser = async ({ userId, type, message, email, phone }) => {
  // DB notification
  await createNotification({ userId, type, message });

  // Email
  if (email) {
    await sendEmail(email, `Notification: ${type}`, `<p>${message}</p>`);
  }

  // SMS
  if (phone) {
    await sendSMS(phone, message);
  }
};

/**
 * Notify all admins
 */
const notifyAdmins = async ({ type, message }) => {
  const admins = await User.find({ role: { $in: ['admin', 'super-admin'] } });
  for (const admin of admins) {
    await createNotification({ userId: admin._id, type, message });
    if (admin.email) {
      await sendEmail(admin.email, `Admin Notification: ${type}`, `<p>${message}</p>`);
    }
    if (admin.phone) {
      await sendSMS(admin.phone, message);
    }
  }
};

module.exports = {
  createNotification,
  notifyUser,
  notifyAdmins,
};
