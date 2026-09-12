import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MapPin, Tag, Loader2, ShieldCheck, ChevronLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import AuthGate from '../components/checkout/AuthGate';
import AddressBook from '../components/checkout/AddressBook';
import PaymentModeSelector from '../components/checkout/PaymentModeSelector';
import { getCartTotals, formatINR } from '../utils/pricing';
import { getPaymentSettings, defaultPaymentSettings, B2B_API_BASE } from '../data/siteContent';

export default function Checkout() {
  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [settings, setSettings] = useState(defaultPaymentSettings);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedMode, setSelectedMode] = useState(null);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getPaymentSettings().then((s) => {
      setSettings(s);
      const firstEnabled = Object.entries(s.modes).find(([, m]) => m.enabled)?.[0];
      setSelectedMode(firstEnabled || 'online');
    });
  }, []);

  // Redirect to store if the cart is empty (nothing to check out).
  useEffect(() => {
    if (cartItems.length === 0) navigate('/store');
  }, [cartItems, navigate]);

  if (!user) {
    return (
      <div className="min-h-screen bg-black pt-28 md:pt-36">
        <AuthGate
          title="Log In to Complete Your Order"
          subtitle="For faster, more secure checkout, ElexoPlus requires an account — this lets you save addresses, track orders, and manage warranty claims in one place."
        />
      </div>
    );
  }

  const { subtotal, mrpTotal } = getCartTotals(cartItems);
  const savings = mrpTotal - subtotal;
  const deliveryFee = subtotal >= settings.free_delivery_above ? 0 : settings.delivery_fee;
  const total = subtotal + deliveryFee;

  const codFee = selectedMode === 'cod' ? settings.cod_fee_flat : 0;
  const grandTotal = total + codFee;
  const advanceAmount = selectedMode === 'partial' ? Math.round((grandTotal * settings.partial_advance_percent) / 100) : grandTotal;
  const codDue = grandTotal - advanceAmount;

  const buildAddressString = (a) =>
    `${a.full_name}, ${a.address_line1}${a.address_line2 ? ', ' + a.address_line2 : ''}, ${a.city}, ${a.state} - ${a.pincode}${a.landmark ? ' (Near ' + a.landmark + ')' : ''} | Phone: ${a.phone}`;

  const handlePlaceOrder = async () => {
    setError('');
    if (!selectedAddress) { setError('Please select or add a delivery address.'); return; }
    if (!selectedMode) { setError('Please select a payment method.'); return; }

    setPlacing(true);
    const customerDetails = {
      name: selectedAddress.full_name,
      email: user.email,
      contact: selectedAddress.phone,
      address: buildAddressString(selectedAddress),
    };

    try {
      if (selectedMode === 'cod') {
        // Req #32 — full Cash on Delivery, no upfront online payment.
        const res = await fetch(`${B2B_API_BASE}/place_cod_order.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customerDetails,
            cartItems,
            full_amount: grandTotal,
            cod_due: grandTotal,
            payment_terms: 'COD',
          }),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message || 'Could not place your COD order.');
        clearCart();
        navigate(`/order-success?id=${data.order_id}`);
        return;
      }

      // Req #31 (online) / #33 (partial) — both go through Razorpay for the
      // upfront-collected portion, using your existing endpoints unchanged.
      const res = await fetch(`${B2B_API_BASE}/create-razorpay-order.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round(advanceAmount * 100),
          full_amount: grandTotal,
          cod_due: codDue,
          payment_terms: selectedMode === 'partial' ? 'PartialAdvance' : 'Advance',
          customerDetails,
          cartItems,
        }),
      });
      const data = await res.json();
      if (!data.order_id) throw new Error('Payment initialization failed. Please try again.');

      const options = {
        key: 'rzp_live_Rp0cuYaWQxJjb6',
        amount: Math.round(advanceAmount * 100),
        currency: 'INR',
        name: 'ELEXOPLUS',
        order_id: data.order_id,
        handler: async (response) => {
          await fetch(`${B2B_API_BASE}/verify-payment.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(response),
          });
          clearCart();
          navigate(`/order-success?id=${response.razorpay_order_id}`);
        },
        modal: { ondismiss: () => setPlacing(false) },
        prefill: { name: customerDetails.name, email: customerDetails.email, contact: customerDetails.contact },
        theme: { color: '#F59E0B' },
      };
      new window.Razorpay(options).open();
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-28 md:pt-36 px-4 md:px-12 pb-20 font-sans">
      <div className="container mx-auto max-w-5xl">
        <Link to="/cart" className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-amber-400 mb-6">
          <ChevronLeft size={14} /> Back to Cart
        </Link>
        <h1 className="text-2xl md:text-3xl font-black mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Step 1 — Delivery Address */}
            <section>
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-zinc-400 mb-4 flex items-center gap-2">
                <MapPin size={16} className="text-amber-400" /> 1. Delivery Address
              </h2>
              <AddressBook mode="select" selectedId={selectedAddress?.id} onSelect={setSelectedAddress} />
            </section>

            {/* Step 2 — Payment Method */}
            <section>
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-zinc-400 mb-4 flex items-center gap-2">
                <ShieldCheck size={16} className="text-amber-400" /> 2. Payment Method
              </h2>
              <PaymentModeSelector settings={settings} selected={selectedMode} onSelect={setSelectedMode} total={total} />
            </section>
          </div>

          {/* Order Summary */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 h-fit sticky top-32">
            <h2 className="text-lg font-extrabold mb-4">Order Summary</h2>

            {savings > 0 && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-2.5 flex items-center gap-2 mb-4">
                <Tag size={14} className="text-emerald-400 shrink-0" />
                <p className="text-emerald-400 text-xs font-bold">You're saving {formatINR(savings)} on this order!</p>
              </div>
            )}

            <div className="space-y-2 text-sm">
              {savings > 0 && (
                <div className="flex justify-between text-zinc-500">
                  <span>M.R.P. Total</span><span className="line-through">{formatINR(mrpTotal)}</span>
                </div>
              )}
              <div className="flex justify-between py-2 border-b border-zinc-800">
                <span className="text-zinc-400">Subtotal</span><span className="font-bold text-white">{formatINR(subtotal)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-zinc-800">
                <span className="text-zinc-400">Delivery</span>
                <span className={`font-bold ${deliveryFee === 0 ? 'text-emerald-400' : 'text-white'}`}>{deliveryFee === 0 ? 'FREE' : formatINR(deliveryFee)}</span>
              </div>
              {codFee > 0 && (
                <div className="flex justify-between py-2 border-b border-zinc-800">
                  <span className="text-zinc-400">COD Handling Fee</span><span className="font-bold text-white">{formatINR(codFee)}</span>
                </div>
              )}
              <div className="flex justify-between py-3 font-black text-xl text-amber-400">
                <span>Total</span><span>{formatINR(grandTotal)}</span>
              </div>

              {selectedMode === 'partial' && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 space-y-1 text-xs">
                  <div className="flex justify-between"><span className="text-zinc-400">Pay Now (Online)</span><span className="font-bold text-white">{formatINR(advanceAmount)}</span></div>
                  <div className="flex justify-between"><span className="text-zinc-400">Pay on Delivery</span><span className="font-bold text-white">{formatINR(codDue)}</span></div>
                </div>
              )}
            </div>

            {error && <p className="text-rose-400 text-xs mt-4">{error}</p>}

            <button
              onClick={handlePlaceOrder}
              disabled={placing}
              className="w-full bg-amber-400 hover:bg-amber-500 text-black font-extrabold py-3.5 rounded-full mt-5 flex items-center justify-center gap-2 transition cursor-pointer text-xs uppercase tracking-wider disabled:opacity-60"
            >
              {placing ? <Loader2 size={15} className="animate-spin" /> : null}
              {placing
                ? 'Processing...'
                : selectedMode === 'cod'
                ? 'Place COD Order'
                : `Pay ${formatINR(advanceAmount)} & Place Order`}
            </button>
            <p className="text-[10px] text-zinc-600 text-center mt-3">
              By placing this order, you agree to our{' '}
              <Link to="/policy" className="text-zinc-400 hover:text-amber-400 underline">Terms & Policies</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
