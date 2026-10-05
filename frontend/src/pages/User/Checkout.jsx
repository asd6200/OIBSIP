import React, { useState, useContext } from 'react';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import API from '../../utils/api';
import RazorpayModal from '../../components/RazorpayModal';
import LocationSelectorModal from '../../components/LocationSelectorModal';
import { ArrowLeft, Wallet, ShoppingBag, CheckCircle, ChevronRight, Info, MapPin, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const {
    cartItems,
    quickAddons,
    subTotal,
    gst,
    totalDiscount,
    grandTotal,
    walletPointsValue,
    redeemWallet,
    setRedeemWallet,
    couponCode,
    applyCoupon,
    deliveryAddress,
    selectedStore,
    contactNumber,
    setContactNumber,
    remarks,
    orderType,
    clearCart,
  } = useContext(CartContext);

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLocModalOpen, setIsLocModalOpen] = useState(false);

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponMsg, setCouponMsg] = useState('');
  const [paymentMode, setPaymentMode] = useState('Online'); // 'COD' or 'Online'
  const [loading, setLoading] = useState(false);

  // Razorpay Modal state
  const [isRzpOpen, setIsRzpOpen] = useState(false);
  const [createdOrderData, setCreatedOrderData] = useState(null);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    const res = applyCoupon(inputCoupon);
    setCouponMsg(res.message);
  };

  const handleProceed = async () => {
    if (!user) {
      alert('Please login to place an order.');
      navigate('/login');
      return;
    }

    const hasItems = cartItems.length > 0 || quickAddons.length > 0;
    if (!hasItems) {
      alert('Your cart is empty! Please add items to proceed.');
      return;
    }

    if (grandTotal < 199) {
      alert('We do not accept orders less than ₹199! Please add items to reach ₹199 to proceed.');
      return;
    }

    if (!contactNumber || contactNumber.trim().length < 7) {
      alert('Please enter a valid contact phone number for delivery!');
      return;
    }

    setLoading(true);

    try {
      const orderPayload = {
        items: cartItems.map((item) => ({
          pizza: item.pizzaId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          crust: item.crust,
          size: item.size,
          isCustom: item.isCustom,
          customDetails: item.customDetails,
        })),
        quickAddons,
        subTotal,
        gst,
        discount: totalDiscount,
        walletPointsRedeemed: walletPointsValue,
        grandTotal,
        orderType,
        deliveryAddress,
        contactNumber,
        remarks,
        paymentMethod: paymentMode,
      };

      const res = await API.post('/orders/create', orderPayload);
      const { order, razorpayOrderId, key } = res.data;

      if (paymentMode === 'COD') {
        clearCart();
        navigate('/orders');
      } else {
        // Online Payment Flow (Razorpay)
        setCreatedOrderData({ order, razorpayOrderId, key });

        if (window.Razorpay) {
          const options = {
            key: key,
            amount: Math.round(grandTotal * 100),
            currency: 'INR',
            name: '👑 Royal Pizza',
            description: `Order #${order._id.slice(-6)}`,
            order_id: razorpayOrderId,
            handler: async function (response) {
              try {
                await API.post('/orders/verify-payment', {
                  orderId: order._id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                });
                clearCart();
                navigate('/orders');
              } catch (err) {
                alert('Payment verification failed: ' + (err.response?.data?.message || err.message));
              }
            },
            modal: {
              ondismiss: function () {
                setLoading(false);
              },
            },
            prefill: {
              name: user.name,
              email: user.email,
            },
            theme: {
              color: '#7E121D',
            },
          };

          try {
            const rzp = new window.Razorpay(options);
            rzp.open();
          } catch (e) {
            setIsRzpOpen(true);
          }
        } else {
          setIsRzpOpen(true);
        }
      }
    } catch (err) {
      console.error(err);
      alert('Error creating order: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleSimulatedRzpSuccess = async (paymentId, signature) => {
    try {
      if (!createdOrderData) return;
      await API.post('/orders/verify-payment', {
        orderId: createdOrderData.order._id,
        razorpayPaymentId: paymentId,
        razorpaySignature: signature,
      });
      setIsRzpOpen(false);
      clearCart();
      navigate('/orders');
    } catch (err) {
      alert('Error verifying test payment: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-36">
      {/* Header matching Screenshot 2 */}
      <div className="bg-[#7E121D] text-white p-4 sticky top-0 z-30 shadow-md flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button onClick={() => navigate(-1)} className="p-1 rounded-full hover:bg-white/10">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold">Checkout</h1>
        </div>
      </div>

      <div className="max-w-xl mx-auto p-4 space-y-5">
        {/* Confirm Delivery Address & Contact Details Card */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h3 className="font-bold text-sm text-gray-900 flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-[#7E121D]" />
              <span>Confirm Delivery Details</span>
            </h3>
            <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Fulfilling Store: {selectedStore?.split(',')[0]}
            </span>
          </div>

          {/* Delivery Address */}
          <div className="flex items-start space-x-3 bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
            <div className="p-2 bg-red-50 text-[#7E121D] rounded-xl mt-0.5">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs text-gray-900">Delivery Address</h4>
                <button
                  onClick={() => setIsLocModalOpen(true)}
                  className="text-[#7E121D] font-extrabold text-[11px] hover:underline uppercase tracking-wider cursor-pointer"
                >
                  CHANGE ADDRESS
                </button>
              </div>
              <p className="text-xs text-gray-600 mt-1 font-medium leading-relaxed">{deliveryAddress}</p>
            </div>
          </div>

          {/* Contact Phone Number for Delivery */}
          <div className="space-y-1.5 pt-1">
            <label className="block text-xs font-bold text-gray-800 flex items-center justify-between">
              <span className="flex items-center space-x-1">
                <Phone className="w-3.5 h-3.5 text-[#7E121D]" />
                <span>Contact Number for Delivery</span>
                <span className="text-red-500">*</span>
              </span>
              <span className="text-[10px] text-gray-400 font-semibold">Rider will call this number</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 font-bold text-xs">
                🇮🇳
              </div>
              <input
                type="text"
                required
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder="Enter 10-digit mobile number"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:ring-2 focus:ring-[#7E121D] focus:outline-none bg-amber-50/30"
              />
            </div>
          </div>
        </div>

        {/* Cashback & Offers Section matching Screenshot 2 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-gray-900">Cashback & Offers</h3>
            <button
              onClick={() => navigate('/offers')}
              className="bg-[#7E121D] text-white text-xs font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider shadow-sm hover:bg-red-800 transition"
            >
              VIEW COUPONS
            </button>
          </div>

          {/* Redeem Wallet Points */}
          <div className="flex items-center justify-between bg-amber-50/60 p-3 rounded-xl border border-amber-200/80">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-[#7E121D] text-amber-300 rounded-xl">
                <Wallet className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-xs text-gray-900 flex items-center space-x-1">
                  <span>Redeem Wallet Points</span>
                  <Info className="w-3.5 h-3.5 text-gray-400" />
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={redeemWallet}
              onChange={(e) => setRedeemWallet(e.target.checked)}
              className="w-5 h-5 text-[#7E121D] rounded border-gray-300 focus:ring-[#7E121D] cursor-pointer"
            />
          </div>

          {/* Apply Coupon Form */}
          <form onSubmit={handleApplyCoupon} className="flex space-x-2">
            <input
              type="text"
              value={inputCoupon}
              onChange={(e) => setInputCoupon(e.target.value)}
              placeholder="Apply Coupon"
              className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-[#7E121D] focus:outline-none"
            />
            <button
              type="submit"
              className="bg-[#7E121D] text-white font-extrabold text-xs px-5 py-2 rounded-xl hover:bg-red-800 transition uppercase"
            >
              APPLY
            </button>
          </form>

          {couponMsg && (
            <p className="text-xs font-bold text-emerald-600 flex items-center space-x-1">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{couponMsg}</span>
            </p>
          )}
        </div>

        {/* Type of order pill bar matching Screenshot 2 */}
        <div className="bg-amber-50/70 p-3 rounded-xl flex items-center justify-between text-xs font-bold text-[#7E121D] border border-amber-200/80">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-4 h-4 text-[#7E121D]" />
            <span className="text-gray-600 font-semibold">Type of order</span>
          </div>
          <span className="text-[#7E121D] font-black uppercase">{orderType}</span>
        </div>

        {/* Order Items Summary Cards matching Screenshot 2 */}
        <div className="space-y-3">
          {cartItems.map((item, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-gray-900">{item.name}</h4>
                <p className="text-xs text-gray-400 font-medium mt-0.5">
                  {item.size || 'Regular'} | {item.crust || 'Hand Tossed'}
                </p>
              </div>
              <div className="text-right">
                <p className="font-extrabold text-sm text-emerald-600">₹{item.price.toFixed(2)}</p>
                <p className="text-[11px] text-gray-400 font-mono mt-0.5">{item.price.toFixed(1)} X {item.quantity}</p>
              </div>
            </div>
          ))}

          {quickAddons.map((addon, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between text-xs">
              <span className="font-bold text-gray-900">{addon.name}</span>
              <div className="text-right">
                <span className="font-extrabold text-emerald-600">₹{addon.price.toFixed(2)}</span>
                <p className="text-[11px] text-gray-400 font-mono mt-0.5">{addon.price.toFixed(1)} X {addon.quantity}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Payment Mode & Price Breakdown matching Screenshot 2 */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-gray-900">Payment Mode</h3>
            <div className="flex items-center space-x-4 text-xs font-bold">
              <label className="flex items-center space-x-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMode"
                  value="COD"
                  checked={paymentMode === 'COD'}
                  onChange={() => setPaymentMode('COD')}
                  className="w-4 h-4 text-[#7E121D] focus:ring-[#7E121D]"
                />
                <span className="text-gray-700">COD</span>
              </label>

              <label className="flex items-center space-x-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMode"
                  value="Online"
                  checked={paymentMode === 'Online'}
                  onChange={() => setPaymentMode('Online')}
                  className="w-4 h-4 text-[#7E121D] focus:ring-[#7E121D]"
                />
                <span className="text-gray-700">Online</span>
              </label>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-3 space-y-2 text-xs">
            <div className="flex justify-between text-gray-500 font-medium">
              <span>Sub Total</span>
              <span className="font-bold text-gray-800">₹{subTotal.toFixed(2)}</span>
            </div>

            {totalDiscount > 0 && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Discount / Wallet Applied</span>
                <span>-₹{totalDiscount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between text-gray-500 font-medium">
              <span>GST (5%)</span>
              <span className="font-bold text-gray-800">₹{gst.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-base font-black text-gray-900 pt-2 border-t border-gray-100">
              <span>Grand Total</span>
              <span className="text-emerald-600">₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Proceed Bar sitting right above BottomNav (bottom-14) */}
      <div className="fixed bottom-14 left-0 right-0 z-40 bg-gradient-to-r from-[#7E121D] via-[#8B1522] to-[#5A0A12] text-white py-3 px-6 shadow-2xl flex items-center justify-between border-t-2 border-amber-400">
        <button
          disabled={loading}
          onClick={() => {
            if (cartItems.length === 0 && quickAddons.length === 0) {
              alert('Your cart is empty! Please add items to proceed.');
              return;
            }
            if (grandTotal < 199) {
              alert('We do not accept orders less than ₹199! Please add items to reach ₹199 to proceed.');
              return;
            }
            handleProceed();
          }}
          className="w-full flex items-center justify-between text-sm font-black uppercase tracking-wider bg-amber-400 text-[#7E121D] hover:bg-amber-300 px-6 py-3 rounded-xl shadow-xl transition transform active:scale-95 border border-amber-300 cursor-pointer disabled:opacity-50"
        >
          <span>{loading ? 'PROCESSING...' : 'PROCEED'}</span>
          <div className="flex items-center space-x-2">
            <span className="text-xl font-black text-[#7E121D]">₹{grandTotal.toFixed(2)}</span>
            <ChevronRight className="w-5 h-5 stroke-[3]" />
          </div>
        </button>
      </div>

      {/* Razorpay Online Payment Gateway Modal matching Screenshot 3 */}
      <RazorpayModal
        isOpen={isRzpOpen}
        grandTotal={grandTotal}
        onSuccess={handleSimulatedRzpSuccess}
        onClose={() => {
          setIsRzpOpen(false);
          setLoading(false);
        }}
      />

      <LocationSelectorModal isOpen={isLocModalOpen} onClose={() => setIsLocModalOpen(false)} />
    </div>
  );
};

export default Checkout;
