import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', department: '', designation: '' });
  const [departments, setDepartments] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/department')
      .then(res => setDepartments(res.data))
      .catch(() => setDepartments([]));
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      await API.post('/auth/register', form);
      setMessage('Registration successful! Please check your email to verify.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
        <select name="department" value={form.department} onChange={handleChange} required>
          <option value="">Select Department</option>
          {departments.map(d => (
            <option key={d._id} value={d._id}>{d.name}</option>
          ))}
        </select>
        <input name="designation" placeholder="Designation" value={form.designation} onChange={handleChange} />
        <button type="submit">Register</button>
        {error && <div className="error">{error}</div>}
        {message && <div className="success">{message}</div>}
      </form>
      <p>Already have an account? <a href="/login">Login</a></p>
    </div>
  );
}

export default RegisterPage;
