import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { Users, Plus, Mail, Phone, Calendar, ArrowRight, Activity, Warehouse } from 'lucide-react';
import { StatCard, DataTable, Modal, FormInput, FormSelect, Avatar } from '../../components/UI';

export const UserManagement = () => {
  const { 
    users, addUser, editUser, deleteUser, 
    products, storages, triggerToast 
  } = useContext(AppContext);

  // Filter state
  const [statusFilter, setStatusFilter] = useState('All');

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Forms state
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', bookedStorage: 'None', status: 'Active'
  });

  // Calculate statistics
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'Active').length;
  const inactiveUsers = users.filter(u => u.status === 'Inactive').length;
  const totalProducts = products.length;

  // Handlers
  const handleOpenAdd = () => {
    setFormData({ name: '', email: '', phone: '', bookedStorage: 'None', status: 'Active' });
    setIsAddOpen(true);
  };

  const handleOpenEdit = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      bookedStorage: user.bookedStorage,
      status: user.status
    });
    setIsEditOpen(true);
  };

  const handleOpenView = (user) => {
    setSelectedUser(user);
    setIsViewOpen(true);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      triggerToast('Validation Error', 'All fields are required', 'danger');
      return;
    }
    addUser(formData);
    setIsAddOpen(false);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      triggerToast('Validation Error', 'All fields are required', 'danger');
      return;
    }
    editUser(selectedUser.id, formData);
    setIsEditOpen(false);
  };

  const handleDeleteClick = (id) => {
    if (window.confirm('Are you sure you want to suspend this client/farmer account? All listings will be catalogued.')) {
      deleteUser(id);
    }
  };

  // Table Columns
  const columns = [
    {
      header: 'Name',
      accessor: 'name',
      cell: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="navbar-avatar" style={{ width: '32px', height: '32px', fontSize: '0.8125rem' }}>
            <Avatar src={row.avatar} name={row.name} />
          </div>
          <span style={{ fontWeight: 600 }}>{row.name}</span>
        </div>
      ),
      sortable: true
    },
    { header: 'Email Address', accessor: 'email', sortable: true },
    { header: 'Phone Number', accessor: 'phone' },
    { header: 'Booked Storage', accessor: 'bookedStorage', sortable: true },
    { header: 'Stored Items', accessor: 'products', cell: (row) => `${row.products} Products`, sortable: true },
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
            <h1 style={{ margin: 0, fontSize: '1.875rem' }}>User Management</h1>
            <p className="page-subtitle">Configure, suspend, and monitor active farmer accounts.</p>
          </div>
          <button className="btn btn-primary" onClick={handleOpenAdd}>
            <Plus size={18} />
            <span>Add User Profile</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <StatCard icon={Users} title="Total Users" value={totalUsers} desc="Registered farmers" />
        <StatCard icon={Users} title="Active Users" value={activeUsers} desc="Accounts online" statusColor="success" />
        <StatCard icon={Users} title="Inactive Users" value={inactiveUsers} desc="Suspended accounts" statusColor="danger" />
        <StatCard icon={Calendar} title="Total Products" value={totalProducts} desc="Active listings stored" />
      </div>

      {/* Main Split Layout: Left Table, Right Activity/Insights */}
      <div className="user-mgmt-layout">
        {/* Left Side: Users Directory */}
        <div className="card-section" style={{ margin: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.125rem' }}>Farmer Directory</h3>
            
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
          data={users}
          searchPlaceholder="Search farmer name, email, booked space..."
          searchField="name"
          filterKey="status"
          filterValue={statusFilter}
          onView={handleOpenView}
          onEdit={handleOpenEdit}
          onDelete={(row) => handleDeleteClick(row.id)}
        />
      </div>

        {/* Right Side: Activity & Platform Optimization insights */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Optimization Insight */}
          <div className="stat-card" style={{ borderLeft: '4px solid var(--primary-color)', backgroundColor: 'var(--bg-card)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span className="logo-icon" style={{ color: 'var(--primary-color)' }}><Activity size={18} /></span>
              <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>Platform Optimization</strong>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              AgriFreeze Coldroom Alpha is operating at 70% capacity. We recommend forwarding subsequent CA harvest allocations to Coldroom Delta in Fresno to balance thermal grid stresses and lower power expenditures by 8%.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--primary-color)', fontWeight: 600, marginTop: '0.75rem', cursor: 'pointer' }}>
              <span>View Distribution Model</span>
              <ArrowRight size={12} />
            </div>
          </div>

          {/* Recent Activity Log */}
          <div className="card-section" style={{ padding: '1.25rem' }}>
            <h3 style={{ fontSize: '0.95rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Activity size={16} style={{ color: 'var(--primary-color)' }} />
              <span>Platform Activity</span>
            </h3>
            
            <div className="activity-timeline">
              <div className="timeline-item">
                <div className="timeline-badge" style={{ backgroundColor: 'var(--status-info-bg)', color: 'var(--status-info)' }}>
                  <Calendar size={14} />
                </div>
                <div className="timeline-content">
                  <div className="timeline-title">Rahul Kumar created a storage booking</div>
                  <div className="timeline-time">2 hours ago</div>
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-badge" style={{ backgroundColor: 'var(--status-danger-bg)', color: 'var(--status-danger)' }}>
                  <Users size={14} />
                </div>
                <div className="timeline-content">
                  <div className="timeline-title">Alert: Temperature alert resolved in Alpha</div>
                  <div className="timeline-time">4 hours ago</div>
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-badge" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary-color)' }}>
                  <Plus size={14} />
                </div>
                <div className="timeline-content">
                  <div className="timeline-title">Manager Sarah Davis registered to Delta</div>
                  <div className="timeline-time">2 days ago</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* View Modal */}
      <Modal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        title="Farmer Account Details"
        footerButtons={<button className="btn btn-secondary" onClick={() => setIsViewOpen(false)}>Close Dossier</button>}
      >
        {selectedUser && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
              <div className="navbar-avatar" style={{ width: '56px', height: '56px', fontSize: '1.25rem' }}>
                {selectedUser.avatar || 'U'}
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', margin: 0 }}>{selectedUser.name}</h3>
                <span className={`badge badge-${selectedUser.status === 'Active' ? 'success' : 'danger'}`} style={{ marginTop: '0.25rem' }}>
                  {selectedUser.status}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Mail size={16} style={{ color: 'var(--text-muted)' }} />
                <span style={{ fontSize: '0.9rem' }}>{selectedUser.email}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Phone size={16} style={{ color: 'var(--text-muted)' }} />
                <span style={{ fontSize: '0.9rem' }}>{selectedUser.phone}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Warehouse size={16} style={{ color: 'var(--text-muted)' }} />
                <span style={{ fontSize: '0.9rem' }}>Booked Storage: <strong>{selectedUser.bookedStorage}</strong></span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', backgroundColor: 'var(--border-light)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>Active Listings</span>
                <span style={{ fontWeight: 700, fontSize: '1.2rem' }}>{selectedUser.products} Items</span>
              </div>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>Account Type</span>
                <span style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--primary-color)' }}>Farmer</span>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Add Farmer Account Profile"
        footerButtons={
          <>
            <button className="btn btn-secondary" onClick={() => setIsAddOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleAddSubmit}>Create Account</button>
          </>
        }
      >
        <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <FormInput
            label="Farmer Full Name"
            id="add-usr-name"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
          <FormInput
            label="Email Address"
            id="add-usr-email"
            name="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
          <FormInput
            label="Phone Number"
            id="add-usr-phone"
            name="phone"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            required
          />
          <FormSelect
            label="Assign Coldroom Storage"
            id="add-usr-storage"
            name="bookedStorage"
            value={formData.bookedStorage}
            onChange={(e) => setFormData({...formData, bookedStorage: e.target.value})}
            options={[{ label: 'None', value: 'None' }, ...storages.map(s => ({ label: s.name, value: s.name }))]}
          />
          <FormSelect
            label="Account Status"
            id="add-usr-status"
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
        title="Modify Farmer Profile"
        footerButtons={
          <>
            <button className="btn btn-secondary" onClick={() => setIsEditOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleEditSubmit}>Save Changes</button>
          </>
        }
      >
        <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <FormInput
            label="Farmer Full Name"
            id="edit-usr-name"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
          <FormInput
            label="Email Address"
            id="edit-usr-email"
            name="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
          <FormInput
            label="Phone Number"
            id="edit-usr-phone"
            name="phone"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            required
          />
          <FormSelect
            label="Assign Coldroom Storage"
            id="edit-usr-storage"
            name="bookedStorage"
            value={formData.bookedStorage}
            onChange={(e) => setFormData({...formData, bookedStorage: e.target.value})}
            options={[{ label: 'None', value: 'None' }, ...storages.map(s => ({ label: s.name, value: s.name }))]}
          />
          <FormSelect
            label="Account Status"
            id="edit-usr-status"
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
