import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { Warehouse, UserPlus } from 'lucide-react';
import { FormInput, FormSelect } from '../../components/UI';
import { motion } from 'framer-motion';
import { register as registerApi, getStorages, getChambersByStorage, createBooking, getBookings } from '../../services/api';
import './Signup.css';

export const Signup = () => {
  const { triggerToast } = useContext(AppContext);
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'farmer',
    storageId: '',
    chamberId: ''
  });

  const [storagesList, setStoragesList] = useState([]);
  const [availableChambers, setAvailableChambers] = useState([]);
  const [isLoadingChambers, setIsLoadingChambers] = useState(false);
  const [errors, setErrors] = useState({});

  // Fetch Storages list on mount
  useEffect(() => {
    const fetchStorages = async () => {
      try {
        const data = await getStorages();
        setStoragesList(Array.isArray(data) ? data : []);
      } catch (err) {
        console.warn("Failed to fetch storages for signup", err);
      }
    };
    fetchStorages();
  }, []);

  // Fetch Available Chambers when selected Storage changes
  useEffect(() => {
    const fetchChambers = async () => {
      if (!formData.storageId) {
        setAvailableChambers([]);
        return;
      }
      setIsLoadingChambers(true);
      try {
        const sId = Number(formData.storageId.replace(/[^0-9]/g, '')) || formData.storageId;
        const chambersData = await getChambersByStorage(sId);
        const allBookings = await getBookings().catch(() => []);

        // Filter out chambers that are currently APPROVED or marked BOOKED/OCCUPIED in database
        const approvedChambers = new Set(
          (allBookings || [])
            .filter(b => b.status && b.status.toLowerCase() === 'approved')
            .map(b => b.chamberName || b.chamberId)
            .filter(Boolean)
        );

        const filtered = (chambersData || []).filter(ch => {
          const isStatusAvailable = !ch.status || ch.status.toUpperCase() === 'AVAILABLE';
          const isNotApproved = !approvedChambers.has(ch.name) && !approvedChambers.has(ch.chamberCode) && !approvedChambers.has(String(ch.id));
          return isStatusAvailable && isNotApproved;
        });

        setAvailableChambers(filtered);
      } catch (err) {
        console.warn("Failed to fetch available chambers", err);
        setAvailableChambers([]);
      } finally {
        setIsLoadingChambers(false);
      }
    };

    fetchChambers();
  }, [formData.storageId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: value,
      ...(name === 'storageId' ? { chamberId: '' } : {}) 
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[0-9\s\-()]{10,15}$/;

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required.';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required.';
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format.';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required.';
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number (10-15 digits).';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters.';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm password is required.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (!formData.storageId) newErrors.storageId = 'Please select a Cold Storage facility.';
    if (!formData.chamberId) newErrors.chamberId = 'Please select an available Chamber.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`;
      const payload = {
        fullName,
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        phone: formData.phone.trim(),
        role: 'FARMER'
      };

      const userRes = await registerApi(payload);

      if (formData.storageId && formData.chamberId) {
        const selectedStorage = storagesList.find(s => String(s.id) === String(formData.storageId) || s.name === formData.storageId);
        const selectedChamber = availableChambers.find(c => String(c.id) === String(formData.chamberId) || c.name === formData.chamberId || c.chamberCode === formData.chamberId);

        const bookingPayload = {
          farmerId: String(userRes?.id || Date.now()),
          farmerName: fullName,
          storageId: String(selectedStorage?.id || formData.storageId),
          storageName: selectedStorage?.name || 'Cold Storage Facility',
          chamberId: String(selectedChamber?.id || formData.chamberId),
          chamberName: selectedChamber?.name || selectedChamber?.chamberCode || 'Chamber 1',
          category: 'General Crops',
          weight: '10 Tons',
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0],
          price: 500.0,
          status: 'Pending'
        };

        await createBooking(bookingPayload);
      }

      triggerToast('Signup Request Sent!', `Registration & Storage Request submitted. Request sent to Manager for approval!`, 'success');
      navigate('/login');
    } catch (err) {
      setErrors(prev => ({ ...prev, email: err.message || 'Registration failed.' }));
      triggerToast('Registration Failed', err.message || 'Registration failed.', 'danger');
    }
  };

  const roleOptions = [
    { value: 'farmer', label: 'Farmer' },
    { value: 'manager', label: 'Storage Manager' }
  ];

  const storageOptions = [
    { label: '-- Select Cold Storage Facility --', value: '' },
    ...storagesList.map(s => ({ label: `${s.name} (${s.location})`, value: String(s.id) }))
  ];

  const chamberOptions = [
    { label: isLoadingChambers ? 'Loading available chambers...' : '-- Select Available Chamber --', value: '' },
    ...availableChambers.map(c => ({ 
      label: `${c.name || c.chamberCode} (Cap: ${c.capacity}T, Status: Available)`, 
      value: String(c.id) 
    }))
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut', when: 'beforeChildren', staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
  };

  return (
    <div className="login-page">
      <div className="login-bg-decor" />
      <div className="login-bg-decor-2" />

      <motion.div 
        className="login-card" 
        style={{ maxWidth: '540px' }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="login-header">
          <div className="login-logo">
            <span className="login-logo-icon"><Warehouse size={28} strokeWidth={2.5} /></span>
            <span>AgriFreeze</span>
          </div>
          <h2 style={{ color: 'white', fontSize: '1.25rem', fontWeight: 600 }}>Create Your Account</h2>
          <span className="login-subtitle">Farmer Registration & Cold Storage Allocation Request</span>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="signup-grid">
            <motion.div variants={itemVariants}>
              <FormInput
                label="First Name"
                id="signup-firstname"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                error={errors.firstName}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <FormInput
                label="Last Name"
                id="signup-lastname"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                error={errors.lastName}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <FormInput
                label="Email Address"
                id="signup-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                error={errors.email}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <FormInput
                label="Phone Number"
                id="signup-phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                required
                error={errors.phone}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <FormInput
                label="Password"
                id="signup-password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                error={errors.password}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <FormInput
                label="Confirm Password"
                id="signup-confirmpassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                error={errors.confirmPassword}
              />
            </motion.div>
          </div>

          <motion.div variants={itemVariants} style={{ marginTop: '0.75rem' }}>
            <FormSelect
              label="Select Target Cold Storage Facility"
              id="signup-storage"
              name="storageId"
              value={formData.storageId}
              onChange={handleChange}
              required
              options={storageOptions}
              error={errors.storageId}
            />
          </motion.div>

          {formData.storageId && (
            <motion.div variants={itemVariants} style={{ marginTop: '0.75rem' }}>
              <FormSelect
                label="Select Available Chamber"
                id="signup-chamber"
                name="chamberId"
                value={formData.chamberId}
                onChange={handleChange}
                required
                options={chamberOptions}
                error={errors.chamberId}
              />
              {availableChambers.length === 0 && !isLoadingChambers && (
                <div style={{ color: '#f87171', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                  ⚠️ All chambers in this facility are currently booked. Please select another storage facility.
                </div>
              )}
            </motion.div>
          )}

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
              marginTop: '1rem'
            }}
            variants={itemVariants}
            whileHover={{ scale: 1.01, backgroundColor: 'var(--primary-hover)' }}
            whileTap={{ scale: 0.99 }}
          >
            <UserPlus size={18} />
            <span>Submit Registration & Request Allocation</span>
          </motion.button>
        </form>

        <div className="signup-footer">
          Already have an account?
          <span 
            className="signup-login-link"
            onClick={() => navigate('/login')}
          >
            Sign In
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
