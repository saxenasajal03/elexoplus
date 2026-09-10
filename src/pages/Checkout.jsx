import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Checkout() {
  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', contact: '', address: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  const subtotal = cartItems.reduce((acc, item) => acc + parseFloat(item.price) * item.quantity, 0);
  const total = subtotal > 0 ? subtotal + 50 : 0;
  const advance = total * 0.4;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("https://b2b.elexoplus.in/api/create-razorpay-order.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Math.round(advance * 100),
          full_amount: total,
          customerDetails: form,
          cartItems
        })
      });
      const data = await res.json();
      if (!data.order_id) throw new Error("Order creation failed");

      const options = {
        key: "rzp_live_Rp0cuYaWQxJjb6",
        amount: Math.round(advance * 100),
        currency: "INR",
        name: "ELEXOPLUS",
        order_id: data.order_id,
        handler: async (response) => {
          await fetch("https://b2b.elexoplus.in/api/verify-payment.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response)
          });
          clearCart();
          navigate(`/order-success?id=${response.razorpay_order_id}`);
        },
        prefill: form,
        theme: { color: "#F59E0B" }
      };
      new window.Razorpay(options).open();
    } catch(err) {
      alert(err.message || "Payment initialization failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-28 px-4 md:px-12 pb-20">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>
        <form onSubmit={handleSubmit} className="bg-gray-900 p-6 rounded-lg space-y-4">
          <div>
            <label className="block text-sm text-gray-400">Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
              className="w-full bg-gray-800 p-2 rounded mt-1 text-white border border-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400">Mobile Number</label>
            <input
              type="tel"
              required
              value={form.contact}
              onChange={e => setForm({...form, contact: e.target.value})}
              className="w-full bg-gray-800 p-2 rounded mt-1 text-white border border-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400">Email Address</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={e => setForm({...form, email: e.target.value})}
              className="w-full bg-gray-800 p-2 rounded mt-1 text-white border border-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400">Shipping Address (City, State, PIN)</label>
            <textarea
              required
              rows="3"
              value={form.address}
              onChange={e => setForm({...form, address: e.target.value})}
              className="w-full bg-gray-800 p-2 rounded mt-1 text-white border border-gray-700"
            />
          </div>

          <div className="border-t border-gray-800 pt-4 mt-4">
            <p className="text-lg">Total Amount: <strong>₹ {total.toFixed(2)}</strong></p>
            <p className="text-yellow font-bold text-xl">Pay 40% Advance: ₹ {advance.toFixed(2)}</p>
            <p className="text-xs text-gray-500 mt-1">Remaining 60% will be collected on Cash on Delivery.</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow text-black font-bold py-3 rounded-full hover:bg-yellow-400 mt-6"
          >
            {loading ? "Processing..." : "Pay Advance & Place Order"}
          </button>
        </form>
      </div>
    </div>
  );
}
