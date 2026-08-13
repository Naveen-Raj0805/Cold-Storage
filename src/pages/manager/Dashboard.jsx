import React, { useState, useEffect } from 'react';
import { 
  Warehouse, ShieldAlert, ThermometerSnowflake, Package, Bell, 
  ArrowRight, Users, CheckCircle2 
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend 
} from 'recharts';
import StatCard from '../../components/StatCard/StatCard';
import ChartCard from '../../components/ChartCard/ChartCard';
import DataTable from '../../components/DataTable/DataTable';
import Badge from '../../components/Badge/Badge';
import Button from '../../components/Button/Button';
import { 
  getStorageUnits, getProducts, getAlerts, getBookings 
} from '../../services/mockData';

const ManagerDashboard = () => {
  const [localUnits, setLocalUnits] = useState([]);
  const [products, setProducts] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    // A Storage Manager manages their specific facility. Let's filter units managed by 'Sarah Connor' (the default demo manager)
    const allUnits = getStorageUnits();
    const managed = allUnits.filter(u => u.manager === 'Sarah Connor');
    setLocalUnits(managed);

    // Products in their chambers
    const allProducts = getProducts();
    const managedNames = managed.map(u => u.name);
    const localProds = allProducts.filter(p => managedNames.includes(p.storageUnit));
    setProducts(localProds);

    // Local alerts
    const allAlerts = getAlerts();
    const localAlts = allAlerts.filter(a => managedNames.includes(a.facility) && !a.acknowledged);
    setAlerts(localAlts);

    // Bookings requests for their chamber categories
    const allBookings = getBookings();
    setBookings(allBookings.filter(b => b.status === 'Approved' && managedNames.includes(b.assignedUnit)));
  }, []);

  // Summary Metrics
  const activeAlertsCount = alerts.length;
  const totalQuantityStored = products.length;
  const occupancyAverage = Math.round(
    localUnits.reduce((acc, curr) => acc + curr.capacity, 0) / (localUnits.length || 1)
  );

  // Chart data matching temperatures
  const chartData = localUnits.map(u => ({
    name: u.name.replace('Cold Chamber ', '').replace('Cool Cell ', ''),
    Temperature: u.currentTemp,
    Target: u.targetTemp
  }));

  const columns = [
    { header: 'ID', accessor: 'id' },
    { 
      header: 'Product Name', 
      accessor: 'name',
      render: (val) => <span className="text-semibold">{val}</span>
    },
    { header: 'Farmer Client', accessor: 'farmer' },
    { header: 'Storage Room', accessor: 'storageUnit' },
    { header: 'Quantity Stored', accessor: 'quantity' },
    { header: 'Expiration', accessor: 'expiryDate' },
    { 
      header: 'Climate Status', 
      accessor: 'status',
      render: (val, row) => (
        <span className="text-semibold" style={{ color: 'var(--primary-green)' }}>
          {row.temp} ({row.humidity})
        </span>
      )
    }
  ];

  return (
    <div className="d-flex flex-column gap-lg">
      <div className="d-flex align-center justify-between">
        <div>
          <h2 className="text-bold" style={{ fontSize: '22px' }}>Manager Dashboard</h2>
          <p className="text-secondary-color" style={{ fontSize: '14px' }}>
            Operational metrics for assigned chambers: Alpha & Gamma
          </p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="d-grid grid-cols-3 gap-md">
        <StatCard 
          title="Assigned Chambers" 
          value={`${localUnits.length} Rooms`}
          icon={Warehouse}
          trendValue={activeAlertsCount > 0 ? `${activeAlertsCount} Warning` : 'Optimal state'}
          trendDirection={activeAlertsCount > 0 ? 'down' : 'flat'}
          trendLabel="requires supervisor attention"
          status={activeAlertsCount > 0 ? 'danger' : 'success'}
        />

        <StatCard 
          title="Occupancy Load" 
          value={`${occupancyAverage}%`}
          icon={ThermometerSnowflake}
          trendValue="+2.1%"
          trendDirection="up"
          trendLabel="since yesterday load check"
          status="warning"
        />

        <StatCard 
          title="Tracked Inventories" 
          value={`${totalQuantityStored} Crops`}
          icon={Package}
          trendValue={bookings.length > 0 ? `${bookings.length} active leases` : 'Synced'}
          trendDirection="up"
          trendLabel="linked farmers"
          status="info"
        />
      </div>

      {/* Alerts notification card */}
      {alerts.length > 0 && (
        <div className="card-base bg-danger-light d-flex align-center gap-md p-md animate-fade-in" style={{ border: '1px solid rgba(220, 38, 38, 0.2)' }}>
          <Bell className="text-secondary-color animate-fade-in" style={{ color: 'var(--danger)', animation: 'spin 4s linear infinite' }} size={24} />
          <div className="flex-1">
            <h4 className="text-semibold m-0" style={{ color: 'var(--danger)', fontSize: '15px' }}>Critical Chamber Alert</h4>
            <p className="m-0 text-secondary-color" style={{ fontSize: '13px', color: '#7F1D1D' }}>
              {alerts[0].message}
            </p>
          </div>
          <Button variant="danger" size="small" onClick={() => navigate('/manager/alerts')}>
            Acknowledge Alerts
          </Button>
        </div>
      )}

      {/* Climate Graph & Quick Stats */}
      <div className="d-grid grid-cols-3 gap-md">
        <div style={{ gridColumn: 'span 2' }}>
          <ChartCard 
            title="Climate Variance Auditing" 
            subtitle="Comparing target temperatures vs actual current temperatures across managed rooms"
          >
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} tickLine={false} />
                <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="Target" fill="var(--text-secondary)" radius={[4, 4, 0, 0]} barSize={24} />
                <Bar dataKey="Temperature" fill="var(--primary-green)" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Quick chamber info cards */}
        <div className="d-flex flex-column gap-md">
          <div className="card-base p-md flex-1 d-flex flex-column justify-between">
            <div>
              <div className="d-flex justify-between align-center mb-sm">
                <h4 className="text-semibold m-0" style={{ fontSize: '14px' }}>Chamber Alpha</h4>
                <Badge status="Optimal" />
              </div>
              <p className="text-secondary-color m-0" style={{ fontSize: '12px' }}>
                Deep freeze, storing seafood and meat products. Stable operation.
              </p>
            </div>
            <div className="d-flex justify-between mt-sm" style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--spacing-sm)' }}>
              <span className="text-bold">-18.2 °C</span>
              <span className="text-secondary-color" style={{ fontSize: '12px' }}>Load: 85%</span>
            </div>
          </div>

          <div className="card-base p-md flex-1 d-flex flex-column justify-between">
            <div>
              <div className="d-flex justify-between align-center mb-sm">
                <h4 className="text-semibold m-0" style={{ fontSize: '14px' }}>Chamber Gamma</h4>
                <Badge status="Warning" />
              </div>
              <p className="text-secondary-color m-0" style={{ fontSize: '12px' }}>
                Chilled storage, potatoes and carrots. Higher humidity detected.
              </p>
            </div>
            <div className="d-flex justify-between mt-sm" style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--spacing-sm)' }}>
              <span className="text-bold" style={{ color: 'var(--warning)' }}>5.8 °C</span>
              <span className="text-secondary-color" style={{ fontSize: '12px' }}>Load: 95%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stored Inventories Table */}
      <div className="d-flex flex-column gap-sm">
        <h3 className="text-semibold" style={{ fontSize: '18px', color: 'var(--text-primary)' }}>
          Active Chamber Inventory
        </h3>
        <DataTable 
          columns={columns}
          data={products}
          itemsPerPage={5}
        />
      </div>
    </div>
  );
};

export default ManagerDashboard;
