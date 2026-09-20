import React from 'react';
import { Link } from 'react-router-dom';
import { Headphones, ShieldCheck, PackagePlus, Truck, ArrowRight } from 'lucide-react';

const actions = [
  {
    icon: Headphones,
    title: 'Direct Complaint',
    description: "Facing an issue? Let us know — we're here to help.",
    cta: 'Raise Complaint',
    to: '/complaint-registration',
  },
  {
    icon: ShieldCheck,
    title: 'Warranty Registration',
    description: 'Register your product for warranty coverage.',
    cta: 'Register Now',
    to: '/warranty-registration',
  },
  {
    icon: PackagePlus,
    title: 'Bulk Order',
    description: 'Need bulk? Get special pricing and dedicated support.',
    cta: 'Request Bulk Order',
    to: '/bulk-enquiry',
  },
  {
    icon: Truck,
    title: 'Track Your Order',
    description: 'Check your order status in real time.',
    cta: 'Track Now',
    to: '/track-order',
  },
];

export default function QuickActions() {
  return (
    <section className="py-14 md:py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-0">
        <div className="flex items-center gap-3 mb-1.5">
          <span className="w-6 h-1 bg-amber-400 rounded-full" />
          <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight">Quick Actions</h2>
        </div>
        <p className="text-zinc-500 text-sm mb-8 pl-9">Everything you need, in one place.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {actions.map(({ icon: Icon, title, description, cta, to }) => (
            <Link
              key={title}
              to={to}
              className="group bg-white border border-zinc-200 rounded-2xl p-6 hover:border-amber-400/40 transition-colors flex flex-col"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-400 flex items-center justify-center text-black shrink-0 mb-4 group-hover:scale-105 transition-transform">
                <Icon size={22} strokeWidth={2.2} />
              </div>
              <h3 className="text-zinc-900 font-bold text-base">{title}</h3>
              <p className="text-zinc-500 text-xs mt-2 leading-relaxed flex-1">{description}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 group-hover:gap-2.5 transition-all">
                {cta} <ArrowRight size={14} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
