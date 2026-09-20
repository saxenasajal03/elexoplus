import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { defaultCategories } from '../../data/siteContent';

export default function CategoriesGrid() {
  const navigate = useNavigate();

  return (
    <section className="py-10 md:py-14 px-4 md:px-0">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-1.5">
          <span className="w-6 h-1 bg-amber-400 rounded-full" />
          <h2 className="text-xl sm:text-2xl font-black text-zinc-900 tracking-tight">Product Categories</h2>
        </div>
        <p className="text-zinc-500 text-xs mb-6 pl-9">Explore our top categories</p>

        {/* Horizontal scroll on mobile, wraps into a grid from sm: up */}
        <div className="flex sm:grid sm:grid-cols-3 lg:grid-cols-4 gap-4 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory scrollbar-hide">
          {defaultCategories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => navigate(`/store?category=${encodeURIComponent(cat.name)}`)}
              className="group relative shrink-0 w-[62vw] sm:w-auto snap-start text-left bg-white border border-zinc-200 rounded-2xl overflow-hidden hover:border-amber-400/50 transition-colors cursor-pointer"
            >
              <div className="aspect-square w-full bg-zinc-100 overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x400/1A1A1A/FFFFFF?text=ElexoPlus'; }}
                />
              </div>
              <div className="p-3.5 pr-14 relative">
                <h3 className="text-zinc-900 font-bold text-sm leading-snug">{cat.name}</h3>
                <p className="text-zinc-500 text-[11px] mt-1 line-clamp-1">{cat.tagline}</p>
                <span className="absolute -top-6 right-3 w-11 h-11 rounded-full bg-amber-400 text-black flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-amber-300 transition-transform">
                  <ArrowUpRight size={18} strokeWidth={2.5} />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
