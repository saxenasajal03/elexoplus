import React, { useEffect, useState } from 'react';
import { Briefcase, MapPin, Clock, X } from 'lucide-react';
import PageHero from '../components/common/PageHero';
import { getCmsContent, defaultJobs, ENDPOINTS } from '../data/siteContent';
import { TextField, TextAreaField } from '../components/common/FormField';
import { validators, validateForm, cleanText, digitsOnly, createSubmitGuard } from '../utils/validation';

const applyGuard = createSubmitGuard(2500);

function ApplyModal({ job, onClose }) {
  const [form, setForm] = useState({ fname: '', lname: '', email: '', phone: '', resume_link: '', message: '' });
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const schema = {
    fname: [validators.name],
    lname: [validators.name],
    email: [validators.email],
    phone: [validators.phoneIN],
  };

  const setField = (key, transform) => (e) => {
    const raw = e.target.value;
    setForm((f) => ({ ...f, [key]: transform ? transform(raw) : cleanText(raw, 255) }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
    if (error) setError('');
  };

  const submit = async (e) => {
    e.preventDefault();
    const { errors: errs, isValid } = validateForm(form, schema);
    setErrors(errs);
    if (!isValid) return;
    if (!applyGuard()) return;

    setLoading(true);
    setError('');
    try {
      const res = await fetch(ENDPOINTS.enquiry, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, type: 'career', role: job.title, department: job.department }),
      });
      const data = await res.json().catch(() => ({}));
      if (data?.success === true) {
        setStatus(data.message || 'Application submitted! Our HR team will review it and reach out.');
      } else if (data?.success === false) {
        setError(data.message || "We couldn't submit your application. Please email your resume to sales@elexoplus.in.");
      } else {
        setError("We couldn't reach our application service right now. Please email your resume to sales@elexoplus.in or call +91 8679509135.");
      }
    } catch {
      setError("We couldn't reach our application service right now. Please email your resume to sales@elexoplus.in or call +91 8679509135.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-zinc-200 rounded-3xl max-w-lg w-full p-8 relative max-h-[90vh] overflow-y-auto">
        <button type="button" onClick={onClose} className="absolute top-5 right-5 text-zinc-500 hover:text-zinc-900 cursor-pointer">
          <X size={20} />
        </button>
        <h3 className="text-xl font-black text-zinc-900">Apply — {job.title}</h3>
        <p className="text-xs text-zinc-500 mt-1">{job.department} · {job.location}</p>

        {status ? (
          <p className="text-amber-600 font-semibold text-sm mt-8">{status}</p>
        ) : (
          <form onSubmit={submit} noValidate className="space-y-4 mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextField id="ap_fname" label="First Name" required value={form.fname}
                onChange={setField('fname', (v) => cleanText(v, 100))} error={errors.fname} />
              <TextField id="ap_lname" label="Last Name" required value={form.lname}
                onChange={setField('lname', (v) => cleanText(v, 100))} error={errors.lname} />
            </div>
            <TextField id="ap_email" label="Email Address" required type="email" placeholder="you@example.com"
              value={form.email} onChange={setField('email', (v) => cleanText(v, 150))} error={errors.email} />
            <TextField id="ap_phone" label="Phone Number" required type="tel" inputMode="numeric"
              placeholder="10-digit mobile" value={form.phone}
              onChange={setField('phone', (v) => digitsOnly(v, 10))} error={errors.phone} />
            <TextField id="ap_resume" label="Resume Link" type="url"
              placeholder="Google Drive / LinkedIn URL" value={form.resume_link}
              onChange={setField('resume_link')} error={errors.resume_link}
              hint="Share a publicly viewable link to your resume." />
            <TextAreaField id="ap_message" label="Why are you a good fit?" rows={3} placeholder="Optional"
              value={form.message} onChange={setField('message', (v) => cleanText(v, 1000))} error={errors.message} />

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3">
                <p className="text-rose-300 text-xs">{error}</p>
              </div>
            )}

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
    <div className="min-h-screen bg-white text-slate-100 font-sans selection:bg-amber-400 selection:text-black">
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
          <div key={job.id ?? idx} className="bg-white border border-zinc-200 rounded-2xl p-6 hover:border-amber-400/40 transition-colors flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-zinc-900 font-extrabold text-lg">{job.title}</h3>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-zinc-500">
                <span className="flex items-center gap-1.5"><Briefcase size={14} className="text-amber-600" /> {job.department}</span>
                <span className="flex items-center gap-1.5"><MapPin size={14} className="text-amber-600" /> {job.location}</span>
                <span className="flex items-center gap-1.5"><Clock size={14} className="text-amber-600" /> {job.type} · {job.experience}</span>
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
