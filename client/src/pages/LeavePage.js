import React, { useEffect, useState } from 'react';
import API from '../utils/api';
import './LeavePage.css';

function LeavePage() {
  const [leaves, setLeaves] = useState([]);
  const [form, setForm] = useState({ type: 'casual', from: '', to: '', reason: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    API.get('/leave/me').then(res => setLeaves(res.data)).catch(() => setLeaves([]));
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); setMessage('');
    try {
      await API.post('/leave/apply', form);
      setMessage('Leave applied!');
      API.get('/leave/me').then(res => setLeaves(res.data));
    } catch (err) {
      setError(err.response?.data?.message || 'Apply failed');
    }
  };

  return (
    <div className="leave-container">
      <h2>Leave Management</h2>
      <form onSubmit={handleSubmit} className="leave-form">
        <select name="type" value={form.type} onChange={handleChange}>
          <option value="casual">Casual</option>
          <option value="sick">Sick</option>
          <option value="earned">Earned</option>
        </select>
        <input name="from" type="date" value={form.from} onChange={handleChange} required />
        <input name="to" type="date" value={form.to} onChange={handleChange} required />
        <input name="reason" value={form.reason} onChange={handleChange} placeholder="Reason" />
        <button type="submit">Apply</button>
        {message && <div className="success">{message}</div>}
        {error && <div className="error">{error}</div>}
      </form>
      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>From</th>
            <th>To</th>
            <th>Days</th>
            <th>Status</th>
            <th>Admin Comment</th>
          </tr>
        </thead>
        <tbody>
          {leaves.map(l => (
            <tr key={l._id}>
              <td>{l.type}</td>
              <td>{l.from ? l.from.substring(0,10) : ''}</td>
              <td>{l.to ? l.to.substring(0,10) : ''}</td>
              <td>{l.days}</td>
              <td>{l.status}</td>
              <td>{l.adminComment}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LeavePage;
