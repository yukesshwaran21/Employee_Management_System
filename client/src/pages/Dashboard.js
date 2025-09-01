import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
  const { user, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) return <div>Loading...</div>;

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <h2>Employee Dashboard</h2>
      <div className="dashboard-info">
        <p>Welcome, {user.name}</p>
        <p>Role: {user.role}</p>
        <p>Today’s Attendance: <a href="/attendance">View</a></p>
        <p>Recent Payslips: <a href="/payroll">View</a></p>
        <p>Leave Balance: {user.leaveBalance ? `Casual: ${user.leaveBalance.casual}, Sick: ${user.leaveBalance.sick}, Earned: ${user.leaveBalance.earned}` : 'N/A'}</p>
        <p>Work hours this month: (see Attendance)</p>
        <button onClick={() => navigate('/profile')}>My Profile</button>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

export default Dashboard;
