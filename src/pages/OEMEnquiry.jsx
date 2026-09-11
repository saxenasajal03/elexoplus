import React, { useState } from 'react';
import { Factory, CheckCircle2 } from 'lucide-react';
import PageHero from '../components/common/PageHero';
import { API_BASE, defaultCategories } from '../data/siteContent';

export default function OEMEnquiry() {
  const [form, setForm] = useState({
    brand_name: '', contact_person: '', phone: '', email: '',
    category: defaultCategories[0]?.name || '', quantity: '',
    branding_details: '', packaging_details: '', target_price: '', delivery_expectation: '', message: '',
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
      const res = await fetch(`${API_BASE}/oem_enquiry.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, enquiry_type: 'OEM_WHITE_LABEL' }),
      });
      const data = await res.json().catch(() => ({}));
      if (data?.success === true) {
        setSubmitted(true);
      } else if (data?.success === false) {
        setError(data.message || "We couldn't submit your enquiry right now. Please email sales@elexoplus.in directly.");
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
          <h2 className="text-xl font-extrabold text-white">OEM Enquiry Received</h2>
          <p className="text-zinc-400 text-sm mt-3">Thank you. Your OEM / white-label requirement has been routed to our dedicated OEM team — they'll be in touch shortly with feasibility and pricing.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-slate-100 font-sans selection:bg-amber-400 selection:text-black">
      <PageHero
        eyebrow="OEM / White Label"
        title="Manufacture Under Your Own Brand"
        subtitle="Share your product, branding and packaging requirements — our OEM team will assess feasibility, pricing and delivery timelines."
      />

      <div className="max-w-2xl mx-auto px-6 py-16">
        <form onSubmit={submit} className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input required placeholder="Your Brand / Company Name" value={form.brand_name} onChange={update('brand_name')} className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-400" />
            <input required placeholder="Contact Person" value={form.contact_person} onChange={update('contact_person')} className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-400" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input required type="tel" placeholder="Phone Number" value={form.phone} onChange={update('phone')} className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-400" />
            <input required type="email" placeholder="Email Address" value={form.email} onChange={update('email')} className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-400" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <select value={form.category} onChange={update('category')} className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400">
              {defaultCategories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
            <input required placeholder="Required Quantity" value={form.quantity} onChange={update('quantity')} className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-400" />
          </div>
          <input placeholder="Branding / Logo Requirements" value={form.branding_details} onChange={update('branding_details')} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-400" />
          <input placeholder="Packaging Requirements" value={form.packaging_details} onChange={update('packaging_details')} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-400" />
          <div className="grid grid-cols-2 gap-4">
            <input placeholder="Target Price (per unit, optional)" value={form.target_price} onChange={update('target_price')} className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-400" />
            <input placeholder="Delivery Expectation" value={form.delivery_expectation} onChange={update('delivery_expectation')} className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-400" />
          </div>
          <textarea rows={3} placeholder="Technical specifications / additional notes" value={form.message} onChange={update('message')} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-400" />

          {error && <p className="text-rose-400 text-xs">{error}</p>}

          <button type="submit" disabled={loading} className="w-full bg-amber-400 hover:bg-amber-500 text-black font-extrabold py-3.5 rounded-xl text-xs uppercase tracking-wider transition cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2">
            <Factory size={15} /> {loading ? 'Submitting...' : 'Submit OEM Enquiry'}
          </button>
        </form>
      </div>
    </div>
  );
}
