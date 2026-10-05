import React, { useState } from 'react';
import API from '../../utils/api';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowLeft, CheckCircle } from 'lucide-react';

const ForgotPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setError('');
    setMsg('');
    setLoading(true);

    try {
      const res = await API.post('/auth/forgot-password', { email });
      setMsg(res.data.message || 'Password reset link sent to your email.');
    } catch (err) {
      setError(err.response?.data?.message || 'Error requesting password reset.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setMsg('');
    setLoading(true);

    try {
      const res = await API.post('/auth/reset-password', {
        resetToken: token,
        newPassword,
      });
      alert(res.data.message);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Error resetting password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-[#7E121D] to-amber-950 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <span className="text-4xl select-none">👑</span>
          <h2 className="text-2xl font-black text-gray-900">
            {token ? 'Set New Password' : 'Forgot Password'}
          </h2>
          <p className="text-xs text-gray-500">
            {token
              ? 'Enter your new password below'
              : 'Enter your registered email address to receive a password reset link'}
          </p>
        </div>

        {msg && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 rounded-2xl font-bold flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>{msg}</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-2xl font-semibold">
            {error}
          </div>
        )}

        {!token ? (
          <form onSubmit={handleRequestReset} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@royalpizza.com"
                  className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#7E121D] focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#7E121D] hover:bg-red-800 text-white font-extrabold text-sm py-3.5 rounded-xl shadow-lg transition"
            >
              {loading ? 'Sending Request...' : 'SEND RESET LINK'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#7E121D] focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#7E121D] hover:bg-red-800 text-white font-extrabold text-sm py-3.5 rounded-xl shadow-lg transition"
            >
              {loading ? 'Resetting Password...' : 'UPDATE PASSWORD'}
            </button>
          </form>
        )}

        <div className="pt-4 border-t border-gray-100 text-center">
          <Link to="/login" className="inline-flex items-center space-x-1 text-xs text-gray-600 font-bold hover:text-[#7E121D]">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
