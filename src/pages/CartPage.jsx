import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartItemCard from '../components/Cart/CartItemCard';

export default function CartPage() {
  const { cartItems, removeItem, updateQuantity } = useCart();
  const navigate = useNavigate();

  const subtotal = cartItems.reduce((acc, item) => acc + parseFloat(item.price) * item.quantity, 0);
  const total = subtotal > 0 ? subtotal + 50 : 0;

  return (
    <div className="min-h-screen bg-black text-white pt-28 px-4 md:px-12">
      <div className="container mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold mb-8">Cart</h1>
        {cartItems.length === 0 ? (
          <div className="text-center py-16 border border-gray-800 rounded">
            <p className="text-gray-400 mb-4">Cart is empty.</p>
            <Link to="/store" className="bg-yellow text-black px-6 py-2 rounded-full font-bold">Shop</Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map(item => (
                <CartItemCard key={item.variantKey} item={item} onRemove={removeItem} onQuantityChange={updateQuantity} />
              ))}
            </div>
            <div className="bg-gray-900 p-6 rounded-lg h-fit">
              <h2 className="text-xl font-bold mb-4">Summary</h2>
              <div className="flex justify-between py-2 border-b border-gray-800">
                <span>Subtotal</span><span>₹ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-800">
                <span>Delivery</span><span>₹ {subtotal > 0 ? 50 : 0}</span>
              </div>
              <div className="flex justify-between py-4 font-bold text-xl text-yellow">
                <span>Total</span><span>₹ {total.toFixed(2)}</span>
              </div>
              <button onClick={() => navigate('/checkout')} className="w-full bg-yellow text-black font-bold py-3 rounded-full mt-4">
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
