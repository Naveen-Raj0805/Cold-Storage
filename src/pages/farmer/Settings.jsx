import React, { useState } from 'react';
import { Save, Bell, ShieldCheck } from 'lucide-react';
import Button from '../../components/Button/Button';

const FarmerSettings = () => {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccess(false);

    setTimeout(() => {
      setIsSaving(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 600);
  };

  return (
    <div className="d-flex flex-column gap-lg" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div>
        <h2 className="text-bold" style={{ fontSize: '22px' }}>Account Settings</h2>
        <p className="text-secondary-color" style={{ fontSize: '14px' }}>
          Manage your notification channels and security preferences
        </p>
      </div>

      {success && (
        <div className="card-base bg-success-light p-md animate-fade-in" style={{ border: '1px solid rgba(34, 197, 94, 0.2)' }}>
          <span className="text-semibold" style={{ color: 'var(--dark-green)', fontSize: '14px' }}>Preferences updated successfully.</span>
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="d-flex flex-column gap-lg">
        {/* Card 1: Alert Methods */}
        <div className="card-base p-lg d-flex flex-column gap-md">
          <div className="d-flex align-center gap-sm mb-xs" style={{ borderBottom: '1px solid var(--border)', paddingBottom: 'var(--spacing-sm)' }}>
            <Bell size={20} className="text-secondary-color" style={{ color: 'var(--primary-green)' }} />
            <h3 className="text-semibold m-0" style={{ fontSize: '16px' }}>Notification Subscriptions</h3>
          </div>

          <div className="d-flex flex-column gap-sm">
            <label className="remember-me" style={{ gap: '12px' }}>
              <input 
                type="checkbox" 
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
              />
              <div>
                <span className="text-semibold" style={{ display: 'block', color: 'var(--text-primary)' }}>Email Incident Sync</span>
                <span style={{ fontSize: '12px' }}>Receive automatic alerts to your contact email address when chamber conditions fluctuate</span>
              </div>
            </label>

            <label className="remember-me" style={{ gap: '12px', marginTop: '4px' }}>
              <input 
                type="checkbox" 
                checked={smsAlerts}
                onChange={(e) => setSmsAlerts(e.target.checked)}
              />
              <div>
                <span className="text-semibold" style={{ display: 'block', color: 'var(--text-primary)' }}>SMS Warning Notifications</span>
                <span style={{ fontSize: '12px' }}>Receive warning alerts as SMS text messages on your mobile device</span>
              </div>
            </label>
          </div>
        </div>

        {/* Save Actions */}
        <div className="d-flex justify-end">
          <Button type="submit" variant="primary" icon={Save} loading={isSaving}>
            Save Preferences
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FarmerSettings;
