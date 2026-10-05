import React, { useEffect, useState } from 'react';
import API from '../../utils/api';
import { Clock, Utensils, Bike, PackageCheck, RefreshCw, MapPin, User, ShieldAlert, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';
import { io } from 'socket.io-client';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = () => {
    setLoading(true);
    API.get('/admin/orders')
      .then((res) => setOrders(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();

    // Listen for live new orders / updates from Socket.io
    const socket = io('http://localhost:5000');
    socket.on('adminOrderUpdated', (updatedOrder) => {
      console.log('⚡ Admin received Socket event for order status change:', updatedOrder);
      setOrders((prev) =>
        prev.map((o) => (o._id === updatedOrder._id ? { ...o, orderStatus: updatedOrder.orderStatus } : o))
      );
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const res = await API.put(`/admin/orders/${orderId}/status`, { orderStatus: newStatus });
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus } : o))
      );
    } catch (err) {
      alert('Error updating order status: ' + (err.response?.data?.message || err.message));
    }
  };

  const statusColors = {
    'Order Received': 'bg-amber-900/60 text-amber-300 border-amber-500/40',
    'In Kitchen': 'bg-blue-900/60 text-blue-300 border-blue-500/40',
    'Sent to Delivery': 'bg-purple-900/60 text-purple-300 border-purple-500/40',
    'Delivered': 'bg-emerald-900/60 text-emerald-300 border-emerald-500/40',
    'Cancelled': 'bg-red-900/60 text-red-300 border-red-500/40',
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-28">
      {/* Top Header */}
      <div className="bg-gray-900 border-b border-gray-800 p-4 sticky top-0 z-30 shadow-lg flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link to="/" className="text-amber-400 font-extrabold text-lg flex items-center space-x-2">
            <span>👑 Royal Admin</span>
          </Link>
          <span className="text-gray-600">|</span>
          <h1 className="text-sm font-bold text-gray-200">Order Management Panel</h1>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/admin/inventory"
            className="bg-gray-800 hover:bg-gray-700 text-amber-400 font-extrabold text-xs px-3.5 py-1.5 rounded-xl border border-amber-500/30 transition flex items-center space-x-1"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Manage Inventory</span>
          </Link>
          <button onClick={fetchOrders} className="p-2 bg-gray-800 hover:bg-gray-700 rounded-xl text-amber-400">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-amber-400">
            Incoming Orders ({orders.length})
          </h2>
          <span className="text-xs text-gray-400 flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>Real-time Socket.io Live Sync</span>
          </span>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-900 h-48 rounded-3xl animate-pulse"></div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-gray-900 rounded-3xl p-8 text-center border border-gray-800 my-6">
            <Clock className="w-12 h-12 text-gray-600 mx-auto mb-2" />
            <h3 className="text-base font-bold text-gray-300">No Orders Placed Yet</h3>
            <p className="text-xs text-gray-500 mt-1">Orders placed by users will appear here live.</p>
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order._id}
              className="bg-gray-900 rounded-3xl p-5 shadow-xl border border-gray-800 space-y-4 hover:border-gray-700 transition"
            >
              {/* Order Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gray-800">
                <div>
                  <span className="text-xs font-mono font-bold text-amber-400">
                    ID: #{order._id.toUpperCase()}
                  </span>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(order.createdAt).toLocaleString()} &bull; Payment:{' '}
                    <strong className="text-emerald-400">{order.paymentMethod} ({order.paymentStatus})</strong>
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-black uppercase border ${
                      statusColors[order.orderStatus] || 'bg-gray-800 text-gray-300'
                    }`}
                  >
                    {order.orderStatus}
                  </span>
                </div>
              </div>

              {/* Customer Info & Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-gray-950 p-3 rounded-2xl border border-gray-800/80 text-xs">
                <div className="flex items-start space-x-2">
                  <User className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-gray-200">{order.user?.name || 'Customer'}</p>
                    <p className="text-gray-400 text-[11px]">{order.user?.email || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-gray-200">Delivery Address:</p>
                    <p className="text-gray-400 text-[11px] line-clamp-2">{order.deliveryAddress}</p>
                  </div>
                </div>
              </div>

              {/* Items Summary */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Ordered Items:</h4>
                <div className="space-y-1.5">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="bg-gray-800/60 p-2.5 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-white">{item.name} x {item.quantity}</span>
                        <span className="text-gray-400 ml-2">({item.size} | {item.crust})</span>
                        {item.customDetails && (
                          <p className="text-[11px] text-amber-300/80 mt-0.5 font-medium">
                            Base: {item.customDetails.base} | Sauce: {item.customDetails.sauce} | Cheese: {item.customDetails.cheese} | Veggies: {item.customDetails.veggies?.join(', ') || 'None'}
                          </p>
                        )}
                      </div>
                      <span className="font-mono font-bold text-emerald-400">₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  {order.quickAddons?.map((addon, idx) => (
                    <div key={idx} className="bg-gray-800/40 p-2 rounded-xl flex items-center justify-between text-xs text-gray-300">
                      <span>Addon: {addon.name} x {addon.quantity}</span>
                      <span className="font-mono text-emerald-400">₹{(addon.price * addon.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total & Remarks */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-800">
                <div className="text-xs text-gray-400">
                  {order.remarks && <p>Remarks: <em className="text-amber-200">"{order.remarks}"</em></p>}
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-400 font-semibold">Grand Total: </span>
                  <span className="text-lg font-black text-emerald-400">₹{order.grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Status Action Buttons */}
              <div className="pt-2 border-t border-gray-800">
                <p className="text-[11px] font-bold text-gray-400 mb-2 uppercase">Update Order Status Live:</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    onClick={() => handleUpdateStatus(order._id, 'Order Received')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1 ${
                      order.orderStatus === 'Order Received'
                        ? 'bg-amber-500 text-gray-950 ring-2 ring-amber-300'
                        : 'bg-gray-800 hover:bg-gray-750 text-gray-300'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Order Received</span>
                  </button>

                  <button
                    onClick={() => handleUpdateStatus(order._id, 'In Kitchen')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1 ${
                      order.orderStatus === 'In Kitchen'
                        ? 'bg-blue-600 text-white ring-2 ring-blue-300'
                        : 'bg-gray-800 hover:bg-gray-750 text-gray-300'
                    }`}
                  >
                    <Utensils className="w-3.5 h-3.5" />
                    <span>In Kitchen</span>
                  </button>

                  <button
                    onClick={() => handleUpdateStatus(order._id, 'Sent to Delivery')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1 ${
                      order.orderStatus === 'Sent to Delivery'
                        ? 'bg-purple-600 text-white ring-2 ring-purple-300'
                        : 'bg-gray-800 hover:bg-gray-750 text-gray-300'
                    }`}
                  >
                    <Bike className="w-3.5 h-3.5" />
                    <span>Sent to Delivery</span>
                  </button>

                  <button
                    onClick={() => handleUpdateStatus(order._id, 'Delivered')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1 ${
                      order.orderStatus === 'Delivered'
                        ? 'bg-emerald-600 text-white ring-2 ring-emerald-300'
                        : 'bg-gray-800 hover:bg-gray-750 text-gray-300'
                    }`}
                  >
                    <PackageCheck className="w-3.5 h-3.5" />
                    <span>Delivered</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
