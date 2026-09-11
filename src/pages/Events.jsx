import React, { useEffect, useState } from 'react';
import { Calendar, MapPin, Tag } from 'lucide-react';
import PageHero from '../components/common/PageHero';
import { getCmsContent, defaultEvents } from '../data/siteContent';

export default function Events() {
  const [events, setEvents] = useState(defaultEvents);

  useEffect(() => {
    getCmsContent('events', defaultEvents).then(setEvents);
  }, []);

  const sorted = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="min-h-screen bg-black text-slate-100 font-sans selection:bg-amber-400 selection:text-black">
      <PageHero
        eyebrow="Events"
        title="Dealer Meets, Launches & Expos"
        subtitle="Stay up to date with ElexoPlus product launches, trade shows and our nationwide dealer & distributor network events."
      />

      <div className="max-w-5xl mx-auto px-6 py-16 space-y-6">
        {sorted.map((ev, idx) => {
          const d = new Date(ev.date);
          const upcoming = d >= new Date();
          return (
            <div key={ev.id ?? idx} className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden hover:border-amber-400/40 transition-colors flex flex-col md:flex-row">
              <div className="md:w-64 shrink-0 aspect-video md:aspect-auto">
                <img
                  src={ev.image}
                  alt={ev.title}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/600x400/1A1A1A/FFFFFF?text=ElexoPlus"; }}
                />
              </div>
              <div className="p-6 flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full ${upcoming ? 'bg-amber-400/10 text-amber-400 border border-amber-400/20' : 'bg-zinc-800 text-zinc-500'}`}>
                    {upcoming ? 'Upcoming' : 'Past'}
                  </span>
                  <span className="text-[10px] text-zinc-500 flex items-center gap-1"><Tag size={11} /> {ev.type}</span>
                </div>
                <h3 className="text-white font-extrabold text-lg">{ev.title}</h3>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-zinc-400">
                  <span className="flex items-center gap-1.5"><Calendar size={13} className="text-amber-400" /> {d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  <span className="flex items-center gap-1.5"><MapPin size={13} className="text-amber-400" /> {ev.location}</span>
                </div>
                <p className="text-zinc-500 text-xs mt-3 leading-relaxed">{ev.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
