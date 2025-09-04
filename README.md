
# Employee Management System

A robust full-stack web application for managing employees, attendance, payroll, leaves, departments, and more. Built with React (frontend) and Node.js/Express/MongoDB (backend).

---

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [Data Models](#data-models)
- [API Endpoints](#api-endpoints)
- [Frontend Workflows](#frontend-workflows)
- [Backend Workflows](#backend-workflows)
- [Security](#security)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)
- [FAQ](#faq)

---

## Project Overview

The Employee Management System (EMS) streamlines HR operations for organizations. It provides secure authentication, role-based access, and modules for attendance, payroll, leave management, notifications, and reporting. The system is designed for scalability, security, and ease of use.

---

## Features

- **User Authentication & Authorization**
  - Registration, login, JWT-based sessions, email verification.
  - Role-based access: Employee, Admin, Super Admin.

- **Employee Management**
  - Add, update, view, and soft-delete employees.
  - Assign departments, designations, and shifts.

- **Attendance Tracking**
  - Daily clock-in/out, overtime calculation, late/early detection.
  - Location and IP tracking for compliance.

- **Leave Management**
  - Apply for casual, sick, or earned leave.
  - Admin approval/rejection, leave balance tracking.

- **Payroll Management**
  - Monthly salary calculation, overtime, bonuses.
  - Payslip PDF generation and download.

- **Department & Shift Management**
  - Create/manage departments and work shifts.

- **Notifications**
  - In-app, email, and SMS notifications for approvals, payroll, and system alerts.

- **Audit Logs**
  - Track admin actions for security and compliance.

- **Admin Dashboard**
  - Advanced controls for HR/admins, analytics, and reporting.

- **Reports & Analytics**
  - Export data, view attendance/overtime/payroll trends.

- **Responsive UI**
  - Modern, user-friendly interface for desktop and mobile.

---

## Tech Stack

- **Frontend:** React, React Router, Axios, CSS
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Authentication:** JWT, bcryptjs
- **Notifications:** Nodemailer (email), Twilio (SMS)
- **PDF Generation:** PDFKit
- **Other:** CORS, dotenv

---

## Architecture

- **Client-Server Model:** React SPA communicates with Express REST API.
- **Database:** MongoDB stores all persistent data.
- **Authentication:** JWT tokens for secure API access.
- **Notifications:** Email/SMS via third-party services.

---

## Project Structure

```
client/
  src/
    components/      # UI components (EmployeeList, NotificationDropdown, etc.)
    context/         # React Context (AuthContext)
    pages/           # Main pages (Dashboard, Login, Register, etc.)
    styles/          # CSS files
    utils/           # API utilities (axios)
  public/            # Static assets
  package.json       # Frontend dependencies

server/
  config/            # DB config
  controllers/       # Route logic (attendance, payroll, etc.)
  middleware/        # Auth, rate limiting
  models/            # Mongoose schemas (User, Attendance, Payroll, etc.)
  routes/            # API endpoints
  utils/             # Helper functions (token, email, SMS)
  package.json       # Backend dependencies
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

## Data Models

### User

- `name`, `email`, `phone`, `password`, `role`, `department`, `designation`, `status`, `employeeId`, `isEmailVerified`, `profilePhoto`, `leaveBalance`, `baseSalary`, `shift`, `isActive`, `createdAt`, `updatedAt`

### Attendance

- `user`, `date`, `clockIn`, `clockOut`, `totalHours`, `overtimeHours`, `ip`, `location`, `isLate`, `isEarly`

### Payroll

- `user`, `month`, `baseSalary`, `overtimeHours`, `overtimeRate`, `bonus`, `totalSalary`, `status`, `payslip`, `releasedAt`

### Leave

- `user`, `type`, `from`, `to`, `days`, `reason`, `status`, `adminComment`, `appliedAt`, `decidedAt`

### Department

- `name`, `description`

### Shift

- `name`, `startTime`, `endTime`, `isNightShift`

### Notification

- `user`, `type`, `message`, `isRead`, `createdAt`

### AuditLog

- `action`, `performedBy`, `details`, `createdAt`

---

## API Endpoints

- `/api/auth`: Register, login, verify email, password reset
- `/api/employees`: CRUD for employees
- `/api/attendance`: Clock-in/out, attendance history, reports
- `/api/payroll`: Payroll management, payslip download
- `/api/leave`: Apply, approve/reject, leave history
- `/api/department`: Manage departments
- `/api/shift`: Manage shifts
- `/api/audit`: Audit logs
- `/api/notification`: Notifications

---

## Frontend Workflows

- **Authentication:** AuthContext manages user state and JWT token. Login and registration forms interact with `/api/auth`.
- **Dashboard:** Displays quick stats, navigation, and user info. Role-based rendering for employee/admin.
- **Attendance:** Employees can clock in/out, view attendance history, and see overtime.
- **Leave:** Apply for leave, view balances, and track approval status.
- **Payroll:** View salary details, download payslips.
- **Admin Panel:** Manage employees, approve leaves, view analytics, and export reports.
- **Notifications:** Dropdown for unread notifications, real-time updates.

---

## Backend Workflows

- **Authentication:** JWT middleware protects routes. Passwords hashed with bcryptjs.
- **Attendance:** Validates clock-in/out, calculates hours and overtime.
- **Payroll:** Generates monthly payroll, calculates overtime, creates payslip PDFs.
- **Leave:** Validates leave applications, updates balances, notifies admins.
- **Notifications:** Sends email/SMS via Nodemailer/Twilio, stores in DB.
- **Audit Logging:** Records admin actions for compliance.

---

## Security

- Passwords hashed and salted.
- JWT-based authentication for API access.
- Role-based access control for sensitive endpoints.
- Rate limiting to prevent abuse.
- CORS configured for frontend-backend communication.

---

## Testing

- Frontend: React Testing Library, Jest (see `client/src/App.test.js`)
- Backend: Add tests for controllers and routes as needed.

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

## FAQ

**Q: How do I add a new department or shift?**  
A: Use the admin dashboard or API endpoints `/api/department` and `/api/shift`.

**Q: How are notifications sent?**  
A: Notifications are sent via email (Nodemailer), SMS (Twilio), and stored in the database for in-app display.

**Q: How do I generate payslips?**  
A: Payroll module generates PDF payslips using PDFKit, downloadable from the payroll page.

**Q: How do I reset my password?**  
A: Use the password reset feature via `/api/auth`.

---

**For any questions or issues, please open an issue on GitHub.**
