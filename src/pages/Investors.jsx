import React from 'react';
import { FileText } from 'lucide-react';
import PageHero from '../components/common/PageHero';

export default function Investors() {
  return (
    <div className="min-h-screen bg-black text-slate-100 font-sans selection:bg-amber-400 selection:text-black">
      <PageHero
        eyebrow="Investors"
        title="Corporate & Investor Information"
        subtitle="Official company updates, filings and announcements for investors and stakeholders."
      />

      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-10 text-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 mx-auto mb-5">
            <FileText size={26} />
          </div>
          <h3 className="text-white font-extrabold text-lg">Investor Documents Coming Soon</h3>
          <p className="text-zinc-400 text-sm mt-3 leading-relaxed max-w-md mx-auto">
            This section is reserved for corporate announcements, financial disclosures and investor-facing documents. It will be activated and managed directly from the Admin CMS as our investor relations program grows.
          </p>
          <p className="text-xs text-zinc-500 mt-6">
            CIN No.: U47594RJ2025PTC101772 &nbsp;|&nbsp; Udyam Reg.: UDYAM-RJ-37-0005128
          </p>
        </div>
      </div>
    </div>
  );
}
