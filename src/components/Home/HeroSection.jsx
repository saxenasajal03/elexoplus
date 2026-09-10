import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

// Production Appliance Assets
const col1 = [
  "https://project.interndesire.com/assets/ventilation_fan-COpz0dPc.png",
  "https://project.interndesire.com/assets/electric_kettle-CMK_4aNs.png",
  "https://project.interndesire.com/assets/induction-ISIp3-gA.png",
  "https://project.interndesire.com/assets/Water_purifier-B00hNnct.png"
];

const col2 = [
  "https://project.interndesire.com/assets/immersion_rod-C9FVi8PA.png",
  "https://project.interndesire.com/assets/Chimney-YOfkthXd.png",
  "https://project.interndesire.com/assets/mixer_grinder-D6UOhBih.png",
  "https://project.interndesire.com/assets/Gas_stove-D7GTxQgm.png"
];

// Continuous Smooth Scroll Animations
const heroScrollStyles = `
  @keyframes hero-scroll-up {
    0% { transform: translateY(0); }
    100% { transform: translateY(-50%); }
  }
  @keyframes hero-scroll-down {
    0% { transform: translateY(-50%); }
    100% { transform: translateY(0); }
  }
  @keyframes hero-scroll-left {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }

  .animate-hero-up {
    animation: hero-scroll-up linear infinite;
  }
  .animate-hero-down {
    animation: hero-scroll-down linear infinite;
  }
  .animate-hero-left {
    animation: hero-scroll-left linear infinite;
  }
`;

// Desktop Vertical Endless Track
const VerticalTrack = ({ images, animationClass, duration = "36s" }) => (
  <div
    className={`flex-1 flex flex-col gap-4 md:gap-6 ${animationClass}`}
    style={{ animationDuration: duration }}
  >
    {[...images, ...images].map((src, idx) => (
      <div
        key={idx}
        className="w-full bg-zinc-950/80 border border-zinc-800/80 rounded-2xl p-4 shadow-xl flex items-center justify-center group/card transition-all duration-300 hover:border-yellow/50"
      >
        <img
          src={src}
          alt="ElexoPlus product"
          className="w-full h-40 md:h-48 object-contain transition-transform duration-500 group-hover/card:scale-105"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://placehold.co/400x400/1A1A1A/FFFFFF?text=ElexoPlus";
          }}
        />
      </div>
    ))}
  </div>
);

// Mobile Horizontal Endless Ribbon
const HorizontalTrack = ({ images, duration = "28s" }) => (
  <div
    className="flex flex-row w-max gap-4 animate-hero-left items-center"
    style={{ animationDuration: duration }}
  >
    {[...images, ...images].map((src, idx) => (
      <div
        key={idx}
        className="h-28 w-28 flex-shrink-0 bg-zinc-950/90 border border-zinc-800 p-2.5 rounded-xl flex items-center justify-center shadow-lg"
      >
        <img
          src={src}
          alt="ElexoPlus item"
          className="w-full h-full object-contain"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://placehold.co/200x200/1A1A1A/FFFFFF?text=ElexoPlus";
          }}
        />
      </div>
    ))}
  </div>
);

export default function HeroSection() {
  // Inject keyframe stylesheet on mount
  useEffect(() => {
    const styleId = 'elexoplus-hero-animations';
    if (!document.getElementById(styleId)) {
      const styleEl = document.createElement('style');
      styleEl.id = styleId;
      styleEl.innerHTML = heroScrollStyles;
      document.head.appendChild(styleEl);
    }
    return () => {
      const existing = document.getElementById(styleId);
      if (existing) existing.remove();
    };
  }, []);

  return (
    <div className="relative w-screen min-h-screen md:h-screen bg-yellow overflow-hidden font-['Nunito',sans-serif]">
      {/* Visual Depth Background Orbs */}
      <div className="absolute w-[28rem] h-[28rem] md:w-[42rem] md:h-[42rem] bg-gray-400/80 rounded-full -top-24 left-[-10rem] pointer-events-none blur-sm" />
      <div className="absolute w-[36rem] h-[36rem] md:w-[60rem] md:h-[60rem] bg-gray-300/70 rounded-full top-[16rem] left-[-14rem] pointer-events-none blur-sm" />

      <div className="relative z-10 flex flex-col md:flex-row min-h-screen w-full">
        {/* Main Content Area */}
        <div className="flex-1 flex items-center justify-center p-6 md:p-14 lg:p-20 pt-28 md:pt-14">
          <div className="max-w-xl w-full flex flex-col items-center md:items-start text-center md:text-left">
            
            {/* Tag Badge */}
            <span className="inline-block text-black bg-black/10 border border-black/20 text-xs md:text-sm font-extrabold uppercase tracking-widest px-4 py-1 rounded-full mb-6">
              Official ElexoPlus Store
            </span>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-black leading-[1.1] mb-6 tracking-tight">
              Comfort <br className="hidden sm:inline" /> Without <br className="hidden sm:inline" /> Compromise
            </h1>

            {/* Sub-copy */}
            <p className="font-semibold text-lg md:text-xl text-gray-800 leading-relaxed max-w-lg mb-8">
              Discover a collection where timeless designs meet modern craftsmanship — made to keep you cool, elegant, and effortlessly comfortable all season long.
            </p>

            {/* Call To Action */}
            <Link
              to="/store"
              className="inline-flex items-center gap-2 bg-black text-white hover:bg-yellow hover:text-black border-2 border-black font-extrabold py-3.5 px-10 rounded-xl text-base md:text-lg transition-all duration-200 shadow-xl hover:shadow-2xl transform active:scale-98 cursor-pointer"
            >
              <span>Shop Now</span>
              <span>→</span>
            </Link>

            {/* Trust Badges / Stats Metrics */}
            <div className="flex gap-6 sm:gap-8 mt-12 pt-8 border-t border-black/20 w-full justify-center md:justify-start items-center">
              <div>
                <span className="block text-2xl md:text-3xl font-black text-black">5+</span>
                <span className="text-[11px] md:text-xs font-bold text-gray-800 uppercase tracking-widest leading-tight block">
                  Years Exp.
                </span>
              </div>
              <div className="w-px h-10 bg-black/20" />
              <div>
                <span className="block text-2xl md:text-3xl font-black text-black">65%</span>
                <span className="text-[11px] md:text-xs font-bold text-gray-800 uppercase tracking-widest leading-tight block">
                  Energy Saving
                </span>
              </div>
              <div className="w-px h-10 bg-black/20" />
              <div>
                <span className="block text-2xl md:text-3xl font-black text-black">1996</span>
                <span className="text-[11px] md:text-xs font-bold text-gray-800 uppercase tracking-widest leading-tight block">
                  Established
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Live Scroller Container */}
        <div className="w-full md:w-[500px] lg:w-[600px] md:h-screen flex-shrink-0 bg-gray-900 overflow-hidden relative border-t md:border-t-0 md:border-l border-black/20">
          {/* Vertical Columns (Desktop: md and above) */}
          <div className="relative hidden md:flex w-full h-full gap-4 md:gap-6 p-6 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]">
            <VerticalTrack images={col1} animationClass="animate-hero-up" duration="38s" />
            <VerticalTrack images={col2} animationClass="animate-hero-down" duration="42s" />
          </div>

          {/* Horizontal Single Row Ribbon (Mobile: below md) */}
          <div className="relative flex md:hidden w-full h-36 items-center px-4 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
            <HorizontalTrack images={[...col1, ...col2]} duration="30s" />
          </div>
        </div>
      </div>
    </div>
  );
}