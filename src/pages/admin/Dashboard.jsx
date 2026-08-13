import React, { useState, useEffect } from 'react';
import { 
  Warehouse, CalendarCheck, Users, Percent, AlertTriangle, 
  TrendingUp, Check, X, ShieldAlert 
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, PieChart, Pie, Cell, Legend 
} from 'recharts';
import StatCard from '../../components/StatCard/StatCard';
import ChartCard from '../../components/ChartCard/ChartCard';
import DataTable from '../../components/DataTable/DataTable';
import Badge from '../../components/Badge/Badge';
import Button from '../../components/Button/Button';
import { 
  getStorageUnits, getBookings, saveBookings, getUsers, 
  getAlerts, getAnalytics 
} from '../../services/mockData';

const AdminDashboard = () => {
  const [units, setUnits] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [analytics, setAnalytics] = useState({});

  useEffect(() => {
    setUnits(getStorageUnits());
    setBookings(getBookings());
    setUsers(getUsers());
    setAlerts(getAlerts());
    setAnalytics(getAnalytics());
  }, []);

  const handleBookingAction = (bookingId, action) => {
    const status = action === 'approve' ? 'Approved' : 'Rejected';
    
    // Find booking
    const booking = bookings.find(b => b.id === bookingId);
    let assignedUnit = '';
    
    if (status === 'Approved') {
      // Find a matching unit with available space (capacity < 100)
      const matchingType = booking.unitType;
      const unit = units.find(u => u.type === matchingType && u.capacity < 95);
      assignedUnit = unit ? unit.name : 'Cold Chamber Beta';
    }

    const updatedBookings = bookings.map(b => 
      b.id === bookingId ? { ...b, status, assignedUnit } : b
    );
    
    setBookings(updatedBookings);
    saveBookings(updatedBookings);
    
    // Dispatch event to refresh notifications
    window.dispatchEvent(new Event('alertsUpdated'));
  };

  // Calculate statistics
  const totalUnits = units.length;
  const criticalChambers = units.filter(u => u.status === 'Critical').length;
  const activeBookings = bookings.filter(b => b.status === 'Approved').length;
  const pendingBookings = bookings.filter(b => b.status === 'Pending');
  
  const averageOccupancy = Math.round(
    units.reduce((acc, curr) => acc + curr.capacity, 0) / (totalUnits || 1)
  );
  
  const totalFarmers = users.filter(u => u.role === 'Farmer').length;

  // Recharts colors
  const COLORS = ['#16A34A', '#3B82F6', '#F59E0B'];

  // Table Columns
  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Farmer', accessor: 'farmerName' },
    { header: 'Crop Type', accessor: 'cropType' },
    { 
      header: 'Space Type', 
      accessor: 'unitType',
      render: (val) => <span className="text-semibold">{val}</span>
    },
    { 
      header: 'Volume', 
      accessor: 'quantity',
      render: (val) => `${val.toLocaleString()} kg`
    },
    { 
      header: 'Cost', 
      accessor: 'totalCost',
      render: (val) => `$${val}`
    },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (val) => <Badge status={val} />
    },
    {
      header: 'Actions',
      accessor: 'id',
      align: 'right',
      render: (id, row) => (
        <div className="d-flex gap-xs justify-center">
          <Button 
            variant="secondary" 
            size="small" 
            icon={Check}
            onClick={() => handleBookingAction(id, 'approve')}
          >
            Approve
          </Button>
          <Button 
            variant="outline" 
            size="small" 
            icon={X}
            onClick={() => handleBookingAction(id, 'reject')}
          >
            Reject
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="d-flex flex-column gap-lg">
      {/* KPI Cards Row */}
      <div className="d-grid grid-cols-4 gap-md">
        <StatCard 
          title="Cold Chambers" 
          value={`${totalUnits} Facilities`}
          icon={Warehouse}
          trendValue={criticalChambers > 0 ? `${criticalChambers} Critical` : 'All Stable'}
          trendDirection={criticalChambers > 0 ? 'down' : 'flat'}
          trendLabel={criticalChambers > 0 ? 'requires attention' : 'system operational'}
          status={criticalChambers > 0 ? 'danger' : 'success'}
        />
        
        <StatCard 
          title="Active Rent Bookings" 
          value={activeBookings}
          icon={CalendarCheck}
          trendValue={pendingBookings.length > 0 ? `+${pendingBookings.length} pending` : 'Synced'}
          trendDirection="up"
          trendLabel="requires administrator approval"
          status="primary"
        />

        <StatCard 
          title="Overall Occupancy" 
          value={`${averageOccupancy}%`}
          icon={Percent}
          trendValue="+4.2%"
          trendDirection="up"
          trendLabel="since last month"
          status="warning"
        />

        <StatCard 
          title="Registered Farmers" 
          value={totalFarmers}
          icon={Users}
          trendValue="+12"
          trendDirection="up"
          trendLabel="active farm accounts"
          status="info"
        />
      </div>

      {/* Critical Alert Warning Bar */}
      {criticalChambers > 0 && (
        <div className="card-base bg-danger-light d-flex align-center gap-md p-md mb-xs animate-fade-in" style={{ border: '1px solid rgba(220, 38, 38, 0.2)' }}>
          <ShieldAlert className="text-secondary-color" style={{ color: 'var(--danger)' }} size={24} />
          <div className="flex-1">
            <h4 className="text-semibold m-0" style={{ color: 'var(--danger)', fontSize: '15px' }}>Critical Chamber Alert</h4>
            <p className="m-0 text-secondary-color" style={{ fontSize: '13px', color: '#7F1D1D' }}>
              Chamber Zeta temperature variance detected. Action required by storage administrators to avoid inventory losses.
            </p>
          </div>
          <Button variant="danger" size="small" onClick={() => navigate('/admin/storage')}>
            Investigate Chambers
          </Button>
        </div>
      )}

      {/* Charts Grid */}
      <div className="d-grid grid-cols-3 gap-md">
        {/* Occupancy Timeline Chart */}
        <div className="grid-cols-2" style={{ gridColumn: 'span 2' }}>
          <ChartCard 
            title="Chamber Capacity Trends" 
            subtitle="Monthly overall storage utilization across all facility zones"
          >
            {analytics.occupancyHistory && (
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={analytics.occupancyHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAdmin" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary-green)" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="var(--primary-green)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} tickLine={false} />
                  <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    name="Occupancy rate %"
                    dataKey="AdminUnits" 
                    stroke="var(--primary-green)" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorAdmin)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </ChartCard>
        </div>

        {/* Revenue Distribution Chart */}
        <div style={{ gridColumn: 'span 1' }}>
          <ChartCard 
            title="Space Utilization Breakdown" 
            subtitle="Billing share contribution by facility categories"
          >
            {analytics.revenueDistribution && (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={analytics.revenueDistribution}
                    cx="50%"
                    cy="45%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {analytics.revenueDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            )}
          </ChartCard>
        </div>
      </div>

      {/* Pending Booking Requests Table */}
      <div className="d-flex flex-column gap-sm">
        <div className="d-flex align-center justify-between">
          <h3 className="text-semibold" style={{ fontSize: '18px', color: 'var(--text-primary)' }}>
            Pending Rent Requests
          </h3>
          <span className="badge badge-warning">{pendingBookings.length} Requests awaiting</span>
        </div>
        
        <DataTable 
          columns={columns}
          data={pendingBookings}
          itemsPerPage={5}
          emptyMessage="No pending storage requests to approve."
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
