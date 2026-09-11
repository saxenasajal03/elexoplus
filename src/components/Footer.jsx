import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/elexoplus-logo-BJqIBdaq.png';
import { ShieldCheck, Mail, Phone, MapPin, ArrowRight, Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';
import { defaultSocialLinks, defaultMarketplaceLinks } from '../data/siteContent';

const socialIcons = { Facebook, Instagram, Twitter, LinkedIn: Linkedin, YouTube: Youtube };

export default function Footer() {
  return (
    <footer className="bg-black text-slate-400 text-sm font-sans border-t border-zinc-800/80 pt-16 pb-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 pb-12 border-b border-zinc-800/80">

        {/* Brand & Mission Column */}
        <div className="lg:col-span-2 space-y-4">
          <Link to="/" className="inline-block">
            <img src={logo} alt="ElexoPlus Logo" className="w-32 object-contain" />
          </Link>
          <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
            ElexoPlus is a premier home appliances manufacturer and B2B distribution ecosystem. Engineered for absolute safety, whisper-quiet efficiency, and robust daily durability.
          </p>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-bold pt-1">
            <ShieldCheck size={16} /> ISO Certified Quality & 2-Year Warranty Support
          </div>

          <div className="pt-2">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-zinc-500 block mb-3">Connect With Us</span>
            <div className="flex items-center space-x-3">
              {defaultSocialLinks.map((social, idx) => {
                const Icon = socialIcons[social.name] || Facebook;
                return (
                  <a
                    key={idx}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-black hover:bg-amber-400 hover:border-amber-400 transition-all duration-200 shadow-sm"
                    aria-label={social.name}
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>

          <div className="pt-3">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-zinc-500 block mb-3">Also Available On</span>
            <div className="flex items-center gap-3 flex-wrap">
              {defaultMarketplaceLinks.map((mp) => (
                <a key={mp.id} href={mp.url} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-zinc-300 border border-zinc-800 px-3 py-1.5 rounded-full hover:border-amber-400/50 hover:text-amber-400 transition">
                  {mp.name}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Shop */}
        <div className="space-y-4">
          <h5 className="text-white font-extrabold uppercase text-xs tracking-widest">Shop</h5>
          <ul className="space-y-2.5 text-xs">
            <li><Link to="/store" className="hover:text-amber-400 transition">Product Catalog</Link></li>
            <li><Link to="/bulk-enquiry" className="hover:text-amber-400 transition">Bulk / B2B Enquiry</Link></li>
            <li><Link to="/oem-enquiry" className="hover:text-amber-400 transition">OEM / White Label</Link></li>
            <li><Link to="/cart" className="hover:text-amber-400 transition">My Cart</Link></li>
            <li><Link to="/orders" className="hover:text-amber-400 transition">My Orders</Link></li>
          </ul>
        </div>

        {/* Company */}
        <div className="space-y-4">
          <h5 className="text-white font-extrabold uppercase text-xs tracking-widest">Company</h5>
          <ul className="space-y-2.5 text-xs">
            <li><Link to="/about" className="hover:text-amber-400 transition">About Corporate</Link></li>
            <li><Link to="/company-legacy" className="hover:text-amber-400 transition">Company Legacy</Link></li>
            <li><Link to="/leadership" className="hover:text-amber-400 transition">Leadership</Link></li>
            <li><Link to="/gallery" className="hover:text-amber-400 transition">Gallery</Link></li>
            <li><Link to="/media" className="hover:text-amber-400 transition">Media Resources</Link></li>
            <li><Link to="/blog" className="hover:text-amber-400 transition">Blog & Insights</Link></li>
            <li><Link to="/events" className="hover:text-amber-400 transition">Events</Link></li>
            <li><Link to="/branches" className="hover:text-amber-400 transition">Branch Offices</Link></li>
            <li><Link to="/careers" className="hover:text-amber-400 transition">Careers</Link></li>
            <li><Link to="/investors" className="hover:text-amber-400 transition">Investors</Link></li>
          </ul>
        </div>

        {/* Support & Portals */}
        <div className="space-y-4">
          <h5 className="text-white font-extrabold uppercase text-xs tracking-widest">Support</h5>
          <ul className="space-y-2.5 text-xs">
            <li><Link to="/contact" className="hover:text-amber-400 transition">Customer Support</Link></li>
            <li><Link to="/track-order" className="hover:text-zinc-200 transition">Track Order & Status</Link></li>
            <li><Link to="/warranty-registration" className="hover:text-zinc-200 transition">Warranty Activation</Link></li>
            <li><Link to="/product-authentication" className="hover:text-zinc-200 transition">Product Authentication</Link></li>
            <li><Link to="/complaint-registration" className="hover:text-zinc-200 transition">Register a Complaint</Link></li>
            <li><Link to="/service-centers" className="hover:text-zinc-200 transition">Service Centers</Link></li>
            <li><Link to="/policy" className="hover:text-zinc-200 transition">Policies</Link></li>
          </ul>
        </div>

        {/* Corporate Office & Enterprise Portals */}
        <div className="space-y-5">
          <div>
            <h5 className="text-white font-extrabold uppercase text-xs tracking-widest mb-3">Enterprise Portals</h5>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/b2b-login" className="text-amber-400 hover:underline flex items-center gap-1 font-bold">B2B Dealer Portal <ArrowRight size={12} /></Link></li>
              <li><Link to="/vendor-portal" className="hover:text-zinc-200 transition">Vendor Onboarding</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="text-white font-extrabold uppercase text-xs tracking-widest mb-3">Corporate Office</h5>
            <ul className="space-y-3 text-xs text-zinc-400">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="text-amber-400 shrink-0 mt-0.5" />
                <span>10/481, Aravali Vihar, R.H.B. Colony, RIICO Industrial Area, Bhiwadi, Rajasthan - 301019.</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-amber-400 shrink-0" />
                <span>+91 8679509135</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-amber-400 shrink-0" />
                <span>sales@elexoplus.in</span>
              </li>
            </ul>
          </div>
        </div>

      </div>

      {/* Bottom Legal & Copyright Bar */}
      <div className="max-w-7xl mx-auto mt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-500">
        <p>© 2026 Elexo Plus India Private Limited. All rights reserved.</p>
        <p className="text-center md:text-right">
          CIN No.: U47594RJ2025PTC101772 | Udyam Reg.: UDYAM-RJ-37-0005128
        </p>
      </div>
    </footer>
  );
}
