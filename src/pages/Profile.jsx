import React, { useContext, useState, useRef, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { Save, Upload, Activity, Trash2, ZoomIn, ZoomOut, RotateCw, Image as ImageIcon, Sparkles, Check } from 'lucide-react';
import { FormInput, Avatar, Modal } from '../components/UI';
import { updateUser } from '../services/api';

const PRESET_AVATARS = [
  { id: 'av-1', label: 'Farmer Leader', icon: '👨‍🌾', bg: '#10b981' },
  { id: 'av-2', label: 'Coldroom Manager', icon: '👨‍💼', bg: '#3b82f6' },
  { id: 'av-3', label: 'Quality Inspector', icon: '👩‍🔬', bg: '#8b5cf6' },
  { id: 'av-4', label: 'Agri Specialist', icon: '🚜', bg: '#f59e0b' },
  { id: 'av-5', label: 'Cold Chain Expert', icon: '❄️', bg: '#06b6d4' },
  { id: 'av-6', label: 'Fresh Harvest', icon: '🍏', bg: '#84cc16' },
  { id: 'av-7', label: 'Safe Keeper', icon: '🛡️', bg: '#6366f1' },
  { id: 'av-8', label: 'Power Ops', icon: '⚡', bg: '#ec4899' }
];

export const Profile = () => {
  const { currentUser, products, storages, triggerToast, setCurrentUser } = useContext(AppContext);
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  if (currentUser && !currentUser.fullName) {
    currentUser.fullName = currentUser.name;
  }

  // Forms states
  const [profileForm, setProfileForm] = useState({
    name: currentUser?.fullName || 'User Name',
    email: currentUser?.email || 'email@agrifreeze.com',
    phone: currentUser?.phone || ''
  });

  const [passwordForm, setPasswordForm] = useState({
    current: '••••••••',
    newPass: '',
    confirm: ''
  });

  const [notifications, setNotifications] = useState({
    email: true,
    sms: false
  });

  // WhatsApp-style Photo Cropper Modal State
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [rawImageSrc, setRawImageSrc] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [panPos, setPanPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedPreset, setSelectedPreset] = useState(null);

  // File Select Handler
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      triggerToast('Invalid File', 'Please select a valid image file (PNG, JPG, WEBP).', 'danger');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setRawImageSrc(event.target.result);
      setZoom(1);
      setRotation(0);
      setPanPos({ x: 0, y: 0 });
      setSelectedPreset(null);
      setIsCropModalOpen(true);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Mouse Drag / Pan Handlers
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - panPos.x, y: e.clientY - panPos.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPanPos({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Select Preset Avatar
  const handleSelectPreset = (preset) => {
    setSelectedPreset(preset.id);
    setRawImageSrc(null);
  };

  // Apply & Save Cropped Profile Picture
  const handleApplyProfilePhoto = () => {
    if (selectedPreset) {
      const presetObj = PRESET_AVATARS.find(p => p.id === selectedPreset);
      const updatedDetails = {
        ...currentUser,
        avatar: presetObj.icon,
        profilePicture: presetObj.icon
      };
      setCurrentUser(updatedDetails);
      try { localStorage.setItem('agrifreeze_current_user', JSON.stringify(updatedDetails)); } catch (_) {}
      triggerToast('Avatar Updated', `Preset avatar '${presetObj.label}' applied to profile.`, 'success');
      setIsCropModalOpen(false);
      return;
    }

    if (!rawImageSrc) return;

    // Draw on HTML5 Canvas with Crop, Pan & Scale
    const canvas = document.createElement('canvas');
    const size = 300;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    const img = new Image();
    img.src = rawImageSrc;
    img.onload = () => {
      ctx.clearRect(0, 0, size, size);

      // Create Circular Crop Mask
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      ctx.save();
      ctx.translate(size / 2 + panPos.x, size / 2 + panPos.y);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(zoom, zoom);

      ctx.drawImage(img, -size / 2, -size / 2, size, size);
      ctx.restore();

      const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.92);

      const updatedDetails = {
        ...currentUser,
        avatar: croppedDataUrl,
        profilePicture: croppedDataUrl
      };

      setCurrentUser(updatedDetails);
      try { localStorage.setItem('agrifreeze_current_user', JSON.stringify(updatedDetails)); } catch (_) {}

      triggerToast('Profile Photo Updated', 'Profile picture saved successfully!', 'success');
      setIsCropModalOpen(false);
    };
  };

  // Remove Photo Action
  const handleRemovePhoto = () => {
    const initialLetter = currentUser?.fullName ? currentUser.fullName[0].toUpperCase() : 'U';
    const updatedDetails = {
      ...currentUser,
      avatar: initialLetter,
      profilePicture: null
    };

    setCurrentUser(updatedDetails);
    try { localStorage.setItem('agrifreeze_current_user', JSON.stringify(updatedDetails)); } catch (_) {}
    triggerToast('Photo Removed', 'Profile picture reset to default initials.', 'info');
  };

  const handleSaveInfo = async (e) => {
    e.preventDefault();
    try {
      const response = await updateUser(currentUser.id, {
        fullName: profileForm.name,
        email: profileForm.email,
        phone: profileForm.phone,
        role: currentUser.role ? currentUser.role.toUpperCase() : 'FARMER',
        status: currentUser.status ? currentUser.status.toUpperCase() : 'ACTIVE'
      });

      const updatedDetails = {
        ...currentUser,
        fullName: response.fullName,
        name: response.fullName,
        phone: response.phone || '',
        email: response.email,
        role: response.role ? response.role.toLowerCase() : currentUser.role,
        status: response.status === 'INACTIVE' ? 'Inactive' : 'Active'
      };

      setCurrentUser(updatedDetails);
      try { localStorage.setItem('agrifreeze_current_user', JSON.stringify(updatedDetails)); } catch (_) {}
      triggerToast('Profile Info Updated', 'Personal information saved dynamically to database.', 'success');
    } catch (err) {
      triggerToast('Error', err.message || 'Failed to save personal information.', 'danger');
    }
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    if (!passwordForm.current || passwordForm.current === '••••••••') {
      triggerToast('Validation Error', 'Please enter your current password.', 'danger');
      return;
    }
    if (!passwordForm.newPass || passwordForm.newPass.length < 4) {
      triggerToast('Validation Error', 'New password must be at least 4 characters long.', 'danger');
      return;
    }
    if (passwordForm.newPass !== passwordForm.confirm) {
      triggerToast('Validation Error', 'New passwords do not match.', 'danger');
      return;
    }

    try {
      await updateUser(currentUser.id, {
        currentPassword: passwordForm.current,
        newPassword: passwordForm.newPass
      });

      triggerToast('Password Updated', 'Account password successfully updated in backend database.', 'success');
      setPasswordForm({ current: '', newPass: '', confirm: '' });
    } catch (err) {
      triggerToast('Password Update Failed', err.message || 'Incorrect current password.', 'danger');
    }
  };

  // Role specific stats calculations
  const renderRoleStats = () => {
    if (currentUser?.role === 'farmer') {
      const farmerProducts = products.filter(p => p.farmer === currentUser.fullName);
      const totalWeight = farmerProducts.reduce((sum, p) => sum + p.quantity, 0);
      return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', backgroundColor: 'var(--border-light)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>My Stored Products</span>
            <strong style={{ fontSize: '1.25rem', color: 'var(--primary-color)' }}>{farmerProducts.length} Lots</strong>
          </div>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>Capacity Utilized</span>
            <strong style={{ fontSize: '1.25rem', color: 'var(--text-main)' }}>{totalWeight} Tons</strong>
          </div>
        </div>
      );
    }

    if (currentUser?.role === 'manager') {
      const managerStorage = storages.find(s => s.manager === currentUser.fullName) || storages[0];
      return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', backgroundColor: 'var(--border-light)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>Assigned Chamber</span>
            <strong style={{ fontSize: '1rem', color: 'var(--primary-color)' }}>{managerStorage?.name.replace('AgriFreeze ', '')}</strong>
          </div>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>Staff Experience</span>
            <strong style={{ fontSize: '1rem', color: 'var(--text-main)' }}>8 Years Active</strong>
          </div>
        </div>
      );
    }

    // Default Admin stats
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', backgroundColor: 'var(--border-light)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>Facilities catalogued</span>
          <strong style={{ fontSize: '1.25rem', color: 'var(--primary-color)' }}>{storages.length} Rooms</strong>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>Security Clearance</span>
          <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>Level 5 Administrator</strong>
        </div>
      </div>
    );
  };

  const isCustomPhoto = typeof currentUser?.avatar === 'string' && (currentUser.avatar.startsWith('data:') || currentUser.avatar.startsWith('http') || currentUser.avatar.startsWith('/'));

  return (
    <div>
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />

      {/* Title */}
      <div className="page-header">
        <h1 style={{ margin: 0, fontSize: '1.875rem' }}>My Profile</h1>
        <p className="page-subtitle">Configure your personal information, profile photo, and password keys.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '2rem', alignItems: 'flex-start' }}>
        
        {/* Left Side: Avatar Panel */}
        <div className="card-section" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
          
          {/* Avatar Container with Hover Overlay */}
          <div 
            style={{ position: 'relative', cursor: 'pointer' }} 
            onClick={() => fileInputRef.current?.click()}
            title="Click to change profile picture"
          >
            <div className="navbar-avatar" style={{ width: '108px', height: '108px', fontSize: '2.5rem', boxShadow: 'var(--shadow-card)', border: '3px solid var(--primary-color)' }}>
              <Avatar src={currentUser?.avatar} name={currentUser?.fullName} />
            </div>
            <div style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              backgroundColor: 'var(--primary-color)',
              color: '#ffffff',
              borderRadius: '50%',
              padding: '0.4rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
            }}>
              <Upload size={14} />
            </div>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>{profileForm.name}</h3>
            <span className="badge badge-primary">{currentUser?.role.toUpperCase()}</span>
          </div>

          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button className="btn btn-secondary" onClick={() => fileInputRef.current?.click()} style={{ width: '100%', justifyContent: 'center' }}>
              <Upload size={16} />
              <span>Upload Profile Photo</span>
            </button>

            <button className="btn btn-danger" onClick={handleRemovePhoto} style={{ width: '100%', justifyContent: 'center', backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }}>
              <Trash2 size={16} />
              <span>Remove Photo</span>
            </button>
          </div>

          <hr style={{ width: '100%', borderColor: 'var(--border-color)' }} />
          
          {renderRoleStats()}

          {/* Activity section snippet */}
          <div style={{ width: '100%' }}>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Activity size={14} style={{ color: 'var(--primary-color)' }} />
              <span>Recent Activity</span>
            </h4>
            <div style={{ fontSize: '0.8125rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--text-muted)' }}>
              <div>• Logged in on Safari desktop</div>
              <div>• Updated notification settings</div>
            </div>
          </div>
        </div>

        {/* Right Side: Form sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Personal Info */}
          <div className="card-section" style={{ margin: 0 }}>
            <h3 style={{ fontSize: '1.125rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1.25rem' }}>
              Personal Information
            </h3>
            
            <form onSubmit={handleSaveInfo} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <FormInput
                  label="Full Name"
                  id="profile-user-name"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  required
                />
                <FormInput
                  label="Email Address"
                  id="profile-user-email"
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  required
                />
              </div>

              <FormInput
                label="Phone Number"
                id="profile-user-phone"
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                required
              />

              <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
                <Save size={16} />
                <span>Save Personal Information</span>
              </button>
            </form>
          </div>

          {/* Password Change */}
          <div className="card-section" style={{ margin: 0 }}>
            <h3 style={{ fontSize: '1.125rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1.25rem' }}>
              Change Password
            </h3>

            <form onSubmit={handleSavePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <FormInput
                label="Current Password"
                id="prof-pass-curr"
                type="password"
                placeholder="Enter current password"
                value={passwordForm.current === '••••••••' ? '' : passwordForm.current}
                onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                required
              />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <FormInput
                  label="New Password"
                  id="prof-pass-new"
                  type="password"
                  value={passwordForm.newPass}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPass: e.target.value })}
                  required
                />
                <FormInput
                  label="Confirm New Password"
                  id="prof-pass-confirm"
                  type="password"
                  value={passwordForm.confirm}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
                <Save size={16} />
                <span>Update Password</span>
              </button>
            </form>
          </div>

          {/* Notification Preferences */}
          <div className="card-section" style={{ margin: 0 }}>
            <h3 style={{ fontSize: '1.125rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1.25rem' }}>
              Notification Preferences
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
                  <strong>Email Alerts</strong>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Receive transaction billing summaries and cold chain audit sheets in your inbox.
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
                  <strong>SMS Warnings</strong>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Receive emergency texts when environmental temperatures violate bounds.
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* WHATSAPP-STYLE PROFILE PHOTO CROPPER MODAL */}
      <Modal
        isOpen={isCropModalOpen}
        onClose={() => setIsCropModalOpen(false)}
        title="Set Profile Picture"
        footerButtons={
          <>
            <button className="btn btn-danger" onClick={() => { handleRemovePhoto(); setIsCropModalOpen(false); }} style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', marginRight: 'auto' }}>
              <Trash2 size={16} />
              <span>Remove Photo</span>
            </button>
            <button className="btn btn-secondary" onClick={() => setIsCropModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleApplyProfilePhoto}>
              <Check size={16} />
              <span>Save & Apply Photo</span>
            </button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
          
          {/* Circular Mask Viewport (WhatsApp Style Drag / Pan / Scale Window) */}
          {rawImageSrc ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
              <div 
                style={{
                  width: '220px',
                  height: '220px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  position: 'relative',
                  border: '3px solid var(--primary-color)',
                  boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.65)',
                  cursor: isDragging ? 'grabbing' : 'grab',
                  margin: '1.5rem auto'
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <img
                  src={rawImageSrc}
                  alt="Crop Preview"
                  draggable={false}
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transform: `translate(${panPos.x}px, ${panPos.y}px) scale(${zoom}) rotate(${rotation}deg)`,
                    transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                    userSelect: 'none'
                  }}
                />
              </div>

              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '0.75rem' }}>
                💡 Click & Drag inside the circle to adjust photo position.
              </div>

              {/* Zoom & Rotate Controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%', backgroundColor: 'var(--border-light)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <ZoomOut size={18} style={{ color: 'var(--text-muted)' }} />
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  style={{ flex: 1, accentColor: 'var(--primary-color)', cursor: 'pointer' }}
                />
                <ZoomIn size={18} style={{ color: 'var(--text-muted)' }} />
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem' }}
                  onClick={() => setRotation((prev) => (prev + 90) % 360)}
                  title="Rotate 90°"
                >
                  <RotateCw size={14} />
                  <span>Rotate</span>
                </button>
              </div>
            </div>
          ) : (
            <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Select a custom image from your device or pick a preset avatar below.
            </div>
          )}

          {/* Preset Avatars Selection Gallery */}
          <div style={{ width: '100%', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
            <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-main)' }}>
              <Sparkles size={16} style={{ color: 'var(--primary-color)' }} />
              <span>Or Choose a Default Preset Avatar:</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
              {PRESET_AVATARS.map((p) => {
                const isSelected = selectedPreset === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => handleSelectPreset(p)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      padding: '0.5rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: isSelected ? 'rgba(16, 185, 129, 0.15)' : 'var(--border-light)',
                      border: isSelected ? '2px solid var(--primary-color)' : '1px solid var(--border-color)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      backgroundColor: p.bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem',
                      marginBottom: '0.25rem',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}>
                      {p.icon}
                    </div>
                    <span style={{ fontSize: '0.65rem', fontWeight: 600, textAlign: 'center', color: 'var(--text-main)' }}>
                      {p.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </Modal>
    </div>
  );
};
