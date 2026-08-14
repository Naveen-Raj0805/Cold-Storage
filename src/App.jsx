import React, { useContext, useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, AppContext } from './context/AppContext';
import { Layout } from './components/Layout';
import { SplashScreen } from './components/SplashScreen';
import { AnimatePresence } from 'framer-motion';
import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/Login';
import { ForgotPassword } from './pages/ForgotPassword/ForgotPassword';
import { Signup } from './pages/Signup/Signup';
import { NotFound } from './pages/NotFound';
import { Profile } from './pages/Profile';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { StorageManagement } from './pages/admin/StorageManagement';
import { ManagerManagement } from './pages/admin/ManagerManagement';
import { UserManagement } from './pages/admin/UserManagement';
import { PlatformAnalytics } from './pages/admin/PlatformAnalytics';
import { AdminSettings } from './pages/admin/AdminSettings';

// Manager Pages
import { ManagerDashboard } from './pages/manager/ManagerDashboard';
import { StorageMonitoring } from './pages/manager/StorageMonitoring';
import { ProductManagement } from './pages/manager/ProductManagement';
import { ManagerUsers } from './pages/manager/ManagerUsers';
import { AlertManagement } from './pages/manager/AlertManagement';
import { ManagerReports } from './pages/manager/ManagerReports';
import { QualityInspector } from './pages/manager/QualityInspector';
import { ApprovalsManagement } from './pages/manager/ApprovalsManagement';

// Farmer Pages
import { FarmerDashboard } from './pages/farmer/FarmerDashboard';
import { MyProducts } from './pages/farmer/MyProducts';
import { MyStorage } from './pages/farmer/MyStorage';
import { StorageBooking } from './pages/farmer/StorageBooking';
import { FarmerNotifications } from './pages/farmer/FarmerNotifications';
import { FarmerSettings } from './pages/farmer/FarmerSettings';

// Route protection component checking logins
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser } = useContext(AppContext);

  if (!currentUser) {
    // Redirect to login page if unauthenticated
    return <Navigate to="/login" replace />;
  }

  const role = currentUser.role ? currentUser.role.toLowerCase() : '';

  if (allowedRoles && !allowedRoles.includes(role)) {
    // Role not authorized, bounce back to respective dashboard
    return <Navigate to={`/${role}/dashboard`} replace />;
  }

  return <Layout>{children}</Layout>;
};

function MainApp() {
  return (
    <Router>
      <Routes>
        {/* Public Landing Page Route */}
        <Route path="/" element={<LandingPage />} />

        {/* Public Forgot Password Route */}
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Public Signup Route */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/storages" element={<ProtectedRoute allowedRoles={['admin']}><StorageManagement /></ProtectedRoute>} />
        <Route path="/admin/managers" element={<ProtectedRoute allowedRoles={['admin']}><ManagerManagement /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><UserManagement /></ProtectedRoute>} />
        <Route path="/admin/analytics" element={<ProtectedRoute allowedRoles={['admin']}><PlatformAnalytics /></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={['admin']}><AdminSettings /></ProtectedRoute>} />
        <Route path="/admin/profile" element={<ProtectedRoute allowedRoles={['admin']}><Profile /></ProtectedRoute>} />

        {/* Manager Routes */}
        <Route path="/manager/dashboard" element={<ProtectedRoute allowedRoles={['manager']}><ManagerDashboard /></ProtectedRoute>} />
        <Route path="/manager/monitoring" element={<ProtectedRoute allowedRoles={['manager']}><StorageMonitoring /></ProtectedRoute>} />
        <Route path="/manager/products" element={<ProtectedRoute allowedRoles={['manager']}><ProductManagement /></ProtectedRoute>} />
        <Route path="/manager/users" element={<ProtectedRoute allowedRoles={['manager']}><ManagerUsers /></ProtectedRoute>} />
        <Route path="/manager/alerts" element={<ProtectedRoute allowedRoles={['manager']}><AlertManagement /></ProtectedRoute>} />
        <Route path="/manager/reports" element={<ProtectedRoute allowedRoles={['manager']}><ManagerReports /></ProtectedRoute>} />
        <Route path="/manager/quality-inspector" element={<ProtectedRoute allowedRoles={['manager']}><QualityInspector /></ProtectedRoute>} />
        <Route path="/manager/approvals" element={<ProtectedRoute allowedRoles={['manager']}><ApprovalsManagement /></ProtectedRoute>} />
        <Route path="/manager/profile" element={<ProtectedRoute allowedRoles={['manager']}><Profile /></ProtectedRoute>} />

        {/* Farmer Routes */}
        <Route path="/farmer/dashboard" element={<ProtectedRoute allowedRoles={['farmer']}><FarmerDashboard /></ProtectedRoute>} />
        <Route path="/farmer/products" element={<ProtectedRoute allowedRoles={['farmer']}><MyProducts /></ProtectedRoute>} />
        <Route path="/farmer/storage" element={<ProtectedRoute allowedRoles={['farmer']}><MyStorage /></ProtectedRoute>} />
        <Route path="/farmer/booking" element={<ProtectedRoute allowedRoles={['farmer']}><StorageBooking /></ProtectedRoute>} />
        <Route path="/farmer/notifications" element={<ProtectedRoute allowedRoles={['farmer']}><FarmerNotifications /></ProtectedRoute>} />
        <Route path="/farmer/settings" element={<ProtectedRoute allowedRoles={['farmer']}><FarmerSettings /></ProtectedRoute>} />
        <Route path="/farmer/profile" element={<ProtectedRoute allowedRoles={['farmer']}><Profile /></ProtectedRoute>} />

        {/* Fallback Professional 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AppProvider>
      <AnimatePresence mode="wait">
        {showSplash && <SplashScreen key="splash-screen" />}
      </AnimatePresence>
      <MainApp />
    </AppProvider>
  );
}

export default App;
