// Mock Data Service for AgriFreeze Cold Storage Monitoring & Management System

// Default Initial Mock Data
const defaultStorageUnits = [
  { id: 'ST-001', name: 'Cold Chamber Alpha', type: 'Deep Freeze', location: 'Zone A - Row 1', currentTemp: -18.2, targetTemp: -18.0, humidity: 85, targetHumidity: 85, capacity: 85, status: 'Optimal', manager: 'Sarah Connor', powerUsage: 120 },
  { id: 'ST-002', name: 'Cold Chamber Beta', type: 'Chilled Storage', location: 'Zone A - Row 2', currentTemp: 4.1, targetTemp: 4.0, humidity: 90, targetHumidity: 90, capacity: 60, status: 'Optimal', manager: 'Unassigned', powerUsage: 75 },
  { id: 'ST-003', name: 'Cool Cell Gamma', type: 'Chilled Storage', location: 'Zone B - Row 1', currentTemp: 5.8, targetTemp: 4.0, humidity: 93, targetHumidity: 90, capacity: 95, status: 'Warning', manager: 'Sarah Connor', powerUsage: 90 },
  { id: 'ST-004', name: 'Deep Vault Delta', type: 'Deep Freeze', location: 'Zone B - Row 2', currentTemp: -24.5, targetTemp: -25.0, humidity: 82, targetHumidity: 80, capacity: 40, status: 'Optimal', manager: 'Robert Patrick', powerUsage: 150 },
  { id: 'ST-005', name: 'Dry Store Epsilon', type: 'Ambient Control', location: 'Zone C - Row 1', currentTemp: 12.5, targetTemp: 12.0, humidity: 55, targetHumidity: 60, capacity: 70, status: 'Optimal', manager: 'Unassigned', powerUsage: 35 },
  { id: 'ST-006', name: 'Cold Cell Zeta', type: 'Deep Freeze', location: 'Zone C - Row 2', currentTemp: -12.0, targetTemp: -18.0, humidity: 96, targetHumidity: 85, capacity: 90, status: 'Critical', manager: 'Robert Patrick', powerUsage: 180 }
];

const defaultProducts = [
  { id: 'PRD-101', name: 'Red Apples', type: 'Fruit', farmer: 'Arthur Dent', storageUnit: 'Cold Chamber Beta', quantity: '12,000 kg', entryDate: '2026-06-15', expiryDate: '2026-10-15', temp: '3.8 °C', humidity: '89%', status: 'Stored' },
  { id: 'PRD-102', name: 'Golden Potatoes', type: 'Tubers', farmer: 'Elrond Halfelven', storageUnit: 'Cool Cell Gamma', quantity: '45,000 kg', entryDate: '2026-05-20', expiryDate: '2026-11-20', temp: '5.2 °C', humidity: '92%', status: 'Stored' },
  { id: 'PRD-103', name: 'Organic Onions', type: 'Vegetable', farmer: 'Bilbo Baggins', storageUnit: 'Dry Store Epsilon', quantity: '8,500 kg', entryDate: '2026-06-01', expiryDate: '2026-09-01', temp: '12.0 °C', humidity: '57%', status: 'Stored' },
  { id: 'PRD-104', name: 'Pacific Salmon', type: 'Seafood', farmer: 'Arthur Dent', storageUnit: 'Deep Vault Delta', quantity: '3,200 kg', entryDate: '2026-06-25', expiryDate: '2026-12-25', temp: '-24.8 °C', humidity: '81%', status: 'Stored' },
  { id: 'PRD-105', name: 'Fresh Milk Crates', type: 'Dairy', farmer: 'Galadriel Lady', storageUnit: 'Cold Chamber Beta', quantity: '2,500 L', entryDate: '2026-06-30', expiryDate: '2026-07-15', temp: '4.0 °C', humidity: '90%', status: 'Stored' },
  { id: 'PRD-106', name: 'Sweet Cherries', type: 'Fruit', farmer: 'Arthur Dent', storageUnit: 'Cold Chamber Beta', quantity: '4,000 kg', entryDate: '2026-06-28', expiryDate: '2026-07-28', temp: '4.2 °C', humidity: '91%', status: 'Stored' }
];

const defaultBookings = [
  { id: 'BK-501', farmerName: 'Arthur Dent', farmName: 'Heart of Gold Farms', cropType: 'Strawberries', quantity: 5000, unitType: 'Chilled Storage', duration: 3, totalCost: 750, requestDate: '2026-07-01', status: 'Pending', assignedUnit: '' },
  { id: 'BK-502', farmerName: 'Bilbo Baggins', farmName: 'Shire Greenhouses', cropType: 'Carrots', quantity: 15000, unitType: 'Chilled Storage', duration: 6, totalCost: 2200, requestDate: '2026-06-28', status: 'Approved', assignedUnit: 'Cool Cell Gamma' },
  { id: 'BK-503', farmerName: 'Elrond Halfelven', farmName: 'Rivendell Orchards', cropType: 'Blueberries', quantity: 2000, unitType: 'Deep Freeze', duration: 2, totalCost: 400, requestDate: '2026-06-25', status: 'Approved', assignedUnit: 'Cold Chamber Alpha' },
  { id: 'BK-504', farmerName: 'Galadriel Lady', farmName: 'Lothlorien Dairy', cropType: 'Cheese Blocks', quantity: 8000, unitType: 'Chilled Storage', duration: 4, totalCost: 1400, requestDate: '2026-06-29', status: 'Pending', assignedUnit: '' }
];

const defaultUsers = [
  { id: 'USR-001', username: 'admin', email: 'admin@agrifreeze.com', role: 'Admin', name: 'Chief Director', status: 'Active', joinDate: '2025-01-10' },
  { id: 'USR-002', username: 'manager1', email: 'sarah.c@agrifreeze.com', role: 'Storage Manager', name: 'Sarah Connor', status: 'Active', facility: 'Alpha & Gamma', joinDate: '2025-03-15' },
  { id: 'USR-003', username: 'manager2', email: 'james.s@agrifreeze.com', role: 'Storage Manager', name: 'James Sterling', status: 'Active', facility: 'Beta & Epsilon', joinDate: '2025-05-02' },
  { id: 'USR-004', username: 'manager3', email: 'robert.p@agrifreeze.com', role: 'Storage Manager', name: 'Robert Patrick', status: 'Suspended', facility: 'Delta & Zeta', joinDate: '2025-08-20' },
  { id: 'USR-005', username: 'farmer1', email: 'arthur.d@farm.com', role: 'Farmer', name: 'Arthur Dent', status: 'Active', farmName: 'Heart of Gold Farms', phone: '+1-555-0199', joinDate: '2026-02-14' },
  { id: 'USR-006', username: 'farmer2', email: 'bilbo.b@shire.com', role: 'Farmer', name: 'Bilbo Baggins', status: 'Active', farmName: 'Shire Greenhouses', phone: '+1-555-0188', joinDate: '2026-03-01' },
  { id: 'USR-007', username: 'farmer3', email: 'elrond.h@imladris.com', role: 'Farmer', name: 'Elrond Halfelven', status: 'Active', farmName: 'Rivendell Orchards', phone: '+1-555-0177', joinDate: '2026-04-10' },
  { id: 'USR-008', username: 'farmer4', email: 'galadriel@lorien.com', role: 'Farmer', name: 'Galadriel Lady', status: 'Pending Approval', farmName: 'Lothlorien Dairy', phone: '+1-555-0166', joinDate: '2026-06-30' }
];

const defaultAlerts = [
  { id: 'ALT-801', facility: 'Cold Cell Zeta', type: 'Temperature Deficit', message: 'Chamber Zeta temperature rose to -12.0°C (Target -18.0°C). Refrigeration failure warning.', time: '2026-07-02 01:10', severity: 'High', acknowledged: false },
  { id: 'ALT-802', facility: 'Cool Cell Gamma', type: 'Humidity Variance', message: 'Cool Cell Gamma humidity reached 93%, exceeding the maximum 90% threshold.', time: '2026-07-02 00:45', severity: 'Medium', acknowledged: false },
  { id: 'ALT-803', facility: 'Deep Vault Delta', type: 'Power Instability', message: 'Backup generator switched on temporarily during a micro-outage in Delta.', time: '2026-07-01 22:15', severity: 'Low', acknowledged: true }
];

const defaultReports = [
  { id: 'REP-001', title: 'Monthly Facility Utilization Report', type: 'Utilization', format: 'PDF', frequency: 'Monthly', recipient: 'admin@agrifreeze.com', lastGenerated: '2026-06-30' },
  { id: 'REP-002', title: 'Weekly Cold Chamber Temperature Log', type: 'Temperature Log', format: 'Excel', frequency: 'Weekly', recipient: 'sarah.c@agrifreeze.com', lastGenerated: '2026-06-28' },
  { id: 'REP-003', title: 'Daily Incident & Compliance Audit', type: 'Audit', format: 'PDF', frequency: 'Daily', recipient: 'admin@agrifreeze.com', lastGenerated: '2026-07-01' }
];

// Historical Analytics Data
const systemAnalytics = {
  occupancyHistory: [
    { name: 'Jan', AdminUnits: 45, ManagerUnits: 50, FarmerUnits: 40 },
    { name: 'Feb', AdminUnits: 50, ManagerUnits: 55, FarmerUnits: 45 },
    { name: 'Mar', AdminUnits: 65, ManagerUnits: 60, FarmerUnits: 52 },
    { name: 'Apr', AdminUnits: 70, ManagerUnits: 65, FarmerUnits: 58 },
    { name: 'May', AdminUnits: 80, ManagerUnits: 72, FarmerUnits: 65 },
    { name: 'Jun', AdminUnits: 85, ManagerUnits: 75, FarmerUnits: 70 },
    { name: 'Jul', AdminUnits: 90, ManagerUnits: 78, FarmerUnits: 72 }
  ],
  powerUsageHistory: [
    { name: 'Mon', usage: 1200, cost: 240 },
    { name: 'Tue', usage: 1250, cost: 250 },
    { name: 'Wed', usage: 1180, cost: 236 },
    { name: 'Thu', usage: 1350, cost: 270 },
    { name: 'Fri', usage: 1400, cost: 280 },
    { name: 'Sat', usage: 1100, cost: 220 },
    { name: 'Sun', usage: 1050, cost: 210 }
  ],
  revenueDistribution: [
    { name: 'Deep Freeze', value: 45000 },
    { name: 'Chilled Storage', value: 35000 },
    { name: 'Ambient Control', value: 15000 }
  ]
};

// LocalStorage Helper functions
const getStoredData = (key, defaultData) => {
  const data = localStorage.getItem(`agrifreeze_${key}`);
  if (!data) {
    localStorage.setItem(`agrifreeze_${key}`, JSON.stringify(defaultData));
    return defaultData;
  }
  return JSON.parse(data);
};

const setStoredData = (key, data) => {
  localStorage.setItem(`agrifreeze_${key}`, JSON.stringify(data));
};

// API Mock Implementations
export const getStorageUnits = () => getStoredData('storageUnits', defaultStorageUnits);
export const saveStorageUnits = (data) => setStoredData('storageUnits', data);

export const getProducts = () => getStoredData('products', defaultProducts);
export const saveProducts = (data) => setStoredData('products', data);

export const getBookings = () => getStoredData('bookings', defaultBookings);
export const saveBookings = (data) => setStoredData('bookings', data);

export const getUsers = () => getStoredData('users', defaultUsers);
export const saveUsers = (data) => setStoredData('users', data);

export const getAlerts = () => getStoredData('alerts', defaultAlerts);
export const saveAlerts = (data) => setStoredData('alerts', data);

export const getReports = () => getStoredData('reports', defaultReports);
export const saveReports = (data) => setStoredData('reports', data);

export const getAnalytics = () => systemAnalytics;

// System Configurations / Settings
const defaultSettings = {
  general: {
    siteName: 'AgriFreeze Control Console',
    refreshInterval: '30 seconds',
    defaultCurrency: 'USD'
  },
  thresholds: {
    deepFreezeMaxTemp: -15.0,
    chilledMaxTemp: 6.0,
    humidityMaxThreshold: 92
  },
  notifications: {
    emailAlerts: true,
    smsAlerts: false,
    systemBannerAlerts: true
  }
};

export const getSettings = () => getStoredData('settings', defaultSettings);
export const saveSettings = (data) => setStoredData('settings', data);
