import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package, Calendar, Bell, ArrowRight, ShieldAlert, 
  Leaf, Thermometer 
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip 
} from 'recharts';
import StatCard from '../../components/StatCard/StatCard';
import ChartCard from '../../components/ChartCard/ChartCard';
import DataTable from '../../components/DataTable/DataTable';
import Badge from '../../components/Badge/Badge';
import Button from '../../components/Button/Button';
import { 
  getProducts, getBookings, getStorageUnits, getAlerts, getCurrentUser 
} from '../../services/mockData';

const FarmerDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [units, setUnits] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const activeUser = getCurrentUser() || { name: 'Arthur Dent' };
    setUser(activeUser);

    // Farmer's crops
    const allProds = getProducts();
    const farmerProds = allProds.filter(p => p.farmer === activeUser.name);
    setProducts(farmerProds);

    // Bookings
    const allBookings = getBookings();
    setBookings(allBookings.filter(b => b.farmerName === activeUser.name));

    // Rented units
    const allUnits = getStorageUnits();
    const rentedNames = [...new Set(farmerProds.map(p => p.storageUnit))];
    const farmerUnits = allUnits.filter(u => rentedNames.includes(u.name));
    setUnits(farmerUnits);

    // Alerts related to their chambers
    const allAlerts = getAlerts();
    setAlerts(allAlerts.filter(a => rentedNames.includes(a.facility) && !a.acknowledged));
  }, []);

  // Summary statistics
  const totalItems = products.length;
  const activeBookingsCount = bookings.filter(b => b.status === 'Approved').length;
  const pendingRequests = bookings.filter(b => b.status === 'Pending').length;
  const activeAlertsCount = alerts.length;

  const handleBookRedirect = () => {
    navigate('/farmer/booking');
  };

  const columns = [
    { header: 'ID', accessor: 'id' },
    { 
      header: 'Stored Crop', 
      accessor: 'name',
      render: (val) => <span className="text-semibold">{val}</span>
    },
    { header: 'Category', accessor: 'type' },
    { header: 'Chamber Room', accessor: 'storageUnit' },
    { header: 'Volume Stored', accessor: 'quantity' },
    { header: 'Check-In', accessor: 'entryDate' },
    { header: 'Check-Out Limit', accessor: 'expiryDate' },
    { 
      header: 'Environment Log', 
      accessor: 'temp',
      render: (val, row) => (
        <span className="text-semibold" style={{ color: 'var(--primary-green)' }}>
          {row.temp} | {row.humidity} RH
        </span>
      )
    }
  ];

  // Mock climate values graph data
  const climateHistory = [
    { name: '00:00', Temp: -18.2, Target: -18.0 },
    { name: '04:00', Temp: -18.1, Target: -18.0 },
    { name: '08:00', Temp: -18.4, Target: -18.0 },
    { name: '12:00', Temp: -18.0, Target: -18.0 },
    { name: '16:00', Temp: -17.9, Target: -18.0 },
    { name: '20:00', Temp: -18.2, Target: -18.0 },
    { name: '24:00', Temp: -18.2, Target: -18.0 }
  ];

  return (
    <div className="d-flex flex-column gap-lg">
      <div className="d-flex align-center justify-between">
        <div>
          <h2 className="text-bold" style={{ fontSize: '22px' }}>Farmer Overview</h2>
          <p className="text-secondary-color" style={{ fontSize: '14px' }}>
            Operational metrics for {user?.farmName || 'Heart of Gold Farms'} crop stocks
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="d-grid grid-cols-3 gap-md">
        <StatCard 
          title="My Stored Crop Batches" 
          value={`${totalItems} Batches`}
          icon={Leaf}
          trendValue={pendingRequests > 0 ? `+${pendingRequests} pending bookings` : 'Healthy climate'}
          trendDirection="up"
          trendLabel="active chamber leases"
          status="success"
        />

        <StatCard 
          title="Active Chamber Leases" 
          value={activeBookingsCount}
          icon={Calendar}
          trendValue={pendingRequests > 0 ? `${pendingRequests} Request awaiting` : 'Synced'}
          trendDirection="up"
          trendLabel="registered leases"
          status="info"
        />

        <StatCard 
          title="Climatic Warning triggers" 
          value={activeAlertsCount}
          icon={Bell}
          trendValue={activeAlertsCount > 0 ? 'Variance Warning' : 'Optimal'}
          trendDirection={activeAlertsCount > 0 ? 'down' : 'flat'}
          trendLabel={activeAlertsCount > 0 ? 'Chamber climate fluctuation' : 'No warnings'}
          status={activeAlertsCount > 0 ? 'danger' : 'success'}
        />
      </div>

      {/* Critical Chamber Alerts Warning Bar */}
      {alerts.length > 0 && (
        <div className="card-base bg-danger-light d-flex align-center gap-md p-md animate-fade-in" style={{ border: '1px solid rgba(220, 38, 38, 0.2)' }}>
          <ShieldAlert className="text-secondary-color" style={{ color: 'var(--danger)' }} size={24} />
          <div className="flex-1">
            <h4 className="text-semibold m-0" style={{ color: 'var(--danger)', fontSize: '15px' }}>Chamber Climate Fluctuation Warning</h4>
            <p className="m-0 text-secondary-color" style={{ fontSize: '13px', color: '#7F1D1D' }}>
              Warning triggers on `{alerts[0].facility}`: temperature fluctuation detected. Supervisor Sarah Connor has been notified.
            </p>
          </div>
          <Button variant="danger" size="small" onClick={() => navigate('/farmer/notifications')}>
            Check Warnings
          </Button>
        </div>
      )}

      {/* Grid of chart & Booking Shortcut */}
      <div className="d-grid grid-cols-3 gap-md">
        {/* Environment chart */}
        <div style={{ gridColumn: 'span 2' }}>
          <ChartCard 
            title="My Cold Chamber Air Temperature Log" 
            subtitle="Historical hourly climate readings for active leased spaces (Alpha zone)"
          >
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={climateHistory} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary-green)" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="var(--primary-green)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} tickLine={false} />
                <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} />
                <Tooltip />
                <Area 
                  type="monotone" 
                  name="Current Temp (°C)"
                  dataKey="Temp" 
                  stroke="var(--primary-green)" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorTemp)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Quick Booking card */}
        <div style={{ gridColumn: 'span 1' }}>
          <div className="card-base p-lg d-flex flex-column justify-between" style={{ height: '100%' }}>
            <div>
              <h3 className="text-semibold mb-sm" style={{ fontSize: '16px' }}>Rent Additional Capacity</h3>
              <p className="text-secondary-color" style={{ fontSize: '13px', lineLines: '1.4' }}>
                Need more chilled or deep freeze space? Create a new booking request in less than a minute. System automatically calculates charges.
              </p>
            </div>
            <Button 
              variant="primary" 
              icon={ArrowRight} 
              iconPosition="right" 
              onClick={handleBookRedirect}
              style={{ width: '100%', height: '42px' }}
            >
              Request Lease Space
            </Button>
          </div>
        </div>
      </div>

      {/* Stock holding table */}
      <div className="d-flex flex-column gap-sm">
        <h3 className="text-semibold" style={{ fontSize: '18px', color: 'var(--text-primary)' }}>
          My Active Crop Stocks
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

export default FarmerDashboard;
