import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/Store/ProductCard';
import { Filter, SlidersHorizontal, ChevronDown, X, RotateCcw } from 'lucide-react';

// Filter Specifications
const filterSections = [
  {
    id: "categories",
    name: "Categories",
    options: [
      { value: "Heating Appliances", label: "Heating Appliances" },
      { value: "Kitchen Appliances", label: "Kitchen Appliances" },
      { value: "Summer Collection", label: "Summer Collection" },
      { value: "Winter Collection", label: "Winter Collection" }
    ]
  },
  {
    id: "price",
    name: "Shop By Price",
    options: [
      { value: "0-5000", label: "Under ₹ 5,000" },
      { value: "5001-10000", label: "₹ 5,001 - ₹ 10,000" },
      { value: "10001-15000", label: "₹ 10,001 - ₹ 15,000" },
      { value: "15001-99999", label: "Over ₹ 15,000" }
    ]
  },
  {
    id: "availability",
    name: "Availability",
    options: [
      { value: "In Stock", label: "In Stock" },
      { value: "Out of Stock", label: "Out of Stock" },
    ]
  }
];

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest Arrivals" }
];

export default function Store() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  // Filter & Layout States
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [filters, setFilters] = useState({ categories: [], price: [], availability: [] });
  const [sortBy, setSortBy] = useState("featured");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const sortDropdownRef = useRef(null);

  // Fetch product catalog from live API
  useEffect(() => {
    setLoading(true);
    fetch("https://project.interndesire.com/api/products.php")
      .then(res => res.json())
      .then(data => {
        if (data.success && data.products) {
          setProducts(data.products);
        } else {
          setProducts([]);
        }
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  // Close sort menu on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(e.target)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Search filter
    const query = searchParams.get('search')?.toLowerCase() || '';
    const categoryParam = searchParams.get('category');
    
    if (query) {
      list = list.filter(p =>
        p.name?.toLowerCase().includes(query) ||
        p.category_name?.toLowerCase().includes(query)
      );
    }

    if (categoryParam) {
      list = list.filter(p => p.category_name?.toLowerCase() === categoryParam.toLowerCase());
    }

    // Categories filter
    if (filters.categories.length > 0) {
      list = list.filter(p => filters.categories.includes(p.category_name));
    }

    // Price range filter
    if (filters.price.length > 0) {
      list = list.filter(p => {
        const price = parseFloat(p.base_price || 0);
        return filters.price.some(range => {
          const [min, max] = range.split("-").map(Number);
          return price >= min && price <= max;
        });
      });
    }

    // Availability filter
    if (filters.availability.length > 0) {
      list = list.filter(p => filters.availability.includes(p.stock_status || 'In Stock'));
    }

    // Sorting
    list.sort((a, b) => {
      const priceA = parseFloat(a.base_price || 0);
      const priceB = parseFloat(b.base_price || 0);
      switch (sortBy) {
        case "price-asc": return priceA - priceB;
        case "price-desc": return priceB - priceA;
        case "newest": return (b.product_id || 0) - (a.product_id || 0);
        default: return 0;
      }
    });

    return list;
  }, [products, searchParams, filters, sortBy]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortBy, searchParams]);

  // Toggle filter selections
  const handleFilterToggle = (sectionId, value) => {
    setFilters(prev => {
      const existing = prev[sectionId] || [];
      const updated = existing.includes(value)
        ? existing.filter(item => item !== value)
        : [...existing, value];
      return { ...prev, [sectionId]: updated };
    });
  };

  const clearAllFilters = () => {
    setFilters({ categories: [], price: [], availability: [] });
    setSortBy("featured");
    setCurrentPage(1);
  };

  const activeFiltersCount = filters.categories.length + filters.price.length + filters.availability.length;

  return (
    <div className="min-h-screen bg-black text-slate-200 pt-28 md:pt-36 pb-20 px-4 md:px-10 font-sans selection:bg-amber-400 selection:text-black">
      <div className="container mx-auto max-w-7xl">
        
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 mb-8 border-b border-zinc-800 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">Elexoplus Catalog Store</h1>
            <p className="text-xs text-zinc-400 mt-1">Showing {filteredProducts.length} verified appliances</p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            {/* Desktop Filter Toggle */}
            <button
              type="button"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden md:flex items-center gap-2 px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-bold text-white hover:border-amber-400/50 transition cursor-pointer"
            >
              <SlidersHorizontal size={15} className="text-amber-400" />
              <span>{isSidebarOpen ? "Hide Filters" : "Show Filters"}</span>
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 bg-amber-400 text-black rounded-full text-[10px] font-black flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Mobile Filter Button */}
            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(true)}
              className="md:hidden flex items-center gap-2 px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-bold text-white cursor-pointer"
            >
              <Filter size={15} className="text-amber-400" />
              <span>Filter & Sort</span>
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 bg-amber-400 text-black rounded-full text-[10px] font-black flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Sort Dropdown */}
            <div className="relative" ref={sortDropdownRef}>
              <button
                type="button"
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-bold text-white hover:border-zinc-700 transition cursor-pointer"
              >
                <span className="text-zinc-400">Sort by:</span>
                <span className="text-amber-400">
                  {sortOptions.find(o => o.value === sortBy)?.label}
                </span>
                <ChevronDown size={14} className="ml-1 text-zinc-400" />
              </button>

              {isSortOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl py-2 z-30 animate-fadeIn overflow-hidden">
                  {sortOptions.map(option => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setSortBy(option.value);
                        setIsSortOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-xs font-semibold transition ${
                        sortBy === option.value
                          ? 'bg-amber-400/10 text-amber-400 font-bold'
                          : 'text-zinc-300 hover:bg-zinc-800'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Active Filter Badges */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-xs text-zinc-500 mr-2 font-medium">Active filters:</span>
            {filters.categories.map(c => (
              <span
                key={c}
                onClick={() => handleFilterToggle('categories', c)}
                className="px-3.5 py-1.5 bg-zinc-900 border border-zinc-800 rounded-full text-xs text-amber-400 font-bold flex items-center gap-1.5 cursor-pointer hover:bg-zinc-800 transition"
              >
                {c} <X size={12} />
              </span>
            ))}
            {filters.price.map(p => (
              <span
                key={p}
                onClick={() => handleFilterToggle('price', p)}
                className="px-3.5 py-1.5 bg-zinc-900 border border-zinc-800 rounded-full text-xs text-amber-400 font-bold flex items-center gap-1.5 cursor-pointer hover:bg-zinc-800 transition"
              >
                {filterSections[1].options.find(o => o.value === p)?.label} <X size={12} />
              </span>
            ))}
            {filters.availability.map(a => (
              <span
                key={a}
                onClick={() => handleFilterToggle('availability', a)}
                className="px-3.5 py-1.5 bg-zinc-900 border border-zinc-800 rounded-full text-xs text-amber-400 font-bold flex items-center gap-1.5 cursor-pointer hover:bg-zinc-800 transition"
              >
                {a} <X size={12} />
              </span>
            ))}
            <button
              type="button"
              onClick={clearAllFilters}
              className="text-xs text-rose-400 hover:underline ml-2 font-bold flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw size={12} /> Clear all
            </button>
          </div>
        )}

        {/* Layout Grid (Sidebar + Products) */}
        <div className="flex gap-8 items-start">
          
          {/* Desktop Collapsible Sidebar */}
          <aside
            className={`hidden md:block transition-all duration-300 overflow-hidden flex-shrink-0 ${
              isSidebarOpen ? 'w-64 opacity-100' : 'w-0 opacity-0 pointer-events-none'
            }`}
          >
            <div className="w-64 space-y-6 pr-4 bg-zinc-950 p-6 rounded-3xl border border-zinc-900">
              {filterSections.map(section => (
                <div key={section.id} className="border-b border-zinc-800/80 pb-5 last:border-b-0 last:pb-0">
                  <h3 className="text-xs font-black uppercase tracking-wider text-amber-400 mb-3">
                    {section.name}
                  </h3>
                  <div className="space-y-2.5">
                    {section.options.map(option => {
                      const isChecked = (filters[section.id] || []).includes(option.value);
                      return (
                        <label
                          key={option.value}
                          className="flex items-center gap-3 text-xs text-zinc-400 hover:text-white cursor-pointer select-none font-medium"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleFilterToggle(section.id, option.value)}
                            className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 accent-amber-400 cursor-pointer"
                          />
                          <span className={isChecked ? 'text-amber-400 font-bold' : ''}>
                            {option.label}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </aside>

          {/* Product Grid Area */}
          <main className="flex-1 w-full">
            {loading ? (
              <div className={`grid gap-6 grid-cols-2 ${isSidebarOpen ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-3 lg:grid-cols-4'}`}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-800/80">
                    <div className="aspect-square w-full skeleton-shimmer" />
                    <div className="p-5 space-y-3">
                      <div className="h-2.5 w-1/3 rounded skeleton-shimmer" />
                      <div className="h-4 w-3/4 rounded skeleton-shimmer" />
                      <div className="h-3 w-1/2 rounded skeleton-shimmer" />
                      <div className="flex items-center justify-between pt-3 border-t border-zinc-800/80">
                        <div className="h-5 w-16 rounded skeleton-shimmer" />
                        <div className="h-8 w-16 rounded-xl skeleton-shimmer" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : paginatedProducts.length > 0 ? (
              <div
                className={`grid gap-6 transition-all duration-300 grid-cols-2 ${
                  isSidebarOpen ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-3 lg:grid-cols-4'
                }`}
              >
                {paginatedProducts.map(product => (
                  <ProductCard key={product.product_id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-zinc-950 border border-zinc-900 rounded-3xl shadow-xl">
                <p className="text-xl font-extrabold text-white mb-2">No Products Found</p>
                <p className="text-xs text-zinc-400 mb-6">Try clearing or adjusting your filter criteria.</p>
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="px-8 py-3 bg-amber-400 text-black font-extrabold rounded-full text-xs uppercase tracking-wider hover:bg-amber-500 transition shadow-lg cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <button
                  type="button"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 text-white disabled:opacity-40 hover:bg-amber-400 hover:text-black transition flex items-center justify-center font-bold cursor-pointer"
                >
                  ❮
                </button>

                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pageNum = idx + 1;
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 rounded-xl font-extrabold text-xs transition cursor-pointer ${
                        currentPage === pageNum
                          ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
                          : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 text-white disabled:opacity-40 hover:bg-amber-400 hover:text-black transition flex items-center justify-center font-bold cursor-pointer"
                >
                  ❯
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Slide-Up Filter Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="relative bg-zinc-950 border-t border-zinc-800 rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto z-10 animate-slideUp">
            <div className="flex justify-between items-center pb-4 border-b border-zinc-800 mb-6">
              <h2 className="text-base font-black text-white">Filters & Sorting</h2>
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="text-zinc-400 hover:text-white p-1 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Mobile Categories & Price Facets */}
            {filterSections.map(section => (
              <div key={section.id} className="mb-6">
                <h3 className="text-xs font-black uppercase tracking-wider text-amber-400 mb-3">
                  {section.name}
                </h3>
                <div className="space-y-2">
                  {section.options.map(option => {
                    const isChecked = (filters[section.id] || []).includes(option.value);
                    return (
                      <label
                        key={option.value}
                        className="flex items-center gap-3 text-xs text-zinc-300 py-1.5 cursor-pointer font-medium"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleFilterToggle(section.id, option.value)}
                          className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 accent-amber-400 cursor-pointer"
                        />
                        <span className={isChecked ? 'text-amber-400 font-bold' : ''}>
                          {option.label}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className="flex gap-4 pt-4 border-t border-zinc-800">
              <button
                type="button"
                onClick={clearAllFilters}
                className="flex-1 py-3.5 border border-zinc-700 rounded-xl text-xs font-bold uppercase tracking-wider text-zinc-300 cursor-pointer"
              >
                Clear All
              </button>
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 py-3.5 bg-amber-400 text-black rounded-xl text-xs font-extrabold uppercase tracking-wider shadow cursor-pointer"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}