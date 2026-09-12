import React from 'react';
import { CreditCard, Banknote, Split, Check } from 'lucide-react';
import { formatINR } from '../../utils/pricing';

const modeIcon = { online: CreditCard, cod: Banknote, partial: Split };

/**
 * Renders whichever payment modes are enabled in `settings.modes`
 * (Req #31 full payment, #32 COD, #33 advance+COD) — nothing here is
 * hardcoded; disable a mode from the Admin Panel later and it simply
 * stops appearing, with zero frontend changes.
 */
export default function PaymentModeSelector({ settings, selected, onSelect, total }) {
  const entries = Object.entries(settings.modes).filter(([, m]) => m.enabled);

  const amountFor = (key) => {
    if (key === 'online') return total;
    if (key === 'cod') return total + settings.cod_fee_flat;
    if (key === 'partial') return Math.round((total * settings.partial_advance_percent) / 100);
    return total;
  };

  const subtextFor = (key) => {
    if (key === 'online') return 'Pay full amount now';
    if (key === 'cod') return `Includes ₹${settings.cod_fee_flat} COD handling fee`;
    if (key === 'partial') return `Pay ${settings.partial_advance_percent}% now, rest (${formatINR(total - amountFor('partial'))}) on delivery`;
    return '';
  };

  return (
    <div className="space-y-3">
      {entries.map(([key, mode]) => {
        const Icon = modeIcon[key] || CreditCard;
        const isSelected = selected === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onSelect(key)}
            className={`w-full text-left rounded-2xl border p-4 transition-all cursor-pointer flex items-start gap-3 ${
              isSelected ? 'border-amber-400 bg-amber-400/5' : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'
            }`}
          >
            <div className={`w-5 h-5 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center ${isSelected ? 'border-amber-400 bg-amber-400' : 'border-zinc-700'}`}>
              {isSelected && <Check size={12} className="text-black" />}
            </div>
            <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-amber-400 shrink-0">
              <Icon size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-white font-bold text-sm">{mode.label}</span>
                <span className="text-amber-400 font-black text-sm shrink-0">{formatINR(amountFor(key))}</span>
              </div>
              <p className="text-zinc-500 text-xs mt-1">{subtextFor(key)}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
