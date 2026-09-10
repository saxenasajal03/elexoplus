import React from 'react';

export default function CartItemCard({ item, onRemove, onQuantityChange }) {
  return (
    <div className="flex gap-4 p-4 bg-gray-900 rounded-lg items-center">
      <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded" />
      <div className="flex-1">
        <h3 className="font-bold">{item.name}</h3>
        <p className="text-sm text-gray-400">Variant: {item.variant_name}</p>
        <p className="text-yellow font-bold mt-1">₹ {item.price}</p>
      </div>
      <div className="flex items-center border border-gray-700 rounded-full">
        <button onClick={() => onQuantityChange(item.variantKey, Math.max(1, item.quantity - 1))} className="px-3 py-1">-</button>
        <span className="px-2">{item.quantity}</span>
        <button onClick={() => onQuantityChange(item.variantKey, item.quantity + 1)} className="px-3 py-1">+</button>
      </div>
      <button onClick={() => onRemove(item.variantKey)} className="text-red-500 font-bold px-2">✕</button>
    </div>
  );
}
