import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';

import HomeMenu from './pages/User/HomeMenu';
import CustomBuilder from './pages/User/CustomBuilder';
import Cart from './pages/User/Cart';
import Offers from './pages/User/Offers';
import Checkout from './pages/User/Checkout';
import OrderHistory from './pages/User/OrderHistory';
import Login from './pages/User/Login';
import Register from './pages/User/Register';
import ForgotPassword from './pages/User/ForgotPassword';
import Profile from './pages/User/Profile';

import AdminLogin from './pages/Admin/AdminLogin';
import AdminInventory from './pages/Admin/AdminInventory';
import AdminOrders from './pages/Admin/AdminOrders';

const AppContent = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith('/admin');
  const isAuthRoute = ['/login', '/register', '/forgot-password'].includes(location.pathname) || location.pathname.startsWith('/reset-password');
  const isFullPage = isAdminRoute || isAuthRoute;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {!isFullPage && <Navbar onOpenSidebar={() => setIsSidebarOpen(true)} />}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-1">
        <Routes>
          {/* User Routes */}
          <Route path="/" element={<HomeMenu />} />
          <Route path="/custom-builder" element={<CustomBuilder />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<OrderHistory />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ForgotPassword />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/inventory" element={<AdminInventory />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
        </Routes>
      </main>

      {!isFullPage && <BottomNav />}
    </div>
  );
};

const App = () => {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
