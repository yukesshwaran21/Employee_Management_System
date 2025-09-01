import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Routes, Route, Link } from 'react-router-dom';
import EmployeeList from '../components/EmployeeList';
import PendingApprovals from '../components/PendingApprovals';
import AttendanceSummary from '../components/AttendanceSummary';
import OvertimeTrends from '../components/OvertimeTrends';
import PayrollCost from '../components/PayrollCost';
import ReportsExports from '../components/ReportsExports';
import '../styles/Dashboard.css';

function AdminDashboard() {
  const { user, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <div className="loading-text">Loading admin dashboard...</div>
      </div>
    );
  }

  if (user.role !== 'admin' && user.role !== 'super-admin') {
    return (
      <div className="dashboard-wrapper">
        <div className="dashboard-container">
          <div className="alert alert-error">
            <span>🚫</span>
            Access denied. You don't have admin privileges.
          </div>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    navigate('/login');
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container admin-dashboard fade-in">
        {/* Admin Dashboard Header */}
            <div className="dashboard-header">
              <div className="welcome-section">
                <div className="user-info">
                  <h1 className="dashboard-title">Admin Dashboard</h1>
                  <div className="welcome-text">Welcome back, {user.name}! 👋</div>
                  <div className="user-role">
                    <span>🛡️</span>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </div>
                </div>
                <div className="dashboard-actions">
                  <button className="btn-notification" title="Notifications" style={{ marginRight: '12px' }}>
                    <span role="img" aria-label="Notifications">🔔</span>
                  </button>
                  <button 
                    className="btn-secondary" 
                    onClick={() => navigate('/profile')}
                  >
                    <span>👤</span>
                    My Profile
                  </button>
                  <button 
                    className="btn-primary" 
                    onClick={handleLogout}
                  >
                    <span>�</span>
                    Logout
                  </button>
                </div>
              </div>
            </div>

        {/* Admin Navigation Menu */}
        <div className="navigation-menu">
          <h3 className="menu-title">
            <span>🎛️</span>
            Admin Controls
          </h3>
          <div className="menu-grid">
            <Link to="/admin/employees" className="menu-item">
              <div className="menu-icon">👥</div>
              <span>Manage Employees</span>
            </Link>
            <Link to="/admin/approvals" className="menu-item">
              <div className="menu-icon">✅</div>
              <span>Pending Approvals</span>
            </Link>
            <Link to="/admin/attendance" className="menu-item">
              <div className="menu-icon">📊</div>
              <span>Attendance Summary</span>
            </Link>
            <Link to="/admin/overtime" className="menu-item">
              <div className="menu-icon">⏰</div>
              <span>Overtime Trends</span>
            </Link>
            <Link to="/admin/payroll" className="menu-item">
              <div className="menu-icon">💰</div>
              <span>Payroll Costs</span>
            </Link>
            <Link to="/admin/reports" className="menu-item">
              <div className="menu-icon">📈</div>
              <span>Reports & Analytics</span>
            </Link>
          </div>
        </div>

        {/* Admin Content Area */}
        <div className="admin-content">
          <Routes>
            <Route path="/employees" element={<EmployeeList />} />
            <Route path="/approvals" element={<PendingApprovals />} />
            <Route path="/attendance" element={<AttendanceSummary />} />
            <Route path="/overtime" element={<OvertimeTrends />} />
            <Route path="/payroll" element={<PayrollCost />} />
            <Route path="/reports" element={<ReportsExports />} />
            <Route path="/" element={
              <div className="admin-welcome">
                <div className="card">
                  <h3 className="card-title">👋 Welcome to Admin Dashboard</h3>
                  <p className="card-subtitle">
                    Select a section from the menu above to get started with managing your organization.
                  </p>
                </div>
              </div>
            } />
          </Routes>
        </div>

        {/* Dashboard Footer */}
        <div className="dashboard-footer">
          <div className="footer-info">
            Admin Panel - Last login: {new Date().toLocaleDateString()}
          </div>
          <div className="footer-info">
            Employee Management System v2.0
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
