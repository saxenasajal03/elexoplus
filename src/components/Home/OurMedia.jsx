import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Play, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { defaultGallery } from '../../data/siteContent';

const CAROUSEL_IMAGES = defaultGallery.slice(0, 5);

export default function OurMedia() {
  const [index, setIndex] = useState(0);

  const next = useCallback(() => setIndex((i) => (i + 1) % CAROUSEL_IMAGES.length), []);
  const prev = () => setIndex((i) => (i - 1 + CAROUSEL_IMAGES.length) % CAROUSEL_IMAGES.length);

  useEffect(() => {
    const t = setInterval(next, 4500);
    return () => clearInterval(t);
  }, [next]);

  return (
    <section className="py-10 md:py-14 px-4 md:px-0">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="w-6 h-1 bg-amber-400 rounded-full" />
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">Our Media</h2>
              <p className="text-zinc-500 text-xs mt-0.5">Watch, learn & get inspired</p>
            </div>
          </div>
          <Link to="/gallery" className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1 shrink-0">
            View All <ArrowRight size={13} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Video card */}
          <Link
            to="/gallery"
            className="group relative aspect-video rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 block"
          >
            <img
              src="/assets/heating-Cimz2wTQ.png"
              alt="The Technology Behind Better Living"
              className="w-full h-full object-cover opacity-70 group-hover:opacity-80 group-hover:scale-105 transition-all duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <span className="absolute top-3 left-3 bg-amber-400 text-black text-[10px] font-black uppercase px-2.5 py-1 rounded-md">
              Video
            </span>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-white/15 border border-white/30 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 group-hover:bg-amber-400 transition-all">
                <Play size={20} className="text-white group-hover:text-black fill-current ml-0.5" />
              </div>
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-white font-bold text-sm">The Technology Behind Better Living</p>
            </div>
          </Link>

          {/* Image carousel */}
          <div className="relative aspect-video rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950">
            {CAROUSEL_IMAGES.map((img, i) => (
              <img
                key={img.id}
                src={img.image}
                alt={img.caption}
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/800x450/1A1A1A/FFFFFF?text=ElexoPlus'; }}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${i === index ? 'opacity-100' : 'opacity-0'}`}
              />
            ))}
            <span className="absolute top-3 left-3 bg-amber-400 text-black text-[10px] font-black uppercase px-2.5 py-1 rounded-md">
              Images
            </span>

            <button
              type="button"
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-amber-400 hover:text-black text-white flex items-center justify-center transition cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-amber-400 hover:text-black text-white flex items-center justify-center transition cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {CAROUSEL_IMAGES.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Go to image ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${i === index ? 'w-5 bg-amber-400' : 'w-1.5 bg-white/40'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
