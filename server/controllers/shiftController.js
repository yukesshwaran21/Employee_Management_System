const Shift = require('../models/Shift');

exports.createShift = async (req, res) => {
  const { name, startTime, endTime, isNightShift } = req.body;
  const shift = new Shift({ name, startTime, endTime, isNightShift });
  await shift.save();
  res.status(201).json(shift);
};

exports.getShifts = async (req, res) => {
  const shifts = await Shift.find();
  res.json(shifts);
};

exports.updateShift = async (req, res) => {
  const shift = await Shift.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(shift);
};

exports.deleteShift = async (req, res) => {
  await Shift.findByIdAndDelete(req.params.id);
  res.json({ message: 'Shift deleted' });
};
