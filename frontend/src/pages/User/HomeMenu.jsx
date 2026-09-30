import React, { useEffect, useState, useContext } from 'react';
import API from '../../utils/api';
import PizzaCard from '../../components/PizzaCard';
import { ChefHat, Flame, Sparkles, Filter, ShoppingBag, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';

const HomeMenu = () => {
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const navigate = useNavigate();
  const { cartItems, quickAddons, subTotal } = useContext(CartContext);

  const totalItems =
    cartItems.reduce((acc, item) => acc + item.quantity, 0) +
    quickAddons.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    API.get('/pizzas')
      .then((res) => {
        setPizzas(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const categories = ['All', 'Nutri Crust', 'Medium Pizza', 'Large Pizza', 'Traditional Veg', 'Gourmet', 'Desi Flavour', 'Non-Veg', 'Cheesy', 'Street Style'];

  const filteredPizzas = selectedCategory === 'All'
    ? pizzas
    : pizzas.filter(p => p.category.toLowerCase().includes(selectedCategory.toLowerCase()) || (selectedCategory === 'Non-Veg' && !p.isVeg));

  return (
    <div className="pb-28 pt-4 px-4 max-w-4xl mx-auto space-y-6">
      {/* Banner - Build Custom Pizza Callout */}
      <div
        onClick={() => navigate('/custom-builder')}
        className="bg-gradient-to-r from-[#7E121D] via-red-900 to-amber-700 rounded-3xl p-5 text-white shadow-xl relative overflow-hidden cursor-pointer transform hover:scale-[1.01] transition"
      >
        <div className="relative z-10 max-w-xs">
          <span className="bg-amber-400 text-[#7E121D] text-[10px] font-black uppercase px-2.5 py-1 rounded-full tracking-wider inline-flex items-center space-x-1">
            <Sparkles className="w-3 h-3" />
            <span>CUSTOM PIZZA BUILDER</span>
          </span>
          <h2 className="text-2xl font-black mt-2 leading-tight">
            Craft Your Own Royal Pizza 👑
          </h2>
          <p className="text-xs text-amber-100 mt-1">
            Choose from 5 Crusts, 5 Sauces, Cheese & Fresh Veggies step-by-step!
          </p>
          <button className="mt-3 bg-white text-[#7E121D] font-extrabold text-xs px-4 py-2 rounded-xl shadow hover:bg-amber-100 transition inline-flex items-center space-x-1.5">
            <ChefHat className="w-4 h-4 text-[#7E121D]" />
            <span>BUILD NOW &rarr;</span>
          </button>
        </div>
        <div className="absolute right-[-10px] bottom-[-20px] text-8xl opacity-30 select-none">
          🍕
        </div>
      </div>

      {/* Explore Our Menu Header (matching Screenshot 1) */}
      <div>
        <div className="flex items-center justify-center space-x-3 my-2">
          <div className="h-[2px] w-12 bg-amber-400"></div>
          <h2 className="text-xl font-extrabold text-gray-900 tracking-tight uppercase">
            Explore Our Menu
          </h2>
          <div className="h-[2px] w-12 bg-amber-400"></div>
        </div>

        {/* Category Horizontal Filter Chips */}
        <div className="flex items-center space-x-2 overflow-x-auto py-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition shadow-sm ${
                selectedCategory === cat
                  ? 'bg-[#7E121D] text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Pizza Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-gray-200 h-52 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {filteredPizzas.map((pizza) => (
            <PizzaCard key={pizza._id} pizza={pizza} />
          ))}
        </div>
      )}

      {/* Floating Bottom Cart & Checkout Bar */}
      {totalItems > 0 && (
        <div className="fixed bottom-16 left-4 right-4 max-w-md mx-auto z-40 bg-gradient-to-r from-[#7E121D] via-[#8B1522] to-[#5A0A12] text-white p-3.5 rounded-2xl shadow-2xl flex items-center justify-between border-2 border-amber-400">
          <div>
            <div className="text-xs font-bold text-amber-200 flex items-center space-x-1">
              <ShoppingBag className="w-3.5 h-3.5 text-amber-300" />
              <span>{totalItems} {totalItems === 1 ? 'Item' : 'Items'} Added</span>
            </div>
            <span className="text-xl font-black text-amber-400 tracking-tight">₹{subTotal.toFixed(2)}</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigate('/cart')}
              className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-3 py-2 rounded-xl transition border border-white/20"
            >
              View Cart
            </button>
            <button
              onClick={() => navigate('/checkout')}
              className="bg-amber-400 text-[#7E121D] hover:bg-amber-300 text-xs font-black uppercase px-4 py-2 rounded-xl shadow-md flex items-center space-x-1 border border-amber-300 cursor-pointer"
            >
              <span>Checkout</span>
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeMenu;
