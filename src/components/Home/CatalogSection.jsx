import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const catalogItems = [
  {
    title: "Heating Appliances",
    category: "Heating Appliances",
    subtitle: "Precision heating for winter comfort",
    tag: "Winter Essential",
    imageUrl: "/assets/heating-Cimz2wTQ.png",
    layoutClass: "row-span-2 min-h-[340px] md:min-h-[480px]"
  },
  {
    title: "Summer Collection",
    category: "Summer Collection",
    subtitle: "Advanced air circulation & cooling",
    tag: "High Efficiency",
    imageUrl: "/assets/Summer-BgV9wR3f.png",
    layoutClass: "min-h-[160px] md:min-h-[225px]"
  },
  {
    title: "Winter Collection",
    category: "Winter Collection",
    subtitle: "Compact water & space warmers",
    tag: "Top Rated",
    imageUrl: "/assets/Winter-7A8mnezP.png",
    layoutClass: "min-h-[160px] md:min-h-[225px]"
  },
  {
    title: "Kitchen Appliances",
    category: "Kitchen Appliances",
    subtitle: "Smart induction, kettles & chimneys",
    tag: "Smart Cooking",
    imageUrl: "/assets/Kitchen-BYeIJkbK.png",
    layoutClass: "col-span-2 md:col-span-2 min-h-[160px] md:min-h-[225px]"
  }
];

// Interactive Card with 3D Tilt, Radial Spotlight & Glassmorphic Details
const CatalogCard = ({ title, category, subtitle, tag, imageUrl, layoutClass = "" }) => {
  const navigate = useNavigate();
  const cardRef = useRef(null);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleNavigate = () => {
    navigate(`/store?category=${encodeURIComponent(category)}`);
  };

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePos({ x, y });

    // Calculate subtle 3D Tilt angles (-6deg to 6deg)
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;

    setTilt({ rotateX, rotateY });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  return (
    <div
      ref={cardRef}
      onClick={handleNavigate}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleNavigate()}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="button"
      tabIndex={0}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
        transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out'
      }}
      className={`group relative rounded-2xl overflow-hidden cursor-pointer bg-zinc-950 border border-zinc-800/80 hover:border-amber-400 transition-colors duration-300 shadow-xl font-sans outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${layoutClass}`}
    >
      {/* Dynamic Cursor Spotlight Radial Glow */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
        style={{
          background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(251, 191, 36, 0.15), transparent 70%)`
        }}
      />

      {/* Top Floating Category Tag */}
      <div className="absolute top-4 left-4 z-20">
        <span className="backdrop-blur-md bg-black/60 border border-white/10 text-zinc-300 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm group-hover:border-amber-400/40 group-hover:text-amber-400 transition-colors">
          {tag}
        </span>
      </div>

      {/* Background Image with Zoom & Hue Contrast */}
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 group-hover:brightness-105"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "https://placehold.co/600x400/1A1A1A/FFFFFF?text=ElexoPlus";
        }}
      />

      {/* Base Subtle Dark Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />

      {/* Interactive Glassmorphic Content Card at Bottom */}
      <div className="absolute bottom-0 left-0 w-full p-4 md:p-6 z-20 flex flex-col justify-end">
        <div className="transform md:translate-y-2 group-hover:translate-y-0 transition-transform duration-300 ease-out">
          <h3 className="text-white text-lg md:text-2xl font-extrabold tracking-tight group-hover:text-amber-400 transition-colors duration-200">
            {title}
          </h3>
          <p className="text-zinc-400 text-xs md:text-sm mt-1 line-clamp-1 font-medium opacity-90 group-hover:text-zinc-200 transition-colors">
            {subtitle}
          </p>
        </div>

        {/* Action Button Pill */}
        <div className="mt-3 flex items-center justify-between pt-2 border-t border-white/10 opacity-90 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">
            Explore Range
          </span>
          <div className="w-8 h-8 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 group-hover:bg-amber-400 group-hover:text-black transition-all duration-300 transform group-hover:translate-x-1 shadow-sm">
            →
          </div>
        </div>
      </div>
    </div>
  );
};

export default function CatalogSection() {
  return (
    <section className="bg-black py-20 px-4 font-sans">
      <div className="container mx-auto max-w-7xl">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 pb-4 border-b border-zinc-800">
          <div>
            <span className="text-amber-400 text-xs font-extrabold uppercase tracking-widest bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
              Categories
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mt-2.5">
              Discover Our Range
            </h2>
          </div>
          <p className="text-zinc-400 text-xs md:text-sm max-w-sm mt-2 sm:mt-0 font-medium">
            Engineered for durability, aesthetic elegance, and energy efficiency across every home need.
          </p>
        </div>

        {/* Dynamic Multi-Span Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 md:grid-rows-2 gap-3.5 md:gap-6">
          {catalogItems.map((item, idx) => (
            <CatalogCard
              key={idx}
              title={item.title}
              category={item.category}
              subtitle={item.subtitle}
              tag={item.tag}
              imageUrl={item.imageUrl}
              layoutClass={item.layoutClass}
            />
          ))}
        </div>
        
      </div>
    </section>
  );
}