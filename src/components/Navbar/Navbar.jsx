import React, { useState, useEffect, useRef } from 'react';
import { Menu, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { mockNotifications } from '../../data/mockData';
import './Navbar.css';

const Navbar = ({ onToggleSidebar, title, user }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const dropdownRef = useRef(null);

  // Filter notifications by role
  useEffect(() => {
    if (user?.role) {
      const filtered = mockNotifications.filter(
        (n) => n.role === user.role
      );
      setNotifications(filtered);
    }
  }, [user]);

  // Handle clicking outside notifications dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleNotificationClick = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button
          className="navbar-toggle-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
        >
          <Menu size={20} />
        </button>
        <span className="navbar-title">{title}</span>
      </div>

      <div className="navbar-right">
        {/* Notifications Dropdown wrapper */}
        <div className="navbar-notification-wrapper" ref={dropdownRef}>
          <button
            className="navbar-notification-btn"
            onClick={() => setShowNotifications((prev) => !prev)}
            aria-label={`View notifications, ${unreadCount} unread`}
            aria-haspopup="true"
            aria-expanded={showNotifications}
          >
            <Bell size={20} />
            {unreadCount > 0 && <span className="notification-badge-dot" />}
          </button>

          {showNotifications && (
            <div className="notification-dropdown">
              <div className="notification-dropdown-header">
                <span className="notification-dropdown-title">Notifications</span>
                {unreadCount > 0 && (
                  <button className="notification-dropdown-clear" onClick={markAllRead}>
                    Mark all read
                  </button>
                )}
              </div>
              <div className="notification-dropdown-list">
                {notifications.length === 0 ? (
                  <div className="notification-empty">No notifications</div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`notification-dropdown-item ${!n.read ? 'unread' : ''}`}
                      onClick={() => handleNotificationClick(n.id)}
                    >
                      <span className="notification-item-title">{n.title}</span>
                      <span className="notification-item-desc">{n.message}</span>
                    </div>
                  ))
                )}
              </div>
              <div className="notification-dropdown-footer">
                <Link
                  to={user?.role === 'farmer' ? '/farmer/notifications' : '#'}
                  className="notification-view-all-link"
                  onClick={() => setShowNotifications(false)}
                >
                  View all alerts
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User profile section */}
        <div className="navbar-user-profile">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop'}
            alt=""
            className="navbar-user-profile-img"
          />
          <span className="navbar-user-profile-name">{user?.name?.split(' ')[0] || 'User'}</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
