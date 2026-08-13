import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { Package, Plus, ArrowDownToLine } from 'lucide-react';
import { StatCard, DataTable, Modal, FormInput, FormSelect } from '../../components/UI';

export const ProductManagement = () => {
  const { 
    products, addProduct, editProduct, deleteProduct, 
    storages, users, triggerToast 
  } = useContext(AppContext);

  // Filters state
  const [riskFilter, setRiskFilter] = useState('All');
  const [downloading, setDownloading] = useState(false);

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Forms state
  const [formData, setFormData] = useState({
    name: '', farmer: '', quantity: '', storage: '', entryDate: '', shelfLife: '', spoilageRisk: 'Green', status: 'Healthy'
  });

  // Calculate statistics
  const totalProducts = products.length;
  const healthyCount = products.filter(p => p.status === 'Healthy').length;
  const atRiskCount = products.filter(p => p.status === 'At Risk').length;
  const criticalCount = products.filter(p => p.status === 'Critical').length;

  // Handlers
  const handleOpenAdd = () => {
    setFormData({
      name: '', 
      farmer: users[0]?.name || 'Rahul Kumar', 
      quantity: '', 
      storage: storages[0]?.name || 'AgriFreeze Coldroom Alpha', 
      entryDate: new Date().toISOString().split('T')[0], 
      shelfLife: '', 
      spoilageRisk: 'Green', 
      status: 'Healthy'
    });
    setIsAddOpen(true);
  };

  const handleOpenEdit = (prd) => {
    setSelectedProduct(prd);
    setFormData({
      name: prd.name,
      farmer: prd.farmer,
      quantity: prd.quantity,
      storage: prd.storage,
      entryDate: prd.entryDate,
      shelfLife: prd.shelfLife,
      spoilageRisk: prd.spoilageRisk,
      status: prd.status
    });
    setIsEditOpen(true);
  };

  const handleOpenView = (prd) => {
    setSelectedProduct(prd);
    setIsViewOpen(true);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.quantity || !formData.shelfLife) {
      triggerToast('Validation Error', 'All fields are required', 'danger');
      return;
    }
    const farmerUser = users.find(u => u.name === formData.farmer || u.fullName === formData.farmer) || users[0];
    const selectedStorageObj = storages.find(s => s.name === formData.storage) || storages[0];
    const numericStorageId = selectedStorageObj ? (typeof selectedStorageObj.id === 'string' && selectedStorageObj.id.startsWith('STR-') ? Number(selectedStorageObj.id.replace('STR-', '')) : Number(selectedStorageObj.id) || 1) : 1;

    addProduct({
      name: formData.name,
      type: formData.type || 'General',
      farmerId: farmerUser ? farmerUser.id : 1,
      farmerName: formData.farmer || farmerUser?.fullName || farmerUser?.name || 'Farmer',
      storageId: numericStorageId,
      storageName: formData.storage || selectedStorageObj?.name || 'AgriFreeze Coldroom Alpha',
      quantity: Number(formData.quantity),
      shelfLife: Number(formData.shelfLife),
      spoilageRisk: formData.spoilageRisk || 'Low',
      status: formData.status || 'Healthy',
      entryDate: formData.entryDate || new Date().toISOString().split('T')[0]
    });
    setIsAddOpen(false);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.quantity || !formData.shelfLife) {
      triggerToast('Validation Error', 'All fields are required', 'danger');
      return;
    }
    const farmerUser = users.find(u => u.name === formData.farmer || u.fullName === formData.farmer);
    const selectedStorageObj = storages.find(s => s.name === formData.storage);
    const numericStorageId = selectedStorageObj ? (typeof selectedStorageObj.id === 'string' && selectedStorageObj.id.startsWith('STR-') ? Number(selectedStorageObj.id.replace('STR-', '')) : Number(selectedStorageObj.id)) : undefined;

    editProduct(selectedProduct.id, {
      name: formData.name,
      type: formData.type,
      farmerId: farmerUser ? farmerUser.id : selectedProduct?.farmerId,
      farmerName: formData.farmer,
      storageId: numericStorageId || selectedProduct?.storageId,
      storageName: formData.storage,
      quantity: Number(formData.quantity),
      entryDate: formData.entryDate,
      shelfLife: Number(formData.shelfLife),
      spoilageRisk: formData.spoilageRisk,
      status: formData.status
    });
    setIsEditOpen(false);
  };

  const handleDeleteClick = (id) => {
    if (window.confirm('Dispatch product? Stored cargo will be loaded and removed from facility inventory.')) {
      deleteProduct(id);
    }
  };

  const handleExportCSV = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      triggerToast(
        'CSV Exported',
        'agrifreeze_inventory_sheet.csv has been downloaded.',
        'success'
      );
    }, 1200);
  };

  // Table Columns
  const columns = [
    { header: 'Product Name', accessor: 'name', sortable: true },
    { header: 'Farmer/Owner', accessor: 'farmer', sortable: true },
    { header: 'Quantity (Tons)', accessor: 'quantity', sortable: true },
    { header: 'Cold Facility', accessor: 'storage', sortable: true },
    { header: 'Entry Date', accessor: 'entryDate', sortable: true },
    { header: 'Shelf Life (Days)', accessor: 'shelfLife', cell: (row) => `${row.shelfLife} Days`, sortable: true },
    { 
      header: 'Spoilage Risk', 
      accessor: 'spoilageRisk', 
      cell: (row) => {
        const badgeColor = row.spoilageRisk === 'Red' ? 'danger' : row.spoilageRisk === 'Yellow' ? 'warning' : 'success';
        return (
          <span className={`badge badge-${badgeColor}`} style={{ textTransform: 'uppercase', fontSize: '0.7rem' }}>
            {row.spoilageRisk} Risk
          </span>
        );
      },
      sortable: true
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (row) => {
        const badgeColor = row.status === 'Healthy' ? 'success' : row.status === 'At Risk' ? 'warning' : 'danger';
        return (
          <span className={`badge badge-${badgeColor}`}>
            {row.status}
          </span>
        );
      },
      sortable: true
    }
  ];

  return (
    <div>
      {/* Page Title */}
      <div className="page-header">
        <div className="page-title-row">
          <div>
            <h1 style={{ margin: 0, fontSize: '1.875rem' }}>Product Management</h1>
            <p className="page-subtitle">Track, audit, and log stored agricultural inventory.</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-secondary" onClick={handleExportCSV} disabled={downloading}>
              <ArrowDownToLine size={16} />
              <span>{downloading ? 'Exporting...' : 'Export Inventory'}</span>
            </button>
            <button className="btn btn-primary" onClick={handleOpenAdd}>
              <Plus size={18} />
              <span>Add Cargo Lot</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <StatCard icon={Package} title="Total Products" value={totalProducts} desc="Active cargo lots" />
        <StatCard icon={Package} title="Healthy" value={healthyCount} desc="Safe conditions" statusColor="success" />
        <StatCard icon={Package} title="At Risk" value={atRiskCount} desc="Nearing expiry threshold" statusColor="warning" />
        <StatCard icon={Package} title="Critical Status" value={criticalCount} desc="Needs immediate dispatch" statusColor="danger" />
      </div>

      {/* Table Section */}
      <div className="card-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.125rem' }}>Warehouse Inventory Records</h3>
          
          <div style={{ display: 'flex', gap: '0.25rem', backgroundColor: 'var(--border-light)', padding: '0.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            {['All', 'Healthy', 'At Risk', 'Critical'].map((st) => (
              <button
                key={st}
                className="btn"
                style={{
                  padding: '0.35rem 0.85rem',
                  fontSize: '0.8125rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: (riskFilter === 'All' && st === 'All') || riskFilter === st ? 'var(--bg-card)' : 'transparent',
                  color: (riskFilter === 'All' && st === 'All') || riskFilter === st ? 'var(--primary-color)' : 'var(--text-muted)',
                  border: 'none',
                  boxShadow: (riskFilter === 'All' && st === 'All') || riskFilter === st ? 'var(--shadow-sm)' : 'none',
                  cursor: 'pointer'
                }}
                onClick={() => setRiskFilter(st)}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <DataTable
          columns={columns}
          data={products}
          searchPlaceholder="Search product name, farmer, storage room..."
          searchField="name"
          filterKey="status"
          filterValue={riskFilter}
          onView={handleOpenView}
          onEdit={handleOpenEdit}
          onDelete={(row) => handleDeleteClick(row.id)}
        />
      </div>

      {/* View Modal */}
      <Modal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        title="Cargo Shipment Ledger"
        footerButtons={<button className="btn btn-secondary" onClick={() => setIsViewOpen(false)}>Close Ledger</button>}
      >
        {selectedProduct && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Shipment ID</span>
                <div style={{ fontWeight: 600 }}>{selectedProduct.id}</div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <span className={`badge badge-${selectedProduct.spoilageRisk === 'Red' ? 'danger' : selectedProduct.spoilageRisk === 'Yellow' ? 'warning' : 'success'}`}>
                  {selectedProduct.spoilageRisk} Spoilage Risk
                </span>
                <span className={`badge badge-${selectedProduct.status === 'Healthy' ? 'success' : selectedProduct.status === 'At Risk' ? 'warning' : 'danger'}`}>
                  {selectedProduct.status}
                </span>
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Cargo Commodity</span>
              <div style={{ fontWeight: 700, fontSize: '1.15rem' }}>{selectedProduct.name}</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Farmer / Owner</span>
                <div style={{ fontWeight: 600 }}>{selectedProduct.farmer}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Quantity</span>
                <div style={{ fontWeight: 600 }}>{selectedProduct.quantity} Tons</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', backgroundColor: 'var(--border-light)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Stored Coldroom</span>
                <div style={{ fontWeight: 700, color: 'var(--primary-color)' }}>{selectedProduct.storage}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Est. Shelf Life</span>
                <div style={{ fontWeight: 700 }}>{selectedProduct.shelfLife} Days Left</div>
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Storage Placement Date</span>
              <div>{selectedProduct.entryDate}</div>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Log Cold Storage Cargo"
        footerButtons={
          <>
            <button className="btn btn-secondary" onClick={() => setIsAddOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleAddSubmit}>Check-In Cargo</button>
          </>
        }
      >
        <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <FormInput
            label="Commodity Name"
            id="add-prd-name"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
          <FormSelect
            label="Farmer Owner"
            id="add-prd-farmer"
            name="farmer"
            value={formData.farmer}
            onChange={(e) => setFormData({...formData, farmer: e.target.value})}
            options={users.map(u => ({ label: u.name, value: u.name }))}
          />
          <FormInput
            label="Quantity (in Tons)"
            id="add-prd-qty"
            name="quantity"
            type="number"
            value={formData.quantity}
            onChange={(e) => setFormData({...formData, quantity: e.target.value})}
            required
          />
          <FormSelect
            label="Storage Coldroom"
            id="add-prd-storage"
            name="storage"
            value={formData.storage}
            onChange={(e) => setFormData({...formData, storage: e.target.value})}
            options={storages.map(s => ({ label: s.name, value: s.name }))}
          />
          <FormInput
            label="Shelf Life (Days)"
            id="add-prd-shelflife"
            name="shelfLife"
            type="number"
            value={formData.shelfLife}
            onChange={(e) => setFormData({...formData, shelfLife: e.target.value})}
            required
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <FormSelect
              label="Spoilage Risk Score"
              id="add-prd-risk"
              name="spoilageRisk"
              value={formData.spoilageRisk}
              onChange={(e) => setFormData({...formData, spoilageRisk: e.target.value})}
              options={[
                { label: 'Green (Low)', value: 'Green' },
                { label: 'Yellow (Moderate)', value: 'Yellow' },
                { label: 'Red (Critical)', value: 'Red' }
              ]}
            />
            <FormSelect
              label="Overall Status"
              id="add-prd-status"
              name="status"
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              options={[
                { label: 'Healthy', value: 'Healthy' },
                { label: 'At Risk', value: 'At Risk' },
                { label: 'Critical', value: 'Critical' }
              ]}
            />
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Modify Inventory Lot"
        footerButtons={
          <>
            <button className="btn btn-secondary" onClick={() => setIsEditOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleEditSubmit}>Save Changes</button>
          </>
        }
      >
        <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <FormInput
            label="Commodity Name"
            id="edit-prd-name"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
          <FormSelect
            label="Farmer Owner"
            id="edit-prd-farmer"
            name="farmer"
            value={formData.farmer}
            onChange={(e) => setFormData({...formData, farmer: e.target.value})}
            options={users.map(u => ({ label: u.name, value: u.name }))}
          />
          <FormInput
            label="Quantity (in Tons)"
            id="edit-prd-qty"
            name="quantity"
            type="number"
            value={formData.quantity}
            onChange={(e) => setFormData({...formData, quantity: e.target.value})}
            required
          />
          <FormSelect
            label="Storage Coldroom"
            id="edit-prd-storage"
            name="storage"
            value={formData.storage}
            onChange={(e) => setFormData({...formData, storage: e.target.value})}
            options={storages.map(s => ({ label: s.name, value: s.name }))}
          />
          <FormInput
            label="Shelf Life (Days)"
            id="edit-prd-shelflife"
            name="shelfLife"
            type="number"
            value={formData.shelfLife}
            onChange={(e) => setFormData({...formData, shelfLife: e.target.value})}
            required
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <FormSelect
              label="Spoilage Risk Score"
              id="edit-prd-risk"
              name="spoilageRisk"
              value={formData.spoilageRisk}
              onChange={(e) => setFormData({...formData, spoilageRisk: e.target.value})}
              options={[
                { label: 'Green (Low)', value: 'Green' },
                { label: 'Yellow (Moderate)', value: 'Yellow' },
                { label: 'Red (Critical)', value: 'Red' }
              ]}
            />
            <FormSelect
              label="Overall Status"
              id="edit-prd-status"
              name="status"
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              options={[
                { label: 'Healthy', value: 'Healthy' },
                { label: 'At Risk', value: 'At Risk' },
                { label: 'Critical', value: 'Critical' }
              ]}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
