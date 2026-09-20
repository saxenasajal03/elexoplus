import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Star, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { getPricing, formatINR, isInStock } from '../../utils/pricing';

const FALLBACK_IMAGE = '/assets/product-BICEL6TG.png';

/**
 * RESPONSIVE NOTE:
 * This card is intentionally `w-full` — it fills whatever container it's
 * placed in. Previously it carried a fixed `w-64 md:w-72`, which overflowed
 * its cell in the Store's 2-column mobile grid and caused the corner
 * clipping/overlap. Carousels already wrap each card in their own
 * fixed-width div, so they're unaffected by this change.
 */
export default function ProductCard({ product }) {
  const { addItemToCart } = useCart();
  const [added, setAdded] = useState(false);

  const slug = product?.name
    ? product.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-')
    : 'item';

  const displayImage = product?.image_url || product?.main_image_url || FALLBACK_IMAGE;
  const { price, mrp, hasDiscount, discountPercent } = getPricing(product);
  const inStock = isInStock(product);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!inStock) return;
    addItemToCart(product, 0, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <Link
      to={`/product/${product?.product_id}/${slug}`}
      className="w-full h-full bg-white rounded-2xl overflow-hidden group flex flex-col font-sans border border-zinc-200/80 hover:border-amber-400/60 transition-all duration-300 shadow-xl relative"
    >
      {/* Badges — smaller insets on mobile so they never crowd the corner radius */}
      <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 flex flex-col gap-1 items-start max-w-[70%]">
        {product?.badge_text && (
          <span className="bg-amber-400 text-black text-[9px] sm:text-[10px] font-black uppercase px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md shadow truncate max-w-full">
            {product.badge_text}
          </span>
        )}
        {hasDiscount && (
          <span className="bg-rose-600 text-zinc-900 text-[9px] sm:text-[10px] font-black uppercase px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md shadow">
            {discountPercent}% OFF
          </span>
        )}
      </div>

      {!inStock && (
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10">
          <span className="bg-zinc-200 text-zinc-600 text-[9px] sm:text-[10px] font-black uppercase px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md border border-zinc-300">
            Sold Out
          </span>
        </div>
      )}

      {/* Image — FIXED aspect ratio block.
          This is the key to consistent grids: the image area is always a
          perfect square regardless of the source image's dimensions, so
          every card in a row lines up. `shrink-0` stops flex from squashing
          it when the text below runs long, and `object-contain` guarantees
          no cropping or distortion for portrait/landscape product shots. */}
      <div className={`aspect-square w-full bg-zinc-100/80 overflow-hidden flex items-center justify-center p-4 sm:p-6 shrink-0 ${!inStock ? 'opacity-60' : ''}`}>
        <img
          src={displayImage}
          alt={product?.name || 'Product'}
          loading="lazy"
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = FALLBACK_IMAGE;
          }}
        />
      </div>

      {/* Details — flexible height, grows to fill the grid row */}
      <div className="p-3 sm:p-5 flex flex-col flex-1 min-w-0">
        <div className="flex-1 min-w-0 min-h-[3.5rem] sm:min-h-[4.5rem]">
          <span className="text-[10px] sm:text-[11px] font-bold text-zinc-500 uppercase tracking-wider block truncate">
            {product?.category_name || 'ElexoPlus Appliance'}
          </span>
          <h3 className="font-extrabold text-zinc-900 text-xs sm:text-sm md:text-base mt-1 leading-snug line-clamp-2 group-hover:text-amber-600 transition-colors">
            {product?.name || 'Product Name'}
          </h3>

          <div className="flex items-center gap-0.5 mt-1.5 sm:mt-2 text-amber-600">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={10}
                className="sm:w-3 sm:h-3"
                fill={i < Math.floor(product?.rating_avg || 5) ? 'currentColor' : 'none'}
              />
            ))}
            <span className="text-[10px] sm:text-[11px] font-semibold text-zinc-500 ml-1">
              ({product?.review_count || 12})
            </span>
          </div>
        </div>

        {/* Price + Add — stacks on very small screens so nothing gets squeezed */}
        <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-zinc-200/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 min-w-0">
          <div className="min-w-0">
            {hasDiscount && (
              <span className="text-[10px] text-zinc-500 line-through block truncate">
                M.R.P. {formatINR(mrp)}
              </span>
            )}
            <span className="text-amber-600 font-black text-sm sm:text-base md:text-lg block truncate">
              {formatINR(price)}
            </span>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!inStock}
            aria-label={inStock ? `Add ${product?.name || 'product'} to cart` : 'Out of stock'}
            className={`w-full sm:w-auto px-3 py-2 rounded-xl text-[11px] sm:text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition shadow-md shrink-0 ${
              !inStock
                ? 'bg-zinc-100 text-zinc-600 border border-zinc-200 cursor-not-allowed'
                : added
                ? 'bg-emerald-600 text-zinc-900'
                : 'bg-zinc-100 text-zinc-900 hover:bg-amber-400 hover:text-black border border-zinc-300 hover:border-amber-400 cursor-pointer'
            }`}
          >
            {added ? <Check size={13} /> : <ShoppingBag size={13} />}
            {added ? 'Added' : 'Add'}
          </button>
        </div>
      </div>
    </Link>
  );
}
