import React, { useEffect, useState } from 'react';
import { Wrench, MapPin, Phone, PackageCheck } from 'lucide-react';
import PageHero from '../components/common/PageHero';
import { getCmsContent, defaultServiceCenters } from '../data/siteContent';

export default function ServiceCenters() {
  const [centers, setCenters] = useState(defaultServiceCenters);

  useEffect(() => {
    getCmsContent('serviceCenters', defaultServiceCenters).then(setCenters);
  }, []);

  return (
    <div className="min-h-screen bg-black text-slate-100 font-sans selection:bg-amber-400 selection:text-black">
      <PageHero
        eyebrow="Authorized Service Network"
        title="Find a Service Center Near You"
        subtitle="Our authorized service centers handle repairs, replacements and warranty claims across India — always linked to your original complaint ID."
      />

      <div className="max-w-5xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-6">
        {centers.map((c, idx) => (
          <div key={c.id ?? idx} className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 hover:border-amber-400/40 transition-colors">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 shrink-0">
                <Wrench size={20} />
              </div>
              <div>
                <h3 className="text-white font-extrabold text-base">{c.name}</h3>
                <p className="text-amber-400 text-[11px] font-bold uppercase tracking-wide mt-1">{c.territory}</p>
              </div>
            </div>
            <div className="mt-4 space-y-2 text-xs text-zinc-400">
              <p className="flex items-start gap-2"><MapPin size={14} className="text-amber-400 shrink-0 mt-0.5" /> {c.address}</p>
              <p className="flex items-center gap-2"><Phone size={14} className="text-amber-400 shrink-0" /> {c.phone}</p>
              <p className="flex items-center gap-2"><PackageCheck size={14} className="text-amber-400 shrink-0" /> Supports: {c.products}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-3xl mx-auto px-6 pb-20 text-center">
        <p className="text-xs text-zinc-500">
          Don't see a center in your area? <a href="/complaint-registration" className="text-amber-400 hover:underline">Register a complaint</a> and our team will assign the nearest available service center to your case.
        </p>
      </div>
    </div>
  );
}
