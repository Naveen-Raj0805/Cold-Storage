import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Snowflake, UserCheck, Users, AlertTriangle } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { mockStorages, mockAnalytics, mockManagers, mockAlerts } from '../../data/mockData';
import PageHeader from '../../components/PageHeader/PageHeader';
import StatCard from '../../components/StatCard/StatCard';
import ChartCard from '../../components/ChartCard/ChartCard';
import Table from '../../components/Table/Table';
import Badge from '../../components/Badge/Badge';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Summary stats calculations
  const totalCapacity = mockStorages.reduce((acc, st) => acc + st.totalCapacity, 0);
  const occupiedCapacity = mockStorages.reduce((acc, st) => acc + st.occupiedCapacity, 0);
  const occupancyPercentage = ((occupiedCapacity / totalCapacity) * 100).toFixed(1);
  
  const activeManagers = mockManagers.filter((m) => m.status === 'Active').length;
  const activeAlerts = mockAlerts.filter((a) => a.status === 'Active').length;

  // Chart styling colors
  const COLORS = ['#10b981', '#0ea5e9', '#f59e0b'];

  const storageHeaders = [
    { key: 'name', label: 'Storage Facility', sortable: true },
    { key: 'location', label: 'Location' },
    { 
      key: 'currentTemp', 
      label: 'Temperature', 
      render: (val, row) => `${row.status === 'Active' ? val.toFixed(1) : '-'} °C` 
    },
    { 
      key: 'occupiedCapacity', 
      label: 'Chamber Load', 
      render: (val, row) => `${val.toLocaleString()} / ${row.totalCapacity.toLocaleString()} kg (${((val / row.totalCapacity) * 100).toFixed(0)}%)` 
    },
    { 
      key: 'status', 
      label: 'Status', 
      render: (val) => <Badge status={val}>{val}</Badge> 
    }
  ];

  return (
    <div className="page-container animate-fade-in">
      <PageHeader
        title="Admin Control Center"
        description="Monitor system-wide capacities, sensor warnings, and manager registrations."
      />

      {/* Stats Cards Section */}
      <div className="admin-dashboard-stats">
        <StatCard
          title="Total Storage Infrastructure"
          value={`${totalCapacity.toLocaleString()} kg`}
          icon={<Snowflake size={20} />}
          trendValue="+15%"
          trendDirection="up"
          trendLabel="capacity expanded"
        />
        <StatCard
          title="Space Occupancy Ratio"
          value={`${occupancyPercentage}%`}
          icon={<Snowflake size={20} />}
          trendValue={`${occupiedCapacity.toLocaleString()} kg loaded`}
          trendDirection="up"
          trendLabel="currently active"
          theme="blue"
        />
        <StatCard
          title="Active Hub Managers"
          value={`${activeManagers} Managers`}
          icon={<UserCheck size={20} />}
          trendValue={`${mockManagers.length} total`}
          trendDirection="up"
          trendLabel="monitored users"
        />
        <StatCard
          title="Critical Thermal Warnings"
          value={`${activeAlerts} Anomalies`}
          icon={<AlertTriangle size={20} />}
          trendValue="1 unresolved"
          trendDirection="down"
          trendLabel="since yesterday"
        />
      </div>

      {/* Analytics Charts Section */}
      <div className="admin-dashboard-charts">
        <ChartCard
          title="Storage Occupancy Growth"
          description="Total space occupancy trends across the last six calendar months."
        >
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={mockAnalytics.occupancyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorOccupancy" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} />
              <YAxis stroke="var(--text-muted)" fontSize={12} />
              <Tooltip />
              <Area type="monotone" dataKey="occupied" name="Occupied kg" stroke="var(--primary)" fillOpacity={1} fill="url(#colorOccupancy)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Revenue Share by Facility"
          description="Distribution of booking income collected per storage node."
        >
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={mockAnalytics.revenueByHub}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {mockAnalytics.revenueByHub.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Storage Facilities Table */}
      <div className="admin-dashboard-table-section">
        <div className="admin-dashboard-table-title-row">
          <h3 className="admin-dashboard-table-title">Storage Infrastructure Node Registry</h3>
          <Button variant="secondary" onClick={() => navigate('/admin/storage-management')}>
            Manage Facilities
          </Button>
        </div>
        <Table
          headers={storageHeaders}
          data={mockStorages}
          actions={[
            {
              type: 'view',
              onClick: () => navigate('/admin/storage-management')
            }
          ]}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
