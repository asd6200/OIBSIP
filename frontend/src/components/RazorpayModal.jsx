import React from 'react';
import { CreditCard, CheckCircle, XCircle, ShieldCheck, X, Building2, QrCode } from 'lucide-react';

const RazorpayModal = ({ isOpen, grandTotal, onSuccess, onFailure, onClose }) => {
  if (!isOpen) return null;

  const handlePaySuccess = () => {
    const fakePaymentId = `pay_test_${Date.now()}`;
    const fakeSignature = `sig_test_${Date.now()}`;
    onSuccess(fakePaymentId, fakeSignature);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FFF5F2] rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-red-100 flex flex-col justify-between max-h-[90vh]">
        {/* Top Header matching Screenshot 3 */}
        <div className="p-4 bg-white border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button onClick={onClose} className="p-1 text-gray-500 hover:text-gray-900">
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-full bg-[#7E121D] text-white flex items-center justify-center font-bold text-xs">
                👑
              </div>
              <span className="font-bold text-xs text-gray-900 tracking-tight uppercase">
                TAKSHARYA FOOD WORKS PVT LTD
              </span>
            </div>
          </div>
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
        </div>

        {/* Modal Scrollable Content matching Screenshot 3 */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* PhonePe Link Card */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <h4 className="font-extrabold text-gray-900 text-xs">Link with PhonePe</h4>
              <p className="text-[10px] text-gray-500 mt-0.5 leading-snug">
                Enjoy 100% secure, 1-click payments using your Wallet & saved cards.
              </p>
            </div>
            <button
              onClick={handlePaySuccess}
              className="bg-[#7E121D] text-white font-bold text-xs px-4 py-2 rounded-xl hover:bg-red-800 transition"
            >
              Link
            </button>
          </div>

          {/* UPI Payment Section */}
          <div className="space-y-2">
            <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wide">UPI Payment</h4>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={handlePaySuccess}
                className="bg-white p-3 rounded-2xl border-2 border-red-500 shadow-sm flex items-center space-x-2 hover:bg-red-50 transition"
              >
                <div className="w-6 h-6 rounded-full bg-purple-700 text-white font-black flex items-center justify-center text-[10px]">
                  pe
                </div>
                <span className="font-bold text-gray-900 text-xs">PhonePe</span>
              </button>

              <button
                onClick={handlePaySuccess}
                className="bg-white p-3 rounded-2xl border border-gray-200 shadow-sm flex items-center space-x-2 hover:bg-gray-50 transition"
              >
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-black flex items-center justify-center text-[10px]">
                  G
                </div>
                <span className="font-bold text-gray-900 text-xs">Google Pay</span>
              </button>

              <button
                onClick={handlePaySuccess}
                className="bg-white p-3 rounded-2xl border border-gray-200 shadow-sm flex items-center space-x-2 hover:bg-gray-50 transition"
              >
                <div className="w-6 h-6 rounded-full bg-sky-500 text-white font-black flex items-center justify-center text-[10px]">
                  pay
                </div>
                <span className="font-bold text-gray-900 text-xs">PayTM</span>
              </button>

              <button
                onClick={handlePaySuccess}
                className="bg-white p-3 rounded-2xl border border-gray-200 shadow-sm flex items-center space-x-2 hover:bg-gray-50 transition"
              >
                <QrCode className="w-5 h-5 text-gray-700" />
                <span className="font-bold text-gray-900 text-[11px] leading-tight">Apps & UPI QR</span>
              </button>
            </div>
          </div>

          {/* Other Methods */}
          <div className="space-y-2">
            <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wide">Other Methods</h4>
            <div className="bg-white rounded-2xl divide-y divide-gray-100 border border-gray-100 shadow-sm">
              <button
                onClick={handlePaySuccess}
                className="w-full p-3.5 flex items-center justify-between hover:bg-gray-50 transition text-left"
              >
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-5 h-5 text-gray-700" />
                  <span className="font-bold text-gray-900 text-xs">Debit/Credit Card</span>
                </div>
                <span className="text-gray-400">›</span>
              </button>

              <button
                onClick={handlePaySuccess}
                className="w-full p-3.5 flex items-center justify-between hover:bg-gray-50 transition text-left"
              >
                <div className="flex items-center space-x-3">
                  <Building2 className="w-5 h-5 text-gray-700" />
                  <span className="font-bold text-gray-900 text-xs">Net Banking</span>
                </div>
                <span className="text-gray-400">›</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Pay Bar matching Screenshot 3 */}
        <div className="p-4 bg-white border-t border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-lg font-black text-gray-900">₹{grandTotal.toFixed(2)}</span>
            <p className="text-[10px] text-gray-400 font-semibold cursor-pointer hover:underline">View Breakup</p>
          </div>

          <button
            onClick={handlePaySuccess}
            className="bg-[#B91C1C] hover:bg-red-800 text-white font-extrabold text-sm px-8 py-3 rounded-2xl shadow-lg transition"
          >
            Pay
          </button>
        </div>
      </div>
    </div>
  );
};

export default RazorpayModal;
