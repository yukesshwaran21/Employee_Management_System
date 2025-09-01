import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Routes, Route, Link } from 'react-router-dom';
import EmployeeList from '../components/EmployeeList';
import PendingApprovals from '../components/PendingApprovals';
import AttendanceSummary from '../components/AttendanceSummary';
import OvertimeTrends from '../components/OvertimeTrends';
import PayrollCost from '../components/PayrollCost';
import ReportsExports from '../components/ReportsExports';
import './Dashboard.css';

function AdminDashboard() {
  const { user, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) return <div>Loading...</div>;
  if (user.role !== 'admin' && user.role !== 'super-admin') return <div>Access denied</div>;

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <h2>Admin Dashboard</h2>
      <div className="dashboard-info">
        <p>Welcome, {user.name}</p>
        <p>Role: {user.role}</p>
        <ul>
          <li><Link to="/admin/employees">Total Employees</Link></li>
          <li><Link to="/admin/approvals">Pending Approvals</Link></li>
          <li><Link to="/admin/attendance">Attendance Summary</Link></li>
          <li><Link to="/admin/overtime">Overtime Trends</Link></li>
          <li><Link to="/admin/payroll">Monthly Payroll Cost</Link></li>
          <li><Link to="/admin/reports">Reports & Exports</Link></li>
        </ul>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <div style={{ marginTop: '2rem' }}>
        <Routes>
          <Route path="/employees" element={<EmployeeList />} />
          <Route path="/approvals" element={<PendingApprovals />} />
          <Route path="/attendance" element={<AttendanceSummary />} />
          <Route path="/overtime" element={<OvertimeTrends />} />
          <Route path="/payroll" element={<PayrollCost />} />
          <Route path="/reports" element={<ReportsExports />} />
        </Routes>
      </div>
    </div>
  );
}

export default AdminDashboard;
