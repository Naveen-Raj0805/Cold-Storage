import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { CheckCircle2, Warehouse, AlertTriangle, Sparkles, Building2 } from 'lucide-react';
import { FormSelect } from '../../components/UI';
import { getChambersByStorage, getBookings } from '../../services/api';

export const StorageBooking = () => {
  const { currentUser, storages, createBooking, triggerToast } = useContext(AppContext);
  const [success, setSuccess] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Selected Facility & Chamber state
  const [selectedStorageId, setSelectedStorageId] = useState(storages[0]?.id ? String(storages[0].id) : 'STR-01');
  const [availableChambers, setAvailableChambers] = useState([]);
  const [selectedChamberId, setSelectedChamberId] = useState('');
  const [isLoadingChambers, setIsLoadingChambers] = useState(false);

  // Resolve selected storage object
  const selectedStorage = storages.find(s => String(s.id) === String(selectedStorageId) || s.name === selectedStorageId) || storages[0];

  // Fetch Available Chambers when selected Storage Facility changes
  useEffect(() => {
    const fetchAvailableChambers = async () => {
      if (!selectedStorage) {
        setAvailableChambers([]);
        setSelectedChamberId('');
        return;
      }

      setIsLoadingChambers(true);
      try {
        const rawId = selectedStorage.id;
        const sId = typeof rawId === 'string' && rawId.startsWith('STR-') ? Number(rawId.replace('STR-', '')) : Number(rawId) || 1;
        
        const chambersData = await getChambersByStorage(sId).catch(() => []);
        const allBookings = await getBookings().catch(() => []);

        // Filter out chambers that have active approved/active bookings
        const approvedChamberIdentifiers = new Set(
          (allBookings || [])
            .filter(b => b.status && (b.status.toLowerCase() === 'approved' || b.status.toLowerCase() === 'active'))
            .map(b => b.chamberName || b.chamberId)
            .filter(Boolean)
        );

        // STRICTOR FILTER: Only show chambers with status AVAILABLE and not in approved set
        const filtered = (chambersData || []).filter(ch => {
          const isStatusAvailable = !ch.status || ch.status.toUpperCase() === 'AVAILABLE';
          const isNotApproved = !approvedChamberIdentifiers.has(ch.name) && 
                                !approvedChamberIdentifiers.has(ch.chamberCode) && 
                                !approvedChamberIdentifiers.has(String(ch.id));
          return isStatusAvailable && isNotApproved;
        });

        setAvailableChambers(filtered);
        if (filtered.length > 0) {
          setSelectedChamberId(String(filtered[0].id));
        } else {
          setSelectedChamberId('');
        }
      } catch (err) {
        console.error("Failed to load chambers for storage booking", err);
        setAvailableChambers([]);
        setSelectedChamberId('');
      } finally {
        setIsLoadingChambers(false);
      }
    };

    fetchAvailableChambers();
  }, [selectedStorageId, storages]);

  const handleReset = () => {
    if (storages.length > 0) {
      setSelectedStorageId(String(storages[0].id));
    }
    setSuccess(false);
    setConfirmedBooking(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedStorage) {
      triggerToast('Validation Error', 'Please select a valid Storage Facility.', 'danger');
      return;
    }

    if (!selectedChamberId || availableChambers.length === 0) {
      triggerToast('No Chamber Available', 'Please select an available chamber from the list.', 'danger');
      return;
    }

    const selectedChamberObj = availableChambers.find(c => String(c.id) === String(selectedChamberId)) || availableChambers[0];

    const rawId = selectedStorage.id;
    const numericStorageId = typeof rawId === 'string' && rawId.startsWith('STR-') ? Number(rawId.replace('STR-', '')) : Number(rawId) || 1;

    const bookingObject = {
      farmerId: currentUser?.id || Date.now(),
      farmerName: currentUser?.fullName || currentUser?.name || 'Farmer Client',
      storageId: numericStorageId,
      storageName: selectedStorage.name,
      chamberId: selectedChamberObj ? selectedChamberObj.id : 1,
      chamberName: selectedChamberObj ? selectedChamberObj.name : 'Chamber 1',
      category: 'Vegetables',
      weight: '125 Tons',
      status: 'Pending'
    };

    createBooking(bookingObject);
    
    setConfirmedBooking({
      ...bookingObject,
      id: `REQ-${Date.now().toString().slice(-4)}`
    });
    setSuccess(true);
    triggerToast('Allocation Request Dispatched', `Request sent to Manager for ${selectedChamberObj?.name} in ${selectedStorage?.name}.`, 'success');
  };

  return (
    <div>
      {/* Title */}
      <div className="page-header">
        <h1 style={{ margin: 0, fontSize: '1.875rem' }}>Request Additional Storage Space</h1>
        <p className="page-subtitle">Select a Cold Storage Facility and choose an available chamber to submit an allocation request to the manager.</p>
      </div>

      {success && confirmedBooking ? (
        /* Confirmation Card */
        <div className="card-section" style={{ maxWidth: '600px', margin: '2rem auto', textAlign: 'center', padding: '3rem 2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--status-success)', marginBottom: '1.5rem' }}>
            <CheckCircle2 size={64} />
          </div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Allocation Request Submitted!</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '2rem' }}>
            Your request code is <strong>{confirmedBooking.id}</strong>. The Manager of <strong>{confirmedBooking.storageName}</strong> has received your allocation request and will approve it shortly.
          </p>

          <div style={{ backgroundColor: 'var(--border-light)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Storage Facility</span>
              <strong>{confirmedBooking.storageName}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Selected Available Chamber</span>
              <strong style={{ color: 'var(--primary-color)' }}>{confirmedBooking.chamberName}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Request Status</span>
              <span className="badge badge-warning">Pending Manager Approval</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button className="btn btn-secondary" onClick={handleReset}>Request Another Chamber</button>
            <button className="btn btn-primary" onClick={handleReset}>Done</button>
          </div>
        </div>
      ) : (
        /* Lease Form Layout */
        <div className="card-section" style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h3 style={{ fontSize: '1.125rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Building2 size={20} style={{ color: 'var(--primary-color)' }} />
            <span>Storage Space Lease Form</span>
          </h3>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Step 1: Select Storage Facility */}
            <FormSelect
              label="Select Storage Room / Facility"
              id="booking-facility"
              name="facility"
              value={selectedStorageId}
              onChange={(e) => setSelectedStorageId(e.target.value)}
              options={storages.map(s => ({ 
                label: `${s.name} (${s.location || 'Central'})`, 
                value: String(s.id) 
              }))}
              required
            />

            {/* Step 2: Select Available Chamber */}
            <div>
              <FormSelect
                label="Select Available Chamber"
                id="booking-chamber"
                name="chamber"
                value={selectedChamberId}
                onChange={(e) => setSelectedChamberId(e.target.value)}
                disabled={isLoadingChambers || availableChambers.length === 0}
                options={availableChambers.map(c => ({ 
                  label: `${c.name} (${c.type || 'Vegetables'} - Available)`, 
                  value: String(c.id) 
                }))}
                required
              />

              {isLoadingChambers && (
                <div style={{ fontSize: '0.8125rem', color: 'var(--primary-color)', marginTop: '0.35rem' }}>
                  Checking live chamber availability...
                </div>
              )}

              {!isLoadingChambers && availableChambers.length === 0 && (
                <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#dc2626', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(239, 68, 68, 0.3)', marginTop: '0.5rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AlertTriangle size={18} />
                  <span>No available chambers in {selectedStorage?.name}. All chambers are currently booked. Please select another storage facility.</span>
                </div>
              )}

              {!isLoadingChambers && availableChambers.length > 0 && (
                <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.08)', color: '#059669', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16, 185, 129, 0.3)', marginTop: '0.5rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Sparkles size={18} />
                  <span>Found <strong>{availableChambers.length} Available Chamber(s)</strong> ready for allocation in {selectedStorage?.name}.</span>
                </div>
              )}
            </div>

            {/* Form Buttons */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isLoadingChambers || availableChambers.length === 0}
              >
                Book Storage Space
              </button>
              <button type="button" className="btn btn-secondary" onClick={handleReset}>
                Reset Form
              </button>
            </div>

          </form>
        </div>
      )}
    </div>
  );
};
