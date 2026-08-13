import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, ShieldAlert, BadgeDollarSign, Snowflake } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { mockProducts, mockBookings, mockNotifications, mockAnalytics } from '../../data/mockData';
import PageHeader from '../../components/PageHeader/PageHeader';
import StatCard from '../../components/StatCard/StatCard';
import ChartCard from '../../components/ChartCard/ChartCard';
import NotificationItem from '../../components/NotificationItem/NotificationItem';
import Button from '../../components/Button/Button';
import './FarmerDashboard.css';

const FarmerDashboard = () => {
  const navigate = useNavigate();

  const farmerId = 'farmer';
  const myProducts = mockProducts.filter((p) => p.farmerId === farmerId);
  const myBookings = mockBookings.filter((b) => b.farmerId === farmerId && b.status === 'Approved');

  // Load farmer-specific notifications
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const filtered = mockNotifications
      .filter((n) => n.role === 'farmer')
      .slice(0, 3); // show top 3 recent alerts
    setAlerts(filtered);
  }, []);

  const handleMarkRead = (id) => {
    setAlerts((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <div className="page-container animate-fade-in">
      <PageHeader
        title="Farmer Dashboard"
        description="Review active crop storage, monitor live sensor telemetry, and check invoices."
      />

      {/* Overview Stats */}
      <div className="farmer-dashboard-stats">
        <StatCard
          title="My Registered Batches"
          value={`${myProducts.length} Batches`}
          icon={<Package size={20} />}
          trendValue="Fruits & Vegetables"
          trendDirection="up"
          trendLabel="actively stored"
        />
        <StatCard
          title="Booked Storage Chambers"
          value={`${myBookings.length} Chamber`}
          icon={<Snowflake size={20} />}
          trendValue="North Hub Hub"
          trendDirection="up"
          trendLabel="slots allocated"
          theme="blue"
        />
        <StatCard
          title="Chamber Compliance"
          value="Optimal"
          icon={<ShieldAlert size={20} />}
          trendValue="Avg temperature 4.1°C"
          trendDirection="up"
          trendLabel="compliant levels"
        />
        <StatCard
          title="Upcoming Invoices Fee"
          value="$1,800"
          icon={<BadgeDollarSign size={20} />}
          trendValue="Due in 15 days"
          trendDirection="down"
          trendLabel="total balance"
        />
      </div>

      {/* Main Content Area */}
      <div className="farmer-dashboard-row">
        {/* Telemetry Chart */}
        <ChartCard
          title="My Chambers Live Telemetry"
          description="Continuous operational tracking in Chamber A (Fruits) and Chamber C (Vegetables)."
        >
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={mockAnalytics.temperatureHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="time" stroke="var(--text-muted)" fontSize={12} />
              <YAxis stroke="var(--text-muted)" fontSize={12} />
              <Tooltip />
              <Legend verticalAlign="top" height={36} />
              <Line type="monotone" dataKey="chamberA" name="Fruits Chilled (Chamber A)" stroke="var(--primary)" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="chamberC" name="Vegetables Chilled (Chamber C)" stroke="#f59e0b" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Live Notification panels */}
        <div className="farmer-recent-alerts-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text)' }}>Recent Notifications</h3>
            <Button
              variant="secondary"
              onClick={() => navigate('/farmer/notifications')}
              style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
            >
              View All
            </Button>
          </div>

          <div className="farmer-alerts-list">
            {alerts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
                No notifications logged.
              </div>
            ) : (
              alerts.map((item) => (
                <NotificationItem
                  key={item.id}
                  notification={item}
                  onMarkRead={handleMarkRead}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;
