import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { Warehouse, AlertTriangle, ChevronLeft, LayoutDashboard } from 'lucide-react';

export const NotFound = () => {
  const { currentUser } = useContext(AppContext);
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoDashboard = () => {
    if (currentUser) {
      navigate(`/${currentUser.role}/dashboard`);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="error-page-container">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
        <Warehouse size={32} style={{ color: 'var(--primary-color)' }} />
        <span style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>AgriFreeze</span>
      </div>
      
      <div className="error-title">404</div>
      <div className="error-subtitle">Page Not Found</div>
      <p className="error-text">
        The cold chain path or administrative panel you are looking for does not exist, has been decommissioned, or requires higher clearance.
      </p>

      <div className="error-actions">
        <button className="btn btn-secondary" onClick={handleGoBack}>
          <ChevronLeft size={16} />
          <span>Go Back</span>
        </button>
        <button className="btn btn-primary" onClick={handleGoDashboard}>
          <LayoutDashboard size={16} />
          <span>Go Dashboard</span>
        </button>
      </div>
    </div>
  );
};
