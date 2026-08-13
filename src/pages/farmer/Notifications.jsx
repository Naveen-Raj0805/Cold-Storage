import React, { useState, useEffect } from 'react';
import { Bell, Check, BellRing } from 'lucide-react';
import DataTable from '../../components/DataTable/DataTable';
import Badge from '../../components/Badge/Badge';
import Button from '../../components/Button/Button';
import { getAlerts, saveAlerts, getProducts, getCurrentUser } from '../../services/mockData';

const FarmerNotifications = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    loadAlerts();
    
    const handleSync = () => {
      loadAlerts();
    };
    window.addEventListener('alertsUpdated', handleSync);
    return () => {
      window.removeEventListener('alertsUpdated', handleSync);
    };
  }, []);

  const loadAlerts = () => {
    const activeUser = getCurrentUser() || { name: 'Arthur Dent' };
    const farmerProducts = getProducts().filter(p => p.farmer === activeUser.name);
    const rentedRoomNames = [...new Set(farmerProducts.map(p => p.storageUnit))];

    const allAlerts = getAlerts();
    // Filter alerts affecting rooms where the farmer has crops stored
    setAlerts(allAlerts.filter(a => rentedRoomNames.includes(a.facility)));
  };

  const handleAck = (alertId) => {
    const allAlerts = getAlerts();
    const updated = allAlerts.map(a => 
      a.id === alertId ? { ...a, acknowledged: true } : a
    );
    saveAlerts(updated);
    loadAlerts();

    // Trigger global synchronization events
    window.dispatchEvent(new Event('alertsUpdated'));
  };

  const columns = [
    { header: 'ID', accessor: 'id' },
    { 
      header: 'Storage Room', 
      accessor: 'facility',
      render: (val) => <span className="text-semibold">{val}</span>
    },
    { header: 'Notification Category', accessor: 'type' },
    { header: 'Warning Details', accessor: 'message', width: '40%' },
    { header: 'Timestamp', accessor: 'time' },
    { 
      header: 'Severity', 
      accessor: 'severity',
      render: (val) => (
        <span className={`role-badge ${val === 'High' ? 'role-admin' : 'role-farmer'}`} style={{ fontSize: '11px', textTransform: 'capitalize' }}>
          {val}
        </span>
      )
    },
    { 
      header: 'Status', 
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
              onClick={() => handleAck(id)}
            >
              Dismiss
            </Button>
          ) : (
            <span className="text-secondary-color" style={{ fontSize: '12px' }}>Dismissed</span>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="d-flex flex-column gap-lg">
      <div>
        <h2 className="text-bold" style={{ fontSize: '22px' }}>Incident Warnings & Alerts</h2>
        <p className="text-secondary-color" style={{ fontSize: '14px' }}>
          Alarms and warnings related to temperature thresholds in your active storage locations
        </p>
      </div>

      <DataTable 
        columns={columns}
        data={alerts}
        itemsPerPage={10}
      />
    </div>
  );
};

export default FarmerNotifications;
