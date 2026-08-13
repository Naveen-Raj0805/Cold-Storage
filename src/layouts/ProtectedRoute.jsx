import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const saved = sessionStorage.getItem('agrifreeze-user');
  const user = saved ? JSON.parse(saved) : null;

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const userRole = user.role ? user.role.toLowerCase() : '';

  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole) && !allowedRoles.includes(user.role)) {
    return <Navigate to="/404" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
