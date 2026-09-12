import React, { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff, X, Loader2, CheckCircle2, AlertCircle, Mail, Lock, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/elexoplus-logo-BJqIBdaq.png';

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AuthModal({ onClose, onSuccess, title, subtitle }) {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);
  const [closing, setClosing] = useState(false);
  const dialogRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && handleClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = () => {
    setClosing(true);
    setTimeout(onClose, 180);
  };

  const validate = () => {
    const errs = {};
    if (!isLogin && form.name.trim().length < 2) errs.name = 'Please enter your full name.';
    if (!emailRe.test(form.email)) errs.email = 'Enter a valid email address.';
    if (form.password.length < 6) errs.password = 'Password must be at least 6 characters.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const update = (key) => (e) => {
    setForm({ ...form, [key]: e.target.value });
    if (errors[key]) setErrors({ ...errors, [key]: undefined });
    if (serverError) setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    setLoading(true);
    const endpoint = isLogin
      ? 'https://b2b.elexoplus.in/api/customer.php'
      : 'https://b2b.elexoplus.in/api/signup.php';
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          login(data.user);
          onSuccess?.(data.user);
          handleClose();
        }, 900);
      } else {
        setServerError(data.error || 'We could not verify those details. Please check and try again.');
      }
    } catch {
      setServerError('Network error — please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (toLogin) => {
    if (toLogin === isLogin) return;
    setIsLogin(toLogin);
    setErrors({});
    setServerError('');
  };

  return (
    <div
      className={`fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[100] p-4 transition-opacity duration-200 ${closing ? 'opacity-0' : 'opacity-100 animate-fadeIn'}`}
      onMouseDown={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div
        ref={dialogRef}
        className={`bg-zinc-950 w-full max-w-[400px] rounded-3xl border border-zinc-800 relative shadow-2xl shadow-black/60 overflow-hidden ${closing ? '' : 'animate-scaleIn'}`}
      >
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-amber-400 transition-colors p-1.5 z-20 cursor-pointer"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {success ? (
          /* ---- Success state ---- */
          <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
            <CheckCircle2 size={48} className="text-emerald-400 animate-scaleIn" />
            <p className="text-white font-extrabold text-lg mt-5">{isLogin ? 'Welcome back!' : 'Account created!'}</p>
            <p className="text-zinc-500 text-xs mt-2">Redirecting you now...</p>
          </div>
        ) : (
          <>
            <div className="text-center pt-8 pb-2 px-8">
              <img src={logo} alt="ElexoPlus" className="h-8 mx-auto mb-4 object-contain" />
              <h2 className="text-xl font-black text-white tracking-tight">
                {title || (isLogin ? 'Welcome Back' : 'Create Your Account')}
              </h2>
              <p className="text-xs text-zinc-500 mt-1">
                {subtitle || (isLogin ? 'Sign in to track orders & manage your account' : 'Join ElexoPlus for faster checkout & order tracking')}
              </p>
            </div>

            {/* Sliding Tab Switch */}
            <div className="px-8 pt-5">
              <div className="relative bg-zinc-900 border border-zinc-800 rounded-xl p-1 flex">
                <div
                  className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-amber-400 rounded-lg transition-transform duration-300 ease-out"
                  style={{ transform: isLogin ? 'translateX(0%)' : 'translateX(calc(100% + 8px))' }}
                />
                <button
                  type="button"
                  onClick={() => switchMode(true)}
                  className={`relative z-10 flex-1 py-2 text-xs font-extrabold uppercase tracking-wider rounded-lg transition-colors cursor-pointer ${isLogin ? 'text-black' : 'text-zinc-400 hover:text-white'}`}
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => switchMode(false)}
                  className={`relative z-10 flex-1 py-2 text-xs font-extrabold uppercase tracking-wider rounded-lg transition-colors cursor-pointer ${!isLogin ? 'text-black' : 'text-zinc-400 hover:text-white'}`}
                >
                  Sign Up
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="px-8 pt-5 pb-8 space-y-3.5">
              {/* Name field — animated height for signup only */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-out ${!isLogin ? 'max-h-24 opacity-100 mb-0' : 'max-h-0 opacity-0'}`}
              >
                <div className="relative">
                  <UserIcon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600" />
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={form.name}
                    onChange={update('name')}
                    className={`w-full pl-10 pr-3.5 py-3 bg-zinc-900 border rounded-xl text-white text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 transition ${
                      errors.name ? 'border-rose-500/60 focus:ring-rose-500/40' : 'border-zinc-800 focus:ring-amber-400'
                    }`}
                  />
                </div>
                {errors.name && <p className="text-rose-400 text-[11px] mt-1.5 flex items-center gap-1"><AlertCircle size={11} /> {errors.name}</p>}
              </div>

              <div>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600" />
                  <input
                    type="email"
                    placeholder="email@company.com"
                    value={form.email}
                    onChange={update('email')}
                    className={`w-full pl-10 pr-3.5 py-3 bg-zinc-900 border rounded-xl text-white text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 transition ${
                      errors.email ? 'border-rose-500/60 focus:ring-rose-500/40' : 'border-zinc-800 focus:ring-amber-400'
                    }`}
                  />
                </div>
                {errors.email && <p className="text-rose-400 text-[11px] mt-1.5 flex items-center gap-1"><AlertCircle size={11} /> {errors.email}</p>}
              </div>

              <div>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={update('password')}
                    className={`w-full pl-10 pr-10 py-3 bg-zinc-900 border rounded-xl text-white text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 transition ${
                      errors.password ? 'border-rose-500/60 focus:ring-rose-500/40' : 'border-zinc-800 focus:ring-amber-400'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-300 cursor-pointer"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.password && <p className="text-rose-400 text-[11px] mt-1.5 flex items-center gap-1"><AlertCircle size={11} /> {errors.password}</p>}
              </div>

              {serverError && (
                <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-2.5 flex items-start gap-2">
                  <AlertCircle size={14} className="text-rose-400 shrink-0 mt-0.5" />
                  <p className="text-rose-300 text-xs">{serverError}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl text-sm font-extrabold bg-amber-400 hover:bg-amber-500 text-black transition disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-400/10"
              >
                {loading ? (
                  <><Loader2 size={16} className="animate-spin" /> {isLogin ? 'Signing In...' : 'Creating Account...'}</>
                ) : (
                  isLogin ? 'Log In' : 'Create Account'
                )}
              </button>
            </form>

            <div className="px-8 pb-6 -mt-2 text-center">
              <button
                type="button"
                onClick={() => switchMode(!isLogin)}
                className="text-xs font-bold text-zinc-500 hover:text-amber-400 transition cursor-pointer"
              >
                {isLogin ? "New to ElexoPlus? " : "Already have an account? "}
                <span className="text-amber-400">{isLogin ? 'Create one' : 'Log in'}</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
