import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { ShieldAlert, CheckCircle, ArrowDownToLine, Bell } from 'lucide-react';
import { StatCard, DataTable } from '../../components/UI';

export const AlertManagement = () => {
  const { alerts, resolveAlert, triggerToast } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('All');
  const [downloading, setDownloading] = useState(false);

  // Calculate statistics
  const totalAlerts = alerts.length;
  const activeCount = alerts.filter(a => a.status === 'Active').length;
  const resolvedCount = alerts.filter(a => a.status === 'Resolved').length;
  const criticalCount = alerts.filter(a => a.severity === 'Critical' && a.status === 'Active').length;

  const handleResolve = (id) => {
    resolveAlert(id);
  };

  const handleExport = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      triggerToast(
        'Report Exported',
        'agrifreeze_incident_report.pdf downloaded successfully.',
        'success'
      );
    }, 1200);
  };

  // Table Columns
  const columns = [
    { header: 'Alert ID', accessor: 'id', sortable: true },
    { header: 'Alert Type', accessor: 'type', sortable: true },
    { header: 'Storage Coldroom', accessor: 'storage', sortable: true },
    { header: 'Triggered Time', accessor: 'time', sortable: true },
    { 
      header: 'Severity', 
      accessor: 'severity', 
      cell: (row) => (
        <span className={`badge badge-${row.severity === 'Critical' ? 'danger' : 'warning'}`} style={{ fontWeight: 600 }}>
          {row.severity}
        </span>
      ),
      sortable: true
    },
    { 
      header: 'Status', 
      accessor: 'status', 
      cell: (row) => (
        <span className={`badge badge-${row.status === 'Active' ? 'danger' : 'success'}`}>
          {row.status}
        </span>
      ),
      sortable: true
    }
  ];

  return (
    <div>
      {/* Title */}
      <div className="page-header">
        <div className="page-title-row">
          <div>
            <h1 style={{ margin: 0, fontSize: '1.875rem' }}>Alert Management</h1>
            <p className="page-subtitle">Acknowledge, audit, and troubleshoot thermal safety warnings.</p>
          </div>
          <button className="btn btn-secondary" onClick={handleExport} disabled={downloading}>
            <ArrowDownToLine size={16} />
            <span>{downloading ? 'Compiling PDF...' : 'Export Alert Report'}</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <StatCard icon={Bell} title="Total Alerts" value={totalAlerts} desc="Cumulative log count" />
        <StatCard icon={ShieldAlert} title="Active Alerts" value={activeCount} desc="Requiring immediate action" statusColor={activeCount > 0 ? "danger" : "success"} />
        <StatCard icon={CheckCircle} title="Resolved Warnings" value={resolvedCount} desc="Cleared operations" statusColor="success" />
        <StatCard icon={ShieldAlert} title="Active Critical" value={criticalCount} desc="Red threshold triggers" statusColor={criticalCount > 0 ? "danger" : "success"} />
      </div>

      {/* Main Alerts Logs Table */}
      <div className="card-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.125rem' }}>Incidents Log Book</h3>

          {/* Filter Tabs */}
          <div style={{ display: 'flex', gap: '0.25rem', backgroundColor: 'var(--border-light)', padding: '0.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            {['All', 'Active', 'Resolved'].map((tab) => (
              <button
                key={tab}
                className="btn"
                style={{
                  padding: '0.35rem 0.85rem',
                  fontSize: '0.8125rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: activeTab === tab ? 'var(--bg-card)' : 'transparent',
                  color: activeTab === tab ? 'var(--primary-color)' : 'var(--text-muted)',
                  border: 'none',
                  boxShadow: activeTab === tab ? 'var(--shadow-sm)' : 'none',
                  cursor: 'pointer'
                }}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <DataTable
          columns={columns}
          data={alerts}
          searchPlaceholder="Search alert type, room..."
          searchField="type"
          filterKey="status"
          filterValue={activeTab}
          onEdit={(row) => row.status === 'Active' ? handleResolve(row.id) : null} // Map Edit action to Resolve for Active alerts
          // Customize row action to only render "Resolve" button for active items
        />
      </div>
    </div>
  );
};
