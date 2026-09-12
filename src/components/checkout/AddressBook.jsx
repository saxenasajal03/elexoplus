import React, { useEffect, useState } from 'react';
import { MapPin, Plus, Pencil, Trash2, Check, Home, Briefcase, X, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { listAddresses, saveAddress, deleteAddress, setDefaultAddress } from '../../utils/addressService';

const emptyAddress = {
  label: 'Home', full_name: '', phone: '', pincode: '', address_line1: '',
  address_line2: '', city: '', state: '', landmark: '', is_default: false,
};

const labelIcon = { Home, Work: Briefcase, Other: MapPin };

function AddressForm({ initial, onCancel, onSaved }) {
  const { user } = useAuth();
  const [form, setForm] = useState(initial || emptyAddress);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const validate = () => {
    const errs = {};
    if (!form.full_name?.trim()) errs.full_name = 'Required';
    if (!/^\d{10}$/.test(form.phone || '')) errs.phone = '10-digit phone number';
    if (!/^\d{6}$/.test(form.pincode || '')) errs.pincode = '6-digit pincode';
    if (!form.address_line1?.trim()) errs.address_line1 = 'Required';
    if (!form.city?.trim()) errs.city = 'Required';
    if (!form.state?.trim()) errs.state = 'Required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    const saved = await saveAddress(user?.id || user?.email, form);
    setSaving(false);
    onSaved(saved);
  };

  const inputClass = (field) =>
    `w-full bg-zinc-900 border rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 transition ${
      errors[field] ? 'border-rose-500/60 focus:ring-rose-500/40' : 'border-zinc-800 focus:ring-amber-400'
    }`;

  return (
    <form onSubmit={submit} className="space-y-3 bg-zinc-950 border border-zinc-800 rounded-2xl p-5">
      <div className="grid grid-cols-2 gap-3">
        <input placeholder="Full Name" value={form.full_name} onChange={update('full_name')} className={inputClass('full_name')} />
        <input placeholder="Phone Number" value={form.phone} onChange={update('phone')} className={inputClass('phone')} />
      </div>
      <input placeholder="Address Line 1 (House No, Street)" value={form.address_line1} onChange={update('address_line1')} className={inputClass('address_line1')} />
      <input placeholder="Address Line 2 (Area, Colony) — optional" value={form.address_line2} onChange={update('address_line2')} className={inputClass('address_line2')} />
      <div className="grid grid-cols-3 gap-3">
        <input placeholder="City" value={form.city} onChange={update('city')} className={inputClass('city')} />
        <input placeholder="State" value={form.state} onChange={update('state')} className={inputClass('state')} />
        <input placeholder="Pincode" value={form.pincode} onChange={update('pincode')} className={inputClass('pincode')} />
      </div>
      <input placeholder="Landmark (optional)" value={form.landmark} onChange={update('landmark')} className={inputClass('landmark')} />

      <div className="flex items-center gap-2 pt-1">
        <span className="text-xs text-zinc-500 mr-1">Save as:</span>
        {['Home', 'Work', 'Other'].map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => setForm({ ...form, label: l })}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
              form.label === l ? 'bg-amber-400 text-black' : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel} className="flex-1 py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white transition cursor-pointer">
          Cancel
        </button>
        <button type="submit" disabled={saving} className="flex-1 py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider bg-amber-400 hover:bg-amber-500 text-black transition cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2">
          {saving ? <Loader2 size={14} className="animate-spin" /> : null}
          {saving ? 'Saving...' : 'Save Address'}
        </button>
      </div>
    </form>
  );
}

/**
 * mode="select": radio-style picker for Checkout, calls onSelect(address)
 * mode="manage": full CRUD list for the Profile page (no selection concept)
 */
export default function AddressBook({ mode = 'select', selectedId, onSelect }) {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const userId = user?.id || user?.email;

  const refresh = async () => {
    setLoading(true);
    const list = await listAddresses(userId);
    setAddresses(list);
    setLoading(false);
    if (mode === 'select' && !selectedId && onSelect) {
      const def = list.find((a) => a.is_default) || list[0];
      if (def) onSelect(def);
    }
  };

  useEffect(() => {
    if (userId) refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const handleSaved = async (saved) => {
    setShowForm(false);
    setEditing(null);
    await refresh();
    if (mode === 'select' && onSelect) onSelect(saved);
  };

  const handleDelete = async (id) => {
    await deleteAddress(userId, id);
    await refresh();
  };

  const handleSetDefault = async (id) => {
    await setDefaultAddress(userId, id);
    await refresh();
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-zinc-500 text-sm py-4">
        <Loader2 size={16} className="animate-spin" /> Loading saved addresses...
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {addresses.map((addr) => {
        const Icon = labelIcon[addr.label] || MapPin;
        const isSelected = mode === 'select' && selectedId === addr.id;
        return (
          <div
            key={addr.id}
            onClick={() => mode === 'select' && onSelect && onSelect(addr)}
            className={`rounded-2xl border p-4 transition-all ${
              mode === 'select' ? 'cursor-pointer' : ''
            } ${isSelected ? 'border-amber-400 bg-amber-400/5' : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'}`}
          >
            <div className="flex items-start gap-3">
              {mode === 'select' && (
                <div className={`w-5 h-5 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center ${isSelected ? 'border-amber-400 bg-amber-400' : 'border-zinc-700'}`}>
                  {isSelected && <Check size={12} className="text-black" />}
                </div>
              )}
              <Icon size={16} className="text-amber-400 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-white font-bold text-sm">{addr.full_name}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wide bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full">{addr.label}</span>
                  {addr.is_default && (
                    <span className="text-[10px] font-bold uppercase tracking-wide bg-amber-400/10 text-amber-400 border border-amber-400/20 px-2 py-0.5 rounded-full">Default</span>
                  )}
                </div>
                <p className="text-zinc-400 text-xs mt-1.5 leading-relaxed">
                  {addr.address_line1}{addr.address_line2 ? `, ${addr.address_line2}` : ''}, {addr.city}, {addr.state} - {addr.pincode}
                  {addr.landmark ? ` (Near ${addr.landmark})` : ''}
                </p>
                <p className="text-zinc-500 text-xs mt-1">Phone: {addr.phone}</p>
              </div>
            </div>

            {mode === 'manage' && (
              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-zinc-800 pl-8">
                <button type="button" onClick={(e) => { e.stopPropagation(); setEditing(addr); setShowForm(true); }} className="text-xs font-bold text-zinc-400 hover:text-amber-400 flex items-center gap-1 cursor-pointer">
                  <Pencil size={12} /> Edit
                </button>
                <button type="button" onClick={(e) => { e.stopPropagation(); handleDelete(addr.id); }} className="text-xs font-bold text-zinc-400 hover:text-rose-400 flex items-center gap-1 cursor-pointer">
                  <Trash2 size={12} /> Delete
                </button>
                {!addr.is_default && (
                  <button type="button" onClick={(e) => { e.stopPropagation(); handleSetDefault(addr.id); }} className="text-xs font-bold text-zinc-400 hover:text-emerald-400 flex items-center gap-1 cursor-pointer">
                    <Check size={12} /> Set as Default
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}

      {showForm ? (
        <div className="relative">
          {mode === 'manage' && (
            <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="absolute -top-2 -right-2 z-10 bg-zinc-800 rounded-full p-1 text-zinc-400 hover:text-white cursor-pointer">
              <X size={14} />
            </button>
          )}
          <AddressForm initial={editing} onCancel={() => { setShowForm(false); setEditing(null); }} onSaved={handleSaved} />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="w-full border-2 border-dashed border-zinc-800 hover:border-amber-400/50 rounded-2xl py-4 flex items-center justify-center gap-2 text-zinc-400 hover:text-amber-400 text-sm font-bold transition cursor-pointer"
        >
          <Plus size={16} /> Add a New Address
        </button>
      )}
    </div>
  );
}
