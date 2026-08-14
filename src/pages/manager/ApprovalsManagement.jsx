import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { Check, X, Clock, Users, Warehouse, Mail, Calendar, Sparkles } from 'lucide-react';
import { StatCard, DataTable, Modal } from '../../components/UI';

export const ApprovalsManagement = () => {
  const { bookings, approveBooking, rejectBooking, storages, currentUser } = useContext(AppContext);
  const [filterStatus, setFilterStatus] = useState('All');

  // Find manager facility dynamically
  const managerFacility = (Array.isArray(storages) && storages.length > 0)
    ? (storages.find(s => 
        (currentUser?.assignedStorage && s?.name === currentUser.assignedStorage) || 
        (currentUser?.fullName && s?.manager && s.manager.toLowerCase() === currentUser.fullName.toLowerCase()) ||
        (currentUser?.name && s?.manager && s.manager.toLowerCase() === currentUser.name.toLowerCase())
      ) || storages[0])
    : null;

  const facilityName = managerFacility?.name || 'Cold Storage Facility';

  // Filter bookings for manager facility
  const facilityBookings = (Array.isArray(bookings) ? bookings : []).filter(b => {
    if (!b) return false;
    if (!managerFacility) return true;
    const bName = b.facility || b.storageName || '';
    return bName.toLowerCase() === managerFacility.name.toLowerCase() || String(b.storageId) === String(managerFacility.id);
  });

  const pendingBookings = facilityBookings.filter(b => b.status && (b.status.toLowerCase() === 'pending' || b.status.toLowerCase() === 'created'));
  const approvedBookings = facilityBookings.filter(b => b.status && b.status.toLowerCase() === 'approved');
  const rejectedBookings = facilityBookings.filter(b => b.status && b.status.toLowerCase() === 'rejected');

  const displayedBookings = filterStatus === 'All' 
    ? facilityBookings 
    : facilityBookings.filter(b => b.status && b.status.toLowerCase() === filterStatus.toLowerCase());

  const columns = [
    {
      header: 'Booking Code',
      accessor: 'bookingCode',
      cell: (row) => <strong style={{ color: 'var(--primary-color)' }}>{row.bookingCode || `B-${row.id}`}</strong>,
      sortable: true
    },
    {
      header: 'Farmer Name',
      accessor: 'farmerName',
      cell: (row) => row.farmerName || 'Farmer Client',
      sortable: true
    },
    {
      header: 'Facility / Chamber',
      accessor: 'facility',
      cell: (row) => `${row.facility || facilityName} ${row.chamberName ? `(${row.chamberName})` : ''}`
    },
    {
      header: 'Category',
      accessor: 'category',
      cell: (row) => row.category || 'General Cold Storage'
    },
    {
      header: 'Booking Period',
      accessor: 'startDate',
      cell: (row) => `${row.startDate || '2026-07-10'} to ${row.endDate || '2026-10-10'}`
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (row) => {
        const st = (row.status || 'Pending').toLowerCase();
        const badgeClass = st === 'approved' ? 'badge-success' : (st === 'rejected' ? 'badge-danger' : 'badge-warning');
        return (
          <span className={`badge ${badgeClass}`}>
            {row.status || 'Pending'}
          </span>
        );
      },
      sortable: true
    },
    {
      header: 'Action',
      accessor: 'actions',
      cell: (row) => {
        const st = (row.status || 'Pending').toLowerCase();
        if (st === 'approved') {
          return <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}>✓ Approved (Mail Dispatched)</span>;
        }
        if (st === 'rejected') {
          return <span style={{ fontSize: '0.8rem', color: '#ef4444', fontWeight: 600 }}>✗ Rejected</span>;
        }
        return (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              className="btn btn-primary" 
              style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem', gap: '0.25rem' }}
              onClick={() => approveBooking(row.id)}
            >
              <Check size={14} />
              <span>Approve</span>
            </button>
            <button 
              className="btn btn-danger" 
              style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem', gap: '0.25rem', backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)' }}
              onClick={() => rejectBooking(row.id)}
            >
              <X size={14} />
              <span>Reject</span>
            </button>
          </div>
        );
      }
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div className="page-header">
        <h1 style={{ margin: 0, fontSize: '1.875rem' }}>Farmer Storage Request Approvals</h1>
        <p className="page-subtitle">Review, approve, or reject cold storage room allocation requests submitted by regional farmers.</p>
      </div>

      {/* Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }}>
        <StatCard
          title="Total Requests"
          value={`${facilityBookings.length} Requests`}
          desc="Assigned facility history"
          icon={Warehouse}
        />
        <StatCard
          title="Pending Approvals"
          value={`${pendingBookings.length} Pending`}
          desc="Action required"
          statusColor="warning"
          icon={Clock}
        />
        <StatCard
          title="Approved Allocations"
          value={`${approvedBookings.length} Approved`}
          desc="SMTP Mail Sent"
          statusColor="success"
          icon={Check}
        />
        <StatCard
          title="Rejected Requests"
          value={`${rejectedBookings.length} Rejected`}
          desc="Capacity / Ineligible"
          statusColor="danger"
          icon={X}
        />
      </div>

      {/* Filter Bar & Table */}
      <div className="card-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Allocation Request Queue</h3>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['All', 'Pending', 'Approved', 'Rejected'].map(st => (
              <button
                key={st}
                type="button"
                className={`btn ${filterStatus === st ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                onClick={() => setFilterStatus(st)}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <DataTable
          columns={columns}
          data={displayedBookings}
          emptyMessage="No storage booking requests match the selected status filter."
        />
      </div>
    </div>
  );
};

export default ApprovalsManagement;
