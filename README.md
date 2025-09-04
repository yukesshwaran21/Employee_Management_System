# Employee Management System

A full-stack web application for managing employees, attendance, payroll, leaves, departments, and more. Built with React (frontend) and Node.js/Express/MongoDB (backend).

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Core Modules](#core-modules)
- [API Endpoints](#api-endpoints)
- [Frontend Overview](#frontend-overview)
- [Backend Overview](#backend-overview)
- [Contributing](#contributing)
- [License](#license)

---

## Features
- **User Authentication**: Register, login, JWT-based auth, email verification.
- **Role Management**: Employee, Admin, Super Admin roles.
- **Employee Directory**: List, add, update, and manage employees.
- **Attendance Tracking**: Clock-in/out, daily attendance, overtime, late/early detection.
- **Leave Management**: Apply, approve/reject, track leave balances.
- **Payroll Management**: Salary calculation, payslip generation, payroll status.
- **Department & Shift Management**: Organize employees by department and shift.
- **Notifications**: In-app notifications for approvals, payroll, etc.
- **Audit Logs**: Track admin actions for security and compliance.
- **Admin Dashboard**: Advanced controls for HR/admins.
- **Reports & Analytics**: Export data, view trends.
- **Responsive UI**: Modern, user-friendly interface.

---

## Tech Stack
- **Frontend**: React, React Router, Axios, CSS
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Authentication**: JWT, bcryptjs
- **Other**: Nodemailer (email), Twilio (SMS), PDFKit (payslips), CORS, dotenv

---

## Project Structure
```
client/           # React frontend
  src/
    components/   # Reusable UI components
    context/      # React Context for Auth
    pages/        # Main pages (Dashboard, Login, Register, etc.)
    styles/       # CSS files
    utils/        # API utilities
  public/         # Static assets
  package.json    # Frontend dependencies

server/           # Node.js backend
  config/         # DB config
  controllers/    # Route logic
  middleware/     # Auth, rate limiting
  models/         # Mongoose schemas
  routes/         # API endpoints
  utils/          # Helper functions
  package.json    # Backend dependencies
```

---

## Setup & Installation

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (local or Atlas)
- npm

### 1. Clone the Repository
```sh
git clone https://github.com/yukesshwaran21/Employee_Management_System.git
cd Employee_Management_System
```

### 2. Install Dependencies
#### Backend
```sh
cd server
npm install
```
#### Frontend
```sh
cd ../client
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in `server/`:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email_address
EMAIL_PASS=your_email_password
TWILIO_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE=your_twilio_phone_number
```

### 4. Start the Application
#### Backend
```sh
cd server
npm start
```
#### Frontend
```sh
cd client
npm start
```
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:5000](http://localhost:5000)

---

## Usage
- **Register**: Create a new account (employee/admin).
- **Login**: Access dashboard based on role.
- **Dashboard**: View attendance, payroll, leaves, profile.
- **Admin Panel**: Manage employees, approve leaves, view reports.
- **Attendance**: Clock in/out, view history.
- **Leave**: Apply for leave, view status.
- **Payroll**: View payslips, salary details.

---

## Core Modules
### Backend Models
- **User**: Employee/admin details, password, role, department, leave balance, etc.
- **Attendance**: Daily records, clock-in/out, overtime.
- **Payroll**: Monthly salary, overtime, bonus, payslip.
- **Leave**: Leave applications, status, type.
- **Department**: Department info.
- **Shift**: Work shift timings.
- **Notification**: In-app notifications.
- **AuditLog**: Admin actions.

### API Endpoints
- `/api/auth`: Register, login, verify email, etc.
- `/api/employees`: CRUD for employees.
- `/api/attendance`: Attendance actions.
- `/api/payroll`: Payroll management.
- `/api/leave`: Leave applications.
- `/api/department`: Department management.
- `/api/shift`: Shift management.
- `/api/audit`: Audit logs.
- `/api/notification`: Notifications.

---

## Frontend Overview
- **AuthContext**: Manages user state, token, login/logout.
- **Pages**: Dashboard, AdminDashboard, LoginPage, RegisterPage, AttendancePage, PayrollPage, LeavePage, ProfilePage, NotFound.
- **Components**: EmployeeList, NotificationDropdown, AttendanceSummary, OvertimeTrends, PayrollCost, PendingApprovals, ReportsExports, GoBackButton.
- **API Utility**: Axios instance with JWT token support.
- **Routing**: React Router for navigation.
- **Styles**: Custom CSS for modern UI.

---

## Backend Overview
- **Express Server**: Handles API requests, connects to MongoDB.
- **Controllers**: Business logic for each module.
- **Middleware**: Auth (JWT), rate limiting, error handling.
- **Database**: MongoDB via Mongoose.
- **Notifications**: Email (Nodemailer), SMS (Twilio).
- **PDF Generation**: Payslips via PDFKit.

---

## Contributing
1. Fork the repo
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## License
This project is licensed under the ISC License.

---

**For any questions or issues, please open an issue on GitHub.**
