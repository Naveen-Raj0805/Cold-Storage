import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, AlertTriangle, ShieldCheck, Mail } from 'lucide-react';
import Button from '../../components/Button/Button';
import { getSettings, saveSettings } from '../../services/mockData';

const AdminSettings = () => {
  const [settings, setSettings] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // General Settings
  const [siteName, setSiteName] = useState('');
  const [refreshInterval, setRefreshInterval] = useState('30 seconds');
  const [defaultCurrency, setDefaultCurrency] = useState('USD');

  // Alarm Thresholds
  const [deepFreezeMaxTemp, setDeepFreezeMaxTemp] = useState(-15.0);
  const [chilledMaxTemp, setChilledMaxTemp] = useState(6.0);
  const [humidityMaxThreshold, setHumidityMaxThreshold] = useState(92);

  // Communications
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [systemBannerAlerts, setSystemBannerAlerts] = useState(true);

  useEffect(() => {
    const activeSettings = getSettings();
    if (activeSettings) {
      setSettings(activeSettings);
      
      setSiteName(activeSettings.general.siteName);
      setRefreshInterval(activeSettings.general.refreshInterval);
      setDefaultCurrency(activeSettings.general.defaultCurrency);
      
      setDeepFreezeMaxTemp(activeSettings.thresholds.deepFreezeMaxTemp);
      setChilledMaxTemp(activeSettings.thresholds.chilledMaxTemp);
      setHumidityMaxThreshold(activeSettings.thresholds.humidityMaxThreshold);
      
      setEmailAlerts(activeSettings.notifications.emailAlerts);
      setSmsAlerts(activeSettings.notifications.smsAlerts);
      setSystemBannerAlerts(activeSettings.notifications.systemBannerAlerts);
    }
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg('');

    const updated = {
      general: {
        siteName,
        refreshInterval,
        defaultCurrency
      },
      thresholds: {
        deepFreezeMaxTemp: parseFloat(deepFreezeMaxTemp),
        chilledMaxTemp: parseFloat(chilledMaxTemp),
        humidityMaxThreshold: parseInt(humidityMaxThreshold)
      },
      notifications: {
        emailAlerts,
        smsAlerts,
        systemBannerAlerts
      }
    };

    setTimeout(() => {
      saveSettings(updated);
      setSettings(updated);
      setIsSaving(false);
      setSuccessMsg('System configurations saved successfully.');
      
      // Clear message after 3 seconds
      setTimeout(() => setSuccessMsg(''), 3000);
      
      // Dispatch sync event
      window.dispatchEvent(new Event('alertsUpdated'));
    }, 600);
  };

  if (!settings) return null;

  return (
    <div className="d-flex flex-column gap-lg" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div>
        <h2 className="text-bold" style={{ fontSize: '22px' }}>System Configurations</h2>
        <p className="text-secondary-color" style={{ fontSize: '14px' }}>
          Define warning climate thresholds, refresh times, and global notification methods
        </p>
      </div>

      {successMsg && (
        <div className="card-base bg-success-light p-md animate-fade-in" style={{ border: '1px solid rgba(34, 197, 94, 0.2)' }}>
          <span className="text-semibold" style={{ color: 'var(--dark-green)', fontSize: '14px' }}>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="d-flex flex-column gap-lg">
        {/* Card 1: Console parameters */}
        <div className="card-base p-lg d-flex flex-column gap-md">
          <div className="d-flex align-center gap-sm mb-xs" style={{ borderBottom: '1px solid var(--border)', paddingBottom: 'var(--spacing-sm)' }}>
            <ShieldCheck size={20} className="text-secondary-color" style={{ color: 'var(--primary-green)' }} />
            <h3 className="text-semibold m-0" style={{ fontSize: '16px' }}>Site console Parameters</h3>
          </div>

          <div className="form-group">
            <label htmlFor="site-title">Console Display Title</label>
            <input 
              id="site-title"
              type="text" 
              value={siteName} 
              onChange={(e) => setSiteName(e.target.value)}
              className="login-input"
              style={{ paddingLeft: '14px', height: '42px' }}
            />
          </div>

          <div className="d-grid grid-cols-2 gap-md">
            <div className="form-group">
              <label htmlFor="refresh-time">Console Data Refresh Interval</label>
              <select 
                id="refresh-time"
                value={refreshInterval} 
                onChange={(e) => setRefreshInterval(e.target.value)}
                className="login-select"
                style={{ paddingLeft: '14px', height: '42px' }}
              >
                <option value="15 seconds">15 seconds (High Load)</option>
                <option value="30 seconds">30 seconds (Standard)</option>
                <option value="1 minute">1 minute</option>
                <option value="5 minutes">5 minutes (Low load)</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="base-currency">Display Currency</label>
              <select 
                id="base-currency"
                value={defaultCurrency} 
                onChange={(e) => setDefaultCurrency(e.target.value)}
                className="login-select"
                style={{ paddingLeft: '14px', height: '42px' }}
              >
                <option value="USD">USD ($) United States Dollar</option>
                <option value="EUR">EUR (€) Euro</option>
                <option value="GBP">GBP (£) British Pound</option>
              </select>
            </div>
          </div>
        </div>

        {/* Card 2: Climate warning thresholds */}
        <div className="card-base p-lg d-flex flex-column gap-md">
          <div className="d-flex align-center gap-sm mb-xs" style={{ borderBottom: '1px solid var(--border)', paddingBottom: 'var(--spacing-sm)' }}>
            <AlertTriangle size={20} className="text-secondary-color" style={{ color: 'var(--warning)' }} />
            <h3 className="text-semibold m-0" style={{ fontSize: '16px' }}>Safety Warning Thresholds</h3>
          </div>

          <p className="text-secondary-color m-0" style={{ fontSize: '13px', lineLines: '1.4' }}>
            Warning alerts will trigger and sync globally to supervisors if actual temperatures rise above target ceilings.
          </p>

          <div className="d-grid grid-cols-3 gap-md">
            <div className="form-group">
              <label htmlFor="max-df-temp">Deep Freeze Max Temp (°C)</label>
              <input 
                id="max-df-temp"
                type="number" 
                step="0.1"
                value={deepFreezeMaxTemp} 
                onChange={(e) => setDeepFreezeMaxTemp(e.target.value)}
                className="login-input"
                style={{ paddingLeft: '14px', height: '42px' }}
              />
            </div>

            <div className="form-group">
              <label htmlFor="max-chilled-temp">Chilled Space Max Temp (°C)</label>
              <input 
                id="max-chilled-temp"
                type="number" 
                step="0.1"
                value={chilledMaxTemp} 
                onChange={(e) => setChilledMaxTemp(e.target.value)}
                className="login-input"
                style={{ paddingLeft: '14px', height: '42px' }}
              />
            </div>

            <div className="form-group">
              <label htmlFor="max-humidity-val">Humidity Max Limit (%)</label>
              <input 
                id="max-humidity-val"
                type="number" 
                value={humidityMaxThreshold} 
                onChange={(e) => setHumidityMaxThreshold(e.target.value)}
                className="login-input"
                style={{ paddingLeft: '14px', height: '42px' }}
              />
            </div>
          </div>
        </div>

        {/* Card 3: Communications */}
        <div className="card-base p-lg d-flex flex-column gap-md">
          <div className="d-flex align-center gap-sm mb-xs" style={{ borderBottom: '1px solid var(--border)', paddingBottom: 'var(--spacing-sm)' }}>
            <Mail size={20} className="text-secondary-color" style={{ color: 'var(--info)' }} />
            <h3 className="text-semibold m-0" style={{ fontSize: '16px' }}>Incident Alert Channels</h3>
          </div>

          <div className="d-flex flex-column gap-sm">
            <label className="remember-me" style={{ gap: '12px' }}>
              <input 
                type="checkbox" 
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
              />
              <div>
                <span className="text-semibold" style={{ display: 'block', color: 'var(--text-primary)' }}>Email Alerts Sync</span>
                <span style={{ fontSize: '12px' }}>Send automatic warning messages to supervisor email registries</span>
              </div>
            </label>

            <label className="remember-me" style={{ gap: '12px', marginTop: '4px' }}>
              <input 
                type="checkbox" 
                checked={smsAlerts}
                onChange={(e) => setSmsAlerts(e.target.checked)}
              />
              <div>
                <span className="text-semibold" style={{ display: 'block', color: 'var(--text-primary)' }}>SMS Emergency Alerts</span>
                <span style={{ fontSize: '12px' }}>Send short message alerts to mobile contact phones during critical breakdowns</span>
              </div>
            </label>

            <label className="remember-me" style={{ gap: '12px', marginTop: '4px' }}>
              <input 
                type="checkbox" 
                checked={systemBannerAlerts}
                onChange={(e) => setSystemBannerAlerts(e.target.checked)}
              />
              <div>
                <span className="text-semibold" style={{ display: 'block', color: 'var(--text-primary)' }}>Console Warning Banners</span>
                <span style={{ fontSize: '12px' }}>Show flashing alert banner modules at top headers</span>
              </div>
            </label>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="d-flex justify-end gap-md">
          <Button type="submit" variant="primary" icon={Save} loading={isSaving}>
            Save Configuration
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
