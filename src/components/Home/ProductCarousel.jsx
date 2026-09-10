import React, { useEffect, useState, useRef, useCallback } from 'react';
import gsap from 'gsap';
import ProductCard from '../Store/ProductCard';

const FALLBACK_IMAGE = '/assets/product-BICEL6TG.png';

export default function ProductCarousel({ title }) {
  const scrollRef = useRef(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dynamic state for scroll controls and progress indicator
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Fetch and sanitize products with reliable fallback images
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetch("https://project.interndesire.com/api/products.php")
      .then((r) => r.json())
      .then((d) => {
        if (!isMounted) return;
        if (d.success && Array.isArray(d.products)) {
          const sanitized = d.products
            .filter((p) => p && p.product_id)
            .map((p) => {
              const primaryImg =
                p.images?.find((img) => img.is_main === 1 || img.is_main === true)?.image_url ||
                p.images?.[0]?.image_url ||
                p.image_url ||
                p.main_image_url;

              const validImg =
                primaryImg && typeof primaryImg === 'string' && primaryImg.trim() !== ''
                  ? primaryImg
                  : FALLBACK_IMAGE;

              return {
                ...p,
                image_url: validImg,
                main_image_url: validImg,
              };
            });

          setItems(sanitized);
        } else {
          setItems([]);
        }
      })
      .catch((err) => {
        console.error("Error loading products:", err);
        if (isMounted) setItems([]);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Update button states and trackbar percentage
  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

    const maxScroll = scrollWidth - clientWidth;
    setScrollProgress(maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0);
  }, []);

  // Drag-to-scroll & mouse-wheel horizontal physics
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    // Convert vertical wheel to smooth horizontal scroll
    const onWheel = (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        gsap.to(container, {
          scrollLeft: `+=${e.deltaY * 1.3}`,
          duration: 0.5,
          ease: 'power2.out',
          overwrite: 'auto',
          onUpdate: updateScrollState,
        });
      }
    };

    // Click and drag functionality
    let isDown = false;
    let startX = 0;
    let startScrollLeft = 0;

    const onMouseDown = (e) => {
      isDown = true;
      container.classList.add('cursor-grabbing');
      container.classList.remove('cursor-grab');
      startX = e.pageX - container.offsetLeft;
      startScrollLeft = container.scrollLeft;
    };

    const onMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 1.5;
      container.scrollLeft = startScrollLeft - walk;
      updateScrollState();
    };

    const onMouseUpOrLeave = () => {
      isDown = false;
      container.classList.remove('cursor-grabbing');
      container.classList.add('cursor-grab');
    };

    container.addEventListener('wheel', onWheel, { passive: false });
    container.addEventListener('mousedown', onMouseDown);
    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('mouseup', onMouseUpOrLeave);
    container.addEventListener('mouseleave', onMouseUpOrLeave);
    container.addEventListener('scroll', updateScrollState, { passive: true });

    updateScrollState();

    return () => {
      container.removeEventListener('wheel', onWheel);
      container.removeEventListener('mousedown', onMouseDown);
      container.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('mouseup', onMouseUpOrLeave);
      container.removeEventListener('mouseleave', onMouseUpOrLeave);
      container.removeEventListener('scroll', updateScrollState);
    };
  }, [items, updateScrollState]);

  const scroll = (amt) => {
    const container = scrollRef.current;
    if (container) {
      gsap.to(container, {
        scrollLeft: `+=${amt}`,
        duration: 0.75,
        ease: 'power3.inOut',
        overwrite: 'auto',
        onUpdate: updateScrollState,
      });
    }
  };

  return (
    <section className="bg-black pt-20 px-4 md:px-8 font-['Nunito',sans-serif] relative selection:bg-yellow selection:text-black">
      <div className="container mx-auto max-w-7xl">
        
        {/* Header with Title and Custom Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4 border-b border-zinc-800/80 pb-4">
          <div>
            <span className="text-yellow text-[11px] font-extrabold uppercase tracking-widest bg-yellow/10 px-3 py-1 rounded-full border border-yellow/20 inline-block mb-2">
              Explore Collection
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
              {title}
            </h2>
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => scroll(-340)}
              disabled={!canScrollLeft}
              className={`w-11 h-11 rounded-2xl flex items-center justify-center border transition-all duration-200 ${
                canScrollLeft
                  ? 'bg-lightGray border-zinc-700 text-white hover:bg-yellow hover:text-black hover:border-yellow shadow-md cursor-pointer active:scale-95'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-600 cursor-not-allowed opacity-40'
              }`}
              aria-label="Scroll left"
            >
              ❮
            </button>

            <button
              type="button"
              onClick={() => scroll(340)}
              disabled={!canScrollRight}
              className={`w-11 h-11 rounded-2xl flex items-center justify-center border transition-all duration-200 ${
                canScrollRight
                  ? 'bg-lightGray border-zinc-700 text-white hover:bg-yellow hover:text-black hover:border-yellow shadow-md cursor-pointer active:scale-95'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-600 cursor-not-allowed opacity-40'
              }`}
              aria-label="Scroll right"
            >
              ❯
            </button>
          </div>
        </div>

        {/* Carousel Area with Gradient Edge Masks */}
        <div className="relative">
          {/* Left Edge Fade */}
          <div
            className={`pointer-events-none absolute left-0 top-0 bottom-4 w-12 z-20 bg-gradient-to-r from-black to-transparent transition-opacity duration-300 ${
              canScrollLeft ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {/* Right Edge Fade */}
          <div
            className={`pointer-events-none absolute right-0 top-0 bottom-4 w-12 z-20 bg-gradient-to-l from-black to-transparent transition-opacity duration-300 ${
              canScrollRight ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {/* Scrolling Content Track */}
          <div
            ref={scrollRef}
            className="flex space-x-5 md:space-x-6 overflow-x-auto pb-4 scrollbar-hide cursor-grab select-none active:cursor-grabbing"
          >
            {loading ? (
              // Skeleton loading cards
              Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-64 md:w-72 bg-lightGray/50 border border-zinc-800 rounded-2xl p-4 animate-pulse"
                >
                  <div className="w-full aspect-square bg-zinc-800/80 rounded-xl mb-4" />
                  <div className="h-4 bg-zinc-800 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-zinc-800 rounded w-1/2 mb-4" />
                  <div className="h-5 bg-zinc-800 rounded w-1/3" />
                </div>
              ))
            ) : items.length > 0 ? (
              items.map((p) => (
                <div key={p.product_id} className="flex-shrink-0 w-64 md:w-72">
                  <ProductCard product={p} />
                </div>
              ))
            ) : (
              <div className="w-full py-16 text-center text-zinc-500 font-medium bg-zinc-950/60 border border-zinc-900 rounded-2xl">
                No products available.
              </div>
            )}
          </div>
        </div>

        {/* Scroll Progress Bar */}
        {items.length > 0 && (
          <div className="mt-3 w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-yellow h-full rounded-full transition-all duration-300 ease-out shadow-[0_0_8px_rgba(255,230,20,0.5)]"
              style={{ width: `${Math.max(10, scrollProgress)}%` }}
            />
          </div>
        )}

      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}