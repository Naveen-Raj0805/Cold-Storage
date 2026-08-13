import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import PageHeader from '../../components/PageHeader/PageHeader';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import Dropdown from '../../components/Dropdown/Dropdown';
import '../AdminSettings/AdminSettings.css'; // reuse styling

const FarmerSettings = () => {
  const { showToast } = useToast();

  const [notificationChannel, setNotificationChannel] = useState('sms');
  const [alertTemp, setAlertTemp] = useState(true);
  const [alertInvoice, setAlertInvoice] = useState(true);
  const [alertExpiry, setAlertExpiry] = useState(true);

  const handleSave = (e) => {
    e.preventDefault();
    showToast('Preferences saved successfully.', 'success');
  };

  return (
    <div className="page-container animate-fade-in">
      <PageHeader
        title="Account Settings"
        description="Verify notifications preferences, invoice reminders, and dashboard profiles."
      />

      <div className="settings-card-wrapper">
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div className="settings-section">
            <h3 className="settings-section-title">Delivery Channels</h3>
            <div className="settings-form-row">
              <Dropdown
                label="Primary Alert Relay"
                value={notificationChannel}
                onChange={(e) => setNotificationChannel(e.target.value)}
                options={[
                  { value: 'email', label: 'Email Notifications' },
                  { value: 'sms', label: 'SMS Warnings Only' },
                  { value: 'push', label: 'Push & SMS Relays' }
                ]}
                placeholder=""
              />
            </div>
          </div>

          <div className="settings-section">
            <h3 className="settings-section-title">Notification Triggers</h3>
            <div className="settings-checkbox-group">
              <label className="settings-checkbox-label">
                <input
                  type="checkbox"
                  className="settings-checkbox-input"
                  checked={alertTemp}
                  onChange={(e) => setAlertTemp(e.target.checked)}
                />
                <span>Alert me if chamber temperature sensors cross safe margins.</span>
              </label>

              <label className="settings-checkbox-label">
                <input
                  type="checkbox"
                  className="settings-checkbox-input"
                  checked={alertInvoice}
                  onChange={(e) => setAlertInvoice(e.target.checked)}
                />
                <span>Notify me when invoices are compiled and billed.</span>
              </label>

              <label className="settings-checkbox-label">
                <input
                  type="checkbox"
                  className="settings-checkbox-input"
                  checked={alertExpiry}
                  onChange={(e) => setAlertExpiry(e.target.checked)}
                />
                <span>Notify me 15 days before storage rental contract expiry dates.</span>
              </label>
            </div>
          </div>

          <div className="settings-actions">
            <Button type="submit" variant="primary" icon={<Save size={16} />}>
              Save Preferences
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default FarmerSettings;
