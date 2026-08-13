import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { 
  Package, Warehouse, Clock, ShieldAlert, Calendar, Bell, Sparkles, Send, CheckCircle2, AlertTriangle
} from 'lucide-react';
import { StatCard, SkeletonLoader, EmptyState } from '../../components/UI';
import { motion, useReducedMotion } from 'framer-motion';
import { submitDigitalInspection } from '../../services/aiService';

export const FarmerDashboard = () => {
  const { currentUser, products, storages, alerts, t } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(true);

  // Digital Inspection State
  const [inspCrop, setInspCrop] = useState('Organic Honeycrisp Apples');
  const [inspTemp, setInspTemp] = useState('4.2');
  const [inspHumidity, setInspHumidity] = useState('85');
  const [inspDoor, setInspDoor] = useState('NORMAL');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState({
    productName: 'Organic Honeycrisp Apples',
    spoilageRiskPercent: 15,
    predictedShelfLifeDays: 84,
    status: 'Safe',
    farmerTip: 'Storage climate (4.2°C, 85.0% RH) is optimal for apples. Maintain current air recirculation settings.'
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleRunInspection = async (e) => {
    e.preventDefault();
    setIsAnalyzing(true);
    try {
      const result = await submitDigitalInspection({
        productName: inspCrop,
        temperature: parseFloat(inspTemp),
        humidity: parseFloat(inspHumidity),
        doorMetrics: inspDoor
      });
      setAiResult(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Filter items matching current farmer session
  const farmerProducts = products.filter(p => 
    (currentUser?.id && (p.farmerId === currentUser.id || String(p.farmerId) === String(currentUser.id))) ||
    (currentUser?.fullName && p.farmerName === currentUser.fullName) ||
    (currentUser?.name && p.farmer === currentUser.name)
  );
  const farmerStorageName = currentUser?.bookedStorage || farmerProducts[0]?.storageName || farmerProducts[0]?.storage || 'AgriFreeze Coldroom Alpha';
  const farmerStorage = storages.find(s => s.name === farmerStorageName) || null;

  const totalProducts = farmerProducts.length;
  const storageUtilized = farmerProducts.reduce((sum, p) => sum + Number(p.quantity || 0), 0);
  const nearExpiryCount = farmerProducts.filter(p => (p.shelfLife != null && p.shelfLife <= 5) || p.status === 'Expired').length;
  const storageAlerts = farmerStorage ? alerts.filter(a => a.storage === farmerStorage.name && a.status === 'Active') : [];

  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Welcome Area */}
      <div className="page-header" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.875rem' }}>{t('welcome')}, {currentUser?.name?.split(' ')[0] || 'Farmer'}</h1>
          <p className="page-subtitle">{t('farmerDashboardSub')}</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span className="badge badge-success" style={{ padding: '0.4rem 0.8rem' }}>
            {t('systemHealth')}
          </span>
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Assigned: <strong>{farmerStorageName}</strong></span>
        </div>
      </div>

      {/* Stats Cards Grid */}
      {isLoading ? (
        <SkeletonLoader type="card" count={4} />
      ) : (
        <div className="stats-grid">
          <StatCard icon={Package} title={t('totalProducts')} value={totalProducts} desc="Active crop batches" index={0} />
          <StatCard icon={Warehouse} title={t('occupiedCapacity')} value={`${storageUtilized} Tons`} desc={`Assigned space: ${farmerStorage?.capacity || 500} Tons`} statusColor="primary" index={1} />
          <StatCard icon={Clock} title="Near Expiry" value={nearExpiryCount} desc="Shelf life under 5 days" statusColor={nearExpiryCount > 0 ? "warning" : "success"} index={2} />
          <StatCard icon={ShieldAlert} title={t('activeAlerts')} value={storageAlerts.length} desc="Facility safety alarms" statusColor={storageAlerts.length > 0 ? "danger" : "success"} index={3} />
        </div>
      )}

      {/* AI Post-Harvest Inspection & Guidance Panel */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Field Inspection Form */}
        <div className="card-section" style={{ margin: 0, background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(5, 40, 28, 0.3) 100%)', border: '1px solid rgba(46, 204, 113, 0.3)' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={20} style={{ color: 'var(--primary-color)' }} />
            <span>Digital Field Inspection Sheet</span>
          </h3>
          <form onSubmit={handleRunInspection} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>Crop Produce Name</label>
              <input
                type="text"
                className="input-field"
                value={inspCrop}
                onChange={(e) => setInspCrop(e.target.value)}
                placeholder="e.g. Organic Honeycrisp Apples"
                required
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>Chamber Temp (°C)</label>
                <input
                  type="number"
                  step="0.1"
                  className="input-field"
                  value={inspTemp}
                  onChange={(e) => setInspTemp(e.target.value)}
                  required
                />
              </div>
              <div>
                <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>Humidity (%)</label>
                <input
                  type="number"
                  step="1"
                  className="input-field"
                  value={inspHumidity}
                  onChange={(e) => setInspHumidity(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>Door Frequency / Openings</label>
              <select className="input-field" value={inspDoor} onChange={(e) => setInspDoor(e.target.value)}>
                <option value="NORMAL">Normal (1-3 openings/day)</option>
                <option value="FREQUENT">Frequent (5-10 openings/day)</option>
                <option value="OPEN">Door Ajar / Constant Open</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary" disabled={isAnalyzing} style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <Send size={16} />
              <span>{isAnalyzing ? 'Running Gemini AI Analysis...' : 'Submit & Analyze Health'}</span>
            </button>
          </form>
        </div>

        {/* AI Metrics Display: Countdown Clock + Operational Farmer Tip */}
        <div className="card-section" style={{ margin: 0, borderLeft: `4px solid ${aiResult.status === 'Critical' ? 'var(--status-danger)' : (aiResult.status === 'Warning' ? 'var(--status-warning)' : 'var(--status-success)')}`, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>AI Shelf-Life Evaluation</span>
              <span className={`badge badge-${aiResult.status === 'Critical' ? 'danger' : (aiResult.status === 'Warning' ? 'warning' : 'success')}`} style={{ padding: '0.35rem 0.75rem', fontSize: '0.8125rem' }}>
                {aiResult.status} Risk ({aiResult.spoilageRiskPercent}% Spoilage)
              </span>
            </div>

            {/* Countdown Clock */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', backgroundColor: 'var(--border-light)', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
              <Clock size={42} style={{ color: aiResult.status === 'Critical' ? 'var(--status-danger)' : 'var(--primary-color)' }} />
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1, color: 'var(--text-color)' }}>
                  {aiResult.predictedShelfLifeDays} <span style={{ fontSize: '1rem', fontWeight: 500 }}>Days</span>
                </div>
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Estimated Freshness Countdown Remaining</span>
              </div>
            </div>

            {/* Operational Guidance Card */}
            <div style={{ padding: '1rem', backgroundColor: 'rgba(46, 204, 113, 0.08)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(46, 204, 113, 0.2)' }}>
              <h4 style={{ fontSize: '0.9rem', marginBottom: '0.4rem', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Sparkles size={16} />
                <span>Field Operational Guidance</span>
              </h4>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.5, margin: 0, color: 'var(--text-color)' }}>
                {aiResult.farmerTip}
              </p>
            </div>
          </div>

          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <CheckCircle2 size={14} style={{ color: 'var(--status-success)' }} />
            <span>Processed against post-harvest food science principles</span>
          </div>
        </div>
      </div>

      {/* Grid: Spoilage details + environmental status */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card-section" style={{ margin: 0 }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldAlert size={18} style={{ color: 'var(--status-danger)' }} />
              <span>Chamber Warnings</span>
            </h3>
            {isLoading ? (
              <SkeletonLoader type="table" count={3} />
            ) : storageAlerts.length === 0 ? (
              <EmptyState 
                title="No active warnings" 
                desc="All environmental thresholds are currently in range for your assigned chamber."
                icon={Bell}
              />
            ) : (
              <div className="table-container">
                <table className="custom-table" style={{ fontSize: '0.8125rem' }}>
                  <thead>
                    <tr>
                      <th>Incident Type</th>
                      <th>Time</th>
                      <th>Severity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {storageAlerts.map(a => (
                      <tr key={a.id}>
                        <td style={{ fontWeight: 600 }}>{a.type}</td>
                        <td>{a.time}</td>
                        <td>
                          <span className={`badge badge-${a.severity === 'Critical' ? 'danger' : 'warning'}`}>
                            {a.severity}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="card-section" style={{ margin: 0, padding: '1.25rem' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={18} style={{ color: 'var(--primary-color)' }} />
            <span>Activity History</span>
          </h3>

          {isLoading ? (
            <SkeletonLoader type="list" count={4} />
          ) : farmerProducts.length === 0 ? (
            <EmptyState 
              title="No check-ins yet" 
              desc="Register crop shipments under My Products to log storage check-ins."
              icon={Package}
            />
          ) : (
            <div className="activity-timeline">
              {farmerProducts.slice(0, 4).map((p, idx) => (
                <div className="timeline-item" key={p.id}>
                  <div className="timeline-badge" style={{ 
                    backgroundColor: idx % 2 === 0 ? 'var(--primary-light)' : 'var(--status-info-bg)', 
                    color: idx % 2 === 0 ? 'var(--primary-color)' : 'var(--status-info)' 
                  }}>
                    <Package size={14} />
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-title">Checked in {p.quantity} Tons {p.name}</div>
                    <div className="timeline-time">Stored on {p.entryDate}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default FarmerDashboard;
