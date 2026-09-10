import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/Store/ProductCard';

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
  }
];

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest" }
];

export default function Store() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  // Filter & Layout States
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [filters, setFilters] = useState({ categories: [], price: [] });
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
    if (query) {
      list = list.filter(p =>
        p.name?.toLowerCase().includes(query) ||
        p.category_name?.toLowerCase().includes(query)
      );
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
    setFilters({ categories: [], price: [] });
    setSortBy("featured");
    setCurrentPage(1);
  };

  const activeFiltersCount = filters.categories.length + filters.price.length;

  return (
    <div className="min-h-screen bg-black text-gray-200 pt-24 md:pt-32 pb-20 px-4 md:px-10 font-sans">
      <div className="container mx-auto max-w-7xl">
        
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 mb-8 border-b border-gray-800 gap-4">
          <div>
            <p className="text-sm text-gray-400 mt-1">Showing {filteredProducts.length} items</p>
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
            {/* Desktop Filter Toggle */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm hover:border-yellow-400 transition"
            >
              <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span>{isSidebarOpen ? "Hide Filters" : "Show Filters"}</span>
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 bg-yellow-500 text-black rounded-full text-xs font-bold flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="md:hidden flex items-center gap-2 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-white"
            >
              <span>Filter & Sort</span>
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 bg-yellow-500 text-black rounded-full text-xs font-bold flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Sort Dropdown */}
            <div className="relative" ref={sortDropdownRef}>
              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-white hover:border-gray-500 transition"
              >
                <span className="text-gray-400 text-xs">Sort by:</span>
                <span className="font-semibold text-yellow-400">
                  {sortOptions.find(o => o.value === sortBy)?.label}
                </span>
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isSortOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl py-2 z-30 animate-fadeIn">
                  {sortOptions.map(option => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSortBy(option.value);
                        setIsSortOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm transition ${
                        sortBy === option.value
                          ? 'bg-yellow-500/10 text-yellow-400 font-semibold'
                          : 'text-gray-300 hover:bg-gray-800'
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
            <span className="text-xs text-gray-400 mr-2">Active filters:</span>
            {filters.categories.map(c => (
              <span
                key={c}
                onClick={() => handleFilterToggle('categories', c)}
                className="px-3 py-1 bg-gray-800 border border-gray-700 rounded-full text-xs text-yellow-400 flex items-center gap-1.5 cursor-pointer hover:bg-gray-700"
              >
                {c} ✕
              </span>
            ))}
            {filters.price.map(p => (
              <span
                key={p}
                onClick={() => handleFilterToggle('price', p)}
                className="px-3 py-1 bg-gray-800 border border-gray-700 rounded-full text-xs text-yellow-400 flex items-center gap-1.5 cursor-pointer hover:bg-gray-700"
              >
                {filterSections[1].options.find(o => o.value === p)?.label} ✕
              </span>
            ))}
            <button
              onClick={clearAllFilters}
              className="text-xs text-red-400 hover:underline ml-2"
            >
              Clear all
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
            <div className="w-64 space-y-6 pr-4">
              {filterSections.map(section => (
                <div key={section.id} className="border-b border-gray-800 pb-5">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-3">
                    {section.name}
                  </h3>
                  <div className="space-y-2.5">
                    {section.options.map(option => {
                      const isChecked = (filters[section.id] || []).includes(option.value);
                      return (
                        <label
                          key={option.value}
                          className="flex items-center gap-3 text-sm text-gray-400 hover:text-white cursor-pointer select-none"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleFilterToggle(section.id, option.value)}
                            className="w-4 h-4 rounded border-gray-700 bg-gray-800 accent-yellow-500 cursor-pointer"
                          />
                          <span className={isChecked ? 'text-yellow-400 font-medium' : ''}>
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
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="aspect-square bg-gray-900 rounded-xl" />
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
              <div className="text-center py-20 bg-gray-950 border border-gray-800 rounded-2xl">
                <p className="text-xl font-semibold text-white mb-2">No Products Found</p>
                <p className="text-sm text-gray-500 mb-6">Try clearing or adjusting your filter criteria.</p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-2.5 bg-yellow-500 text-black font-bold rounded-full text-sm hover:bg-yellow-400 transition"
                >
                  Reset Filters
                </button>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg bg-gray-900 border border-gray-800 text-white disabled:opacity-40 hover:bg-gray-800 transition"
                >
                  ❮
                </button>

                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pageNum = idx + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-9 h-9 rounded-lg font-bold text-sm transition ${
                        currentPage === pageNum
                          ? 'bg-yellow-500 text-black'
                          : 'bg-gray-900 border border-gray-800 text-gray-400 hover:text-white'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg bg-gray-900 border border-gray-800 text-white disabled:opacity-40 hover:bg-gray-800 transition"
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
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="relative bg-gray-900 border-t border-gray-800 rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto z-10 animate-slideUp">
            <div className="flex justify-between items-center pb-4 border-b border-gray-800 mb-6">
              <h2 className="text-lg font-bold text-white">Filters & Sorting</h2>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="text-gray-400 hover:text-white text-xl p-1"
              >
                ✕
              </button>
            </div>

            {/* Mobile Categories & Price Facets */}
            {filterSections.map(section => (
              <div key={section.id} className="mb-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-yellow-400 mb-3">
                  {section.name}
                </h3>
                <div className="space-y-2">
                  {section.options.map(option => {
                    const isChecked = (filters[section.id] || []).includes(option.value);
                    return (
                      <label
                        key={option.value}
                        className="flex items-center gap-3 text-sm text-gray-300 py-1 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleFilterToggle(section.id, option.value)}
                          className="w-4 h-4 rounded border-gray-700 bg-gray-800 accent-yellow-500"
                        />
                        <span className={isChecked ? 'text-yellow-400 font-semibold' : ''}>
                          {option.label}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className="flex gap-4 pt-4 border-t border-gray-800">
              <button
                onClick={clearAllFilters}
                className="flex-1 py-3 border border-gray-700 rounded-xl text-sm font-semibold text-gray-300"
              >
                Clear All
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 py-3 bg-yellow-500 text-black rounded-xl text-sm font-bold"
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