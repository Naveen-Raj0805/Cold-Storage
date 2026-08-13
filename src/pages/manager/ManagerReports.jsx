import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { 
  FileText, ArrowDownToLine, Calendar, 
  Thermometer, Droplets, ShieldAlert, CheckCircle2 
} from 'lucide-react';
import { StatCard } from '../../components/UI';
import { 
  ResponsiveContainer, LineChart, Line, BarChart, Bar, 
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from 'recharts';
import { exportProductReport, exportStorageReport, exportFarmerReport } from '../../services/exportService';

export const ManagerReports = () => {
  const { alerts, storages, products, users, triggerToast } = useContext(AppContext);
  const [reportType, setReportType] = useState('Product'); // Product, Storage, Farmer
  const [downloading, setDownloading] = useState({ type: '', active: false });

  // Mock aggregates
  const avgTemp = 2.1;
  const avgHumidity = 84;
  const totalAlerts = alerts.length;
  const resolvedAlerts = alerts.filter(a => a.status === 'Resolved').length;

  // Chart Data: Weekly Temperature Averages
  const weeklyTempData = [
    { day: 'Mon', Alpha: 2.1, Beta: -18.0, Gamma: 3.8 },
    { day: 'Tue', Alpha: 2.3, Beta: -18.2, Gamma: 4.0 },
    { day: 'Wed', Alpha: 2.4, Beta: -18.5, Gamma: 4.2 },
    { day: 'Thu', Alpha: 2.2, Beta: -18.1, Gamma: 4.1 },
    { day: 'Fri', Alpha: 2.5, Beta: -18.0, Gamma: 4.0 },
    { day: 'Sat', Alpha: 2.3, Beta: -18.2, Gamma: 4.1 },
    { day: 'Sun', Alpha: 2.4, Beta: -18.2, Gamma: 4.1 }
  ];

  // Chart Data: Category Distribution (Pie)
  const categoryData = [
    { name: 'Strawberries', value: 45 },
    { name: 'Apples', value: 120 },
    { name: 'Broccoli', value: 15 },
    { name: 'Raspberries', value: 35 },
    { name: 'Cherries', value: 80 },
    { name: 'Oranges', value: 100 }
  ];
  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6', '#0ea5e9'];

  // Chart Data: Alerts Analysis History (by facility)
  const alertAnalysisData = storages.map(s => {
    const facilityAlerts = alerts.filter(a => a.storage === s.name);
    return {
      name: s.name.replace('AgriFreeze Coldroom ', ''),
      Critical: facilityAlerts.filter(a => a.severity === 'Critical').length,
      Warning: facilityAlerts.filter(a => a.severity === 'Warning').length
    };
  });

  const triggerExport = (targetType, format) => {
    setDownloading({ type: format, active: true });
    
    if (targetType === 'Product') {
      exportProductReport(products, format);
    } else if (targetType === 'Storage') {
      exportStorageReport(storages, format);
    } else if (targetType === 'Farmer') {
      exportFarmerReport(users, products, format);
    }

    triggerToast(
      'Report Exported',
      `AgriFreeze ${targetType} Report exported as ${format.toUpperCase()}.`,
      'success'
    );
    setDownloading({ type: '', active: false });
  };

  return (
    <div>
      {/* Title */}
      <div className="page-header">
        <div className="page-title-row">
          <div>
            <h1 style={{ margin: 0, fontSize: '1.875rem' }}>Storage & Operational Reports</h1>
            <p className="page-subtitle">Configure operational audits, historical telemetries, and export system reports.</p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <select
              className="form-control"
              style={{ width: 'auto', padding: '0.45rem 0.75rem', fontSize: '0.875rem' }}
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <option value="Product">Product Inventory Report</option>
              <option value="Storage">Storage Facilities Report</option>
              <option value="Farmer">Farmer Directory Report</option>
            </select>

            <button className="btn btn-secondary" onClick={() => triggerExport(reportType, 'csv')} disabled={downloading.active}>
              <ArrowDownToLine size={16} />
              <span>Export CSV</span>
            </button>
            <button className="btn btn-primary" onClick={() => triggerExport(reportType, 'pdf')} disabled={downloading.active}>
              <FileText size={16} />
              <span>Printable PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <StatCard icon={Thermometer} title="Average Temperature" value={`${avgTemp}°C`} desc="Weekly sensor median" />
        <StatCard icon={Droplets} title="Average Humidity" value={`${avgHumidity}% RH`} desc="Within target threshold" statusColor="success" />
        <StatCard icon={ShieldAlert} title="Alerts Recorded" value={totalAlerts} desc="Environmental logs triggers" />
        <StatCard icon={CheckCircle2} title="Resolved Warnings" value={`${resolvedAlerts}/${totalAlerts}`} desc="Compliance logs closed" statusColor="success" />
      </div>

      {/* Charts grid */}
      <div className="charts-grid">
        {/* Temperature Curves */}
        <div className="chart-card" style={{ gridColumn: 'span 2' }}>
          <div className="chart-card-header">
            <h3 className="chart-card-title">Weekly Temperature Telemetries Trend (°C)</h3>
          </div>
          <div className="chart-container" style={{ height: '360px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyTempData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={11} />
                <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="Alpha" stroke="var(--primary-color)" strokeWidth={2} name="Alpha Coldroom" />
                <Line type="monotone" dataKey="Beta" stroke="#3b82f6" strokeWidth={2} name="Beta Freezer" />
                <Line type="monotone" dataKey="Gamma" stroke="#f59e0b" strokeWidth={2} name="Gamma Coldroom" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Commodity breakdowns */}
        <div className="chart-card">
          <div className="chart-card-header">
            <h3 className="chart-card-title">Stock Cargo Allocation (Tons)</h3>
          </div>
          <div className="chart-container" style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ flex: 1, height: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
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
            <div style={{ width: '130px', display: 'flex', flexDirection: 'column', gap: '0.45rem', overflowY: 'auto', maxHeight: '200px' }}>
              {categoryData.map((item, idx) => (
                <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: COLORS[idx], flexShrink: 0 }} />
                  <span style={{ fontSize: '0.725rem', fontWeight: 600 }}>{item.name} ({item.value} T)</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Alert Analysis histograms */}
        <div className="chart-card">
          <div className="chart-card-header">
            <h3 className="chart-card-title">Incidents History Breakdown</h3>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={alertAnalysisData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="Critical" fill="var(--status-danger)" radius={[4, 4, 0, 0]} name="Critical Triggers" />
                <Bar dataKey="Warning" fill="var(--status-warning)" radius={[4, 4, 0, 0]} name="Warnings" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
