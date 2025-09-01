import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
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
          <li><a href="/admin/employees">Total Employees</a></li>
          <li><a href="/admin/approvals">Pending Approvals</a></li>
          <li><a href="/admin/attendance">Attendance Summary</a></li>
          <li><a href="/admin/overtime">Overtime Trends</a></li>
          <li><a href="/admin/payroll">Monthly Payroll Cost</a></li>
          <li><a href="/admin/reports">Reports & Exports</a></li>
        </ul>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

export default AdminDashboard;
