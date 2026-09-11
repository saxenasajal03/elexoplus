import React, { useEffect, useState } from 'react';
import { Download, FileText, Image as ImageIcon, Newspaper } from 'lucide-react';
import PageHero from '../components/common/PageHero';
import { getCmsContent, defaultMedia } from '../data/siteContent';

const typeIcon = { Logo: ImageIcon, Catalogue: FileText, Brochure: FileText, Press: Newspaper };

export default function MediaResources() {
  const [items, setItems] = useState(defaultMedia);

  useEffect(() => {
    getCmsContent('media', defaultMedia).then(setItems);
  }, []);

  return (
    <div className="min-h-screen bg-black text-slate-100 font-sans selection:bg-amber-400 selection:text-black">
      <PageHero
        eyebrow="Media Resources"
        title="Press Kit & Downloadable Assets"
        subtitle="Official ElexoPlus logos, product catalogues, brochures and high-resolution press assets for media and partners."
      />

      <div className="max-w-4xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((item, idx) => {
          const Icon = typeIcon[item.type] || FileText;
          return (
            <a
              key={item.id ?? idx}
              href={item.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-4 bg-zinc-950 border border-zinc-800 rounded-2xl p-6 hover:border-amber-400/40 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 shrink-0">
                  <Icon size={22} />
                </div>
                <div>
                  <p className="text-white font-bold text-sm group-hover:text-amber-400 transition-colors">{item.title}</p>
                  <p className="text-zinc-500 text-xs uppercase tracking-wide mt-0.5">{item.type}</p>
                </div>
              </div>
              <Download size={18} className="text-zinc-500 group-hover:text-amber-400 transition-colors shrink-0" />
            </a>
          );
        })}
      </div>

      <div className="max-w-4xl mx-auto px-6 pb-20 text-center text-xs text-zinc-500">
        For media enquiries or interview requests, please reach out via our{' '}
        <a href="/contact" className="text-amber-400 hover:underline">Customer Care</a> page.
      </div>
    </div>
  );
}
