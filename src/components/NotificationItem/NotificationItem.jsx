import React from 'react';
import { CheckCircle, AlertOctagon, AlertTriangle, Bell } from 'lucide-react';
import './NotificationItem.css';

const NotificationItem = ({ notification, onMarkRead }) => {
  const { title, message, type, date, read } = notification;

  const getIcon = () => {
    switch (type?.toLowerCase()) {
      case 'success':
        return <CheckCircle size={18} />;
      case 'critical':
      case 'error':
        return <AlertOctagon size={18} />;
      case 'warning':
        return <AlertTriangle size={18} />;
      case 'info':
      default:
        return <Bell size={18} />;
    }
  };

  const getIconClass = () => {
    switch (type?.toLowerCase()) {
      case 'success':
        return 'success';
      case 'critical':
      case 'error':
        return 'critical';
      case 'warning':
        return 'warning';
      case 'info':
      default:
        return 'info';
    }
  };

  return (
    <div className={`notification-item ${!read ? 'unread' : ''}`}>
      <div className={`notification-icon-wrapper ${getIconClass()}`}>{getIcon()}</div>
      <div className="notification-details">
        <div className="notification-title-row">
          <h4 className="notification-title">{title}</h4>
          <span className="notification-time">{date}</span>
        </div>
        <p className="notification-message">{message}</p>
        {!read && onMarkRead && (
          <button
            className="notification-mark-read-btn"
            onClick={() => onMarkRead(notification.id)}
          >
            Mark as read
          </button>
        )}
      </div>
      {!read && <span className="notification-unread-dot" title="Unread" />}
    </div>
  );
};

export default NotificationItem;
