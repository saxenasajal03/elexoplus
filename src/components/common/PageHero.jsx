import React from 'react';

/**
 * Shared hero banner for all interior "Company / Insights / Support" pages.
 * Keeps a single consistent premium look (Havells/Orient/Panasonic-style
 * dark hero with amber accent) across the whole site.
 */
export default function PageHero({ eyebrow, title, subtitle }) {
  return (
    <section className="relative bg-gradient-to-b from-zinc-950 to-black border-b border-zinc-900 pt-32 pb-16 md:pt-40 md:pb-20 px-6 overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />
      <div className="max-w-5xl mx-auto text-center relative z-10">
        {eyebrow && (
          <span className="text-amber-400 text-xs font-extrabold uppercase tracking-widest bg-amber-400/10 px-3.5 py-1.5 rounded-full border border-amber-400/20 inline-block mb-5">
            {eyebrow}
          </span>
        )}
        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">{title}</h1>
        {subtitle && <p className="text-zinc-400 text-sm md:text-base mt-4 max-w-2xl mx-auto leading-relaxed">{subtitle}</p>}
      </div>
    </section>
  );
}
