import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { mockProducts, mockStorages } from '../../data/mockData';
import { useToast } from '../../context/ToastContext';
import PageHeader from '../../components/PageHeader/PageHeader';
import SearchBar from '../../components/SearchBar/SearchBar';
import Dropdown from '../../components/Dropdown/Dropdown';
import Button from '../../components/Button/Button';
import Table from '../../components/Table/Table';
import Badge from '../../components/Badge/Badge';
import Modal from '../../components/Modal/Modal';
import Input from '../../components/Input/Input';
import ConfirmationDialog from '../../components/ConfirmationDialog/ConfirmationDialog';
import '../ManagerProducts/ManagerProducts.css'; // reuse styling

const FarmerProducts = () => {
  const { showToast } = useToast();
  
  const farmerId = 'farmer';
  const myProducts = mockProducts.filter((p) => p.farmerId === farmerId);
  const [products, setProducts] = useState(myProducts);

  // States
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Add form fields
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('Fruits');
  const [formQuantity, setFormQuantity] = useState('');
  const [formWeight, setFormWeight] = useState('');
  const [formStorage, setFormStorage] = useState('ST-001');
  const [formChamber, setFormChamber] = useState('CH-101');
  const [formExpiry, setFormExpiry] = useState('');

  const getChamberName = (p) => {
    const hub = mockStorages.find((s) => s.id === p.storageId);
    const chamber = hub?.chambers.find((ch) => ch.id === p.chamberId);
    return chamber ? chamber.name : 'Allocated Space';
  };

  const getStorageName = (id) => {
    const found = mockStorages.find((s) => s.id === id);
    return found ? found.name : 'Cold Hub';
  };

  const handleRegisterCrop = (e) => {
    e.preventDefault();
    const newId = `P-00${mockProducts.length + products.length + 1}`;
    const newProduct = {
      id: newId,
      name: formName,
      category: formCategory,
      quantity: parseInt(formQuantity, 10),
      weight: `${parseInt(formWeight, 10).toLocaleString()} kg`,
      storageId: formStorage,
      chamberId: formChamber,
      farmerId: farmerId,
      farmerName: 'Sanjay Patel',
      dateStored: new Date().toISOString().split('T')[0],
      expiryDate: formExpiry,
      tempRequired: formCategory === 'Fruits' ? '4°C' : '8°C',
      status: 'Active'
    };

    setProducts((prev) => [...prev, newProduct]);
    setIsAddModalOpen(false);

    // Reset Form
    setFormName('');
    setFormQuantity('');
    setFormWeight('');
    setFormExpiry('');

    showToast('Crop batch logged and registered in chamber.', 'success');
  };

  const handleDeleteClick = (product) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    setProducts((prev) => prev.filter((p) => p.id !== selectedProduct.id));
    setIsDeleteDialogOpen(false);
    showToast('Crop batch discharge requested.', 'success');
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter ? p.category === categoryFilter : true;
    return matchesSearch && matchesCategory;
  });

  const headers = [
    { key: 'id', label: 'Batch ID' },
    { key: 'name', label: 'Crops Stored', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'weight', label: 'Weight (kg)' },
    {
      key: 'storageId',
      label: 'Cold Storage Hub',
      render: (val) => getStorageName(val)
    },
    {
      key: 'chamberId',
      label: 'Allocated Chamber',
      render: (val, row) => getChamberName(row)
    },
    { key: 'dateStored', label: 'Stored Date', sortable: true },
    { key: 'expiryDate', label: 'Expiration', sortable: true },
    {
      key: 'status',
      label: 'Compliance',
      render: (val) => <Badge status={val}>{val}</Badge>
    }
  ];

  return (
    <div className="page-container animate-fade-in">
      <PageHeader
        title="My Crops Storage"
        description="Verify crop storage temperatures, register new batches, and request discharges."
        action={
          <Button variant="primary" onClick={() => setIsAddModalOpen(true)} icon={<Plus size={16} />}>
            Register Crop
          </Button>
        }
      />

      <div className="products-header-row">
        <div className="products-filters">
          <SearchBar value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search crop batch..." />
          <Dropdown
            placeholder="All Categories"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            options={[
              { value: 'Fruits', label: 'Fruits' },
              { value: 'Vegetables', label: 'Vegetables' }
            ]}
          />
        </div>
      </div>

      <Table
        headers={headers}
        data={filteredProducts}
        actions={[
          {
            type: 'delete',
            onClick: handleDelete => handleDeleteClick(handleDelete),
            label: 'Request Discharge'
          }
        ]}
      />

      {/* Modal: Register Crop */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Register Crop Storage Batch"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleRegisterCrop}>
              Log Batch
            </Button>
          </>
        }
      >
        <form onSubmit={handleRegisterCrop} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <Input label="Crop Batch Name" name="name" value={formName} onChange={(e) => setFormName(e.target.value)} required />
          <Dropdown
            label="Crop Category"
            name="category"
            value={formCategory}
            onChange={(e) => setFormCategory(e.target.value)}
            options={[
              { value: 'Fruits', label: 'Fruits' },
              { value: 'Vegetables', label: 'Vegetables' }
            ]}
            placeholder=""
          />
          <Input label="Bags / Crates Count" name="qty" type="number" value={formQuantity} onChange={(e) => setFormQuantity(e.target.value)} required />
          <Input label="Total Weight (kg)" name="weight" type="number" value={formWeight} onChange={(e) => setFormWeight(e.target.value)} required />
          <Dropdown
            label="Storage Hub Facility"
            name="facility"
            value={formStorage}
            onChange={(e) => setFormStorage(e.target.value)}
            options={mockStorages.filter((s) => s.status === 'Active').map((s) => ({ value: s.id, label: s.name }))}
            placeholder=""
          />
          <Dropdown
            label="Allocated Chilling Chamber"
            name="chamber"
            value={formChamber}
            onChange={(e) => setFormChamber(e.target.value)}
            options={[
              { value: 'CH-101', label: 'Chamber A (Fruits)' },
              { value: 'CH-103', label: 'Chamber C (Vegetables)' }
            ]}
            placeholder=""
          />
          <Input label="Expiration Date" name="expiry" type="date" value={formExpiry} onChange={(e) => setFormExpiry(e.target.value)} required />
        </form>
      </Modal>

      {/* Confirmation discharge */}
      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Discharge Cargo Request"
        message={`Are you sure you want to request discharge for ${selectedProduct?.name}? This sends a notification to the hub manager to release your crops.`}
      />
    </div>
  );
};

export default FarmerProducts;
