import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import { useNavigate } from 'react-router-dom';
import '../styles/Auth.css';

function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', department: '', designation: '' });
  const [departments, setDepartments] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    try {
      await API.post('/auth/register', form);
      setMessage('Registration successful! Please check your email to verify.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <div className="auth-header">
          <h2 className="auth-title">Create Account</h2>
          <p className="auth-subtitle">Join the Employee Management System</p>
        </div>
        
        {error && (
          <div className="auth-alert error">
            <span className="icon">⚠️</span>
            {error}
          </div>
        )}
        
        {message && (
          <div className="auth-alert success">
            <span className="icon">✅</span>
            {message}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              name="name"
              className="auth-input"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <span className="input-icon">👤</span>
          </div>
          
          <div className="form-group">
            <input
              name="email"
              type="email"
              className="auth-input"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              required
            />
            <span className="input-icon">📧</span>
          </div>
          
          <div className="form-group">
            <input
              name="password"
              type="password"
              className="auth-input"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <span className="input-icon">🔒</span>
          </div>
          
          <div className="form-group">
            <input
              name="phone"
              className="auth-input"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
            />
            <span className="input-icon">📱</span>
          </div>
          
          <div className="form-group">
            <select
              name="department"
              className="auth-input"
              value={form.department}
              onChange={handleChange}
              required
            >
              <option value="">Select Department</option>
              {departments.map(d => (
                <option key={d._id} value={d._id}>{d.name}</option>
              ))}
            </select>
            <span className="input-icon">🏢</span>
          </div>
          
          <div className="form-group">
            <input
              name="designation"
              className="auth-input"
              placeholder="Job Designation"
              value={form.designation}
              onChange={handleChange}
            />
            <span className="input-icon">💼</span>
          </div>
          
          <button type="submit" className="auth-button" disabled={loading}>
            {loading && <div className="loading-spinner"></div>}
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        
        <div className="auth-link">
          Already have an account? <a href="/login">Sign In</a>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
