import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { 
  BarChart3, DollarSign, Calendar, Users, Package, 
  Activity, ArrowDownToLine, CheckCircle2 
} from 'lucide-react';
import { StatCard } from '../../components/UI';
import { 
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, 
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from 'recharts';

export const PlatformAnalytics = () => {
  const { 
    storages, users, products, bookings, triggerToast 
  } = useContext(AppContext);

  // Simulating exports loading state
  const [exportState, setExportState] = useState({ type: '', loading: false });

  // Calculations
  const bookingRevenue = bookings.reduce((sum, b) => sum + b.cost, 0);
  const totalRevenue = 48200 + bookingRevenue;
  const totalBookings = bookings.length + 152;
  const totalUsers = users.length * 8;
  const totalProducts = products.length * 15;

  // Chart Data: Commodity Category breakdown
  const categoryData = [
    { name: 'Fruits', value: 35 },
    { name: 'Vegetables', value: 40 },
    { name: 'Dairy & Poultry', value: 15 },
    { name: 'Grains & Seeds', value: 10 }
  ];
  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ec4899'];

  // Chart Data: Storage Uptime/Performance Efficiencies
  const performanceData = storages.map(s => ({
    name: s.name.replace('AgriFreeze Coldroom ', ''),
    efficiency: s.efficiency,
    capacity: s.capacity
  }));

  // Chart Data: Revenue Trend
  const monthlyRevenueData = [
    { month: 'Jan', Revenue: 34000, Bookings: 90 },
    { month: 'Feb', Revenue: 38200, Bookings: 110 },
    { month: 'Mar', Revenue: 41200, Bookings: 125 },
    { month: 'Apr', Revenue: 44900, Bookings: 140 },
    { month: 'May', Revenue: 46200, Bookings: 145 },
    { month: 'Jun', Revenue: totalRevenue, Bookings: totalBookings }
  ];

  // Exporter Simulators
  const triggerExport = (format) => {
    setExportState({ type: format, loading: true });
    
    setTimeout(() => {
      setExportState({ type: '', loading: false });
      triggerToast(
        'Export Successful', 
        `AgriFreeze_Platform_Report_${Date.now().toString().slice(-4)}.${format.toLowerCase() === 'pdf' ? 'pdf' : 'xlsx'} has been downloaded.`,
        'success'
      );
    }, 1500);
  };

  return (
    <div>
      {/* Title */}
      <div className="page-header">
        <div className="page-title-row">
          <div>
            <h1 style={{ margin: 0, fontSize: '1.875rem' }}>Platform Analytics</h1>
            <p className="page-subtitle">Aggregated business telemetry, system health, and margins.</p>
          </div>
          
          {/* Download Buttons Group */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button 
              className="btn btn-secondary" 
              onClick={() => triggerExport('Excel')}
              disabled={exportState.loading}
            >
              <ArrowDownToLine size={16} />
              <span>{exportState.loading && exportState.type === 'Excel' ? 'Generating XLSX...' : 'Export Excel'}</span>
            </button>
            <button 
              className="btn btn-primary" 
              onClick={() => triggerExport('PDF')}
              disabled={exportState.loading}
            >
              <ArrowDownToLine size={16} />
              <span>{exportState.loading && exportState.type === 'PDF' ? 'Compiling PDF...' : 'Download Report (PDF)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top metrics cards */}
      <div className="stats-grid">
        <StatCard icon={DollarSign} title="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} desc="Accumulated platform sales" trend={{ value: "+18.2% YoY", isPositive: true }} />
        <StatCard icon={Calendar} title="Total Bookings" value={totalBookings} desc="Cold storage reservations" trend={{ value: "+12.4% MoM", isPositive: true }} />
        <StatCard icon={Users} title="Total Users" value={totalUsers} desc="Active agricultural clients" trend={{ value: "+15.3% MoM", isPositive: true }} />
        <StatCard icon={Package} title="Total Products" value={`${totalProducts} Tons`} desc="Total weight checked-in" />
      </div>

      {/* Charts Layout */}
      <div className="charts-grid">
        {/* Revenue Trend Area */}
        <div className="chart-card" style={{ gridColumn: 'span 2' }}>
          <div className="chart-card-header">
            <h3 className="chart-card-title">Revenue & Reservation Growth Trend</h3>
          </div>
          <div className="chart-container" style={{ height: '360px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyRevenueData}>
                <defs>
                  <linearGradient id="primaryGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary-color)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="var(--primary-color)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={11} />
                <YAxis yAxisId="left" stroke="var(--text-muted)" fontSize={11} tickLine={false} unit="$" />
                <YAxis yAxisId="right" orientation="right" stroke="#3b82f6" fontSize={11} tickLine={false} />
                <Tooltip />
                <Legend />
                <Area yAxisId="left" type="monotone" dataKey="Revenue" stroke="var(--primary-color)" fillOpacity={1} fill="url(#primaryGrad)" strokeWidth={2.5} name="Revenue ($)" />
                <Bar yAxisId="right" dataKey="Bookings" fill="#3b82f6" opacity={0.15} radius={[4, 4, 0, 0]} name="Reservation Count" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Commodity distribution Pie */}
        <div className="chart-card">
          <div className="chart-card-header">
            <h3 className="chart-card-title">Stored Category Breakdown</h3>
          </div>
          <div className="chart-container" style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ flex: 1, height: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ width: '150px', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {categoryData.map((item, idx) => (
                <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: COLORS[idx] }} />
                  <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{item.name} ({item.value}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Storage Performance Bar Chart */}
        <div className="chart-card">
          <div className="chart-card-header">
            <h3 className="chart-card-title">Facility Efficiency Performance</h3>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} unit="%" />
                <Tooltip />
                <Bar dataKey="efficiency" fill="var(--primary-color)" radius={[4, 4, 0, 0]} name="Efficiency %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Platform Health Section */}
      <div className="card-section" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={18} style={{ color: 'var(--primary-color)' }} />
            <span>Platform Telemetric Health</span>
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Aggregated sensor mesh networks across coldrooms.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', backgroundColor: 'var(--border-light)', borderRadius: 'var(--radius-md)' }}>
            <CheckCircle2 size={24} style={{ color: 'var(--status-success)' }} />
            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Sensor Network</span>
              <strong style={{ fontSize: '0.9rem' }}>99.87% Online</strong>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', backgroundColor: 'var(--border-light)', borderRadius: 'var(--radius-md)' }}>
            <Activity size={24} style={{ color: 'var(--status-info)' }} />
            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Database Latency</span>
              <strong style={{ fontSize: '0.9rem' }}>14ms Standard</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
