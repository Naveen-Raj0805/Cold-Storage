import React, { useState } from 'react';
import { Save, Settings } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import PageHeader from '../../components/PageHeader/PageHeader';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import Dropdown from '../../components/Dropdown/Dropdown';
import './AdminSettings.css';

const AdminSettings = () => {
  const { showToast } = useToast();

  // Settings State variables
  const [defrostCycle, setDefrostCycle] = useState('6');
  const [smtpServer, setSmtpServer] = useState('mail.agrifreeze.com');
  const [sensorPoll, setSensorPoll] = useState('15');
  const [tempAlert, setTempAlert] = useState(true);
  const [capacityAlert, setCapacityAlert] = useState(true);
  const [managerAlert, setManagerAlert] = useState(false);
  const [billingAlert, setBillingAlert] = useState(true);
  const [themeMode, setThemeMode] = useState('light');

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('adminSettings_defrost', defrostCycle);
    localStorage.setItem('adminSettings_smtp', smtpServer);
    localStorage.setItem('adminSettings_sensor', sensorPoll);
    localStorage.setItem('adminSettings_theme', themeMode);
    
    showToast('Platform administrative settings saved successfully.', 'success');
  };

  return (
    <div className="page-container animate-fade-in">
      <PageHeader
        title="System Admin Settings"
        description="Configure operational parameters, adjust notification relays, and adjust visual themes."
      />

      <div className="settings-card-wrapper">
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Section: Operational Parameters */}
          <div className="settings-section">
            <h3 className="settings-section-title">Chamber Operational Rules</h3>
            <div className="settings-form-row">
              <Input
                label="Defrost Cycle Duration (Hours)"
                name="defrost"
                type="number"
                value={defrostCycle}
                onChange={(e) => setDefrostCycle(e.target.value)}
                required
              />
              <Input
                label="Sensor Telemetry Frequency (Seconds)"
                name="sensor"
                type="number"
                value={sensorPoll}
                onChange={(e) => setSensorPoll(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Section: Network Rules */}
          <div className="settings-section">
            <h3 className="settings-section-title">Network & Notification Relays</h3>
            <div className="settings-form-row">
              <Input
                label="SMTP Mail Gateway Host"
                name="smtp"
                value={smtpServer}
                onChange={(e) => setSmtpServer(e.target.value)}
                required
              />
              <Dropdown
                label="Notification Delivery Channel"
                name="delivery"
                options={[
                  { value: 'email', label: 'Email Only' },
                  { value: 'sms', label: 'SMS & Email' },
                  { value: 'push', label: 'Push Notifications' }
                ]}
                placeholder=""
                defaultValue="email"
              />
            </div>
          </div>

          {/* Section: Alert Notifications Triggers */}
          <div className="settings-section">
            <h3 className="settings-section-title">Telemetry Alert Rules</h3>
            <div className="settings-checkbox-group">
              <label className="settings-checkbox-label">
                <input
                  type="checkbox"
                  className="settings-checkbox-input"
                  checked={tempAlert}
                  onChange={(e) => setTempAlert(e.target.checked)}
                />
                <span>Dispatch email instantly on chamber temperature sensor warnings.</span>
              </label>

              <label className="settings-checkbox-label">
                <input
                  type="checkbox"
                  className="settings-checkbox-input"
                  checked={capacityAlert}
                  onChange={(e) => setCapacityAlert(e.target.checked)}
                />
                <span>Notify manager when storage nodes exceed 90% occupied capacity.</span>
              </label>

              <label className="settings-checkbox-label">
                <input
                  type="checkbox"
                  className="settings-checkbox-input"
                  checked={managerAlert}
                  onChange={(e) => setManagerAlert(e.target.checked)}
                />
                <span>Notify administrator immediately upon a new manager registry.</span>
              </label>

              <label className="settings-checkbox-label">
                <input
                  type="checkbox"
                  className="settings-checkbox-input"
                  checked={billingAlert}
                  onChange={(e) => setBillingAlert(e.target.checked)}
                />
                <span>Send billing invoices automatically to farmers on contract milestones.</span>
              </label>
            </div>
          </div>

          {/* Section: Visual Styling */}
          <div className="settings-section">
            <h3 className="settings-section-title">Appearance & Aesthetics</h3>
            <div className="settings-form-row">
              <Dropdown
                label="Dashboard Visual Theme"
                name="theme"
                value={themeMode}
                onChange={(e) => setThemeMode(e.target.value)}
                options={[
                  { value: 'light', label: 'Sleek Light Mode' },
                  { value: 'dark', label: 'Premium Dark Mode (Mock)' }
                ]}
                placeholder=""
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="settings-actions">
            <Button type="submit" variant="primary" icon={<Save size={16} />}>
              Save Settings
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AdminSettings;
