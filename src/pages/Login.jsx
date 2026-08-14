import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { Warehouse, ShieldCheck, ArrowLeft, Building2, Sprout, Zap } from 'lucide-react';
import { FormInput } from '../components/UI';
import { motion } from 'framer-motion';
import { login as loginApi } from '../services/api';

export const Login = () => {
  const { login, currentUser } = useContext(AppContext);
  const navigate = useNavigate();
  const [activeRoleTab, setActiveRoleTab] = useState('manager');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState('');

  // If already logged in, redirect
  useEffect(() => {
    if (currentUser) {
      navigate(`/${currentUser.role}/dashboard`);
    }
  }, [currentUser, navigate]);

  const handleRoleTabChange = (role) => {
    setActiveRoleTab(role);
    setValidationError('');
    setEmail('');
    setPassword('');
  };

  const handleQuickFillDemo = () => {
    setValidationError('');
    if (activeRoleTab === 'manager') {
      setEmail('717824I142@gmail.com');
      setPassword('naveen123');
    } else if (activeRoleTab === 'farmer') {
      setEmail('farmer@agrifreeze.com');
      setPassword('password');
    } else if (activeRoleTab === 'admin') {
      setEmail('admin@agrifreeze.com');
      setPassword('password');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!email) {
      setValidationError('Please enter your account email address.');
      return;
    }

    const cleanEmail = email.trim().toLowerCase();

    // Authenticate through backend REST API (POST /api/auth/login)
    try {
      const response = await loginApi(cleanEmail, password || 'password');
      
      const targetRole = response.role ? response.role.toLowerCase() : activeRoleTab;
      const userDetails = {
        id: response.id,
        name: response.fullName,
        role: targetRole,
        email: response.email,
        phone: response.phone,
        avatar: response.fullName ? response.fullName.split(' ').map(n => n[0]).join('').toUpperCase() : 'M',
        ...(targetRole === 'farmer' ? { bookedStorage: 'AgriFreeze Coldroom Alpha' } : {}),
        ...(targetRole === 'manager' ? { assignedStorage: 'AgriFreeze North Hub' } : {})
      };

      login(userDetails);
      navigate(`/${targetRole}/dashboard`, { replace: true });
    } catch (err) {
      setValidationError(err.message || 'Invalid email or password.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg-decor" />
      <div className="login-bg-decor-2" />

      <motion.div
        className="login-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="login-header">
          <div className="login-logo">
            <span className="login-logo-icon"><Warehouse size={28} strokeWidth={2.5} /></span>
            <span>AgriFreeze</span>
          </div>
          <h2 style={{ color: 'white', fontSize: '1.25rem', fontWeight: 600 }}>
            {activeRoleTab === 'manager' ? 'Storage Manager Portal' : activeRoleTab === 'admin' ? 'System Administrator Portal' : 'Farmer Cold Storage Portal'}
          </h2>
          <span className="login-subtitle">
            {activeRoleTab === 'manager' ? 'Enterprise Cold Storage Operations & Monitoring' : activeRoleTab === 'admin' ? 'Platform Governance & Facility Administration' : 'Secure Agricultural Warehouse & Capacity Booking'}
          </span>
        </div>

        {/* Role Selector Tabs */}
        <div style={{ 
          display: 'flex', 
          backgroundColor: 'rgba(255, 255, 255, 0.05)', 
          padding: '0.25rem', 
          borderRadius: 'var(--radius-md)', 
          marginBottom: '1rem', 
          border: '1px solid rgba(255, 255, 255, 0.1)' 
        }}>
          <button
            type="button"
            onClick={() => handleRoleTabChange('manager')}
            style={{
              flex: 1,
              padding: '0.45rem 0.5rem',
              fontSize: '0.8rem',
              fontWeight: 600,
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem',
              backgroundColor: activeRoleTab === 'manager' ? 'var(--primary-color)' : 'transparent',
              color: activeRoleTab === 'manager' ? 'white' : '#94a3b8',
              transition: 'all 0.2s ease'
            }}
          >
            <Building2 size={15} />
            <span>Storage Manager</span>
          </button>
          <button
            type="button"
            onClick={() => handleRoleTabChange('farmer')}
            style={{
              flex: 1,
              padding: '0.45rem 0.5rem',
              fontSize: '0.8rem',
              fontWeight: 600,
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem',
              backgroundColor: activeRoleTab === 'farmer' ? 'var(--primary-color)' : 'transparent',
              color: activeRoleTab === 'farmer' ? 'white' : '#94a3b8',
              transition: 'all 0.2s ease'
            }}
          >
            <Sprout size={15} />
            <span>Farmer</span>
          </button>
          <button
            type="button"
            onClick={() => handleRoleTabChange('admin')}
            style={{
              flex: 1,
              padding: '0.45rem 0.5rem',
              fontSize: '0.8rem',
              fontWeight: 600,
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem',
              backgroundColor: activeRoleTab === 'admin' ? 'var(--primary-color)' : 'transparent',
              color: activeRoleTab === 'admin' ? 'white' : '#94a3b8',
              transition: 'all 0.2s ease'
            }}
          >
            <ShieldCheck size={15} />
            <span>Admin</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <FormInput
            label="Email Address"
            id="login-email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            error={validationError}
          />

          <FormInput
            label="Password"
            id="login-password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8125rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked style={{ accentColor: 'var(--primary-color)' }} />
              Remember device
            </label>
            <Link to="/forgot-password" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: 600 }}>Forgot Password?</Link>
          </div>

          <motion.button 
            type="submit" 
            className="btn btn-primary"
            style={{ 
              width: '100%', 
              padding: '0.75rem', 
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              marginTop: '0.5rem'
            }}
            whileHover={{ scale: 1.01, backgroundColor: 'var(--primary-hover)' }}
            whileTap={{ scale: 0.99 }}
          >
            <ShieldCheck size={18} />
            <span>Sign In to {activeRoleTab === 'manager' ? 'Manager Dashboard' : activeRoleTab === 'admin' ? 'Admin Console' : 'Farmer Dashboard'}</span>
          </motion.button>
        </form>

        {/* Quick Demo Fill Button */}
        <div style={{ textAlign: 'center', marginTop: '-0.5rem' }}>
          <button
            type="button"
            onClick={handleQuickFillDemo}
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 'var(--radius-sm)',
              color: '#94a3b8',
              fontSize: '0.75rem',
              padding: '0.35rem 0.75rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              transition: 'all 0.2s ease'
            }}
          >
            <Zap size={13} style={{ color: '#f59e0b' }} />
            <span>Auto-fill Demo Credentials ({activeRoleTab === 'manager' ? '717824I142@gmail.com' : activeRoleTab === 'admin' ? 'admin@agrifreeze.com' : 'farmer@agrifreeze.com'})</span>
          </button>
        </div>

        {/* Create Account / Signup section - Only shown for public Farmer login, hidden for Manager & Admin */}
        {activeRoleTab === 'farmer' ? (
          <div style={{ textAlign: 'center', fontSize: '0.875rem', color: '#94a3b8', marginTop: '-0.5rem' }}>
            Don't have an account?{' '}
            <span 
              onClick={() => navigate('/signup')} 
              style={{ color: 'var(--primary-color)', cursor: 'pointer', fontWeight: 600, textDecoration: 'underline' }}
            >
              Sign Up
            </span>
          </div>
        ) : (
          <div style={{ textAlign: 'center', fontSize: '0.8125rem', color: '#64748b', marginTop: '-0.25rem' }}>
            🔒 Enterprise Account — Access Granted by System Administrator
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'center', fontSize: '0.875rem', marginTop: '-0.5rem' }}>
          <Link to="/" style={{ color: '#94a3b8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 500 }}>
            <motion.div 
              style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
              whileHover={{ x: -4 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <ArrowLeft size={16} />
              <span>Back to Home</span>
            </motion.div>
          </Link>
        </div>

        <div style={{ textAlign: 'center', fontSize: '0.8125rem', color: '#64748b' }}>
          By logging in, you agree to AgriFreeze Terms & Privacy Policy.<br />
          System Health: <span style={{ color: 'var(--status-success)', fontWeight: 600 }}>Online</span>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
