import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { 
  LayoutDashboard, Warehouse, Users, Settings, BarChart3, 
  ShieldAlert, FileText, Package, Bell, LogOut, Sun, Moon, 
  Menu, X, ChevronDown, User, Calendar, Sparkles 
} from 'lucide-react';
import { Avatar } from './UI';

export const Layout = ({ children }) => {
  const { 
    currentUser, logout, theme, setTheme, 
    language, setLanguage, t, triggerToast,
    notifications, markAllNotificationsRead 
  } = useContext(AppContext);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Close menus when location changes
  useEffect(() => {
    setIsSidebarOpen(false);
    setIsProfileOpen(false);
    setIsNotificationsOpen(false);
  }, [location.pathname]);

  if (!currentUser) return <>{children}</>; // Render without layout for login page

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.read).length;

  // Role specific navigation items
  const menuItems = {
    admin: [
      { name: `${t('admin')} ${t('dashboard')}`, path: '/admin/dashboard', icon: LayoutDashboard },
      { name: t('storageUnits'), path: '/admin/storages', icon: Warehouse },
      { name: `${t('manager')} ${t('users')}`, path: '/admin/managers', icon: Users },
      { name: t('users'), path: '/admin/users', icon: Users },
      { name: t('analytics'), path: '/admin/analytics', icon: BarChart3 },
      { name: t('settings'), path: '/admin/settings', icon: Settings },
    ],
    manager: [
      { name: t('dashboard'), path: '/manager/dashboard', icon: LayoutDashboard },
      { name: 'Approvals', path: '/manager/approvals', icon: Calendar },
      { name: 'AI Quality Inspector', path: '/manager/quality-inspector', icon: Sparkles },
      { name: t('storageUnits'), path: '/manager/monitoring', icon: Warehouse },
      { name: t('products'), path: '/manager/products', icon: Package },
      { name: t('users'), path: '/manager/users', icon: Users },
      { name: t('alerts'), path: '/manager/alerts', icon: ShieldAlert },
      { name: t('analytics'), path: '/manager/reports', icon: FileText },
      { name: t('settings'), path: '/manager/profile', icon: User },
    ],
    farmer: [
      { name: t('dashboard'), path: '/farmer/dashboard', icon: LayoutDashboard },
      { name: t('products'), path: '/farmer/products', icon: Package },
      { name: t('storageUnits'), path: '/farmer/storage', icon: Warehouse },
      { name: t('bookings'), path: '/farmer/booking', icon: Calendar },
      { name: t('alerts'), path: '/farmer/notifications', icon: Bell },
      { name: t('settings'), path: '/farmer/settings', icon: Settings },
    ]
  };

  const userRole = currentUser.role ? currentUser.role.toLowerCase() : '';
  const currentRoleItems = menuItems[userRole] || [];

  return (
    <div className="app-container">
      {/* Fixed Left Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <Link to={`/${userRole}/dashboard`} className="logo-container">
            <span className="logo-icon"><Warehouse size={24} strokeWidth={2.5} /></span>
            <span>AgriFreeze</span>
          </Link>
          <button 
            className="sidebar-toggle-btn" 
            style={{ marginLeft: 'auto', color: '#94a3b8' }}
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <ul className="sidebar-menu">
          {currentRoleItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <li key={item.name} className="sidebar-item">
                <Link 
                  to={item.path} 
                  className={`sidebar-link ${isActive ? 'active' : ''}`}
                >
                  <Icon size={18} className="link-icon" />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Sidebar Profile Area */}
        <div className="sidebar-profile">
          <div className="sidebar-profile-info">
            <div className="sidebar-avatar">
              <Avatar src={currentUser.avatar} name={currentUser.name} />
            </div>
            <div className="sidebar-profile-text">
              <span className="sidebar-name">{currentUser.name || 'User'}</span>
              <span className="sidebar-role">
                {currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}
              </span>
            </div>
          </div>
          <button 
            className="sidebar-logout" 
            onClick={handleLogout}
            title="Log Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="main-content">
        {/* Top Navbar */}
        <nav className="navbar">
          <div className="navbar-left">
            <button 
              className="sidebar-toggle-btn"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu size={20} />
            </button>
            
            {/* Global Mock Search */}
            <div className="search-box">
              <input 
                type="text" 
                className="search-input" 
                placeholder="Global telemetry and records search..." 
              />
              <span className="search-icon" style={{ left: '0.85rem' }}>
                <Warehouse size={16} style={{ color: 'var(--text-muted)' }} />
              </span>
            </div>
          </div>

          <div className="navbar-right">
            {/* Global Language Selector */}
            <select
              id="global-language-select"
              value={language}
              onChange={(e) => {
                const newLang = e.target.value;
                setLanguage(newLang);
                triggerToast(t('saved'), `${t('language')}: ${newLang.toUpperCase()}`, 'info');
              }}
              style={{
                padding: '0.4rem 0.75rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-card)',
                color: 'var(--text-main)',
                fontSize: '0.85rem',
                cursor: 'pointer',
                fontWeight: 600,
                outline: 'none'
              }}
            >
              <option value="en">🇺🇸 English (US)</option>
              <option value="es">🇪🇸 Spanish (Español)</option>
              <option value="fr">🇫🇷 French (Français)</option>
              <option value="hi">🇮🇳 Hindi (हिन्दी)</option>
              <option value="ta">🇮🇳 Tamil (தமிழ்)</option>
            </select>

            {/* Theme Toggle */}
            <button 
              className="navbar-action-btn"
              onClick={toggleTheme}
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {/* Notifications Bell */}
            <div style={{ position: 'relative' }}>
              <button 
                className="navbar-action-btn"
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                title="Notifications"
              >
                <Bell size={18} />
                {unreadCount > 0 && <span className="notification-badge" />}
              </button>

              {/* Notification Overlay Menu */}
              <div className={`dropdown-menu ${isNotificationsOpen ? 'open' : ''}`} style={{ width: '320px', right: 0 }}>
                <div className="dropdown-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Notifications</span>
                  {unreadCount > 0 && (
                    <button 
                      onClick={markAllNotificationsRead}
                      style={{ background: 'none', border: 'none', color: 'var(--primary-color)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div style={{ maxHeight: '280px', overflowY: 'auto', padding: '0.25rem' }}>
                  {notifications.length === 0 ? (
                    <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map(notif => (
                      <div 
                        key={notif.id} 
                        style={{ 
                          padding: '0.75rem', 
                          borderBottom: '1px solid var(--border-color)', 
                          backgroundColor: notif.read ? 'transparent' : 'var(--primary-light)',
                          borderRadius: 'var(--radius-sm)',
                          marginBottom: '0.25rem'
                        }}
                      >
                        <div style={{ fontSize: '0.8125rem', fontWeight: notif.read ? 500 : 700, color: 'var(--text-main)' }}>
                          {notif.title}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem' }}>
                          <span className={`badge badge-${notif.type === 'alert' ? 'danger' : notif.type === 'booking' ? 'info' : 'primary'}`} style={{ fontSize: '0.65rem' }}>
                            {notif.type}
                          </span>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-light)' }}>{notif.time}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div style={{ borderTop: '1px solid var(--border-color)', padding: '0.5rem', textAlign: 'center' }}>
                  <Link 
                    to={userRole === 'farmer' ? '/farmer/notifications' : '#'} 
                    style={{ fontSize: '0.8125rem', color: 'var(--primary-color)', textDecoration: 'none', fontWeight: 600 }}
                    onClick={() => setIsNotificationsOpen(false)}
                  >
                    View all notifications
                  </Link>
                </div>
              </div>
            </div>

            {/* Profile Dropdown */}
            <div style={{ position: 'relative' }}>
              <div className="navbar-user" onClick={() => setIsProfileOpen(!isProfileOpen)}>
                <div className="navbar-avatar">
                  <Avatar src={currentUser.avatar} name={currentUser.name} />
                </div>
                <div className="navbar-user-info">
                  <span className="navbar-username">{currentUser.name || 'User'}</span>
                  <span className="badge badge-primary" style={{ marginTop: '0.125rem', alignSelf: 'flex-start' }}>
                    {currentUser.role.toUpperCase()}
                  </span>
                </div>
                <ChevronDown size={14} style={{ color: 'var(--text-muted)', marginLeft: '0.25rem' }} />
              </div>

              {/* Profile Dropdown Menu */}
              <div className={`dropdown-menu ${isProfileOpen ? 'open' : ''}`}>
                <div className="dropdown-header">Accounts Operations</div>
                
                <Link to={`/${userRole}/profile`} className="dropdown-item">
                  <User size={16} />
                  <span>My Profile</span>
                </Link>
                
                <Link to={userRole === 'admin' ? '/admin/settings' : userRole === 'farmer' ? '/farmer/settings' : '/manager/profile'} className="dropdown-item">
                  <Settings size={16} />
                  <span>Settings</span>
                </Link>
                
                <hr style={{ margin: '0.25rem 0', borderColor: 'var(--border-color)' }} />
                
                <button className="dropdown-item danger" onClick={handleLogout}>
                  <LogOut size={16} />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Dynamic Inner Dashboard Page Content */}
        <main className="page-container">
          {children}
        </main>
      </div>
    </div>
  );
};
