import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { Bell, Calendar, ShieldAlert, FileText, CheckCircle2, Eye } from 'lucide-react';

export const FarmerNotifications = () => {
  const { notifications, markAllNotificationsRead, currentUser } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('All'); // All, Today, Yesterday, Earlier

  const handleMarkAllRead = () => {
    markAllNotificationsRead();
  };

  // Filter notifications relevant to current user session (or all for display)
  const userNotifications = notifications.filter(n => 
    !currentUser?.id || !n.farmerId || String(n.farmerId) === String(currentUser.id)
  );

  // Group notifications dynamically
  const groupedNotifications = {
    Today: userNotifications.filter(n => n.time === 'Just now' || n.time === 'Active risk' || n.time === 'Full capacity' || n.time === 'Active event' || n.time?.includes('hour') || n.time?.includes('min')),
    Yesterday: userNotifications.filter(n => n.time?.includes('day ago') || n.time?.includes('Yesterday')),
    Earlier: userNotifications.filter(n => n.time?.includes('days ago'))
  };

  const currentTimelineKeys = activeTab === 'All' 
    ? ['Today', 'Yesterday', 'Earlier'] 
    : [activeTab];

  return (
    <div>
      {/* Title */}
      <div className="page-header">
        <div className="page-title-row">
          <div>
            <h1 style={{ margin: 0, fontSize: '1.875rem' }}>Notifications</h1>
            <p className="page-subtitle">Timeline logs of sensor alerts, lease approvals, and billing invoices.</p>
          </div>

          <button className="btn btn-secondary" onClick={handleMarkAllRead}>
            <CheckCircle2 size={16} />
            <span>Mark all read</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.25rem', backgroundColor: 'var(--border-light)', padding: '0.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', width: 'fit-content', marginBottom: '2rem' }}>
        {['All', 'Today', 'Yesterday', 'Earlier'].map((tab) => (
          <button
            key={tab}
            className="btn"
            style={{
              padding: '0.35rem 0.85rem',
              fontSize: '0.8125rem',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: activeTab === tab ? 'var(--bg-card)' : 'transparent',
              color: activeTab === tab ? 'var(--primary-color)' : 'var(--text-muted)',
              border: 'none',
              boxShadow: activeTab === tab ? 'var(--shadow-sm)' : 'none',
              cursor: 'pointer'
            }}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Timeline Layout */}
      <div className="card-section" style={{ maxWidth: '800px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {currentTimelineKeys.map(groupKey => {
            const list = groupedNotifications[groupKey] || [];
            if (list.length === 0) return null;

            return (
              <div key={groupKey}>
                <h4 style={{ fontSize: '0.85rem', color: 'var(--text-light)', textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '0.05em' }}>
                  {groupKey}
                </h4>

                <div className="activity-timeline" style={{ paddingLeft: '0.5rem' }}>
                  {list.map(item => {
                    const iconColor = item.type === 'alert' ? 'danger' : item.type === 'booking' ? 'info' : item.type === 'invoice' ? 'warning' : 'primary';
                    const Icon = item.type === 'alert' ? ShieldAlert : item.type === 'booking' ? Calendar : item.type === 'invoice' ? FileText : Bell;
                    
                    return (
                      <div key={item.id} className="timeline-item">
                        <div className="timeline-badge" style={{ backgroundColor: `var(--status-${iconColor}-bg)`, color: `var(--status-${iconColor})` }}>
                          <Icon size={16} />
                        </div>
                        
                        <div className="timeline-content" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: item.read ? 'transparent' : 'var(--primary-light)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginLeft: '0.5rem' }}>
                          <div>
                            <div style={{ fontSize: '0.875rem', fontWeight: item.read ? 500 : 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              {item.title}
                              {!item.read && <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--primary-color)' }} />}
                            </div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{item.time}</span>
                          </div>
                          
                          <button className="btn-icon-sm" title="View details">
                            <Eye size={12} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
