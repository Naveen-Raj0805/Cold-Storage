import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { Warehouse, Plus, LayoutGrid, Eye, Edit2, Trash2, Layers } from 'lucide-react';
import { StatCard, DataTable, Modal, FormInput, FormSelect } from '../../components/UI';
import { getChambersByStorage } from '../../services/api';

export const StorageManagement = () => {
  const { 
    storages, addStorage, editStorage, deleteStorage, 
    users, triggerToast 
  } = useContext(AppContext);

  // Filter state
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedStorage, setSelectedStorage] = useState(null);
  const [facilityChambers, setFacilityChambers] = useState([]);

  // Forms state
  const [formData, setFormData] = useState({
    name: '', capacity: '', location: '', manager: 'Unassigned', status: 'Active'
  });

  // Calculate statistics
  const totalStorages = storages.length;
  const activeStorages = storages.filter(s => s.status === 'Active').length;
  const inactiveStorages = storages.filter(s => s.status === 'Inactive').length;
  const totalCapacity = storages.reduce((sum, s) => sum + s.capacity, 0);

  // Handlers
  const handleOpenAdd = () => {
    setFormData({ name: '', capacity: '', chamberCount: 4, location: '', manager: 'Unassigned', status: 'Active' });
    setIsAddOpen(true);
  };

  const handleOpenEdit = (storage) => {
    setSelectedStorage(storage);
    setFormData({
      name: storage.name,
      capacity: storage.capacity,
      chamberCount: 4,
      location: storage.location,
      manager: storage.manager,
      status: storage.status
    });
    setIsEditOpen(true);
  };

  const handleOpenView = async (storage) => {
    setSelectedStorage(storage);
    setIsViewOpen(true);
    setFacilityChambers([]);
    try {
      const sId = storage.numericId || (typeof storage.id === 'string' && storage.id.startsWith('STR-') ? Number(storage.id.replace('STR-', '')) : storage.id);
      const chambersData = await getChambersByStorage(sId);
      setFacilityChambers(chambersData || []);
    } catch (err) {
      console.warn("Failed to fetch chambers for storage", err);
    }
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.capacity || !formData.location) {
      triggerToast('Validation Error', 'All fields are required', 'danger');
      return;
    }
    addStorage({
      name: formData.name,
      capacity: Number(formData.capacity),
      chamberCount: Number(formData.chamberCount) || 4,
      location: formData.location,
      manager: formData.manager,
      status: formData.status
    });
    setIsAddOpen(false);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.capacity || !formData.location) {
      triggerToast('Validation Error', 'All fields are required', 'danger');
      return;
    }
    editStorage(selectedStorage.id, {
      name: formData.name,
      capacity: Number(formData.capacity),
      location: formData.location,
      manager: formData.manager,
      status: formData.status
    });
    setIsEditOpen(false);
  };

  const handleDeleteClick = (id) => {
    if (window.confirm('Are you sure you want to decommission this coldroom storage facility? All stored records will be catalogued.')) {
      deleteStorage(id);
    }
  };

  // Table Columns
  const columns = [
    { header: 'Storage ID', accessor: 'id', sortable: true },
    { header: 'Storage Name', accessor: 'name', sortable: true },
    { header: 'Location', accessor: 'location', sortable: true },
    { 
      header: 'Capacity', 
      accessor: 'capacity', 
      cell: (row) => `${row.capacity} Tons (Occupied: ${row.occupied} Tons)`,
      sortable: true 
    },
    { header: 'Manager', accessor: 'manager', sortable: true },
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
      {/* Title Area */}
      <div className="page-header">
        <div className="page-title-row">
          <div>
            <h1 style={{ margin: 0, fontSize: '1.875rem' }}>Storage Management</h1>
            <p className="page-subtitle">Configure, audit, and provision cold chain capacities.</p>
          </div>
          <button className="btn btn-primary" onClick={handleOpenAdd}>
            <Plus size={18} />
            <span>Configure Storage</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <StatCard icon={Warehouse} title="Total Storages" value={totalStorages} desc="Configured chambers" />
        <StatCard icon={Warehouse} title="Active" value={activeStorages} desc="Online & monitoring" statusColor="success" />
        <StatCard icon={Warehouse} title="Inactive" value={inactiveStorages} desc="Maintenance mode" statusColor="danger" />
        <StatCard icon={LayoutGrid} title="Total Capacity" value={`${totalCapacity.toLocaleString()} Tons`} desc="Available cold space" />
      </div>

      {/* Main Table Section */}
      <div className="card-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.125rem' }}>Storage Facilities Directory</h3>
          
          {/* Status Tabs Filter */}
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
          data={storages}
          searchPlaceholder="Search storage name, manager, location..."
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
        title="Storage Facility Telemetries"
        footerButtons={<button className="btn btn-secondary" onClick={() => setIsViewOpen(false)}>Close Dialog</button>}
      >
        {selectedStorage && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Facility ID</span>
                <div style={{ fontWeight: 600 }}>{selectedStorage.id}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Status</span>
                <div>
                  <span className={`badge badge-${selectedStorage.status === 'Active' ? 'success' : 'danger'}`}>
                    {selectedStorage.status}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Storage Name</span>
              <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{selectedStorage.name}</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Location</span>
                <div style={{ fontSize: '0.9rem' }}>{selectedStorage.location}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Facility Manager</span>
                <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{selectedStorage.manager}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem', backgroundColor: 'var(--border-light)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Capacity</span>
                <div style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--text-main)' }}>{selectedStorage.capacity} T</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Occupied Space</span>
                <div style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--primary-color)' }}>{selectedStorage.occupied} T</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Chambers</span>
                <div style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--status-info)' }}>{facilityChambers.length || selectedStorage.chamberCount || 4} Chambers</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Uptime Efficiency</span>
                <div style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--status-success)' }}>{selectedStorage.efficiency}%</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Current Temp</span>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: selectedStorage.temp > 8 ? 'var(--status-danger)' : 'var(--text-main)' }}>
                  {selectedStorage.temp}°C
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Current Humidity</span>
                <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{selectedStorage.humidity}% RH</div>
              </div>
            </div>

            {/* Internal Chambers Detail Section */}
            <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Layers size={16} style={{ color: 'var(--primary-color)' }} />
                  Internal Cooling Chambers ({facilityChambers.length} Total)
                </h4>
              </div>

              {facilityChambers.length === 0 ? (
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic', padding: '0.5rem 0' }}>
                  Loading or no chambers configured for this storage facility.
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem', maxHeight: '240px', overflowY: 'auto' }}>
                  {facilityChambers.map((ch) => (
                    <div key={ch.id} style={{ backgroundColor: 'var(--border-light)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.8125rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, marginBottom: '0.25rem' }}>
                        <span>{ch.name}</span>
                        <span className={`badge badge-${ch.status === 'AVAILABLE' ? 'success' : 'warning'}`}>{ch.status}</span>
                      </div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Code: {ch.chamberCode}</div>
                      <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                        <span>Capacity: <strong>{ch.capacity} T</strong></span>
                        <span>Occupied: <strong>{ch.occupied} T</strong></span>
                      </div>
                      <div style={{ marginTop: '0.25rem', display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                        <span>Temp: {ch.temp}°C</span>
                        <span>Type: {ch.type || 'Cold'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Add Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Configure Cold Storage Facility"
        footerButtons={
          <>
            <button className="btn btn-secondary" onClick={() => setIsAddOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleAddSubmit}>Configure Room</button>
          </>
        }
      >
        <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <FormInput 
            label="Storage Name" 
            id="add-str-name" 
            name="name" 
            value={formData.name} 
            onChange={(e) => setFormData({...formData, name: e.target.value})} 
            required 
          />
          <FormInput 
            label="Total Cold Capacity (Tons)" 
            id="add-str-capacity" 
            name="capacity" 
            type="number"
            value={formData.capacity} 
            onChange={(e) => setFormData({...formData, capacity: e.target.value})} 
            required 
          />
          <FormInput 
            label="Number of Chambers (Equal Division)" 
            id="add-str-chamberCount" 
            name="chamberCount" 
            type="number"
            min="1"
            max="20"
            value={formData.chamberCount || 4} 
            onChange={(e) => setFormData({...formData, chamberCount: e.target.value})} 
            required 
          />
          {formData.capacity && formData.chamberCount && (
            <div style={{ fontSize: '0.8125rem', color: 'var(--primary-color)', marginTop: '-0.25rem', fontWeight: 600, padding: '0.5rem', backgroundColor: 'rgba(59, 130, 246, 0.08)', borderRadius: '6px' }}>
              ℹ Each chamber will receive ~{Math.floor(Number(formData.capacity) / Number(formData.chamberCount || 1))} Tons capacity ({formData.capacity} Tons ÷ {formData.chamberCount} Chambers).
            </div>
          )}
          <FormInput 
            label="Location" 
            id="add-str-location" 
            name="location" 
            value={formData.location} 
            onChange={(e) => setFormData({...formData, location: e.target.value})} 
            required 
          />
          <FormSelect 
            label="Supervising Manager" 
            id="add-str-manager" 
            name="manager" 
            value={formData.manager} 
            onChange={(e) => setFormData({...formData, manager: e.target.value})} 
            options={[{ label: 'Unassigned', value: 'Unassigned' }, ...(users || []).filter(u => u.role && u.role.toLowerCase() === 'manager').map(m => ({ label: m.fullName, value: m.fullName }))]}
          />
          <FormSelect 
            label="Status" 
            id="add-str-status" 
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
        title="Modify Storage Room Settings"
        footerButtons={
          <>
            <button className="btn btn-secondary" onClick={() => setIsEditOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleEditSubmit}>Save Changes</button>
          </>
        }
      >
        <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <FormInput 
            label="Storage Name" 
            id="edit-str-name" 
            name="name" 
            value={formData.name} 
            onChange={(e) => setFormData({...formData, name: e.target.value})} 
            required 
          />
          <FormInput 
            label="Total Cold Capacity (Tons)" 
            id="edit-str-capacity" 
            name="capacity" 
            type="number"
            value={formData.capacity} 
            onChange={(e) => setFormData({...formData, capacity: e.target.value})} 
            required 
          />
          <FormInput 
            label="Location" 
            id="edit-str-location" 
            name="location" 
            value={formData.location} 
            onChange={(e) => setFormData({...formData, location: e.target.value})} 
            required 
          />
          <FormSelect 
            label="Supervising Manager" 
            id="edit-str-manager" 
            name="manager" 
            value={formData.manager} 
            onChange={(e) => setFormData({...formData, manager: e.target.value})} 
            options={[{ label: 'Unassigned', value: 'Unassigned' }, ...(users || []).filter(u => u.role && u.role.toLowerCase() === 'manager').map(m => ({ label: m.fullName, value: m.fullName }))]}
          />
          <FormSelect 
            label="Status" 
            id="edit-str-status" 
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
