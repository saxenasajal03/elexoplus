import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

// A mix of on-brand ElexoPlus one-liners and short, well-known public-domain
// quotes about invention and quality — kept light and quick to read during
// the brief moment a page is loading.
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

const MIN_VISIBLE_MS = 600;

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
    <>
      {/* Slim indeterminate progress bar — the modern, unobtrusive pattern
          used by GitHub/Linear/Vercel for page transitions. Sits above
          everything, including the (also light, now) header. */}
      <div
        aria-hidden={!visible}
        className={`fixed top-0 left-0 right-0 z-[210] h-[3px] bg-amber-400/15 overflow-hidden transition-opacity duration-200 ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="loader-bar-track h-full w-1/3 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 rounded-full" />
      </div>

      {/* Light glass overlay with the quote card. Backdrop-blurred rather
          than a solid flash, so the transition feels quick and premium
          instead of jarring — the page behind is still faintly visible. */}
      <div
        aria-hidden={!visible}
        className={`fixed inset-0 z-[200] flex items-center justify-center bg-white/60 backdrop-blur-sm transition-opacity duration-300 ${
          visible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="max-w-xs w-full mx-4 bg-white border border-zinc-200 rounded-2xl shadow-xl shadow-black/5 px-6 py-6 flex flex-col items-center animate-scaleIn">
          {/* Minimal dual-ring spinner — no logo, no icon, just motion */}
          <div className="relative w-9 h-9 mb-5">
            <div className="absolute inset-0 border-[3px] border-zinc-100 rounded-full" />
            <div className="absolute inset-0 border-[3px] border-transparent border-t-amber-400 border-r-amber-400 rounded-full animate-spin" />
          </div>

          <p className="text-zinc-700 text-sm text-center font-medium leading-relaxed">"{quote.text}"</p>
          <p className="text-amber-600 text-[11px] font-bold uppercase tracking-widest mt-3">— {quote.author}</p>
        </div>
      </div>
    </>
  );
}
