import React, { useState } from 'react';
import PageHeader from '../../components/PageHeader/PageHeader';
import SearchBar from '../../components/SearchBar/SearchBar';
import Table from '../../components/Table/Table';
import Badge from '../../components/Badge/Badge';
import '../ManagerProducts/ManagerProducts.css'; // Reuse search styles

const ManagerUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock tenant farmers renting from ST-001
  const farmers = [
    {
      id: 'F-001',
      name: 'Sanjay Patel',
      email: 'sanjay.patel@farmfresh.com',
      phone: '+1 (555) 089-4512',
      farmName: 'Emerald Valley Farms',
      storedItems: 3, // Apples, Potatoes, Blueberries
      totalWeight: '24,000 kg',
      status: 'Active'
    }
  ];

  const filteredFarmers = farmers.filter(
    (f) =>
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.farmName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const headers = [
    { key: 'name', label: 'Farmer Name', sortable: true },
    { key: 'farmName', label: 'Farm Organization', sortable: true },
    { key: 'email', label: 'Email Address' },
    { key: 'phone', label: 'Phone' },
    { key: 'storedItems', label: 'Registered Batches', render: (val) => `${val} Batches` },
    { key: 'totalWeight', label: 'Total Load (kg)' },
    {
      key: 'status',
      label: 'Tenant Status',
      render: (val) => <Badge status={val}>{val}</Badge>
    }
  ];

  return (
    <div className="page-container animate-fade-in">
      <PageHeader
        title="Cooperating Farmers"
        description="Directory of tenant farmers who hold active storage contracts with this facility."
      />

      <div className="products-header-row">
        <SearchBar value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search cooperating farmers..." />
      </div>

      <Table headers={headers} data={filteredFarmers} />
    </div>
  );
};

export default ManagerUsers;
