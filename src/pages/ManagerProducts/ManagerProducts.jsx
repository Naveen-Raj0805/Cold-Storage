import React, { useState } from 'react';
import { Package, Trash2, Edit } from 'lucide-react';
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
import './ManagerProducts.css';

const ManagerProducts = () => {
  const { showToast } = useToast();

  const hubId = 'ST-001';
  const hub = mockStorages.find((s) => s.id === hubId);
  const chamberOptions = hub ? hub.chambers.map((ch) => ({ value: ch.id, label: ch.name })) : [];

  // Filter mock products by this manager's storage facility ST-001
  const initialProducts = mockProducts.filter((p) => p.storageId === hubId);
  const [products, setProducts] = useState(initialProducts);

  // Filter/Search states
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [chamberFilter, setChamberFilter] = useState('');

  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formQuantity, setFormQuantity] = useState('');
  const [formWeight, setFormWeight] = useState('');
  const [formChamber, setFormChamber] = useState('');
  const [formExpiry, setFormExpiry] = useState('');
  const [formStatus, setFormStatus] = useState('Active');

  // Edit Action
  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setFormName(product.name);
    setFormQuantity(product.quantity.toString());
    setFormWeight(product.weight.replace(/[^0-9]/g, '')); // extract number
    setFormChamber(product.chamberId);
    setFormExpiry(product.expiryDate);
    setFormStatus(product.status);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setProducts((prev) =>
      prev.map((p) =>
        p.id === selectedProduct.id
          ? {
              ...p,
              name: formName,
              quantity: parseInt(formQuantity, 10),
              weight: `${parseInt(formWeight, 10).toLocaleString()} kg`,
              chamberId: formChamber,
              expiryDate: formExpiry,
              status: formStatus
            }
          : p
      )
    );
    setIsEditModalOpen(false);
    showToast('Crops record updated successfully.', 'success');
  };

  // Delete Action
  const handleDeleteClick = (product) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    setProducts((prev) => prev.filter((p) => p.id !== selectedProduct.id));
    setIsDeleteDialogOpen(false);
    showToast('Crops batch discharged and removed from logs.', 'success');
  };

  // Filter Logic
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.farmerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter ? p.category === categoryFilter : true;
    const matchesChamber = chamberFilter ? p.chamberId === chamberFilter : true;
    return matchesSearch && matchesCategory && matchesChamber;
  });

  const getChamberName = (id) => {
    const found = hub?.chambers.find((ch) => ch.id === id);
    return found ? found.name : 'Unknown Chamber';
  };

  const headers = [
    { key: 'id', label: 'Batch ID' },
    { key: 'name', label: 'Crops Name', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'weight', label: 'Weight Total' },
    {
      key: 'chamberId',
      label: 'Chilling Chamber',
      render: (val) => getChamberName(val)
    },
    { key: 'farmerName', label: 'Owner Farmer', sortable: true },
    { key: 'expiryDate', label: 'Expiration', sortable: true },
    {
      key: 'status',
      label: 'Status',
      render: (val) => <Badge status={val}>{val}</Badge>
    }
  ];

  return (
    <div className="page-container animate-fade-in">
      <PageHeader
        title="Chamber Space Registry"
        description="Oversee stored farm cargo batches, adjust allocation chambers, and manage load limits."
      />

      {/* Filters row */}
      <div className="products-header-row">
        <div className="products-filters">
          <SearchBar value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search crops or owners..." />
          <Dropdown
            placeholder="All Categories"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            options={[
              { value: 'Fruits', label: 'Fruits' },
              { value: 'Vegetables', label: 'Vegetables' },
              { value: 'Dairy', label: 'Dairy' }
            ]}
          />
          <Dropdown
            placeholder="All Chambers"
            value={chamberFilter}
            onChange={(e) => setChamberFilter(e.target.value)}
            options={chamberOptions}
          />
        </div>
      </div>

      {/* Table */}
      <Table
        headers={headers}
        data={filteredProducts}
        actions={[
          {
            type: 'edit',
            onClick: handleEdit => handleEditClick(handleEdit)
          },
          {
            type: 'delete',
            onClick: handleDelete => handleDeleteClick(handleDelete),
            label: 'Discharge batch'
          }
        ]}
      />

      {/* Modal: Edit product */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Crop Batch Parameters"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleEditSubmit}>
              Apply Changes
            </Button>
          </>
        }
      >
        <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <Input label="Crop Batch Name" name="name" value={formName} onChange={(e) => setFormName(e.target.value)} required />
          <Input label="Bags / Crates Count" name="qty" type="number" value={formQuantity} onChange={(e) => setFormQuantity(e.target.value)} required />
          <Input label="Total Weight (kg)" name="weight" type="number" value={formWeight} onChange={(e) => setFormWeight(e.target.value)} required />
          <Dropdown
            label="Reallocate Chilling Chamber"
            name="chamber"
            value={formChamber}
            onChange={(e) => setFormChamber(e.target.value)}
            options={chamberOptions}
            placeholder=""
          />
          <Input label="Expiration Date" name="expiry" type="date" value={formExpiry} onChange={(e) => setFormExpiry(e.target.value)} required />
          <Dropdown
            label="Crop Status State"
            name="status"
            value={formStatus}
            onChange={(e) => setFormStatus(e.target.value)}
            options={[
              { value: 'Active', label: 'Active' },
              { value: 'Warning', label: 'Warning' }
            ]}
            placeholder=""
          />
        </form>
      </Modal>

      {/* Dialog Confirmation discharge */}
      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Discharge Crop Batch"
        message={`Are you sure you want to discharge ${selectedProduct?.name}? This indicates the cargo has been retrieved by farmer ${selectedProduct?.farmerName} and will clear its slot allocation.`}
      />
    </div>
  );
};

export default ManagerProducts;
