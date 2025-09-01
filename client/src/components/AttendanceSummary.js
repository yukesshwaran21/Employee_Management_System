import React, { useEffect, useState } from 'react';
import API from '../utils/api';

function AttendanceSummary() {
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/attendance/summary').then(res => {
      setSummary(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h3>Attendance Summary</h3>
      <table>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Total Days</th>
            <th>Total Hours</th>
            <th>Overtime</th>
          </tr>
        </thead>
        <tbody>
          {summary.map(s => (
            <tr key={s._id}>
              <td>{s._id}</td>
              <td>{s.totalDays}</td>
              <td>{s.totalHours}</td>
              <td>{s.overtime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AttendanceSummary;
