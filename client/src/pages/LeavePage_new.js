import React, { useEffect, useState, useContext } from 'react';
import API from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import '../styles/LeavePage.css';

function LeavePage() {
  const { user } = useContext(AuthContext);
  const [leaves, setLeaves] = useState([]);
  const [form, setForm] = useState({ type: 'casual', from: '', to: '', reason: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    API.get('/leave/me')
      .then(res => setLeaves(res.data))
      .catch(() => setLeaves([]));
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      await API.post('/leave/apply', form);
      setMessage('Leave application submitted successfully! 🎉');
      // Refresh leave data
      const res = await API.get('/leave/me');
      setLeaves(res.data);
      // Reset form
      setForm({ type: 'casual', from: '', to: '', reason: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to apply for leave');
    } finally {
      setLoading(false);
    }
  };

  const getLeaveBalance = (type) => {
    if (!user?.leaveBalance) return 0;
    return user.leaveBalance[type] || 0;
  };

  const calculateDays = () => {
    if (form.from && form.to) {
      const fromDate = new Date(form.from);
      const toDate = new Date(form.to);
      const diffTime = Math.abs(toDate - fromDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays;
    }
    return 0;
  };

  const filteredLeaves = leaves.filter(leave => 
    filterStatus === 'all' || leave.status === filterStatus
  );

  return (
    <div className="leave-wrapper">
      <div className="leave-container fade-in">
        {/* Leave Header */}
        <div className="leave-header">
          <h1 className="leave-title">Leave Management</h1>
        </div>

        {/* Leave Balance Summary */}
        <div className="leave-summary">
          <div className="balance-card casual">
            <div className="balance-icon casual">
              <span>🏖️</span>
            </div>
            <div className="balance-label">Casual Leave</div>
            <div className="balance-value">{getLeaveBalance('casual')}</div>
            <div className="balance-subtitle">days remaining</div>
          </div>

          <div className="balance-card sick">
            <div className="balance-icon sick">
              <span>🤒</span>
            </div>
            <div className="balance-label">Sick Leave</div>
            <div className="balance-value">{getLeaveBalance('sick')}</div>
            <div className="balance-subtitle">days remaining</div>
          </div>

          <div className="balance-card earned">
            <div className="balance-icon earned">
              <span>⭐</span>
            </div>
            <div className="balance-label">Earned Leave</div>
            <div className="balance-value">{getLeaveBalance('earned')}</div>
            <div className="balance-subtitle">days remaining</div>
          </div>
        </div>

        {/* Messages */}
        {message && (
          <div className="message-container">
            <div className="success-message">
              <span>✅</span>
              {message}
            </div>
          </div>
        )}
        
        {error && (
          <div className="message-container">
            <div className="error-message">
              <span>⚠️</span>
              {error}
            </div>
          </div>
        )}

        {/* Leave Application Form */}
        <div className="leave-form-section">
          <h3 className="form-title">
            <span>📝</span>
            Apply for Leave
          </h3>
          
          <form onSubmit={handleSubmit} className="leave-form">
            <div className="form-group">
              <label className="form-label">Leave Type</label>
              <select
                name="type"
                className="form-select"
                value={form.type}
                onChange={handleChange}
                required
              >
                <option value="casual">Casual Leave</option>
                <option value="sick">Sick Leave</option>
                <option value="earned">Earned Leave</option>
              </select>
            </div>

            <div className="date-range">
              <div className="form-group">
                <label className="form-label">From Date</label>
                <input
                  name="from"
                  type="date"
                  className="form-input"
                  value={form.from}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">To Date</label>
                <input
                  name="to"
                  type="date"
                  className="form-input"
                  value={form.to}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {form.from && form.to && (
              <div className="form-group">
                <label className="form-label">Duration</label>
                <div className="days-badge">
                  {calculateDays()} day(s)
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Reason</label>
              <textarea
                name="reason"
                className="form-textarea"
                value={form.reason}
                onChange={handleChange}
                placeholder="Please provide a reason for your leave request..."
                rows="4"
              />
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className="submit-button"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="loading-spinner"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <span>📤</span>
                    Submit Application
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Leave History */}
        <div className="leave-history">
          <div className="history-header">
            <h3 className="history-title">
              <span>📋</span>
              Leave History
            </h3>
            <div className="filter-controls">
              <select 
                className="status-filter"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div className="table-container">
            {filteredLeaves.length > 0 ? (
              <table className="leave-table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Days</th>
                    <th>Status</th>
                    <th>Comment</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeaves.map(l => (
                    <tr key={l._id}>
                      <td>
                        <div className={`leave-type-badge ${l.type}`}>
                          {l.type}
                        </div>
                      </td>
                      <td>
                        <div className="date-badge">
                          {l.from ? new Date(l.from).toLocaleDateString() : 'N/A'}
                        </div>
                      </td>
                      <td>
                        <div className="date-badge">
                          {l.to ? new Date(l.to).toLocaleDateString() : 'N/A'}
                        </div>
                      </td>
                      <td>
                        <div className="days-badge">
                          {l.days || 0} day(s)
                        </div>
                      </td>
                      <td>
                        <div className={`status-badge ${l.status}`}>
                          {l.status}
                        </div>
                      </td>
                      <td>
                        <span className="text-gray-600">
                          {l.adminComment || 'No comments'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">
                  <span>📋</span>
                </div>
                <h4 className="empty-title">No Leave Records</h4>
                <p className="empty-description">
                  Your leave applications will appear here once you submit them.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeavePage;
