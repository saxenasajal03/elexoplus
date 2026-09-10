import React from 'react';
import HeroSection from '../components/Home/HeroSection';
import Elevate from '../components/Home/Elevate';
import ProductCarousel from '../components/Home/ProductCarousel';
import CatalogSection from '../components/Home/CatalogSection';
import NewsletterSubscription from '../components/Home/NewsletterSubscription';
import { ShieldCheck, Truck, Headphones, RefreshCw, Award, Zap, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="bg-black font-sans text-slate-100 selection:bg-amber-400 selection:text-black">
      {/* 1. Interactive Multi-Banner Hero Section */}
      <HeroSection />

      {/* 2. Industry Trust & Certification Banner (Havells / Panasonic / Orient Benchmark) */}
      <section className="bg-zinc-950 border-y border-zinc-800/80 py-8 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="bg-amber-500/10 text-amber-400 border border-amber-500/20 p-3.5 rounded-2xl">
              <ShieldCheck size={28} />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-white">Official Warranty</h4>
              <p className="text-xs text-zinc-400">2-Year Full Protection</p>
            </div>
          </div>
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 p-3.5 rounded-2xl">
              <Truck size={28} />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-white">Pan-India Dispatch</h4>
              <p className="text-xs text-zinc-400">Secure Express Logistics</p>
            </div>
          </div>
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 p-3.5 rounded-2xl">
              <Headphones size={28} />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-white">24/7 Expert Support</h4>
              <p className="text-xs text-zinc-400">Dedicated Customer Care</p>
            </div>
          </div>
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="bg-rose-500/10 text-rose-400 border border-rose-500/20 p-3.5 rounded-2xl">
              <RefreshCw size={28} />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-white">Verified Serial RMA</h4>
              <p className="text-xs text-zinc-400">Hassle-Free Replacement</p>
            </div>
          </div>
        </div>
      </section>

      {/* Outer wrapper matching layout structure */}
      <div className="md:px-20 space-y-4">
        
        {/* 3. New Arrivals Product Carousel */}
        

<ProductCarousel title="New Arrivals & Innovations" />

        {/* 4. Elevate Section (Brand Narrative & Flagship Showcase) */}
        <Elevate />

        {/* 5. Trending Now Carousel */}
        

<ProductCarousel title="Trending Now in Indian Homes" />

        {/* 6. Brand Quality & Certification Showcase (SRS Reference Feature) */}
        <section className="bg-gradient-to-b from-black to-zinc-950 py-16 px-6 border-y border-zinc-900 my-10 rounded-3xl mx-4 md:mx-0">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-amber-400 text-xs font-extrabold uppercase tracking-widest bg-amber-400/10 px-3.5 py-1.5 rounded-full border border-amber-400/20 inline-block">
                Uncompromising Standards
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
                Built for Durability, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-rose-500">
                  Certified for Safety
                </span>
              </h2>
              <p className="text-zinc-400 text-sm md:text-base leading-relaxed font-medium">
                Every Elexoplus appliance undergoes rigorous multi-stage quality control, high-voltage thermal insulation checks, and energy efficiency testing before entering your home or B2B distribution channel.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-sm text-white">BEE Star Rated</h5>
                    <p className="text-xs text-zinc-400 mt-0.5">Maximum power savings across fans & water heaters.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-sm text-white">QR Serial Traceability</h5>
                    <p className="text-xs text-zinc-400 mt-0.5">Instant authenticity check and warranty activation.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-zinc-900/60 border border-zinc-800 p-8 rounded-3xl backdrop-blur-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/5 rounded-full blur-3xl pointer-events-none"></div>
              <h3 className="text-xl font-black text-white mb-4">Are you a Dealer or Distributor?</h3>
              <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
                Access bulk volume pricing, credit limit approvals, real-time dispatch tracking, and direct purchase order (PO) placement through our dedicated B2B enterprise portal.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/b2b-login" className="bg-amber-400 hover:bg-amber-500 text-black px-6 py-3 rounded-xl font-extrabold text-xs uppercase tracking-wider transition shadow-lg flex items-center gap-2">
                  <Zap size={16} /> Open B2B Dealer Portal
                </Link>
                <Link to="/contact" className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition border border-zinc-700">
                  Request OEM / Bulk Quote
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Best Sellers Carousel */}
        

<ProductCarousel title="Best Sellers & Customer Favorites" />

        {/* 8. Interactive Multi-Span Catalog Categories Section */}
        <CatalogSection />

        {/* 9. Newsletter Subscription Component */}
        <NewsletterSubscription />

      </div>
    </div>
  );
}