import React, { useContext, useState } from 'react';
import { MapPin, Menu, User as UserIcon, ShieldAlert } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import LocationSelectorModal from './LocationSelectorModal';

const Navbar = ({ onOpenSidebar }) => {
  const { orderType, setOrderType, deliveryAddress, selectedStore } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLocModalOpen, setIsLocModalOpen] = useState(false);

  return (
    <header className="bg-[#7E121D] text-white shadow-md sticky top-0 z-40">
      {/* Top Banner & Header */}
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={onOpenSidebar}
              className="p-1.5 rounded-full hover:bg-white/10 transition"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6 text-white" />
            </button>
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-black tracking-tight text-amber-400">👑 Royal Pizza</span>
            </Link>
          </div>

          <div className="flex items-center space-x-3">
            {user?.role === 'admin' && (
              <button
                onClick={() => navigate('/admin/orders')}
                className="flex items-center space-x-1 bg-amber-400 text-[#7E121D] font-bold text-xs px-3 py-1.5 rounded-full shadow hover:bg-amber-300 transition"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Admin Panel</span>
              </button>
            )}
            {!user ? (
              <button
                onClick={() => navigate('/login')}
                className="bg-white/10 hover:bg-white/20 text-xs font-semibold px-3 py-1.5 rounded-full border border-white/30"
              >
                Login
              </button>
            ) : (
              <button
                onClick={() => navigate('/profile')}
                className="flex items-center space-x-1.5 bg-white/10 hover:bg-white/20 text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20 transition cursor-pointer"
              >
                <UserIcon className="w-3.5 h-3.5 text-amber-300" />
                <span>{user.name}</span>
              </button>
            )}
          </div>
        </div>

        {/* Delivery Address & Store Location Bar (Clickable Location Selector) */}
        <div
          onClick={() => setIsLocModalOpen(true)}
          className="mt-2 text-center text-xs text-white/90 cursor-pointer hover:opacity-90 bg-black/10 py-1.5 px-2 rounded-xl transition border border-white/10"
        >
          <div className="flex items-center justify-center space-x-1 font-medium">
            <span>Delivery at</span>
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-bold text-white truncate max-w-[200px] sm:max-w-xs">{deliveryAddress}</span>
            <span className="text-xs text-amber-300 ml-1 font-bold">▼ CHANGE</span>
          </div>
          <div className="text-[11px] text-white/80 mt-0.5 font-medium">
            Store Location: <span className="font-bold text-amber-300">{selectedStore}</span>
          </div>
        </div>

        {/* DELIVERY / TAKE-AWAY Toggle (matching Screenshot 1) */}
        <div className="mt-3 flex justify-center">
          <div className="bg-[#5a0a12] p-1 rounded-full flex border border-white/20 w-full max-w-xs">
            <button
              onClick={() => setOrderType('Delivery')}
              className={`flex-1 py-1.5 rounded-full text-xs font-bold uppercase transition-all ${
                orderType === 'Delivery'
                  ? 'bg-white text-[#7E121D] shadow-md'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              DELIVERY
            </button>
            <button
              onClick={() => setOrderType('Take-Away')}
              className={`flex-1 py-1.5 rounded-full text-xs font-bold uppercase transition-all ${
                orderType === 'Take-Away'
                  ? 'bg-white text-[#7E121D] shadow-md'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              TAKE-AWAY
            </button>
          </div>
        </div>
      </div>

      <LocationSelectorModal isOpen={isLocModalOpen} onClose={() => setIsLocModalOpen(false)} />
    </header>
  );
};

export default Navbar;
