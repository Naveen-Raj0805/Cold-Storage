import React, { useState } from 'react';
import { Snowflake, AlertTriangle, CheckCircle, Thermometer } from 'lucide-react';
import { mockStorages } from '../../data/mockData';
import { useToast } from '../../context/ToastContext';
import PageHeader from '../../components/PageHeader/PageHeader';
import Badge from '../../components/Badge/Badge';
import Button from '../../components/Button/Button';
import './StorageMonitoring.css';

const StorageMonitoring = () => {
  const { showToast } = useToast();
  
  // Load chambers of North Hub (ST-001)
  const hubId = 'ST-001';
  const hub = mockStorages.find((s) => s.id === hubId);
  const [chambers, setChambers] = useState(hub ? hub.chambers : []);
  const [selectedChamberId, setSelectedChamberId] = useState(chambers[0]?.id || '');
  const [targetVal, setTargetVal] = useState(chambers[0]?.targetTemp || 4.0);

  const selectedChamber = chambers.find((ch) => ch.id === selectedChamberId);

  const handleChamberSelect = (ch) => {
    setSelectedChamberId(ch.id);
    setTargetVal(ch.targetTemp);
  };

  const handleTempApply = (e) => {
    e.preventDefault();
    setChambers((prev) =>
      prev.map((ch) =>
        ch.id === selectedChamberId
          ? {
              ...ch,
              targetTemp: targetVal,
              // If temperature target is changed, status might normalize
              status: Math.abs(ch.temp - targetVal) < 2.0 ? 'Active' : 'Warning'
            }
          : ch
      )
    );
    showToast(`Target temperature for ${selectedChamber.name} updated to ${targetVal.toFixed(1)}°C.`, 'success');
  };

  return (
    <div className="page-container animate-fade-in">
      <PageHeader
        title="Chamber Live Monitoring"
        description="Review live temperature levels, adjust chilling target thresholds, and verify cooling compliance."
      />

      {/* Grid of Chamber cards */}
      <div className="monitoring-grid">
        {chambers.map((ch) => {
          const isSelected = ch.id === selectedChamberId;
          const isDeepFreeze = ch.type === 'Freezer';

          return (
            <div
              key={ch.id}
              className={`card-premium monitoring-card ${isSelected ? 'selected' : ''}`}
              onClick={() => handleChamberSelect(ch)}
            >
              <div className="monitoring-card-header">
                <span className="monitoring-card-name">{ch.name}</span>
                <Badge status={ch.status}>{ch.status}</Badge>
              </div>

              <div className="monitoring-live-val-row">
                <span className="monitoring-live-temp">{ch.temp.toFixed(1)}°C</span>
                <span className="monitoring-live-temp-label">live reading</span>
              </div>

              <div className="monitoring-telemetry-grid">
                <div className="monitoring-telemetry-item">
                  <span>Target</span>
                  <span className="monitoring-telemetry-val">{ch.targetTemp.toFixed(1)}°C</span>
                </div>
                <div className="monitoring-telemetry-item">
                  <span>Humidity</span>
                  <span className="monitoring-telemetry-val">{ch.humidity}</span>
                </div>
                <div className="monitoring-telemetry-item">
                  <span>Usage Load</span>
                  <span className="monitoring-telemetry-val">
                    {((ch.occupied / ch.capacity) * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Temperature Control Panel */}
      {selectedChamber && (
        <div className="temperature-control-panel">
          <div className="temp-control-header">
            <Thermometer size={22} className="text-primary" />
            <h3 className="temp-control-title">Adjust Chilling Threshold - {selectedChamber.name}</h3>
          </div>

          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Chamber class: <strong>{selectedChamber.type}</strong>. Changing the target threshold triggers compressor adjustments. Current target boundary is {selectedChamber.targetTemp.toFixed(1)}°C.
          </p>

          <form onSubmit={handleTempApply} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="temp-control-slider-group">
              <input
                type="range"
                className="temp-slider-input"
                min={selectedChamber.type === 'Freezer' ? '-30' : '0'}
                max={selectedChamber.type === 'Freezer' ? '0' : '15'}
                step="0.5"
                value={targetVal}
                onChange={(e) => setTargetVal(parseFloat(e.target.value))}
              />
              <span className="temp-numeric-indicator">{targetVal.toFixed(1)} °C</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button type="submit" variant="primary">
                Apply New Target Temperature
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default StorageMonitoring;
