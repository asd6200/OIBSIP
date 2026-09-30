import React, { useState, useEffect, useContext } from 'react';
import API from '../../utils/api';
import { CartContext } from '../../context/CartContext';
import { ChefHat, Check, ArrowRight, ArrowLeft, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CustomBuilder = () => {
  const [step, setStep] = useState(1);
  const [options, setOptions] = useState({ bases: [], sauces: [], cheeses: [], veggies: [] });
  const [loading, setLoading] = useState(true);

  // Selected state
  const [selectedBase, setSelectedBase] = useState(null);
  const [selectedSauce, setSelectedSauce] = useState(null);
  const [selectedCheese, setSelectedCheese] = useState(null);
  const [selectedVeggies, setSelectedVeggies] = useState([]);

  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/pizzas/custom-options')
      .then((res) => {
        setOptions(res.data);
        if (res.data.bases.length > 0) setSelectedBase(res.data.bases[0]);
        if (res.data.sauces.length > 0) setSelectedSauce(res.data.sauces[0]);
        if (res.data.cheeses.length > 0) setSelectedCheese(res.data.cheeses[0]);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const toggleVeggie = (veg) => {
    setSelectedVeggies((prev) =>
      prev.some((v) => v.name === veg.name)
        ? prev.filter((v) => v.name !== veg.name)
        : [...prev, veg]
    );
  };

  // Price Calculation
  const basePrice = selectedBase ? selectedBase.unitPrice : 0;
  const saucePrice = selectedSauce ? selectedSauce.unitPrice : 0;
  const cheesePrice = selectedCheese ? selectedCheese.unitPrice : 0;
  const veggiesPrice = selectedVeggies.reduce((acc, v) => acc + v.unitPrice, 0);
  const totalCustomPrice = basePrice + saucePrice + cheesePrice + veggiesPrice + 100; // Base pizza price offset

  const handleFinishCustomPizza = () => {
    const customPizza = {
      _id: `custom_${Date.now()}`,
      name: `Custom Royal Pizza (${selectedBase?.name})`,
      price: totalCustomPrice,
      description: `${selectedBase?.name}, ${selectedSauce?.name}, ${selectedCheese?.name} with ${selectedVeggies.map((v) => v.name).join(', ') || 'No Veggies'}`,
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=80',
    };

    const customDetails = {
      base: selectedBase?.name,
      sauce: selectedSauce?.name,
      cheese: selectedCheese?.name,
      veggies: selectedVeggies.map((v) => v.name),
    };

    addToCart(customPizza, 1, selectedBase?.name, 'Custom Medium', true, customDetails);
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="w-12 h-12 border-4 border-[#7E121D] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 font-bold text-gray-600">Loading Pizza Ingredients...</p>
      </div>
    );
  }

  return (
    <div className="pb-28 pt-4 px-4 max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-[#7E121D] uppercase tracking-wider">Interactive Flow</span>
          <h2 className="text-xl font-extrabold text-gray-900 flex items-center space-x-2 mt-0.5">
            <ChefHat className="w-5 h-5 text-[#7E121D]" />
            <span>Custom Pizza Builder</span>
          </h2>
        </div>
        <div className="text-right">
          <span className="text-xs text-gray-400 font-medium">Est. Price</span>
          <p className="text-2xl font-black text-[#7E121D]">₹{totalCustomPrice.toFixed(2)}</p>
        </div>
      </div>

      {/* Wizard Progress Steps (1 to 4) */}
      <div className="flex items-center justify-between bg-white p-3 rounded-2xl shadow-sm border border-gray-100 text-xs font-bold">
        {[
          { num: 1, label: 'Base' },
          { num: 2, label: 'Sauce' },
          { num: 3, label: 'Cheese' },
          { num: 4, label: 'Veggies' },
        ].map((s) => (
          <button
            key={s.num}
            onClick={() => setStep(s.num)}
            className={`flex-1 py-2 px-1 rounded-xl text-center transition flex items-center justify-center space-x-1 ${
              step === s.num
                ? 'bg-[#7E121D] text-white shadow-md'
                : step > s.num
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-gray-100 text-gray-400'
            }`}
          >
            <span>Step {s.num}: {s.label}</span>
          </button>
        ))}
      </div>

      {/* STEP 1: CHOOSE PIZZA BASE (5 OPTIONS) */}
      {step === 1 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">
            Step 1: Select Pizza Base (5 Options)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {options.bases.map((base) => {
              const isSelected = selectedBase?.name === base.name;
              return (
                <div
                  key={base.name}
                  onClick={() => setSelectedBase(base)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition flex items-center justify-between shadow-sm ${
                    isSelected
                      ? 'border-[#7E121D] bg-red-50/50 ring-2 ring-red-100'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{base.name}</h4>
                    <p className="text-xs text-gray-500">Stock: {base.stock} units</p>
                  </div>
                  <div className="text-right flex items-center space-x-2">
                    <span className="text-xs font-extrabold text-[#7E121D]">+₹{base.unitPrice}</span>
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        isSelected ? 'bg-[#7E121D] text-white' : 'bg-gray-200 text-transparent'
                      }`}
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 2: CHOOSE SAUCE (5 OPTIONS) */}
      {step === 2 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">
            Step 2: Select Sauce (5 Options)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {options.sauces.map((sauce) => {
              const isSelected = selectedSauce?.name === sauce.name;
              return (
                <div
                  key={sauce.name}
                  onClick={() => setSelectedSauce(sauce)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition flex items-center justify-between shadow-sm ${
                    isSelected
                      ? 'border-[#7E121D] bg-red-50/50 ring-2 ring-red-100'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{sauce.name}</h4>
                    <p className="text-xs text-gray-500">Stock: {sauce.stock} units</p>
                  </div>
                  <div className="text-right flex items-center space-x-2">
                    <span className="text-xs font-extrabold text-[#7E121D]">+₹{sauce.unitPrice}</span>
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        isSelected ? 'bg-[#7E121D] text-white' : 'bg-gray-200 text-transparent'
                      }`}
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 3: CHOOSE CHEESE TYPE */}
      {step === 3 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">
            Step 3: Select Cheese Type
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {options.cheeses.map((cheese) => {
              const isSelected = selectedCheese?.name === cheese.name;
              return (
                <div
                  key={cheese.name}
                  onClick={() => setSelectedCheese(cheese)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition flex items-center justify-between shadow-sm ${
                    isSelected
                      ? 'border-[#7E121D] bg-red-50/50 ring-2 ring-red-100'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{cheese.name}</h4>
                    <p className="text-xs text-gray-500">Stock: {cheese.stock} units</p>
                  </div>
                  <div className="text-right flex items-center space-x-2">
                    <span className="text-xs font-extrabold text-[#7E121D]">+₹{cheese.unitPrice}</span>
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        isSelected ? 'bg-[#7E121D] text-white' : 'bg-gray-200 text-transparent'
                      }`}
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 4: CHOOSE VEGETABLES (MULTIPLE SELECT) */}
      {step === 4 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">
              Step 4: Select Vegetables (Multiple Select)
            </h3>
            <span className="text-xs font-semibold text-[#7E121D]">
              {selectedVeggies.length} Selected
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {options.veggies.map((veg) => {
              const isSelected = selectedVeggies.some((v) => v.name === veg.name);
              return (
                <div
                  key={veg.name}
                  onClick={() => toggleVeggie(veg)}
                  className={`p-3 rounded-2xl border-2 cursor-pointer transition flex flex-col justify-between shadow-sm ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-100'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-900">{veg.name}</span>
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        isSelected ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-transparent'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  </div>
                  <div className="mt-2 text-right">
                    <span className="text-[11px] font-extrabold text-emerald-800">+₹{veg.unitPrice}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Action Footer Controls */}
      <div className="flex items-center justify-between pt-4">
        {step > 1 ? (
          <button
            onClick={() => setStep(step - 1)}
            className="px-4 py-2.5 rounded-2xl border border-gray-300 font-bold text-xs text-gray-700 hover:bg-gray-100 transition flex items-center space-x-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous Step</span>
          </button>
        ) : (
          <div></div>
        )}

        {step < 4 ? (
          <button
            onClick={() => setStep(step + 1)}
            className="px-6 py-2.5 rounded-2xl bg-[#7E121D] text-white font-bold text-xs shadow-md hover:bg-red-800 transition flex items-center space-x-1"
          >
            <span>Next Step</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleFinishCustomPizza}
            className="px-6 py-3 rounded-2xl bg-emerald-600 text-white font-extrabold text-xs shadow-lg hover:bg-emerald-700 transition flex items-center space-x-2 animate-bounce"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>ADD CUSTOM PIZZA TO CART</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default CustomBuilder;
