import React, { useEffect, useState, useContext } from 'react';
import API from '../../utils/api';
import OrderTracker from '../../components/OrderTracker';
import { AuthContext } from '../../context/AuthContext';
import { ArrowLeft, Clock, ShoppingBag, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchOrders = () => {
    setLoading(true);
    API.get('/orders/myorders')
      .then((res) => setOrders(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      <div className="bg-[#7E121D] text-white p-4 sticky top-0 z-30 shadow-md flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button onClick={() => navigate('/')} className="p-1 rounded-full hover:bg-white/10">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold">Order History & Real-Time Track</h1>
        </div>
        <button onClick={fetchOrders} className="p-1.5 rounded-full hover:bg-white/10 text-amber-300">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="max-w-xl mx-auto p-4 space-y-5">
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="bg-gray-200 h-44 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center shadow-sm border border-gray-100 my-6">
            <Clock className="w-16 h-16 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-800">No Orders Found</h3>
            <p className="text-xs text-gray-500 mt-1">Place your first pizza order to track status live!</p>
            <button
              onClick={() => navigate('/')}
              className="mt-4 bg-[#7E121D] text-white font-bold text-xs px-6 py-2.5 rounded-full shadow hover:bg-red-800 transition"
            >
              ORDER NOW
            </button>
          </div>
        ) : (
          orders.map((order) => (
            <OrderTracker
              key={order._id}
              order={order}
              onStatusChange={(updated) => {
                setOrders((prev) =>
                  prev.map((o) => (o._id === updated._id ? { ...o, orderStatus: updated.orderStatus } : o))
                );
              }}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
