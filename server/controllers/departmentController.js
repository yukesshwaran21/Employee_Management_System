const Department = require('../models/Department');

exports.createDepartment = async (req, res) => {
  const { name, description } = req.body;
  const dept = new Department({ name, description });
  await dept.save();
  res.status(201).json(dept);
};

exports.getDepartments = async (req, res) => {
  const depts = await Department.find();
  res.json(depts);
};

exports.updateDepartment = async (req, res) => {
  const dept = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(dept);
};

exports.deleteDepartment = async (req, res) => {
  await Department.findByIdAndDelete(req.params.id);
  res.json({ message: 'Department deleted' });
};
