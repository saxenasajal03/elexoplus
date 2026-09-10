import React from 'react';
import { Link } from 'react-router-dom';
import product from "../../assets/product-BICEL6TG.png";

export default function Elevate() {
  return (
    <section className="relative overflow-hidden bg-black py-24 px-6 md:px-14 lg:px-20 font-['Nunito',sans-serif]">
      {/* Subtle Background Glow Elements */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-yellow/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 right-0 h-96 w-96 rounded-full bg-zinc-800/40 blur-3xl" />

      <div className="container mx-auto max-w-7xl">
        <div className="relative z-10 grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          
          {/* Left Content Column */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            {/* Top Pill Tag */}
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-yellow/30 bg-yellow/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-yellow">
              <span className="h-1.5 w-1.5 rounded-full bg-yellow animate-pulse" />
              Engineered Excellence
            </div>

            {/* Headline with Brand Accent */}
            <h2 className="mb-6 text-4xl sm:text-5xl lg:text-6xl font-black uppercase leading-[1.08] tracking-tight text-white">
              Elevate Your <br />
              <span className="text-yellow drop-shadow-[0_0_24px_rgba(255,230,20,0.25)]">
                Everyday
              </span>
            </h2>

            {/* Narrative Sub-copy */}
            <p className="mb-8 text-base md:text-xl font-medium leading-relaxed text-zinc-400 max-w-xl">
              Introducing Elexoplus innovations — precision-crafted to balance power, whisper-quiet efficiency, and intuitive daily comfort across every corner of your home.
            </p>

            {/* Highlighted Key Specs Grid */}
            <div className="mb-10 grid grid-cols-2 gap-4 w-full max-w-md">
              <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-4 backdrop-blur-md">
                <span className="block text-2xl font-extrabold text-white">40%</span>
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Energy Saved
                </span>
              </div>
              <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-4 backdrop-blur-md">
                <span className="block text-2xl font-extrabold text-white">&lt;28 dB</span>
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Silent Drive
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/store"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-yellow px-8 py-3.5 text-sm font-extrabold uppercase tracking-wider text-black transition-all duration-200 hover:bg-yellow-400 hover:shadow-[0_0_20px_rgba(255,230,20,0.3)] active:scale-98"
              >
                <span>Explore Innovation</span>
                <span>→</span>
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900/40 px-7 py-3.5 text-sm font-bold text-zinc-300 transition-all duration-200 hover:border-zinc-500 hover:text-white"
              >
                Our Heritage
              </Link>
            </div>
          </div>

          {/* Right Product Showcase Column */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            {/* Ambient Radial Spotlight Behind Product */}
            <div className="absolute h-72 w-72 sm:h-96 sm:w-96 rounded-full bg-gradient-to-tr from-yellow/20 to-transparent blur-2xl" />

            {/* Product Card Container with Subtle Tilt/Float Hover */}
            <div className="group relative w-full max-w-md sm:max-w-lg rounded-3xl border border-zinc-800/80 bg-gradient-to-b from-zinc-900/60 via-zinc-950 to-black p-6 sm:p-10 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:border-yellow/40">
              {/* Product Badge */}
              <div className="absolute top-5 right-5 z-20">
                <span className="rounded-full border border-white/10 bg-black/70 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-zinc-300 backdrop-blur-md">
                  Flagship
                </span>
              </div>

              {/* Product Image */}
              <div className="relative flex items-center justify-center overflow-hidden py-4">
                <img
                  src={product}
                  alt="Elexoplus product innovation"
                  className="h-auto w-full max-h-[380px] object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.9)] transition-transform duration-700 ease-out group-hover:scale-105"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/assets/product-BICEL6TG.png";
                  }}
                />
              </div>

              {/* Bottom Subtle Brand Accent */}
              <div className="mt-4 flex items-center justify-between border-t border-zinc-800/80 pt-4 text-xs font-semibold text-zinc-400">
                <span>All-Season Performance</span>
                <span className="text-yellow">Pure Durability</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}