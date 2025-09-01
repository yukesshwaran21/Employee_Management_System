import React, { useEffect, useState } from 'react';
import API from '../utils/api';
import '../styles/Components.css';

function NotificationDropdown() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await API.get('/notification');
      setNotifications(res.data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await API.put(`/notification/read/${id}`);
      setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <div className="notification-dropdown">
      <button className="btn-notification" onClick={() => setOpen(!open)}>
        <span role="img" aria-label="Notifications">🔔</span>
        {notifications.filter(n => !n.isRead).length > 0 && (
          <span className="notification-badge">{notifications.filter(n => !n.isRead).length}</span>
        )}
      </button>
      {open && (
        <div className="dropdown-menu">
          <h4>Notifications</h4>
          {notifications.length === 0 ? (
            <div className="empty-notification">No notifications</div>
          ) : (
            notifications.map(n => (
              <div key={n._id} className={`notification-item${n.isRead ? ' read' : ''}`}>
                <div className="notification-message">{n.message}</div>
                <div className="notification-date">{new Date(n.createdAt).toLocaleString()}</div>
                {!n.isRead && (
                  <button className="mark-read-btn" onClick={() => handleMarkAsRead(n._id)}>Mark as read</button>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationDropdown;
