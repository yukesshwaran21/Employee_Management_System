import React, { useEffect, useState } from 'react';
import API from '../utils/api';

function ReportsExports() {
  const [audit, setAudit] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/audit').then(res => {
      setAudit(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h3>Reports & Exports (Audit Log)</h3>
      <table>
        <thead>
          <tr>
            <th>Action</th>
            <th>By</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {audit.map(a => (
            <tr key={a._id}>
              <td>{a.action}</td>
              <td>{a.performedBy?.name || ''}</td>
              <td>{a.createdAt ? new Date(a.createdAt).toLocaleString() : ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReportsExports;
