const AuditLog = require('../models/AuditLog');

exports.getAuditLogs = async (req, res) => {
  const logs = await AuditLog.find().populate('performedBy', 'name email');
  res.json(logs);
};
