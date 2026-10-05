import React, { useState, useContext } from 'react';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import { Tag, Wallet, ArrowLeft, CheckCircle, Copy, Sparkles, Percent, Gift } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Offers = () => {
  const { applyCoupon, couponCode, redeemWallet, setRedeemWallet } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [appliedMsg, setAppliedMsg] = useState('');
  const [copiedCode, setCopiedCode] = useState('');

  const couponsList = [
    {
      code: 'ROYAL50',
      title: 'Flat ₹50 OFF',
      desc: 'Get flat ₹50 discount on any pizza order. No minimum order limit!',
      badge: 'POPULAR',
      color: 'from-[#7E121D] to-red-800',
    },
    {
      code: 'FIRST100',
      title: 'Flat ₹100 OFF',
      desc: 'Exclusive discount for Royal Pizza foodies on orders above ₹299.',
      badge: 'BEST VALUE',
      color: 'from-amber-600 to-yellow-600',
    },
    {
      code: 'CHEESEY20',
      title: '20% Extra Cashback',
      desc: 'Get extra wallet cashback on Cheese Burst & Gourmet Pizzas.',
      badge: 'SPECIAL',
      color: 'from-blue-700 to-indigo-800',
    },
  ];

  const handleApply = (code) => {
    const res = applyCoupon(code);
    setAppliedMsg(res.message);
    setTimeout(() => {
      navigate('/cart');
    }, 1200);
  };

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      {/* Top Header */}
      <div className="bg-[#7E121D] text-white p-4 sticky top-0 z-30 shadow-md flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button onClick={() => navigate(-1)} className="p-1 rounded-full hover:bg-white/10">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold">Coupons & Special Offers</h1>
        </div>
        <Tag className="w-5 h-5 text-amber-300" />
      </div>

      <div className="max-w-xl mx-auto p-4 space-y-5">
        {/* Wallet Balance Header Card */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-5 rounded-3xl shadow-xl flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-1.5 text-xs text-blue-200 font-semibold uppercase tracking-wider">
              <Wallet className="w-4 h-4 text-amber-300" />
              <span>Royal Wallet Points</span>
            </div>
            <h3 className="text-2xl font-black text-amber-300">₹{user?.walletPoints || 50}</h3>
            <p className="text-[11px] text-blue-200">
              {redeemWallet ? '✅ Currently redeeming ₹50 on current order' : 'Check box in cart to redeem points'}
            </p>
          </div>

          <label className="bg-white/10 border border-white/20 p-3 rounded-2xl flex items-center space-x-2 cursor-pointer hover:bg-white/20 transition">
            <input
              type="checkbox"
              checked={redeemWallet}
              onChange={(e) => setRedeemWallet(e.target.checked)}
              className="w-5 h-5 text-[#7E121D] rounded border-gray-300 focus:ring-[#7E121D]"
            />
            <span className="text-xs font-bold text-white select-none">Redeem ₹50</span>
          </label>
        </div>

        {/* Applied Feedback */}
        {appliedMsg && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3.5 rounded-2xl font-extrabold flex items-center space-x-2 animate-bounce">
            <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{appliedMsg} — Redirecting to Cart...</span>
          </div>
        )}

        {/* Coupons List */}
        <div className="space-y-4">
          <h3 className="font-extrabold text-base text-gray-900 uppercase tracking-wide flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Available Discount Coupons</span>
          </h3>

          {couponsList.map((c) => {
            const isApplied = couponCode === c.code;

            return (
              <div
                key={c.code}
                className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between space-y-4 relative overflow-hidden"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="bg-amber-100 text-[#7E121D] text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider">
                      {c.badge}
                    </span>
                    <h4 className="text-lg font-black text-gray-900">{c.title}</h4>
                    <p className="text-xs text-gray-500 leading-relaxed max-w-xs">{c.desc}</p>
                  </div>

                  <div className="text-right">
                    <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-1 text-[#7E121D] font-mono font-black text-sm tracking-wider flex items-center space-x-1">
                      <span>{c.code}</span>
                      <button
                        onClick={() => handleCopy(c.code)}
                        className="hover:text-red-900"
                        title="Copy code"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {copiedCode === c.code && (
                      <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">Copied!</span>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[11px] text-gray-400 font-semibold">Valid on all orders</span>

                  <button
                    onClick={() => handleApply(c.code)}
                    className={`px-5 py-2 rounded-xl text-xs font-extrabold transition shadow-sm ${
                      isApplied
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#7E121D] text-white hover:bg-red-800'
                    }`}
                  >
                    {isApplied ? 'APPLIED ✅' : 'APPLY COUPON'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Offers;
