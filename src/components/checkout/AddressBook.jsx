import React, { useEffect, useState } from 'react';
import { MapPin, Plus, Pencil, Trash2, Check, Home, Briefcase, X, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { listAddresses, saveAddress, deleteAddress, setDefaultAddress } from '../../utils/addressService';
import { validators, validateForm, cleanText, digitsOnly } from '../../utils/validation';
import { TextField, SelectField } from '../common/FormField';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha',
  'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands', 'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
];

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

  const update = (key, transform) => (e) => {
    const raw = e.target.value;
    setForm((f) => ({ ...f, [key]: transform ? transform(raw) : cleanText(raw, 255) }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const schema = {
    full_name: [validators.name],
    phone: [validators.phoneIN],
    address_line1: [(v) => validators.required(v, 'Address'), (v) => validators.minLength(v, 5, 'Address')],
    city: [(v) => validators.required(v, 'City')],
    state: [(v) => validators.required(v, 'State')],
    pincode: [validators.pincodeIN],
  };

  const validate = () => {
    const { errors: errs, isValid } = validateForm(form, schema);
    setErrors(errs);
    return isValid;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    const saved = await saveAddress(user?.id || user?.email, form);
    setSaving(false);
    onSaved(saved);
  };

  return (
    <form onSubmit={submit} noValidate className="space-y-4 bg-white border border-zinc-200 rounded-2xl p-4 sm:p-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TextField id="addr_full_name" label="Full Name" required value={form.full_name}
          onChange={update('full_name', (v) => cleanText(v, 150))} error={errors.full_name} />
        <TextField id="addr_phone" label="Phone Number" required type="tel" inputMode="numeric"
          placeholder="10-digit mobile" value={form.phone}
          onChange={update('phone', (v) => digitsOnly(v, 10))} error={errors.phone} />
      </div>
      <TextField id="addr_line1" label="Address Line 1" required placeholder="House No., Street"
        value={form.address_line1} onChange={update('address_line1')} error={errors.address_line1} />
      <TextField id="addr_line2" label="Address Line 2" placeholder="Area, Colony (optional)"
        value={form.address_line2} onChange={update('address_line2')} error={errors.address_line2} />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <TextField id="addr_city" label="City" required value={form.city}
          onChange={update('city', (v) => cleanText(v, 100))} error={errors.city} />
        <SelectField id="addr_state" label="State" required
          options={[{ value: '', label: 'Select State' }, ...INDIAN_STATES.map((st) => ({ value: st, label: st }))]}
          value={form.state} onChange={update('state')} error={errors.state} />
        <TextField id="addr_pincode" label="Pincode" required inputMode="numeric" placeholder="6-digit"
          value={form.pincode} onChange={update('pincode', (v) => digitsOnly(v, 6))} error={errors.pincode} />
      </div>
      <TextField id="addr_landmark" label="Landmark" placeholder="Optional"
        value={form.landmark} onChange={update('landmark')} error={errors.landmark} />

      <div className="flex items-center gap-2 pt-1">
        <span className="text-xs text-zinc-500 mr-1">Save as:</span>
        {['Home', 'Work', 'Other'].map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => setForm({ ...form, label: l })}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
              form.label === l ? 'bg-amber-400 text-black' : 'bg-zinc-100 border border-zinc-200 text-zinc-500 hover:text-zinc-900'
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
        <button type="button" onClick={onCancel} className="flex-1 py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider bg-zinc-100 border border-zinc-200 text-zinc-600 hover:text-zinc-900 transition cursor-pointer">
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
            } ${isSelected ? 'border-amber-400 bg-amber-400/5' : 'border-zinc-200 bg-white hover:border-zinc-300'}`}
          >
            <div className="flex items-start gap-3">
              {mode === 'select' && (
                <div className={`w-5 h-5 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center ${isSelected ? 'border-amber-400 bg-amber-400' : 'border-zinc-300'}`}>
                  {isSelected && <Check size={12} className="text-black" />}
                </div>
              )}
              <Icon size={16} className="text-amber-600 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-zinc-900 font-bold text-sm">{addr.full_name}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wide bg-zinc-200 text-zinc-500 px-2 py-0.5 rounded-full">{addr.label}</span>
                  {addr.is_default && (
                    <span className="text-[10px] font-bold uppercase tracking-wide bg-amber-400/10 text-amber-600 border border-amber-400/20 px-2 py-0.5 rounded-full">Default</span>
                  )}
                </div>
                <p className="text-zinc-500 text-xs mt-1.5 leading-relaxed">
                  {addr.address_line1}{addr.address_line2 ? `, ${addr.address_line2}` : ''}, {addr.city}, {addr.state} - {addr.pincode}
                  {addr.landmark ? ` (Near ${addr.landmark})` : ''}
                </p>
                <p className="text-zinc-500 text-xs mt-1">Phone: {addr.phone}</p>
              </div>
            </div>

            {mode === 'manage' && (
              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-zinc-200 pl-8">
                <button type="button" onClick={(e) => { e.stopPropagation(); setEditing(addr); setShowForm(true); }} className="text-xs font-bold text-zinc-500 hover:text-amber-600 flex items-center gap-1 cursor-pointer">
                  <Pencil size={12} /> Edit
                </button>
                <button type="button" onClick={(e) => { e.stopPropagation(); handleDelete(addr.id); }} className="text-xs font-bold text-zinc-500 hover:text-rose-600 flex items-center gap-1 cursor-pointer">
                  <Trash2 size={12} /> Delete
                </button>
                {!addr.is_default && (
                  <button type="button" onClick={(e) => { e.stopPropagation(); handleSetDefault(addr.id); }} className="text-xs font-bold text-zinc-500 hover:text-emerald-600 flex items-center gap-1 cursor-pointer">
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
            <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="absolute -top-2 -right-2 z-10 bg-zinc-200 rounded-full p-1 text-zinc-500 hover:text-zinc-900 cursor-pointer">
              <X size={14} />
            </button>
          )}
          <AddressForm initial={editing} onCancel={() => { setShowForm(false); setEditing(null); }} onSaved={handleSaved} />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="w-full border-2 border-dashed border-zinc-200 hover:border-amber-400/50 rounded-2xl py-4 flex items-center justify-center gap-2 text-zinc-500 hover:text-amber-600 text-sm font-bold transition cursor-pointer"
        >
          <Plus size={16} /> Add a New Address
        </button>
      )}
    </div>
  );
}
