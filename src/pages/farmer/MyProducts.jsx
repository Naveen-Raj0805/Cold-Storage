import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { Package, Plus, Trash2, Eye, Warehouse, ShieldAlert, Sparkles, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { StatCard, DataTable, Modal, FormInput, FormSelect } from '../../components/UI';

const predictCropShelfLife = (productName, temp = 4.0, humidity = 80.0) => {
  const name = String(productName || '').toLowerCase();
  
  let baseDays = 30;
  let optimalTemp = 4.0;
  let optimalHumidity = 85.0;
  let sensitivityFactor = 1.0;

  if (name.includes('tomato')) {
    baseDays = 21;
    optimalTemp = 5.0;
    optimalHumidity = 85.0;
  } else if (name.includes('apple')) {
    baseDays = 90;
    optimalTemp = 2.0;
    optimalHumidity = 90.0;
  } else if (name.includes('banana')) {
    baseDays = 10;
    optimalTemp = 13.0;
    optimalHumidity = 85.0;
    sensitivityFactor = 2.5;
  } else if (name.includes('potato')) {
    baseDays = 120;
    optimalTemp = 8.0;
    optimalHumidity = 85.0;
  } else if (name.includes('onion')) {
    baseDays = 150;
    optimalTemp = 2.0;
    optimalHumidity = 70.0;
  } else if (name.includes('grape')) {
    baseDays = 45;
    optimalTemp = 1.0;
    optimalHumidity = 90.0;
  } else if (name.includes('milk') || name.includes('dairy')) {
    baseDays = 14;
    optimalTemp = 3.0;
    optimalHumidity = 75.0;
  } else if (name.includes('leaf') || name.includes('spinach') || name.includes('lettuce')) {
    baseDays = 14;
    optimalTemp = 2.0;
    optimalHumidity = 95.0;
    sensitivityFactor = 1.8;
  } else if (name.includes('carrot') || name.includes('beet')) {
    baseDays = 60;
    optimalTemp = 2.0;
    optimalHumidity = 90.0;
  }

  const tempDiff = Math.abs(temp - optimalTemp);
  const humidityDiff = Math.abs(humidity - optimalHumidity);
  
  let riskPercent = Math.min(98, Math.max(5, Math.round((tempDiff * 8.5 + humidityDiff * 0.8) * sensitivityFactor + 8)));
  let shelfLife = Math.max(1, Math.round(baseDays * Math.pow(0.88, tempDiff) * (1 - riskPercent / 160)));

  let status = 'Healthy';
  let spoilageRisk = 'Green';
  if (riskPercent > 65) {
    status = 'Critical';
    spoilageRisk = 'Red';
  } else if (riskPercent > 35) {
    status = 'At Risk';
    spoilageRisk = 'Yellow';
  }

  let farmerTip = `Storage climate (${temp}°C, ${humidity}% RH) is optimal for ${productName || 'crops'}. Maintain air circulation.`;
  let managerTip = `Batch quality healthy. Standard commercial release schedule applies (${shelfLife} days shelf life remaining).`;

  if (status === 'Critical') {
    farmerTip = `Temperature (${temp}°C) deviates from optimal (${optimalTemp}°C) for ${productName}. Adjust ventilation immediately to prevent mold.`;
    managerTip = `High spoilage risk (${riskPercent}%). Route immediately to local processing or clearance markdown within ${shelfLife} days.`;
  } else if (status === 'At Risk') {
    farmerTip = `Slight climate deviation detected for ${productName}. Monitor humidity levels.`;
    managerTip = `Schedule priority dispatch within ${shelfLife} days.`;
  }

  return {
    shelfLife,
    spoilageRiskPercent: riskPercent,
    spoilageRisk,
    status,
    farmerTip,
    managerTip
  };
};

export const MyProducts = () => {
  const { currentUser, products, addProduct, deleteProduct, storages, bookings, triggerToast } = useContext(AppContext);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  // Farmer specific products (filter by farmerId or farmerName)
  const farmerProducts = (Array.isArray(products) ? products : []).filter(p => 
    p && (
      p.farmerId === currentUser?.id || 
      String(p.farmerId) === String(currentUser?.id) || 
      (p.farmerName && currentUser?.fullName && p.farmerName.toLowerCase() === currentUser.fullName.toLowerCase()) ||
      (p.farmer && currentUser?.fullName && p.farmer.toLowerCase() === currentUser.fullName.toLowerCase()) ||
      (p.farmer && currentUser?.name && p.farmer.toLowerCase() === currentUser.name.toLowerCase())
    )
  );

  // Resolve farmer approved booking & chamber metrics
  const farmerBooking = (Array.isArray(bookings) ? bookings : []).find(b => 
    b && (b.status && (b.status.toLowerCase() === 'approved' || b.status.toLowerCase() === 'active')) &&
    (
      b.farmerId === currentUser?.id || 
      String(b.farmerId) === String(currentUser?.id) || 
      (b.farmerName && currentUser?.fullName && b.farmerName.toLowerCase() === currentUser.fullName.toLowerCase()) ||
      (b.farmerName && currentUser?.name && b.farmerName.toLowerCase() === currentUser.name.toLowerCase())
    )
  );

  const allocatedChamberName = farmerBooking?.chamberName || 'Chamber 1';
  const allocatedStorageName = farmerBooking?.storageName || currentUser?.bookedStorage || storages[0]?.name || 'Cold Storage Facility';
  
  // Total chamber capacity (default 125 Tons per chamber)
  const totalChamberCapacity = farmerBooking?.weight ? (Number(String(farmerBooking.weight).replace(/[^0-9]/g, '')) || 125) : 125;
  const occupiedWeight = farmerProducts.reduce((sum, p) => sum + Number(p.quantity || 0), 0);
  const availableSpace = Math.max(0, totalChamberCapacity - occupiedWeight);

  // Forms state
  const [formData, setFormData] = useState({
    name: '', 
    quantity: '', 
    storage: allocatedStorageName, 
    shelfLife: '', 
    spoilageRisk: 'Green', 
    status: 'Healthy',
    aiPrediction: null
  });

  // Dynamic AI prediction as user types product name
  useEffect(() => {
    if (formData.name && formData.name.trim().length > 1) {
      const pred = predictCropShelfLife(formData.name);
      setFormData(prev => ({
        ...prev,
        shelfLife: String(pred.shelfLife),
        spoilageRisk: pred.spoilageRisk,
        status: pred.status,
        aiPrediction: pred
      }));
    }
  }, [formData.name]);

  const handleOpenAdd = () => {
    setFormData({
      name: '', 
      quantity: '', 
      storage: allocatedStorageName, 
      shelfLife: '', 
      spoilageRisk: 'Green', 
      status: 'Healthy',
      aiPrediction: null
    });
    setIsAddOpen(true);
  };

  const handleOpenView = (prd) => {
    setSelectedProduct(prd);
    setIsViewOpen(true);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.quantity) {
      triggerToast('Validation Error', 'Product name and quantity are required', 'danger');
      return;
    }

    const requestedQty = Number(formData.quantity);

    // STRICT VALIDATION: Check if requested tonnage exceeds remaining available chamber space!
    if (requestedQty > availableSpace) {
      triggerToast('Capacity Limit Exceeded', `Cannot add ${requestedQty} Tons! Chamber remaining available capacity is only ${availableSpace} Tons.`, 'danger');
      return;
    }

    const selectedStorageObj = storages.find(s => s.name === formData.storage) || storages[0];
    const numericStorageId = selectedStorageObj ? (typeof selectedStorageObj.id === 'string' && selectedStorageObj.id.startsWith('STR-') ? Number(selectedStorageObj.id.replace('STR-', '')) : Number(selectedStorageObj.id) || 1) : 1;

    const aiPred = formData.aiPrediction || predictCropShelfLife(formData.name);

    addProduct({
      name: formData.name,
      type: 'Harvest',
      farmerId: currentUser?.id || Date.now(),
      farmerName: currentUser?.fullName || currentUser?.name || 'Farmer Client',
      farmer: currentUser?.fullName || currentUser?.name || 'Farmer Client',
      storageId: numericStorageId,
      storageName: formData.storage || allocatedStorageName,
      storage: formData.storage || allocatedStorageName,
      chamberName: allocatedChamberName,
      quantity: requestedQty,
      shelfLife: Number(aiPred.shelfLife),
      spoilageRisk: aiPred.spoilageRisk,
      status: aiPred.status,
      farmerTip: aiPred.farmerTip,
      managerTip: aiPred.managerTip,
      entryDate: new Date().toISOString().split('T')[0]
    });

    setIsAddOpen(false);
    triggerToast('Harvest Batch Registered', `Stored ${requestedQty} Tons of ${formData.name} in ${allocatedChamberName}.`, 'success');
  };

  const handleDeleteClick = (id) => {
    if (window.confirm('Dispatch product cargo? Stored load will be discharged and removed from inventory.')) {
      deleteProduct(id);
    }
  };

  // Stats
  const totalProducts = farmerProducts.length;
  const healthyCount = farmerProducts.filter(p => p.status === 'Healthy').length;
  const atRiskCount = farmerProducts.filter(p => p.status === 'At Risk' || p.status === 'Critical').length;

  // Table Columns
  const columns = [
    { header: 'Product Name', accessor: 'name', sortable: true },
    { header: 'Quantity (Tons)', accessor: 'quantity', cell: (row) => `${row.quantity} Tons`, sortable: true },
    { header: 'Cold Facility Room', accessor: 'storageName', cell: (row) => row.storageName || row.storage || allocatedStorageName, sortable: true },
    { header: 'Check-In Date', accessor: 'entryDate', cell: (row) => row.entryDate || 'Today', sortable: true },
    { header: 'Est. Shelf Life', accessor: 'shelfLife', cell: (row) => `${row.shelfLife} Days Left`, sortable: true },
    {
      header: 'Spoilage Risk',
      accessor: 'spoilageRisk',
      cell: (row) => {
        const r = row.spoilageRisk ? String(row.spoilageRisk) : 'Green';
        const color = r.includes('Red') ? 'danger' : r.includes('Yellow') ? 'warning' : 'success';
        return <span className={`badge badge-${color}`}>{r}</span>;
      }
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (row) => {
        const badgeColor = row.status === 'Healthy' ? 'success' : row.status === 'At Risk' ? 'warning' : 'danger';
        return (
          <span className={`badge badge-${badgeColor}`}>
            {row.status || 'Healthy'}
          </span>
        );
      },
      sortable: true
    }
  ];

  const isExceeded = Number(formData.quantity) > availableSpace;

  return (
    <div>
      {/* Title */}
      <div className="page-header">
        <div className="page-title-row">
          <div>
            <h1 style={{ margin: 0, fontSize: '1.875rem' }}>My Crop Inventory</h1>
            <p className="page-subtitle">Manage crop harvests stored in <strong>{allocatedStorageName}</strong> ({allocatedChamberName}).</p>
          </div>
          <button className="btn btn-primary" onClick={handleOpenAdd}>
            <Plus size={18} />
            <span>Check-In Harvest Batch</span>
          </button>
        </div>
      </div>

      {/* Chamber Capacity Metrics Banner */}
      <div className="card-section" style={{ marginBottom: '2rem', border: '1px solid var(--primary-color)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Warehouse size={20} style={{ color: 'var(--primary-color)' }} />
            <span>Allocated Chamber Capacity & Live Occupancy Metrics</span>
          </h3>
          <span className="badge badge-primary">{allocatedStorageName} ({allocatedChamberName})</span>
        </div>

        <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', margin: 0 }}>
          <StatCard icon={Warehouse} title="Total Chamber Capacity" value={`${totalChamberCapacity} Tons`} desc="Maximum allocated room" index={0} />
          <StatCard icon={Package} title="Currently Occupied" value={`${occupiedWeight} Tons`} desc={`${totalProducts} Active stored crop batches`} statusColor="primary" index={1} />
          <StatCard icon={CheckCircle2} title="Available Storage Left" value={`${availableSpace} Tons`} desc="Free space remaining" statusColor={availableSpace > 10 ? 'success' : 'warning'} index={2} />
        </div>
      </div>



      {/* Table Section */}
      <div className="card-section">
        <h3 style={{ fontSize: '1.125rem', marginBottom: '1.25rem' }}>Active Stored Inventory Directory ({farmerProducts.length} Lots)</h3>
        <DataTable
          columns={columns}
          data={farmerProducts}
          searchPlaceholder="Search crops, facilities..."
          searchField="name"
          onView={handleOpenView}
          onDelete={(row) => handleDeleteClick(row.id)}
        />
      </div>

      {/* View Modal */}
      <Modal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        title="Stored Crop Batch Specifications & AI Insights"
        footerButtons={<button className="btn btn-secondary" onClick={() => setIsViewOpen(false)}>Close Specifications</button>}
      >
        {selectedProduct && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Cargo Batch ID</span>
                <div style={{ fontWeight: 600 }}>{selectedProduct.id}</div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <span className={`badge badge-${selectedProduct.spoilageRisk?.includes('Red') ? 'danger' : selectedProduct.spoilageRisk?.includes('Yellow') ? 'warning' : 'success'}`}>
                  {selectedProduct.spoilageRisk || 'Green'} Risk
                </span>
                <span className={`badge badge-${selectedProduct.status === 'Healthy' ? 'success' : selectedProduct.status === 'At Risk' ? 'warning' : 'danger'}`}>
                  {selectedProduct.status || 'Healthy'}
                </span>
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Commodity Name</span>
              <div style={{ fontWeight: 700, fontSize: '1.2rem' }}>{selectedProduct.name}</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', backgroundColor: 'var(--border-light)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Coldroom Storage</span>
                <div style={{ fontWeight: 700, color: 'var(--primary-color)' }}>{selectedProduct.storageName || selectedProduct.storage || allocatedStorageName}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Load Weight</span>
                <div style={{ fontWeight: 700 }}>{selectedProduct.quantity} Tons</div>
              </div>
            </div>

            {selectedProduct.farmerTip && (
              <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
                <div style={{ fontWeight: 700, color: '#2563eb', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
                  <Sparkles size={16} />
                  <span>Real-World AI Farmer Action Tip:</span>
                </div>
                <div style={{ fontSize: '0.85rem' }}>{selectedProduct.farmerTip}</div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Add Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Check-In Crop Shipment Batch"
        footerButtons={
          <>
            <button className="btn btn-secondary" onClick={() => setIsAddOpen(false)}>Cancel</button>
            <button 
              className="btn btn-primary" 
              onClick={handleAddSubmit}
              disabled={isExceeded}
            >
              Check-In Lot
            </button>
          </>
        }
      >
        <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Chamber Capacity Information Box */}
          <div style={{ backgroundColor: 'var(--border-light)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <span>Chamber Total Capacity: <strong>{totalChamberCapacity} Tons</strong></span>
              <span>Occupied: <strong>{occupiedWeight} Tons</strong></span>
            </div>
            <div style={{ color: availableSpace > 0 ? 'var(--status-success)' : 'var(--status-danger)', fontWeight: 700 }}>
              Available Storage Space Left: {availableSpace} Tons
            </div>
          </div>

          {/* CAPACITY LIMIT EXCEEDED WARNING ALERT */}
          {isExceeded && (
            <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(239, 68, 68, 0.5)', color: '#dc2626', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertTriangle size={20} />
              <div>
                LIMIT EXCEEDED! Maximum available capacity in this chamber is only {availableSpace} Tons. You cannot store {formData.quantity} Tons.
              </div>
            </div>
          )}

          <FormInput
            label="Commodity / Crop Name"
            id="add-fprd-name"
            name="name"
            placeholder="e.g. Roma Tomatoes, Honeycrisp Apples, Potatoes"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />

          {/* Instant AI Auto-Prediction Result Box */}
          {formData.aiPrediction && (
            <div style={{ 
              backgroundColor: 'rgba(16, 185, 129, 0.08)', 
              padding: '1rem', 
              borderRadius: 'var(--radius-md)', 
              border: '1px solid rgba(16, 185, 129, 0.3)'
            }}>
              <div style={{ fontWeight: 700, color: '#059669', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem' }}>
                <Sparkles size={18} />
                <span>AI Automated Crop Prediction Result:</span>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <div style={{ backgroundColor: 'var(--bg-card)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Est. Shelf Life</span>
                  <div style={{ fontWeight: 700, color: 'var(--primary-color)', fontSize: '1.05rem' }}>{formData.aiPrediction.shelfLife} Days</div>
                </div>

                <div style={{ backgroundColor: 'var(--bg-card)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Spoilage Risk</span>
                  <div>
                    <span className={`badge badge-${formData.aiPrediction.spoilageRisk?.includes('Red') ? 'danger' : formData.aiPrediction.spoilageRisk?.includes('Yellow') ? 'warning' : 'success'}`}>
                      {formData.aiPrediction.spoilageRisk} ({formData.aiPrediction.spoilageRiskPercent}%)
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '0.8125rem', color: 'var(--text-color)', lineHeight: 1.4, fontStyle: 'italic' }}>
                💡 <strong>AI Tip:</strong> {formData.aiPrediction.farmerTip}
              </div>
            </div>
          )}

          <FormInput
            label={`Quantity to Store (Tons) - Max Available: ${availableSpace} T`}
            id="add-fprd-qty"
            name="quantity"
            type="number"
            placeholder={`Enter tonnage (e.g. 10)`}
            value={formData.quantity}
            onChange={(e) => setFormData({...formData, quantity: e.target.value})}
            required
          />

          <FormInput
            label="Allocated Storage Facility Room"
            id="add-fprd-storage"
            name="storage"
            value={formData.storage}
            disabled
          />


        </form>
      </Modal>
    </div>
  );
};
