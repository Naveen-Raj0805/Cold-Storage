export const mockUsers = [
  {
    username: 'admin',
    password: 'password',
    role: 'admin',
    name: 'Sarah Jenkins',
    email: 'admin@gmail.com',
    phone: '+1 (555) 019-2834',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&auto=format&fit=crop'
  },
  {
    username: 'manager',
    password: 'password',
    role: 'manager',
    name: 'Robert Vance',
    email: 'manager@gmail.com',
    phone: '+1 (555) 043-9821',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop',
    storageId: 'ST-001'
  },
  {
    username: 'farmer',
    password: 'password',
    role: 'farmer',
    name: 'Sanjay Patel',
    email: 'farmer@gmail.com',
    phone: '+1 (555) 089-4512',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
    farmName: 'Emerald Valley Farms',
    location: 'Oregon, USA'
  }
];

export const mockManagers = [
  {
    id: 'M-001',
    name: 'Robert Vance',
    email: 'robert.vance@agrifreeze.com',
    phone: '+1 (555) 043-9821',
    storageId: 'ST-001',
    storageName: 'AgriFreeze North Hub',
    status: 'Active',
    experience: '6 Years',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop'
  },
  {
    id: 'M-002',
    name: 'Alice Smith',
    email: 'alice.smith@agrifreeze.com',
    phone: '+1 (555) 021-9988',
    storageId: 'ST-002',
    storageName: 'AgriFreeze West Hub',
    status: 'Active',
    experience: '4 Years',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop'
  },
  {
    id: 'M-003',
    name: 'David Johnson',
    email: 'david.j@agrifreeze.com',
    phone: '+1 (555) 055-1122',
    storageId: 'ST-003',
    storageName: 'AgriFreeze South Facility',
    status: 'Inactive',
    experience: '2 Years',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop'
  }
];

export const mockStorages = [
  {
    id: 'ST-001',
    name: 'AgriFreeze North Hub',
    location: 'Chicago, IL',
    totalCapacity: 5000,
    occupiedCapacity: 3800,
    currentTemp: 4.2,
    targetTemp: 4.0,
    status: 'Active',
    managerId: 'M-001',
    energyUsage: '1,240 kWh / day',
    chambers: [
      { id: 'CH-101', name: 'Chamber A (Fruits)', temp: 4.2, targetTemp: 4.0, capacity: 2000, occupied: 1800, humidity: '90%', type: 'Cold Storage', status: 'Active' },
      { id: 'CH-102', name: 'Chamber B (Deep Freeze)', temp: -18.5, targetTemp: -18.0, capacity: 1500, occupied: 1200, humidity: '75%', type: 'Freezer', status: 'Active' },
      { id: 'CH-103', name: 'Chamber C (Vegetables)', temp: 8.1, targetTemp: 6.0, capacity: 1500, occupied: 800, humidity: '95%', type: 'Chilled Storage', status: 'Warning' }
    ]
  },
  {
    id: 'ST-002',
    name: 'AgriFreeze West Hub',
    location: 'Sacramento, CA',
    totalCapacity: 8000,
    occupiedCapacity: 4500,
    currentTemp: 3.5,
    targetTemp: 3.0,
    status: 'Active',
    managerId: 'M-002',
    energyUsage: '2,100 kWh / day',
    chambers: [
      { id: 'CH-201', name: 'Chamber Alpha (Produce)', temp: 3.5, targetTemp: 3.0, capacity: 4000, occupied: 3000, humidity: '92%', type: 'Cold Storage', status: 'Active' },
      { id: 'CH-202', name: 'Chamber Beta (Dairy/Meat)', temp: -22.0, targetTemp: -20.0, capacity: 4000, occupied: 1500, humidity: '70%', type: 'Freezer', status: 'Active' }
    ]
  },
  {
    id: 'ST-003',
    name: 'AgriFreeze South Facility',
    location: 'Austin, TX',
    totalCapacity: 6000,
    occupiedCapacity: 0,
    currentTemp: 24.0,
    targetTemp: 4.0,
    status: 'Inactive',
    managerId: 'M-003',
    energyUsage: '120 kWh / day (Idle)',
    chambers: []
  }
];

export const mockProducts = [
  {
    id: 'P-001',
    name: 'Organic Honeycrisp Apples',
    category: 'Fruits',
    quantity: 800,
    weight: '8,000 kg',
    storageId: 'ST-001',
    chamberId: 'CH-101',
    farmerId: 'farmer',
    farmerName: 'Sanjay Patel',
    dateStored: '2026-06-15',
    expiryDate: '2026-09-15',
    tempRequired: '4°C',
    status: 'Active'
  },
  {
    id: 'P-002',
    name: 'Russet Baking Potatoes',
    category: 'Vegetables',
    quantity: 1000,
    weight: '10,000 kg',
    storageId: 'ST-001',
    chamberId: 'CH-103',
    farmerId: 'farmer',
    farmerName: 'Sanjay Patel',
    dateStored: '2026-06-20',
    expiryDate: '2026-10-20',
    tempRequired: '6°C',
    status: 'Warning'
  },
  {
    id: 'P-003',
    name: 'Frozen Wild Blueberries',
    category: 'Fruits',
    quantity: 1200,
    weight: '6,000 kg',
    storageId: 'ST-001',
    chamberId: 'CH-102',
    farmerId: 'farmer',
    farmerName: 'Sanjay Patel',
    dateStored: '2026-06-10',
    expiryDate: '2027-06-10',
    tempRequired: '-18°C',
    status: 'Active'
  },
  {
    id: 'P-004',
    name: 'Salted Pasture Butter',
    category: 'Dairy',
    quantity: 1500,
    weight: '7,500 kg',
    storageId: 'ST-002',
    chamberId: 'CH-202',
    farmerId: 'farmer2',
    farmerName: 'Diana Cooper',
    dateStored: '2026-06-22',
    expiryDate: '2026-12-22',
    tempRequired: '-20°C',
    status: 'Active'
  },
  {
    id: 'P-005',
    name: 'Fresh Iceberg Lettuce',
    category: 'Vegetables',
    quantity: 500,
    weight: '1,500 kg',
    storageId: 'ST-002',
    chamberId: 'CH-201',
    farmerId: 'farmer2',
    farmerName: 'Diana Cooper',
    dateStored: '2026-06-28',
    expiryDate: '2026-07-28',
    tempRequired: '3°C',
    status: 'Active'
  }
];

export const mockBookings = [
  {
    id: 'B-001',
    farmerId: 'farmer',
    farmerName: 'Sanjay Patel',
    storageId: 'ST-001',
    storageName: 'AgriFreeze North Hub',
    chamberId: 'CH-101',
    chamberName: 'Chamber A (Fruits)',
    category: 'Fruits',
    weight: '5,000 kg',
    startDate: '2026-07-10',
    endDate: '2026-10-10',
    price: '$1,200',
    status: 'Approved'
  },
  {
    id: 'B-002',
    farmerId: 'farmer',
    farmerName: 'Sanjay Patel',
    storageId: 'ST-002',
    storageName: 'AgriFreeze West Hub',
    chamberId: 'CH-201',
    chamberName: 'Chamber Alpha (Produce)',
    category: 'Vegetables',
    weight: '3,000 kg',
    startDate: '2026-07-15',
    endDate: '2026-09-15',
    price: '$900',
    status: 'Pending'
  },
  {
    id: 'B-003',
    farmerId: 'farmer',
    farmerName: 'Sanjay Patel',
    storageId: 'ST-001',
    storageName: 'AgriFreeze North Hub',
    chamberId: 'CH-102',
    chamberName: 'Chamber B (Deep Freeze)',
    category: 'Fruits',
    weight: '2,000 kg',
    startDate: '2026-07-05',
    endDate: '2026-08-05',
    price: '$600',
    status: 'Rejected'
  }
];

export const mockNotifications = [
  {
    id: 'N-001',
    title: 'Temperature Normalised',
    message: 'Chamber C (Vegetables) temperature is back to safe levels (6.2°C).',
    type: 'Success',
    date: '2026-07-01 18:30',
    read: false,
    role: 'manager'
  },
  {
    id: 'N-002',
    title: 'New Storage Request',
    message: 'Farmer Sanjay Patel has requested a slot for 3,000kg of Vegetables.',
    type: 'Info',
    date: '2026-07-01 14:15',
    read: false,
    role: 'manager'
  },
  {
    id: 'N-003',
    title: 'Chamber C Temperature Critical',
    message: 'Chamber C temperature is at 8.1°C (Target is 6.0°C). Air flow restriction detected.',
    type: 'Critical',
    date: '2026-07-01 12:00',
    read: true,
    role: 'manager'
  },
  {
    id: 'N-004',
    title: 'Booking Request Approved',
    message: 'Your booking request B-001 has been approved by AgriFreeze North Hub.',
    type: 'Success',
    date: '2026-07-01 10:00',
    read: false,
    role: 'farmer'
  },
  {
    id: 'N-005',
    title: 'Monthly Storage Fee Due',
    message: 'Invoice for booking B-001 is ready for payment.',
    type: 'Warning',
    date: '2026-06-29 09:00',
    read: true,
    role: 'farmer'
  },
  {
    id: 'N-006',
    title: 'System Server Maintenance',
    message: 'AgriFreeze software update scheduled for Sunday at 02:00 UTC.',
    type: 'Info',
    date: '2026-06-28 15:30',
    read: true,
    role: 'admin'
  },
  {
    id: 'N-007',
    title: 'West Hub Compressor Upgrade',
    message: 'West Hub Compressor #2 will be offline for maintenance on July 4th.',
    type: 'Warning',
    date: '2026-07-01 09:00',
    read: false,
    role: 'admin'
  }
];

export const mockReports = [
  {
    id: 'R-001',
    name: 'Q2 Capacity & Storage Efficiency Report',
    date: '2026-06-30',
    type: 'PDF',
    size: '2.4 MB',
    status: 'Resolved'
  },
  {
    id: 'R-002',
    name: 'June Temperature Compliance Log',
    date: '2026-06-30',
    type: 'CSV',
    size: '840 KB',
    status: 'Resolved'
  },
  {
    id: 'R-003',
    name: 'Farmer Invoicing Summary - Midyear',
    date: '2026-06-25',
    type: 'Excel',
    size: '1.2 MB',
    status: 'Resolved'
  },
  {
    id: 'R-004',
    name: 'Chamber Thermal Performance Audit',
    date: '2026-06-18',
    type: 'PDF',
    size: '3.1 MB',
    status: 'Resolved'
  }
];

export const mockAlerts = [
  {
    id: 'A-001',
    source: 'Chamber C (Vegetables) - North Hub',
    message: 'Temperature elevated to 8.1°C. Target is 6.0°C.',
    severity: 'Critical',
    status: 'Active',
    time: '12:00 PM'
  },
  {
    id: 'A-002',
    source: 'Chamber Alpha (Produce) - West Hub',
    message: 'Humidity exceeds nominal parameters: 92% RH.',
    severity: 'Warning',
    status: 'Active',
    time: '02:30 PM'
  },
  {
    id: 'A-003',
    source: 'Primary Power Line - North Hub',
    message: 'Switchover to backup energy source occurred briefly.',
    severity: 'Warning',
    status: 'Resolved',
    time: '10:15 AM'
  }
];

export const mockAnalytics = {
  occupancyTrends: [
    { month: 'Jan', occupied: 3200, total: 19000 },
    { month: 'Feb', occupied: 4500, total: 19000 },
    { month: 'Mar', occupied: 5800, total: 19000 },
    { month: 'Apr', occupied: 7200, total: 19000 },
    { month: 'May', occupied: 8100, total: 19000 },
    { month: 'Jun', occupied: 8300, total: 19000 }
  ],
  energyUsage: [
    { day: 'Mon', consumption: 3240, cost: 324 },
    { day: 'Tue', consumption: 3180, cost: 318 },
    { day: 'Wed', consumption: 3460, cost: 346 },
    { day: 'Thu', consumption: 3020, cost: 302 },
    { day: 'Fri', consumption: 3510, cost: 351 },
    { day: 'Sat', consumption: 2890, cost: 289 },
    { day: 'Sun', consumption: 2640, cost: 264 }
  ],
  revenueByHub: [
    { name: 'North Hub', value: 45200 },
    { name: 'West Hub', value: 38400 },
    { name: 'South Facility', value: 8900 }
  ],
  temperatureHistory: [
    { time: '00:00', chamberA: 4.0, chamberB: -18.0, chamberC: 6.0 },
    { time: '04:00', chamberA: 4.1, chamberB: -18.1, chamberC: 6.2 },
    { time: '08:00', chamberA: 4.2, chamberB: -17.8, chamberC: 7.0 },
    { time: '12:00', chamberA: 4.2, chamberB: -10.0, chamberC: 8.1 },
    { time: '16:00', chamberA: 4.1, chamberB: -12.0, chamberC: 7.9 },
    { time: '20:00', chamberA: 4.0, chamberB: -16.5, chamberC: 6.8 },
    { time: '24:00', chamberA: 4.0, chamberB: -18.0, chamberC: 6.2 }
  ]
};
