import React, { useEffect, useState } from 'react';
import API from '../utils/api';
import '../styles/Components.css';

function AttendanceSummary() {
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    averageHours: 0,
    totalOvertime: 0,
    attendanceRate: 0
  });

  useEffect(() => {
    fetchAttendanceSummary();
  }, []);

  const fetchAttendanceSummary = async () => {
    try {
      const res = await API.get('/attendance/summary');
      const summaryData = res.data || [];
      setSummary(summaryData);
      
      // Calculate stats
      const totalEmployees = summaryData.length;
      const totalHours = summaryData.reduce((sum, s) => sum + (s.totalHours || 0), 0);
      const totalOvertime = summaryData.reduce((sum, s) => sum + (s.overtime || 0), 0);
      const averageHours = totalEmployees > 0 ? (totalHours / totalEmployees).toFixed(1) : 0;
      const attendanceRate = totalEmployees > 0 ? 
        ((summaryData.filter(s => s.totalDays > 0).length / totalEmployees) * 100).toFixed(1) : 0;

      setStats({
        totalEmployees,
        averageHours,
        totalOvertime: totalOvertime.toFixed(1),
        attendanceRate
      });
    } catch (error) {
      console.error('Error fetching attendance summary:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="component-loading">
        <div className="spinner"></div>
        <span>Loading attendance summary...</span>
      </div>
    );
  }

  return (
    <div className="attendance-summary-container">
      <div className="approvals-header">
        <h3 className="approvals-title">
          <span>📊</span>
          Attendance Summary
        </h3>
      </div>

      {/* Summary Statistics */}
      <div className="summary-stats">
        <div className="summary-stat">
          <div className="stat-number">{stats.totalEmployees}</div>
          <div className="stat-label">Total Employees</div>
        </div>
        <div className="summary-stat">
          <div className="stat-number">{stats.averageHours}h</div>
          <div className="stat-label">Average Hours</div>
        </div>
        <div className="summary-stat">
          <div className="stat-number">{stats.totalOvertime}h</div>
          <div className="stat-label">Total Overtime</div>
        </div>
        <div className="summary-stat">
          <div className="stat-number">{stats.attendanceRate}%</div>
          <div className="stat-label">Attendance Rate</div>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="data-table">
        <div className="table-header">
          <h4 className="table-title">
            <span>📋</span>
            Detailed Attendance Report
          </h4>
        </div>
        
        {summary.length === 0 ? (
          <div className="component-empty">
            <div className="empty-icon">📊</div>
            <div className="empty-title">No attendance data available</div>
            <div className="empty-description">
              Attendance records will appear here once employees start logging time
            </div>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Total Days</th>
                  <th>Total Hours</th>
                  <th>Overtime Hours</th>
                  <th>Average Daily Hours</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {summary.map((s, index) => {
                  const avgDailyHours = s.totalDays > 0 ? (s.totalHours / s.totalDays).toFixed(1) : 0;
                  const isHighPerformer = s.totalHours > stats.averageHours;
                  
                  return (
                    <tr key={s._id || index}>
                      <td>
                        <div style={{ fontWeight: '600' }}>
                          {s.employeeName || s._id || 'Unknown Employee'}
                        </div>
                      </td>
                      <td>{s.totalDays || 0}</td>
                      <td>
                        <strong>{s.totalHours || 0}h</strong>
                      </td>
                      <td>
                        {s.overtime > 0 ? (
                          <span style={{ color: '#d97706', fontWeight: '600' }}>
                            {s.overtime}h
                          </span>
                        ) : (
                          <span style={{ color: '#6b7280' }}>0h</span>
                        )}
                      </td>
                      <td>{avgDailyHours}h</td>
                      <td>
                        <span className={`status-badge ${isHighPerformer ? 'status-active' : 'status-inactive'}`}>
                          {isHighPerformer ? 'Above Average' : 'Below Average'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AttendanceSummary;
