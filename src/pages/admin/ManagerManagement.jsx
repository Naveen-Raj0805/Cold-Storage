import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { Users, Plus, ShieldCheck, Mail, Phone, Award } from 'lucide-react';
import { StatCard, DataTable, Modal, FormInput, FormSelect } from '../../components/UI';

export const ManagerManagement = () => {
  const { 
    managers, addManager, editManager, deleteManager, 
    storages, triggerToast 
  } = useContext(AppContext);

  // Filter state
  const [statusFilter, setStatusFilter] = useState('All');

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedManager, setSelectedManager] = useState(null);

  // Forms state
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', password: '', assignedStorage: 'None', experience: '', status: 'Active'
  });

  // Calculate statistics
  const totalManagers = managers.length;
  const activeManagers = managers.filter(m => m.status === 'Active').length;
  const inactiveManagers = managers.filter(m => m.status === 'Inactive').length;
  const managedStorages = managers.filter(m => m.assignedStorage !== 'None' && m.assignedStorage !== 'Unassigned').length;

  // Handlers
  const handleOpenAdd = () => {
    setFormData({ name: '', email: '', phone: '', password: '', assignedStorage: 'None', experience: '', status: 'Active' });
    setIsAddOpen(true);
  };

  const handleOpenEdit = (manager) => {
    setSelectedManager(manager);
    setFormData({
      name: manager.name,
      email: manager.email,
      phone: manager.phone,
      assignedStorage: manager.assignedStorage,
      experience: manager.experience,
      status: manager.status
    });
    setIsEditOpen(true);
  };

  const handleOpenView = (manager) => {
    setSelectedManager(manager);
    setIsViewOpen(true);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      triggerToast('Validation Error', 'Required fields are missing', 'danger');
      return;
    }
    addManager(formData);
    setIsAddOpen(false);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      triggerToast('Validation Error', 'Required fields are missing', 'danger');
      return;
    }
    editManager(selectedManager.id, formData);
    setIsEditOpen(false);
  };

  const handleDeleteClick = (id) => {
    if (window.confirm('Are you sure you want to deactivate and delete this manager profile?')) {
      deleteManager(id);
    }
  };

  // Table Columns
  const columns = [
    { 
      header: 'Manager Name', 
      accessor: 'name', 
      cell: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="navbar-avatar" style={{ width: '32px', height: '32px', fontSize: '0.8125rem' }}>
            {row.name.split(' ').map(n=>n[0]).join('')}
          </div>
          <span style={{ fontWeight: 600 }}>{row.name}</span>
        </div>
      ),
      sortable: true 
    },
    { header: 'Email Address', accessor: 'email', sortable: true },
    { header: 'Phone', accessor: 'phone' },
    { header: 'Assigned Storage', accessor: 'assignedStorage', sortable: true },
    { header: 'Experience', accessor: 'experience' },
    { 
      header: 'Status', 
      accessor: 'status', 
      cell: (row) => (
        <span className={`badge badge-${row.status === 'Active' ? 'success' : 'danger'}`}>
          {row.status}
        </span>
      ),
      sortable: true
    }
  ];

  return (
    <div>
      {/* Title Header */}
      <div className="page-header">
        <div className="page-title-row">
          <div>
            <h1 style={{ margin: 0, fontSize: '1.875rem' }}>Manager Management</h1>
            <p className="page-subtitle">Register and oversee cold chain personnel credentials.</p>
          </div>
          <button className="btn btn-primary" onClick={handleOpenAdd}>
            <Plus size={18} />
            <span>Add Manager</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <StatCard icon={Users} title="Registered Managers" value={totalManagers} desc="Personnel files" />
        <StatCard icon={Users} title="Active Managers" value={activeManagers} desc="Actively supervising" statusColor="success" />
        <StatCard icon={Users} title="Inactive Managers" value={inactiveManagers} desc="Leave / Unavailable" statusColor="danger" />
        <StatCard icon={ShieldCheck} title="Storages Managed" value={`${managedStorages}/${storages.length}`} desc="Cold storage allocation" />
      </div>

      {/* Table section */}
      <div className="card-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.125rem' }}>Management Roster</h3>

          {/* Status Filters */}
          <div style={{ display: 'flex', gap: '0.25rem', backgroundColor: 'var(--border-light)', padding: '0.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            {['All', 'Active', 'Inactive'].map((st) => (
              <button
                key={st}
                className="btn"
                style={{
                  padding: '0.35rem 0.85rem',
                  fontSize: '0.8125rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: statusFilter === st ? 'var(--bg-card)' : 'transparent',
                  color: statusFilter === st ? 'var(--primary-color)' : 'var(--text-muted)',
                  border: 'none',
                  boxShadow: statusFilter === st ? 'var(--shadow-sm)' : 'none',
                  cursor: 'pointer'
                }}
                onClick={() => setStatusFilter(st)}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <DataTable
          columns={columns}
          data={managers}
          searchPlaceholder="Search manager name, email, phone, storage..."
          searchField="name"
          filterKey="status"
          filterValue={statusFilter}
          onView={handleOpenView}
          onEdit={handleOpenEdit}
          onDelete={(row) => handleDeleteClick(row.id)}
        />
      </div>

      {/* View Modal */}
      <Modal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        title="Manager Personnel Profile"
        footerButtons={<button className="btn btn-secondary" onClick={() => setIsViewOpen(false)}>Close Roster</button>}
      >
        {selectedManager && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
              <div className="navbar-avatar" style={{ width: '56px', height: '56px', fontSize: '1.25rem' }}>
                {selectedManager.name.split(' ').map(n=>n[0]).join('')}
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', margin: 0 }}>{selectedManager.name}</h3>
                <span className={`badge badge-${selectedManager.status === 'Active' ? 'success' : 'danger'}`} style={{ marginTop: '0.25rem' }}>
                  {selectedManager.status}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Mail size={16} style={{ color: 'var(--text-muted)' }} />
                <span style={{ fontSize: '0.9rem' }}>{selectedManager.email}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Phone size={16} style={{ color: 'var(--text-muted)' }} />
                <span style={{ fontSize: '0.9rem' }}>{selectedManager.phone}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Award size={16} style={{ color: 'var(--text-muted)' }} />
                <span style={{ fontSize: '0.9rem' }}>Experience: <strong>{selectedManager.experience || 'Not Listed'}</strong></span>
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--border-light)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>
                Assigned Cold Facility
              </span>
              <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary-color)' }}>
                {selectedManager.assignedStorage}
              </span>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Register Storage Manager Profile"
        footerButtons={
          <>
            <button className="btn btn-secondary" onClick={() => setIsAddOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleAddSubmit}>Register Manager</button>
          </>
        }
      >
        <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <FormInput
            label="Manager Full Name"
            id="add-mgr-name"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
          <FormInput
            label="Email Address"
            id="add-mgr-email"
            name="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
          <FormInput
            label="Phone Number"
            id="add-mgr-phone"
            name="phone"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            required
          />
          <FormInput
            label="Initial Login Password"
            id="add-mgr-password"
            name="password"
            type="password"
            value={formData.password}
            placeholder="e.g. Pass@123"
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />
          <FormInput
            label="Experience Level"
            id="add-mgr-exp"
            name="experience"
            value={formData.experience}
            placeholder="e.g. 7 Years"
            onChange={(e) => setFormData({...formData, experience: e.target.value})}
          />
          <FormSelect
            label="Assign Cold Facility Room"
            id="add-mgr-storage"
            name="assignedStorage"
            value={formData.assignedStorage}
            onChange={(e) => setFormData({...formData, assignedStorage: e.target.value})}
            options={[{ label: 'Unassigned', value: 'None' }, ...storages.map(s => ({ label: s.name, value: s.name }))]}
          />
          <FormSelect
            label="Operational Status"
            id="add-mgr-status"
            name="status"
            value={formData.status}
            onChange={(e) => setFormData({...formData, status: e.target.value})}
            options={[
              { label: 'Active', value: 'Active' },
              { label: 'Inactive', value: 'Inactive' }
            ]}
          />
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Modify Manager Profile"
        footerButtons={
          <>
            <button className="btn btn-secondary" onClick={() => setIsEditOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleEditSubmit}>Save Changes</button>
          </>
        }
      >
        <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <FormInput
            label="Manager Full Name"
            id="edit-mgr-name"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
          <FormInput
            label="Email Address"
            id="edit-mgr-email"
            name="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
          <FormInput
            label="Phone Number"
            id="edit-mgr-phone"
            name="phone"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            required
          />
          <FormInput
            label="Experience Level"
            id="edit-mgr-exp"
            name="experience"
            value={formData.experience}
            placeholder="e.g. 7 Years"
            onChange={(e) => setFormData({...formData, experience: e.target.value})}
          />
          <FormSelect
            label="Assign Cold Facility Room"
            id="edit-mgr-storage"
            name="assignedStorage"
            value={formData.assignedStorage}
            onChange={(e) => setFormData({...formData, assignedStorage: e.target.value})}
            options={[{ label: 'Unassigned', value: 'None' }, ...storages.map(s => ({ label: s.name, value: s.name }))]}
          />
          <FormSelect
            label="Operational Status"
            id="edit-mgr-status"
            name="status"
            value={formData.status}
            onChange={(e) => setFormData({...formData, status: e.target.value})}
            options={[
              { label: 'Active', value: 'Active' },
              { label: 'Inactive', value: 'Inactive' }
            ]}
          />
        </form>
      </Modal>
    </div>
  );
};
