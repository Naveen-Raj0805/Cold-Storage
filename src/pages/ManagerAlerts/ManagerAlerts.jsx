import React, { useState } from 'react';
import { AlertTriangle, Archive, Check } from 'lucide-react';
import { mockAlerts } from '../../data/mockData';
import { useToast } from '../../context/ToastContext';
import PageHeader from '../../components/PageHeader/PageHeader';
import SearchBar from '../../components/SearchBar/SearchBar';
import Dropdown from '../../components/Dropdown/Dropdown';
import Button from '../../components/Button/Button';
import Table from '../../components/Table/Table';
import Badge from '../../components/Badge/Badge';
import '../ManagerProducts/ManagerProducts.css'; // reuse styles

const ManagerAlerts = () => {
  const { showToast } = useToast();
  
  // Filter alerts relating to ST-001 (North Hub)
  const initialAlerts = mockAlerts.filter((a) => a.source.includes('North Hub') || a.source.includes('Power Grid'));
  const [alerts, setAlerts] = useState(initialAlerts);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');

  const handleResolveAlert = (alert) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alert.id ? { ...a, status: 'Resolved' } : a))
    );
    showToast(`Alert '${alert.id}' has been resolved. Sensor status normal.`, 'success');
  };

  const filteredAlerts = alerts.filter((a) => {
    const matchesSearch = a.source.toLowerCase().includes(searchTerm.toLowerCase()) || a.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter ? a.severity === severityFilter : true;
    return matchesSearch && matchesSeverity;
  });

  const headers = [
    { key: 'id', label: 'Alert ID' },
    { key: 'source', label: 'Sensor Source', sortable: true },
    { key: 'message', label: 'Warning Details' },
    { key: 'time', label: 'Trigger Time' },
    {
      key: 'severity',
      label: 'Severity',
      render: (val) => <Badge status={val}>{val}</Badge>
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => <Badge status={val}>{val}</Badge>
    }
  ];

  return (
    <div className="page-container animate-fade-in">
      <PageHeader
        title="Thermal Anomalies Log"
        description="A live audit log of temperature sensor warnings, power stability checks, and system defrost logs."
      />

      <div className="products-header-row">
        <div className="products-filters">
          <SearchBar value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search warnings logs..." />
          <Dropdown
            placeholder="All Severities"
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            options={[
              { value: 'Critical', label: 'Critical' },
              { value: 'Warning', label: 'Warning' }
            ]}
          />
        </div>
      </div>

      <Table
        headers={headers}
        data={filteredAlerts}
        actions={[
          {
            type: 'edit',
            onClick: handleResolve => handleResolveAlert(handleResolve),
            icon: <Check size={16} />,
            label: 'Resolve Sensor Warning'
          }
        ]}
      />
    </div>
  );
};

export default ManagerAlerts;
