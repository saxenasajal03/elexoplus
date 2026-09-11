import React, { useState } from 'react';
import { ShieldCheck, ScanLine, CheckCircle2, AlertTriangle } from 'lucide-react';
import PageHero from '../components/common/PageHero';
import { API_BASE } from '../data/siteContent';

export default function ProductAuthentication() {
  const [serial, setSerial] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // { verified, product_name, model, batch, message }
  const [error, setError] = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!serial.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await fetch(`${API_BASE}/product_authentication.php?serial_no=${encodeURIComponent(serial.trim().toUpperCase())}`);
      if (!res.ok) throw new Error('unreachable');
      const data = await res.json();
      if (data && (data.verified !== undefined || data.success !== undefined)) {
        setResult(data);
      } else {
        setError("We couldn't reach the verification service right now. Please try again shortly, or contact Customer Care to confirm authenticity.");
      }
    } catch {
      setError("We couldn't reach the verification service right now. Please try again shortly, or contact Customer Care to confirm authenticity.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-slate-100 font-sans selection:bg-amber-400 selection:text-black">
      <PageHero
        eyebrow="Product Authentication"
        title="Verify Your Product's Authenticity"
        subtitle="Enter the serial number printed on your product's QR sticker to confirm it is a genuine ElexoPlus appliance."
      />

      <div className="max-w-xl mx-auto px-6 py-16">
        <form onSubmit={handleVerify} className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1">
            <ScanLine size={14} className="text-amber-400" /> Found on the QR sticker on your product body
          </div>
          <input
            type="text"
            required
            placeholder="Enter Serial Number (e.g. EP-MX-2026-000001)"
            value={serial}
            onChange={(e) => setSerial(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-400 uppercase"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-400 hover:bg-amber-500 text-black font-extrabold py-3.5 rounded-xl text-xs uppercase tracking-wider transition cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
          >
            <ShieldCheck size={15} /> {loading ? 'Verifying...' : 'Verify Product'}
          </button>
        </form>

        {error && (
          <div className="mt-6 bg-zinc-950 border border-amber-500/20 rounded-2xl p-5 flex items-start gap-3">
            <AlertTriangle size={20} className="text-amber-400 shrink-0 mt-0.5" />
            <p className="text-sm text-zinc-300">{error}</p>
          </div>
        )}

        {result && (
          <div className={`mt-6 rounded-2xl p-6 border ${result.verified ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-rose-500/5 border-rose-500/30'}`}>
            <div className="flex items-center gap-3">
              {result.verified ? <CheckCircle2 className="text-emerald-400" size={24} /> : <AlertTriangle className="text-rose-400" size={24} />}
              <p className={`font-extrabold text-lg ${result.verified ? 'text-emerald-400' : 'text-rose-400'}`}>
                {result.verified ? 'Genuine ElexoPlus Product' : 'Could Not Verify This Serial'}
              </p>
            </div>
            {result.verified && (
              <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <div><p className="text-zinc-500">Product</p><p className="text-white font-bold">{result.product_name || '—'}</p></div>
                <div><p className="text-zinc-500">Model</p><p className="text-white font-bold">{result.model || '—'}</p></div>
                <div><p className="text-zinc-500">Batch</p><p className="text-white font-bold">{result.batch || '—'}</p></div>
                <div><p className="text-zinc-500">Manufactured</p><p className="text-white font-bold">{result.mfg_date || '—'}</p></div>
              </div>
            )}
            {!result.verified && (
              <p className="text-xs text-zinc-400 mt-3">
                If you believe this is a genuine ElexoPlus product, please contact Customer Care with your invoice for manual verification.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
