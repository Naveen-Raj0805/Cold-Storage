import React, { useState, useEffect } from 'react';
import { CalendarRange, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockStorages } from '../../data/mockData';
import { useToast } from '../../context/ToastContext';
import PageHeader from '../../components/PageHeader/PageHeader';
import Dropdown from '../../components/Dropdown/Dropdown';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import './StorageBooking.css';

const StorageBooking = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Active hubs only
  const activeHubs = mockStorages.filter((s) => s.status === 'Active');

  const [hubSelect, setHubSelect] = useState('ST-001');
  const [chambersList, setChambersList] = useState([]);
  const [chamberSelect, setChamberSelect] = useState('');
  
  const [categorySelect, setCategorySelect] = useState('Fruits');
  const [cargoWeight, setCargoWeight] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [estCost, setEstCost] = useState(0);

  // Update chambers dropdown when selected hub changes
  useEffect(() => {
    const foundHub = activeHubs.find((s) => s.id === hubSelect);
    if (foundHub) {
      setChambersList(foundHub.chambers);
      setChamberSelect(foundHub.chambers[0]?.id || '');
    } else {
      setChambersList([]);
      setChamberSelect('');
    }
  }, [hubSelect]);

  // Calculate live cost estimates
  useEffect(() => {
    const weightNum = parseFloat(cargoWeight);
    if (!isNaN(weightNum) && weightNum > 0) {
      // Estimate formula: $0.24 per kg per month
      const months = 3; // mock static contract period
      const cost = weightNum * 0.24 * months;
      setEstCost(Math.round(cost));
    } else {
      setEstCost(0);
    }
  }, [cargoWeight]);

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      showToast('Please select contract schedule parameters.', 'warning');
      return;
    }

    showToast('Your booking claim has been submitted to the hub manager.', 'success');
    navigate('/farmer/dashboard');
  };

  return (
    <div className="page-container animate-fade-in">
      <PageHeader
        title="Book Cold Storage"
        description="Book chilling chamber slots, schedule crop storage timelines, and calculate rate estimations."
      />

      <div className="booking-form-card">
        <h3 className="booking-form-section-title">Slot Allocation Request</h3>
        <form onSubmit={handleBookingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div className="booking-form-grid">
            <Dropdown
              label="Select Hub Facility"
              value={hubSelect}
              onChange={(e) => setHubSelect(e.target.value)}
              options={activeHubs.map((s) => ({ value: s.id, label: s.name }))}
              placeholder=""
              required
            />
            <Dropdown
              label="Select Chamber Class"
              value={chamberSelect}
              onChange={(e) => setChamberSelect(e.target.value)}
              options={chambersList.map((ch) => ({ value: ch.id, label: ch.name }))}
              placeholder=""
              required
            />
          </div>

          <div className="booking-form-grid">
            <Dropdown
              label="Crop Category"
              value={categorySelect}
              onChange={(e) => setCategorySelect(e.target.value)}
              options={[
                { value: 'Fruits', label: 'Fruits' },
                { value: 'Vegetables', label: 'Vegetables' }
              ]}
              placeholder=""
              required
            />
            <Input
              label="Required Load Weight (kg)"
              type="number"
              value={cargoWeight}
              onChange={(e) => setCargoWeight(e.target.value)}
              required
              placeholder="e.g. 5000"
            />
          </div>

          <div className="booking-form-grid">
            <Input
              label="Contract Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
            <Input
              label="Contract End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>

          {/* Pricing Estimation Panel */}
          {estCost > 0 && (
            <div className="booking-estimate-panel">
              <span className="booking-estimate-label">Estimated Quarterly Rental Price:</span>
              <span className="booking-estimate-price">${estCost.toLocaleString()}</span>
            </div>
          )}

          <div className="booking-actions">
            <Button type="submit" variant="primary" icon={<CalendarRange size={16} />}>
              Submit Request
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default StorageBooking;
