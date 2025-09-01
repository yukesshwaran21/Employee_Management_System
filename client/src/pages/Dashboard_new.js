import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';

function Dashboard() {
  const { user, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <div className="loading-text">Loading your dashboard...</div>
      </div>
    );
  }

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    navigate('/login');
  };

  const getUserInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container fade-in">
        {/* Dashboard Header */}
        <div className="dashboard-header">
          <div className="welcome-section">
            <div className="user-info">
              <h1 className="dashboard-title">Employee Dashboard</h1>
              <div className="welcome-text">Welcome back, {user.name}! 👋</div>
              <div className="user-role">
                <span>👔</span>
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </div>
            </div>
            <div className="dashboard-actions">
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
                <span>🚪</span>
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="quick-stats">
          <div className="stat-card">
            <div className="stat-icon attendance">
              <span>🕐</span>
            </div>
            <div className="stat-label">Today's Attendance</div>
            <div className="stat-value">Not Checked In</div>
            <a href="/attendance" className="stat-link">
              View Details <span>→</span>
            </a>
          </div>

          <div className="stat-card">
            <div className="stat-icon payroll">
              <span>💰</span>
            </div>
            <div className="stat-label">Recent Payslips</div>
            <div className="stat-value">Available</div>
            <a href="/payroll" className="stat-link">
              View Payroll <span>→</span>
            </a>
          </div>

          <div className="stat-card">
            <div className="stat-icon leave">
              <span>🏖️</span>
            </div>
            <div className="stat-label">Leave Balance</div>
            <div className="stat-value">
              {user.leaveBalance 
                ? `${user.leaveBalance.casual + user.leaveBalance.sick + user.leaveBalance.earned} days`
                : 'N/A'
              }
            </div>
            <a href="/leave" className="stat-link">
              Manage Leaves <span>→</span>
            </a>
          </div>

          <div className="stat-card">
            <div className="stat-icon profile">
              <span>📊</span>
            </div>
            <div className="stat-label">Work Hours</div>
            <div className="stat-value">This Month</div>
            <a href="/attendance" className="stat-link">
              View Report <span>→</span>
            </a>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="navigation-menu">
          <h3 className="menu-title">
            <span>🧭</span>
            Quick Navigation
          </h3>
          <div className="menu-grid">
            <a href="/attendance" className="menu-item">
              <div className="menu-icon">🕐</div>
              <span>Attendance</span>
            </a>
            <a href="/payroll" className="menu-item">
              <div className="menu-icon">💰</div>
              <span>Payroll</span>
            </a>
            <a href="/leave" className="menu-item">
              <div className="menu-icon">🏖️</div>
              <span>Leave Management</span>
            </a>
            <a href="/profile" className="menu-item">
              <div className="menu-icon">👤</div>
              <span>My Profile</span>
            </a>
          </div>
        </div>

        {/* Dashboard Footer */}
        <div className="dashboard-footer">
          <div className="footer-info">
            Last login: {new Date().toLocaleDateString()}
          </div>
          <div className="footer-info">
            Employee Management System v2.0
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
