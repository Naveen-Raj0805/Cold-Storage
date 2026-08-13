import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { 
  Warehouse, Thermometer, Droplets, 
  Mail, Phone, ArrowDownToLine, MapPin 
} from 'lucide-react';
import { StatCard } from '../../components/UI';

export const MyStorage = () => {
  const { currentUser, products, storages, bookings, getChambersByStorage, triggerToast } = useContext(AppContext);
  const [downloading, setDownloading] = useState(false);
  const [chambersList, setChambersList] = useState([]);
  const [selectedChamber, setSelectedChamber] = useState(null);

  // Find all farmer approved bookings
  const farmerApprovedBookings = (Array.isArray(bookings) ? bookings : []).filter(b => 
    b && (b.status && (b.status.toLowerCase() === 'approved' || b.status.toLowerCase() === 'active')) &&
    (
      b.farmerId === currentUser?.id || 
      String(b.farmerId) === String(currentUser?.id) || 
      (b.farmerName && currentUser?.fullName && b.farmerName.toLowerCase() === currentUser.fullName.toLowerCase()) ||
      (b.farmerName && currentUser?.name && b.farmerName.toLowerCase() === currentUser.name.toLowerCase())
    )
  );

  const [selectedBookingId, setSelectedBookingId] = useState(farmerApprovedBookings[0]?.id || null);

  // Synchronize default selected booking when bookings load
  useEffect(() => {
    if (farmerApprovedBookings.length > 0 && (!selectedBookingId || !farmerApprovedBookings.some(b => b.id === selectedBookingId))) {
      setSelectedBookingId(farmerApprovedBookings[0].id);
    }
  }, [farmerApprovedBookings]);

  const activeBooking = farmerApprovedBookings.find(b => b.id === selectedBookingId) || farmerApprovedBookings[0];
  const storageName = activeBooking?.storageName || currentUser?.bookedStorage || storages[0]?.name || 'Cold Storage Facility';
  const assignedStorage = storages.find(s => s.name === storageName || String(s.id) === String(activeBooking?.storageId)) || storages[0] || { id: 'STR-01', name: storageName, capacity: 125, temp: 4.0, humidity: 80, location: 'Central' };

  // Fetch real chamber-level telemetry for the active booking's storage unit
  useEffect(() => {
    if (activeBooking) {
      const rawStorageId = activeBooking.storageId || '1';
      const numericStorageId = Number(String(rawStorageId).replace(/[^0-9]/g, '')) || 1;

      getChambersByStorage(numericStorageId)
        .then(chambers => {
          if (Array.isArray(chambers)) {
            setChambersList(chambers);
            const matched = chambers.find(c => 
              (c.name && activeBooking.chamberName && c.name.toLowerCase() === activeBooking.chamberName.toLowerCase()) ||
              (c.chamberCode && activeBooking.chamberId && c.chamberCode.toLowerCase() === activeBooking.chamberId.toLowerCase()) ||
              String(c.id) === String(activeBooking.chamberId)
            );
            setSelectedChamber(matched || chambers[0] || null);
          }
        })
        .catch(err => {
          console.warn("Failed to load chamber details", err);
        });
    }
  }, [activeBooking?.id, activeBooking?.storageId, activeBooking?.chamberName, activeBooking?.chamberId]);

  // Farmer specific products in THIS selected chamber
  const storedItems = (Array.isArray(products) ? products : []).filter(p => 
    p && (
      p.farmerId === currentUser?.id || 
      String(p.farmerId) === String(currentUser?.id) || 
      (p.farmerName && currentUser?.fullName && p.farmerName.toLowerCase() === currentUser.fullName.toLowerCase()) ||
      (p.farmer && currentUser?.fullName && p.farmer.toLowerCase() === currentUser.fullName.toLowerCase()) ||
      (p.farmer && currentUser?.name && p.farmer.toLowerCase() === currentUser.name.toLowerCase())
    ) && (
      !activeBooking?.chamberName || p.chamberName === activeBooking.chamberName || p.storageName === activeBooking.storageName
    )
  );

  // Isolated chamber-level metrics
  const roomCapacity = selectedChamber ? selectedChamber.capacity : (activeBooking?.weight ? (Number(String(activeBooking.weight).replace(/[^0-9]/g, '')) || 125) : (assignedStorage.capacity || 125));
  const spaceUtilized = selectedChamber ? selectedChamber.occupied : storedItems.reduce((sum, p) => sum + Number(p.quantity || 0), 0);
  const availableSpace = Math.max(0, roomCapacity - spaceUtilized);
  const utilizationPct = roomCapacity > 0 ? Math.min(100, Math.round((spaceUtilized / roomCapacity) * 100)) : 0;
  const chamberTemp = selectedChamber && selectedChamber.temp != null ? selectedChamber.temp : assignedStorage.temp;
  const chamberHumidity = selectedChamber && selectedChamber.humidity ? selectedChamber.humidity : `${assignedStorage.humidity}% RH`;

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      triggerToast(
        'Audit Downloaded',
        `agrifreeze_storage_report_${assignedStorage.id}.pdf downloaded.`,
        'success'
      );
    }, 1200);
  };

  const handleRequestMore = () => {
    triggerToast(
      'Request Submitted',
      'Your request for additional storage allocation has been logged. An administrator will contact you shortly.',
      'info'
    );
  };

  return (
    <div>
      {/* Title */}
      <div className="page-header">
        <div className="page-title-row">
          <div>
            <h1 style={{ margin: 0, fontSize: '1.875rem' }}>My Storage Space</h1>
            <p className="page-subtitle">Telemetry monitoring for your allocated coldroom capacity.</p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-secondary" onClick={handleDownload} disabled={downloading}>
              <ArrowDownToLine size={16} />
              <span>{downloading ? 'Downloading...' : 'Download Storage Report'}</span>
            </button>
            <button className="btn btn-primary" onClick={handleRequestMore}>
              <span>Request More Space</span>
            </button>
          </div>
        </div>
      </div>

      {/* Chamber Switcher for Multi-Chamber Isolation */}
      {farmerApprovedBookings.length > 0 && (
        <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: 'var(--card-bg, rgba(255,255,255,0.05))', padding: '0.75rem 1.25rem', borderRadius: '0.5rem', border: '1px solid var(--border-color, rgba(255,255,255,0.1))' }}>
          <Warehouse size={20} style={{ color: 'var(--primary-color)' }} />
          <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Active Chamber Allocation:</span>
          <select 
            value={activeBooking?.id || ''} 
            onChange={(e) => setSelectedBookingId(e.target.value)}
            style={{ 
              backgroundColor: 'var(--bg-dark, #0f172a)', 
              color: 'var(--text-color, #f8fafc)', 
              padding: '0.4rem 0.75rem', 
              borderRadius: '0.375rem', 
              border: '1px solid var(--border-color, #334155)',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {farmerApprovedBookings.map(b => (
              <option key={b.id} value={b.id}>
                {b.chamberName || b.chamberId || 'Chamber'} ({b.storageName || 'Facility'}) — {b.weight || 'Slot'}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Stats Cards - Scoped strictly to selected Chamber */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <StatCard icon={Warehouse} title="Assigned Coldroom" value={selectedChamber?.name || activeBooking?.chamberName || 'Chamber 1'} desc={storageName} />
        <StatCard icon={Warehouse} title="Room Capacity" value={`${roomCapacity} Tons`} desc="Total chamber volume" />
        <StatCard icon={Warehouse} title="Occupied space" value={`${spaceUtilized} Tons`} desc="Chamber current load" statusColor="primary" />
        <StatCard icon={Warehouse} title="Available Space" value={`${availableSpace} Tons`} desc="Chamber unused remaining" statusColor={availableSpace > 0 ? "success" : "warning"} />
      </div>

      {/* Main visual telemetry */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Left Side: Environmental diagnostics and listings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Progress bar container */}
          <div className="card-section" style={{ margin: 0 }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Storage Space Utilization</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
              <div style={{ flex: 1, backgroundColor: 'var(--border-color)', height: '14px', borderRadius: '7px', overflow: 'hidden' }}>
                <div style={{ width: `${utilizationPct}%`, backgroundColor: 'var(--primary-color)', height: '100%' }} />
              </div>
              <strong style={{ fontSize: '1.1rem' }}>{utilizationPct}%</strong>
            </div>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              Using <strong>{spaceUtilized} Tons</strong> out of <strong>{roomCapacity} Tons</strong> chamber capacity.
            </span>
          </div>

          {/* Stored products list */}
          <div className="card-section" style={{ margin: 0 }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Stored Items Log</h3>
            {storedItems.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                No crop shipments currently checked-in to this room.
              </div>
            ) : (
              <div className="table-container">
                <table className="custom-table" style={{ fontSize: '0.8125rem' }}>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Quantity</th>
                      <th>Check-In Date</th>
                      <th>Shelf Life</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {storedItems.map(p => (
                      <tr key={p.id}>
                        <td style={{ fontWeight: 600 }}>{p.name}</td>
                        <td>{p.quantity} Tons</td>
                        <td>{p.entryDate}</td>
                        <td>{p.shelfLife} Days Left</td>
                        <td>
                          <span className={`badge badge-${p.status === 'Healthy' ? 'success' : p.status === 'At Risk' ? 'warning' : 'danger'}`}>
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Chamber properties, Location, Manager contacts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Chamber details card */}
          <div className="card-section" style={{ margin: 0, padding: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Warehouse size={18} style={{ color: 'var(--primary-color)' }} />
              <span>Chamber Specifications</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--border-light)', padding: '0.5rem', borderRadius: 'var(--radius-sm)' }}>
                  <Thermometer size={18} style={{ color: 'var(--status-danger)' }} />
                  <div>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block' }}>Temp Sensor</span>
                    <strong style={{ fontSize: '0.85rem' }}>{chamberTemp}°C</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--border-light)', padding: '0.5rem', borderRadius: 'var(--radius-sm)' }}>
                  <Droplets size={18} style={{ color: 'var(--status-info)' }} />
                  <div>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block' }}>Humidity</span>
                    <strong style={{ fontSize: '0.85rem' }}>{String(chamberHumidity).includes('%') ? chamberHumidity : `${chamberHumidity}% RH`}</strong>
                  </div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <MapPin size={16} style={{ color: 'var(--text-muted)' }} />
                  <span style={{ fontSize: '0.875rem' }}>{assignedStorage.location} ({selectedChamber?.type || 'Cold Room'})</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Mail size={16} style={{ color: 'var(--text-muted)' }} />
                  <span style={{ fontSize: '0.875rem' }}>manager@agrifreeze.com</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Phone size={16} style={{ color: 'var(--text-muted)' }} />
                  <span style={{ fontSize: '0.875rem' }}>Status: {selectedChamber?.status || 'Active'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Map placeholder */}
          <div className="map-placeholder">
            <MapPin size={24} style={{ color: 'var(--primary-color)' }} />
            <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>Coldroom Coordinates Map</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-light)' }}>GPS: Lat 36.67, Lon -121.65</span>
          </div>
        </div>
      </div>
    </div>
  );
};

