import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { 
  Thermometer, Droplets, ShieldAlert, Activity, 
  ArrowDownToLine, Lock } from 'lucide-react';
import { StatCard } from '../../components/UI';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip } from 'recharts';

export const StorageMonitoring = () => {
  const { storages, currentUser, triggerToast } = useContext(AppContext);
  const [downloading, setDownloading] = useState(false);

  // Default manager facility fallback
  const currentFacility = (Array.isArray(storages) && storages.length > 0)
    ? (storages.find(s => 
        (currentUser?.assignedStorage && s?.name === currentUser.assignedStorage) ||
        (currentUser?.fullName && s?.manager && s.manager.toLowerCase() === currentUser.fullName.toLowerCase())
      ) || storages[0])
    : {
        id: 'STR-001',
        name: 'Cold Storage Facility',
        temp: 4.0,
        humidity: 85,
        door: 'Closed',
        power: 'Grid'
      };

  const facilityTemp = currentFacility?.temp ?? 4.0;
  const facilityHumidity = currentFacility?.humidity ?? 85;
  const facilityDoor = currentFacility?.door ?? 'Closed';
  const facilityPower = currentFacility?.power ?? 'Grid';

  // Sensor reading simulations (past hour)
  const sensorLogs = [
    { time: '01:00', temp: 2.1, humidity: 84, door: 'Closed', power: 'Grid' },
    { time: '01:10', temp: 2.3, humidity: 85, door: 'Closed', power: 'Grid' },
    { time: '01:20', temp: 2.4, humidity: 85, door: 'Closed', power: 'Grid' },
    { time: '01:30', temp: 2.5, humidity: 86, door: 'Closed', power: 'Grid' },
    { time: '01:40', temp: 2.3, humidity: 85, door: 'Closed', power: 'Grid' },
    { time: '01:50', temp: facilityTemp, humidity: facilityHumidity, door: facilityDoor, power: facilityPower }
  ];

  const handleDownloadCSV = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      triggerToast(
        'CSV Exported',
        `agrifreeze_sensor_logs_${currentFacility.id}.csv downloaded successfully.`,
        'success'
      );
    }, 1200);
  };

  return (
    <div>
      {/* Title */}
      <div className="page-header">
        <div className="page-title-row">
          <div>
            <h1 style={{ margin: 0, fontSize: '1.875rem' }}>Storage Monitoring</h1>
            <p className="page-subtitle">Real-time telemetric logging for <strong>{currentFacility?.name || 'Cold Storage Hub'}</strong>.</p>
          </div>
          <button 
            className="btn btn-secondary" 
            onClick={handleDownloadCSV}
            disabled={downloading}
          >
            <ArrowDownToLine size={16} />
            <span>{downloading ? 'Compiling CSV...' : 'Download CSV Logs'}</span>
          </button>
        </div>
      </div>

      {/* Sensor values cards */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <StatCard 
          icon={Thermometer} 
          title="Coldroom Temp" 
          value={`${facilityTemp}°C`} 
          desc="Operational limit: 4°C" 
          statusColor={facilityTemp > 4.5 ? 'danger' : 'success'} 
        />
        <StatCard 
          icon={Droplets} 
          title="Coldroom Humidity" 
          value={`${facilityHumidity}% RH`} 
          desc="Optimal target: 85%" 
          statusColor="success" 
        />
        <StatCard 
          icon={Lock} 
          title="Door Status" 
          value={facilityDoor} 
          desc="Gasket seal intact" 
          statusColor="success" 
        />
        <StatCard 
          icon={Activity} 
          title="Power Source" 
          value={facilityPower} 
          desc="Circuit feed state" 
          statusColor={facilityPower === 'Grid' ? 'success' : 'warning'} 
        />
      </div>

      {/* Telemetry charts */}
      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-card-header">
            <h3 className="chart-card-title">Temperature Log Chart</h3>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sensorLogs}>
                <defs>
                  <linearGradient id="tempColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--status-danger)" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="var(--status-danger)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="time" stroke="var(--text-muted)" fontSize={11} />
                <YAxis stroke="var(--text-muted)" fontSize={11} unit="°C" />
                <Tooltip />
                <Area type="monotone" dataKey="temp" stroke="var(--status-danger)" fillOpacity={1} fill="url(#tempColor)" strokeWidth={2} name="Temp (°C)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-card-header">
            <h3 className="chart-card-title">Humidity Log Chart</h3>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sensorLogs}>
                <defs>
                  <linearGradient id="humColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--status-info)" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="var(--status-info)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="time" stroke="var(--text-muted)" fontSize={11} />
                <YAxis stroke="var(--text-muted)" fontSize={11} unit="%" />
                <Tooltip />
                <Area type="monotone" dataKey="humidity" stroke="var(--status-info)" fillOpacity={1} fill="url(#humColor)" strokeWidth={2} name="Humidity (RH)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Sensor Logs Table */}
      <div className="card-section">
        <h3 style={{ fontSize: '1.125rem', marginBottom: '1.25rem' }}>Raw Telemetric Log History (Past hour)</h3>
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Time (Logs)</th>
                <th>Temperature (°C)</th>
                <th>Humidity (% RH)</th>
                <th>Door Sensor Latch</th>
                <th>Power Relay</th>
              </tr>
            </thead>
            <tbody>
              {sensorLogs.map((log, index) => (
                <tr key={index}>
                  <td style={{ fontWeight: 600 }}>{log.time}</td>
                  <td style={{ color: log.temp > 4.0 ? 'var(--status-danger)' : 'var(--text-main)', fontWeight: 600 }}>
                    {log.temp}°C
                  </td>
                  <td>{log.humidity}% RH</td>
                  <td>
                    <span className={`badge badge-${log.door === 'Closed' ? 'success' : 'danger'}`}>
                      {log.door}
                    </span>
                  </td>
                  <td>
                    <span className={`badge badge-${log.power === 'Grid' ? 'success' : 'warning'}`}>
                      {log.power}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom health diagnostics */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <div className="stat-card" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Facility Health</span>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--status-success)', marginTop: '0.25rem' }}>96.8% Stable</div>
        </div>
        <div className="stat-card" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Sensor Uptime</span>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-color)', marginTop: '0.25rem' }}>100% Online</div>
        </div>
        <div className="stat-card" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Today's Alerts</span>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--status-warning)', marginTop: '0.25rem' }}>1 Warning</div>
        </div>
        <div className="stat-card" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Power Backup</span>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--status-success)', marginTop: '0.25rem' }}>100% Standby</div>
        </div>
      </div>
    </div>
  );
};
