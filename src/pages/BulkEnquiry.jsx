import React, { useState } from 'react';
import { Building2, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHero from '../components/common/PageHero';
import { TextField, TextAreaField, SelectField } from '../components/common/FormField';
import { API_BASE, defaultCategories } from '../data/siteContent';
import { validators, validateForm, cleanText, digitsOnly, createSubmitGuard } from '../utils/validation';

const submitGuard = createSubmitGuard(2500);

export default function BulkEnquiry() {
  const [form, setForm] = useState({
    company_name: '', contact_person: '', phone: '', email: '',
    gst_number: '', city: '', category: defaultCategories[0]?.name || '',
    quantity: '', message: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const setField = (key, transform) => (e) => {
    const raw = e.target.value;
    setForm((f) => ({ ...f, [key]: transform ? transform(raw) : cleanText(raw) }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
    if (error) setError('');
  };

  const schema = {
    company_name: [(v) => validators.required(v, 'Company name'), (v) => validators.minLength(v, 2, 'Company name')],
    contact_person: [validators.name],
    phone: [validators.phoneIN],
    email: [validators.email],
    gst_number: [validators.gstIN],
    city: [(v) => validators.required(v, 'City')],
    quantity: [(v) => validators.required(v, 'Estimated quantity')],
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
      const res = await fetch(`${API_BASE}/bulk_enquiry.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, enquiry_type: 'B2B_BULK' }),
      });
      const data = await res.json().catch(() => ({}));
      if (data?.success === true) {
        setSubmitted(true);
      } else if (data?.success === false) {
        setError(data.message || "We couldn't submit your enquiry right now. Please email sales@elexoplus.in directly.");
      } else {
        setError("We couldn't reach our enquiry service right now. Please email sales@elexoplus.in or call +91 8679509135.");
      }
    } catch {
      setError("We couldn't reach our enquiry service right now. Please email sales@elexoplus.in or call +91 8679509135.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-black text-slate-100 font-sans flex items-center justify-center px-4 py-24">
        <div className="max-w-md w-full bg-zinc-950 border border-emerald-500/30 rounded-3xl p-8 sm:p-10 text-center">
          <CheckCircle2 size={44} className="text-emerald-400 mx-auto mb-5" />
          <h2 className="text-xl font-extrabold text-white">Enquiry Received</h2>
          <p className="text-zinc-400 text-sm mt-3 leading-relaxed">
            Thank you, {form.contact_person}. Our B2B sales team will review your requirement and reach out
            within 1-2 business days with pricing and slab details.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-slate-100 font-sans selection:bg-amber-400 selection:text-black">
      <PageHero
        eyebrow="Bulk / B2B Enquiry"
        title="Wholesale Pricing for Dealers & Businesses"
        subtitle="Tell us your business requirement and our channel sales team will get back with MOQ, slab pricing and credit terms."
      />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <form onSubmit={submit} noValidate className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 sm:p-7 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextField
              id="company_name" label="Company / Firm Name" required
              value={form.company_name} onChange={setField('company_name', (v) => cleanText(v, 255))}
              error={errors.company_name}
            />
            <TextField
              id="contact_person" label="Contact Person" required
              value={form.contact_person} onChange={setField('contact_person', (v) => cleanText(v, 150))}
              error={errors.contact_person}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextField
              id="phone" label="Phone Number" required type="tel" inputMode="numeric" placeholder="10-digit mobile"
              value={form.phone} onChange={setField('phone', (v) => digitsOnly(v, 10))}
              error={errors.phone}
            />
            <TextField
              id="email" label="Email Address" required type="email" placeholder="you@company.com"
              value={form.email} onChange={setField('email', (v) => cleanText(v, 150))}
              error={errors.email}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextField
              id="gst_number" label="GST Number" placeholder="Optional — 15 characters"
              value={form.gst_number}
              onChange={setField('gst_number', (v) => v.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 15))}
              error={errors.gst_number}
            />
            <TextField
              id="city" label="City" required
              value={form.city} onChange={setField('city', (v) => cleanText(v, 100))}
              error={errors.city}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectField
              id="category" label="Product Category" required
              options={defaultCategories.map((c) => ({ value: c.name, label: c.name }))}
              value={form.category} onChange={setField('category')}
              error={errors.category}
            />
            <TextField
              id="quantity" label="Estimated Quantity" required placeholder="e.g. 500 units"
              value={form.quantity} onChange={setField('quantity', (v) => cleanText(v, 50))}
              error={errors.quantity}
            />
          </div>

          <TextAreaField
            id="message" label="Additional Requirements" rows={3} placeholder="Optional"
            value={form.message} onChange={setField('message', (v) => cleanText(v, 1000))}
            error={errors.message}
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
            {loading ? <Loader2 size={15} className="animate-spin" /> : <Building2 size={15} />}
            {loading ? 'Submitting...' : 'Submit Bulk Enquiry'}
          </button>

          <p className="text-[11px] text-zinc-600 text-center">
            Already a registered dealer? <Link to="/b2b-login" className="text-amber-400 hover:underline">Log in to the B2B Portal</Link> instead.
          </p>
        </form>
      </div>
    </div>
  );
}
