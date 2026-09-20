import React, { useState } from 'react';
import { Search, PackageSearch, CheckCircle2, AlertTriangle } from 'lucide-react';
import PageHero from '../components/common/PageHero';
import { ENDPOINTS } from '../data/siteContent';
import { formatINR } from '../utils/pricing';

const statusSteps = ['Created', 'Paid', 'Processing', 'Shipped', 'Delivered'];

export default function TrackOrder() {
  const [orderId, setOrderId] = useState('');
  const [verify, setVerify] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [scans, setScans] = useState([]);
  const [courierUnavailable, setCourierUnavailable] = useState(false);

  const handleTrack = async (e) => {
    e.preventDefault();
    setError('');
    setOrder(null);
    setItems([]);
    setScans([]);
    setCourierUnavailable(false);
    if (!orderId.trim() || !verify.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(
        `${ENDPOINTS.trackOrder}?order_id=${encodeURIComponent(orderId.trim())}&verify=${encodeURIComponent(verify.trim())}`
      );
      const data = await res.json();

      if (!data.success || !data.order) {
        setError(data.message || 'We could not find an order matching those details.');
        return;
      }

      setOrder(data.order);
      setItems(data.items || []);
      setScans(data.scans || []);
      setCourierUnavailable(data.courier_status === 'UNAVAILABLE');
    } catch {
      setError('Something went wrong while fetching your order. Please try again in a moment.');
    } finally {
      setLoading(false);
    }
  };

  // COD orders show a simpler status track — "Paid" never applies to them.
  const relevantSteps = order?.payment_terms === 'COD'
    ? statusSteps.filter((s) => s !== 'Paid')
    : statusSteps;
  const currentStepIndex = order ? Math.max(0, relevantSteps.indexOf(order.status)) : -1;

  return (
    <div className="min-h-screen bg-white text-slate-100 font-sans selection:bg-amber-400 selection:text-black">
      <PageHero
        eyebrow="Track Order"
        title="Where's My Order?"
        subtitle="Enter your Order ID along with the email or phone number used at checkout to see live shipment status."
      />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <form onSubmit={handleTrack} noValidate className="bg-white border border-zinc-200 rounded-2xl p-5 sm:p-6 space-y-4">
          <input
            type="text"
            required
            placeholder="Order ID / Reference (e.g. COD-9F3A1B2C or order_Nxy...)"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="w-full bg-zinc-100 border border-zinc-200 rounded-xl px-4 py-3.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <input
            type="text"
            required
            placeholder="Registered Email or Phone Number"
            value={verify}
            onChange={(e) => setVerify(e.target.value)}
            className="w-full bg-zinc-100 border border-zinc-200 rounded-xl px-4 py-3.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-400 hover:bg-amber-500 text-black font-extrabold py-3.5 rounded-xl text-xs uppercase tracking-wider transition cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
          >
            <Search size={15} /> {loading ? 'Searching...' : 'Track Order'}
          </button>
        </form>

        {error && <p className="text-rose-600 text-sm mt-5 text-center">{error}</p>}

        {order && (
          <div className="mt-8 bg-white border border-zinc-200 rounded-2xl p-5 sm:p-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="text-xs text-zinc-500">Order</p>
                <p className="text-zinc-900 font-extrabold text-lg font-mono break-all">{order.order_ref}</p>
              </div>
              <span className="bg-amber-400/10 text-amber-600 border border-amber-400/20 px-3 py-1.5 rounded-full text-xs font-bold uppercase shrink-0">
                {order.status}
              </span>
            </div>

            {/* Status stepper */}
            <div className="flex items-center justify-between mt-8 mb-2">
              {relevantSteps.map((step, idx) => (
                <div key={step} className="flex-1 flex flex-col items-center relative">
                  {idx > 0 && (
                    <div className={`absolute top-3 -left-1/2 w-full h-0.5 ${idx <= currentStepIndex ? 'bg-amber-400' : 'bg-zinc-200'}`} />
                  )}
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center z-10 ${idx <= currentStepIndex ? 'bg-amber-400 text-black' : 'bg-zinc-200 text-zinc-500'}`}>
                    {idx <= currentStepIndex ? <CheckCircle2 size={14} /> : <span className="text-[10px]">{idx + 1}</span>}
                  </div>
                  <span className={`text-[9px] sm:text-[10px] mt-2 font-bold uppercase tracking-wide text-center ${idx <= currentStepIndex ? 'text-amber-600' : 'text-zinc-600'}`}>{step}</span>
                </div>
              ))}
            </div>

            {/* Payment summary */}
            <div className="mt-6 pt-5 border-t border-zinc-200 grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-[10px] text-zinc-500 uppercase">Order Total</p>
                <p className="text-sm font-bold text-zinc-900 mt-0.5">{formatINR(order.full_amount)}</p>
              </div>
              <div>
                <p className="text-[10px] text-zinc-500 uppercase">Paid</p>
                <p className="text-sm font-bold text-emerald-600 mt-0.5">{formatINR(order.advance_paid)}</p>
              </div>
              <div>
                <p className="text-[10px] text-zinc-500 uppercase">Due on Delivery</p>
                <p className="text-sm font-bold text-amber-600 mt-0.5">{formatINR(order.cod_due)}</p>
              </div>
            </div>

            {items.length > 0 && (
              <div className="mt-6 pt-5 border-t border-zinc-200 space-y-2">
                {items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-xs">
                    <span className="text-zinc-600">{item.name || 'Product'} × {item.quantity}</span>
                    <span className="text-zinc-500">{formatINR(item.price_at_purchase * item.quantity)}</span>
                  </div>
                ))}
              </div>
            )}

            {order.tracking_id && (
              <p className="text-xs text-zinc-500 text-center mt-5">
                AWB / Tracking ID: <span className="text-zinc-600 font-mono">{order.tracking_id}</span> ({order.courier || 'Delhivery'})
              </p>
            )}

            {courierUnavailable && (
              <div className="mt-5 bg-amber-500/5 border border-amber-500/30 rounded-xl px-4 py-3 flex items-start gap-2">
                <AlertTriangle size={15} className="text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs text-zinc-600">
                  Live courier status is temporarily unavailable. Your order status above is still accurate — please check back shortly for shipment scans.
                </p>
              </div>
            )}

            {scans.length > 0 && (
              <div className="mt-6 pt-5 border-t border-zinc-200 space-y-4">
                <h4 className="text-zinc-900 font-bold text-sm flex items-center gap-2"><PackageSearch size={16} className="text-amber-600" /> Shipment History</h4>
                {scans.map((s, idx) => (
                  <div key={idx} className="border-l-2 border-amber-400/40 pl-4 py-0.5">
                    <p className="font-bold text-xs text-amber-600">{s.detail || s.status}</p>
                    <p className="text-[11px] text-zinc-500">{s.location} — {s.time ? new Date(s.time).toLocaleString('en-IN') : ''}</p>
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
