import React, { useState } from 'react';
import { MessageSquareWarning, CheckCircle2 } from 'lucide-react';
import PageHero from '../components/common/PageHero';
import { API_BASE } from '../data/siteContent';

const complaintTypes = ['Product Not Working', 'Wrong / Damaged Item Received', 'Missing Parts', 'Late Delivery', 'Other'];

export default function ComplaintRegistration() {
  const [form, setForm] = useState({
    order_id: '', invoice_no: '', serial_no: '', customer_name: '',
    customer_phone: '', customer_email: '', complaint_type: complaintTypes[0], description: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(null); // { complaint_id }
  const [error, setError] = useState('');

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/complaint_registration.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data?.success && data?.complaint_id) {
        setSubmitted(data);
      } else {
        setError(data?.message || "We couldn't submit your complaint right now. Please call Customer Care directly so we can register it for you.");
      }
    } catch {
      setError("We couldn't reach our service right now. Please call Customer Care directly so we can register your complaint immediately.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-black text-slate-100 font-sans flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-zinc-950 border border-emerald-500/30 rounded-3xl p-10 text-center">
          <CheckCircle2 size={40} className="text-emerald-400 mx-auto mb-5" />
          <h2 className="text-xl font-extrabold text-white">Complaint Registered</h2>
          <p className="text-zinc-400 text-sm mt-3">Your complaint has been logged with the ID below. Please save it for future reference — it is separate from your Order and Invoice numbers.</p>
          <p className="mt-6 bg-zinc-900 border border-zinc-800 rounded-xl py-4 text-amber-400 font-black text-2xl tracking-wide">
            {submitted.complaint_id}
          </p>
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
        subtitle="Facing an issue with your product or order? Raise a ticket here — you'll receive a unique Complaint ID separate from your original Order ID to track resolution."
      />

      <div className="max-w-2xl mx-auto px-6 py-16">
        <form onSubmit={submit} className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input required placeholder="Order ID" value={form.order_id} onChange={update('order_id')} className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-400" />
            <input placeholder="Invoice No. (optional)" value={form.invoice_no} onChange={update('invoice_no')} className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-400" />
          </div>
          <input placeholder="Product Serial No. (from QR sticker, if applicable)" value={form.serial_no} onChange={update('serial_no')} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-400" />

          <div className="grid grid-cols-2 gap-4">
            <input required placeholder="Your Name" value={form.customer_name} onChange={update('customer_name')} className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-400" />
            <input required type="tel" placeholder="Phone Number" value={form.customer_phone} onChange={update('customer_phone')} className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-400" />
          </div>
          <input required type="email" placeholder="Email Address" value={form.customer_email} onChange={update('customer_email')} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-400" />

          <select value={form.complaint_type} onChange={update('complaint_type')} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400">
            {complaintTypes.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>

          <textarea required rows={4} placeholder="Describe the issue in detail" value={form.description} onChange={update('description')} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-400" />

          {error && <p className="text-rose-400 text-xs">{error}</p>}

          <button type="submit" disabled={loading} className="w-full bg-amber-400 hover:bg-amber-500 text-black font-extrabold py-3.5 rounded-xl text-xs uppercase tracking-wider transition cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2">
            <MessageSquareWarning size={15} /> {loading ? 'Submitting...' : 'Submit Complaint'}
          </button>
        </form>
      </div>
    </div>
  );
}
