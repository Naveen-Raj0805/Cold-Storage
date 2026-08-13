import React from 'react';
import './Badge.css';

const Badge = ({ status = 'active', children }) => {
  const normalizedStatus = status.toLowerCase();

  const getBadgeClass = () => {
    switch (normalizedStatus) {
      case 'active':
      case 'approved':
      case 'success':
        return 'badge-active';
      case 'inactive':
      case 'disabled':
      case 'gray':
        return 'badge-inactive';
      case 'critical':
      case 'error':
      case 'danger':
      case 'rejected':
        return 'badge-critical';
      case 'warning':
      case 'pending':
        return 'badge-warning';
      case 'resolved':
      case 'info':
      case 'blue':
        return 'badge-resolved';
      default:
        return 'badge-inactive';
    }
  };

  return (
    <span className={`badge ${getBadgeClass()}`}>
      <span className="badge-dot" />
      {children || status}
    </span>
  );
};

export default Badge;
