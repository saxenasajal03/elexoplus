import React, { useEffect, useState } from 'react';
import { useSearchParams, useLocation, Link } from 'react-router-dom';
import { CheckCircle2, Loader2, AlertCircle, Printer, Home, Package } from 'lucide-react';
import { ENDPOINTS } from '../data/siteContent';
import { formatINR } from '../utils/pricing';
import logo from '../assets/elexoplus-logo-BJqIBdaq.png';

export default function OrderSuccess() {
  const [params] = useSearchParams();
  const location = useLocation();
  const orderId = params.get('id');
  const invoiceNoFromCheckout = location.state?.invoiceNo;

  // Checkout passes the customer's email via navigation state so a customer
  // landing here right after paying never has to type anything. If the page
  // is opened directly (bookmark, refresh after state is lost), we ask once —
  // this mirrors the same privacy rule as the public Track Order page rather
  // than special-casing this one.
  const [verify, setVerify] = useState(location.state?.verify || '');
  const [needsVerify, setNeedsVerify] = useState(!location.state?.verify);
  const [inputValue, setInputValue] = useState('');

  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!orderId || !verify) return;
    setLoading(true);
    setError('');
    fetch(`${ENDPOINTS.trackOrder}?order_id=${encodeURIComponent(orderId)}&verify=${encodeURIComponent(verify)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.order) {
          setOrder(data.order);
          setItems(data.items || []);
        } else {
          setError(data.message || 'We could not find this order.');
        }
      })
      .catch(() => setError('We could not reach our order service right now. Please try again shortly.'))
      .finally(() => setLoading(false));
  }, [orderId, verify]);

  const handleVerifySubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    setVerify(inputValue.trim());
    setNeedsVerify(false);
  };

  if (!orderId) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6 pt-28 font-sans">
        <p className="text-zinc-400">No order reference was provided.</p>
      </div>
    );
  }

  if (needsVerify) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6 pt-28 font-sans">
        <div className="max-w-sm w-full bg-zinc-950 border border-zinc-800 rounded-3xl p-8 text-center">
          <CheckCircle2 size={40} className="text-emerald-400 mx-auto mb-4" />
          <h2 className="text-lg font-extrabold text-white">Order Placed</h2>
          <p className="text-zinc-400 text-xs mt-2 mb-6">
            Enter the email or phone number used at checkout to view your receipt.
          </p>
          <form onSubmit={handleVerifySubmit} className="space-y-3">
            <input
              type="text"
              required
              placeholder="Email or phone number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <button type="submit" className="w-full bg-amber-400 hover:bg-amber-500 text-black font-extrabold py-3 rounded-xl text-xs uppercase tracking-wider transition cursor-pointer">
              View Receipt
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center pt-28 font-sans">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={32} className="text-amber-400 animate-spin" />
          <p className="text-amber-400 text-xs font-bold uppercase tracking-wider">Loading your receipt...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6 pt-28 font-sans text-center">
        <div>
          <AlertCircle size={32} className="text-rose-400 mx-auto mb-4" />
          <p className="text-zinc-300 text-sm mb-6">{error || 'Receipt not found.'}</p>
          <Link to="/" className="text-amber-400 text-xs font-bold hover:underline">Back to Home</Link>
        </div>
      </div>
    );
  }

  const advancePaid = parseFloat(order.advance_paid || 0);
  const codDue = parseFloat(order.cod_due || 0);
  const fullAmount = parseFloat(order.full_amount || 0);

  return (
    <div className="min-h-screen bg-black text-white pt-28 md:pt-36 pb-16 px-4 font-sans print:bg-white print:text-black print:pt-6">
      <div className="max-w-3xl mx-auto">

        <div className="text-center mb-6 print:hidden">
          <CheckCircle2 size={44} className="text-emerald-400 mx-auto mb-3" />
          <h1 className="text-2xl font-black text-white">Order Confirmed!</h1>
          <p className="text-zinc-400 text-sm mt-1">Thank you — a confirmation has been sent to your email.</p>
        </div>

        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 print:bg-white print:border-none">
          <div className="mb-6 border-b border-zinc-800 pb-4 flex justify-between items-start print:border-black/20">
            <img src={logo} alt="ElexoPlus" className="w-28 object-contain" />
            <div className="text-right text-xs text-zinc-400 print:text-black">
              <h2 className="text-base font-extrabold text-white print:text-black">ORDER RECEIPT</h2>
              <p className="mt-0.5">Ref: {order.order_ref}</p>
              {invoiceNoFromCheckout && <p>Invoice: {invoiceNoFromCheckout}</p>}
              <p>{new Date(order.placed_on).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              <span className="inline-block mt-1 bg-amber-400/10 text-amber-400 border border-amber-400/20 px-2 py-0.5 rounded-full font-bold uppercase text-[10px] print:hidden">
                {order.status}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto -mx-2 px-2">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-zinc-900 print:bg-zinc-100">
                  <th className="p-2.5 border border-zinc-800 print:border-zinc-300 font-bold text-zinc-300 print:text-black">Product</th>
                  <th className="p-2.5 text-center border border-zinc-800 print:border-zinc-300 font-bold text-zinc-300 print:text-black">Qty</th>
                  <th className="p-2.5 text-right border border-zinc-800 print:border-zinc-300 font-bold text-zinc-300 print:text-black">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="p-2.5 border border-zinc-800 print:border-zinc-300 text-zinc-300 print:text-black">{item.name || 'Product'}</td>
                    <td className="p-2.5 text-center border border-zinc-800 print:border-zinc-300 text-zinc-300 print:text-black">{item.quantity}</td>
                    <td className="p-2.5 text-right border border-zinc-800 print:border-zinc-300 text-zinc-300 print:text-black">
                      {formatINR(item.price_at_purchase * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-5 p-4 bg-zinc-900 rounded-xl text-sm space-y-1.5 print:bg-zinc-100">
            <div className="flex justify-between"><span className="text-zinc-400 print:text-black">Order Total</span><span className="font-bold text-white print:text-black">{formatINR(fullAmount)}</span></div>
            <div className="flex justify-between"><span className="text-zinc-400 print:text-black">Paid Online</span><span className="font-bold text-emerald-400">{formatINR(advancePaid)}</span></div>
            {codDue > 0 && (
              <div className="flex justify-between"><span className="text-zinc-400 print:text-black">Due on Delivery</span><span className="font-bold text-amber-400">{formatINR(codDue)}</span></div>
            )}
          </div>
        </div>

        <div className="flex justify-between mt-6 print:hidden">
          <Link to="/" className="bg-amber-400 hover:bg-amber-500 text-black font-extrabold px-6 py-3 rounded-full text-xs uppercase tracking-wider transition flex items-center gap-2">
            <Home size={14} /> Home
          </Link>
          <div className="flex gap-3">
            <Link to="/orders" className="border border-zinc-700 hover:border-amber-400/50 text-zinc-300 hover:text-amber-400 px-5 py-3 rounded-full text-xs font-bold transition flex items-center gap-2">
              <Package size={14} /> My Orders
            </Link>
            <button onClick={() => window.print()} className="border border-zinc-700 hover:border-amber-400/50 text-zinc-300 hover:text-amber-400 px-5 py-3 rounded-full text-xs font-bold transition flex items-center gap-2 cursor-pointer">
              <Printer size={14} /> Print
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
