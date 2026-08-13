import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { motion } from 'framer-motion';
import './Toast.css';

const Toast = ({ message, type = 'info', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="toast-icon" size={18} />;
      case 'error':
        return <XCircle className="toast-icon" size={18} />;
      case 'warning':
        return <AlertTriangle className="toast-icon" size={18} />;
      case 'info':
      default:
        return <Info className="toast-icon" size={18} />;
    }
  };

  return (
    <motion.div 
      className={`toast-item toast-${type}`} 
      role="alert"
      initial={{ opacity: 0, y: 25, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, y: -15 }}
      transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {getIcon()}
      <div className="toast-content">{message}</div>
      <button className="toast-close-btn" onClick={onClose} aria-label="Close Notification">
        <X size={16} />
      </button>
    </motion.div>
  );
};

export default Toast;
