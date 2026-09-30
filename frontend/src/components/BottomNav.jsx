import React, { useContext } from 'react';
import { ClipboardList, Tag, ShoppingCart, Clock } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, quickAddons } = useContext(CartContext);

  const totalItemsCount =
    cartItems.reduce((acc, item) => acc + item.quantity, 0) +
    quickAddons.reduce((acc, item) => acc + item.quantity, 0);

  const navs = [
    { label: 'Menu', path: '/', icon: ClipboardList },
    { label: 'Offers', path: '/offers', icon: Tag },
    { label: 'Cart', path: '/cart', icon: ShoppingCart, badge: totalItemsCount },
    { label: 'Orders', path: '/orders', icon: Clock },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-xl h-14 flex items-center">
      <div className="max-w-md mx-auto w-full flex items-center justify-around px-2">
        {navs.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`relative flex flex-col items-center py-1 px-3 rounded-lg transition-colors ${
                isActive ? 'text-[#7E121D] font-bold' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#7E121D] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-0.5 tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
