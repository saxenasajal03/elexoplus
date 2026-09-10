import React, { useState } from 'react';
import { Eye, EyeOff, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ onClose }) {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const endpoint = isLogin ? 'https://b2b.elexoplus.in/api/customer.php' : 'https://b2b.elexoplus.in/api/signup.php';
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        login(data.user);
        onClose();
      } else {
        alert(data.error || 'Authentication failed.');
      }
    } catch {
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-[100] p-4">
      <div className="bg-[#0f0f0f] w-full max-w-[380px] p-6 rounded-2xl border border-white/10 relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-yellow-500 transition-colors p-2 z-10">
          <X size={18} />
        </button>
        <div className="text-center mb-5">
          <img src="/assets/logo-BJqIBdaq.png" alt="ElexoPlus" className="h-8 mx-auto mb-2 object-contain" />
          <h2 className="text-lg font-bold text-white tracking-tight">{isLogin ? 'Sign In' : 'Get Started'}</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              required
              className="w-full px-3.5 py-2 bg-[#1a1a1a] border border-white/5 text-white text-sm rounded-lg"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          )}
          <input
            type="email"
            placeholder="email@company.com"
            required
            className="w-full px-3.5 py-2 bg-[#1a1a1a] border border-white/5 text-white text-sm rounded-lg"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              required
              className="w-full px-3.5 py-2 bg-[#1a1a1a] border border-white/5 text-white text-sm rounded-lg"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
            >
              {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
          <button type="submit" disabled={loading} className="w-full py-2.5 rounded-lg text-sm font-bold bg-yellow-500 text-black">
            {loading ? 'AUTHENTICATING...' : isLogin ? 'LOG IN' : 'CREATE ACCOUNT'}
          </button>
        </form>
        <button onClick={() => setIsLogin(!isLogin)} className="w-full py-2 mt-4 text-xs font-bold text-gray-400">
          {isLogin ? 'New to ElexoPlus? Join' : 'Back to Login'}
        </button>
      </div>
    </div>
  );
}
