import React from 'react';
import { Link } from 'react-router-dom';

const FALLBACK_IMAGE = '/assets/product-BICEL6TG.png';

export default function ProductCard({ product }) {
  const slug = product?.name
    ? product.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-')
    : 'item';

  const displayImage = product?.image_url || product?.main_image_url || FALLBACK_IMAGE;

  return (
    <Link
      to={`/product/${product?.product_id}/${slug}`}
      className="flex-shrink-0 w-64 md:w-72 bg-lightGray rounded-xl overflow-hidden group block font-['Nunito',sans-serif] border border-zinc-800 hover:border-yellow/50 transition-all duration-300"
    >
      <div className="aspect-square w-full bg-zinc-900 overflow-hidden flex items-center justify-center p-4">
        <img
          src={displayImage}
          alt={product?.name || 'Product'}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = FALLBACK_IMAGE;
          }}
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-white truncate text-sm md:text-base">
          {product?.name || 'Product Name'}
        </h3>
        <p className="text-xs text-gray-400 mt-0.5">{product?.category_name || 'Category'}</p>
        <p className="text-yellow font-bold mt-2 text-sm md:text-base">
          ₹ {parseFloat(product?.base_price || 0).toLocaleString('en-IN')}
        </p>
      </div>
    </Link>
  );
}