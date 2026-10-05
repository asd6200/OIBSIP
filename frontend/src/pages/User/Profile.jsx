import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Lock, Save, CheckCircle, ShieldCheck, Wallet, ArrowLeft } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '+91 9876543210');
      setAddress(user.address || '155, Patliputra Colony, Patna, Bihar, 800001, India');
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-sm text-center border border-gray-100">
          <User className="w-16 h-16 text-[#7E121D] mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900">Please Login</h2>
          <p className="text-xs text-gray-500 mt-2">Log in to view and edit your Royal Pizza profile.</p>
          <button
            onClick={() => navigate('/login')}
            className="mt-5 w-full bg-[#7E121D] text-white font-extrabold text-xs py-3 rounded-xl shadow-md hover:bg-red-800 transition uppercase"
          >
            GO TO LOGIN
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ type: '', text: '' });

    try {
      const updateData = { name, phone, address };
      if (password.trim()) {
        updateData.password = password;
      }

      await updateProfile(updateData);
      setMsg({ type: 'success', text: 'Profile updated successfully!' });
      setPassword('');
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      {/* Top Header Bar */}
      <div className="bg-[#7E121D] text-white p-4 sticky top-0 z-30 shadow-md flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button onClick={() => navigate(-1)} className="p-1 rounded-full hover:bg-white/10">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold">My Royal Profile</h1>
        </div>
      </div>

      <div className="max-w-xl mx-auto p-4 space-y-5">
        {/* User Badge Banner */}
        <div className="bg-gradient-to-r from-[#7E121D] via-[#8B1522] to-amber-900 rounded-3xl p-6 text-white shadow-xl flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-400 text-[#7E121D] font-black text-2xl flex items-center justify-center shadow-lg border-2 border-white">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h2 className="text-xl font-black">{user.name}</h2>
              <p className="text-xs text-amber-200">{user.email}</p>
              <div className="mt-1 flex items-center space-x-2">
                <span className="bg-white/20 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-white/20">
                  {user.role === 'admin' ? '👑 Admin' : '👑 Royal Member'}
                </span>
                <span className="bg-emerald-500/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  ✓ Verified
                </span>
              </div>
            </div>
          </div>

          <div className="text-right bg-white/10 p-3 rounded-2xl border border-white/20">
            <div className="flex items-center space-x-1 text-xs text-amber-300 font-bold justify-end">
              <Wallet className="w-3.5 h-3.5" />
              <span>Wallet Points</span>
            </div>
            <p className="text-2xl font-black text-white mt-0.5">₹{user.walletPoints || 50}</p>
          </div>
        </div>

        {/* Message Alert */}
        {msg.text && (
          <div
            className={`p-4 rounded-2xl text-xs font-bold flex items-center space-x-2 border shadow-sm ${
              msg.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-red-50 text-red-800 border-red-200'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            <span>{msg.text}</span>
          </div>
        )}

        {/* Editable Profile Form Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h3 className="font-bold text-base text-gray-900 flex items-center space-x-2">
              <User className="w-5 h-5 text-[#7E121D]" />
              <span>Edit Account Information</span>
            </h3>
            <span className="text-xs text-amber-600 font-bold bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              Editable
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <User className="w-4 h-4 text-[#7E121D]" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#7E121D] focus:outline-none"
                />
              </div>
            </div>

            {/* Email (Read Only) */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Email Address (Verified)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-xs font-semibold bg-gray-100 text-gray-500 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Phone className="w-4 h-4 text-[#7E121D]" />
                </div>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter mobile number"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#7E121D] focus:outline-none"
                />
              </div>
            </div>

            {/* Delivery Address */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Default Delivery Address
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3.5 pointer-events-none text-gray-400">
                  <MapPin className="w-4 h-4 text-[#7E121D]" />
                </div>
                <textarea
                  rows="3"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter full delivery address"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#7E121D] focus:outline-none resize-none"
                ></textarea>
              </div>
            </div>

            {/* Change Password (Optional) */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                New Password (Optional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4 text-[#7E121D]" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Leave blank to keep current password"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#7E121D] focus:outline-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#7E121D] text-white font-extrabold text-xs py-3.5 rounded-xl shadow-lg hover:bg-red-800 transition uppercase tracking-wider flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'SAVING CHANGES...' : 'SAVE PROFILE CHANGES'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
