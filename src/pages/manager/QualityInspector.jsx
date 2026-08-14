import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { Sparkles, ShieldAlert, CheckCircle2, AlertTriangle, FileText, Database, Thermometer, Droplets, RefreshCw, Building2, Sprout } from 'lucide-react';
import { StatCard, FormInput, FormSelect, DataTable } from '../../components/UI';
import { submitDigitalInspection, getInspectionHistory } from '../../services/aiService';

export const QualityInspector = () => {
  const { storages, products, triggerToast } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [inspectionHistory, setInspectionHistory] = useState([]);
  const [latestResult, setLatestResult] = useState(null);

  const [formData, setFormData] = useState({
    productName: 'Fresh Roma Tomatoes',
    storageName: storages[0]?.name || 'AgriFreeze North Hub',
    temperature: '4.5',
    humidity: '85.0',
    doorMetrics: 'NORMAL',
    notes: 'Visual inspection shows healthy firm skin with no discoloration.'
  });

  const loadHistory = async () => {
    setHistoryLoading(true);
    try {
      const data = await getInspectionHistory();
      setInspectionHistory(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn("Failed to load inspection history", err);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        productName: formData.productName,
        storageName: formData.storageName,
        temperature: Number(formData.temperature),
        humidity: Number(formData.humidity),
        doorMetrics: formData.doorMetrics,
        notes: formData.notes
      };

      const result = await submitDigitalInspection(payload);
      setLatestResult(result);
      triggerToast('AI Analysis Complete', `Inspection saved to MongoDB NoSQL store. Spoilage risk: ${result.spoilageRiskPercent || result.riskScore}%`, 'success');
      await loadHistory();
    } catch (err) {
      triggerToast('Error', err.message || 'Failed to submit inspection', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { header: 'Product Batch', accessor: 'productName', cell: (row) => <strong style={{ color: 'var(--text-main)' }}>{row.productName || 'Crop Batch'}</strong> },
    { header: 'Facility / Chamber', accessor: 'storageName', cell: (row) => row.storageName || 'AgriFreeze Hub' },
    { header: 'Climate Log', accessor: 'temperature', cell: (row) => `${row.temperature ?? 4}°C / ${row.humidity ?? 85}% RH` },
    { 
      header: 'Spoilage Risk', 
      accessor: 'spoilageRiskPercent', 
      cell: (row) => {
        const risk = row.spoilageRiskPercent ?? row.riskScore ?? 15;
        const color = risk > 65 ? '#ef4444' : (risk > 35 ? '#f59e0b' : '#10b981');
        return <span style={{ color, fontWeight: 700 }}>{risk}% Risk</span>;
      }
    },
    {
      header: 'Est. Shelf Life',
      accessor: 'predictedShelfLifeDays',
      cell: (row) => `${row.predictedShelfLifeDays ?? row.shelfLifeDays ?? 30} Days`
    },
    {
      header: 'MongoDB Timestamp',
      accessor: 'createdAt',
      cell: (row) => row.createdAt ? new Date(row.createdAt).toLocaleTimeString() : 'Just now'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ padding: '0.5rem', backgroundColor: 'var(--primary-color)', color: 'white', borderRadius: 'var(--radius-md)' }}>
            <Sparkles size={24} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.75rem' }}>AI Quality Inspector & MongoDB NoSQL Audit</h1>
            <p className="page-subtitle" style={{ margin: 0 }}>Execute AI quality diagnostics and persist unstructured telemetry in MongoDB.</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Inspection Form */}
        <div className="card-section">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={18} style={{ color: 'var(--primary-color)' }} />
            <span>New Quality Inspection Form</span>
          </h3>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <FormInput
              label="Crop Product Batch Name"
              id="qi-product"
              value={formData.productName}
              onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
              required
            />

            <FormSelect
              label="Target Storage Facility"
              id="qi-storage"
              value={formData.storageName}
              onChange={(e) => setFormData({ ...formData, storageName: e.target.value })}
              options={storages.map(s => ({ value: s.name, label: s.name }))}
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <FormInput
                label="Chamber Temperature (°C)"
                id="qi-temp"
                type="number"
                step="0.1"
                value={formData.temperature}
                onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                required
              />

              <FormInput
                label="Relative Humidity (%)"
                id="qi-humidity"
                type="number"
                step="0.1"
                value={formData.humidity}
                onChange={(e) => setFormData({ ...formData, humidity: e.target.value })}
                required
              />
            </div>

            <FormSelect
              label="Door Closure Frequency"
              id="qi-door"
              value={formData.doorMetrics}
              onChange={(e) => setFormData({ ...formData, doorMetrics: e.target.value })}
              options={[
                { value: 'NORMAL', label: 'NORMAL — Sealed & Closed' },
                { value: 'FREQUENT', label: 'FREQUENT — Periodic Loading Access' },
                { value: 'OPEN', label: 'OPEN — Extended Door Ajar Warning' }
              ]}
            />

            <FormInput
              label="Visual Inspector Notes"
              id="qi-notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />

            <button type="submit" className="btn btn-primary" disabled={loading} style={{ justifyContent: 'center', marginTop: '0.5rem' }}>
              {loading ? <RefreshCw className="spin" size={18} /> : <Sparkles size={18} />}
              <span>{loading ? 'Analyzing with AI...' : 'Analyze & Save to MongoDB'}</span>
            </button>
          </form>
        </div>

        {/* AI Inspection Result Panel */}
        <div className="card-section" style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Database size={18} style={{ color: 'var(--primary-color)' }} />
            <span>Latest AI Diagnostic Report</span>
          </h3>

          {latestResult ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%', justifyContent: 'space-between' }}>
              <div style={{
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: latestResult.status === 'Critical' ? 'rgba(239, 68, 68, 0.1)' : (latestResult.status === 'Warning' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)'),
                border: `1px solid ${latestResult.status === 'Critical' ? '#ef4444' : (latestResult.status === 'Warning' ? '#f59e0b' : '#10b981')}`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-main)' }}>{latestResult.productName || 'Inspected Batch'}</span>
                  <span className={`badge badge-${latestResult.status === 'Critical' ? 'danger' : (latestResult.status === 'Warning' ? 'warning' : 'success')}`}>
                    {latestResult.status || 'Safe'}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Spoilage Risk</span>
                    <h2 style={{ margin: 0, color: latestResult.spoilageRiskPercent > 65 ? '#ef4444' : '#10b981' }}>{latestResult.spoilageRiskPercent || latestResult.riskScore || 15}%</h2>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Remaining Shelf Life</span>
                    <h2 style={{ margin: 0, color: 'var(--primary-color)' }}>{latestResult.predictedShelfLifeDays || latestResult.shelfLifeDays || 30} Days</h2>
                  </div>
                </div>

                <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', borderTop: '1px dashed var(--border-color)', paddingTop: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                    <Building2 size={16} style={{ color: 'var(--primary-color)', flexShrink: 0, marginTop: '2px' }} />
                    <div><strong>Manager Action:</strong> {latestResult.managerTip || 'Batch quality clear.'}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                    <Sprout size={16} style={{ color: '#10b981', flexShrink: 0, marginTop: '2px' }} />
                    <div><strong>Farmer Advisory:</strong> {latestResult.farmerTip || 'Climate parameters safe.'}</div>
                  </div>
                </div>

                <div style={{ fontSize: '0.75rem', color: '#64748b', fontStyle: 'italic', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
                  <CheckCircle2 size={14} style={{ color: 'var(--status-success)' }} />
                  <span>Successfully recorded in MongoDB NoSQL Collection: <code>agrifreeze_ai_db.inspections</code></span>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, padding: '3rem 1rem', color: 'var(--text-muted)', textAlign: 'center' }}>
              <Sparkles size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
              <p>Submit an inspection form to run instant AI quality diagnostics and persist telemetry into MongoDB.</p>
            </div>
          )}
        </div>
      </div>

      {/* History Table */}
      <div className="card-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Database size={18} style={{ color: 'var(--primary-color)' }} />
            <span>MongoDB Persistent Inspection Logs ({inspectionHistory.length})</span>
          </h3>
          <button className="btn btn-secondary" onClick={loadHistory} style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}>
            <RefreshCw size={14} className={historyLoading ? 'spin' : ''} />
            <span>Refresh Logs</span>
          </button>
        </div>

        <DataTable
          columns={columns}
          data={inspectionHistory}
          emptyMessage="No inspection logs found in MongoDB yet. Run your first inspection above!"
        />
      </div>
    </div>
  );
};

export default QualityInspector;
