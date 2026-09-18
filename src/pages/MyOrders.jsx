import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Loader2, ChevronDown, MapPin, Truck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ENDPOINTS } from '../data/siteContent';
import { formatINR } from '../utils/pricing';

const statusColor = {
  Created: 'bg-zinc-800 text-zinc-300',
  Pending: 'bg-amber-400/10 text-amber-400 border border-amber-400/20',
  Paid: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  Partial_Paid: 'bg-amber-400/10 text-amber-400 border border-amber-400/20',
  Processing: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  Shipped: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
  Delivered: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  Cancelled: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
};

function OrderDetail({ orderRef, email }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${ENDPOINTS.trackOrder}?order_id=${encodeURIComponent(orderRef)}&verify=${encodeURIComponent(email)}`)
      .then((r) => r.json())
      .then((d) => setData(d.success ? d : null))
      .finally(() => setLoading(false));
  }, [orderRef, email]);

  if (loading) {
    return <div className="mt-4 flex items-center gap-2 text-xs text-zinc-500"><Loader2 size={13} className="animate-spin" /> Loading details...</div>;
  }
  if (!data) {
    return <p className="mt-4 text-xs text-rose-400">Could not load order details right now.</p>;
  }

  const scans = data.scans || [];

  return (
    <div className="mt-4 pt-4 border-t border-zinc-800 space-y-4">
      <div>
        <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Items</h4>
        <div className="space-y-2">
          {(data.items || []).map((item, idx) => (
            <div key={idx} className="flex justify-between items-center bg-zinc-900 px-3 py-2.5 rounded-xl text-sm">
              <div>
                <p className="font-medium text-white">{item.name || 'Product'}</p>
                <p className="text-xs text-zinc-500">Qty: {item.quantity}</p>
              </div>
              <p className="font-semibold text-amber-400">{formatINR(item.price_at_purchase * item.quantity)}</p>
            </div>
          ))}
        </div>
      </div>

      {data.tracking_available && (
        <div>
          <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Truck size={13} className="text-amber-400" /> Shipment Tracking
          </h4>
          {data.courier_status === 'UNAVAILABLE' ? (
            <p className="text-xs text-amber-400/80">Live courier status is temporarily unavailable. Please check back shortly.</p>
          ) : scans.length === 0 ? (
            <p className="text-xs text-zinc-500">No scans yet — your shipment will update here once picked up.</p>
          ) : (
            <div className="space-y-3">
              {scans.map((s, idx) => (
                <div key={idx} className="border-l-2 border-amber-400/50 pl-3 py-0.5">
                  <p className="font-bold text-xs text-amber-400">{s.detail || s.status}</p>
                  <p className="text-[11px] text-zinc-500">{s.location} — {s.time ? new Date(s.time).toLocaleString('en-IN') : ''}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function MyOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    if (!user?.id) { setLoading(false); return; }
    fetch(`${ENDPOINTS.myOrders}?user_id=${encodeURIComponent(user.id)}`)
      .then((r) => r.json())
      .then((d) => setOrders(d.success ? d.orders || [] : []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center pt-28 font-sans px-6 text-center">
        <p className="text-zinc-400">Please log in to view your orders.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-4 md:px-10 pt-28 md:pt-36 pb-20 font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-black mb-8 flex items-center gap-3">
          <Package className="text-amber-400" size={26} /> Your Orders
        </h1>

        {loading ? (
          <div className="flex items-center gap-2 text-zinc-500 text-sm py-10 justify-center">
            <Loader2 size={18} className="animate-spin" /> Loading your orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 border border-zinc-800 rounded-3xl bg-zinc-950">
            <Package size={36} className="text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-400 mb-6">You haven't placed any orders yet.</p>
            <Link to="/store" className="bg-amber-400 hover:bg-amber-500 text-black px-8 py-3 rounded-full font-extrabold text-xs uppercase tracking-wider transition">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((o) => {
              const isOpen = expandedId === o.order_id;
              return (
                <div key={o.order_id} className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                      <div>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Order</p>
                        <p className="font-bold text-sm text-white font-mono">{o.razorpay_order_id}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Date</p>
                        <p className="text-sm text-zinc-300">{new Date(o.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Total</p>
                        <p className="text-sm font-bold text-amber-400">{formatINR(o.full_amount)}</p>
                      </div>
                      <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${statusColor[o.status] || 'bg-zinc-800 text-zinc-300'}`}>
                        {o.status}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setExpandedId(isOpen ? null : o.order_id)}
                      className="text-amber-400 text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      {isOpen ? 'Hide Details' : 'View Details'}
                      <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                  </div>

                  {isOpen && <OrderDetail orderRef={o.razorpay_order_id} email={user.email} />}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
