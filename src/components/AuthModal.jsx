import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Eye, EyeOff, X, Loader2, CheckCircle2, AlertCircle, Mail, Lock,
  User as UserIcon, ShieldCheck, ArrowLeft, RotateCw,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/elexoplus-logo-BJqIBdaq.png';
import { ENDPOINTS, GOOGLE_CLIENT_ID } from '../data/siteContent';

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RESEND_COOLDOWN = 45; // seconds

export default function AuthModal({ onClose, onSuccess, title, subtitle }) {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);

  // Signup is two steps: 'details' (name/email/password) then 'verify' (OTP).
  // No account is ever created directly from 'details' — send_otp only
  // emails a code; the account itself is created by the 'verify' step, and
  // only if that code checks out server-side.
  const [signupStep, setSignupStep] = useState('details');

  const [loading, setLoading] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', otp: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);
  const [closing, setClosing] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  const [googleReady, setGoogleReady] = useState(false);
  const googleBtnRef = useRef(null);

  // ── Close on Escape ──────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && handleClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Resend cooldown ticker ───────────────────────────────────────────
  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  const handleClose = () => {
    setClosing(true);
    setTimeout(onClose, 180);
  };

  const completeAuth = useCallback((user) => {
    setSuccess(true);
    setTimeout(() => {
      login(user);
      onSuccess?.(user);
      handleClose();
    }, 900);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [login, onSuccess]);

  // ── Google Identity Services: load once, render button when ready ────
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;

    const handleCredential = async (response) => {
      setServerError('');
      setLoading(true);
      try {
        const res = await fetch(ENDPOINTS.auth, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'google', credential: response.credential }),
        });
        const data = await res.json();
        if (data.success) {
          completeAuth(data.user);
        } else {
          setServerError(data.message || 'Google sign-in failed. Please try again.');
        }
      } catch {
        setServerError('Network error — please check your connection and try again.');
      } finally {
        setLoading(false);
      }
    };

    const init = () => {
      if (!window.google?.accounts?.id) return;
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredential,
      });
      if (googleBtnRef.current) {
        window.google.accounts.id.renderButton(googleBtnRef.current, {
          theme: 'filled_black',
          size: 'large',
          shape: 'pill',
          text: 'continue_with',
          width: 336,
        });
      }
      setGoogleReady(true);
    };

    if (window.google?.accounts?.id) {
      init();
      return;
    }

    const existing = document.getElementById('google-identity-script');
    if (existing) {
      existing.addEventListener('load', init);
      return () => existing.removeEventListener('load', init);
    }

    const script = document.createElement('script');
    script.id = 'google-identity-script';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = init;
    document.body.appendChild(script);
    // Intentionally not removing the script on unmount — Google's SDK is
    // safe to keep loaded for the rest of the session and re-initializing
    // it on every modal open/close would be wasteful.
  }, [completeAuth]);

  const resetOtpState = () => {
    setSignupStep('details');
    setForm((f) => ({ ...f, otp: '' }));
    setResendIn(0);
  };

  const switchMode = (toLogin) => {
    if (toLogin === isLogin) return;
    setIsLogin(toLogin);
    setErrors({});
    setServerError('');
    resetOtpState();
  };

  const update = (key) => (e) => {
    setForm({ ...form, [key]: e.target.value });
    if (errors[key]) setErrors({ ...errors, [key]: undefined });
    if (serverError) setServerError('');
  };

  // ── Step 1 (signup): validate details, then request an OTP ───────────
  const validateDetails = () => {
    const errs = {};
    if (!isLogin && form.name.trim().length < 2) errs.name = 'Please enter your full name.';
    if (!emailRe.test(form.email)) errs.email = 'Enter a valid email address.';
    if (form.password.length < 6) errs.password = 'Password must be at least 6 characters.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const sendOtp = async () => {
    setServerError('');
    if (!validateDetails()) return;

    setOtpSending(true);
    try {
      const res = await fetch(ENDPOINTS.auth, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send_otp', email: form.email, name: form.name }),
      });
      const data = await res.json();
      if (data.success) {
        setSignupStep('verify');
        setResendIn(RESEND_COOLDOWN);
      } else {
        setServerError(data.message || 'We could not send a verification code. Please try again.');
      }
    } catch {
      setServerError('Network error — please check your connection and try again.');
    } finally {
      setOtpSending(false);
    }
  };

  // ── Step 2 (signup): verify OTP + create the account ──────────────────
  const submitSignup = async (e) => {
    e.preventDefault();
    setServerError('');
    if (form.otp.trim().length !== 6) {
      setErrors({ otp: 'Enter the 6-digit code from your email.' });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(ENDPOINTS.auth, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'signup', ...form }),
      });
      const data = await res.json();
      if (data.success) {
        completeAuth(data.user);
      } else {
        setServerError(data.message || 'That code did not work. Please check it and try again.');
      }
    } catch {
      setServerError('Network error — please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Login: unchanged single-step flow ─────────────────────────────────
  const submitLogin = async (e) => {
    e.preventDefault();
    setServerError('');
    const errs = {};
    if (!emailRe.test(form.email)) errs.email = 'Enter a valid email address.';
    if (!form.password) errs.password = 'Please enter your password.';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    try {
      const res = await fetch(ENDPOINTS.auth, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (data.success) {
        completeAuth(data.user);
      } else {
        setServerError(data.message || 'We could not verify those details. Please check and try again.');
      }
    } catch {
      setServerError('Network error — please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = isLogin ? submitLogin : signupStep === 'details' ? (e) => { e.preventDefault(); sendOtp(); } : submitSignup;

  return (
    <div
      className={`fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[100] p-4 transition-opacity duration-200 ${closing ? 'opacity-0' : 'opacity-100 animate-fadeIn'}`}
      onMouseDown={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div className={`bg-zinc-950 w-full max-w-[400px] rounded-3xl border border-zinc-800 relative shadow-2xl shadow-black/60 overflow-hidden ${closing ? '' : 'animate-scaleIn'}`}>
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-amber-400 transition-colors p-1.5 z-20 cursor-pointer"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {success ? (
          <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
            <CheckCircle2 size={48} className="text-emerald-400 animate-scaleIn" />
            <p className="text-white font-extrabold text-lg mt-5">
              {isLogin ? 'Welcome back!' : 'Account created!'}
            </p>
            <p className="text-zinc-500 text-xs mt-2">Redirecting you now...</p>
          </div>
        ) : (
          <>
            <div className="text-center pt-8 pb-2 px-8">
              <img src={logo} alt="ElexoPlus" className="h-8 mx-auto mb-4 object-contain" />
              <h2 className="text-xl font-black text-white tracking-tight">
                {!isLogin && signupStep === 'verify'
                  ? 'Verify Your Email'
                  : title || (isLogin ? 'Welcome Back' : 'Create Your Account')}
              </h2>
              <p className="text-xs text-zinc-500 mt-1">
                {!isLogin && signupStep === 'verify'
                  ? <>We sent a 6-digit code to <span className="text-zinc-300">{form.email}</span></>
                  : subtitle || (isLogin ? 'Sign in to track orders & manage your account' : 'Join ElexoPlus for faster checkout & order tracking')}
              </p>
            </div>

            {/* Tab switch — hidden mid-verification to avoid an awkward half-state */}
            {signupStep === 'details' && (
              <div className="px-8 pt-5">
                <div className="relative bg-zinc-900 border border-zinc-800 rounded-xl p-1 flex">
                  <div
                    className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-amber-400 rounded-lg transition-transform duration-300 ease-out"
                    style={{ transform: isLogin ? 'translateX(0%)' : 'translateX(calc(100% + 8px))' }}
                  />
                  <button type="button" onClick={() => switchMode(true)}
                    className={`relative z-10 flex-1 py-2 text-xs font-extrabold uppercase tracking-wider rounded-lg transition-colors cursor-pointer ${isLogin ? 'text-black' : 'text-zinc-400 hover:text-white'}`}>
                    Log In
                  </button>
                  <button type="button" onClick={() => switchMode(false)}
                    className={`relative z-10 flex-1 py-2 text-xs font-extrabold uppercase tracking-wider rounded-lg transition-colors cursor-pointer ${!isLogin ? 'text-black' : 'text-zinc-400 hover:text-white'}`}>
                    Sign Up
                  </button>
                </div>
              </div>
            )}

            {/* Google Sign-In — only rendered once GOOGLE_CLIENT_ID is configured */}
            {GOOGLE_CLIENT_ID && signupStep === 'details' && (
              <div className="px-8 pt-5">
                <div ref={googleBtnRef} className="flex justify-center [&>div]:!w-full" />
                {!googleReady && (
                  <div className="h-11 rounded-full bg-zinc-900 border border-zinc-800 animate-pulse" />
                )}
                <div className="flex items-center gap-3 mt-5">
                  <div className="h-px bg-zinc-800 flex-1" />
                  <span className="text-[10px] text-zinc-600 uppercase font-bold tracking-wider">or continue with email</span>
                  <div className="h-px bg-zinc-800 flex-1" />
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="px-8 pt-5 pb-8 space-y-3.5">
              {/* ── SIGNUP · STEP 2 — OTP entry ──────────────────────── */}
              {!isLogin && signupStep === 'verify' ? (
                <>
                  <div>
                    <div className="relative">
                      <ShieldCheck size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600" />
                      <input
                        type="text"
                        inputMode="numeric"
                        autoFocus
                        maxLength={6}
                        placeholder="000000"
                        value={form.otp}
                        onChange={(e) => update('otp')({ target: { value: e.target.value.replace(/\D/g, '').slice(0, 6) } })}
                        className={`w-full pl-10 pr-3.5 py-3 bg-zinc-900 border rounded-xl text-white text-lg tracking-[0.5em] text-center placeholder-zinc-700 focus:outline-none focus:ring-2 transition ${
                          errors.otp ? 'border-rose-500/60 focus:ring-rose-500/40' : 'border-zinc-800 focus:ring-amber-400'
                        }`}
                      />
                    </div>
                    {errors.otp && <p className="text-rose-400 text-[11px] mt-1.5 flex items-center gap-1"><AlertCircle size={11} /> {errors.otp}</p>}
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
                    {loading ? <><Loader2 size={16} className="animate-spin" /> Verifying...</> : 'Verify & Create Account'}
                  </button>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={resetOtpState}
                      className="text-xs font-bold text-zinc-500 hover:text-white transition cursor-pointer flex items-center gap-1"
                    >
                      <ArrowLeft size={12} /> Change details
                    </button>
                    <button
                      type="button"
                      onClick={sendOtp}
                      disabled={resendIn > 0 || otpSending}
                      className="text-xs font-bold text-amber-400 hover:underline transition cursor-pointer disabled:text-zinc-600 disabled:no-underline flex items-center gap-1"
                    >
                      {otpSending ? <Loader2 size={11} className="animate-spin" /> : <RotateCw size={11} />}
                      {resendIn > 0 ? `Resend in ${resendIn}s` : 'Resend code'}
                    </button>
                  </div>
                </>
              ) : (
                /* ── LOGIN, or SIGNUP · STEP 1 — details ──────────────── */
                <>
                  <div className={`overflow-hidden transition-all duration-300 ease-out ${!isLogin ? 'max-h-24 opacity-100 mb-0' : 'max-h-0 opacity-0'}`}>
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
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-300 cursor-pointer" tabIndex={-1}>
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
                    disabled={loading || otpSending}
                    className="w-full py-3.5 rounded-xl text-sm font-extrabold bg-amber-400 hover:bg-amber-500 text-black transition disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-400/10"
                  >
                    {loading || otpSending ? (
                      <><Loader2 size={16} className="animate-spin" /> {isLogin ? 'Signing In...' : 'Sending Code...'}</>
                    ) : isLogin ? 'Log In' : 'Send Verification Code'}
                  </button>
                  {!isLogin && (
                    <p className="text-[10px] text-zinc-600 text-center">
                      We'll email you a 6-digit code to confirm it's really you.
                    </p>
                  )}
                </>
              )}
            </form>

            {signupStep === 'details' && (
              <div className="px-8 pb-6 -mt-2 text-center">
                <button type="button" onClick={() => switchMode(!isLogin)} className="text-xs font-bold text-zinc-500 hover:text-amber-400 transition cursor-pointer">
                  {isLogin ? "New to ElexoPlus? " : "Already have an account? "}
                  <span className="text-amber-400">{isLogin ? 'Create one' : 'Log in'}</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
