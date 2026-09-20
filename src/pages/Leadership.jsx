import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Quote } from 'lucide-react';
import PageHero from '../components/common/PageHero';
import { getCmsContent, defaultLeadership } from '../data/siteContent';

export default function Leadership() {
  const [team, setTeam] = useState(defaultLeadership);

  useEffect(() => {
    getCmsContent('leadership', defaultLeadership).then(setTeam);
  }, []);

  const founders = team.filter(t => t.type === 'Founder' || t.type === 'Co-Founder');
  const others = team.filter(t => !(t.type === 'Founder' || t.type === 'Co-Founder'));

  return (
    <div className="min-h-screen bg-white text-slate-100 font-sans selection:bg-amber-400 selection:text-black">
      <PageHero
        eyebrow="Leadership"
        title="The People Behind ElexoPlus"
        subtitle="Meet the founders and leadership team driving quality, innovation and customer trust across our manufacturing and distribution network."
      />

      <div className="max-w-6xl mx-auto px-6 py-16 md:py-20 space-y-16">

        {/* Founders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {founders.map((p, idx) => (
            <div key={p.id ?? idx} className="bg-white border border-zinc-200 rounded-3xl p-8 hover:border-amber-400/40 transition-colors">
              <div className="flex items-center gap-5">
                <img src={p.photo} alt={p.name} className="w-20 h-20 rounded-2xl object-cover border border-zinc-200" />
                <div>
                  <h3 className="text-zinc-900 font-extrabold text-lg">{p.name}</h3>
                  <p className="text-amber-600 text-xs font-bold uppercase tracking-wide mt-0.5">{p.designation}</p>
                </div>
              </div>
              <p className="text-zinc-500 text-sm leading-relaxed mt-5">{p.bio}</p>
              {p.message && (
                <div className="mt-5 pt-5 border-t border-zinc-200 flex gap-3">
                  <Quote size={22} className="text-amber-600 shrink-0" />
                  <p className="text-zinc-600 text-sm italic leading-relaxed">{p.message}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Leadership grid */}
        {others.length > 0 && (
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-zinc-900 text-center mb-10">Senior Management</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {others.map((p, idx) => (
                <div key={p.id ?? idx} className="text-center bg-white border border-zinc-200 rounded-2xl p-5 hover:border-amber-400/40 transition-colors">
                  <img src={p.photo} alt={p.name} className="w-20 h-20 rounded-full object-cover mx-auto border border-zinc-200" />
                  <h4 className="text-zinc-900 font-bold text-sm mt-4">{p.name}</h4>
                  <p className="text-amber-600 text-[11px] font-bold uppercase tracking-wide mt-1">{p.designation}</p>
                  <p className="text-zinc-500 text-xs mt-2 leading-relaxed line-clamp-3">{p.bio}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-center">
          <Link to="/blog" className="text-amber-600 hover:underline text-sm font-bold">
            Read more leadership thoughts on our Blog &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
