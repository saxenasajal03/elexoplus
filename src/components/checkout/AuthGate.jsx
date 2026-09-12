import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import AuthModal from '../AuthModal';

/**
 * Blocks access to sensitive actions (checkout) until the user logs in.
 * Per the request: "user should be logged in for buying anything instead
 * of asking address" — this replaces the old pattern of collecting a raw
 * shipping address from an anonymous visitor on every single order.
 */
export default function AuthGate({ title, subtitle }) {
  const [showAuth, setShowAuth] = useState(false);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-zinc-950 border border-zinc-800 rounded-3xl p-10 text-center">
        <div className="w-14 h-14 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 mx-auto mb-5">
          <Lock size={24} />
        </div>
        <h2 className="text-xl font-extrabold text-white">{title || 'Please Log In to Continue'}</h2>
        <p className="text-zinc-400 text-sm mt-3 leading-relaxed">
          {subtitle || 'Log in or create a free account to use saved addresses, track your order, and check out faster.'}
        </p>
        <button
          type="button"
          onClick={() => setShowAuth(true)}
          className="mt-7 bg-amber-400 hover:bg-amber-500 text-black font-extrabold px-8 py-3.5 rounded-full text-xs uppercase tracking-wider transition cursor-pointer"
        >
          Log In / Sign Up
        </button>
      </div>
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </div>
  );
}
