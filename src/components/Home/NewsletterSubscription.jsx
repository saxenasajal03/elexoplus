import React, { useState } from 'react';
import { Mail, CheckCircle2, AlertCircle, Loader2, Send } from 'lucide-react';
import { ENDPOINTS } from '../../data/siteContent';

export default function NewsletterSubscription() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [status, setStatus] = useState(null); // 'success' | 'error' | null
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    setStatus(null);

    try {
      const res = await fetch(ENDPOINTS.newsletter, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await res.json();

      if (data.success) {
        setMsg(data.message || "Thank you for subscribing to ElexoPlus updates!");
        setStatus('success');
        setEmail('');
      } else {
        setMsg(data.message || "We couldn't subscribe that address. Please check it and try again.");
        setStatus('error');
      }
    } catch (err) {
      setMsg("Subscription failed. Please check your network connection.");
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white py-16 px-4 font-sans">
      <div className="max-w-4xl mx-auto relative overflow-hidden rounded-3xl border border-zinc-200 bg-gradient-to-br from-amber-50 via-white to-orange-50 p-8 md:p-12 shadow-xl">
        {/* Ambient Glow Effects */}
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-rose-600/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center justify-between">
          <div className="flex-1 space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-amber-400/10 text-amber-600 border border-amber-400/20 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider mb-2">
              <Mail size={14} /> Stay Connected
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-zinc-900 tracking-tight">
              Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-rose-500">ElexoPlus</span> Club
            </h2>
            <p className="text-zinc-500 text-sm max-w-md font-medium leading-relaxed">
              Subscribe for early access to new product releases, exclusive seasonal appliance discounts, and B2B distributor announcements.
            </p>
          </div>

          <form onSubmit={submit} className="flex-1 w-full max-w-md space-y-3">
            <div className="relative">
              <input
                type="email"
                required
                placeholder="Enter your email address..."
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={loading}
                className="w-full bg-zinc-100/90 border border-zinc-300 focus:border-amber-400 rounded-2xl px-4 py-3.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none transition shadow-inner"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-400 hover:bg-amber-500 disabled:bg-zinc-200 text-black font-extrabold py-3.5 rounded-2xl text-xs uppercase tracking-wider transition shadow-lg shadow-amber-400/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Subscribing...
                </>
              ) : (
                <>
                  <Send size={16} /> Subscribe Now
                </>
              )}
            </button>

            {msg && (
              <div className={`p-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 animate-fadeIn ${
                status === 'success' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
              }`}>
                {status === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                {msg}
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}