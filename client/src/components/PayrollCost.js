import React, { useEffect, useState } from 'react';
import API from '../utils/api';

function PayrollCost() {
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/payroll').then(res => {
      setPayrolls(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const totalCost = payrolls.reduce((sum, p) => sum + (p.totalSalary || 0), 0);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h3>Monthly Payroll Cost</h3>
      <p>Total: {totalCost}</p>
      <table>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Month</th>
            <th>Total Salary</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {payrolls.map(p => (
            <tr key={p._id}>
              <td>{p.user?.name || p.user}</td>
              <td>{p.month}</td>
              <td>{p.totalSalary}</td>
              <td>{p.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PayrollCost;
