import React from 'react';
import HeroSection from '../components/Home/HeroSection';
import Elevate from '../components/Home/Elevate';
import ProductCarousel from '../components/Home/ProductCarousel';
import CatalogSection from '../components/Home/CatalogSection';
import NewsletterSubscription from '../components/Home/NewsletterSubscription';
import { ShieldCheck, Truck, Headphones, RefreshCw, Award, Zap, CheckCircle, Calendar, MapPin, ArrowRight, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { defaultBlogPosts, defaultEvents } from '../data/siteContent';

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

        {/* 9. Blog & Insights Highlights (Admin-CMS controlled) */}
        <section className="py-16 px-4 md:px-0">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4 border-b border-zinc-800/80 pb-4">
              <div>
                <span className="text-amber-400 text-[11px] font-extrabold uppercase tracking-widest bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20 inline-block mb-2">
                  From the Blog
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
                  Guides, Tips & Leadership Thoughts
                </h2>
              </div>
              <Link to="/blog" className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1 shrink-0">
                View All Articles <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {defaultBlogPosts.slice(0, 3).map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="group bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden hover:border-amber-400/40 transition-colors flex flex-col"
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/600x400/1A1A1A/FFFFFF?text=ElexoPlus"; }}
                    />
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <span className="text-amber-400 text-[10px] font-extrabold uppercase tracking-wider">{post.category}</span>
                    <h3 className="text-white font-extrabold text-sm mt-2 leading-snug group-hover:text-amber-400 transition-colors line-clamp-2">{post.title}</h3>
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-zinc-800 text-[10px] text-zinc-500">
                      <span className="flex items-center gap-1.5"><User size={11} /> {post.author.split(',')[0]}</span>
                      <span>{new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 10. Upcoming Events Strip (Admin-CMS controlled) */}
        <section className="py-4 pb-16 px-4 md:px-0">
          <div className="max-w-7xl mx-auto bg-zinc-950 border border-zinc-800 rounded-3xl p-8 md:p-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
              <div>
                <span className="text-amber-400 text-[11px] font-extrabold uppercase tracking-widest bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20 inline-block mb-2">
                  What's Happening
                </span>
                <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">Upcoming Events & Launches</h2>
              </div>
              <Link to="/events" className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1 shrink-0">
                View All Events <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {defaultEvents.slice(0, 3).map((ev) => (
                <div key={ev.id} className="bg-black/60 border border-zinc-800 rounded-2xl p-5 hover:border-amber-400/40 transition-colors">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-1 rounded-full border border-amber-400/20">
                    {ev.type}
                  </span>
                  <h4 className="text-white font-bold text-sm mt-3 leading-snug">{ev.title}</h4>
                  <div className="flex flex-col gap-1.5 mt-3 text-[11px] text-zinc-500">
                    <span className="flex items-center gap-1.5"><Calendar size={12} className="text-amber-400" /> {new Date(ev.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    <span className="flex items-center gap-1.5"><MapPin size={12} className="text-amber-400" /> {ev.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 11. Newsletter Subscription Component */}
        <NewsletterSubscription />

      </div>
    </div>
  );
}