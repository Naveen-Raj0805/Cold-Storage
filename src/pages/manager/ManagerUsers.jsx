import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { Users, Mail, Phone, Warehouse } from 'lucide-react';
import { StatCard, DataTable, Modal, Avatar } from '../../components/UI';

export const ManagerUsers = () => {
  const { users, storages, products, bookings, currentUser } = useContext(AppContext);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  // Dynamically resolve logged-in manager's facility
  const managerFacility = (Array.isArray(storages) && storages.length > 0)
    ? (storages.find(s => 
        (currentUser?.assignedStorage && s?.name === currentUser.assignedStorage) || 
        (currentUser?.fullName && s?.manager && s.manager.toLowerCase() === currentUser.fullName.toLowerCase()) ||
        (currentUser?.name && s?.manager && s.manager.toLowerCase() === currentUser.name.toLowerCase())
      ) || storages[0])
    : null;

  const facilityName = managerFacility?.name || 'Cold Storage Facility';

  // Get approved bookings for this manager's facility
  const facilityApprovedBookings = (Array.isArray(bookings) ? bookings : []).filter(b => 
    b && b.status && (b.status.toLowerCase() === 'approved' || b.status.toLowerCase() === 'active') &&
    managerFacility && (
      (b.storageName && b.storageName.toLowerCase() === managerFacility.name.toLowerCase()) ||
      (b.storageId && String(b.storageId) === String(managerFacility.id))
    )
  );

  const approvedFarmerIds = new Set(facilityApprovedBookings.map(b => String(b.farmerId)).filter(Boolean));
  const approvedFarmerNames = new Set(facilityApprovedBookings.map(b => (b.farmerName || '').toLowerCase()).filter(Boolean));

  // Filter farmers from user list
  const assignedFarmers = (Array.isArray(users) ? users : []).filter(u => {
    if (!u) return false;
    const isFarmer = !u.role || u.role.toUpperCase() === 'FARMER';
    if (!isFarmer) return false;

    const uName = (u.fullName || u.name || '').toLowerCase();
    const matchesId = approvedFarmerIds.has(String(u.id));
    const matchesName = uName && approvedFarmerNames.has(uName);
    const matchesBookedStorage = u.bookedStorage && managerFacility?.name && u.bookedStorage.toLowerCase() === managerFacility.name.toLowerCase();

    return matchesId || matchesName || matchesBookedStorage;
  });

  const handleOpenView = (user) => {
    setSelectedUser(user);
    setIsViewOpen(true);
  };

  const columns = [
    {
      header: 'Farmer Name',
      accessor: 'name',
      cell: (row) => {
        const displayName = row.fullName || row.name || 'Farmer Client';
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="navbar-avatar" style={{ width: '32px', height: '32px', fontSize: '0.8125rem' }}>
              <Avatar src={row.avatar || row.profilePicture} name={displayName} />
            </div>
            <span style={{ fontWeight: 600 }}>{displayName}</span>
          </div>
        );
      },
      sortable: true
    },
    { header: 'Email Address', accessor: 'email', sortable: true },
    { header: 'Phone Number', accessor: 'phone', cell: (row) => row.phone || 'N/A' },
    { header: 'Booked Facility', accessor: 'bookedStorage', cell: (row) => row.bookedStorage || facilityName },
    { 
      header: 'Active Products', 
      accessor: 'products', 
      cell: (row) => {
        const dName = row.fullName || row.name;
        const count = (Array.isArray(products) ? products : []).filter(p => p && p.farmer === dName && p.storage === facilityName).length;
        return `${count} Products`;
      },
      sortable: true 
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (row) => {
        const st = row.status ? String(row.status).toUpperCase() : 'ACTIVE';
        return (
          <span className={`badge badge-${st === 'ACTIVE' ? 'success' : 'danger'}`}>
            {st}
          </span>
        );
      },
      sortable: true
    }
  ];

  return (
    <div>
      {/* Title */}
      <div className="page-header">
        <h1 style={{ margin: 0, fontSize: '1.875rem' }}>Farmers & Clients</h1>
        <p className="page-subtitle">Roster of clients utilizing cold storage slots in <strong>{facilityName}</strong>.</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
        <StatCard icon={Users} title="Active Clients" value={assignedFarmers.length} desc="Farmers utilizing space" />
        <StatCard icon={Warehouse} title="Storage Allocated" value={`${managerFacility?.occupied || 0} Tons`} desc={`Out of ${managerFacility?.capacity || 0} Tons capacity`} statusColor="success" />
        <StatCard icon={Users} title="Assigned Facility" value={managerFacility?.id || 'STR-01'} desc={facilityName} />
      </div>

      {/* Table Section */}
      <div className="card-section">
        <h3 style={{ fontSize: '1.125rem', marginBottom: '1.25rem' }}>Approved Client Directory ({assignedFarmers.length} Farmers)</h3>
        <DataTable
          columns={columns}
          data={assignedFarmers}
          searchPlaceholder="Search farmer name, contact details..."
          searchField="name"
          onView={handleOpenView}
        />
      </div>

      {/* View Modal */}
      <Modal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        title="Client Farmer Profile"
        footerButtons={<button className="btn btn-secondary" onClick={() => setIsViewOpen(false)}>Close Dossier</button>}
      >
        {selectedUser && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
              <div className="navbar-avatar" style={{ width: '56px', height: '56px', fontSize: '1.25rem' }}>
                <Avatar src={selectedUser.avatar || selectedUser.profilePicture} name={selectedUser.fullName || selectedUser.name} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', margin: 0 }}>{selectedUser.fullName || selectedUser.name}</h3>
                <span className={`badge badge-${(selectedUser.status || 'ACTIVE').toUpperCase() === 'ACTIVE' ? 'success' : 'danger'}`} style={{ marginTop: '0.25rem' }}>
                  {selectedUser.status || 'ACTIVE'}
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
                <span style={{ fontSize: '0.9rem' }}>{selectedUser.phone || 'N/A'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Warehouse size={16} style={{ color: 'var(--text-muted)' }} />
                <span style={{ fontSize: '0.9rem' }}>Assigned cold storage: <strong>{selectedUser.bookedStorage || facilityName}</strong></span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
