import React, { useState, useEffect } from 'react';
import { Plus, Search, Calendar, Package, LogOut, Trash2 } from 'lucide-react';
import DataTable from '../../components/DataTable/DataTable';
import Badge from '../../components/Badge/Badge';
import Button from '../../components/Button/Button';
import Modal from '../../components/Modal/Modal';
import { getProducts, saveProducts, getStorageUnits, getUsers } from '../../services/mockData';

const ManagerProducts = () => {
  const [products, setProducts] = useState([]);
  const [units, setUnits] = useState([]);
  const [farmers, setFarmers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [type, setType] = useState('Fruit');
  const [farmer, setFarmer] = useState('');
  const [storageUnit, setStorageUnit] = useState('');
  const [quantity, setQuantity] = useState('');
  const [expiryDate, setExpiryDate] = useState('');

  useEffect(() => {
    // Filter products for chambers managed by 'Sarah Connor' (Alpha & Gamma)
    const managedChambers = getStorageUnits()
      .filter(u => u.manager === 'Sarah Connor')
      .map(u => u.name);
    setUnits(getStorageUnits().filter(u => u.manager === 'Sarah Connor'));

    const allProds = getProducts();
    setProducts(allProds.filter(p => managedChambers.includes(p.storageUnit)));

    const allUsers = getUsers();
    const activeFarmers = allUsers.filter(u => u.role === 'Farmer');
    setFarmers(activeFarmers);
    
    if (activeFarmers.length > 0) setFarmer(activeFarmers[0].name);
    const managedUnits = getStorageUnits().filter(u => u.manager === 'Sarah Connor');
    if (managedUnits.length > 0) setStorageUnit(managedUnits[0].name);
  }, []);

  const handleCheckInSubmit = (e) => {
    e.preventDefault();
    
    const newProd = {
      id: `PRD-${Math.floor(100 + Math.random() * 900)}`,
      name,
      type,
      farmer,
      storageUnit,
      quantity,
      entryDate: new Date().toISOString().split('T')[0],
      expiryDate,
      temp: storageUnit.includes('Alpha') ? '-18.2 °C' : '5.8 °C',
      humidity: storageUnit.includes('Alpha') ? '85%' : '93%',
      status: 'Stored'
    };

    const updated = [newProd, ...getProducts()];
    // Save to global storage
    saveProducts(updated);

    // Refresh local list
    const managedNames = getStorageUnits()
      .filter(u => u.manager === 'Sarah Connor')
      .map(u => u.name);
    setProducts(updated.filter(p => managedNames.includes(p.storageUnit)));
    
    setIsModalOpen(false);
    // Clear forms
    setName('');
    setQuantity('');
    setExpiryDate('');
  };

  const handleDispatchProduct = (prodId) => {
    if (window.confirm('Are you sure you want to dispatch this product from cold storage?')) {
      const allProds = getProducts();
      // To simulate, let's mark it as Dispatched, or delete it
      const updated = allProds.filter(p => p.id !== prodId);
      saveProducts(updated);

      const managedNames = getStorageUnits()
        .filter(u => u.manager === 'Sarah Connor')
        .map(u => u.name);
      setProducts(updated.filter(p => managedNames.includes(p.storageUnit)));
    }
  };

  const columns = [
    { header: 'ID', accessor: 'id' },
    { 
      header: 'Crop Name', 
      accessor: 'name',
      render: (val) => <span className="text-semibold">{val}</span>
    },
    { header: 'Crop Category', accessor: 'type' },
    { header: 'Farmer Client', accessor: 'farmer' },
    { header: 'Leased Room', accessor: 'storageUnit' },
    { header: 'Quantity Stored', accessor: 'quantity' },
    { header: 'Lease Entry', accessor: 'entryDate' },
    { header: 'Lease Expiry', accessor: 'expiryDate' },
    { 
      header: 'Operational Status', 
      accessor: 'status',
      render: (val) => <Badge status={val} />
    },
    {
      header: 'Actions',
      accessor: 'id',
      align: 'right',
      render: (id, row) => (
        <div className="d-flex gap-xs justify-center">
          <Button 
            variant="outline" 
            size="small" 
            icon={LogOut}
            onClick={() => handleDispatchProduct(id)}
          >
            Dispatch Crop
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="d-flex flex-column gap-lg">
      <div className="d-flex align-center justify-between flex-wrap gap-md">
        <div>
          <h2 className="text-bold" style={{ fontSize: '22px' }}>Inventory Check-In Registry</h2>
          <p className="text-secondary-color" style={{ fontSize: '14px' }}>
            Check-in newly arrived crop shipments and track expiration logs
          </p>
        </div>
        <Button variant="primary" icon={Plus} onClick={() => setIsModalOpen(true)}>
          New Check-In
        </Button>
      </div>

      {/* Control bar */}
      <div className="d-flex align-center justify-between">
        <div className="navbar-search-container m-0" style={{ width: '320px', backgroundColor: 'var(--white)' }}>
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search crop name..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="navbar-search-input"
          />
        </div>
      </div>

      <DataTable 
        columns={columns}
        data={products}
        searchQuery={searchQuery}
        searchKeys={['name', 'type', 'farmer', 'storageUnit']}
        itemsPerPage={10}
      />

      {/* Check In Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Check-In Crop Lease Shipment"
        footerActions={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCheckInSubmit}>
              Register Check-In
            </Button>
          </>
        }
      >
        <form onSubmit={handleCheckInSubmit} className="d-flex flex-column gap-md">
          <div className="form-group">
            <label htmlFor="crop-name">Crop Name</label>
            <input 
              id="crop-name"
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="e.g. Red Grapes" 
              required
              className="login-input"
              style={{ paddingLeft: '14px', height: '42px' }}
            />
          </div>

          <div className="d-grid grid-cols-2 gap-md">
            <div className="form-group">
              <label htmlFor="crop-category">Crop Category</label>
              <select 
                id="crop-category"
                value={type} 
                onChange={(e) => setType(e.target.value)}
                className="login-select"
                style={{ paddingLeft: '14px', height: '42px' }}
              >
                <option value="Fruit">Fruit</option>
                <option value="Vegetable">Vegetable</option>
                <option value="Seafood">Seafood</option>
                <option value="Dairy">Dairy</option>
                <option value="Tubers">Tubers</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="farmer-client">Farmer / Client</label>
              <select 
                id="farmer-client"
                value={farmer} 
                onChange={(e) => setFarmer(e.target.value)}
                className="login-select"
                style={{ paddingLeft: '14px', height: '42px' }}
              >
                {farmers.map(f => (
                  <option key={f.id} value={f.name}>{f.name} ({f.farmName})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="d-grid grid-cols-2 gap-md">
            <div className="form-group">
              <label htmlFor="rent-chambers">Destination Chamber</label>
              <select 
                id="rent-chambers"
                value={storageUnit} 
                onChange={(e) => setStorageUnit(e.target.value)}
                className="login-select"
                style={{ paddingLeft: '14px', height: '42px' }}
              >
                {units.map(u => (
                  <option key={u.id} value={u.name}>{u.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="crop-vol">Volume (e.g. 5,000 kg)</label>
              <input 
                id="crop-vol"
                type="text" 
                value={quantity} 
                onChange={(e) => setQuantity(e.target.value)} 
                placeholder="e.g. 10,000 kg" 
                required
                className="login-input"
                style={{ paddingLeft: '14px', height: '42px' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="exp-date">Expiration Date Lease</label>
            <input 
              id="exp-date"
              type="date" 
              value={expiryDate} 
              onChange={(e) => setExpiryDate(e.target.value)} 
              required
              className="login-input"
              style={{ paddingLeft: '14px', height: '42px' }}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManagerProducts;
