import React from 'react';
import { Link } from 'react-router-dom';
import { LogOut, Package, MapPin, User as UserIcon, Mail, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AddressBook from '../components/checkout/AddressBook';

export default function Profile() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-white text-zinc-900 flex items-center justify-center pt-28 px-6 text-center font-sans">
        <p className="text-zinc-500">Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-zinc-900 pt-28 md:pt-36 px-4 md:px-12 pb-20 font-sans">
      <div className="container mx-auto max-w-4xl space-y-8">
        <h1 className="text-2xl md:text-3xl font-black">My Account</h1>

        {/* Account info card */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-400 text-black flex items-center justify-center font-black text-xl shrink-0">
              {(user?.name?.charAt(0) || user?.email?.charAt(0) || 'U').toUpperCase()}
            </div>
            <div>
              <p className="text-zinc-900 font-extrabold text-lg">{user.name || 'Customer'}</p>
              <p className="text-zinc-500 text-xs flex items-center gap-1.5 mt-1"><Mail size={12} /> {user.email}</p>
              {user.phone && <p className="text-zinc-500 text-xs flex items-center gap-1.5 mt-1"><Phone size={12} /> {user.phone}</p>}
            </div>
          </div>
          <div className="flex gap-3">
            <Link to="/orders" className="flex items-center gap-1.5 bg-zinc-100 border border-zinc-200 hover:border-amber-400/40 text-zinc-600 hover:text-amber-600 text-xs font-bold px-4 py-2.5 rounded-xl transition">
              <Package size={14} /> My Orders
            </Link>
            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-1.5 bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer"
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>

        {/* Address book management */}
        <div>
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-zinc-500 mb-4 flex items-center gap-2">
            <MapPin size={16} className="text-amber-600" /> My Saved Addresses
          </h2>
          <AddressBook mode="manage" />
        </div>
      </div>
    </div>
  );
}
