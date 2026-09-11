import React, { useEffect, useMemo, useState } from 'react';
import { MapPin, Phone, Mail, ExternalLink } from 'lucide-react';
import PageHero from '../components/common/PageHero';
import { getCmsContent, defaultBranches } from '../data/siteContent';

export default function BranchOffices() {
  const [branches, setBranches] = useState(defaultBranches);
  const [stateFilter, setStateFilter] = useState('All');

  useEffect(() => {
    getCmsContent('branches', defaultBranches).then(setBranches);
  }, []);

  const states = useMemo(() => ['All', ...new Set(branches.map(b => b.state))], [branches]);
  const filtered = stateFilter === 'All' ? branches : branches.filter(b => b.state === stateFilter);

  return (
    <div className="min-h-screen bg-black text-slate-100 font-sans selection:bg-amber-400 selection:text-black">
      <PageHero
        eyebrow="Branch Network"
        title="Our Offices Across India"
        subtitle="From our Bhiwadi manufacturing headquarters to regional sales offices — find the ElexoPlus office nearest to you."
      />

      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="flex flex-wrap gap-3 justify-center mb-10">
          {states.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStateFilter(s)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                stateFilter === s ? 'bg-amber-400 text-black' : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((b, idx) => (
            <div key={b.id ?? idx} className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 hover:border-amber-400/40 transition-colors">
              <h3 className="text-white font-extrabold text-base">{b.name}</h3>
              <p className="text-amber-400 text-xs font-bold uppercase tracking-wide mt-1">{b.city}, {b.state}</p>
              <div className="mt-4 space-y-2.5 text-xs text-zinc-400">
                <p className="flex items-start gap-2"><MapPin size={15} className="text-amber-400 shrink-0 mt-0.5" /> {b.address}</p>
                <p className="flex items-center gap-2"><Phone size={15} className="text-amber-400 shrink-0" /> {b.phone}</p>
                <p className="flex items-center gap-2"><Mail size={15} className="text-amber-400 shrink-0" /> {b.email}</p>
              </div>
              {b.mapUrl && (
                <a href={b.mapUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 mt-4 text-xs font-bold text-amber-400 hover:underline">
                  View on Map <ExternalLink size={12} />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
