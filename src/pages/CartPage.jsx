import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Tag, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import CartItemCard from '../components/Cart/CartItemCard';
import AuthModal from '../components/AuthModal';
import { getCartTotals, formatINR } from '../utils/pricing';
import { getPaymentSettings, defaultPaymentSettings } from '../data/siteContent';

export default function CartPage() {
  const { cartItems, removeItem, updateQuantity } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showAuth, setShowAuth] = useState(false);
  const [settings, setSettings] = useState(defaultPaymentSettings);

  useEffect(() => {
    getPaymentSettings().then(setSettings);
  }, []);

  const { subtotal, mrpTotal, itemCount } = getCartTotals(cartItems);
  const savings = mrpTotal - subtotal;
  const deliveryFee = subtotal >= settings.free_delivery_above ? 0 : settings.delivery_fee;
  const total = subtotal > 0 ? subtotal + deliveryFee : 0;

  const handleCheckout = () => {
    if (!user) {
      setShowAuth(true);
      return;
    }
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-black text-white pt-28 md:pt-36 px-4 md:px-12 pb-20 font-sans">
      <div className="container mx-auto max-w-5xl">
        <h1 className="text-2xl md:text-3xl font-black mb-8 flex items-center gap-3">
          <ShoppingBag className="text-amber-400" size={26} /> Your Cart
          {itemCount > 0 && <span className="text-sm font-medium text-zinc-500">({itemCount} item{itemCount !== 1 ? 's' : ''})</span>}
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-20 border border-zinc-800 rounded-3xl bg-zinc-950">
            <ShoppingBag size={40} className="text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-400 mb-6">Your cart is empty.</p>
            <Link to="/store" className="bg-amber-400 hover:bg-amber-500 text-black px-8 py-3 rounded-full font-extrabold text-xs uppercase tracking-wider transition">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <CartItemCard key={item.variantKey} item={item} onRemove={removeItem} onQuantityChange={updateQuantity} />
              ))}
            </div>

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
                  <span className={`font-bold ${deliveryFee === 0 ? 'text-emerald-400' : 'text-white'}`}>
                    {deliveryFee === 0 ? 'FREE' : formatINR(deliveryFee)}
                  </span>
                </div>
                {deliveryFee > 0 && (
                  <p className="text-[11px] text-zinc-600">
                    Add {formatINR(settings.free_delivery_above - subtotal)} more for free delivery
                  </p>
                )}
                <div className="flex justify-between py-4 font-black text-xl text-amber-400">
                  <span>Total</span><span>{formatINR(total)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-amber-400 hover:bg-amber-500 text-black font-extrabold py-3.5 rounded-full mt-2 flex items-center justify-center gap-2 transition cursor-pointer text-xs uppercase tracking-wider"
              >
                Proceed to Checkout <ArrowRight size={15} />
              </button>
              {!user && (
                <p className="text-[11px] text-zinc-600 text-center mt-3">You'll be asked to log in before checkout</p>
              )}
            </div>
          </div>
        )}
      </div>

      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onSuccess={() => navigate('/checkout')}
          title="Log In to Checkout"
          subtitle="Use saved addresses and track this order easily."
        />
      )}
    </div>
  );
}
