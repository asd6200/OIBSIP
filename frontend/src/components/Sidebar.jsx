import React, { useContext } from 'react';
import {
  Home,
  UtensilsCrossed,
  Clock,
  Tag,
  MapPin,
  Wallet,
  PhoneCall,
  FileText,
  Info,
  Gift,
  LogOut,
  X,
  Edit2,
  ChefHat,
  ShieldCheck,
  Lock,
  User,
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleNav = (path) => {
    onClose();
    navigate(path);
  };

  const navItems = [
    { label: 'Home', icon: Home, path: '/' },
    { label: 'My Profile', icon: User, path: '/profile' },
    { label: 'Menu', icon: UtensilsCrossed, path: '/' },
    { label: 'Custom Pizza Builder', icon: ChefHat, path: '/custom-builder' },
    { label: 'Order History & Status', icon: Clock, path: '/orders' },
    { label: 'Coupons & Offers', icon: Tag, path: '/offers' },
    { label: 'My Addresses', icon: MapPin, path: '/cart' },
    { label: 'My Wallet (₹' + (user?.walletPoints || 50) + ')', icon: Wallet, path: '/cart' },
    { label: 'Contact Us', icon: PhoneCall, path: '#' },
    { label: 'T&C', icon: FileText, path: '#' },
    { label: 'Nutrition Info', icon: Info, path: '#' },
    { label: 'Refer & Earn', icon: Gift, path: '#' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Drawer Content */}
      <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto z-10 animate-in slide-in-from-left duration-300">
        <div>
          {/* Header Profile Section */}
          <div
            onClick={() => handleNav(user ? '/profile' : '/login')}
            className="p-6 bg-gradient-to-r from-red-50 to-orange-50 border-b border-gray-100 flex items-center justify-between cursor-pointer hover:bg-red-100/50 transition"
          >
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Hey,</p>
              <div className="flex items-center space-x-2 mt-0.5">
                <h3 className="text-xl font-bold text-[#7E121D]">
                  {user ? user.name : 'Guest User'}
                </h3>
                {user && <Edit2 className="w-4 h-4 text-[#7E121D]" />}
              </div>
              {user?.role === 'admin' && (
                <span className="inline-block mt-1 bg-amber-100 text-[#7E121D] text-[10px] font-bold px-2 py-0.5 rounded border border-amber-300">
                  👑 System Admin
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="py-2 divide-y divide-gray-100">
            <div className="space-y-0.5 px-3">
              {navItems.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleNav(item.path)}
                    className="w-full flex items-center justify-between px-3 py-3 text-sm font-semibold text-gray-700 hover:text-[#7E121D] hover:bg-red-50/60 rounded-lg transition"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-1.5 rounded-md bg-gray-100 text-[#7E121D]">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span>{item.label}</span>
                    </div>
                    <span className="text-xs text-gray-400">›</span>
                  </button>
                );
              })}
            </div>

            {/* Admin Section */}
            <div className="px-3 pt-2">
              {user?.role === 'admin' ? (
                <>
                  <button
                    onClick={() => handleNav('/admin/inventory')}
                    className="w-full flex items-center justify-between px-3 py-3 text-sm font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-lg transition border border-amber-200"
                  >
                    <div className="flex items-center space-x-3">
                      <ShieldCheck className="w-4 h-4 text-amber-700" />
                      <span>Admin Inventory Dashboard</span>
                    </div>
                    <span className="text-xs">›</span>
                  </button>
                  <button
                    onClick={() => handleNav('/admin/orders')}
                    className="w-full flex items-center justify-between px-3 py-3 text-sm font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-lg transition border border-amber-200 mt-1"
                  >
                    <div className="flex items-center space-x-3">
                      <Clock className="w-4 h-4 text-amber-700" />
                      <span>Admin Order Management</span>
                    </div>
                    <span className="text-xs">›</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleNav('/admin/login')}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-xs font-semibold text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition"
                >
                  <div className="flex items-center space-x-2">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Admin Portal Login</span>
                  </div>
                  <span className="text-xs">›</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer & Logout */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 text-center">
          {user ? (
            <button
              onClick={() => {
                logout();
                onClose();
                navigate('/login');
              }}
              className="w-full flex items-center justify-center space-x-2 text-sm font-bold text-[#7E121D] py-2.5 rounded-lg border border-red-200 hover:bg-red-50 transition mb-3"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          ) : (
            <button
              onClick={() => handleNav('/login')}
              className="w-full flex items-center justify-center space-x-2 text-sm font-bold text-white bg-[#7E121D] py-2.5 rounded-lg hover:bg-red-800 transition mb-3"
            >
              <span>Login / Register</span>
            </button>
          )}

          <p className="text-[11px] text-gray-400 font-medium">App Version - V4.1.3 (70)</p>
          <p className="text-[10px] text-gray-400">Copyright © Royal Pizza Pvt. Ltd.</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
