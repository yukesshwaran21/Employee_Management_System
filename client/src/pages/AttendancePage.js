import React, { useEffect, useState } from 'react';
import API from '../utils/api';
import '../styles/AttendancePage.css';

function AttendancePage() {
  const [attendance, setAttendance] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Fetch attendance data
    API.get('/attendance/me')
      .then(res => setAttendance(res.data))
      .catch((err) => {
        if (err.response?.status === 403) {
          setError('Access denied: You do not have permission to view attendance. Please check your role or login status.');
        } else {
          setAttendance([]);
        }
      });

    return () => clearInterval(timer);
  }, []);

  const handleClockIn = async () => {
    setError('');
    setMessage('');
    setLoading(true);
    // Get geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          await API.post('/attendance/clockin', { location: { latitude, longitude } });
          setMessage('Successfully clocked in! Have a productive day! 🚀');
          // Refresh attendance data
          const res = await API.get('/attendance/me');
          setAttendance(res.data);
        } catch (err) {
          if (err.response?.status === 403) {
            setError('Access denied: You do not have permission to clock in. Please check your role or login status.');
          } else {
            setError(err.response?.data?.message || 'Clock in failed');
          }
        } finally {
          setLoading(false);
        }
      }, (error) => {
        setError('Location access denied. Please enable location to clock in.');
        setLoading(false);
      });
    } else {
      setError('Geolocation is not supported by your browser.');
      setLoading(false);
    }
  };

  const handleClockOut = async () => {
    setError('');
    setMessage('');
    setLoading(true);
    try {
      await API.post('/attendance/clockout');
      setMessage('Successfully clocked out! Great work today! 👏');
      // Refresh attendance data
      const res = await API.get('/attendance/me');
      setAttendance(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Clock out failed');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (time) => {
    return time.toLocaleTimeString('en-US', {
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="attendance-wrapper">
      <div className="attendance-container fade-in">
        {/* Attendance Header */}
        <div className="attendance-header">
          <h1 className="attendance-title">Time & Attendance</h1>
          <div className="current-time">{formatTime(currentTime)}</div>
          <div className="current-date">{formatDate(currentTime)}</div>
          <div className="current-period">
            <span>📅</span>
            Current Period: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </div>
        </div>

        {/* Alert Messages */}
        {message && (
          <div className="alert alert-success">
            <span>✅</span>
            {message}
          </div>
        )}
        
        {error && (
          <div className="alert alert-error">
            <span>⚠️</span>
            {error}
          </div>
        )}

        {/* Clock Actions */}
        <div className="clock-actions">
          <div className="clock-card clock-in">
            <div className="clock-icon clock-in">
              <span>🕐</span>
            </div>
            <h3 className="clock-title">Clock In</h3>
            <p className="clock-description">
              Start your workday by clocking in. This will record your arrival time for today.
            </p>
            <div className="status-indicator clocked-in" style={{ display: 'none' }}>
              <div className="status-dot success"></div>
              Already Clocked In
            </div>
            <button 
              className="clock-button clock-in" 
              onClick={handleClockIn}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Clock In'}
            </button>
          </div>

          <div className="clock-card clock-out">
            <div className="clock-icon clock-out">
              <span>🕕</span>
            </div>
            <h3 className="clock-title">Clock Out</h3>
            <p className="clock-description">
              End your workday by clocking out. This will calculate your total hours worked.
            </p>
            <div className="status-indicator clocked-out" style={{ display: 'none' }}>
              <div className="status-dot error"></div>
              Not Clocked In
            </div>
            <button 
              className="clock-button clock-out" 
              onClick={handleClockOut}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Clock Out'}
            </button>
          </div>
        </div>

        {/* Attendance History */}
        <div className="attendance-history">
          <div className="history-header">
            <h3 className="history-title">
              <span>📊</span>
              Attendance History
            </h3>
            <div className="filter-controls">
              <select className="date-filter">
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
              </select>
              <button className="btn-secondary">
                <span>📥</span>
                Export
              </button>
            </div>
          </div>

          <div className="table-container">
            {attendance.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Clock In</th>
                    <th>Clock Out</th>
                    <th>Total Hours</th>
                    <th>Overtime</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.map(a => (
                    <tr key={a._id}>
                      <td>
                        <div className="date-badge">
                          {a.date ? new Date(a.date).toLocaleDateString() : 'N/A'}
                        </div>
                      </td>
                      <td>
                        {a.clockIn ? (
                          <div className="time-badge clock-in">
                            {new Date(a.clockIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        ) : (
                          <span className="text-gray-400">--</span>
                        )}
                      </td>
                      <td>
                        {a.clockOut ? (
                          <div className="time-badge clock-out">
                            {new Date(a.clockOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        ) : (
                          <span className="text-gray-400">--</span>
                        )}
                      </td>
                      <td>
                        {a.totalHours ? (
                          <div className="hours-badge">
                            {a.totalHours.toFixed(2)}h
                          </div>
                        ) : (
                          <span className="text-gray-400">--</span>
                        )}
                      </td>
                      <td>
                        {a.overtimeHours ? (
                          <div className="overtime-badge">
                            {a.overtimeHours.toFixed(2)}h
                          </div>
                        ) : (
                          <span className="text-gray-400">0h</span>
                        )}
                      </td>
                      <td>
                        <div className="status-badge">
                          {a.clockOut ? 'Complete' : 'In Progress'}
                        </div>
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
                <h4 className="empty-title">No Attendance Records</h4>
                <p className="empty-description">
                  Your attendance records will appear here once you start clocking in and out.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AttendancePage;
