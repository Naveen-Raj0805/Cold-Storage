import React, { useState, useEffect } from 'react';
import { Bell, Check, CheckCircle2, ShieldAlert } from 'lucide-react';
import DataTable from '../../components/DataTable/DataTable';
import Badge from '../../components/Badge/Badge';
import Button from '../../components/Button/Button';
import { getAlerts, saveAlerts, getStorageUnits } from '../../services/mockData';

const ManagerAlerts = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    loadAlerts();
    
    const handleStorageChange = () => {
      loadAlerts();
    };
    window.addEventListener('alertsUpdated', handleStorageChange);
    return () => {
      window.removeEventListener('alertsUpdated', handleStorageChange);
    };
  }, []);

  const loadAlerts = () => {
    // Managed chambers managed by Sarah Connor (Alpha & Gamma)
    const managedChambers = getStorageUnits()
      .filter(u => u.manager === 'Sarah Connor')
      .map(u => u.name);

    const allAlerts = getAlerts();
    setAlerts(allAlerts.filter(a => managedChambers.includes(a.facility)));
  };

  const handleAcknowledgeAlert = (alertId) => {
    const allAlerts = getAlerts();
    const updated = allAlerts.map(a => 
      a.id === alertId ? { ...a, acknowledged: true } : a
    );
    saveAlerts(updated);
    loadAlerts();
    
    // Dispatch sync events
    window.dispatchEvent(new Event('alertsUpdated'));
  };

  const handleAcknowledgeAll = () => {
    const managedChambers = getStorageUnits()
      .filter(u => u.manager === 'Sarah Connor')
      .map(u => u.name);

    const allAlerts = getAlerts();
    const updated = allAlerts.map(a => 
      managedChambers.includes(a.facility) ? { ...a, acknowledged: true } : a
    );
    saveAlerts(updated);
    loadAlerts();

    window.dispatchEvent(new Event('alertsUpdated'));
    alert('All local facility warnings acknowledged.');
  };

  const pendingAlerts = alerts.filter(a => !a.acknowledged);

  const columns = [
    { header: 'ID', accessor: 'id' },
    { 
      header: 'Facility Zone', 
      accessor: 'facility',
      render: (val) => <span className="text-semibold">{val}</span>
    },
    { header: 'Trigger Type', accessor: 'type' },
    { 
      header: 'Incident Alert Message', 
      accessor: 'message',
      width: '35%'
    },
    { header: 'Incident Time', accessor: 'time' },
    { 
      header: 'Severity', 
      accessor: 'severity',
      render: (val) => (
        <span className={`role-badge ${val === 'High' ? 'role-admin' : val === 'Medium' ? 'role-storage-manager' : 'role-farmer'}`} style={{ fontSize: '11px', textTransform: 'capitalize' }}>
          {val}
        </span>
      )
    },
    { 
      header: 'Sync Status', 
      accessor: 'acknowledged',
      render: (val) => val ? <Badge status="Active" /> : <Badge status="Pending" />
    },
    {
      header: 'Actions',
      accessor: 'id',
      align: 'right',
      render: (id, row) => (
        <div className="d-flex gap-xs justify-center">
          {!row.acknowledged ? (
            <Button 
              variant="secondary" 
              size="small" 
              icon={Check}
              onClick={() => handleAcknowledgeAlert(id)}
            >
              Acknowledge
            </Button>
          ) : (
            <span className="text-secondary-color" style={{ fontSize: '12px' }}>Acknowledged</span>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="d-flex flex-column gap-lg">
      <div className="d-flex align-center justify-between flex-wrap gap-md">
        <div>
          <h2 className="text-bold" style={{ fontSize: '22px' }}>Safety Alerts & Incident Logs</h2>
          <p className="text-secondary-color" style={{ fontSize: '14px' }}>
            Review temperature threshold warnings, humidity alarms, and mechanical malfunctions
          </p>
        </div>
        {pendingAlerts.length > 0 && (
          <Button variant="danger" icon={CheckCircle2} onClick={handleAcknowledgeAll}>
            Acknowledge All ({pendingAlerts.length})
          </Button>
        )}
      </div>

      <DataTable 
        columns={columns}
        data={alerts}
        itemsPerPage={10}
      />
    </div>
  );
};

export default ManagerAlerts;
