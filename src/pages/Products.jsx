/**
 * Products Page
 * --------------
 * Full product browsing experience with:
 *  - Search bar (filters by name/farmer)
 *  - Category filter sidebar
 *  - Sort dropdown (price, name, rating)
 *  - Skeleton loading state
 *  - Product grid (reuses ProductCard)
 *  - Empty state
 *  - Results count
 *
 * 🎓 NEW REACT HOOKS used here:
 *
 * useEffect(fn, [deps])
 *   Runs `fn` after the component renders.
 *   The [deps] array controls WHEN it re-runs:
 *   - []    → run once (on mount only) — like "componentDidMount"
 *   - [x]   → re-run whenever x changes
 *   - none  → re-run after every render (avoid this!)
 *   We use it to simulate a loading delay (real apps: fetch API here).
 *
 * useMemo(fn, [deps])
 *   Caches the result of `fn` and only recalculates when [deps] change.
 *   We use it so filtering/sorting doesn't re-run on every keystroke
 *   unless the relevant state actually changed. Great for performance.
 */

import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { PRODUCTS, CATEGORIES } from '../data/products';
import ProductCard from '../components/product/ProductCard';
import { SkeletonGrid } from '../components/ui/SkeletonCard';
import './Products.css';

/* ── Sort options ── */
const SORT_OPTIONS = [
  { value: 'featured',   label: 'Featured'       },
  { value: 'price-asc',  label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'rating',     label: 'Highest Rated'   },
  { value: 'name',       label: 'Name A → Z'      },
];

export default function Products() {
  // ── State ──────────────────────────────────────────────
  const [searchQuery,      setSearchQuery]      = useState('');
  const [activeCategory,   setActiveCategory]   = useState('all');
  const [sortBy,           setSortBy]           = useState('featured');
  const [isLoading,        setIsLoading]        = useState(true);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  // 🎓 useEffect — Simulates an API fetch delay on page mount
  // In a real app, this is where you'd write:
  //   const res = await fetch('/api/products');
  //   const data = await res.json();
  //   setProducts(data);
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 900); // 900ms fake delay
    // Cleanup function — cancels the timer if the component unmounts before it fires
    // This prevents memory leaks (a common React mistake to avoid!)
    return () => clearTimeout(timer);
  }, []); // [] means: run once, when the component first appears on screen

  // 🎓 useMemo — filtered + sorted product list
  // Only recalculates when searchQuery, activeCategory, or sortBy changes.
  // Without useMemo, this would re-run on every render (even unrelated ones).
  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS];

    // 1. Filter by category
    if (activeCategory !== 'all') {
      result = result.filter((p) => p.category === activeCategory);
    }

    // 2. Filter by search query (case-insensitive)
    // .toLowerCase() makes "tomato" match "Tomato", "TOMATO", etc.
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.farmerName.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    // 3. Sort
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'featured':
      default:
        // Featured first, then rest
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    return result;
  }, [searchQuery, activeCategory, sortBy]); // recalculate when any of these change

  // Reset to 'all' whenever search clears a category
  const handleCategoryChange = (catId) => {
    setActiveCategory(catId);
    setShowMobileFilter(false);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    // If user types a search, reset category to 'all' for broader results
    if (e.target.value && activeCategory !== 'all') {
      setActiveCategory('all');
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setActiveCategory('all');
    setSortBy('featured');
  };

  const hasActiveFilters = searchQuery || activeCategory !== 'all' || sortBy !== 'featured';

  return (
    <div className="products-page">

      {/* ── Page Header ── */}
      <div className="products-page__header">
        <div className="container">
          {/* Breadcrumb */}
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/" className="breadcrumb__link">Home</Link>
            <span className="breadcrumb__sep" aria-hidden="true">›</span>
            <span className="breadcrumb__current" aria-current="page">Products</span>
          </nav>

          <div className="products-page__header-content">
            <div>
              <h1 className="products-page__title">Fresh Produce</h1>
              <p className="products-page__subtitle">
                Seasonal goodness sourced directly from{' '}
                <strong>{PRODUCTS.length}+</strong> local farmers.
              </p>
            </div>

            {/* Search bar */}
            <div className="products-search">
              <div className="products-search__wrap">
                <svg className="products-search__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
                <input
                  id="product-search"
                  type="search"
                  className="input products-search__input"
                  placeholder="Search products or farmers…"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  aria-label="Search products"
                  autoComplete="off"
                />
                {/* Clear button — only shown when there's a query */}
                {searchQuery && (
                  <button
                    className="products-search__clear"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Layout: Sidebar + Grid ── */}
      <div className="container products-layout">

        {/* ── Sidebar ── */}
        {/* Mobile filter toggle */}
        <button
          className="products-filter-toggle btn btn-outline btn-sm"
          onClick={() => setShowMobileFilter((o) => !o)}
          aria-expanded={showMobileFilter}
          aria-controls="filter-sidebar"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <line x1="4" y1="6" x2="20" y2="6"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
            <line x1="11" y1="18" x2="13" y2="18"/>
          </svg>
          {showMobileFilter ? 'Hide Filters' : 'Filters'}
        </button>

        <aside
          id="filter-sidebar"
          className={`products-sidebar${showMobileFilter ? ' products-sidebar--open' : ''}`}
          aria-label="Product filters"
        >
          <div className="products-sidebar__section">
            <h2 className="products-sidebar__heading">Category</h2>
            <ul className="products-sidebar__list" role="listbox" aria-label="Filter by category">
              {CATEGORIES.map(({ id, label, icon }) => {
                // Count products in each category for the badge number
                const count = id === 'all'
                  ? PRODUCTS.length
                  : PRODUCTS.filter((p) => p.category === id).length;

                return (
                  <li key={id} role="option" aria-selected={activeCategory === id}>
                    <button
                      className={`products-sidebar__item ${activeCategory === id ? 'products-sidebar__item--active' : ''}`}
                      onClick={() => handleCategoryChange(id)}
                    >
                      <span className="products-sidebar__item-icon" aria-hidden="true">{icon}</span>
                      <span className="products-sidebar__item-label">{label}</span>
                      <span className="products-sidebar__item-count">{count}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Clear filters button */}
          {hasActiveFilters && (
            <button className="btn btn-ghost btn-sm products-sidebar__clear" onClick={clearFilters}>
              ✕ Clear all filters
            </button>
          )}
        </aside>

        {/* ── Products Column ── */}
        <div className="products-main">

          {/* Toolbar: count + sort */}
          <div className="products-toolbar">
            <p className="products-toolbar__count" aria-live="polite">
              {isLoading
                ? 'Loading products…'
                : `${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''} found`}
            </p>

            <div className="products-toolbar__sort">
              <label htmlFor="sort-select" className="products-toolbar__sort-label">Sort by:</label>
              <select
                id="sort-select"
                className="products-toolbar__select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                {SORT_OPTIONS.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Active filter chips */}
          {hasActiveFilters && !isLoading && (
            <div className="products-filter-chips" aria-label="Active filters">
              {activeCategory !== 'all' && (
                <span className="filter-chip">
                  {CATEGORIES.find((c) => c.id === activeCategory)?.label}
                  <button onClick={() => setActiveCategory('all')} aria-label="Remove category filter">✕</button>
                </span>
              )}
              {searchQuery && (
                <span className="filter-chip">
                  "{searchQuery}"
                  <button onClick={() => setSearchQuery('')} aria-label="Clear search">✕</button>
                </span>
              )}
              {sortBy !== 'featured' && (
                <span className="filter-chip">
                  {SORT_OPTIONS.find((s) => s.value === sortBy)?.label}
                  <button onClick={() => setSortBy('featured')} aria-label="Reset sort">✕</button>
                </span>
              )}
            </div>
          )}

          {/* ── Grid ── */}
          <div className="products-grid-main" role="list" aria-label="Products">

            {/* Loading state — show 8 skeleton cards */}
            {isLoading && <SkeletonGrid count={8} />}

            {/* Loaded + has results */}
            {!isLoading && filteredProducts.length > 0 &&
              filteredProducts.map((product) => (
                <div key={product.id} role="listitem">
                  <ProductCard product={product} />
                </div>
              ))
            }

            {/* Loaded + empty state */}
            {!isLoading && filteredProducts.length === 0 && (
              <div className="products-empty" role="status">
                <span className="products-empty__icon" aria-hidden="true">🔍</span>
                <h2 className="products-empty__title">No products found</h2>
                <p className="products-empty__desc">
                  Try a different search term or remove some filters.
                </p>
                <button className="btn btn-primary" onClick={clearFilters}>
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
