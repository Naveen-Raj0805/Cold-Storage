import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import PageHeader from '../../components/PageHeader/PageHeader';
import ProfileCard from '../../components/ProfileCard/ProfileCard';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import './ManagerProfile.css';

const ManagerProfile = () => {
  const { user } = useOutletContext();
  const { showToast } = useToast();

  const [profileName, setProfileName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profilePassword, setProfilePassword] = useState('password');

  useEffect(() => {
    if (user) {
      setProfileName(user.name);
      setProfileEmail(user.email);
      setProfilePhone(user.phone || '');
    }
  }, [user]);

  const handleProfileSave = (e) => {
    e.preventDefault();
    localStorage.setItem('profile_name', profileName);
    localStorage.setItem('profile_email', profileEmail);
    localStorage.setItem('profile_phone', profilePhone);
    showToast('Profile contact details saved successfully.', 'success');
  };

  return (
    <div className="page-container animate-fade-in">
      <PageHeader
        title="Manager Settings"
        description="Verify assigned storage details and customize account communications settings."
      />

      <div className="profile-grid-container">
        {/* Left Side: Summary Card */}
        {user && (
          <ProfileCard
            user={{
              ...user,
              name: profileName || user.name,
              email: profileEmail || user.email,
              phone: profilePhone || user.phone
            }}
          />
        )}

        {/* Right Side: Editable Settings */}
        <div className="profile-edit-form-card">
          <h3 className="profile-form-section-title">Modify Account Profile</h3>

          <form onSubmit={handleProfileSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <Input
              label="Full Name"
              name="name"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              required
            />
            <Input
              label="Email Address"
              name="email"
              type="email"
              value={profileEmail}
              onChange={(e) => setProfileEmail(e.target.value)}
              required
            />
            <Input
              label="Phone Number"
              name="phone"
              value={profilePhone}
              onChange={(e) => setProfilePhone(e.target.value)}
              required
            />
            <Input
              label="Update Password"
              name="password"
              type="password"
              value={profilePassword}
              onChange={(e) => setProfilePassword(e.target.value)}
              required
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <Button type="submit" variant="primary" icon={<Save size={16} />}>
                Save Profile
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ManagerProfile;
