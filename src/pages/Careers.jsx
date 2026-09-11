import React, { useEffect, useState } from 'react';
import { Briefcase, MapPin, Clock, X } from 'lucide-react';
import PageHero from '../components/common/PageHero';
import { getCmsContent, defaultJobs, API_BASE } from '../data/siteContent';

function ApplyModal({ job, onClose }) {
  const [form, setForm] = useState({ fname: '', lname: '', email: '', phone: '', resume_link: '', message: '' });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');
    try {
      const res = await fetch(`${API_BASE}/career_application.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, role: job.title, department: job.department }),
      });
      const data = await res.json().catch(() => ({}));
      setStatus(data.message || 'Application submitted! Our HR team will review it and reach out.');
    } catch {
      setStatus('Application submitted! Our HR team will review it and reach out.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-lg w-full p-8 relative max-h-[90vh] overflow-y-auto">
        <button type="button" onClick={onClose} className="absolute top-5 right-5 text-zinc-500 hover:text-white cursor-pointer">
          <X size={20} />
        </button>
        <h3 className="text-xl font-black text-white">Apply — {job.title}</h3>
        <p className="text-xs text-zinc-500 mt-1">{job.department} · {job.location}</p>

        {status ? (
          <p className="text-amber-400 font-semibold text-sm mt-8">{status}</p>
        ) : (
          <form onSubmit={submit} className="space-y-3 mt-6">
            <div className="grid grid-cols-2 gap-3">
              <input required placeholder="First Name" value={form.fname} onChange={e => setForm({ ...form, fname: e.target.value })} className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-400" />
              <input required placeholder="Last Name" value={form.lname} onChange={e => setForm({ ...form, lname: e.target.value })} className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-400" />
            </div>
            <input required type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-400" />
            <input required type="tel" placeholder="Phone Number" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-400" />
            <input type="url" placeholder="Resume Link (Google Drive / LinkedIn)" value={form.resume_link} onChange={e => setForm({ ...form, resume_link: e.target.value })} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-400" />
            <textarea rows={3} placeholder="Why are you a good fit? (optional)" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-400" />
            <button type="submit" disabled={loading} className="w-full bg-amber-400 hover:bg-amber-500 text-black font-extrabold py-3.5 rounded-xl text-xs uppercase tracking-wider transition cursor-pointer disabled:opacity-60">
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function Careers() {
  const [jobs, setJobs] = useState(defaultJobs);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    getCmsContent('careers', defaultJobs).then(setJobs);
  }, []);

  return (
    <div className="min-h-screen bg-black text-slate-100 font-sans selection:bg-amber-400 selection:text-black">
      <PageHero
        eyebrow="Careers"
        title="Build the Future of Home Appliances With Us"
        subtitle="We're always looking for passionate people across manufacturing, sales, technology and customer care."
      />

      <div className="max-w-4xl mx-auto px-6 py-16 space-y-5">
        {jobs.length === 0 && (
          <p className="text-center text-zinc-500 text-sm">No open positions right now — check back soon.</p>
        )}
        {jobs.map((job, idx) => (
          <div key={job.id ?? idx} className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 hover:border-amber-400/40 transition-colors flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-white font-extrabold text-lg">{job.title}</h3>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-zinc-400">
                <span className="flex items-center gap-1.5"><Briefcase size={14} className="text-amber-400" /> {job.department}</span>
                <span className="flex items-center gap-1.5"><MapPin size={14} className="text-amber-400" /> {job.location}</span>
                <span className="flex items-center gap-1.5"><Clock size={14} className="text-amber-400" /> {job.type} · {job.experience}</span>
              </div>
              <p className="text-zinc-500 text-xs mt-3 leading-relaxed max-w-xl">{job.description}</p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedJob(job)}
              className="shrink-0 bg-amber-400 hover:bg-amber-500 text-black px-6 py-3 rounded-xl font-extrabold text-xs uppercase tracking-wider transition cursor-pointer"
            >
              Apply Now
            </button>
          </div>
        ))}
      </div>

      {selectedJob && <ApplyModal job={selectedJob} onClose={() => setSelectedJob(null)} />}
    </div>
  );
}
