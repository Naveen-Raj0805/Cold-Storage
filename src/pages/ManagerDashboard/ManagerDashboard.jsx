import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Thermometer, BellRing, Package, Check, X, ShieldAlert } from 'lucide-react';
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
import { mockStorages, mockBookings, mockAnalytics, mockAlerts } from '../../data/mockData';
import { useToast } from '../../context/ToastContext';
import PageHeader from '../../components/PageHeader/PageHeader';
import StatCard from '../../components/StatCard/StatCard';
import ChartCard from '../../components/ChartCard/ChartCard';
import Table from '../../components/Table/Table';
import Badge from '../../components/Badge/Badge';
import Button from '../../components/Button/Button';
import './ManagerDashboard.css';

const ManagerDashboard = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  
  // Manage state locally for booking approvals
  const [bookings, setBookings] = useState(mockBookings);

  // Focus on the Manager's assigned facility: North Hub (ST-001)
  const hubId = 'ST-001';
  const hub = mockStorages.find((s) => s.id === hubId) || {
    name: 'Cold Storage Hub',
    location: 'Central Region',
    occupiedCapacity: 0,
    totalCapacity: 1000,
    chambers: []
  };
  const activeAlertsCount = mockAlerts.filter((a) => a.status === 'Active' && a.source && a.source.includes('North Hub')).length;

  const occupancyRatio = hub.totalCapacity > 0 ? ((hub.occupiedCapacity / hub.totalCapacity) * 100).toFixed(1) : '0.0';
  const pendingRequests = bookings.filter((b) => b.storageId === hubId && b.status === 'Pending');

  const handleBookingAction = (id, newStatus) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    );
    showToast(
      `Booking request ${id} has been ${newStatus.toLowerCase()}.`,
      newStatus === 'Approved' ? 'success' : 'error'
    );
  };

  const bookingHeaders = [
    { key: 'farmerName', label: 'Farmer Name' },
    { key: 'category', label: 'Crop category' },
    { key: 'weight', label: 'Requested weight' },
    { key: 'startDate', label: 'Start Date' },
    {
      key: 'status',
      label: 'Status',
      render: (val) => <Badge status={val}>{val}</Badge>
    }
  ];

  return (
    <div className="page-container animate-fade-in">
      <PageHeader
        title="Hub Performance Control"
        description={`Operator console for ${hub?.name || 'Cold Hub'} in ${hub?.location}.`}
      />

      {/* KPI Stats */}
      <div className="manager-dashboard-stats">
        <StatCard
          title="Chamber Space Loaded"
          value={`${hub.occupiedCapacity.toLocaleString()} kg`}
          icon={<Package size={20} />}
          trendValue={`${occupancyRatio}% occupied`}
          trendDirection="up"
          trendLabel={`out of ${hub.totalCapacity.toLocaleString()} kg`}
        />
        <StatCard
          title="Chamber Telemetry Warnings"
          value={`${activeAlertsCount} Alert`}
          icon={<ShieldAlert size={20} />}
          trendValue="1 Warning state"
          trendDirection="down"
          trendLabel="requires check"
          theme="blue"
        />
        <StatCard
          title="Active Cooling Chambers"
          value={`${hub.chambers.length} Chambers`}
          icon={<Thermometer size={20} />}
          trendValue="Chambers A, B, C"
          trendDirection="up"
          trendLabel="operating normally"
        />
        <StatCard
          title="Pending Booking Claims"
          value={`${pendingRequests.length} Requests`}
          icon={<BellRing size={20} />}
          trendValue="Requires action"
          trendDirection="up"
          trendLabel="action needed"
        />
      </div>

      {/* Sensor Chart */}
      <div className="manager-dashboard-grid-row">
        <ChartCard
          title="Live Chamber Sensors Graph"
          description="Continuous operational tracking in Chamber A (Fruits), B (Freezer), and C (Vegetables)."
        >
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={mockAnalytics.temperatureHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="time" stroke="var(--text-muted)" fontSize={12} />
              <YAxis stroke="var(--text-muted)" fontSize={12} />
              <Tooltip />
              <Legend verticalAlign="top" height={36} />
              <Line type="monotone" dataKey="chamberA" name="Fruits Chilling" stroke="var(--primary)" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="chamberB" name="Deep Freeze" stroke="var(--secondary)" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="chamberC" name="Vegetable Chill" stroke="#f59e0b" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Quick Pending bookings lists */}
        <div className="manager-pending-bookings-card">
          <h3 className="manager-dashboard-section-title">Farmer Slots Requests</h3>
          {pendingRequests.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-light)', fontSize: '0.875rem' }}>
              No pending slot claims to review.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {pendingRequests.map((req) => (
                <div
                  key={req.id}
                  style={{
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1rem',
                    backgroundColor: 'var(--background)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyBetween: 'space-between', alignItems: 'center', width: '100%' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{req.farmerName}</span>
                    <Badge status="Pending">Pending</Badge>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', gap: '1rem' }}>
                    <span>Crops: <strong>{req.category}</strong></span>
                    <span>Loads: <strong>{req.weight}</strong></span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                    <Button
                      variant="primary"
                      onClick={() => handleBookingAction(req.id, 'Approved')}
                      style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem', flex: 1 }}
                      icon={<Check size={12} />}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleBookingAction(req.id, 'Rejected')}
                      style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem', flex: 1 }}
                      icon={<X size={12} />}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Booking History Table */}
      <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3 className="manager-dashboard-section-title">All Allocated Facilities Bookings</h3>
        <Table
          headers={bookingHeaders}
          data={bookings.filter((b) => b.storageId === hubId)}
        />
      </div>
    </div>
  );
};

export default ManagerDashboard;
