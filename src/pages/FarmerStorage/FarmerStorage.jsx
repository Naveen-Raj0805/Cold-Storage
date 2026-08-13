import React from 'react';
import { Snowflake, Calendar, ShieldCheck } from 'lucide-react';
import { mockBookings } from '../../data/mockData';
import PageHeader from '../../components/PageHeader/PageHeader';
import Badge from '../../components/Badge/Badge';
import './FarmerStorage.css';

const FarmerStorage = () => {
  const farmerId = 'farmer';
  const approvedBookings = mockBookings.filter((b) => b.farmerId === farmerId && b.status === 'Approved');

  return (
    <div className="page-container animate-fade-in">
      <PageHeader
        title="My Storage Slots"
        description="Verify active slot allocations, rental timelines, and cooling levels."
      />

      {approvedBookings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 2rem', color: 'var(--text-muted)' }}>
          No active storage slots found. Use the 'Book chamber' tab to request allocations.
        </div>
      ) : (
        <div className="slots-grid">
          {approvedBookings.map((b) => (
            <div className="card-premium slot-card" key={b.id}>
              <div className="slot-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Snowflake size={20} className="text-primary" />
                  <span className="slot-title">{b.chamberName}</span>
                </div>
                <Badge status="Active">Approved</Badge>
              </div>

              <div className="slot-details-grid">
                <div className="slot-detail-item">
                  <span className="slot-detail-label">Storage Facility</span>
                  <span className="slot-detail-val">{b.storageName}</span>
                </div>
                <div className="slot-detail-item">
                  <span className="slot-detail-label">Allocated Cargo Load</span>
                  <span className="slot-detail-val">{b.weight}</span>
                </div>
                <div className="slot-detail-item">
                  <span className="slot-detail-label">Start Date</span>
                  <span className="slot-detail-val">{b.startDate}</span>
                </div>
                <div className="slot-detail-item">
                  <span className="slot-detail-label">End Date</span>
                  <span className="slot-detail-val">{b.endDate}</span>
                </div>
                <div className="slot-detail-item">
                  <span className="slot-detail-label">Pricing Rate</span>
                  <span className="slot-detail-val">{b.price} / month</span>
                </div>
                <div className="slot-detail-item">
                  <span className="slot-detail-label">Booking Reference</span>
                  <span className="slot-detail-val">{b.id}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FarmerStorage;
