import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { formatINR } from '../../utils/pricing';

export default function CartItemCard({ item, onRemove, onQuantityChange }) {
  const price = parseFloat(item.price) || 0;
  const hasDiscount = item.mrp && parseFloat(item.mrp) > price;

  return (
    <div className="flex gap-4 p-4 bg-white border border-zinc-200 rounded-2xl items-center">
      <div className="w-20 h-20 rounded-xl bg-zinc-100 overflow-hidden shrink-0 flex items-center justify-center p-2">
        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain" />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-extrabold text-zinc-900 text-sm truncate">{item.name}</h3>
        <p className="text-xs text-zinc-500 mt-0.5">Variant: {item.variant_name}</p>
        <div className="flex items-center gap-2 mt-1.5">
          {hasDiscount && (
            <span className="text-[11px] text-zinc-600 line-through">{formatINR(item.mrp)}</span>
          )}
          <span className="text-amber-600 font-black text-sm">{formatINR(price)}</span>
        </div>
      </div>

      <div className="flex items-center border border-zinc-200 rounded-full bg-zinc-100 shrink-0">
        <button
          type="button"
          onClick={() => onQuantityChange(item.variantKey, Math.max(1, item.quantity - 1))}
          className="w-8 h-8 flex items-center justify-center text-zinc-500 hover:text-zinc-900 transition cursor-pointer"
          aria-label="Decrease quantity"
        >
          <Minus size={13} />
        </button>
        <span className="px-2 text-sm font-bold text-zinc-900 w-6 text-center">{item.quantity}</span>
        <button
          type="button"
          onClick={() => onQuantityChange(item.variantKey, item.quantity + 1)}
          className="w-8 h-8 flex items-center justify-center text-zinc-500 hover:text-zinc-900 transition cursor-pointer"
          aria-label="Increase quantity"
        >
          <Plus size={13} />
        </button>
      </div>

      <button
        type="button"
        onClick={() => onRemove(item.variantKey)}
        className="text-zinc-600 hover:text-rose-600 transition p-2 shrink-0 cursor-pointer"
        aria-label="Remove item"
      >
        <Trash2 size={17} />
      </button>
    </div>
  );
}
