import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import {
  Snowflake,
  LayoutDashboard,
  Users,
  UserCheck,
  BarChart3,
  Settings,
  Package,
  AlertTriangle,
  FileText,
  User,
  Calendar,
  Bell,
  LogOut,
  X
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose, user }) => {
  const { logout } = useContext(AppContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (logout) logout();
    sessionStorage.clear();
    localStorage.clear();
    navigate('/');
  };

  const getMenuOptions = () => {
    switch (user?.role) {
      case 'admin':
        return [
          { label: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={18} /> },
          { label: 'Storages', path: '/admin/storage-management', icon: <Snowflake size={18} /> },
          { label: 'Managers', path: '/admin/manager-management', icon: <UserCheck size={18} /> },
          { label: 'Users', path: '/admin/user-management', icon: <Users size={18} /> },
          { label: 'Analytics', path: '/admin/platform-analytics', icon: <BarChart3 size={18} /> },
          { label: 'Settings', path: '/admin/settings', icon: <Settings size={18} /> }
        ];
      case 'manager':
        return [
          { label: 'Dashboard', path: '/manager/dashboard', icon: <LayoutDashboard size={18} /> },
          { label: 'Monitoring', path: '/manager/storage-monitoring', icon: <Snowflake size={18} /> },
          { label: 'Products Stored', path: '/manager/products', icon: <Package size={18} /> },
          { label: 'Farmers', path: '/manager/users', icon: <Users size={18} /> },
          { label: 'Alerts Logs', path: '/manager/alerts', icon: <AlertTriangle size={18} /> },
          { label: 'Audit Reports', path: '/manager/reports', icon: <FileText size={18} /> },
          { label: 'Profile Settings', path: '/manager/profile', icon: <User size={18} /> }
        ];
      case 'farmer':
        return [
          { label: 'My Dashboard', path: '/farmer/dashboard', icon: <LayoutDashboard size={18} /> },
          { label: 'My Products', path: '/farmer/my-products', icon: <Package size={18} /> },
          { label: 'My Storage Slots', path: '/farmer/my-storage', icon: <Snowflake size={18} /> },
          { label: 'Book chamber', path: '/farmer/storage-booking', icon: <Calendar size={18} /> },
          { label: 'Alert Notifications', path: '/farmer/notifications', icon: <Bell size={18} /> },
          { label: 'Account Profile', path: '/farmer/profile', icon: <User size={18} /> },
          { label: 'Settings', path: '/farmer/settings', icon: <Settings size={18} /> }
        ];
      default:
        return [];
    }
  };

  const options = getMenuOptions();

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <span className="brand-icon">
            <Snowflake size={24} fill="var(--primary)" />
          </span>
          <span>AgriFreeze</span>
        </div>
        <button className="sidebar-close-btn" onClick={onClose} aria-label="Close Navigation Drawer">
          <X size={18} />
        </button>
      </div>

      <div className="sidebar-user">
        <img
          src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop'}
          alt={user?.name || 'User Profile Picture'}
          className="sidebar-user-avatar"
        />
        <div className="sidebar-user-info">
          <span className="sidebar-user-name">{user?.name || 'User Profile'}</span>
          <span className="sidebar-user-role">{user?.role || 'Guest'}</span>
        </div>
      </div>

      <nav className="sidebar-menu">
        {options.map((option, index) => (
          <NavLink
            key={index}
            to={option.path}
            onClick={onClose}
            className={({ isActive }) => `sidebar-menu-item ${isActive ? 'active' : ''}`}
          >
            <span className="sidebar-menu-item-icon">{option.icon}</span>
            <span>{option.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="sidebar-logout-btn" onClick={handleLogout}>
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
