import React, { useState } from 'react';
import { Search, PackageSearch, CheckCircle2 } from 'lucide-react';
import PageHero from '../components/common/PageHero';
import { B2B_API_BASE } from '../data/siteContent';

const statusSteps = ['Created', 'Processing', 'Shipped', 'Delivered'];

export default function TrackOrder() {
  const [orderId, setOrderId] = useState('');
  const [verify, setVerify] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [order, setOrder] = useState(null);
  const [scans, setScans] = useState([]);

  const handleTrack = async (e) => {
    e.preventDefault();
    setError('');
    setOrder(null);
    setScans([]);
    if (!orderId.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`${B2B_API_BASE}/get-order-receipt.php?id=${encodeURIComponent(orderId.trim())}`);
      const data = await res.json();
      const o = data?.order;
      if (!o) {
        setError('We could not find an order with that ID. Please double-check and try again.');
        return;
      }
      // Basic privacy check: confirm the email/phone entered matches the order on file.
      const match = verify.trim() && (
        (o.customer_email || '').toLowerCase() === verify.trim().toLowerCase() ||
        (o.customer_contact || '').replace(/\D/g, '').endsWith(verify.trim().replace(/\D/g, ''))
      );
      if (!match) {
        setError('The email or phone number entered does not match this order. Please verify and try again.');
        return;
      }
      setOrder(o);

      if (o.tracking_id) {
        const trackRes = await fetch(`${B2B_API_BASE}/track-order.php?awb=${encodeURIComponent(o.tracking_id)}`);
        const trackData = await trackRes.json().catch(() => null);
        const shipment = trackData?.ShipmentData?.[0]?.Shipment;
        const sortedScans = [...(shipment?.Scans || [])].sort((a, b) => new Date(b.ScanDetail.ScanDateTime) - new Date(a.ScanDetail.ScanDateTime));
        setScans(sortedScans);
      }
    } catch {
      setError('Something went wrong while fetching your order. Please try again in a moment.');
    } finally {
      setLoading(false);
    }
  };

  const currentStepIndex = order ? Math.max(0, statusSteps.indexOf(order.status)) : -1;

  return (
    <div className="min-h-screen bg-black text-slate-100 font-sans selection:bg-amber-400 selection:text-black">
      <PageHero
        eyebrow="Track Order"
        title="Where's My Order?"
        subtitle="Enter your Order ID along with the email or phone number used at checkout to see live shipment status."
      />

      <div className="max-w-2xl mx-auto px-6 py-16">
        <form onSubmit={handleTrack} className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <input
            type="text"
            required
            placeholder="Order ID (e.g. 12345)"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <input
            type="text"
            required
            placeholder="Registered Email or Phone Number"
            value={verify}
            onChange={(e) => setVerify(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-400 hover:bg-amber-500 text-black font-extrabold py-3.5 rounded-xl text-xs uppercase tracking-wider transition cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
          >
            <Search size={15} /> {loading ? 'Searching...' : 'Track Order'}
          </button>
        </form>

        {error && <p className="text-rose-400 text-sm mt-5 text-center">{error}</p>}

        {order && (
          <div className="mt-8 bg-zinc-950 border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="text-xs text-zinc-500">Order</p>
                <p className="text-white font-extrabold text-lg">#{order.display_order_no || orderId}</p>
              </div>
              <span className="bg-amber-400/10 text-amber-400 border border-amber-400/20 px-3 py-1.5 rounded-full text-xs font-bold uppercase">
                {order.status}
              </span>
            </div>

            {/* Status stepper */}
            <div className="flex items-center justify-between mt-8 mb-2">
              {statusSteps.map((step, idx) => (
                <div key={step} className="flex-1 flex flex-col items-center relative">
                  {idx > 0 && (
                    <div className={`absolute top-3 -left-1/2 w-full h-0.5 ${idx <= currentStepIndex ? 'bg-amber-400' : 'bg-zinc-800'}`} />
                  )}
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center z-10 ${idx <= currentStepIndex ? 'bg-amber-400 text-black' : 'bg-zinc-800 text-zinc-500'}`}>
                    {idx <= currentStepIndex ? <CheckCircle2 size={14} /> : <span className="text-[10px]">{idx + 1}</span>}
                  </div>
                  <span className={`text-[10px] mt-2 font-bold uppercase tracking-wide ${idx <= currentStepIndex ? 'text-amber-400' : 'text-zinc-600'}`}>{step}</span>
                </div>
              ))}
            </div>

            {order.tracking_id && (
              <p className="text-xs text-zinc-500 text-center mt-4">AWB / Tracking ID: <span className="text-zinc-300 font-mono">{order.tracking_id}</span> ({order.courier || 'Delhivery'})</p>
            )}

            {scans.length > 0 && (
              <div className="mt-8 pt-6 border-t border-zinc-800 space-y-4">
                <h4 className="text-white font-bold text-sm flex items-center gap-2"><PackageSearch size={16} className="text-amber-400" /> Shipment History</h4>
                {scans.map((s, idx) => (
                  <div key={idx} className="border-l-2 border-amber-400/40 pl-4 py-0.5">
                    <p className="font-bold text-xs text-amber-400">{s.ScanDetail.Instructions || s.ScanDetail.Status}</p>
                    <p className="text-[11px] text-zinc-500">{s.ScanDetail.ScannedLocation} — {new Date(s.ScanDetail.ScanDateTime).toLocaleString('en-IN')}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
