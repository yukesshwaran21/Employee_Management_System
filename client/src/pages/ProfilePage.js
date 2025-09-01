import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../utils/api';
import './ProfilePage.css';

function ProfilePage() {
  const { user, dispatch } = useContext(AuthContext);
  const [form, setForm] = useState(user || {});
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  if (!user) return <div>Loading...</div>;

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const res = await API.put('/employees/me', form);
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user: res.data, token: localStorage.getItem('token') } });
      setMessage('Profile updated!');
    } catch (err) {
      setError('Update failed');
    }
  };

  return (
    <div className="profile-container">
      <h2>My Profile</h2>
      <form onSubmit={handleSubmit} className="profile-form">
        <input name="name" value={form.name || ''} onChange={handleChange} placeholder="Name" required />
        <input name="phone" value={form.phone || ''} onChange={handleChange} placeholder="Phone" />
        <input name="designation" value={form.designation || ''} onChange={handleChange} placeholder="Designation" />
        <input name="profilePhoto" value={form.profilePhoto || ''} onChange={handleChange} placeholder="Profile Photo URL" />
        <button type="submit">Update</button>
        {message && <div className="success">{message}</div>}
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
}

export default ProfilePage;
