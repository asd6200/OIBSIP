import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, KeyRound, ArrowRight, CheckCircle } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Step 1: Register, Step 2: Email OTP Verification
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState('');
  const [devOtp, setDevOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, verifyEmail } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await register(name, email, password);
      setDevOtp(res.otp || '');
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await verifyEmail(email, otp);
      alert('Email verified successfully! Welcome to Royal Pizza.');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed. Invalid OTP code.');
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
            {step === 1 ? 'Create Your Account' : 'Verify Email OTP'}
          </h2>
          <p className="text-xs text-gray-500">
            {step === 1
              ? 'Join Royal Pizza to enjoy exclusive offers & real-time tracking'
              : `Enter the 6-digit OTP code sent to ${email}`}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-2xl font-semibold">
            {error}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#7E121D] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@example.com"
                  className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#7E121D] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#7E121D] focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#7E121D] hover:bg-red-800 text-white font-extrabold text-sm py-3.5 rounded-xl shadow-lg transition flex items-center justify-center space-x-2"
            >
              <span>{loading ? 'Sending OTP...' : 'REGISTER & SEND OTP'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            {devOtp && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 rounded-2xl font-bold text-center">
                🔑 Developer Demo Verification OTP: <span className="font-mono text-lg text-emerald-700 tracking-wider ml-1">{devOtp}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">6-Digit Verification OTP</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 text-sm font-mono tracking-widest text-center font-bold focus:ring-2 focus:ring-[#7E121D] focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm py-3.5 rounded-xl shadow-lg transition flex items-center justify-center space-x-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{loading ? 'Verifying...' : 'VERIFY EMAIL & SIGN IN'}</span>
            </button>
          </form>
        )}

        <div className="pt-4 border-t border-gray-100 text-center text-xs text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="text-[#7E121D] font-bold hover:underline">
            Log in here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
