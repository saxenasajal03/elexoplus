import React, { useState } from 'react';
import { Building2, CheckCircle2 } from 'lucide-react';
import PageHero from '../components/common/PageHero';
import { API_BASE } from '../data/siteContent';
import { defaultCategories } from '../data/siteContent';

export default function BulkEnquiry() {
  const [form, setForm] = useState({
    company_name: '', contact_person: '', phone: '', email: '',
    gst_number: '', city: '', category: defaultCategories[0]?.name || '',
    quantity: '', message: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/bulk_enquiry.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, enquiry_type: 'B2B_BULK' }),
      });
      const data = await res.json().catch(() => ({}));
      if (data?.success === false) {
        setError(data.message || "We couldn't submit your enquiry right now. Please email sales@elexoplus.in directly.");
      } else if (data?.success === true) {
        setSubmitted(true);
      } else {
        setError("We couldn't reach our enquiry service right now. Please email sales@elexoplus.in or call +91 8679509135 directly.");
      }
    } catch {
      setError("We couldn't reach our enquiry service right now. Please email sales@elexoplus.in or call +91 8679509135 directly.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-black text-slate-100 font-sans flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-zinc-950 border border-emerald-500/30 rounded-3xl p-10 text-center">
          <CheckCircle2 size={40} className="text-emerald-400 mx-auto mb-5" />
          <h2 className="text-xl font-extrabold text-white">Enquiry Received</h2>
          <p className="text-zinc-400 text-sm mt-3">Thank you, {form.contact_person || 'there'}. Our B2B sales team will review your requirement and reach out within 1-2 business days with pricing and slab details.</p>
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

      <div className="max-w-2xl mx-auto px-6 py-16">
        <form onSubmit={submit} className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input required placeholder="Company / Firm Name" value={form.company_name} onChange={update('company_name')} className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-400" />
            <input required placeholder="Contact Person" value={form.contact_person} onChange={update('contact_person')} className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-400" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input required type="tel" placeholder="Phone Number" value={form.phone} onChange={update('phone')} className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-400" />
            <input required type="email" placeholder="Email Address" value={form.email} onChange={update('email')} className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-400" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input placeholder="GST Number (optional)" value={form.gst_number} onChange={update('gst_number')} className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-400" />
            <input required placeholder="City" value={form.city} onChange={update('city')} className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-400" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <select value={form.category} onChange={update('category')} className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400">
              {defaultCategories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
            <input required placeholder="Estimated Quantity" value={form.quantity} onChange={update('quantity')} className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-400" />
          </div>
          <textarea rows={3} placeholder="Additional requirements (optional)" value={form.message} onChange={update('message')} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-400" />

          {error && <p className="text-rose-400 text-xs">{error}</p>}

          <button type="submit" disabled={loading} className="w-full bg-amber-400 hover:bg-amber-500 text-black font-extrabold py-3.5 rounded-xl text-xs uppercase tracking-wider transition cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2">
            <Building2 size={15} /> {loading ? 'Submitting...' : 'Submit Bulk Enquiry'}
          </button>
          <p className="text-[11px] text-zinc-600 text-center pt-1">
            Already a registered dealer? <a href="/b2b-login" className="text-amber-400 hover:underline">Login to the B2B Portal</a> instead.
          </p>
        </form>
      </div>
    </div>
  );
}
