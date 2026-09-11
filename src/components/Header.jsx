import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import logo from '../assets/elexoplus-logo-BJqIBdaq.png';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import AuthModal from './AuthModal';
import { defaultCategories } from '../data/siteContent';
import {
  ChevronDown, Search, ShoppingCart, User, Menu, X,
  Building2, Users, Image as ImageIcon, FileText, Newspaper,
  CalendarDays, MapPin, Briefcase, LandPlot, LifeBuoy, PackageSearch,
  ShieldCheck, MessageSquareWarning, Wrench, ArrowRight
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Mega-menu structure. Every entry here is intentionally data-driven so the
// Admin CMS (Req #97/#98) can later re-order, hide or add items without a
// code change — this array is the placeholder shape for that future config.
// ---------------------------------------------------------------------------
const companyMenu = [
  { to: '/about', label: 'About Us', icon: Building2, desc: 'Our story, mission & vision' },
  { to: '/company-legacy', label: 'Company Legacy', icon: LandPlot, desc: 'Timeline & milestones since 1996' },
  { to: '/leadership', label: 'Leadership', icon: Users, desc: 'Founder, co-founder & management' },
  { to: '/gallery', label: 'Gallery', icon: ImageIcon, desc: 'Factory, products & events' },
  { to: '/media', label: 'Media Resources', icon: FileText, desc: 'Logos, brochures & press kit' },
  { to: '/branches', label: 'Branch Offices', icon: MapPin, desc: 'Our offices across India' },
  { to: '/careers', label: 'Careers', icon: Briefcase, desc: 'Open roles at ElexoPlus' },
  { to: '/investors', label: 'Investors', icon: FileText, desc: 'Corporate announcements' },
];

const insightsMenu = [
  { to: '/blog', label: 'Blog & Insights', icon: Newspaper, desc: 'Guides, tips & leadership notes' },
  { to: '/events', label: 'Events', icon: CalendarDays, desc: 'Dealer meets, launches & expos' },
];

const supportMenu = [
  { to: '/contact', label: 'Customer Care', icon: LifeBuoy, desc: 'Talk to our support team' },
  { to: '/track-order', label: 'Track Order', icon: PackageSearch, desc: 'Live shipment status' },
  { to: '/warranty-registration', label: 'Warranty Registration', icon: ShieldCheck, desc: 'Activate product warranty' },
  { to: '/product-authentication', label: 'Product Authentication', icon: ShieldCheck, desc: 'Verify serial / QR code' },
  { to: '/complaint-registration', label: 'Register a Complaint', icon: MessageSquareWarning, desc: 'Raise a service ticket' },
  { to: '/service-centers', label: 'Service Centers', icon: Wrench, desc: 'Find authorized service near you' },
];

// Reusable dropdown panel used by every mega-menu trigger below.
function MegaDropdown({ label, items, isOpen, onEnter, onLeave, wide }) {
  return (
    <div className="relative" onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <button
        type="button"
        className={`flex items-center gap-1 transition-colors duration-300 cursor-pointer ${
          isOpen ? 'text-amber-400' : 'text-white hover:text-amber-400'
        }`}
      >
        {label}
        <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          className={`absolute left-1/2 -translate-x-1/2 top-full mt-4 ${wide ? 'w-[560px]' : 'w-72'} bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl shadow-black/60 p-3 grid ${wide ? 'grid-cols-2' : 'grid-cols-1'} gap-1 animate-fadeIn z-40`}
        >
          {items.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="flex items-start gap-3 p-3 rounded-xl hover:bg-zinc-900 transition-colors group"
            >
              <div className="w-9 h-9 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 shrink-0 group-hover:bg-amber-400 group-hover:text-black transition-colors">
                <item.icon size={16} />
              </div>
              <div>
                <p className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">{item.label}</p>
                <p className="text-[11px] text-zinc-500 mt-0.5">{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// Products mega-menu is built from live categories (falls back to defaults),
// keeping it in sync automatically once /store category data is admin-managed.
function ProductsDropdown({ isOpen, onEnter, onLeave }) {
  const navigate = useNavigate();
  return (
    <div className="relative" onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <button
        type="button"
        className={`flex items-center gap-1 transition-colors duration-300 cursor-pointer ${
          isOpen ? 'text-amber-400' : 'text-white hover:text-amber-400'
        }`}
      >
        Products
        <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-4 w-[640px] bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl shadow-black/60 p-5 animate-fadeIn z-40">
          <div className="grid grid-cols-4 gap-4">
            {defaultCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => navigate(`/store?category=${encodeURIComponent(cat.name)}`)}
                className="text-left group cursor-pointer"
              >
                <div className="rounded-xl overflow-hidden border border-zinc-800 group-hover:border-amber-400/60 transition-colors aspect-square bg-zinc-900">
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <p className="text-xs font-bold text-white mt-2 group-hover:text-amber-400 transition-colors">{cat.name}</p>
                <p className="text-[10px] text-zinc-500 line-clamp-1">{cat.tagline}</p>
              </button>
            ))}
          </div>
          <div className="flex items-center justify-between mt-5 pt-4 border-t border-zinc-800">
            <Link to="/store" className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1">
              View Full Catalog <ArrowRight size={12} />
            </Link>
            <Link to="/bulk-enquiry" className="text-xs font-bold text-zinc-300 hover:text-white">
              Bulk / B2B Enquiry
            </Link>
            <Link to="/oem-enquiry" className="text-xs font-bold text-zinc-300 hover:text-white">
              OEM / White Label
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [search, setSearch] = useState('');
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [openMenu, setOpenMenu] = useState(null); // 'products' | 'company' | 'insights' | 'support' | null
  const [mobileAccordion, setMobileAccordion] = useState(null);
  const closeTimer = useRef(null);

  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const totalCartQty = cartItems.reduce((acc, item) => acc + (item.quantity || 0), 0);

  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY <= window.innerHeight);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const closeDropdown = () => setProfileDropdown(false);
    if (profileDropdown) document.addEventListener('click', closeDropdown);
    return () => document.removeEventListener('click', closeDropdown);
  }, [profileDropdown]);

  const openWithDelay = (menu) => {
    clearTimeout(closeTimer.current);
    setOpenMenu(menu);
  };
  const closeWithDelay = () => {
    closeTimer.current = setTimeout(() => setOpenMenu(null), 150);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/store?search=${encodeURIComponent(search.trim())}`);
      setSearch('');
      setIsMenuOpen(false);
      setIsMobileSearchOpen(false);
    }
  };

  const navLinkClass = ({ isActive }) =>
    isActive ? 'text-amber-400 transition-colors duration-300' : 'text-white hover:text-amber-400 transition-colors duration-300';

  return (
    <>
      <header
        className={`fixed ${
          isVisible ? 'top-4 md:top-6' : '-top-full'
        } left-4 right-4 md:left-10 lg:left-16 md:right-10 lg:right-16 bg-black bg-opacity-90 z-30 p-2 md:p-4 shadow-lg rounded-md border-b-2 border-gray-700 transition-all duration-300 ease-in-out font-sans`}
      >
        <div className="w-full flex items-center justify-between px-2 md:px-6">
          {/* Hamburger (mobile) */}
          <div className="lg:hidden">
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white focus:outline-none p-1"
              aria-label="Toggle navigation menu"
            >
              <Menu size={26} />
            </button>
          </div>

          {/* Logo */}
          <div className="flex flex-grow justify-center md:justify-start md:flex-grow-0">
            <Link to="/" onClick={() => setIsMenuOpen(false)}>
              <img src={logo} alt="ElexoPlus Logo" className="w-24 md:w-28 object-contain" />
            </Link>
          </div>

          {/* Desktop mega-nav */}
          <nav className="hidden lg:flex items-center space-x-5 xl:space-x-7 text-sm font-medium">
            <NavLink to="/" className={navLinkClass}>Home</NavLink>

            <ProductsDropdown
              isOpen={openMenu === 'products'}
              onEnter={() => openWithDelay('products')}
              onLeave={closeWithDelay}
            />

            <MegaDropdown
              label="Company"
              items={companyMenu}
              wide
              isOpen={openMenu === 'company'}
              onEnter={() => openWithDelay('company')}
              onLeave={closeWithDelay}
            />

            <MegaDropdown
              label="Insights"
              items={insightsMenu}
              isOpen={openMenu === 'insights'}
              onEnter={() => openWithDelay('insights')}
              onLeave={closeWithDelay}
            />

            <MegaDropdown
              label="Support"
              items={supportMenu}
              wide
              isOpen={openMenu === 'support'}
              onEnter={() => openWithDelay('support')}
              onLeave={closeWithDelay}
            />

            <Link
              to="/b2b-login"
              className="bg-amber-400 hover:bg-amber-500 text-black px-4 py-2 rounded-full font-extrabold text-xs uppercase tracking-wider transition"
            >
              B2B Portal
            </Link>
          </nav>

          {/* Right icons */}
          <div className="flex items-center space-x-2 md:space-x-4 relative">
            <form
              onSubmit={handleSearch}
              className="hidden md:flex relative items-center bg-white/10 border border-white/30 rounded-full px-3 py-1.5 md:px-4 md:py-2"
            >
              <Search size={16} className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent text-white focus:outline-none placeholder-gray-500 w-24 md:w-32 lg:w-48 text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </form>

            <button
              type="button"
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="text-amber-400 hover:text-white transition-colors duration-300 md:hidden p-1"
              aria-label="Open search bar"
            >
              <Search size={22} />
            </button>

            <NavLink to="/cart" className="text-amber-400 hover:text-white transition-colors duration-300 relative p-1" aria-label="Shopping Cart">
              <ShoppingCart size={24} />
              {totalCartQty > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center font-bold">
                  {totalCartQty}
                </span>
              )}
            </NavLink>

            <div className="relative">
              {user ? (
                <>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setProfileDropdown(!profileDropdown); }}
                    className="w-8 h-8 md:w-9 md:h-9 bg-amber-400 text-black rounded-full flex items-center justify-center font-bold cursor-pointer hover:scale-105 transition"
                    aria-label="Open user menu"
                  >
                    {(user?.name?.charAt(0) || user?.email?.charAt(0) || 'U').toUpperCase()}
                  </button>

                  {profileDropdown && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute right-0 mt-3 w-56 bg-white text-black rounded-xl shadow-2xl overflow-hidden border border-gray-200 z-50 text-sm"
                    >
                      <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
                        <p className="text-xs text-gray-500">Logged in as</p>
                        <p className="font-semibold text-black truncate">{user?.name || user?.email}</p>
                      </div>
                      <div className="flex flex-col py-1">
                        <Link to="/orders" className="px-4 py-2.5 hover:bg-gray-100 transition flex items-center gap-2" onClick={() => setProfileDropdown(false)}>📦 My Orders</Link>
                        <Link to="/profile" className="px-4 py-2.5 hover:bg-gray-100 transition flex items-center gap-2" onClick={() => setProfileDropdown(false)}>👤 My Profile</Link>
                        <Link to="/cart" className="px-4 py-2.5 hover:bg-gray-100 transition flex items-center gap-2" onClick={() => setProfileDropdown(false)}>🛒 My Cart</Link>
                        <hr className="my-1 border-gray-200" />
                        <button
                          type="button"
                          onClick={() => { logout(); setProfileDropdown(false); }}
                          className="text-left px-4 py-2.5 hover:bg-red-50 text-red-600 transition flex items-center gap-2 w-full"
                        >
                          🚪 Logout
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setAuthOpen(true)}
                  className="text-amber-400 hover:text-white transition-colors duration-300 p-1"
                  aria-label="Sign In"
                >
                  <User size={24} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile expandable search */}
        {isMobileSearchOpen && (
          <div className="pt-2 px-2 md:hidden">
            <form onSubmit={handleSearch} className="flex items-center bg-white/10 border border-white/30 rounded-full px-3 py-1.5 w-full">
              <Search size={16} className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search products..."
                className="bg-transparent text-white focus:outline-none placeholder-gray-500 w-full text-xs"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
            </form>
          </div>
        )}
      </header>

      {/* Mobile Slide-Out Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-full bg-black bg-opacity-97 z-50 transform ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out lg:hidden flex flex-col overflow-y-auto`}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-800 sticky top-0 bg-black z-10">
          <img src={logo} alt="ElexoPlus" className="w-24 object-contain" />
          <button type="button" onClick={() => setIsMenuOpen(false)} className="text-white focus:outline-none p-2" aria-label="Close navigation menu">
            <X size={26} />
          </button>
        </div>

        <nav className="flex flex-col p-6 space-y-1 text-base">
          <NavLink to="/" onClick={() => setIsMenuOpen(false)} className={({ isActive }) => `py-3 border-b border-zinc-900 ${isActive ? 'text-amber-400 font-bold' : 'text-white'}`}>
            Home
          </NavLink>
          <NavLink to="/store" onClick={() => setIsMenuOpen(false)} className={({ isActive }) => `py-3 border-b border-zinc-900 ${isActive ? 'text-amber-400 font-bold' : 'text-white'}`}>
            All Products
          </NavLink>

          {[
            { key: 'company', label: 'Company', items: companyMenu },
            { key: 'insights', label: 'Insights', items: insightsMenu },
            { key: 'support', label: 'Support', items: supportMenu },
          ].map((section) => (
            <div key={section.key} className="border-b border-zinc-900">
              <button
                type="button"
                onClick={() => setMobileAccordion(mobileAccordion === section.key ? null : section.key)}
                className="w-full flex items-center justify-between py-3 text-white font-semibold cursor-pointer"
              >
                {section.label}
                <ChevronDown size={18} className={`transition-transform ${mobileAccordion === section.key ? 'rotate-180 text-amber-400' : ''}`} />
              </button>
              {mobileAccordion === section.key && (
                <div className="pb-3 pl-3 flex flex-col space-y-3">
                  {section.items.map((item) => (
                    <Link key={item.to} to={item.to} onClick={() => setIsMenuOpen(false)} className="text-sm text-zinc-400 hover:text-amber-400">
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          <Link
            to="/b2b-login"
            onClick={() => setIsMenuOpen(false)}
            className="mt-4 bg-amber-400 text-black text-center py-3 rounded-xl font-extrabold text-sm uppercase tracking-wider"
          >
            B2B Dealer Portal
          </Link>
        </nav>
      </div>

      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
    </>
  );
}
