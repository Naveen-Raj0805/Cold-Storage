import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import PageHeader from '../../components/PageHeader/PageHeader';
import ProfileCard from '../../components/ProfileCard/ProfileCard';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import '../ManagerProfile/ManagerProfile.css'; // reuse styling

const FarmerProfile = () => {
  const { user } = useOutletContext();
  const { showToast } = useToast();

  const [profileName, setProfileName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileFarm, setProfileFarm] = useState('');
  const [profileLocation, setProfileLocation] = useState('');

  useEffect(() => {
    if (user) {
      setProfileName(user.name);
      setProfileEmail(user.email);
      setProfilePhone(user.phone || '');
      setProfileFarm(user.farmName || '');
      setProfileLocation(user.location || '');
    }
  }, [user]);

  const handleProfileSave = (e) => {
    e.preventDefault();
    localStorage.setItem('profile_name', profileName);
    localStorage.setItem('profile_email', profileEmail);
    localStorage.setItem('profile_phone', profilePhone);
    localStorage.setItem('profile_farm', profileFarm);
    localStorage.setItem('profile_location', profileLocation);
    showToast('Farmer profile details updated.', 'success');
  };

  return (
    <div className="page-container animate-fade-in">
      <PageHeader
        title="Farmer Profile"
        description="Verify stored credentials, active farm organization settings, and phone links."
      />

      <div className="profile-grid-container">
        {/* Left Side Card */}
        {user && (
          <ProfileCard
            user={{
              ...user,
              name: profileName || user.name,
              email: profileEmail || user.email,
              phone: profilePhone || user.phone,
              farmName: profileFarm || user.farmName,
              location: profileLocation || user.location
            }}
          />
        )}

        {/* Right Side Settings */}
        <div className="profile-edit-form-card">
          <h3 className="profile-form-section-title">Modify Farmer Profile Details</h3>

          <form onSubmit={handleProfileSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <Input
              label="Farmer Full Name"
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
              label="Farm Organization Name"
              name="farm"
              value={profileFarm}
              onChange={(e) => setProfileFarm(e.target.value)}
              required
            />
            <Input
              label="Farm Operational Location"
              name="location"
              value={profileLocation}
              onChange={(e) => setProfileLocation(e.target.value)}
              required
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <Button type="submit" variant="primary" icon={<Save size={16} />}>
                Save Details
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FarmerProfile;
