import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Star, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const FALLBACK_IMAGE = '/assets/product-BICEL6TG.png';

export default function ProductCard({ product }) {
  const { addItemToCart } = useCart();
  const [added, setAdded] = useState(false);

  const slug = product?.name
    ? product.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-')
    : 'item';

  const displayImage = product?.image_url || product?.main_image_url || FALLBACK_IMAGE;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItemToCart(product, 0, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <Link
      to={`/product/${product?.product_id}/${slug}`}
      className="flex-shrink-0 w-64 md:w-72 bg-zinc-950 rounded-2xl overflow-hidden group block font-sans border border-zinc-800/80 hover:border-amber-400/60 transition-all duration-300 shadow-xl relative"
    >
      {/* Top Badge */}
      {product?.badge_text && (
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-amber-400 text-black text-[10px] font-black uppercase px-2.5 py-1 rounded-md shadow">
            {product.badge_text}
          </span>
        </div>
      )}

      {/* Product Image Box */}
      <div className="aspect-square w-full bg-zinc-900/80 overflow-hidden flex items-center justify-center p-6 relative">
        <img
          src={displayImage}
          alt={product?.name || 'Product'}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = FALLBACK_IMAGE;
          }}
        />
      </div>

      {/* Product Content Details */}
      <div className="p-5 flex flex-col justify-between">
        <div>
          <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
            {product?.category_name || 'Elexoplus Appliance'}
          </span>
          <h3 className="font-extrabold text-white truncate text-sm md:text-base mt-1 group-hover:text-amber-400 transition-colors">
            {product?.name || 'Product Name'}
          </h3>

          {/* Rating Stars */}
          <div className="flex items-center gap-1 mt-2 text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={12}
                fill={i < Math.floor(product?.rating_avg || 5) ? 'currentColor' : 'none'}
              />
            ))}
            <span className="text-[11px] font-semibold text-zinc-500 ml-1">
              ({product?.review_count || 12})
            </span>
          </div>
        </div>

        {/* Price & Quick Add Footer */}
        <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-zinc-500 block uppercase font-bold">Price</span>
            <span className="text-amber-400 font-black text-base md:text-lg">
              ₹ {parseFloat(product?.base_price || 0).toLocaleString('en-IN')}
            </span>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition shadow-md ${
              added 
                ? 'bg-emerald-600 text-white' 
                : 'bg-zinc-900 text-white hover:bg-amber-400 hover:text-black border border-zinc-700 hover:border-amber-400'
            }`}
          >
            {added ? <Check size={14} /> : <ShoppingBag size={14} />}
            {added ? 'Added' : 'Add'}
          </button>
        </div>
      </div>
    </Link>
  );
}