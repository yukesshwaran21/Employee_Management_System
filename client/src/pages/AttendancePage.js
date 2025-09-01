import React, { useEffect, useState } from 'react';
import API from '../utils/api';
import './AttendancePage.css';

function AttendancePage() {
  const [attendance, setAttendance] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    API.get('/attendance/me').then(res => setAttendance(res.data)).catch(() => setAttendance([]));
  }, []);

  const handleClockIn = async () => {
    setError(''); setMessage('');
    try {
      await API.post('/attendance/clockin');
      setMessage('Clocked in!');
      API.get('/attendance/me').then(res => setAttendance(res.data));
    } catch (err) {
      setError(err.response?.data?.message || 'Clock in failed');
    }
  };

  const handleClockOut = async () => {
    setError(''); setMessage('');
    try {
      await API.post('/attendance/clockout');
      setMessage('Clocked out!');
      API.get('/attendance/me').then(res => setAttendance(res.data));
    } catch (err) {
      setError(err.response?.data?.message || 'Clock out failed');
    }
  };

  return (
    <div className="attendance-container">
      <h2>Attendance</h2>
      <button onClick={handleClockIn}>Clock In</button>
      <button onClick={handleClockOut}>Clock Out</button>
      {message && <div className="success">{message}</div>}
      {error && <div className="error">{error}</div>}
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Clock In</th>
            <th>Clock Out</th>
            <th>Total Hours</th>
            <th>Overtime</th>
          </tr>
        </thead>
        <tbody>
          {attendance.map(a => (
            <tr key={a._id}>
              <td>{a.date ? a.date.substring(0,10) : ''}</td>
              <td>{a.clockIn ? new Date(a.clockIn).toLocaleTimeString() : ''}</td>
              <td>{a.clockOut ? new Date(a.clockOut).toLocaleTimeString() : ''}</td>
              <td>{a.totalHours?.toFixed(2)}</td>
              <td>{a.overtimeHours?.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AttendancePage;
