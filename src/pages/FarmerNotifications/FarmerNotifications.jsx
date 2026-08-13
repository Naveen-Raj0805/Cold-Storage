import React, { useState, useEffect } from 'react';
import { mockNotifications } from '../../data/mockData';
import { useToast } from '../../context/ToastContext';
import PageHeader from '../../components/PageHeader/PageHeader';
import NotificationItem from '../../components/NotificationItem/NotificationItem';
import SearchBar from '../../components/SearchBar/SearchBar';
import Button from '../../components/Button/Button';
import '../ManagerProducts/ManagerProducts.css'; // reuse styling

const FarmerNotifications = () => {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const filtered = mockNotifications.filter((n) => n.role === 'farmer');
    setNotifications(filtered);
  }, []);

  const handleMarkRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    showToast('Alert marked as read.', 'success');
  };

  const handleClearAll = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All alerts marked as read.', 'success');
  };

  const filteredNotifications = notifications.filter((n) =>
    n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-container animate-fade-in">
      <PageHeader
        title="Thermal & Billing Alerts"
        description="Review critical alert history, system warnings, and account booking updates."
        action={
          notifications.filter((n) => !n.read).length > 0 && (
            <Button variant="secondary" onClick={handleClearAll}>
              Mark all read
            </Button>
          )
        }
      />

      <div className="products-header-row">
        <SearchBar value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search alerts..." />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-xl)', padding: '1.5rem', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
        {filteredNotifications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-light)', fontSize: '0.875rem' }}>
            No warnings logs matching search parameters.
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <NotificationItem
              key={notif.id}
              notification={notif}
              onMarkRead={handleMarkRead}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default FarmerNotifications;
