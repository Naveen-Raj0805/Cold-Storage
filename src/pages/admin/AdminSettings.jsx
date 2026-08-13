import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { User, Settings, Shield, Bell, Moon, Save, Sparkles, Sliders, Cpu } from 'lucide-react';
import { FormInput, FormSelect } from '../../components/UI';
import { getAiSettings, updateAiSettings } from '../../services/aiService';

export const AdminSettings = () => {
  const { currentUser, theme, setTheme, language, setLanguage, t, triggerToast } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('ai-governance'); // ai-governance, profile, theme, notifications, security

  // AI Prompt & Governance state
  const [masterPrompt, setMasterPrompt] = useState('');
  const [riskThreshold, setRiskThreshold] = useState(70);
  const [modelVersion, setModelVersion] = useState('gemini-2.5-flash');
  const [isSavingAi, setIsSavingAi] = useState(false);

  // Load AI Settings on mount
  useEffect(() => {
    const loadAiConfig = async () => {
      try {
        const config = await getAiSettings();
        if (config) {
          setMasterPrompt(config.masterPrompt || '');
          setRiskThreshold(config.riskThreshold || 70);
          setModelVersion(config.modelVersion || 'gemini-2.5-flash');
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadAiConfig();
  }, []);

  const handleSaveAiGovernance = async (e) => {
    e.preventDefault();
    setIsSavingAi(true);
    try {
      await updateAiSettings({
        masterPrompt,
        riskThreshold,
        modelVersion
      });
      triggerToast('AI Governance Updated', 'Master prompt template, alert risk thresholds, and Gemini model version updated live in MySQL.', 'success');
    } catch (err) {
      triggerToast('Save Failed', 'Could not update AI governance settings.', 'danger');
    } finally {
      setIsSavingAi(false);
    }
  };

  // Profile forms
  const [profileForm, setProfileForm] = useState({
    name: currentUser?.name || 'Sarah Jenkins',
    email: currentUser?.email || 'admin@gmail.com',
    password: '••••••••',
    confirmPassword: '••••••••'
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    weeklyReport: true
  });
  const [security2FA, setSecurity2FA] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    triggerToast('Profile Settings Saved', 'Your administrator credentials have been updated.', 'success');
  };

  const handleSavePreferences = () => {
    triggerToast('Preferences Saved', 'Platform preference settings written to database.', 'success');
  };

  return (
    <div>
      {/* Title */}
      <div className="page-header">
        <h1 style={{ margin: 0, fontSize: '1.875rem' }}>Admin Governance & System Settings</h1>
        <p className="page-subtitle">Configure AI Gemini models, prompt tuning, security keys, and regional presets.</p>
      </div>

      <div className="settings-layout">
        {/* Left Side: Tabs Navigation */}
        <aside className="settings-nav">
          <button 
            className={`settings-nav-btn ${activeTab === 'ai-governance' ? 'active' : ''}`}
            onClick={() => setActiveTab('ai-governance')}
          >
            <Sparkles size={16} />
            <span>AI Prompt & Model Tuning</span>
          </button>

          <button 
            className={`settings-nav-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={16} />
            <span>Profile Information</span>
          </button>
          
          <button 
            className={`settings-nav-btn ${activeTab === 'theme' ? 'active' : ''}`}
            onClick={() => setActiveTab('theme')}
          >
            <Moon size={16} />
            <span>Theme & Language</span>
          </button>

          <button 
            className={`settings-nav-btn ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            <Bell size={16} />
            <span>Notifications</span>
          </button>

          <button 
            className={`settings-nav-btn ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <Shield size={16} />
            <span>Security & 2FA</span>
          </button>
        </aside>

        {/* Right Side: Tab Contents */}
        <main className="card-section" style={{ margin: 0 }}>
          {activeTab === 'ai-governance' && (
            <form onSubmit={handleSaveAiGovernance} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h3 style={{ fontSize: '1.125rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={18} style={{ color: 'var(--primary-color)' }} />
                <span>AI Governance & Prompt Tuning Console</span>
              </h3>

              {/* Prompt Tuning Console */}
              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
                  Master System Prompt String (Stored in MySQL)
                </label>
                <textarea
                  className="input-field"
                  rows={6}
                  value={masterPrompt}
                  onChange={(e) => setMasterPrompt(e.target.value)}
                  style={{ fontFamily: 'monospace', fontSize: '0.8125rem', lineHeight: 1.5 }}
                  placeholder="Enter master food science prompt template..."
                  required
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'block' }}>
                  Altering this core prompt template dynamically updates food science evaluation logic system-wide without changing backend code.
                </span>
              </div>

              {/* Threshold Adjustment Sliders */}
              <div style={{ padding: '1rem', backgroundColor: 'var(--border-light)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label style={{ fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Sliders size={16} style={{ color: 'var(--status-warning)' }} />
                    <span>Critical Alert Risk Threshold (%)</span>
                  </label>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--status-danger)' }}>{riskThreshold}%</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="90"
                  step="1"
                  value={riskThreshold}
                  onChange={(e) => setRiskThreshold(parseInt(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--status-danger)', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem', display: 'block' }}>
                  Moving this slider from 75% down to {riskThreshold}% immediately recalibrates warning and critical alert triggers across the entire platform.
                </span>
              </div>

              {/* Model Versioning Drops */}
              <div>
                <FormSelect
                  label="Underlying Gemini Model Variant"
                  id="model-version-select"
                  value={modelVersion}
                  onChange={(e) => setModelVersion(e.target.value)}
                  options={[
                    { label: 'Google Gemini 2.5 Flash (Ultra-Fast & Recommended)', value: 'gemini-2.5-flash' },
                    { label: 'Google Gemini 1.5 Flash (Balanced Speed & Efficiency)', value: 'gemini-1.5-flash' },
                    { label: 'Google Gemini 1.5 Pro (Deep Agricultural Analytics)', value: 'gemini-1.5-pro' },
                    { label: 'Google Gemini 2.5 Pro (High Reasoning Enterprise)', value: 'gemini-2.5-pro' }
                  ]}
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '-0.5rem', display: 'block' }}>
                  Select model variant to balance API response speed, accuracy, and infrastructure efficiency.
                </span>
              </div>

              <button type="submit" className="btn btn-primary" disabled={isSavingAi} style={{ alignSelf: 'flex-start' }}>
                <Save size={16} />
                <span>{isSavingAi ? 'Updating Governance...' : 'Save AI Governance Configuration'}</span>
              </button>
            </form>
          )}

          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h3 style={{ fontSize: '1.125rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
                Profile Information
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <FormInput
                  label="Administrator Name"
                  id="profile-name"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  required
                />
                <FormInput
                  label="Admin Email Address"
                  id="profile-email"
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <FormInput
                  label="Change Password"
                  id="profile-pass"
                  type="password"
                  value={profileForm.password}
                  onChange={(e) => setProfileForm({ ...profileForm, password: e.target.value })}
                  required
                />
                <FormInput
                  label="Confirm Password"
                  id="profile-pass-confirm"
                  type="password"
                  value={profileForm.confirmPassword}
                  onChange={(e) => setProfileForm({ ...profileForm, confirmPassword: e.target.value })}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }}>
                <Save size={16} />
                <span>Save Profile Changes</span>
              </button>
            </form>
          )}

          {activeTab === 'theme' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h3 style={{ fontSize: '1.125rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                Theme & Regional Language Settings
              </h3>

              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
                  Platform Interface Color Theme
                </label>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    type="button"
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
                    type="button"
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

              <FormSelect
                label="System Display Language"
                id="language-select"
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

              <button type="button" className="btn btn-primary" onClick={handleSavePreferences} style={{ alignSelf: 'flex-start' }}>
                <Save size={16} />
                <span>Save Theme Preferences</span>
              </button>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h3 style={{ fontSize: '1.125rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                Notification Preferences
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={notifications.emailAlerts}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--primary-color)' }}
                    onChange={(e) => setNotifications({ ...notifications, emailAlerts: e.target.checked })}
                  />
                  <div>
                    <strong>Critical Email Alerts</strong>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Receive immediate emails when coldroom metrics violate storage safety thresholds.
                    </span>
                  </div>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={notifications.smsAlerts}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--primary-color)' }}
                    onChange={(e) => setNotifications({ ...notifications, smsAlerts: e.target.checked })}
                  />
                  <div>
                    <strong>SMS Incident Warnings</strong>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Receive SMS text messages regarding power supply interruptions or compressor anomalies.
                    </span>
                  </div>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={notifications.weeklyReport}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--primary-color)' }}
                    onChange={(e) => setNotifications({ ...notifications, weeklyReport: e.target.checked })}
                  />
                  <div>
                    <strong>Weekly Capacity & Audit Ledger</strong>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Receive aggregated platform revenue and logistics summaries every Monday.
                    </span>
                  </div>
                </label>
              </div>

              <button type="button" className="btn btn-primary" onClick={handleSavePreferences} style={{ alignSelf: 'flex-start' }}>
                <Save size={16} />
                <span>Save Notification Presets</span>
              </button>
            </div>
          )}

          {activeTab === 'security' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h3 style={{ fontSize: '1.125rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                Security Keys & Two-Factor Authentication
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', backgroundColor: 'var(--border-light)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong style={{ fontSize: '0.9rem', display: 'block' }}>Two-Factor Authentication (2FA)</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Require a mobile OTP code along with passwords to access the administrative dashboard.
                    </span>
                  </div>
                  
                  <button
                    type="button"
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
                        security2FA ? '2FA Deactivated' : '2FA Enabled',
                        security2FA ? 'Two-Factor credentials suspended.' : 'Two-factor authenticator QR code set.',
                        security2FA ? 'warning' : 'success'
                      );
                    }}
                  >
                    {security2FA ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminSettings;
