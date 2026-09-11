import React, { useEffect, useState } from 'react';
import PageHero from '../components/common/PageHero';
import { getCmsContent, defaultMilestones } from '../data/siteContent';

export default function CompanyLegacy() {
  const [milestones, setMilestones] = useState(defaultMilestones);

  useEffect(() => {
    getCmsContent('milestones', defaultMilestones).then(setMilestones);
  }, []);

  return (
    <div className="min-h-screen bg-black text-slate-100 font-sans selection:bg-amber-400 selection:text-black">
      <PageHero
        eyebrow="Since 1996"
        title="Our Legacy, Milestone by Milestone"
        subtitle="From a small trading venture in Rajasthan to a nationwide manufacturing and B2B distribution network — here is the ElexoPlus journey."
      />

      <div className="max-w-4xl mx-auto px-6 py-16 md:py-20">
        <div className="relative border-l-2 border-zinc-800 ml-3 md:ml-0 md:pl-0">
          {milestones.map((m, idx) => (
            <div key={m.id ?? idx} className="relative pl-8 md:pl-12 pb-12 last:pb-0">
              <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-amber-400 border-4 border-black shadow-lg shadow-amber-400/30" />
              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 hover:border-amber-400/40 transition-colors">
                <span className="text-amber-400 font-black text-2xl md:text-3xl tracking-tight">{m.year}</span>
                <h3 className="text-white font-extrabold text-lg mt-2">{m.title}</h3>
                <p className="text-zinc-400 text-sm mt-2 leading-relaxed">{m.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
