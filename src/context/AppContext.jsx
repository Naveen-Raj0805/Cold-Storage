import React, { createContext, useState, useEffect } from 'react';
import { 
  getUsers as getUsersApi, 
  register as registerApi, 
  updateUser as updateUserApi, 
  deleteUser as deleteUserApi,
  getStorages as getStoragesApi,
  createStorage as createStorageApi,
  updateStorage as updateStorageApi,
  deleteStorage as deleteStorageApi,
  getProducts as getProductsApi,
  createProduct as createProductApi,
  updateProduct as updateProductApi,
  deleteProduct as deleteProductApi,
  getBookings as getBookingsApi,
  createBooking as createBookingApi,
  updateBookingStatus as updateBookingStatusApi,
  getChambersByStorage as getChambersByStorageApi,
  getAlerts as getAlertsApi,
  getNotifications as getNotificationsApi
} from '../services/api';
import { generateEventNotifications } from '../services/notificationService';

import { translations } from '../utils/translations';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Theme State
  const [theme, setTheme] = useState(() => localStorage.getItem('agrifreeze-theme') || 'light');
  
  // Language State (en, es, fr, hi, ta)
  const [language, setLanguage] = useState(() => localStorage.getItem('agrifreeze-language') || 'en');

  useEffect(() => {
    localStorage.setItem('agrifreeze-language', language);
  }, [language]);

  const t = (key) => {
    const langDict = translations[language] || translations['en'];
    return langDict[key] || translations['en'][key] || key;
  };

  // Active User session
  const [currentUser, setCurrentUser] = useState(() => {
    localStorage.removeItem('agrifreeze-user');
    const saved = sessionStorage.getItem('agrifreeze-user');
    return saved ? JSON.parse(saved) : null;
  });

  // Dynamic Database States
  const [storages, setStorages] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [toasts, setToasts] = useState([]);

  // Fetch Storages from MySQL Backend
  const refreshStorages = async () => {
    try {
      const backendStorages = await getStoragesApi();
      const mappedStorages = backendStorages.map(s => ({
        id: `STR-${String(s.id).padStart(3, '0')}`,
        numericId: s.id,
        name: s.name,
        capacity: s.capacity,
        occupied: s.occupied || 0,
        location: s.location,
        manager: s.manager || 'Unassigned',
        status: s.status === 'INACTIVE' ? 'Inactive' : 'Active',
        temp: s.temp || 4.0,
        humidity: s.humidity || 80.0,
        door: s.door || 'Closed',
        power: s.power || 'Grid',
        efficiency: s.efficiency || 90
      }));
      setStorages(mappedStorages);
    } catch (e) {
      console.warn("Failed to fetch storages from backend", e);
    }
  };

  // Fetch Users from MySQL Backend
  const refreshUsers = async () => {
    try {
      const backendUsers = await getUsersApi();
      const backendStorages = await getStoragesApi();
      const mappedUsers = backendUsers.map(u => {
        let assignedStr = 'Unassigned';
        if (u.role && u.role.toLowerCase() === 'manager') {
          const matched = backendStorages.find(s => 
            s.manager && (s.manager.equalsIgnoreCase ? s.manager.equalsIgnoreCase(u.fullName) : s.manager.toLowerCase() === u.fullName.toLowerCase())
          );
          if (matched) {
            assignedStr = matched.name;
          }
        }
        return {
          id: u.id,
          name: u.fullName,
          fullName: u.fullName,
          role: u.role ? u.role.toLowerCase() : 'farmer',
          email: u.email,
          phone: u.phone || '',
          experience: u.experience || '3 Years',
          assignedStorage: assignedStr,
          bookedStorage: u.role && u.role.toLowerCase() === 'farmer' ? 'AgriFreeze North Hub' : 'None',
          products: 0,
          status: u.status === 'INACTIVE' ? 'Inactive' : 'Active',
          avatar: u.fullName ? u.fullName.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'
        };
      });
      setUsers(mappedUsers);
    } catch (e) {
      console.warn("Failed to fetch users from backend", e);
    }
  };

  // Fetch Products from MySQL Backend
  const refreshProducts = async () => {
    try {
      const backendProducts = await getProductsApi();
      const mappedProducts = backendProducts.map(p => ({
        id: p.id,
        name: p.name,
        type: p.type || 'General',
        farmerId: p.farmerId,
        farmer: p.farmerName || 'Farmer',
        farmerName: p.farmerName || 'Farmer',
        storageId: p.storageId,
        storage: p.storageName || 'AgriFreeze North Hub',
        storageName: p.storageName || 'AgriFreeze North Hub',
        quantity: p.quantity,
        entryDate: p.entryDate || new Date().toISOString().split('T')[0],
        shelfLife: p.shelfLife || 14,
        spoilageRisk: p.spoilageRisk || 'Low',
        status: p.status || 'Healthy'
      }));
      setProducts(mappedProducts);
    } catch (e) {
      console.warn("Failed to fetch products from backend", e);
    }
  };

  // Fetch Bookings from MySQL Backend
  const refreshBookings = async () => {
    try {
      const backendBookings = await getBookingsApi();
      const mappedBookings = backendBookings.map(b => ({
        id: b.id,
        bookingCode: b.bookingCode || `B-${b.id}`,
        farmerId: b.farmerId,
        farmerName: b.farmerName,
        facility: b.storageName || 'AgriFreeze North Hub',
        storageName: b.storageName,
        chamberName: b.chamberName,
        category: b.category || 'General',
        startDate: b.startDate || '2026-07-10',
        endDate: b.endDate || '2026-10-10',
        cost: b.price || '$1,200',
        status: b.status || 'Approved'
      }));
      setBookings(mappedBookings);
    } catch (e) {
      console.warn("Failed to fetch bookings from backend", e);
    }
  };

  // Fetch Alerts & Notifications from MySQL Backend
  const refreshAlertsAndNotifications = async () => {
    try {
      const backendAlerts = await getAlertsApi();
      const mappedAlerts = backendAlerts.map(a => ({
        id: a.id,
        itemCode: a.itemCode || `ALT-${a.id}`,
        type: a.title || a.type || 'System Alert',
        storage: a.source || 'AgriFreeze Storage',
        time: a.createdAt ? new Date(a.createdAt).toLocaleString() : 'Just now',
        severity: a.severity || 'Warning',
        status: a.status || 'Active'
      }));
      setAlerts(mappedAlerts);

      const backendNotifications = await getNotificationsApi();
      const mappedNotifications = backendNotifications.map(n => ({
        id: n.id,
        title: n.message || n.title || 'System notification',
        type: (n.type || 'info').toLowerCase(),
        time: n.createdAt ? new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now',
        read: n.isRead || false
      }));
      setNotifications(mappedNotifications);
    } catch (e) {
      console.warn("Failed to fetch alerts/notifications from backend", e);
    }
  };

  // On initial mount, fetch all dynamic data from MySQL backend
  useEffect(() => {
    refreshStorages();
    refreshUsers();
    refreshProducts();
    refreshBookings();
    refreshAlertsAndNotifications();
  }, []);

  const managers = (users || []).filter(u => u.role && u.role.toLowerCase() === 'manager');
  const eventNotifications = generateEventNotifications(products, storages);
  const allNotifications = [...eventNotifications, ...notifications];

  // Save Theme & User Session
  useEffect(() => {
    localStorage.setItem('agrifreeze-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (currentUser) {
      sessionStorage.setItem('agrifreeze-user', JSON.stringify(currentUser));
    } else {
      sessionStorage.removeItem('agrifreeze-user');
      localStorage.removeItem('agrifreeze-user');
      localStorage.removeItem('agrifreeze_current_user');
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('role');
    }
  }, [currentUser]);

  // Toast Notifications
  const triggerToast = (title, desc, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, title, desc, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const loginUser = (roleOrUser) => {
    let userDetails;
    let displayRole;
    if (typeof roleOrUser === 'object' && roleOrUser !== null) {
      userDetails = roleOrUser;
      displayRole = roleOrUser.role;
    } else {
      const role = roleOrUser;
      displayRole = role;
      if (role === 'admin') {
        userDetails = { id: 1, name: 'Sarah Jenkins', fullName: 'Sarah Jenkins', role: 'admin', email: 'admin@gmail.com', avatar: 'SJ' };
      } else if (role === 'manager') {
        userDetails = { id: 2, name: 'Robert Vance', fullName: 'Robert Vance', role: 'manager', email: 'manager@gmail.com', avatar: 'RV', assignedStorage: 'AgriFreeze North Hub' };
      } else if (role === 'farmer') {
        userDetails = { id: 3, name: 'Sanjay Patel', fullName: 'Sanjay Patel', role: 'farmer', email: 'farmer@gmail.com', avatar: 'SP', bookedStorage: 'AgriFreeze North Hub' };
      } else {
        userDetails = { role };
      }
    }
    setCurrentUser(userDetails);
    triggerToast('Login Successful', `Logged in as ${userDetails.name} (${displayRole.toUpperCase()})`, 'success');
  };

  const logoutUser = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('agrifreeze-user');
    localStorage.removeItem('agrifreeze-user');
    localStorage.removeItem('agrifreeze_current_user');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('role');
    triggerToast('Logged Out', 'Successfully logged out of the system', 'info');
  };

  // Dynamic Storage Operations via Backend
  const addStorage = async (storage) => {
    try {
      const payload = {
        name: storage.name,
        capacity: Number(storage.capacity) || 100,
        location: storage.location,
        manager: storage.manager || 'Unassigned',
        status: storage.status ? storage.status.toUpperCase() : 'ACTIVE',
        temp: Number(storage.temp) || 4.0,
        humidity: Number(storage.humidity) || 80.0,
        door: storage.door || 'Closed',
        power: storage.power || 'Grid',
        efficiency: Number(storage.efficiency) || 90,
        chamberCount: Number(storage.chamberCount) || 4
      };
      await createStorageApi(payload);
      await refreshStorages();
      triggerToast('Storage Room Added', `${storage.name} configured in database with ${payload.chamberCount} chambers.`, 'success');
    } catch (err) {
      triggerToast('Error', err.message || 'Failed to add storage room', 'danger');
    }
  };

  const editStorage = async (id, updatedFields) => {
    const numericId = typeof id === 'string' && id.startsWith('STR-') ? Number(id.replace('STR-', '')) : id;
    try {
      const payload = {
        name: updatedFields.name,
        capacity: updatedFields.capacity ? Number(updatedFields.capacity) : undefined,
        location: updatedFields.location,
        manager: updatedFields.manager,
        status: updatedFields.status ? updatedFields.status.toUpperCase() : undefined,
        temp: updatedFields.temp ? Number(updatedFields.temp) : undefined,
        humidity: updatedFields.humidity ? Number(updatedFields.humidity) : undefined,
        door: updatedFields.door,
        power: updatedFields.power,
        efficiency: updatedFields.efficiency ? Number(updatedFields.efficiency) : undefined
      };
      await updateStorageApi(numericId, payload);
      await refreshStorages();
      triggerToast('Storage Room Updated', 'Configuration settings saved in database.', 'success');
    } catch (err) {
      triggerToast('Error', err.message || 'Failed to update storage room', 'danger');
    }
  };

  const deleteStorage = async (id) => {
    const numericId = typeof id === 'string' && id.startsWith('STR-') ? Number(id.replace('STR-', '')) : id;
    try {
      await deleteStorageApi(numericId);
      await refreshStorages();
      triggerToast('Storage Room Removed', 'Deleted from database.', 'danger');
    } catch (err) {
      triggerToast('Error', err.message || 'Failed to delete storage room', 'danger');
    }
  };

  // Managers CRUD
  const addManager = async (mgr) => {
    try {
      await addUser({
        name: mgr.name,
        email: mgr.email,
        phone: mgr.phone,
        password: mgr.password || 'Password@123',
        experience: mgr.experience || '3 Years',
        role: 'manager',
        status: mgr.status
      });

      if (mgr.assignedStorage && mgr.assignedStorage !== 'None' && mgr.assignedStorage !== 'Unassigned') {
        const targetStr = storages.find(s => s.name === mgr.assignedStorage);
        if (targetStr) {
          await editStorage(targetStr.id, { manager: mgr.name });
        }
      }
      await refreshUsers();
      await refreshStorages();
    } catch (err) {
      console.warn("Failed to add manager", err);
    }
  };

  const editManager = (id, updatedFields) => {
    editUser(id, { ...updatedFields, role: 'manager' });
  };

  const deleteManager = (id) => {
    deleteUser(id);
  };

  // Dynamic User Operations via Backend
  const addUser = async (usr) => {
    try {
      const payload = {
        fullName: usr.name ? usr.name.trim() : '',
        email: usr.email ? usr.email.trim().toLowerCase() : '',
        password: usr.password ? usr.password : 'Password@123',
        phone: usr.phone ? usr.phone.trim() : '',
        experience: usr.experience ? usr.experience.trim() : '3 Years',
        role: usr.role ? usr.role.toUpperCase() : 'FARMER'
      };
      await registerApi(payload);
      await refreshUsers();
      triggerToast('User Profile Created', `${usr.name} registered in database.`, 'success');
    } catch (err) {
      triggerToast('Error', err.message || 'Failed to create user', 'danger');
    }
  };

  const editUser = async (id, updatedFields) => {
    try {
      const payload = {
        fullName: updatedFields.name ? updatedFields.name.trim() : undefined,
        phone: updatedFields.phone ? updatedFields.phone.trim() : undefined,
        role: updatedFields.role ? updatedFields.role.toUpperCase() : undefined,
        status: updatedFields.status ? updatedFields.status.toUpperCase() : undefined
      };
      await updateUserApi(id, payload);
      await refreshUsers();
      triggerToast('User Profile Updated', 'Database records updated.', 'success');
    } catch (err) {
      triggerToast('Error', err.message || 'Failed to update user', 'danger');
    }
  };

  const deleteUser = async (id) => {
    try {
      await deleteUserApi(id);
      await refreshUsers();
      await refreshBookings();
      await refreshStorages();
      triggerToast('User Removed', 'Account deactivated and linked bookings/chambers released in database.', 'danger');
    } catch (err) {
      triggerToast('Error', err.message || 'Failed to remove user', 'danger');
    }
  };

  // Dynamic Product Operations via Backend
  const addProduct = async (prd) => {
    try {
      const payload = {
        name: prd.name,
        type: prd.type || 'General',
        farmerId: prd.farmerId || (currentUser ? currentUser.id : 3),
        farmerName: prd.farmerName || prd.farmer || (currentUser ? (currentUser.fullName || currentUser.name) : 'Sanjay Patel'),
        storageId: prd.storageId || 1,
        storageName: prd.storageName || prd.storage || 'AgriFreeze North Hub',
        quantity: Number(prd.quantity) || 10,
        entryDate: prd.entryDate || new Date().toISOString().split('T')[0],
        shelfLife: Number(prd.shelfLife) || 14,
        spoilageRisk: prd.spoilageRisk || 'Low',
        status: prd.status || 'Active'
      };
      await createProductApi(payload);
      await refreshProducts();
      triggerToast('Product Added', `${prd.name} saved to database.`, 'success');
    } catch (err) {
      triggerToast('Error', err.message || 'Failed to add product', 'danger');
    }
  };

  const editProduct = async (id, updatedFields) => {
    try {
      const payload = {
        name: updatedFields.name,
        type: updatedFields.type,
        farmerId: updatedFields.farmerId,
        farmerName: updatedFields.farmerName || updatedFields.farmer,
        storageId: updatedFields.storageId,
        storageName: updatedFields.storageName || updatedFields.storage,
        quantity: updatedFields.quantity ? Number(updatedFields.quantity) : undefined,
        entryDate: updatedFields.entryDate,
        shelfLife: updatedFields.shelfLife ? Number(updatedFields.shelfLife) : undefined,
        spoilageRisk: updatedFields.spoilageRisk,
        status: updatedFields.status
      };
      await updateProductApi(id, payload);
      await refreshProducts();
      triggerToast('Product Updated', 'Database record saved.', 'success');
    } catch (err) {
      triggerToast('Error', err.message || 'Failed to update product', 'danger');
    }
  };

  const deleteProduct = async (id) => {
    try {
      await deleteProductApi(id);
      await refreshProducts();
      triggerToast('Product Removed', 'Product deleted from database.', 'info');
    } catch (err) {
      triggerToast('Error', err.message || 'Failed to delete product', 'danger');
    }
  };

  // Dynamic Booking Operations via Backend
  const createBooking = async (booking) => {
    try {
      const payload = {
        farmerId: String(booking.farmerId || (currentUser ? currentUser.id : Date.now())),
        farmerName: booking.farmerName || (currentUser ? (currentUser.fullName || currentUser.name) : 'Farmer User'),
        storageId: String(booking.storageId || 1),
        storageName: booking.storageName || booking.facility || 'Cold Storage Facility',
        chamberId: String(booking.chamberId || 1),
        chamberName: booking.chamberName || 'Chamber 1',
        category: booking.category || 'General Crops',
        weight: booking.weight ? String(booking.weight) : `${booking.capacity || 10} Tons`,
        startDate: booking.startDate || new Date().toISOString().split('T')[0],
        endDate: booking.endDate || new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0],
        price: booking.price ? String(booking.price) : `$${(Number(booking.capacity) || 10) * 24}`,
        status: booking.status || 'Pending'
      };
      await createBookingApi(payload);
      await refreshBookings();
      triggerToast('Allocation Request Sent', 'Request sent to Manager for approval.', 'success');
    } catch (err) {
      triggerToast('Error', err.message || 'Failed to create booking', 'danger');
    }
  };
  const approveBooking = async (id) => {
    try {
      await updateBookingStatusApi(id, 'Approved');
      await refreshBookings();
      await refreshUsers();
      await refreshStorages();
      triggerToast('Request Approved', 'Farmer allocation request approved successfully!', 'success');
    } catch (err) {
      triggerToast('Error', err.message || 'Failed to approve request', 'danger');
    }
  };

  const rejectBooking = async (id) => {
    try {
      await updateBookingStatusApi(id, 'Rejected');
      await refreshBookings();
      await refreshStorages();
      triggerToast('Request Rejected', 'Allocation request rejected.', 'info');
    } catch (err) {
      triggerToast('Error', err.message || 'Failed to reject request', 'danger');
    }
  };
  const resolveAlert = (id) => {
    setAlerts((prev) => prev.map((a) => a.id === id ? { ...a, status: 'Resolved' } : a));
    triggerToast('Alert Resolved', 'Incident log updated to resolved status.', 'success');
  };

  const addNotification = (title, type) => {
    const newNtf = {
      id: `NTF-${Date.now()}`,
      title,
      type,
      time: 'Just now',
      read: false
    };
    setNotifications((prev) => [newNtf, ...prev]);
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    triggerToast('Notifications', 'All marked as read', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        language,
        setLanguage,
        t,
        currentUser,
        setCurrentUser,
        login: loginUser,
        logout: logoutUser,
        storages,
        addStorage,
        editStorage,
        deleteStorage,
        managers,
        addManager,
        editManager,
        deleteManager,
        users,
        addUser,
        editUser,
        deleteUser,
        products,
        addProduct,
        editProduct,
        deleteProduct,
        alerts,
        resolveAlert,
        bookings,
        createBooking,
        approveBooking,
        rejectBooking,
        getChambersByStorage: getChambersByStorageApi,
        notifications: allNotifications,
        eventNotifications,
        markAllNotificationsRead,
        toasts,
        triggerToast,
        removeToast
      }}
    >
      {children}
      
      {/* Toast Notification Mount */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast ${toast.type}`}>
            <div className="toast-content">
              <div className="toast-title">{toast.title}</div>
              <div className="toast-desc">{toast.desc}</div>
            </div>
            <button className="toast-close" onClick={() => removeToast(toast.id)}>×</button>
          </div>
        ))}
      </div>
    </AppContext.Provider>
  );
};
