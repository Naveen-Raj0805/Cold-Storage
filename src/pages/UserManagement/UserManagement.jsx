import React, { useState } from 'react';
import { ShieldAlert, Trash2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import PageHeader from '../../components/PageHeader/PageHeader';
import SearchBar from '../../components/SearchBar/SearchBar';
import Dropdown from '../../components/Dropdown/Dropdown';
import Button from '../../components/Button/Button';
import Table from '../../components/Table/Table';
import Badge from '../../components/Badge/Badge';
import ConfirmationDialog from '../../components/ConfirmationDialog/ConfirmationDialog';
import './UserManagement.css';

const UserManagement = () => {
  const { showToast } = useToast();

  const [farmers, setFarmers] = useState([
    {
      id: 'F-001',
      name: 'Sanjay Patel',
      email: 'sanjay.patel@farmfresh.com',
      phone: '+1 (555) 089-4512',
      farmName: 'Emerald Valley Farms',
      location: 'Oregon, USA',
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop'
    },
    {
      id: 'F-002',
      name: 'Diana Cooper',
      email: 'diana.cooper@sunsoil.com',
      phone: '+1 (555) 039-8811',
      farmName: 'Sunsoil Harvests Ltd.',
      location: 'California, USA',
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop'
    },
    {
      id: 'F-003',
      name: 'Michael Green',
      email: 'm.green@pinecreek.com',
      phone: '+1 (555) 062-9988',
      farmName: 'Pine Creek Organic Produce',
      location: 'Idaho, USA',
      status: 'Inactive',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop'
    }
  ]);

  // Filtering states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortKey, setSortKey] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // Deletion state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState(null);

  const handleSort = (key) => {
    const isAsc = sortKey === key && sortOrder === 'asc';
    setSortOrder(isAsc ? 'desc' : 'asc');
    setSortKey(key);
  };

  // Toggle Block status
  const handleToggleBlock = (farmer) => {
    const nextStatus = farmer.status === 'Active' ? 'Inactive' : 'Active';
    setFarmers((prev) =>
      prev.map((f) => (f.id === farmer.id ? { ...f, status: nextStatus } : f))
    );
    showToast(
      `User ${farmer.name} has been set to ${nextStatus}.`,
      nextStatus === 'Active' ? 'success' : 'warning'
    );
  };

  // Delete Farmer profile
  const handleDeleteClick = (farmer) => {
    setSelectedFarmer(farmer);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    setFarmers((prev) => prev.filter((f) => f.id !== selectedFarmer.id));
    setIsDeleteDialogOpen(false);
    showToast('Farmer profile removed from directory.', 'success');
  };

  // Filter logic
  const filteredFarmers = farmers
    .filter((f) => {
      const matchesSearch =
        f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.farmName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter ? f.status === statusFilter : true;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let aVal = a[sortKey];
      let bVal = b[sortKey];
      if (typeof aVal === 'string') {
        return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    });

  const headers = [
    {
      key: 'name',
      label: 'Farmer Profile',
      sortable: true,
      render: (val, row) => (
        <div className="user-avatar-cell">
          <img src={row.avatar} alt={val} className="user-avatar-img" />
          <div className="user-name-info">
            <span className="user-fullname">{val}</span>
            <span className="user-farm">{row.farmName}</span>
          </div>
        </div>
      )
    },
    { key: 'email', label: 'Email Address' },
    { key: 'phone', label: 'Phone' },
    { key: 'location', label: 'Location', sortable: true },
    {
      key: 'status',
      label: 'Status',
      render: (val) => <Badge status={val}>{val}</Badge>
    }
  ];

  return (
    <div className="page-container animate-fade-in">
      <PageHeader
        title="Registered Platform Farmers"
        description="Monitor tenant farmer directory, audit storage slots, and toggle profile access permissions."
      />

      {/* Header Filters */}
      <div className="user-mgmt-header-row">
        <div className="user-mgmt-filters">
          <SearchBar value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search farmers, farms, or locations..." />
          <Dropdown
            placeholder="All Statuses"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'Active', label: 'Active' },
              { value: 'Inactive', label: 'Inactive' }
            ]}
          />
        </div>
      </div>

      {/* Farmers Table */}
      <Table
        headers={headers}
        data={filteredFarmers}
        sortKey={sortKey}
        sortOrder={sortOrder}
        onSort={handleSort}
        actions={[
          {
            type: 'edit',
            onClick: handleToggle => handleToggleBlock(handleToggle),
            icon: <ShieldAlert size={16} />,
            label: 'Toggle Block/Unblock Status'
          },
          {
            type: 'delete',
            onClick: handleDelete => handleDeleteClick(handleDelete)
          }
        ]}
      />

      {/* Confirmation Dialog delete */}
      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Tenant Profile"
        message={`Are you sure you want to remove ${selectedFarmer?.name}? They will lose access to all cold-storage booking schedules. This cannot be undone.`}
      />
    </div>
  );
};

export default UserManagement;
