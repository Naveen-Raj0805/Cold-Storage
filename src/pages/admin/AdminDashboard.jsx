import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { 
  Warehouse, Users, ShieldAlert, Package, 
  DollarSign, Activity, FileText, Settings, Plus 
} from 'lucide-react';
import { StatCard, DataTable, Modal, FormInput, FormSelect, SkeletonLoader } from '../../components/UI';
import { motion, useReducedMotion } from 'framer-motion';
import { 
  ResponsiveContainer, LineChart, Line, BarChart, Bar, 
  AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend 
} from 'recharts';

export const AdminDashboard = () => {
  const { 
    storages, addStorage, managers, addManager, 
    users, products, alerts, bookings, triggerToast, t 
  } = useContext(AppContext);
  
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Modals state
  const [isStorageModalOpen, setIsStorageModalOpen] = useState(false);
  const [isManagerModalOpen, setIsManagerModalOpen] = useState(false);

  // New storage form state
  const [storageForm, setStorageForm] = useState({
    name: '', capacity: '', location: '', manager: '', status: 'Active'
  });

  // New manager form state
  const [managerForm, setManagerForm] = useState({
    name: '', email: '', phone: '', assignedStorage: 'None', experience: '', status: 'Active'
  });

  // Metrics calculations
  const totalStoragesCount = storages.length;
  const activeAlertsCount = alerts.filter(a => a.status === 'Active').length;
  const totalManagersCount = managers.length;
  const totalUsersCount = users.length;
  const totalProductsCount = products.length;
  const highRiskCount = products.filter(p => p.spoilageRisk === 'High').length;
  
  // Total Revenue calculation (Bookings + mock constants)
  const bookingRevenue = bookings.reduce((sum, b) => sum + b.cost, 0);
  const monthlyRevenue = 28500 + bookingRevenue;

  // Chart Data: Storage Utilization
  const utilizationData = storages.map(s => ({
    name: s.name.replace('AgriFreeze Coldroom ', ''),
    value: Math.round((s.occupied / s.capacity) * 100),
    capacity: s.capacity,
    occupied: s.occupied
  }));

  // Chart Data: Revenue Trend
  const revenueTrendData = [
    { month: 'Jan', revenue: 21000 },
    { month: 'Feb', revenue: 23500 },
    { month: 'Mar', revenue: 24200 },
    { month: 'Apr', revenue: 26800 },
    { month: 'May', revenue: 27900 },
    { month: 'Jun', revenue: monthlyRevenue }
  ];

  // Chart Data: Platform Growth (Total users and products)
  const growthData = [
    { month: 'Jan', Farmers: 12, Products: 30 },
    { month: 'Feb', Farmers: 18, Products: 45 },
    { month: 'Mar', Farmers: 25, Products: 72 },
    { month: 'Apr', Farmers: 32, Products: 110 },
    { month: 'May', Farmers: 41, Products: 160 },
    { month: 'Jun', Farmers: totalUsersCount * 8, Products: totalProductsCount * 12 }
  ];

  // Pie chart alert severity distributions
  const activeAlerts = alerts.filter(a => a.status === 'Active');
  const criticalCount = activeAlerts.filter(a => a.severity === 'Critical').length;
  const warningCount = activeAlerts.filter(a => a.severity === 'Warning').length;
  const alertPieData = [
    { name: 'Critical', value: criticalCount || 1 },
    { name: 'Warning', value: warningCount || 2 }
  ];
  const ALERT_COLORS = ['var(--status-danger)', 'var(--status-warning)'];

  // Table Columns config for Storage Performance
  const storageColumns = [
    { header: 'Storage Name', accessor: 'name', sortable: true },
    { 
      header: 'Utilization', 
      accessor: 'utilization', 
      cell: (row) => {
        const pct = Math.round((row.occupied / row.capacity) * 100);
        const barColor = pct > 90 ? 'var(--status-danger)' : pct > 75 ? 'var(--status-warning)' : 'var(--primary-color)';
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: '150px' }}>
            <div style={{ flex: 1, backgroundColor: 'var(--border-color)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${pct}%`, backgroundColor: barColor, height: '100%', borderRadius: '4px', transition: 'width 0.5s ease-in-out' }} />
            </div>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{pct}%</span>
          </div>
        );
      }
    },
    { header: 'Efficiency', accessor: 'efficiency', cell: (row) => `${row.efficiency}%`, sortable: true },
    { 
      header: 'Status', 
      accessor: 'status', 
      cell: (row) => (
        <span className={`badge badge-${row.status === 'Active' ? 'success' : 'danger'}`}>
          {row.status}
        </span>
      )
    }
  ];

  // Quick Action form submission
  const handleAddStorageSubmit = (e) => {
    e.preventDefault();
    if (!storageForm.name || !storageForm.capacity || !storageForm.location) {
      triggerToast('Validation Error', 'Please complete all required fields.', 'danger');
      return;
    }
    addStorage({
      name: storageForm.name,
      capacity: Number(storageForm.capacity),
      location: storageForm.location,
      manager: storageForm.manager || 'Unassigned',
      status: storageForm.status,
      occupied: 0,
      temp: 4.0,
      humidity: 80,
      efficiency: 90
    });
    setIsStorageModalOpen(false);
    setStorageForm({ name: '', capacity: '', location: '', manager: '', status: 'Active' });
  };

  const handleAddManagerSubmit = (e) => {
    e.preventDefault();
    if (!managerForm.name || !managerForm.email || !managerForm.phone) {
      triggerToast('Validation Error', 'Please complete all required fields.', 'danger');
      return;
    }
    addManager(managerForm);
    setIsManagerModalOpen(false);
    setManagerForm({ name: '', email: '', phone: '', assignedStorage: 'None', experience: '', status: 'Active' });
  };

  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-row">
          <div>
            <h1 style={{ margin: 0, fontSize: '1.875rem' }}>{t('adminDashboardTitle')}</h1>
            <p className="page-subtitle">{t('adminDashboardSub')}</p>
          </div>
          <span className="badge badge-success" style={{ padding: '0.375rem 0.75rem', fontWeight: 600 }}>
            {t('systemHealth')}
          </span>
        </div>
      </div>

      {/* Stats Cards Grid */}
      {isLoading ? (
        <SkeletonLoader type="card" count={8} />
      ) : (
        <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          <StatCard 
            icon={Warehouse} 
            title={t('totalStorages')} 
            value={totalStoragesCount} 
            desc="Facilities catalogued" 
            trend={{ value: "+1 active", isPositive: true }} 
            index={0}
          />
          <StatCard 
            icon={Package} 
            title={t('highRiskProducts')} 
            value={highRiskCount} 
            desc="Nearing expiry threshold" 
            statusColor="danger"
            index={1}
          />
          <StatCard 
            icon={Users} 
            title={t('totalManagers')} 
            value={totalManagersCount} 
            desc="Facility supervisors" 
            trend={{ value: "+2 pending", isPositive: true }}
            index={2}
          />
          <StatCard 
            icon={ShieldAlert} 
            title={t('activeAlerts')} 
            value={activeAlertsCount} 
            desc="Telemetric incidents" 
            statusColor={activeAlertsCount > 0 ? "danger" : "success"}
            index={3}
          />
          <StatCard 
            icon={Users} 
            title={t('totalUsers')} 
            value={totalUsersCount} 
            desc="Active platform accounts" 
            trend={{ value: "+14% MoM", isPositive: true }}
            index={4}
          />
          <StatCard 
            icon={DollarSign} 
            title="Monthly Revenue" 
            value={`$${monthlyRevenue.toLocaleString()}`} 
            desc="Coldroom bookings income" 
            trend={{ value: "+8.3% MoM", isPositive: true }}
            index={5}
          />
          <StatCard 
            icon={Package} 
            title="Total Products" 
            value={totalProductsCount} 
            desc="Tons stored currently" 
            index={6}
          />
          <StatCard 
            icon={Activity} 
            title="System Health" 
            value="98.2%" 
            desc="Aggregated sensor uptime" 
            statusColor="success"
            index={7}
          />
        </div>
      )}

      {/* Analytics Charts Grid */}
      {isLoading ? (
        <div className="charts-grid">
          <SkeletonLoader type="chart" />
          <SkeletonLoader type="chart" />
          <SkeletonLoader type="chart" />
          <SkeletonLoader type="chart" />
        </div>
      ) : (
        <div className="charts-grid">
          {/* Storage Capacity Utilization */}
          <div className="chart-card">
            <div className="chart-card-header">
              <h3 className="chart-card-title">Storage Utilization (%)</h3>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={utilizationData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                  <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                  <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} unit="%" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', borderRadius: 'var(--radius-md)' }} 
                    labelStyle={{ color: 'var(--text-main)', fontWeight: 600 }}
                  />
                  <Bar dataKey="value" fill="var(--primary-color)" radius={[4, 4, 0, 0]} name="Occupied Capacity %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Alerts distribution */}
          <div className="chart-card">
            <div className="chart-card-header">
              <h3 className="chart-card-title">Active Alerts Overview</h3>
            </div>
            <div className="chart-container" style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ flex: 1, height: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={alertPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {alertPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={ALERT_COLORS[index % ALERT_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ width: '120px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--status-danger)' }} />
                  <span style={{ fontSize: '0.8125rem' }}>Critical ({criticalCount})</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--status-warning)' }} />
                  <span style={{ fontSize: '0.8125rem' }}>Warning ({warningCount})</span>
                </div>
              </div>
            </div>
          </div>

          {/* Monthly Revenue Trend */}
          <div className="chart-card">
            <div className="chart-card-header">
              <h3 className="chart-card-title">Revenue Trend</h3>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueTrendData}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary-color)" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="var(--primary-color)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                  <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={11} />
                  <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} unit="$" />
                  <Tooltip />
                  <Area type="monotone" dataKey="revenue" stroke="var(--primary-color)" fillOpacity={1} fill="url(#colorRev)" strokeWidth={2} name="Revenue ($)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Platform Growth */}
          <div className="chart-card">
            <div className="chart-card-header">
              <h3 className="chart-card-title">Platform Growth</h3>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                  <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={11} />
                  <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Line type="monotone" dataKey="Farmers" stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="Products" stroke="var(--primary-color)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Storage Performance Table */}
      <div className="card-section">
        <h3 style={{ fontSize: '1.125rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Warehouse size={18} style={{ color: 'var(--primary-color)' }} />
          <span>Storage Performance & Capacities</span>
        </h3>
        {isLoading ? (
          <SkeletonLoader type="table" count={5} />
        ) : (
          <DataTable 
            columns={storageColumns} 
            data={storages} 
            searchPlaceholder="Search storage name or location..." 
            searchField="name" 
            emptyTitle="No storage facilities available"
            emptyDesc="Configure coldrooms to start monitoring system status and sensor alerts."
            emptyIcon={Warehouse}
            emptyActionLabel="Configure Cold Storage"
            onEmptyAction={() => setIsStorageModalOpen(true)}
          />
        )}
      </div>

      {/* Quick Action Cards */}
      <div>
        <h3 style={{ fontSize: '1.125rem', marginBottom: '1.25rem' }}>Quick Actions</h3>
        <div className="quick-actions-grid">
          <div className="quick-action-card" onClick={() => setIsStorageModalOpen(true)}>
            <div className="quick-action-icon"><Warehouse size={20} /></div>
            <span className="quick-action-title">Configure Cold Storage</span>
          </div>
          <div className="quick-action-card" onClick={() => setIsManagerModalOpen(true)}>
            <div className="quick-action-icon"><Users size={20} /></div>
            <span className="quick-action-title">Register Manager</span>
          </div>
          <div className="quick-action-card" onClick={() => navigate('/admin/analytics')}>
            <div className="quick-action-icon"><FileText size={20} /></div>
            <span className="quick-action-title">Reports & Metrics</span>
          </div>
          <div className="quick-action-card" onClick={() => navigate('/admin/settings')}>
            <div className="quick-action-icon"><Settings size={20} /></div>
            <span className="quick-action-title">Platform Settings</span>
          </div>
        </div>
      </div>

      {/* Storage Creation Modal */}
      <Modal 
        isOpen={isStorageModalOpen} 
        onClose={() => setIsStorageModalOpen(false)}
        title="Add Storage Facility Room"
        footerButtons={
          <>
            <button className="btn btn-secondary" onClick={() => setIsStorageModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleAddStorageSubmit}>Create Room</button>
          </>
        }
      >
        <form onSubmit={handleAddStorageSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <FormInput 
            label="Storage Name" 
            id="storage-name" 
            name="name" 
            value={storageForm.name} 
            onChange={(e) => setStorageForm({...storageForm, name: e.target.value})} 
            required 
          />
          <FormInput 
            label="Capacity (in Tons)" 
            id="storage-capacity" 
            name="capacity" 
            type="number"
            value={storageForm.capacity} 
            onChange={(e) => setStorageForm({...storageForm, capacity: e.target.value})} 
            required 
          />
          <FormInput 
            label="Location" 
            id="storage-location" 
            name="location" 
            value={storageForm.location} 
            onChange={(e) => setStorageForm({...storageForm, location: e.target.value})} 
            required 
          />
          <FormSelect 
            label="Assign Manager" 
            id="storage-mgr" 
            name="manager" 
            value={storageForm.manager} 
            onChange={(e) => setStorageForm({...storageForm, manager: e.target.value})}
            options={managers.map(m => ({ label: m.name, value: m.name }))}
          />
          <FormSelect 
            label="Initial Status" 
            id="storage-status" 
            name="status" 
            value={storageForm.status} 
            onChange={(e) => setStorageForm({...storageForm, status: e.target.value})}
            options={[
              { label: 'Active', value: 'Active' },
              { label: 'Inactive', value: 'Inactive' }
            ]}
          />
        </form>
      </Modal>

      {/* Manager Creation Modal */}
      <Modal 
        isOpen={isManagerModalOpen} 
        onClose={() => setIsManagerModalOpen(false)}
        title="Register Storage Manager Profile"
        footerButtons={
          <>
            <button className="btn btn-secondary" onClick={() => setIsManagerModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleAddManagerSubmit}>Register Profile</button>
          </>
        }
      >
        <form onSubmit={handleAddManagerSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <FormInput 
            label="Full Name" 
            id="manager-name" 
            name="name" 
            value={managerForm.name} 
            onChange={(e) => setManagerForm({...managerForm, name: e.target.value})} 
            required 
          />
          <FormInput 
            label="Email Address" 
            id="manager-email" 
            name="email" 
            type="email"
            value={managerForm.email} 
            onChange={(e) => setManagerForm({...managerForm, email: e.target.value})} 
            required 
          />
          <FormInput 
            label="Phone Number" 
            id="manager-phone" 
            name="phone" 
            value={managerForm.phone} 
            onChange={(e) => setManagerForm({...managerForm, phone: e.target.value})} 
            required 
          />
          <FormInput 
            label="Years of Experience" 
            id="manager-exp" 
            name="experience" 
            value={managerForm.experience} 
            placeholder="e.g. 5 Years"
            onChange={(e) => setManagerForm({...managerForm, experience: e.target.value})} 
          />
          <FormSelect 
            label="Assign Coldroom Storage" 
            id="manager-storage" 
            name="assignedStorage" 
            value={managerForm.assignedStorage} 
            onChange={(e) => setManagerForm({...managerForm, assignedStorage: e.target.value})}
            options={[{ label: 'Unassigned', value: 'None' }, ...storages.map(s => ({ label: s.name, value: s.name }))]}
          />
        </form>
      </Modal>
    </motion.div>
  );
};
