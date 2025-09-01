import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../utils/api';
import '../styles/ProfilePage.css';

function ProfilePage() {
  const { user, dispatch } = useContext(AuthContext);
  const [form, setForm] = useState(user || {});
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  if (!user) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <div className="loading-text">Loading your profile...</div>
      </div>
    );
  }

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const res = await API.put('/employees/me', form);
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user: res.data, token: localStorage.getItem('token') } });
      setMessage('Profile updated successfully! 🎉');
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setForm(user);
    setIsEditing(false);
    setError('');
    setMessage('');
  };

  const getUserInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';
  };

  return (
    <div className="profile-wrapper">
      <div className="profile-container fade-in">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-header-content">
            <div className="profile-avatar">
              {form.profilePhoto ? (
                <img src={form.profilePhoto} alt="Profile" />
              ) : (
                getUserInitials(form.name)
              )}
            </div>
            
            <div className="profile-info">
              <h1 className="profile-name">{form.name || 'User'}</h1>
              <div className="profile-role">
                <span>👔</span>
                {form.role ? form.role.charAt(0).toUpperCase() + form.role.slice(1) : 'Employee'}
              </div>
              <div className="profile-email">{form.email}</div>
            </div>
            
            <div className="profile-actions">
              {!isEditing ? (
                <button 
                  className="edit-button"
                  onClick={() => setIsEditing(true)}
                >
                  <span>✏️</span>
                  Edit Profile
                </button>
              ) : (
                <button 
                  className="edit-button"
                  onClick={handleCancel}
                >
                  <span>👁️</span>
                  View Mode
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="profile-stats">
          <div className="stat-card">
            <div className="stat-icon">
              <span>🗓️</span>
            </div>
            <div className="stat-label">Joined</div>
            <div className="stat-value">
              {form.createdAt ? new Date(form.createdAt).getFullYear() : 'N/A'}
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <span>🏢</span>
            </div>
            <div className="stat-label">Department</div>
            <div className="stat-value">
              {form.department?.name || 'Not Assigned'}
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <span>💼</span>
            </div>
            <div className="stat-label">Position</div>
            <div className="stat-value">
              {form.designation || 'Not Specified'}
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <span>📊</span>
            </div>
            <div className="stat-label">Status</div>
            <div className="stat-value">
              {form.status || 'Active'}
            </div>
          </div>
        </div>

        {/* Messages */}
        {message && (
          <div className="message-container">
            <div className="success-message">
              <span>✅</span>
              {message}
            </div>
          </div>
        )}
        
        {error && (
          <div className="message-container">
            <div className="error-message">
              <span>⚠️</span>
              {error}
            </div>
          </div>
        )}

        {/* Profile Form */}
        <div className="profile-form-section">
          <h3 className="form-title">
            <span>👤</span>
            {isEditing ? 'Edit Profile Information' : 'Profile Information'}
          </h3>
          
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                name="name"
                className="form-input"
                value={form.name || ''}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                disabled={!isEditing}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                name="email"
                type="email"
                className="form-input"
                value={form.email || ''}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                disabled={true} // Email usually shouldn't be editable
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                name="phone"
                className="form-input"
                value={form.phone || ''}
                onChange={handleChange}
                placeholder="Enter your phone number"
                disabled={!isEditing}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Job Designation</label>
              <input
                name="designation"
                className="form-input"
                value={form.designation || ''}
                onChange={handleChange}
                placeholder="Enter your job title"
                disabled={!isEditing}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Profile Photo URL</label>
              <input
                name="profilePhoto"
                className="form-input"
                value={form.profilePhoto || ''}
                onChange={handleChange}
                placeholder="Enter profile photo URL"
                disabled={!isEditing}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Bio / Description</label>
              <textarea
                name="bio"
                className="form-input form-textarea"
                value={form.bio || ''}
                onChange={handleChange}
                placeholder="Tell us about yourself..."
                disabled={!isEditing}
              />
            </div>

            {isEditing && (
              <div className="form-actions">
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  <span>❌</span>
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="save-button"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="form-loading">
                      <div className="spinner"></div>
                      Saving...
                    </div>
                  ) : (
                    <>
                      <span>💾</span>
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
