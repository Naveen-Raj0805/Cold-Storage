import React, { useState, useEffect } from 'react';
import { Search, Mail, Phone, MapPin } from 'lucide-react';
import DataTable from '../../components/DataTable/DataTable';
import Badge from '../../components/Badge/Badge';
import { getUsers, getProducts, getStorageUnits } from '../../services/mockData';

const ManagerUsers = () => {
  const [farmers, setFarmers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // 1. Get managed chambers
    const managedChambers = getStorageUnits()
      .filter(u => u.manager === 'Sarah Connor')
      .map(u => u.name);

    // 2. Get active farmers who have products in managed chambers
    const products = getProducts().filter(p => managedChambers.includes(p.storageUnit));
    const activeFarmerNames = [...new Set(products.map(p => p.farmer))];

    // 3. Find users records
    const allUsers = getUsers();
    const localFarmers = allUsers.filter(u => 
      u.role === 'Farmer' && activeFarmerNames.includes(u.name)
    );
    setFarmers(localFarmers);
  }, []);

  const columns = [
    { header: 'ID', accessor: 'id' },
    { 
      header: 'Farmer Client', 
      accessor: 'name',
      render: (val) => <span className="text-semibold">{val}</span>
    },
    { header: 'Farm Name', accessor: 'farmName' },
    { 
      header: 'Email Sync', 
      accessor: 'email',
      render: (val) => (
        <span className="d-flex align-center gap-xs">
          <Mail size={14} className="text-secondary-color" />
          {val}
        </span>
      )
    },
    { 
      header: 'Contact Phone', 
      accessor: 'phone',
      render: (val) => (
        <span className="d-flex align-center gap-xs">
          <Phone size={14} className="text-secondary-color" />
          {val}
        </span>
      )
    },
    { header: 'Register Date', accessor: 'joinDate' },
    { 
      header: 'Lease Status', 
      accessor: 'status',
      render: (val) => <Badge status="Active" />
    }
  ];

  return (
    <div className="d-flex flex-column gap-lg">
      <div>
        <h2 className="text-bold" style={{ fontSize: '22px' }}>Active Farm Clients</h2>
        <p className="text-secondary-color" style={{ fontSize: '14px' }}>
          Registered clients currently renting active capacity inside chambers: Alpha & Gamma
        </p>
      </div>

      <div className="d-flex align-center justify-between">
        <div className="navbar-search-container m-0" style={{ width: '320px', backgroundColor: 'var(--white)' }}>
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search farm clients..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="navbar-search-input"
          />
        </div>
      </div>

      <DataTable 
        columns={columns}
        data={farmers}
        searchQuery={searchQuery}
        searchKeys={['name', 'farmName', 'email']}
        itemsPerPage={10}
      />
    </div>
  );
};

export default ManagerUsers;
