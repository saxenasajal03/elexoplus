import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import logo from '../assets/elexoplus-logo-BJqIBdaq.png';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import AuthModal from './AuthModal';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [search, setSearch] = useState('');
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);

  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const totalCartQty = cartItems.reduce((acc, item) => acc + (item.quantity || 0), 0);

  // Scroll visibility handler
  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY <= window.innerHeight);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const closeDropdown = () => setProfileDropdown(false);
    if (profileDropdown) {
      document.addEventListener('click', closeDropdown);
    }
    return () => document.removeEventListener('click', closeDropdown);
  }, [profileDropdown]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/store?search=${encodeURIComponent(search.trim())}`);
      setSearch('');
      setIsMenuOpen(false);
      setIsMobileSearchOpen(false);
    }
  };

  return (
    <>
      <header
        className={`fixed ${
          isVisible ? 'top-4 md:top-6' : '-top-full'
        } left-4 right-4 md:left-10 lg:left-20 md:right-10 lg:right-20 bg-black bg-opacity-90 z-30 p-2 md:p-4 shadow-lg rounded-md border-b-2 border-gray-700 transition-all duration-300 ease-in-out`}
      >
        <div className="w-full flex items-center justify-between px-2 md:px-6">
          {/* Hamburger Menu Icon (Mobile) */}
          <div className="lg:hidden">
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white focus:outline-none p-1"
              aria-label="Toggle navigation menu"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>

          {/* Logo Section */}
          <div className="flex flex-grow justify-center md:justify-start md:flex-grow-0">
            <div className="text-center md:text-left">
              <Link to="/" onClick={() => setIsMenuOpen(false)}>
                <img src={logo} alt="ElexoPlus Logo" className="w-24 md:w-30 object-contain" />
              </Link>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex space-x-3 lg:space-x-6 text-sm lg:text-base font-medium">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? 'text-yellow transition-colors duration-300' : 'text-white hover:text-yellow transition-colors duration-300'
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/store"
              className={({ isActive }) =>
                isActive ? 'text-yellow transition-colors duration-300' : 'text-white hover:text-yellow transition-colors duration-300'
              }
            >
              Products
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                isActive ? 'text-yellow transition-colors duration-300' : 'text-white hover:text-yellow transition-colors duration-300'
              }
            >
              Contact Us
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive ? 'text-yellow transition-colors duration-300' : 'text-white hover:text-yellow transition-colors duration-300'
              }
            >
              About Us
            </NavLink>
          </nav>

          {/* Right Action Icons: Search, Cart, User */}
          <div className="flex items-center space-x-2 md:space-x-4 relative">
            {/* Desktop Search Bar */}
            <form
              onSubmit={handleSearch}
              className="hidden md:flex relative items-center bg-white/1 border border-white/50 rounded-full px-3 py-1.5 md:px-4 md:py-2"
            >
              <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent text-white focus:outline-none placeholder-gray-500 w-24 md:w-40 lg:w-64 text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </form>

            {/* Mobile Search Toggle Button */}
            <button
              type="button"
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="text-yellow hover:text-white transition-colors duration-300 md:hidden p-1"
              aria-label="Open search bar"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Cart Icon with Counter Badge */}
            <NavLink
              to="/cart"
              className="text-yellow hover:text-white transition-colors duration-300 relative p-1"
              aria-label="Shopping Cart"
            >
              <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {totalCartQty > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center font-bold">
                  {totalCartQty}
                </span>
              )}
            </NavLink>

            {/* User Account / Auth Dropdown */}
            <div className="relative">
              {user ? (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setProfileDropdown(!profileDropdown);
                    }}
                    className="w-8 h-8 md:w-9 md:h-9 bg-yellow-500 text-black rounded-full flex items-center justify-center font-bold cursor-pointer hover:scale-105 transition"
                    aria-label="Open user menu"
                  >
                    {(user?.name?.charAt(0) || user?.email?.charAt(0) || 'U').toUpperCase()}
                  </button>

                  {profileDropdown && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute right-0 mt-3 w-56 bg-white text-black rounded-xl shadow-2xl overflow-hidden animate-fadeIn border border-gray-200 z-50 text-sm"
                    >
                      <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
                        <p className="text-xs text-gray-500">Logged in as</p>
                        <p className="font-semibold text-black truncate">{user?.name || user?.email}</p>
                      </div>
                      <div className="flex flex-col py-1">
                        <Link
                          to="/orders"
                          className="px-4 py-2.5 hover:bg-gray-100 transition flex items-center gap-2"
                          onClick={() => setProfileDropdown(false)}
                        >
                          📦 My Orders
                        </Link>
                        <Link
                          to="/profile"
                          className="px-4 py-2.5 hover:bg-gray-100 transition flex items-center gap-2"
                          onClick={() => setProfileDropdown(false)}
                        >
                          👤 My Profile
                        </Link>
                        <Link
                          to="/cart"
                          className="px-4 py-2.5 hover:bg-gray-100 transition flex items-center gap-2"
                          onClick={() => setProfileDropdown(false)}
                        >
                          🛒 My Cart
                        </Link>
                        <hr className="my-1 border-gray-200" />
                        <button
                          type="button"
                          onClick={() => {
                            logout();
                            setProfileDropdown(false);
                          }}
                          className="text-left px-4 py-2.5 hover:bg-red-50 text-red-600 transition flex items-center gap-2"
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
                  className="text-yellow hover:text-white transition-colors duration-300 p-1"
                  aria-label="Sign In"
                >
                  <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Expandable Search Bar */}
        {isMobileSearchOpen && (
          <div className="pt-2 px-2 md:hidden">
            <form onSubmit={handleSearch} className="flex items-center bg-white/1 border border-white/50 rounded-full px-3 py-1.5 w-full">
              <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
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

      {/* Mobile Navigation Slide-Out Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-full bg-black bg-opacity-95 z-50 transform ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out lg:hidden flex flex-col`}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-800">
          <img src={logo} alt="ElexoPlus" className="w-24 object-contain" />
          <button
            type="button"
            onClick={() => setIsMenuOpen(false)}
            className="text-white focus:outline-none p-2"
            aria-label="Close navigation menu"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex flex-col items-center justify-center flex-1 space-y-8 text-2xl">
          <NavLink
            to="/"
            onClick={() => setIsMenuOpen(false)}
            className={({ isActive }) => (isActive ? 'text-yellow font-bold' : 'text-white hover:text-yellow')}
          >
            Home
          </NavLink>
          <NavLink
            to="/store"
            onClick={() => setIsMenuOpen(false)}
            className={({ isActive }) => (isActive ? 'text-yellow font-bold' : 'text-white hover:text-yellow')}
          >
            Products
          </NavLink>
          <NavLink
            to="/contact"
            onClick={() => setIsMenuOpen(false)}
            className={({ isActive }) => (isActive ? 'text-yellow font-bold' : 'text-white hover:text-yellow')}
          >
            Contact Us
          </NavLink>
          <NavLink
            to="/about"
            onClick={() => setIsMenuOpen(false)}
            className={({ isActive }) => (isActive ? 'text-yellow font-bold' : 'text-white hover:text-yellow')}
          >
            About Us
          </NavLink>
        </nav>
      </div>

      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
    </>
  );
}