import React, { useEffect, useState } from 'react';
import { CheckCircle2, Clock, Utensils, Bike, PackageCheck } from 'lucide-react';
import { io } from 'socket.io-client';

const STEPS = [
  { key: 'Order Received', label: 'Order Received', icon: Clock },
  { key: 'In Kitchen', label: 'In Kitchen', icon: Utensils },
  { key: 'Sent to Delivery', label: 'Sent to Delivery', icon: Bike },
  { key: 'Delivered', label: 'Delivered', icon: PackageCheck },
];

const OrderTracker = ({ order, onStatusChange }) => {
  const [currentStatus, setCurrentStatus] = useState(order.orderStatus);

  useEffect(() => {
    setCurrentStatus(order.orderStatus);

    // Connect to Socket.io for live updates
    const socket = io('http://localhost:5000');

    socket.emit('joinRoom', `order_${order._id}`);
    if (order.user) {
      socket.emit('joinRoom', `user_${order.user}`);
    }

    socket.on('orderStatusUpdated', (updatedOrder) => {
      if (updatedOrder._id === order._id) {
        console.log(`⚡ Received real-time status update for #${order._id}: ${updatedOrder.orderStatus}`);
        setCurrentStatus(updatedOrder.orderStatus);
        if (onStatusChange) onStatusChange(updatedOrder);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [order]);

  const getCurrentStepIndex = () => {
    switch (currentStatus) {
      case 'Order Received':
        return 0;
      case 'In Kitchen':
        return 1;
      case 'Sent to Delivery':
        return 2;
      case 'Delivered':
        return 3;
      default:
        return 0;
    }
  };

  const activeIndex = getCurrentStepIndex();

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
        <div>
          <span className="text-xs font-bold text-[#7E121D] uppercase tracking-wider">
            Order #{order._id.slice(-6).toUpperCase()}
          </span>
          <h4 className="text-sm font-bold text-gray-800 mt-0.5">
            {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {order.items.length} Items
          </h4>
        </div>
        <div className="text-right">
          <span className="text-xs text-gray-400 font-medium">Grand Total</span>
          <p className="text-base font-black text-[#7E121D]">₹{order.grandTotal.toFixed(2)}</p>
        </div>
      </div>

      {/* Real-time Status Stepper */}
      <div className="relative py-2">
        <div className="flex items-center justify-between relative z-10">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = idx < activeIndex;
            const isCurrent = idx === activeIndex;

            return (
              <div key={step.key} className="flex flex-col items-center text-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 shadow ${
                    isCompleted
                      ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                      : isCurrent
                      ? 'bg-[#7E121D] text-white ring-4 ring-red-100 animate-bounce'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-5 h-5 stroke-[2.5]" /> : <Icon className="w-5 h-5" />}
                </div>

                <span
                  className={`text-[11px] mt-2 font-bold max-w-[70px] leading-tight ${
                    isCurrent
                      ? 'text-[#7E121D]'
                      : isCompleted
                      ? 'text-emerald-700'
                      : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Connecting Progress Bar */}
        <div className="absolute top-7 left-[10%] right-[10%] h-1 bg-gray-200 -z-0">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-[#7E121D] transition-all duration-700 rounded-full"
            style={{ width: `${(activeIndex / (STEPS.length - 1)) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="mt-4 bg-red-50/70 p-3 rounded-xl space-y-1 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-gray-600 font-medium">Estimated Delivery:</span>
          <span className="font-extrabold text-[#7E121D]">25-30 Mins</span>
        </div>
        {order.contactNumber && (
          <div className="flex items-center justify-between pt-1.5 border-t border-red-100 text-gray-700">
            <span className="font-semibold text-[11px]">Contact Phone:</span>
            <span className="font-bold text-[#7E121D]">{order.contactNumber}</span>
          </div>
        )}
        {order.deliveryAddress && (
          <div className="text-[11px] text-gray-500 pt-0.5 truncate">
            <span className="font-semibold text-gray-700">Address: </span>
            <span>{order.deliveryAddress}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracker;
