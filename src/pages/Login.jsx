import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { Warehouse, ShieldCheck, ArrowLeft } from 'lucide-react';
import { FormInput } from '../components/UI';
import { motion } from 'framer-motion';
import { login as loginApi } from '../services/api';

export const Login = () => {
  const { login, currentUser } = useContext(AppContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState('');

  // If already logged in, redirect
  useEffect(() => {
    if (currentUser) {
      navigate(`/${currentUser.role}/dashboard`);
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!email) {
      setValidationError('Please enter a valid email address.');
      return;
    }

    const cleanEmail = email.trim().toLowerCase();

    // Authenticate through backend REST API (POST /api/auth/login)
    try {
      const response = await loginApi(cleanEmail, password || 'password');
      
      const userDetails = {
        id: response.id,
        name: response.fullName,
        role: response.role ? response.role.toLowerCase() : 'farmer',
        email: response.email,
        phone: response.phone,
        avatar: response.fullName ? response.fullName.split(' ').map(n => n[0]).join('').toUpperCase() : 'U',
        ...(response.role && response.role.toLowerCase() === 'farmer' ? { bookedStorage: 'AgriFreeze Coldroom Alpha' } : {}),
        ...(response.role && response.role.toLowerCase() === 'manager' ? { assignedStorage: 'AgriFreeze Coldroom Alpha' } : {})
      };

      login(userDetails);
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
          <h2 style={{ color: 'white', fontSize: '1.25rem', fontWeight: 600 }}>Enterprise Cold Chain Portal</h2>
          <span className="login-subtitle">Secure agricultural warehouse dashboard</span>
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
            <span>Sign In to Dashboard</span>
          </motion.button>
        </form>

        <div style={{ textAlign: 'center', fontSize: '0.875rem', color: '#94a3b8', marginTop: '-0.5rem' }}>
          Don't have an account?{' '}
          <span 
            onClick={() => navigate('/signup')} 
            style={{ color: 'var(--primary-color)', cursor: 'pointer', fontWeight: 600, textDecoration: 'underline' }}
          >
            Sign Up
          </span>
        </div>

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
