import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { mockManagers, mockStorages } from '../../data/mockData';
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
import './ManagerManagement.css';

const ManagerManagement = () => {
  const { showToast } = useToast();
  const [managers, setManagers] = useState(mockManagers);

  // Table state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortKey, setSortKey] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // Modals controls
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedManager, setSelectedManager] = useState(null);

  // Form fields
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formStorage, setFormStorage] = useState('');
  const [formExperience, setFormExperience] = useState('');
  const [formStatus, setFormStatus] = useState('Active');

  const handleSort = (key) => {
    const isAsc = sortKey === key && sortOrder === 'asc';
    setSortOrder(isAsc ? 'desc' : 'asc');
    setSortKey(key);
  };

  // Add Manager
  const handleAddSubmit = (e) => {
    e.preventDefault();
    const newId = `M-00${managers.length + 1}`;
    
    // Find storage name from id
    const matchedStorage = mockStorages.find((s) => s.id === formStorage);

    const newManager = {
      id: newId,
      name: formName,
      email: formEmail,
      phone: formPhone,
      storageId: formStorage,
      storageName: matchedStorage ? matchedStorage.name : 'Unassigned',
      status: formStatus,
      experience: `${formExperience} Years`,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop'
    };

    setManagers((prev) => [...prev, newManager]);
    setIsAddModalOpen(false);
    
    // Reset form
    setFormName('');
    setFormEmail('');
    setFormPhone('');
    setFormStorage('');
    setFormExperience('');
    setFormStatus('Active');
    showToast('Manager account generated successfully.', 'success');
  };

  // Edit Manager
  const handleEditClick = (manager) => {
    setSelectedManager(manager);
    setFormName(manager.name);
    setFormEmail(manager.email);
    setFormPhone(manager.phone);
    setFormStorage(manager.storageId || '');
    setFormExperience(manager.experience ? manager.experience.split(' ')[0] : '1');
    setFormStatus(manager.status);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const matchedStorage = mockStorages.find((s) => s.id === formStorage);

    setManagers((prev) =>
      prev.map((m) =>
        m.id === selectedManager.id
          ? {
              ...m,
              name: formName,
              email: formEmail,
              phone: formPhone,
              storageId: formStorage,
              storageName: matchedStorage ? matchedStorage.name : 'Unassigned',
              status: formStatus,
              experience: `${formExperience} Years`
            }
          : m
      )
    );
    setIsEditModalOpen(false);
    showToast('Manager profile details updated.', 'success');
  };

  // Delete Manager
  const handleDeleteClick = (manager) => {
    setSelectedManager(manager);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    setManagers((prev) => prev.filter((m) => m.id !== selectedManager.id));
    setIsDeleteDialogOpen(false);
    showToast('Manager profile has been deleted.', 'success');
  };

  // Search & Filter Logic
  const filteredManagers = managers
    .filter((m) => {
      const matchesSearch =
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.storageName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter ? m.status === statusFilter : true;
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
      label: 'Manager Profile',
      sortable: true,
      render: (val, row) => (
        <div className="manager-avatar-cell">
          <img src={row.avatar} alt={val} className="manager-avatar-img" />
          <div className="manager-name-info">
            <span className="manager-fullname">{val}</span>
            <span className="manager-exp">{row.experience} Experience</span>
          </div>
        </div>
      )
    },
    { key: 'email', label: 'Email Address' },
    { key: 'phone', label: 'Phone' },
    { key: 'storageName', label: 'Assigned Cold Storage Hub', sortable: true },
    {
      key: 'status',
      label: 'Status',
      render: (val) => <Badge status={val}>{val}</Badge>
    }
  ];

  return (
    <div className="page-container animate-fade-in">
      <PageHeader
        title="Cold Storage Manager Profiles"
        description="Register system operators, edit access settings, and assign storage facilities."
        action={
          <Button variant="primary" onClick={() => setIsAddModalOpen(true)} icon={<Plus size={16} />}>
            Add Manager
          </Button>
        }
      />

      {/* Header Filters */}
      <div className="manager-mgmt-header-row">
        <div className="manager-mgmt-filters">
          <SearchBar value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search managers..." />
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

      {/* Managers Table */}
      <Table
        headers={headers}
        data={filteredManagers}
        sortKey={sortKey}
        sortOrder={sortOrder}
        onSort={handleSort}
        actions={[
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

      {/* Modal: Add Manager */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Create Manager Account"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddSubmit}>
              Create Account
            </Button>
          </>
        }
      >
        <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <Input label="Full Name" name="name" value={formName} onChange={(e) => setFormName(e.target.value)} required />
          <Input label="Email Address" name="email" type="email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} required />
          <Input label="Phone Number" name="phone" value={formPhone} onChange={(e) => setFormPhone(e.target.value)} required />
          <Input label="Years of Experience" name="experience" type="number" value={formExperience} onChange={(e) => setFormExperience(e.target.value)} required />
          <Dropdown
            label="Assign Cold Storage Facility"
            name="storage"
            value={formStorage}
            onChange={(e) => setFormStorage(e.target.value)}
            options={mockStorages.map((s) => ({ value: s.id, label: s.name }))}
            placeholder="Select facility..."
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

      {/* Modal: Edit Manager */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Manager Account Details"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleEditSubmit}>
              Save Details
            </Button>
          </>
        }
      >
        <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <Input label="Full Name" name="name" value={formName} onChange={(e) => setFormName(e.target.value)} required />
          <Input label="Email Address" name="email" type="email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} required />
          <Input label="Phone Number" name="phone" value={formPhone} onChange={(e) => setFormPhone(e.target.value)} required />
          <Input label="Years of Experience" name="experience" type="number" value={formExperience} onChange={(e) => setFormExperience(e.target.value)} required />
          <Dropdown
            label="Assign Cold Storage Facility"
            name="storage"
            value={formStorage}
            onChange={(e) => setFormStorage(e.target.value)}
            options={mockStorages.map((s) => ({ value: s.id, label: s.name }))}
            placeholder="Select facility..."
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

      {/* Dialog: Confirmation delete */}
      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Manager Account"
        message={`Are you sure you want to delete the account for ${selectedManager?.name}? They will lose dashboard privileges immediately and their assigned cold storage hub will be listed as unassigned.`}
      />
    </div>
  );
};

export default ManagerManagement;
