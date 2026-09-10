import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, ArrowRight, Zap, Award, ChevronLeft, ChevronRight } from 'lucide-react';

const bannerSlides = [
  {
    id: 1,
    badge: "Official Elexoplus D2C Store",
    titlePrimary: "Smart Living,",
    titleHighlight: "Engineered",
    titleSecondary: "for India",
    description: "Experience unmatched air circulation, instant heating safety, and elegant kitchen appliances designed with uncompromising precision.",
    primaryCta: { text: "Explore Products", link: "/store" },
    secondaryCta: { text: "Dealer / Bulk Portal", link: "/b2b-login" },
    image: "/assets/Chimney-YOfkthXd.png",
    alt: "Elexoplus Flagship Chimney"
  },
  {
    id: 2,
    badge: "Next-Gen Kitchen Solutions",
    titlePrimary: "Culinary Excellence,",
    titleHighlight: "Built",
    titleSecondary: "for Safety",
    description: "Bring home advanced heavy-duty mixer grinders, rapid-boil kettles, and smart induction cooktops built for Indian culinary needs.",
    primaryCta: { text: "Shop Kitchen Range", link: "/store?category=Kitchen+Appliances" },
    secondaryCta: { text: "View Catalog", link: "/store" },
    image: "/assets/Gas_stove-D7GTxQgm.png",
    alt: "Elexoplus Kitchen Appliance"
  }
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-slide effect every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = bannerSlides[currentSlide];

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? bannerSlides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
  };

  return (
    <div className="relative bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white overflow-hidden font-sans border-b border-zinc-800/80 pt-4">
      {/* Background Glow Elements */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 grid grid-cols-1 md:grid-cols-2 items-center gap-12 relative z-10 min-h-[480px]">
        
        {/* Left Content Side */}
        <div className="space-y-6 transition-all duration-500 ease-in-out">
          <br></br><br></br>
          <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider">
            <Sparkles size={14} /> {slide.badge}
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight leading-tight text-white">
            {slide.titlePrimary}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-rose-500">
              {slide.titleHighlight}
            </span>{' '}
            {slide.titleSecondary}
          </h1>
          
          <p className="text-zinc-400 text-sm md:text-base max-w-lg leading-relaxed font-medium">
            {slide.description}
          </p>
          
          <div className="flex flex-wrap gap-4 pt-2">
            <Link 
              to={slide.primaryCta.link} 
              className="bg-amber-400 hover:bg-amber-500 text-black px-8 py-3.5 rounded-full font-extrabold shadow-lg shadow-amber-400/20 transition transform hover:-translate-y-0.5 flex items-center gap-2 text-sm"
            >
              {slide.primaryCta.text} <ArrowRight size={16} />
            </Link>
            
            <Link 
              to={slide.secondaryCta.link} 
              className="bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700 px-8 py-3.5 rounded-full font-extrabold transition text-sm flex items-center gap-2"
            >
              <Zap size={16} className="text-amber-400" /> {slide.secondaryCta.text}
            </Link>
          </div>

          <div className="flex items-center gap-6 pt-6 text-xs text-zinc-400 border-t border-zinc-800/80">
            <span className="flex items-center gap-1.5 font-bold">
              <ShieldCheck size={16} className="text-emerald-400"/> 2-Year Full Warranty
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 font-bold">
              <Award size={16} className="text-amber-400"/> ISO Certified Quality
            </span>
          </div>
        </div>

        {/* Right Image Display Side with Slide Navigation */}
        <div className="relative flex justify-center items-center">
          <div className="absolute w-72 h-72 md:w-96 md:h-96 bg-amber-400/10 rounded-full blur-2xl"></div>
          <img
            key={slide.image}
            src={slide.image}
            alt={slide.alt}
            className="relative z-10 max-h-[380px] object-contain drop-shadow-2xl animate-fadeIn transition duration-500"
          />

          {/* Carousel Arrows */}
          <button 
            onClick={prevSlide} 
            className="absolute left-0 z-20 bg-zinc-900/80 hover:bg-amber-400 hover:text-black text-white p-2.5 rounded-full border border-zinc-700 transition shadow-md"
            aria-label="Previous Slide"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={nextSlide} 
            className="absolute right-0 z-20 bg-zinc-900/80 hover:bg-amber-400 hover:text-black text-white p-2.5 rounded-full border border-zinc-700 transition shadow-md"
            aria-label="Next Slide"
          >
            <ChevronRight size={20} />
          </button>
        </div>

      </div>

      {/* Carousel Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {bannerSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              currentSlide === index ? 'w-8 bg-amber-400' : 'w-2 bg-zinc-600'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}