import React, { useEffect, useState } from 'react';
import API from '../../utils/api';
import { Package, AlertTriangle, Plus, Minus, Edit, Save, RefreshCw, Layers, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editStock, setEditStock] = useState(0);
  const [editThreshold, setEditThreshold] = useState(20);
  const [activeCategory, setActiveCategory] = useState('All');

  const fetchInventory = () => {
    setLoading(true);
    API.get('/admin/inventory')
      .then((res) => setInventory(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleUpdateStock = async (id, newStockValue, minThresholdValue) => {
    try {
      await API.put(`/admin/inventory/${id}`, {
        stock: newStockValue,
        minThreshold: minThresholdValue,
      });
      setInventory((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, stock: newStockValue, minThreshold: minThresholdValue } : item
        )
      );
      setEditingId(null);
    } catch (err) {
      alert('Error updating stock: ' + (err.response?.data?.message || err.message));
    }
  };

  const categories = ['All', 'base', 'sauce', 'cheese', 'veggie', 'addon'];

  const filteredInventory = activeCategory === 'All'
    ? inventory
    : inventory.filter((item) => item.category === activeCategory);

  const lowStockCount = inventory.filter((item) => item.stock < item.minThreshold).length;

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-28">
      {/* Top Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4 sticky top-0 z-30 shadow-lg flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link to="/" className="text-amber-400 font-extrabold text-lg flex items-center space-x-2">
            <span>👑 Royal Admin</span>
          </Link>
          <span className="text-gray-500">|</span>
          <h1 className="text-sm font-bold text-gray-200">Inventory Dashboard</h1>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/admin/orders"
            className="bg-amber-500 hover:bg-amber-600 text-gray-950 font-extrabold text-xs px-3.5 py-1.5 rounded-xl shadow transition"
          >
            Order Management Panel &rarr;
          </Link>
          <button onClick={fetchInventory} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-xl text-amber-400">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-4 space-y-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gray-800 p-4 rounded-2xl border border-gray-700 flex items-center space-x-4">
            <div className="p-3 bg-blue-500/20 text-blue-400 rounded-xl">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-semibold">Total Stock Items</p>
              <h3 className="text-2xl font-black text-white">{inventory.length}</h3>
            </div>
          </div>

          <div className="bg-gray-800 p-4 rounded-2xl border border-gray-700 flex items-center space-x-4">
            <div className={`p-3 rounded-xl ${lowStockCount > 0 ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-emerald-500/20 text-emerald-400'}`}>
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-semibold">Low Stock Items (&lt; Threshold)</p>
              <h3 className={`text-2xl font-black ${lowStockCount > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                {lowStockCount} Items
              </h3>
            </div>
          </div>

          <div className="bg-gray-800 p-4 rounded-2xl border border-gray-700 flex items-center space-x-4">
            <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-semibold">Auto Cron Monitoring</p>
              <h3 className="text-xs font-bold text-amber-300 mt-1">node-cron Active (Email Alerts)</h3>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition ${
                activeCategory === cat
                  ? 'bg-amber-500 text-gray-950 font-black shadow-lg'
                  : 'bg-gray-800 text-gray-400 hover:text-white border border-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Inventory List Table */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-800 h-16 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-800 rounded-3xl overflow-hidden border border-gray-700 shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-800/90 border-b border-gray-700 text-gray-400 font-bold uppercase tracking-wider">
                    <th className="py-3.5 px-4">Item Name</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Current Stock</th>
                    <th className="py-3.5 px-4">Min Threshold</th>
                    <th className="py-3.5 px-4">Status Alert</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/50">
                  {filteredInventory.map((item) => {
                    const isLow = item.stock < item.minThreshold;
                    const isEditing = editingId === item._id;

                    return (
                      <tr key={item._id} className="hover:bg-gray-750 transition">
                        <td className="py-3.5 px-4 font-bold text-white">{item.name}</td>
                        <td className="py-3.5 px-4">
                          <span className="bg-gray-700 text-gray-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase">
                            {item.category}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          {isEditing ? (
                            <input
                              type="number"
                              value={editStock}
                              onChange={(e) => setEditStock(parseInt(e.target.value, 10) || 0)}
                              className="w-20 px-2 py-1 bg-gray-900 border border-amber-500 text-amber-300 rounded font-bold"
                            />
                          ) : (
                            <div className="flex items-center space-x-2">
                              <span className={`font-extrabold text-sm ${isLow ? 'text-red-400' : 'text-emerald-400'}`}>
                                {item.stock} units
                              </span>
                              <div className="flex items-center space-x-1">
                                <button
                                  onClick={() => handleUpdateStock(item._id, Math.max(0, item.stock - 5), item.minThreshold)}
                                  className="p-1 bg-gray-700 hover:bg-gray-600 rounded text-gray-300"
                                  title="Quick decrement -5"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => handleUpdateStock(item._id, item.stock + 10, item.minThreshold)}
                                  className="p-1 bg-gray-700 hover:bg-gray-600 rounded text-gray-300"
                                  title="Quick add +10"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          {isEditing ? (
                            <input
                              type="number"
                              value={editThreshold}
                              onChange={(e) => setEditThreshold(parseInt(e.target.value, 10) || 1)}
                              className="w-16 px-2 py-1 bg-gray-900 border border-amber-500 text-amber-300 rounded font-bold"
                            />
                          ) : (
                            <span className="text-gray-400 font-medium">{item.minThreshold} units</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          {isLow ? (
                            <span className="bg-red-900/60 text-red-300 border border-red-500/40 text-[10px] font-bold px-2.5 py-1 rounded-full inline-flex items-center space-x-1">
                              <AlertTriangle className="w-3 h-3" />
                              <span>LOW STOCK</span>
                            </span>
                          ) : (
                            <span className="bg-emerald-900/60 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2.5 py-1 rounded-full">
                              IN STOCK
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {isEditing ? (
                            <button
                              onClick={() => handleUpdateStock(item._id, editStock, editThreshold)}
                              className="bg-emerald-500 text-gray-950 px-3 py-1 rounded-lg font-bold hover:bg-emerald-400 flex items-center space-x-1 ml-auto"
                            >
                              <Save className="w-3.5 h-3.5" />
                              <span>Save</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setEditingId(item._id);
                                setEditStock(item.stock);
                                setEditThreshold(item.minThreshold);
                              }}
                              className="bg-gray-700 hover:bg-gray-600 text-amber-400 px-3 py-1 rounded-lg font-bold flex items-center space-x-1 ml-auto"
                            >
                              <Edit className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminInventory;
