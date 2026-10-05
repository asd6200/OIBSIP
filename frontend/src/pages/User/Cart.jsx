import React, { useContext, useState } from 'react';
import { CartContext } from '../../context/CartContext';
import { ArrowLeft, Plus, Minus, MapPin, ChevronRight, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LocationSelectorModal from '../../components/LocationSelectorModal';

const Cart = () => {
  const {
    cartItems,
    updateQuantity,
    quickAddons,
    addQuickAddon,
    updateAddonQuantity,
    remarks,
    setRemarks,
    deliveryAddress,
    setDeliveryAddress,
    selectedStore,
    subTotal,
  } = useContext(CartContext);

  const navigate = useNavigate();
  const [isLocModalOpen, setIsLocModalOpen] = useState(false);

  const availableAddons = [
    {
      name: 'Water Bottle 500 ml',
      price: 19.05,
      image: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=300&auto=format&fit=crop&q=80',
    },
    {
      name: 'Lahori Zeera',
      price: 19.05,
      image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=300&auto=format&fit=crop&q=80',
    },
    {
      name: 'Pepsi (475 ml)',
      price: 57.15,
      image: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=300&auto=format&fit=crop&q=80',
    },
    {
      name: 'Mousse Cake Hazelnut',
      price: 69.00,
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-36">
      {/* Dark Red Top Navbar matching Screenshot 1 */}
      <div className="bg-[#7E121D] text-white p-4 sticky top-0 z-30 shadow-md flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button onClick={() => navigate(-1)} className="p-1 rounded-full hover:bg-white/10">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold">My Cart</h1>
        </div>
        <span className="text-xs text-amber-300 font-bold">{cartItems.length} Items</span>
      </div>

      <div className="max-w-xl mx-auto p-4 space-y-5">
        {/* Cart Item Cards */}
        {cartItems.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center shadow-sm border border-gray-100 my-6">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-800">Your Cart is Empty</h3>
            <p className="text-xs text-gray-500 mt-1">Add some delicious pizzas to get started!</p>
            <button
              onClick={() => navigate('/')}
              className="mt-4 bg-[#7E121D] text-white font-bold text-xs px-6 py-2.5 rounded-full shadow hover:bg-red-800 transition"
            >
              EXPLORE MENU
            </button>
          </div>
        ) : (
          cartItems.map((item, index) => (
            <div key={index} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-start space-x-3">
              <div className="flex-1">
                <h3 className="font-bold text-base text-gray-900">{item.name}</h3>
                <p className="text-base font-extrabold text-emerald-600 mt-0.5">₹{item.price.toFixed(2)}</p>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                  {item.description || 'Italian Crust with all Healthy, Protein, Fiber with Diced Mozzarella, Ricotta Cheese...'}
                </p>
                <p className="text-xs text-gray-400 font-semibold mt-2">
                  {item.size || 'Regular'} | {item.crust || 'Hand Tossed'}
                </p>
              </div>

              <div className="flex flex-col items-end space-y-3">
                <img
                  src={item.image || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&auto=format&fit=crop&q=80'}
                  alt={item.name}
                  className="w-20 h-20 rounded-xl object-cover shadow-sm border border-gray-100"
                />

                {/* Quantity Controls matching Screenshot 1 (- 1 +) */}
                <div className="flex items-center border-2 border-[#7E121D] rounded-lg overflow-hidden bg-white">
                  <button
                    onClick={() => updateQuantity(index, -1)}
                    className="px-2.5 py-1 text-[#7E121D] font-black hover:bg-red-50"
                  >
                    <Minus className="w-3.5 h-3.5 stroke-[3]" />
                  </button>
                  <span className="px-3 text-sm font-bold text-gray-900">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(index, 1)}
                    className="px-2.5 py-1 text-[#7E121D] font-black hover:bg-red-50"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}

        {/* Quick Add-ons Section matching Screenshot 1 */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-gray-900">Quick Add-ons</h3>
            <button
              onClick={() => navigate('/')}
              className="bg-[#7E121D] text-white text-[10px] font-extrabold px-3 py-1.5 rounded-lg uppercase tracking-wider"
            >
              EXPLORE MENU
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 overflow-x-auto">
            {availableAddons.map((addon) => {
              const addedItem = quickAddons.find((a) => a.name === addon.name);
              return (
                <div key={addon.name} className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-xs text-gray-900 line-clamp-1">{addon.name}</h4>
                      <p className="text-xs font-bold text-emerald-600 mt-0.5">₹{addon.price.toFixed(2)}</p>
                    </div>
                    <img src={addon.image} alt={addon.name} className="w-12 h-12 rounded-lg object-cover" />
                  </div>

                  {addedItem ? (
                    <div className="mt-3 flex items-center justify-between border border-[#7E121D] rounded-lg py-1 px-2 bg-red-50/50">
                      <button
                        onClick={() =>
                          updateAddonQuantity(
                            quickAddons.findIndex((a) => a.name === addon.name),
                            -1
                          )
                        }
                        className="text-[#7E121D] font-bold"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold">{addedItem.quantity}</span>
                      <button
                        onClick={() =>
                          updateAddonQuantity(
                            quickAddons.findIndex((a) => a.name === addon.name),
                            1
                          )
                        }
                        className="text-[#7E121D] font-bold"
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addQuickAddon(addon)}
                      className="mt-3 w-full bg-[#7E121D] text-white font-extrabold text-xs py-1.5 rounded-lg shadow-sm hover:bg-red-800 transition uppercase"
                    >
                      ADD
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Add Remark Section matching Screenshot 1 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-2">
          <h3 className="font-bold text-sm text-gray-900">Add Remark</h3>
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Remarks Related to Food"
            rows="3"
            className="w-full p-3 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#7E121D] focus:outline-none resize-none placeholder-gray-400"
          ></textarea>
        </div>

        {/* Delivery Address Section matching Screenshot 1 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-gray-900">Delivery Address</h3>
            <span className="text-xs text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded">
              Store: {selectedStore?.split(',')[0]}
            </span>
          </div>
          <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-xl">
            <div className="p-2 bg-red-50 text-[#7E121D] rounded-xl">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-xs text-gray-900">Current Delivery Location</h4>
              <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{deliveryAddress}</p>
            </div>
          </div>
          <button
            onClick={() => setIsLocModalOpen(true)}
            className="bg-[#7E121D] text-white text-xs font-bold px-4 py-2 rounded-xl uppercase tracking-wider shadow-sm hover:bg-red-800 transition flex items-center space-x-1 cursor-pointer"
          >
            <span>CHANGE LOCATION & STORE</span>
          </button>
        </div>
      </div>

      {/* Sticky Bottom Bar sitting right above BottomNav (bottom-14) */}
      <div className="fixed bottom-14 left-0 right-0 z-40 bg-gradient-to-r from-[#7E121D] via-[#8B1522] to-[#5A0A12] text-white py-3 px-6 shadow-2xl flex items-center justify-between border-t-2 border-amber-400">
        <div>
          <span className="text-2xl font-black text-amber-400 tracking-tight">₹{subTotal.toFixed(2)}</span>
          <span className="block text-xs text-amber-200 underline cursor-pointer hover:text-white">Details</span>
        </div>

        <button
          onClick={() => {
            if (cartItems.length === 0 && quickAddons.length === 0) {
              alert('Your cart is empty! Please add items to checkout.');
              return;
            }
            if (subTotal < 199) {
              alert('Minimum order value is ₹199! Please add items worth ₹199 or more to checkout.');
              return;
            }
            navigate('/checkout');
          }}
          className="flex items-center space-x-2 text-sm font-black uppercase tracking-wider bg-amber-400 text-[#7E121D] hover:bg-amber-300 px-6 py-2.5 rounded-xl shadow-xl transition transform active:scale-95 cursor-pointer border border-amber-300"
        >
          <span>Checkout</span>
          <ChevronRight className="w-5 h-5 stroke-[3]" />
        </button>
      </div>

      <LocationSelectorModal isOpen={isLocModalOpen} onClose={() => setIsLocModalOpen(false)} />
    </div>
  );
};

export default Cart;
