import React, { useState } from 'react';
import { Plus, Trash2, Edit, Eye, HelpCircle } from 'lucide-react';
import { mockStorages, mockManagers } from '../../data/mockData';
import { useToast } from '../../context/ToastContext';
import PageHeader from '../../components/PageHeader/PageHeader';
import SearchBar from '../../components/SearchBar/SearchBar';
import Dropdown from '../../components/Dropdown/Dropdown';
import Button from '../../components/Button/Button';
import Table from '../../components/Table/Table';
import Badge from '../../components/Badge/Badge';
import Modal from '../../components/Modal/Modal';
import Input from '../../components/Input/Input';
import ConfirmationDialog from '../../components/ConfirmationDialog/ConfirmationDialog';
import './StorageManagement.css';

const StorageManagement = () => {
  const { showToast } = useToast();
  const [storages, setStorages] = useState(mockStorages);
  
  // Table state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortKey, setSortKey] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // Modal control states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isChambersModalOpen, setIsChambersModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedStorage, setSelectedStorage] = useState(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formCapacity, setFormCapacity] = useState('');
  const [formChamberCount, setFormChamberCount] = useState('4');
  const [formTemp, setFormTemp] = useState('');
  const [formManager, setFormManager] = useState('');
  const [formStatus, setFormStatus] = useState('Active');

  const handleSort = (key) => {
    const isAsc = sortKey === key && sortOrder === 'asc';
    setSortOrder(isAsc ? 'desc' : 'asc');
    setSortKey(key);
  };

  // View Chambers Action
  const handleViewChambers = (storage) => {
    setSelectedStorage(storage);
    setIsChambersModalOpen(true);
  };

  // Edit Action
  const handleEditClick = (storage) => {
    setSelectedStorage(storage);
    setFormName(storage.name);
    setFormLocation(storage.location);
    setFormCapacity(storage.totalCapacity.toString());
    setFormTemp(storage.targetTemp.toString());
    setFormManager(storage.managerId || '');
    setFormStatus(storage.status);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setStorages((prev) =>
      prev.map((s) =>
        s.id === selectedStorage.id
          ? {
              ...s,
              name: formName,
              location: formLocation,
              totalCapacity: parseInt(formCapacity, 10),
              targetTemp: parseFloat(formTemp),
              managerId: formManager,
              status: formStatus
            }
          : s
      )
    );
    setIsEditModalOpen(false);
    showToast('Storage facility updated successfully.', 'success');
  };

  // Delete Action
  const handleDeleteClick = (storage) => {
    setSelectedStorage(storage);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    setStorages((prev) => prev.filter((s) => s.id !== selectedStorage.id));
    setIsDeleteDialogOpen(false);
    showToast('Storage facility has been removed.', 'success');
  };

  // Add Action
  const handleAddSubmit = (e) => {
    e.preventDefault();
    const newId = `ST-00${storages.length + 1}`;
    const newStorage = {
      id: newId,
      name: formName,
      location: formLocation,
      totalCapacity: parseInt(formCapacity, 10),
      occupiedCapacity: 0,
      currentTemp: parseFloat(formTemp),
      targetTemp: parseFloat(formTemp),
      status: formStatus,
      managerId: formManager,
      chamberCount: parseInt(formChamberCount, 10) || 4,
      energyUsage: '0 kWh / day'
    };
    setStorages((prev) => [...prev, newStorage]);
    setIsAddModalOpen(false);
    // Reset form
    setFormName('');
    setFormLocation('');
    setFormCapacity('');
    setFormChamberCount('4');
    setFormTemp('');
    setFormManager('');
    setFormStatus('Active');
    showToast('New storage facility created successfully.', 'success');
  };

  // Filter & Search Logic
  const filteredStorages = storages
    .filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter ? s.status === statusFilter : true;
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
    { key: 'id', label: 'Facility ID', sortable: true },
    { key: 'name', label: 'Facility Name', sortable: true },
    { key: 'location', label: 'Location', sortable: true },
    { key: 'totalCapacity', label: 'Capacity (kg)', sortable: true, render: (val) => val.toLocaleString() },
    { key: 'targetTemp', label: 'Target Temp', render: (val) => `${val.toFixed(1)} °C` },
    {
      key: 'status',
      label: 'Status',
      render: (val) => <Badge status={val}>{val}</Badge>
    }
  ];

  return (
    <div className="page-container animate-fade-in">
      <PageHeader
        title="Storage Infrastructure Management"
        description="Configure cold storage hubs, manage chilling capacities, and view internal chambers."
        action={
          <Button variant="primary" onClick={() => setIsAddModalOpen(true)} icon={<Plus size={16} />}>
            Add Facility
          </Button>
        }
      />

      {/* Search & Filters */}
      <div className="storage-mgmt-header-row">
        <div className="storage-mgmt-filters">
          <SearchBar value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search facilities..." />
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

      {/* Facilities Table */}
      <Table
        headers={headers}
        data={filteredStorages}
        sortKey={sortKey}
        sortOrder={sortOrder}
        onSort={handleSort}
        actions={[
          {
            type: 'view',
            onClick: handleViewChamber => handleViewChambers(handleViewChamber),
            label: 'View Chambers'
          },
          {
            type: 'edit',
            onClick: handleEdit => handleEditClick(handleEdit)
          },
          {
            type: 'delete',
            onClick: handleDelete => handleDeleteClick(handleDelete)
          }
        ]}
      />

      {/* Modal: Add Storage */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Register Cold Storage Hub"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddSubmit}>
              Create Hub
            </Button>
          </>
        }
      >
        <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <Input label="Facility Name" name="name" value={formName} onChange={(e) => setFormName(e.target.value)} required />
          <Input label="Location (City, State)" name="location" value={formLocation} onChange={(e) => setFormLocation(e.target.value)} required />
          <Input label="Capacity Limit (Tons)" name="capacity" type="number" value={formCapacity} onChange={(e) => setFormCapacity(e.target.value)} required />
          <Input label="Number of Chambers (Equal Division)" name="chamberCount" type="number" min="1" max="20" value={formChamberCount} onChange={(e) => setFormChamberCount(e.target.value)} required />
          {formCapacity && formChamberCount && (
            <div style={{ fontSize: '0.8125rem', color: 'var(--primary-color)', fontWeight: 600, padding: '0.4rem 0.6rem', backgroundColor: 'rgba(59, 130, 246, 0.08)', borderRadius: '6px' }}>
              ℹ Capacity Split: ~{Math.floor(Number(formCapacity) / Number(formChamberCount || 1))} Tons per Chamber ({formCapacity} Tons ÷ {formChamberCount} Chambers).
            </div>
          )}
          <Input label="Target Temperature (°C)" name="temp" type="number" step="0.1" value={formTemp} onChange={(e) => setFormTemp(e.target.value)} required />
          <Dropdown
            label="Assigned Manager"
            name="manager"
            value={formManager}
            onChange={(e) => setFormManager(e.target.value)}
            options={mockManagers.map((m) => ({ value: m.id, label: m.name }))}
            placeholder="Select manager..."
          />
          <Dropdown
            label="Operational Status"
            name="status"
            value={formStatus}
            onChange={(e) => setFormStatus(e.target.value)}
            options={[
              { value: 'Active', label: 'Active' },
              { value: 'Inactive', label: 'Inactive' }
            ]}
            placeholder=""
          />
        </form>
      </Modal>

      {/* Modal: Edit Storage */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Cold Storage Hub"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleEditSubmit}>
              Save Changes
            </Button>
          </>
        }
      >
        <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <Input label="Facility Name" name="name" value={formName} onChange={(e) => setFormName(e.target.value)} required />
          <Input label="Location (City, State)" name="location" value={formLocation} onChange={(e) => setFormLocation(e.target.value)} required />
          <Input label="Capacity Limit (kg)" name="capacity" type="number" value={formCapacity} onChange={(e) => setFormCapacity(e.target.value)} required />
          <Input label="Target Temperature (°C)" name="temp" type="number" step="0.1" value={formTemp} onChange={(e) => setFormTemp(e.target.value)} required />
          <Dropdown
            label="Assigned Manager"
            name="manager"
            value={formManager}
            onChange={(e) => setFormManager(e.target.value)}
            options={mockManagers.map((m) => ({ value: m.id, label: m.name }))}
            placeholder="Select manager..."
          />
          <Dropdown
            label="Operational Status"
            name="status"
            value={formStatus}
            onChange={(e) => setFormStatus(e.target.value)}
            options={[
              { value: 'Active', label: 'Active' },
              { value: 'Inactive', label: 'Inactive' }
            ]}
            placeholder=""
          />
        </form>
      </Modal>

      {/* Modal: View Chambers */}
      <Modal isOpen={isChambersModalOpen} onClose={() => setIsChambersModalOpen(false)} title={`${selectedStorage?.name || 'Hub'} - Internal Cooling Chambers`} maxWidth="750px">
        <div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Facility location: <strong>{selectedStorage?.location}</strong> | Live Load: <strong>{selectedStorage?.occupiedCapacity.toLocaleString()} kg / {selectedStorage?.totalCapacity.toLocaleString()} kg</strong>
          </p>
          {selectedStorage?.chambers?.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              No chambers registered for this facility.
            </div>
          ) : (
            <div className="chambers-grid">
              {selectedStorage?.chambers?.map((ch) => (
                <div className="chamber-card" key={ch.id}>
                  <div className="chamber-header">
                    <span className="chamber-name">{ch.name}</span>
                    <Badge status={ch.status}>{ch.status}</Badge>
                  </div>
                  <div className="chamber-details-grid">
                    <div className="chamber-detail-item">
                      <span>Type</span>
                      <span className="chamber-detail-val">{ch.type}</span>
                    </div>
                    <div className="chamber-detail-item">
                      <span>Temperature</span>
                      <span className="chamber-detail-val">{ch.temp.toFixed(1)} °C</span>
                    </div>
                    <div className="chamber-detail-item">
                      <span>Humidity</span>
                      <span className="chamber-detail-val">{ch.humidity}</span>
                    </div>
                    <div className="chamber-detail-item">
                      <span>Load capacity</span>
                      <span className="chamber-detail-val">{ch.occupied.toLocaleString()} / {ch.capacity.toLocaleString()} kg</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>

      {/* Dialog: Confirmation delete */}
      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Remove Cold Storage Hub"
        message={`Are you sure you want to delete ${selectedStorage?.name}? This will sever connection to all ${selectedStorage?.chambers?.length || 0} chilling chambers inside this facility. This action is irreversible.`}
      />
    </div>
  );
};

export default StorageManagement;
