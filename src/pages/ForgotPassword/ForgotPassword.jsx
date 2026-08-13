import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { Warehouse, KeyRound, Mail, ArrowLeft } from 'lucide-react';
import { FormInput } from '../../components/UI';
import { motion, AnimatePresence } from 'framer-motion';
import './ForgotPassword.css';

export const ForgotPassword = () => {
  const { users, editUser, managers, editManager, triggerToast } = useContext(AppContext);
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const validateEmail = (emailStr) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(emailStr);
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setEmailError('');

    if (!email) {
      setEmailError('Please enter an email address.');
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }

    // Verify if the email exists in local storage / context state
    const userExists = users && users.some(u => u.email.toLowerCase() === email.toLowerCase());
    const managerExists = managers && managers.some(m => m.email.toLowerCase() === email.toLowerCase());
    const isAdmin = email.toLowerCase() === 'admin@agrifreeze.com';

    if (userExists || managerExists || isAdmin) {
      setStep(2);
    } else {
      setEmailError('This email address is not registered in the system.');
    }
  };

  const handleResetSubmit = (e) => {
    e.preventDefault();
    setPasswordError('');
    setConfirmPasswordError('');

    let hasError = false;

    if (!newPassword || newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters long.');
      hasError = true;
    }

    if (newPassword !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match.');
      hasError = true;
    }

    if (hasError) return;

    // Reset password in local storage / state
    const user = users && users.find(u => u.email.toLowerCase() === email.toLowerCase());
    const manager = managers && managers.find(m => m.email.toLowerCase() === email.toLowerCase());
    const isAdmin = email.toLowerCase() === 'admin@agrifreeze.com';

    if (user) {
      editUser(user.id, { password: newPassword });
    } else if (manager) {
      editManager(manager.id, { password: newPassword });
    } else if (isAdmin) {
      localStorage.setItem('agrifreeze-admin-password', newPassword);
    }

    triggerToast('Password Reset', 'Your password has been updated successfully.', 'success');
    navigate('/login');
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
          <span className="login-subtitle">
            {step === 1 ? 'Verify your identity to reset password' : 'Create your new secure password'}
          </span>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.form
              key="step1"
              onSubmit={handleEmailSubmit}
              className="login-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <FormInput
                label="Email Address"
                id="reset-email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError('');
                }}
                required
                error={emailError}
              />

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
                <Mail size={18} />
                <span>Verify Email Address</span>
              </motion.button>
            </motion.form>
          ) : (
            <motion.form
              key="step2"
              onSubmit={handleResetSubmit}
              className="login-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <FormInput
                label="New Password"
                id="new-password"
                name="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (passwordError) setPasswordError('');
                }}
                required
                error={passwordError}
              />

              <FormInput
                label="Confirm Password"
                id="confirm-password"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (confirmPasswordError) setConfirmPasswordError('');
                }}
                required
                error={confirmPasswordError}
              />

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
                <KeyRound size={18} />
                <span>Update Password</span>
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>

        <div style={{ display: 'flex', justifyContent: 'center', fontSize: '0.875rem', marginTop: '-0.5rem' }}>
          <Link to="/login" className="forgot-password-link" style={{ color: '#94a3b8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 500 }}>
            <motion.div 
              style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
              whileHover={{ x: -4 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <ArrowLeft size={16} />
              <span>Back to Login</span>
            </motion.div>
          </Link>
        </div>

        <div style={{ textAlign: 'center', fontSize: '0.8125rem', color: '#64748b' }}>
          AgriFreeze Enterprise Identity Management System.<br />
          System Health: <span style={{ color: 'var(--status-success)', fontWeight: 600 }}>Online</span>
        </div>
      </motion.div>
    </div>
  );
};
