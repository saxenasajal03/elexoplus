import React, { useEffect, useState } from 'react';
import { ShieldCheck, CheckCircle2, AlertCircle, Loader2, PackageCheck } from 'lucide-react';
import { TextField, SelectField } from '../components/common/FormField';
import { ENDPOINTS } from '../data/siteContent';
import {
  validators, validateForm, cleanText, digitsOnly, upperAlphaNum, createSubmitGuard,
} from '../utils/validation';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha',
  'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands', 'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
];

const submitGuard = createSubmitGuard(2500);

const initialForm = {
  product_id: '', serial_no: '', customer_name: '', customer_phone: '',
  customer_email: '', purchase_date: '', dealer_name: '',
  address_line1: '', address_line2: '', city: '', state: '', pincode: '',
};

export default function WarrantyRegistration() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [serialStatus, setSerialStatus] = useState(null); // null|'checking'|'verified'|'unverified'|'unavailable'
  const [verifiedProduct, setVerifiedProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [result, setResult] = useState(null);

  // Load the live product catalog for the "Select Product" dropdown.
  useEffect(() => {
    fetch(`${ENDPOINTS.warranty}?products=1`)
      .then((r) => r.json())
      .then((d) => setProducts(d?.success && Array.isArray(d.products) ? d.products : []))
      .catch(() => setProducts([]))
      .finally(() => setProductsLoading(false));
  }, []);

  const setField = (key, transform) => (e) => {
    const raw = e.target.value;
    setForm((f) => ({ ...f, [key]: transform ? transform(raw) : cleanText(raw, 255) }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
    if (submitError) setSubmitError('');
  };

  // Verify the serial in the background once it looks structurally valid.
  const verifySerial = async (serial) => {
    if (validators.serial(serial)) { setSerialStatus(null); setVerifiedProduct(null); return; }
    setSerialStatus('checking');
    try {
      const res = await fetch(`${ENDPOINTS.productAuthentication}?serial_no=${encodeURIComponent(serial)}`);
      if (!res.ok) throw new Error('unreachable');
      const data = await res.json();
      if (data?.verified) { setVerifiedProduct(data); setSerialStatus('verified'); }
      else { setVerifiedProduct(null); setSerialStatus('unverified'); }
    } catch {
      setVerifiedProduct(null);
      setSerialStatus('unavailable');
    }
  };

  const schema = {
    product_id: [(v) => validators.required(v, 'Product')],
    serial_no: [validators.serial],
    customer_name: [validators.name],
    customer_phone: [validators.phoneIN],
    customer_email: [validators.email],
    purchase_date: [(v) => validators.pastDate(v, 15)],
    address_line1: [(v) => validators.required(v, 'Address'), (v) => validators.minLength(v, 5, 'Address')],
    city: [(v) => validators.required(v, 'City')],
    state: [(v) => validators.required(v, 'State')],
    pincode: [validators.pincodeIN],
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { errors: errs, isValid } = validateForm(form, schema);
    setErrors(errs);
    if (!isValid) {
      // Bring the first invalid field into view — long forms otherwise hide errors.
      const firstKey = Object.keys(errs)[0];
      document.getElementById(firstKey)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (!submitGuard()) return;

    setSubmitting(true);
    setSubmitError('');
    try {
      const res = await fetch(ENDPOINTS.warranty, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data?.success) setResult(data);
      else setSubmitError(data?.message || 'We could not complete your registration. Please try again or call +91 8679509135.');
    } catch {
      setSubmitError('We could not reach our warranty service right now. Please try again shortly, or call +91 8679509135 for help.');
    } finally {
      setSubmitting(false);
    }
  };

  if (result) {
    return (
      <div className="min-h-screen bg-white text-slate-100 font-sans flex items-center justify-center px-4 py-24">
        <div className="max-w-md w-full bg-white border border-emerald-500/30 rounded-3xl p-8 sm:p-10 text-center">
          <CheckCircle2 size={44} className="text-emerald-600 mx-auto mb-5" />
          <h2 className="text-xl font-extrabold text-zinc-900">Warranty Registered</h2>
          <p className="text-zinc-500 text-sm mt-3 leading-relaxed">
            Your product warranty has been activated and linked to serial{' '}
            <span className="text-zinc-900 font-mono break-all">{form.serial_no}</span>.
          </p>
          {(result.warranty_start || result.warranty_end) && (
            <div className="mt-6 bg-zinc-100 border border-zinc-200 rounded-xl p-4 grid grid-cols-2 gap-3 text-xs">
              <div><p className="text-zinc-500">Valid From</p><p className="text-zinc-900 font-bold mt-0.5">{result.warranty_start || '—'}</p></div>
              <div><p className="text-zinc-500">Valid Until</p><p className="text-zinc-900 font-bold mt-0.5">{result.warranty_end || '—'}</p></div>
            </div>
          )}
          <p className="text-xs text-zinc-500 mt-5">A confirmation has been sent to {form.customer_email}.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-100 font-sans selection:bg-amber-400 selection:text-black pt-28 md:pt-36 pb-20 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-black text-amber-600 tracking-tight">Product Warranty</h1>
        <p className="text-zinc-500 text-sm mt-2">Register your purchase to activate protection.</p>

        <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
          <SelectField
            id="product_id"
            label="Select Product"
            required
            value={form.product_id}
            onChange={setField('product_id')}
            error={errors.product_id}
            disabled={productsLoading}
            options={[
              { value: '', label: productsLoading ? 'Loading products...' : 'Choose a product...' },
              ...products.map((p) => ({
                value: String(p.product_id),
                label: p.item_code ? `${p.name} (${p.item_code})` : p.name,
              })),
            ]}
          />
          {!productsLoading && products.length === 0 && (
            <p className="text-amber-600/80 text-[11px] -mt-3">
              Product list is temporarily unavailable. You can still register using your serial number —
              our team will match the product manually.
            </p>
          )}

          <TextField
            id="serial_no"
            label="Serial Number"
            required
            placeholder="E.G. ELX-2024-A56"
            value={form.serial_no}
            onChange={(e) => {
              const v = upperAlphaNum(e.target.value);
              setForm((f) => ({ ...f, serial_no: v }));
              setSerialStatus(null);
              setVerifiedProduct(null);
              if (errors.serial_no) setErrors((p) => ({ ...p, serial_no: undefined }));
            }}
            onBlur={(e) => verifySerial(e.target.value)}
            error={errors.serial_no}
            hint="Found near the barcode on your packaging."
            className="tracking-widest"
          />

          {/* Serial verification feedback — always states plainly what we could
              and could not confirm, rather than implying a verified result. */}
          {serialStatus === 'checking' && (
            <p className="text-zinc-500 text-[11px] -mt-3 flex items-center gap-1.5">
              <Loader2 size={11} className="animate-spin" /> Verifying serial number...
            </p>
          )}
          {serialStatus === 'verified' && verifiedProduct && (
            <div className="-mt-2 bg-emerald-500/5 border border-emerald-500/30 rounded-xl px-4 py-3 flex items-start gap-2">
              <PackageCheck size={15} className="text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-xs text-zinc-600">
                Verified genuine — <span className="text-zinc-900 font-bold">{verifiedProduct.product_name}</span>
                {verifiedProduct.model ? ` (${verifiedProduct.model})` : ''}
              </p>
            </div>
          )}
          {serialStatus === 'unverified' && (
            <div className="-mt-2 bg-rose-500/5 border border-rose-500/30 rounded-xl px-4 py-3 flex items-start gap-2">
              <AlertCircle size={15} className="text-rose-600 shrink-0 mt-0.5" />
              <p className="text-xs text-zinc-600">
                We couldn't find this serial in our records. Please double-check it — if you're confident
                it's correct, continue and our team will verify it against your invoice.
              </p>
            </div>
          )}
          {serialStatus === 'unavailable' && (
            <div className="-mt-2 bg-amber-500/5 border border-amber-500/30 rounded-xl px-4 py-3 flex items-start gap-2">
              <AlertCircle size={15} className="text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-zinc-600">
                Our verification service is temporarily unreachable, so we couldn't confirm this serial
                right now. You can still continue — we'll verify it when processing your registration.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <TextField
              id="customer_name" label="Customer Name" required placeholder="John Doe"
              value={form.customer_name} onChange={setField('customer_name', (v) => cleanText(v, 150))}
              error={errors.customer_name}
            />
            <TextField
              id="customer_phone" label="Phone Number" required type="tel" inputMode="numeric"
              placeholder="+91 00000 00000" value={form.customer_phone}
              onChange={setField('customer_phone', (v) => digitsOnly(v, 10))}
              error={errors.customer_phone}
            />
          </div>

          <TextField
            id="customer_email" label="Email Address" required type="email" placeholder="john@example.com"
            value={form.customer_email} onChange={setField('customer_email', (v) => cleanText(v, 150))}
            error={errors.customer_email}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <TextField
              id="purchase_date" label="Purchase Date" required type="date"
              max={new Date().toISOString().split('T')[0]}
              value={form.purchase_date}
              onChange={(e) => {
                setForm((f) => ({ ...f, purchase_date: e.target.value }));
                if (errors.purchase_date) setErrors((p) => ({ ...p, purchase_date: undefined }));
              }}
              error={errors.purchase_date}
            />
            <TextField
              id="dealer_name" label="Dealer Name" placeholder="Store or Website name"
              value={form.dealer_name} onChange={setField('dealer_name', (v) => cleanText(v, 150))}
              error={errors.dealer_name}
            />
          </div>

          <div className="space-y-4 sm:space-y-5">
            <TextField
              id="address_line1" label="Full Address" required placeholder="House No, Street, Area"
              value={form.address_line1} onChange={setField('address_line1')}
              error={errors.address_line1}
            />
            <TextField
              id="address_line2" placeholder="Landmark (Optional)"
              value={form.address_line2} onChange={setField('address_line2')}
              error={errors.address_line2}
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
              <TextField
                id="city" placeholder="City" value={form.city}
                onChange={setField('city', (v) => cleanText(v, 100))} error={errors.city}
              />
              <SelectField
                id="state" value={form.state} onChange={setField('state')} error={errors.state}
                options={[{ value: '', label: 'State' }, ...INDIAN_STATES.map((s) => ({ value: s, label: s }))]}
              />
              <TextField
                id="pincode" placeholder="Pincode" inputMode="numeric" value={form.pincode}
                onChange={setField('pincode', (v) => digitsOnly(v, 6))} error={errors.pincode}
              />
            </div>
          </div>

          {submitError && (
            <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3 flex items-start gap-2">
              <AlertCircle size={14} className="text-rose-600 shrink-0 mt-0.5" />
              <p className="text-rose-300 text-xs">{submitError}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-amber-400 hover:bg-amber-500 text-black font-extrabold py-4 rounded-xl text-sm uppercase tracking-[0.15em] transition cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
          >
            {submitting ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
            {submitting ? 'Registering...' : 'Complete Registration'}
          </button>
        </form>
      </div>
    </div>
  );
}
