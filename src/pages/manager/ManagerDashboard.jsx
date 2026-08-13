import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { 
  Thermometer, Droplets, ShieldAlert, Package, 
  Users, Activity, Lock, AlertTriangle, Play, Warehouse, Bell, Sparkles, TrendingDown, Truck, ArrowRight, Layers, Check, X, Clock
} from 'lucide-react';
import { StatCard, SkeletonLoader, EmptyState } from '../../components/UI';
import { motion, useReducedMotion } from 'framer-motion';
import { 
  ResponsiveContainer, LineChart, Line, AreaChart, Area, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from 'recharts';
import { getSpoilageQueue } from '../../services/aiService';
import { getChambersByStorage } from '../../services/api';

export const ManagerDashboard = () => {
  const { storages, products, alerts, users, bookings, approveBooking, rejectBooking, currentUser, triggerToast } = useContext(AppContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [spoilageQueue, setSpoilageQueue] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [facilityChambers, setFacilityChambers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const queue = await getSpoilageQueue();
        // Ensure sorted by spoilage risk descending (Highest risk first)
        const sorted = [...queue].sort((a, b) => b.spoilageRiskPercent - a.spoilageRiskPercent);
        setSpoilageQueue(sorted);
        if (sorted.length > 0) setSelectedBatch(sorted[0]);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAuthorizeAction = (actionName) => {
    triggerToast(`${actionName} authorized successfully for ${selectedBatch?.productName || 'batch'}. Logged to supply chain system.`, 'success');
  };

  // Find manager storage dynamically with robust fallback
  const managerStorage = (Array.isArray(storages) && storages.length > 0)
    ? (storages.find(s => 
        (currentUser?.assignedStorage && s?.name === currentUser.assignedStorage) || 
        (currentUser?.fullName && s?.manager && s.manager.toLowerCase() === currentUser.fullName.toLowerCase()) ||
        (currentUser?.name && s?.manager && s.manager.toLowerCase() === currentUser.name.toLowerCase())
      ) || storages[0])
    : null;

  const managerStorageId = managerStorage?.numericId || (typeof managerStorage?.id === 'string' && managerStorage.id.startsWith('STR-') ? Number(managerStorage.id.replace('STR-', '')) : managerStorage?.id);

  useEffect(() => {
    let isMounted = true;
    const loadChambers = async () => {
      if (managerStorageId) {
        try {
          const data = await getChambersByStorage(managerStorageId);
          if (isMounted) setFacilityChambers(Array.isArray(data) ? data : []);
        } catch (e) {
          console.warn("Failed to load chambers for manager dashboard", e);
        }
      }
    };
    loadChambers();
    return () => { isMounted = false; };
  }, [managerStorageId, bookings, storages]);

  const storageDisplay = managerStorage || {
    name: 'AgriFreeze Cold Storage',
    capacity: 5000,
    occupied: 0,
    location: 'Central Region',
    temp: 4.0,
    humidity: 80.0
  };

  const facilityProducts = managerStorage 
    ? (Array.isArray(products) ? products : []).filter(p => p && (p.storageId === managerStorage.id || (p.storageName && managerStorage.name && p.storageName.toLowerCase() === managerStorage.name.toLowerCase())))
    : (Array.isArray(products) ? products : []);

  const facilityAlerts = managerStorage 
    ? (Array.isArray(alerts) ? alerts : []).filter(a => a && a.storage && managerStorage.name && a.storage.toLowerCase() === managerStorage.name.toLowerCase())
    : (Array.isArray(alerts) ? alerts : []);

  const activeFacilityAlerts = facilityAlerts.filter(a => a && a.status === 'Active');
  const uniqueFarmers = [...new Set(facilityProducts.map(p => p?.farmerName).filter(Boolean))];

  // Filter pending farmer requests for this manager's storage facility safely
  const pendingRequests = (Array.isArray(bookings) ? bookings : []).filter(b => {
    if (!b) return false;
    const bStatus = b.status ? String(b.status).toLowerCase() : '';
    const isPendingStatus = bStatus === 'pending' || bStatus === 'created';
    const mName = managerStorage?.name ? String(managerStorage.name).toLowerCase() : '';
    const bName = b.storageName ? String(b.storageName).toLowerCase() : '';
    const mId = managerStorage?.id ? String(managerStorage.id) : '';
    const mNumId = managerStorageId ? String(managerStorageId) : '';
    
    const matchesFacility = !managerStorage || 
      (bName && mName && bName === mName) || 
      (b.storageId && mId && String(b.storageId) === mId) ||
      (b.storageId && mNumId && String(b.storageId) === mNumId);
    return Boolean(isPendingStatus && matchesFacility);
  });

  const sensorLogsData = [
    { time: '19:00', temp: 2.1, humidity: 84 },
    { time: '20:00', temp: 2.2, humidity: 85 },
    { time: '21:00', temp: 2.5, humidity: 86 },
    { time: '22:00', temp: 2.8, humidity: 85 },
    { time: '23:00', temp: 3.1, humidity: 87 },
    { time: '00:00', temp: storageDisplay?.temp || 4.0, humidity: storageDisplay?.humidity || 80 }
  ];

  const utilizationPct = (storageDisplay?.capacity > 0) ? Math.round(((storageDisplay.occupied || 0) / storageDisplay.capacity) * 100) : 0;
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Title */}
      <div className="page-header">
        <div className="page-title-row">
          <div>
            <h1 style={{ margin: 0, fontSize: '1.875rem' }}>Manager Operations & Allocation Requests</h1>
            <p className="page-subtitle">Commercial supply control & farmer approvals for <strong>{storageDisplay.name}</strong>.</p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <span className="badge badge-success" style={{ padding: '0.35rem 0.75rem' }}>
              Compressor: Operational
            </span>
            <span className="badge badge-primary" style={{ padding: '0.35rem 0.75rem' }}>
              Location: {storageDisplay.location}
            </span>
          </div>
        </div>
      </div>

      {/* Sensor stats grid */}
      {isLoading ? (
        <SkeletonLoader type="card" count={8} />
      ) : (
        <div className="stats-grid">
          <StatCard icon={Thermometer} title="Current Temperature" value={`${storageDisplay.temp}°C`} desc="Target range: 2.0°C - 4.0°C" statusColor={storageDisplay.temp > 5.0 ? 'danger' : 'success'} index={0} />
          <StatCard icon={Droplets} title="Current Humidity" value={`${storageDisplay.humidity || 85}%`} desc="Target range: 80% - 90% RH" statusColor="success" index={1} />
          <StatCard icon={Layers} title="Cooling Chambers" value={`${facilityChambers.length || 4} Chambers`} desc="Facility chilling chambers" statusColor="success" index={2} />
          <StatCard icon={Bell} title="Pending Requests" value={`${pendingRequests.length} Requests`} desc="Awaiting manager action" statusColor={pendingRequests.length > 0 ? 'warning' : 'success'} index={3} />
          <StatCard icon={Package} title="Products Stored" value={`${facilityProducts.length} Lots`} desc={`${storageDisplay.occupied || 0} Tons occupied`} index={4} />
          <StatCard icon={ShieldAlert} title="Open Alerts" value={activeFacilityAlerts.length} desc="Unresolved incidents" statusColor={activeFacilityAlerts.length > 0 ? 'danger' : 'success'} index={5} />
          <StatCard icon={Users} title="Active Farmers" value={uniqueFarmers.length || 3} desc="Booked storage holders" index={6} />
          <StatCard icon={Warehouse} title="Storage Capacity" value={`${utilizationPct}%`} desc="Remaining space active" statusColor={utilizationPct > 85 ? 'warning' : 'success'} index={7} />
        </div>
      )}

      {/* Pending Farmer Storage Allocation Requests Section */}
      <div className="card-section" style={{ marginBottom: '2rem', border: '1px solid rgba(245, 158, 11, 0.4)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Bell size={20} style={{ color: 'var(--status-warning)' }} />
            <span>Pending Farmer Allocation Requests ({pendingRequests.length} Pending)</span>
          </h3>
          <span className="badge badge-warning">Requires Manager Approval</span>
        </div>

        {pendingRequests.length === 0 ? (
          <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.875rem' }}>
            No pending farmer signup or allocation requests for {storageDisplay.name}.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {pendingRequests.map((req) => (
              <div 
                key={req.id} 
                style={{ 
                  backgroundColor: 'var(--border-light)', 
                  padding: '1.25rem', 
                  borderRadius: 'var(--radius-md)', 
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }}>{req.farmerName}</span>
                    <span className="badge badge-warning">Pending Approval</span>
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                    <span>Target Facility: <strong>{req.storageName}</strong></span>
                    <span>Requested Chamber: <strong>{req.chamberName}</strong></span>
                    <span>Crop Category: <strong>{req.category || 'General'}</strong></span>
                    <span>Load: <strong>{req.weight || '10 Tons'}</strong></span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button 
                    className="btn btn-success btn-sm"
                    style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}
                    onClick={() => approveBooking(req.id)}
                  >
                    <Check size={16} />
                    <span>Accept & Approve</span>
                  </button>

                  <button 
                    className="btn btn-danger btn-sm"
                    style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}
                    onClick={() => rejectBooking(req.id)}
                  >
                    <X size={16} />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Internal Cooling Chambers Section */}
      <div className="card-section" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Layers size={20} style={{ color: 'var(--primary-color)' }} />
            <span>Assigned Facility Cooling Chambers ({facilityChambers.length} Chambers Configured)</span>
          </h3>
          <span className="badge badge-primary" style={{ padding: '0.35rem 0.75rem' }}>Facility: {storageDisplay.name}</span>
        </div>

        {facilityChambers.length === 0 ? (
          <div style={{ padding: '1rem', color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.875rem' }}>
            Loading chambers or no chambers configured for this storage facility.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
            {facilityChambers.map((ch) => (
              <div key={ch.id} style={{ backgroundColor: 'var(--border-light)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{ch.name}</span>
                  <span className={`badge badge-${ch.status === 'AVAILABLE' ? 'success' : 'warning'}`}>{ch.status}</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Code: <strong>{ch.chamberCode}</strong></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.8125rem' }}>
                  <div>Total Cap: <strong>{ch.capacity} T</strong></div>
                  <div>Occupied: <strong>{ch.occupied} T</strong></div>
                  <div>Target Temp: <strong>{ch.targetTemp}°C</strong></div>
                  <div>Humidity: <strong>{ch.humidity}</strong></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>



      {/* Environmental Charts section */}
      <div className="charts-grid" style={{ marginBottom: '2rem' }}>
        <div className="chart-card">
          <div className="chart-card-header">
            <h3 className="chart-card-title">Temperature & Humidity Telemetry Logs</h3>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sensorLogsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="time" stroke="var(--text-muted)" fontSize={11} />
                <YAxis yAxisId="temp" stroke="var(--text-muted)" fontSize={11} tickLine={false} unit="°C" />
                <YAxis yAxisId="hum" orientation="right" stroke="var(--text-muted)" fontSize={11} tickLine={false} unit="%" />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line yAxisId="temp" type="monotone" dataKey="temp" stroke="var(--status-danger)" name="Temperature" strokeWidth={2} />
                <Line yAxisId="hum" type="monotone" dataKey="humidity" stroke="var(--status-info)" name="Humidity" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ManagerDashboard;
