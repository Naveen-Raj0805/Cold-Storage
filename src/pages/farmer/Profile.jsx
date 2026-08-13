import React, { useState, useEffect } from 'react';
import { User, MapPin, Landmark, Phone, Save } from 'lucide-react';
import Button from '../../components/Button/Button';
import { getCurrentUser } from '../../services/mockData';

const FarmerProfile = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [farmName, setFarmName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setName(currentUser.name);
      setEmail(currentUser.email);
      setPhone(currentUser.phone || '+1-555-0100');
      setFarmName(currentUser.farmName || 'My Acres');
    }
  }, []);

  const handleProfileSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccess(false);

    setTimeout(() => {
      const updatedUser = { ...user, name, email, phone, farmName };
      localStorage.setItem('agrifreeze_current_user', JSON.stringify(updatedUser));
      setIsSaving(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      
      // Dispatch sync event
      window.dispatchEvent(new Event('alertsUpdated'));
    }, 600);
  };

  if (!user) return null;

  return (
    <div className="d-flex flex-column gap-lg" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div>
        <h2 className="text-bold" style={{ fontSize: '22px' }}>Farmer Profile</h2>
        <p className="text-secondary-color" style={{ fontSize: '14px' }}>
          Inspect credentials and manage contact settings for your farm account
        </p>
      </div>

      {success && (
        <div className="card-base bg-success-light p-md animate-fade-in" style={{ border: '1px solid rgba(34, 197, 94, 0.2)' }}>
          <span className="text-semibold" style={{ color: 'var(--dark-green)', fontSize: '14px' }}>Profile saved successfully.</span>
        </div>
      )}

      <div className="d-grid grid-cols-3 gap-md">
        {/* Left Profile Card */}
        <div style={{ gridColumn: 'span 1' }}>
          <div className="card-base text-center p-lg d-flex flex-column align-center gap-md">
            <div className="user-avatar" style={{ width: '80px', height: '80px', fontSize: '32px', margin: '0 auto' }}>
              {name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-semibold m-0" style={{ fontSize: '18px' }}>{name}</h3>
              <span className="text-secondary-color" style={{ fontSize: '12px' }}>{user.role}</span>
            </div>
            
            <div className="d-flex flex-column gap-xs text-left" style={{ width: '100%', borderTop: '1px solid var(--border)', paddingTop: 'var(--spacing-md)' }}>
              <div className="d-flex align-center gap-sm text-secondary-color" style={{ fontSize: '12px' }}>
                <Landmark size={14} />
                <span>Farm: <span className="text-semibold" style={{ color: 'var(--text-primary)' }}>{farmName}</span></span>
              </div>
              <div className="d-flex align-center gap-sm text-secondary-color" style={{ fontSize: '12px', marginTop: '4px' }}>
                <Phone size={14} />
                <span>Phone: <span className="text-semibold" style={{ color: 'var(--text-primary)' }}>{phone}</span></span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Info Form */}
        <div style={{ gridColumn: 'span 2' }}>
          <div className="card-base p-lg">
            <h3 className="text-semibold mb-lg" style={{ fontSize: '16px', borderBottom: '1px solid var(--border)', paddingBottom: 'var(--spacing-sm)' }}>
              Farm Credentials
            </h3>
            
            <form onSubmit={handleProfileSave} className="d-flex flex-column gap-md">
              <div className="d-grid grid-cols-2 gap-md">
                <div className="form-group">
                  <label htmlFor="fprof-name">Full Name</label>
                  <input 
                    id="fprof-name"
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required
                    className="login-input"
                    style={{ paddingLeft: '14px', height: '42px' }}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="fprof-farm">Farm Name</label>
                  <input 
                    id="fprof-farm"
                    type="text" 
                    value={farmName} 
                    onChange={(e) => setFarmName(e.target.value)} 
                    required
                    className="login-input"
                    style={{ paddingLeft: '14px', height: '42px' }}
                  />
                </div>
              </div>

              <div className="d-grid grid-cols-2 gap-md">
                <div className="form-group">
                  <label htmlFor="fprof-email">Email Address</label>
                  <input 
                    id="fprof-email"
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required
                    className="login-input"
                    style={{ paddingLeft: '14px', height: '42px' }}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="fprof-phone">Contact Phone</label>
                  <input 
                    id="fprof-phone"
                    type="text" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    required
                    className="login-input"
                    style={{ paddingLeft: '14px', height: '42px' }}
                  />
                </div>
              </div>

              <div className="d-flex justify-end mt-sm">
                <Button type="submit" variant="primary" icon={Save} loading={isSaving}>
                  Save Profile Settings
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerProfile;
