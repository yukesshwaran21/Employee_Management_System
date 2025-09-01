import React, { useEffect, useState } from 'react';
import API from '../utils/api';
import './PayrollPage.css';

function PayrollPage() {
  const [payrolls, setPayrolls] = useState([]);

  useEffect(() => {
    API.get('/payroll/me').then(res => setPayrolls(res.data)).catch(() => setPayrolls([]));
  }, []);

  return (
    <div className="payroll-container">
      <h2>My Payslips</h2>
      <table>
        <thead>
          <tr>
            <th>Month</th>
            <th>Base Salary</th>
            <th>Overtime Hours</th>
            <th>Overtime Rate</th>
            <th>Total Salary</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {payrolls.map(p => (
            <tr key={p._id}>
              <td>{p.month}</td>
              <td>{p.baseSalary}</td>
              <td>{p.overtimeHours}</td>
              <td>{p.overtimeRate}</td>
              <td>{p.totalSalary}</td>
              <td>{p.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PayrollPage;
