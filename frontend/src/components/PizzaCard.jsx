import React, { useContext } from 'react';
import { Plus, Check } from 'lucide-react';
import { CartContext } from '../context/CartContext';

const PizzaCard = ({ pizza }) => {
  const { addToCart, cartItems } = useContext(CartContext);

  const isInCart = cartItems.some((item) => item.name === pizza.name);

  // Render Promo Banner Cards if price category card
  if (pizza.price <= 109 && pizza.description.includes('Starts')) {
    return (
      <div className="bg-[#7E121D] rounded-2xl p-4 text-white text-center flex flex-col justify-between shadow-md border-2 border-amber-400 hover:shadow-xl transition transform hover:-translate-y-0.5">
        <div>
          <span className="bg-amber-400 text-[#7E121D] text-[10px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider">
            BEST VALUE
          </span>
          <h3 className="text-xl font-extrabold mt-2 leading-tight">
            ITEM STARTS @ RS {pizza.price} ONLY
          </h3>
          <p className="text-xs text-amber-200 mt-1">{pizza.description}</p>
        </div>
        <button
          onClick={() => addToCart(pizza)}
          className="mt-3 bg-white text-[#7E121D] font-extrabold text-xs py-2 rounded-xl shadow hover:bg-amber-100 transition flex items-center justify-center space-x-1"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span>ORDER NOW</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-gray-100 flex flex-col justify-between transition transform hover:-translate-y-0.5">
      <div>
        <div className="relative h-36 bg-gray-100 overflow-hidden">
          <img
            src={pizza.image}
            alt={pizza.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=80';
            }}
          />
          <span
            className={`absolute top-2 right-2 px-2 py-0.5 rounded-md text-[10px] font-bold shadow ${
              pizza.isVeg ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
            }`}
          >
            {pizza.isVeg ? '🟢 VEG' : '🔴 NON-VEG'}
          </span>
        </div>

        <div className="p-3">
          <h3 className="font-bold text-sm text-gray-900 line-clamp-1">{pizza.name}</h3>
          <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-snug">{pizza.description}</p>
        </div>
      </div>

      <div className="p-3 pt-0 flex items-center justify-between mt-2 border-t border-gray-50">
        <div>
          <span className="text-xs text-gray-400 font-medium">Starts @</span>
          <p className="text-base font-extrabold text-[#7E121D]">₹{pizza.price.toFixed(2)}</p>
        </div>

        <button
          onClick={() => addToCart(pizza)}
          className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center space-x-1 transition shadow-sm ${
            isInCart
              ? 'bg-emerald-600 text-white'
              : 'bg-[#7E121D] text-white hover:bg-red-800'
          }`}
        >
          {isInCart ? (
            <>
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>ADDED</span>
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>ADD</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default PizzaCard;
