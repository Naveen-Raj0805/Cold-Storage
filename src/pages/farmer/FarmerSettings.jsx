import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { Settings, Bell, Shield, Save } from 'lucide-react';
import { FormInput, FormSelect } from '../../components/UI';

export const FarmerSettings = () => {
  const { theme, setTheme, language, setLanguage, t, triggerToast } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('preferences'); // preferences, notifications, security

  // Settings states
  const [tempUnit, setTempUnit] = useState('C');
  const [cloudBackup, setCloudBackup] = useState(true);
  const [security2FA, setSecurity2FA] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    sms: true
  });
  const [marketingPref, setMarketingPref] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    current: '••••••••',
    newPass: '',
    confirm: ''
  });

  const handleSave = () => {
    triggerToast('Settings Saved', 'Your configurations have been updated.', 'success');
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!passwordForm.newPass || !passwordForm.confirm) {
      triggerToast('Validation Error', 'Password fields cannot be empty.', 'danger');
      return;
    }
    if (passwordForm.newPass !== passwordForm.confirm) {
      triggerToast('Validation Error', 'New passwords do not match.', 'danger');
      return;
    }
    triggerToast('Password Changed', 'Security credential saved successfully.', 'success');
    setPasswordForm({ current: '••••••••', newPass: '', confirm: '' });
  };

  return (
    <div>
      {/* Title */}
      <div className="page-header">
        <h1 style={{ margin: 0, fontSize: '1.875rem' }}>Account Settings</h1>
        <p className="page-subtitle">Configure environmental units, notifications, and passwords.</p>
      </div>

      <div className="settings-layout">
        {/* Left Side: Navigation tabs */}
        <aside className="settings-nav">
          <button 
            className={`settings-nav-btn ${activeTab === 'preferences' ? 'active' : ''}`}
            onClick={() => setActiveTab('preferences')}
          >
            <Settings size={16} />
            <span>Storage Preferences</span>
          </button>

          <button 
            className={`settings-nav-btn ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            <Bell size={16} />
            <span>Notifications Log</span>
          </button>

          <button 
            className={`settings-nav-btn ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <Shield size={16} />
            <span>Security keys</span>
          </button>
        </aside>

        {/* Right Side: Settings Content */}
        <main className="card-section" style={{ margin: 0 }}>
          {activeTab === 'preferences' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h3 style={{ fontSize: '1.125rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                Storage & Interface Preferences
              </h3>

              {/* Theme selection */}
              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
                  Platform Interface Theme
                </label>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    className="btn"
                    style={{
                      flex: 1,
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      border: theme === 'light' ? '2px solid var(--primary-color)' : '1px solid var(--border-color)',
                      backgroundColor: theme === 'light' ? 'var(--primary-light)' : 'var(--bg-card)',
                      color: theme === 'light' ? 'var(--primary-color)' : 'var(--text-main)',
                      cursor: 'pointer'
                    }}
                    onClick={() => setTheme('light')}
                  >
                    Light Mode
                  </button>
                  <button
                    className="btn"
                    style={{
                      flex: 1,
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      border: theme === 'dark' ? '2px solid var(--primary-color)' : '1px solid var(--border-color)',
                      backgroundColor: theme === 'dark' ? 'var(--primary-light)' : 'var(--bg-card)',
                      color: theme === 'dark' ? 'var(--primary-color)' : 'var(--text-main)',
                      cursor: 'pointer'
                    }}
                    onClick={() => setTheme('dark')}
                  >
                    Dark Mode
                  </button>
                </div>
              </div>

              {/* Temp unit */}
              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
                  Temperature Measurement Unit
                </label>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    className="btn"
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      borderRadius: 'var(--radius-md)',
                      border: tempUnit === 'C' ? '2px solid var(--primary-color)' : '1px solid var(--border-color)',
                      backgroundColor: tempUnit === 'C' ? 'var(--primary-light)' : 'var(--bg-card)',
                      color: tempUnit === 'C' ? 'var(--primary-color)' : 'var(--text-main)',
                      cursor: 'pointer'
                    }}
                    onClick={() => setTempUnit('C')}
                  >
                    Celsius (°C)
                  </button>
                  <button
                    className="btn"
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      borderRadius: 'var(--radius-md)',
                      border: tempUnit === 'F' ? '2px solid var(--primary-color)' : '1px solid var(--border-color)',
                      backgroundColor: tempUnit === 'F' ? 'var(--primary-light)' : 'var(--bg-card)',
                      color: tempUnit === 'F' ? 'var(--primary-color)' : 'var(--text-main)',
                      cursor: 'pointer'
                    }}
                    onClick={() => setTempUnit('F')}
                  >
                    Fahrenheit (°F)
                  </button>
                </div>
              </div>

              {/* Cloud backup */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--border-light)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div>
                  <strong style={{ fontSize: '0.9rem', display: 'block' }}>Telemetry Cloud Backup</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Export sensor histories automatically to cloud records every 24 hours.
                  </span>
                </div>
                <button
                  className="btn"
                  style={{
                    backgroundColor: cloudBackup ? 'var(--primary-color)' : 'var(--border-color)',
                    color: 'white',
                    padding: '0.35rem 1rem',
                    borderRadius: 'var(--radius-full)',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                  onClick={() => setCloudBackup(!cloudBackup)}
                >
                  {cloudBackup ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              <FormSelect
                label="Regional Language"
                id="pref-lang"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                options={[
                  { label: 'English (US)', value: 'en' },
                  { label: 'Spanish (Español)', value: 'es' },
                  { label: 'French (Français)', value: 'fr' },
                  { label: 'Hindi (हिन्दी)', value: 'hi' },
                  { label: 'Tamil (தமிழ்)', value: 'ta' }
                ]}
              />

              <button className="btn btn-primary" onClick={handleSave} style={{ alignSelf: 'flex-start' }}>
                <Save size={16} />
                <span>Save Preferences</span>
              </button>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h3 style={{ fontSize: '1.125rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                Notification Log Triggers
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={notifications.email}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--primary-color)' }}
                    onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })}
                  />
                  <div>
                    <strong>Email Notifications</strong>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Receive crop spoilage warnings and monthly lease invoice copies via email.
                    </span>
                  </div>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={notifications.sms}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--primary-color)' }}
                    onChange={(e) => setNotifications({ ...notifications, sms: e.target.checked })}
                  />
                  <div>
                    <strong>SMS Telemetry Alerts</strong>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Receive SMS warnings if temperature thresholds in Alpha room fluctuate critically.
                    </span>
                  </div>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={marketingPref}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--primary-color)' }}
                    onChange={(e) => setMarketingPref(e.target.checked)}
                  />
                  <div>
                    <strong>Marketing Preferences</strong>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Receive newsletters regarding regional storage rate specials and harvesting optimizations.
                    </span>
                  </div>
                </label>
              </div>

              <button className="btn btn-primary" onClick={handleSave} style={{ alignSelf: 'flex-start' }}>
                <Save size={16} />
                <span>Save Notification Settings</span>
              </button>
            </div>
          )}

          {activeTab === 'security' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h3 style={{ fontSize: '1.125rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                Account Security Credentials
              </h3>

              <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <FormInput
                  label="Current Password"
                  id="pass-curr"
                  type="password"
                  value={passwordForm.current}
                  disabled
                />
                <FormInput
                  label="New Password"
                  id="pass-new"
                  type="password"
                  value={passwordForm.newPass}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPass: e.target.value })}
                  required
                />
                <FormInput
                  label="Confirm New Password"
                  id="pass-conf"
                  type="password"
                  value={passwordForm.confirm}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                  required
                />

                <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
                  <Save size={16} />
                  <span>Update Password</span>
                </button>
              </form>

              <hr style={{ borderColor: 'var(--border-color)' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--border-light)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div>
                  <strong style={{ fontSize: '0.9rem', display: 'block' }}>Two-Factor Security (2FA)</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Protect your farmer billing profile with mobile OTP authorization codes.
                  </span>
                </div>
                <button
                  className="btn"
                  style={{
                    backgroundColor: security2FA ? 'var(--primary-color)' : 'var(--border-color)',
                    color: 'white',
                    padding: '0.35rem 1rem',
                    borderRadius: 'var(--radius-full)',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                  onClick={() => {
                    setSecurity2FA(!security2FA);
                    triggerToast(
                      security2FA ? '2FA Suspended' : '2FA Configured',
                      security2FA ? 'Authenticator keys disabled.' : 'Scan QR code to synchronize device keys.',
                      security2FA ? 'warning' : 'success'
                    );
                  }}
                >
                  {security2FA ? 'Enabled' : 'Disabled'}
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
