import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const saved = sessionStorage.getItem('agrifreeze-user');
  const user = saved ? JSON.parse(saved) : null;

  if (!user) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  const userRole = user.role ? user.role.toLowerCase() : '';

  if (allowedRoles && !allowedRoles.includes(userRole) && !allowedRoles.includes(user.role)) {
    return <Navigate to={`/${userRole}/dashboard`} replace />;
  }

  return children;
};

export default ProtectedRoute;
