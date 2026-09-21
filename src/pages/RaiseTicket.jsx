import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LifeBuoy, Paperclip, CheckCircle2, AlertCircle, Loader2, Copy, Check, X } from 'lucide-react';
import PageHero from '../components/common/PageHero';
import { TextField, TextAreaField, SelectField } from '../components/common/FormField';
import { useAuth } from '../context/AuthContext';
import { ENDPOINTS } from '../data/siteContent';
import { validators, validateForm, cleanText, digitsOnly, createSubmitGuard } from '../utils/validation';

// Matches TICKET_CATEGORIES in api_2/support/tickets.php exactly, plus the
// sub-category taxonomy from the Ticketing Add-On SRS §6.3.
const CATEGORIES = {
  Order: {
    label: 'Order Related',
    subs: ['Order not created', 'Order modification request', 'Order cancellation', 'Wrong quantity', 'Wrong product', 'Short quantity', 'Order not processed', 'Order status enquiry', 'Order confirmation issue', 'Other order issue'],
  },
  Scheme: {
    label: 'Scheme / Offer Related',
    subs: ['Scheme not applied', 'Wrong scheme benefit', 'Scheme eligibility issue', 'Scheme target/achievement dispute', 'Scheme benefit pending', 'Scheme calculation issue', 'Scheme validity/query', 'Other scheme issue'],
  },
  Loyalty: {
    label: 'Loyalty Related',
    subs: ['Loyalty points not credited', 'Incorrect points', 'Points redemption issue', 'Reward not received', 'Points expiry/query', 'Loyalty tier/status issue', 'Loyalty transaction dispute', 'Other loyalty issue'],
  },
  Product: {
    label: 'Product Related',
    subs: ['Damaged product', 'Defective product', 'Wrong product received', 'Missing product', 'Product quality complaint', 'Replacement request', 'Product information/query'],
  },
  Delivery: {
    label: 'Delivery / Dispatch Related',
    subs: ['Dispatch delayed', 'Delivery delayed', 'Shipment not received', 'Partial delivery', 'Wrong delivery', 'Delivery address issue', 'Delivery status enquiry', 'Transport-related issue'],
  },
  Payment: {
    label: 'Payment / Billing Related',
    subs: ['Payment not updated', 'Invoice issue', 'Incorrect billing', 'Outstanding amount dispute', 'Credit/debit adjustment issue', 'Payment confirmation', 'Refund/adjustment query'],
  },
  SalesSupport: {
    label: 'Sales / ASM / SE Support',
    subs: ['Sales Executive related issue', 'ASM related issue', 'Visit/order follow-up', 'Customer service request', 'Pricing/query', 'Sales commitment/query', 'Other sales support'],
  },
  Account: {
    label: 'Account / Portal Related',
    subs: ['Login issue', 'Password/reset issue', 'Profile update', 'Customer/dealer account issue', 'Portal technical issue', 'Other account issue'],
  },
  General: {
    label: 'General Support',
    subs: ['General enquiry', 'Feedback', 'Complaint', 'Other issue'],
  },
};

const submitGuard = createSubmitGuard(2500);

export default function RaiseTicket() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    customer_name: user?.name || '', customer_email: user?.email || '', customer_phone: user?.phone || '',
    category: 'Order', sub_category: '', order_id: '', invoice_no: '', description: '', priority: 'Normal',
  });
  const [errors, setErrors] = useState({});
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(null);
  const [copied, setCopied] = useState(false);

  const setField = (key, transform) => (e) => {
    const raw = e.target.value;
    setForm((f) => ({ ...f, [key]: transform ? transform(raw) : cleanText(raw) }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
    if (error) setError('');
  };

  const handleCategoryChange = (e) => {
    setForm((f) => ({ ...f, category: e.target.value, sub_category: '' }));
  };

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 10 * 1024 * 1024) {
      setError('File is too large. Maximum size is 10 MB.');
      return;
    }
    setFile(f);
  };

  const schema = {
    customer_name: [validators.name],
    customer_phone: [validators.phoneIN],
    customer_email: [validators.email],
    description: [(v) => validators.required(v, 'Description'), (v) => validators.minLength(v, 15, 'Description')],
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
      let attachment_url = null;
      if (file) {
        setUploading(true);
        const fd = new FormData();
        fd.append('file', file);
        const upRes = await fetch(ENDPOINTS.ticketUpload, { method: 'POST', body: fd });
        const upData = await upRes.json();
        setUploading(false);
        if (upData?.success) attachment_url = upData.url;
        else { setError(upData?.message || 'Could not upload the attachment. You can still submit without it.'); }
      }

      const res = await fetch(ENDPOINTS.tickets, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, attachment_url, user_id: user?.id || null }),
      });
      const data = await res.json();
      if (data?.success && data?.ticket_code) {
        setSubmitted(data);
      } else {
        setError(data?.message || "We couldn't submit your ticket right now. Please call +91 8679509135 so we can log it for you.");
      }
    } catch {
      setError("We couldn't reach our support service right now. Please call +91 8679509135 so we can log it for you.");
    } finally {
      setLoading(false);
    }
  };

  const copyId = () => {
    navigator.clipboard?.writeText(submitted.ticket_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-white text-slate-900 font-sans flex items-center justify-center px-4 py-24">
        <div className="max-w-md w-full bg-white border border-emerald-200 rounded-3xl p-8 sm:p-10 text-center shadow-sm">
          <CheckCircle2 size={44} className="text-emerald-600 mx-auto mb-5" />
          <h2 className="text-xl font-extrabold text-zinc-900">Ticket Raised</h2>
          <p className="text-zinc-500 text-sm mt-3 leading-relaxed">
            Save this Ticket ID — you'll need it to check status or reply.
          </p>
          <button
            type="button" onClick={copyId}
            className="mt-6 w-full bg-zinc-50 border border-zinc-200 hover:border-amber-400/40 rounded-xl py-4 text-amber-600 font-black text-xl sm:text-2xl tracking-wide transition cursor-pointer flex items-center justify-center gap-3 break-all"
          >
            {submitted.ticket_code}
            {copied ? <Check size={16} className="text-emerald-600 shrink-0" /> : <Copy size={16} className="text-zinc-400 shrink-0" />}
          </button>
          <button
            type="button"
            onClick={() => navigate(`/my-tickets?ticket=${submitted.ticket_code}`)}
            className="mt-4 text-xs font-bold text-amber-600 hover:underline"
          >
            View this ticket &rarr;
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-amber-400 selection:text-black">
      <PageHero
        eyebrow="Support & Ticketing"
        title="Raise a Support Ticket"
        subtitle="Order, scheme, loyalty, product, delivery, payment or account issue — tell us what's wrong and we'll track it end to end."
      />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <form onSubmit={submit} noValidate className="bg-white border border-zinc-200 rounded-2xl p-5 sm:p-7 space-y-5 shadow-sm">

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectField
              id="category" label="Category" required
              options={Object.entries(CATEGORIES).map(([value, c]) => ({ value, label: c.label }))}
              value={form.category} onChange={handleCategoryChange}
            />
            <SelectField
              id="sub_category" label="Specific Issue"
              options={[{ value: '', label: 'Select (optional)' }, ...CATEGORIES[form.category].subs.map((s) => ({ value: s, label: s }))]}
              value={form.sub_category} onChange={setField('sub_category')}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextField
              id="order_id" label="Order ID" placeholder="If applicable"
              value={form.order_id} onChange={setField('order_id')}
            />
            <TextField
              id="invoice_no" label="Invoice Number" placeholder="If applicable"
              value={form.invoice_no} onChange={setField('invoice_no')}
            />
          </div>

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
            id="priority" label="Priority"
            options={['Low', 'Normal', 'High', 'Urgent']}
            value={form.priority} onChange={setField('priority')}
          />

          <TextAreaField
            id="description" label="Describe the Issue" required rows={4}
            placeholder="Please describe what's wrong in as much detail as you can (at least 15 characters)."
            value={form.description} onChange={setField('description', (v) => cleanText(v, 3000))}
            error={errors.description}
            hint={`${form.description.length}/3000 characters`}
          />

          <div>
            <label className="block text-xs font-bold text-zinc-500 mb-1.5">Attachment (image, PDF, or Word doc — optional)</label>
            {file ? (
              <div className="flex items-center justify-between bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3">
                <span className="text-xs text-zinc-700 truncate flex items-center gap-2"><Paperclip size={14} className="text-amber-600 shrink-0" /> {file.name}</span>
                <button type="button" onClick={() => setFile(null)} className="text-zinc-400 hover:text-rose-600 cursor-pointer shrink-0">
                  <X size={16} />
                </button>
              </div>
            ) : (
              <label className="flex items-center justify-center gap-2 border-2 border-dashed border-zinc-200 hover:border-amber-400/50 rounded-xl py-4 text-zinc-500 hover:text-amber-600 text-xs font-bold cursor-pointer transition">
                <Paperclip size={14} /> Attach a file
                <input type="file" className="hidden" accept="image/*,.pdf,.doc,.docx" onChange={handleFileChange} />
              </label>
            )}
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 flex items-start gap-2">
              <AlertCircle size={14} className="text-rose-500 shrink-0 mt-0.5" />
              <p className="text-rose-700 text-xs">{error}</p>
            </div>
          )}

          <button
            type="submit" disabled={loading}
            className="w-full bg-amber-400 hover:bg-amber-500 text-black font-extrabold py-3.5 rounded-xl text-xs uppercase tracking-wider transition cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={15} className="animate-spin" /> : <LifeBuoy size={15} />}
            {uploading ? 'Uploading attachment...' : loading ? 'Submitting...' : 'Raise Ticket'}
          </button>

          <p className="text-[11px] text-zinc-400 text-center">
            Already have a ticket? <Link to="/my-tickets" className="text-amber-600 hover:underline">View your tickets</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
