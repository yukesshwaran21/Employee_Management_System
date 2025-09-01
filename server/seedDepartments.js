// Demo department data for seeding
const mongoose = require('mongoose');
const Department = require('./models/Department');
require('dotenv').config();

const departments = [
  { name: 'Admin', description: 'Administration' },
  { name: 'HR', description: 'Human Resources' },
  { name: 'Engineering', description: 'Engineering Department' },
  { name: 'Sales', description: 'Sales and Marketing' },
  { name: 'Finance', description: 'Finance and Accounts' },
];

async function seedDepartments() {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await Department.deleteMany({});
  await Department.insertMany(departments);
  console.log('Demo departments seeded');
  mongoose.disconnect();
}

seedDepartments();
