import React, { useState } from 'react';
import { MessageSquareWarning, CheckCircle2, AlertCircle, Loader2, Copy, Check } from 'lucide-react';
import PageHero from '../components/common/PageHero';
import { TextField, TextAreaField, SelectField } from '../components/common/FormField';
import { ENDPOINTS } from '../data/siteContent';
import { validators, validateForm, cleanText, digitsOnly, upperAlphaNum, createSubmitGuard } from '../utils/validation';

const COMPLAINT_TYPES = [
  'Product Not Working',
  'Wrong / Damaged Item Received',
  'Missing Parts',
  'Late Delivery',
  'Installation Issue',
  'Other',
];

const submitGuard = createSubmitGuard(2500);

export default function ComplaintRegistration() {
  const [form, setForm] = useState({
    order_id: '', invoice_no: '', serial_no: '', customer_name: '',
    customer_phone: '', customer_email: '', complaint_type: COMPLAINT_TYPES[0], description: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const setField = (key, transform) => (e) => {
    const raw = e.target.value;
    setForm((f) => ({ ...f, [key]: transform ? transform(raw) : cleanText(raw) }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
    if (error) setError('');
  };

  const schema = {
    order_id: [(v) => validators.required(v, 'Order ID')],
    customer_name: [validators.name],
    customer_phone: [validators.phoneIN],
    customer_email: [validators.email],
    complaint_type: [(v) => validators.required(v, 'Complaint type')],
    description: [(v) => validators.required(v, 'Description'), (v) => validators.minLength(v, 20, 'Description')],
  };

  const submit = async (e) => {
    e.preventDefault();
    const { errors: errs, isValid } = validateForm(form, schema);
    setErrors(errs);
    if (!isValid) return;
    if (!submitGuard()) return;

    setLoading(true);
    setError('');
    try {
      const res = await fetch(ENDPOINTS.complaint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data?.success && data?.complaint_id) {
        setSubmitted(data);
      } else {
        setError(data?.message || "We couldn't submit your complaint right now. Please call +91 8679509135 so we can register it for you.");
      }
    } catch {
      setError("We couldn't reach our service right now. Please call +91 8679509135 so we can register your complaint immediately.");
    } finally {
      setLoading(false);
    }
  };

  const copyId = () => {
    navigator.clipboard?.writeText(submitted.complaint_id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-black text-slate-100 font-sans flex items-center justify-center px-4 py-24">
        <div className="max-w-md w-full bg-zinc-950 border border-emerald-500/30 rounded-3xl p-8 sm:p-10 text-center">
          <CheckCircle2 size={44} className="text-emerald-400 mx-auto mb-5" />
          <h2 className="text-xl font-extrabold text-white">Complaint Registered</h2>
          <p className="text-zinc-400 text-sm mt-3 leading-relaxed">
            Save the Complaint ID below for reference — it's separate from your Order and Invoice numbers.
          </p>
          <button
            type="button" onClick={copyId}
            className="mt-6 w-full bg-zinc-900 border border-zinc-800 hover:border-amber-400/40 rounded-xl py-4 text-amber-400 font-black text-xl sm:text-2xl tracking-wide transition cursor-pointer flex items-center justify-center gap-3 break-all"
          >
            {submitted.complaint_id}
            {copied ? <Check size={16} className="text-emerald-400 shrink-0" /> : <Copy size={16} className="text-zinc-500 shrink-0" />}
          </button>
          <p className="text-xs text-zinc-500 mt-4">Our service team will contact you within 48 hours as per our standard SLA.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-slate-100 font-sans selection:bg-amber-400 selection:text-black">
      <PageHero
        eyebrow="Service & Complaints"
        title="Register a Complaint"
        subtitle="Facing an issue with your product or order? Raise a ticket here — you'll receive a unique Complaint ID to track resolution."
      />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <form onSubmit={submit} noValidate className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 sm:p-7 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextField
              id="order_id" label="Order ID" required placeholder="e.g. 12345"
              value={form.order_id} onChange={setField('order_id', (v) => upperAlphaNum(v, 50))}
              error={errors.order_id}
            />
            <TextField
              id="invoice_no" label="Invoice Number" placeholder="Optional"
              value={form.invoice_no} onChange={setField('invoice_no', (v) => upperAlphaNum(v, 50))}
              error={errors.invoice_no}
            />
          </div>

          <TextField
            id="serial_no" label="Product Serial Number" placeholder="From the QR sticker (optional)"
            value={form.serial_no} onChange={setField('serial_no', (v) => upperAlphaNum(v, 50))}
            error={errors.serial_no}
            hint="Including this helps us resolve your issue faster."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextField
              id="customer_name" label="Your Name" required
              value={form.customer_name} onChange={setField('customer_name', (v) => cleanText(v, 100))}
              error={errors.customer_name}
            />
            <TextField
              id="customer_phone" label="Phone Number" required type="tel" inputMode="numeric"
              placeholder="10-digit mobile" value={form.customer_phone}
              onChange={setField('customer_phone', (v) => digitsOnly(v, 10))}
              error={errors.customer_phone}
            />
          </div>

          <TextField
            id="customer_email" label="Email Address" required type="email" placeholder="you@example.com"
            value={form.customer_email} onChange={setField('customer_email', (v) => cleanText(v, 150))}
            error={errors.customer_email}
          />

          <SelectField
            id="complaint_type" label="Type of Issue" required options={COMPLAINT_TYPES}
            value={form.complaint_type} onChange={setField('complaint_type')}
            error={errors.complaint_type}
          />

          <TextAreaField
            id="description" label="Describe the Issue" required rows={4}
            placeholder="Please describe what's wrong in as much detail as you can (at least 20 characters)."
            value={form.description} onChange={setField('description', (v) => cleanText(v, 2000))}
            error={errors.description}
            hint={`${form.description.length}/2000 characters`}
          />

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3 flex items-start gap-2">
              <AlertCircle size={14} className="text-rose-400 shrink-0 mt-0.5" />
              <p className="text-rose-300 text-xs">{error}</p>
            </div>
          )}

          <button
            type="submit" disabled={loading}
            className="w-full bg-amber-400 hover:bg-amber-500 text-black font-extrabold py-3.5 rounded-xl text-xs uppercase tracking-wider transition cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={15} className="animate-spin" /> : <MessageSquareWarning size={15} />}
            {loading ? 'Submitting...' : 'Submit Complaint'}
          </button>
        </form>
      </div>
    </div>
  );
}
