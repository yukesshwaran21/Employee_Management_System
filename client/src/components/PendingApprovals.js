import React, { useEffect, useState } from 'react';
import API from '../utils/api';
import '../styles/Components.css';

function PendingApprovals() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => {
    fetchPendingApprovals();
  }, []);

  const fetchPendingApprovals = async () => {
    try {
      // Fetch pending user registrations
      const usersRes = await API.get('/employees');
      setPendingUsers(usersRes.data.filter(u => u.status === 'pending'));

      // Fetch pending leave requests
      try {
        const leavesRes = await API.get('/leave/pending');
        setPendingLeaves(leavesRes.data || []);
      } catch (leaveError) {
        console.log('No pending leaves or endpoint not available');
        setPendingLeaves([]);
      }
    } catch (error) {
      console.error('Error fetching pending approvals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveUser = async (id) => {
    try {
      await API.put(`/employees/approve/${id}`);
      setPendingUsers(pendingUsers.filter(u => u._id !== id));
    } catch (error) {
      console.error('Error approving user:', error);
    }
  };

  const handleRejectUser = async (id) => {
    try {
      await API.delete(`/employees/${id}`);
      setPendingUsers(pendingUsers.filter(u => u._id !== id));
    } catch (error) {
      console.error('Error rejecting user:', error);
    }
  };

  const handleApproveLeave = async (id) => {
    try {
      await API.put(`/leave/approve/${id}`);
      setPendingLeaves(pendingLeaves.filter(l => l._id !== id));
    } catch (error) {
      console.error('Error approving leave:', error);
    }
  };

  const handleRejectLeave = async (id) => {
    try {
      await API.put(`/leave/reject/${id}`);
      setPendingLeaves(pendingLeaves.filter(l => l._id !== id));
    } catch (error) {
      console.error('Error rejecting leave:', error);
    }
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="component-loading">
        <div className="spinner"></div>
        <span>Loading pending approvals...</span>
      </div>
    );
  }

  const totalPending = pendingUsers.length + pendingLeaves.length;

  return (
    <div className="approvals-container">
      <div className="approvals-header">
        <div>
          <h3 className="approvals-title">
            <span>✅</span>
            Pending Approvals
            {totalPending > 0 && (
              <div className="pending-count">
                {totalPending} pending
              </div>
            )}
          </h3>
        </div>
        <div className="approval-tabs">
          <button 
            className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            User Registrations ({pendingUsers.length})
          </button>
          <button 
            className={`tab-button ${activeTab === 'leaves' ? 'active' : ''}`}
            onClick={() => setActiveTab('leaves')}
          >
            Leave Requests ({pendingLeaves.length})
          </button>
        </div>
      </div>

      {activeTab === 'users' && (
        <div className="approval-section">
          {pendingUsers.length === 0 ? (
            <div className="component-empty">
              <div className="empty-icon">👤</div>
              <div className="empty-title">No pending user registrations</div>
              <div className="empty-description">
                All user registrations have been processed
              </div>
            </div>
          ) : (
            pendingUsers.map(user => (
              <div key={user._id} className="approval-item">
                <div className="approval-header">
                  <div className="approval-type user">User Registration</div>
                  <div className="approval-date">
                    Submitted: {formatDate(user.createdAt || new Date())}
                  </div>
                </div>
                <div className="approval-content">
                  <div className="approval-user-info">
                    <div className="employee-avatar small">
                      {getInitials(user.name)}
                    </div>
                    <div>
                      <div className="approval-employee">{user.name}</div>
                      <div className="approval-email">{user.email}</div>
                      <div className="approval-department">
                        Department: {user.department?.name || 'Not assigned'}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="approval-actions">
                  <button 
                    className="approve-btn"
                    onClick={() => handleApproveUser(user._id)}
                  >
                    <span>✓</span>
                    Approve
                  </button>
                  <button 
                    className="reject-btn"
                    onClick={() => handleRejectUser(user._id)}
                  >
                    <span>✕</span>
                    Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'leaves' && (
        <div className="approval-section">
          {pendingLeaves.length === 0 ? (
            <div className="component-empty">
              <div className="empty-icon">📅</div>
              <div className="empty-title">No pending leave requests</div>
              <div className="empty-description">
                All leave requests have been processed
              </div>
            </div>
          ) : (
            pendingLeaves.map(leave => (
              <div key={leave._id} className="approval-item">
                <div className="approval-header">
                  <div className="approval-type leave">{leave.leaveType || 'Leave'} Request</div>
                  <div className="approval-date">
                    Submitted: {formatDate(leave.createdAt || new Date())}
                  </div>
                </div>
                <div className="approval-details">
                  <div className="approval-employee">
                    {leave.employee?.name || leave.employeeName || 'Unknown Employee'}
                  </div>
                  <div className="leave-dates">
                    <strong>Duration:</strong> {formatDate(leave.startDate)} to {formatDate(leave.endDate)}
                    ({leave.duration || 'N/A'} days)
                  </div>
                  {leave.reason && (
                    <div className="approval-reason">
                      <strong>Reason:</strong> {leave.reason}
                    </div>
                  )}
                </div>
                <div className="approval-actions">
                  <button 
                    className="approve-btn"
                    onClick={() => handleApproveLeave(leave._id)}
                  >
                    <span>✓</span>
                    Approve
                  </button>
                  <button 
                    className="reject-btn"
                    onClick={() => handleRejectLeave(leave._id)}
                  >
                    <span>✕</span>
                    Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default PendingApprovals;
