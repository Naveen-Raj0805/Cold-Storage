import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import Navbar from '../../components/Navbar/Navbar';
import { mockUsers } from '../../data/mockData';
import './DashboardLayout.css';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [pageTitle, setPageTitle] = useState('AgriFreeze');
  const navigate = useNavigate();

  useEffect(() => {
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (!isLoggedIn) {
      navigate('/');
      return;
    }

    const matchedUser = mockUsers.find(
      (u) => u.username === username && u.role === role
    );

    if (matchedUser) {
      setUser(matchedUser);
    } else {
      // Fallback details if not fully matching
      setUser({
        username: username || 'guest',
        role: role || 'farmer',
        name: username ? username.toUpperCase() : 'Guest User',
        avatar: ''
      });
    }
  }, [navigate]);

  // Update page titles based on path
  useEffect(() => {
    const path = window.location.pathname;
    if (path.includes('/admin/dashboard')) setPageTitle('Admin Control Center');
    else if (path.includes('/admin/storage-management')) setPageTitle('Storage Infrastructure');
    else if (path.includes('/admin/manager-management')) setPageTitle('Cold Storage Managers');
    else if (path.includes('/admin/user-management')) setPageTitle('Registered Platform Users');
    else if (path.includes('/admin/platform-analytics')) setPageTitle('Platform Analytical Audits');
    else if (path.includes('/admin/settings')) setPageTitle('System Admin Settings');
    else if (path.includes('/manager/dashboard')) setPageTitle('Hub Performance Control');
    else if (path.includes('/manager/storage-monitoring')) setPageTitle('Chamber Live Monitoring');
    else if (path.includes('/manager/products')) setPageTitle('Chamber Space Registry');
    else if (path.includes('/manager/users')) setPageTitle('Cooperating Farmers');
    else if (path.includes('/manager/alerts')) setPageTitle('Thermal Anomalies');
    else if (path.includes('/manager/reports')) setPageTitle('Audit Performance Logs');
    else if (path.includes('/manager/profile')) setPageTitle('Manager Settings');
    else if (path.includes('/farmer/dashboard')) setPageTitle('Farmer Dashboard');
    else if (path.includes('/farmer/my-products')) setPageTitle('My Crop Storage');
    else if (path.includes('/farmer/my-storage')) setPageTitle('My Storage Slots');
    else if (path.includes('/farmer/storage-booking')) setPageTitle('Book Cold Storage');
    else if (path.includes('/farmer/notifications')) setPageTitle('Thermal & Billing Alerts');
    else if (path.includes('/farmer/settings')) setPageTitle('Account Settings');
    else if (path.includes('/farmer/profile')) setPageTitle('Farmer Profile');
  }, [window.location.pathname]);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="dashboard-layout">
      {/* Drawer Overlay for Mobile viewports */}
      {sidebarOpen && (
        <div className="dashboard-overlay" onClick={closeSidebar} role="presentation" />
      )}

      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} user={user} />

      <main className="dashboard-main">
        <Navbar
          onToggleSidebar={toggleSidebar}
          title={pageTitle}
          user={user}
        />
        <section className="dashboard-content">
          <Outlet context={{ user }} />
        </section>
      </main>
    </div>
  );
};

export default DashboardLayout;
