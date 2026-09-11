import React, { useEffect, useMemo, useState } from 'react';
import PageHero from '../components/common/PageHero';
import { getCmsContent, defaultGallery } from '../data/siteContent';

export default function Gallery() {
  const [items, setItems] = useState(defaultGallery);
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    getCmsContent('gallery', defaultGallery).then(setItems);
  }, []);

  const categories = useMemo(() => ['All', ...new Set(items.map(i => i.category))], [items]);
  const filtered = activeCategory === 'All' ? items : items.filter(i => i.category === activeCategory);

  return (
    <div className="min-h-screen bg-black text-slate-100 font-sans selection:bg-amber-400 selection:text-black">
      <PageHero
        eyebrow="Gallery"
        title="A Look Inside ElexoPlus"
        subtitle="Factory floor, product line-ups, team moments and company events — captured across our journey."
      />

      <div className="max-w-7xl mx-auto px-6 py-14">
        {/* Category filter chips */}
        <div className="flex flex-wrap gap-3 justify-center mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                activeCategory === cat
                  ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry-style grid */}
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {filtered.map((item, idx) => (
            <button
              key={item.id ?? idx}
              type="button"
              onClick={() => setLightbox(item)}
              className="block w-full break-inside-avoid rounded-2xl overflow-hidden border border-zinc-800 hover:border-amber-400/50 transition-colors group cursor-pointer"
            >
              <img
                src={item.image}
                alt={item.caption}
                className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/600x400/1A1A1A/FFFFFF?text=ElexoPlus"; }}
              />
              <div className="p-3 bg-zinc-950">
                <p className="text-xs text-zinc-400 text-left line-clamp-1">{item.caption}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-6"
          onClick={() => setLightbox(null)}
        >
          <div className="max-w-3xl w-full">
            <img src={lightbox.image} alt={lightbox.caption} className="w-full rounded-2xl border border-zinc-800" />
            <p className="text-center text-zinc-300 mt-4 text-sm">{lightbox.caption}</p>
          </div>
        </div>
      )}
    </div>
  );
}
