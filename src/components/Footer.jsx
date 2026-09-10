import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/elexoplus-logo-BJqIBdaq.png';
import { ShieldCheck, Mail, Phone, MapPin, ArrowRight, Globe, Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';

export default function Footer() {
  // Placeholder social media links array - ready to be bound to Admin Panel CMS settings
  const adminSocialLinks = [
    { name: 'Facebook', url: 'https://facebook.com', icon: <Facebook size={18} /> },
    { name: 'Instagram', url: 'https://instagram.com', icon: <Instagram size={18} /> },
    { name: 'Twitter', url: 'https://twitter.com', icon: <Twitter size={18} /> },
    { name: 'LinkedIn', url: 'https://linkedin.com', icon: <Linkedin size={18} /> },
    { name: 'YouTube', url: 'https://youtube.com', icon: <Youtube size={18} /> },
  ];

  return (
    <footer className="bg-black text-slate-400 text-sm font-sans border-t border-zinc-800/80 pt-16 pb-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-zinc-800/80">
        
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

          {/* Admin-Controlled Social Media Links Row */}
          <div className="pt-2">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-zinc-500 block mb-3">Connect With Us</span>
            <div className="flex items-center space-x-3">
              {adminSocialLinks.map((social, idx) => (
                <a
                  key={idx}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-black hover:bg-amber-400 hover:border-amber-400 transition-all duration-200 shadow-sm"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="space-y-4">
          <h5 className="text-white font-extrabold uppercase text-xs tracking-widest">Quick Links</h5>
          <ul className="space-y-2.5 text-xs">
            <li><Link to="/" className="hover:text-amber-400 transition">Home</Link></li>
            <li><Link to="/store" className="hover:text-amber-400 transition">Product Catalog</Link></li>
            <li><Link to="/about" className="hover:text-amber-400 transition">About Corporate</Link></li>
            <li><Link to="/contact" className="hover:text-amber-400 transition">Customer Support</Link></li>
          </ul>
        </div>

        {/* Portals & ERP Network */}
        <div className="space-y-4">
          <h5 className="text-white font-extrabold uppercase text-xs tracking-widest">Enterprise Portals</h5>
          <ul className="space-y-2.5 text-xs">
            <li><Link to="/b2b-login" className="text-amber-400 hover:underline flex items-center gap-1 font-bold">B2B Dealer Portal <ArrowRight size={12} /></Link></li>
            <li><Link to="/vendor-portal" className="hover:text-zinc-200 transition">Vendor Onboarding</Link></li>
            <li><Link to="/track-order" className="hover:text-zinc-200 transition">Track Order & Status</Link></li>
            <li><Link to="/warranty-registration" className="hover:text-zinc-200 transition">Warranty Activation</Link></li>
          </ul>
        </div>

        {/* Corporate Office & Contact */}
        <div className="space-y-4">
          <h5 className="text-white font-extrabold uppercase text-xs tracking-widest">Corporate Office</h5>
          <ul className="space-y-3 text-xs text-zinc-400">
            <li className="flex items-start gap-2">
              <MapPin size={16} className="text-amber-400 shrink-0 mt-0.5" />
              <span>10/481, Bhagat Singh Marg, near RTO ROAD, Sector 9, RIICO Industrial Area, Bhiwadi, Rajasthan 301019.</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} className="text-amber-400 shrink-0" />
              <span>+91 92570-61015</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} className="text-amber-400 shrink-0" />
              <span>sales@elexoplus.in</span>
            </li>
          </ul>
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