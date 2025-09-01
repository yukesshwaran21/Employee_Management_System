import React, { useEffect, useState } from 'react';
import API from '../utils/api';

function PendingApprovals() {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/employees').then(res => {
      setPending(res.data.filter(u => u.status === 'pending'));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleApprove = async (id) => {
    await API.put(`/employees/approve/${id}`);
    setPending(pending.filter(u => u._id !== id));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h3>Pending Approvals</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {pending.map(u => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td><button onClick={() => handleApprove(u._id)}>Approve</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PendingApprovals;
