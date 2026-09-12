import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Zap } from 'lucide-react';
import logo from '../../assets/elexoplus-logo-BJqIBdaq.png';

// A mix of on-brand ElexoPlus one-liners and short, well-known public-domain
// quotes about invention, quality and electricity — kept light and quick to
// read during the brief moment a page is loading.
const QUOTES = [
  { text: "A fan doesn't just move air — it moves comfort.", author: 'ElexoPlus' },
  { text: 'Genius is one percent inspiration, ninety-nine percent perspiration.', author: 'Thomas Edison' },
  { text: 'Quality is never an accident; it is the result of intelligent effort.', author: 'John Ruskin' },
  { text: 'Every appliance we ship carries three decades of family craftsmanship.', author: 'ElexoPlus' },
  { text: 'If we all did the things we are capable of, we would astound ourselves.', author: 'Thomas Edison' },
  { text: 'The current between innovation and tradition flows through every product we make.', author: 'ElexoPlus' },
  { text: 'Warmth in winter, comfort in summer — engineered for every Indian home.', author: 'ElexoPlus' },
  { text: 'Behind every great appliance is a QC inspector who said "not yet."', author: 'ElexoPlus' },
  { text: 'The best way to predict the future is to build reliable appliances for it.', author: 'ElexoPlus' },
];

function pickQuote(excludeText) {
  let next = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  if (QUOTES.length > 1) {
    let guard = 0;
    while (next.text === excludeText && guard < 5) {
      next = QUOTES[Math.floor(Math.random() * QUOTES.length)];
      guard++;
    }
  }
  return next;
}

const MIN_VISIBLE_MS = 550;

export default function RouteLoader() {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(false);
  const [quote, setQuote] = useState(() => pickQuote());
  const isFirstRender = useRef(true);
  const hideTimer = useRef(null);

  useEffect(() => {
    // Skip on the very first mount — no need to flash a loader before the
    // app has even shown its first page.
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setQuote((prev) => pickQuote(prev.text));
    setVisible(true);

    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setVisible(false), MIN_VISIBLE_MS);

    return () => clearTimeout(hideTimer.current);
  }, [pathname]);

  return (
    <div
      aria-hidden={!visible}
      className={`fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black transition-opacity duration-300 ${
        visible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      <img src={logo} alt="" className="w-20 object-contain mb-6 animate-pulse" />

      <div className="relative w-10 h-10 mb-8">
        <div className="absolute inset-0 border-2 border-zinc-800 rounded-full" />
        <div className="absolute inset-0 border-2 border-transparent border-t-amber-400 rounded-full animate-spin" />
        <Zap size={14} className="absolute inset-0 m-auto text-amber-400" />
      </div>

      <div className="max-w-sm text-center px-8">
        <p className="text-zinc-200 text-sm md:text-base font-medium leading-relaxed">"{quote.text}"</p>
        <p className="text-amber-400 text-xs font-bold uppercase tracking-widest mt-3">— {quote.author}</p>
      </div>
    </div>
  );
}
