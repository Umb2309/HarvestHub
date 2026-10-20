/**
 * Products Page
 * --------------
 * Search, category + state filters, sorting, skeleton loading and an empty state.
 *
 * 🎓 Hooks used here:
 * useEffect(fn, [])  — runs once after mount. We fake an API delay with it;
 *                      a real app would fetch('/api/products') here.
 * useMemo(fn, deps)  — caches the filtered/sorted list and only recalculates
 *                      when one of the deps changes.
 */

import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { PRODUCTS, CATEGORIES } from '../data/products';
import { FARMERS, FARMER_STATES } from '../data/farmers';
import ProductCard from '../components/product/ProductCard';
import { SkeletonGrid } from '../components/ui/SkeletonCard';
import Icon from '../components/ui/Icon';
import './Products.css';

const SORT_OPTIONS = [
  { value: 'featured',   label: 'Featured'           },
  { value: 'price-asc',  label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'rating',     label: 'Highest rated'      },
  { value: 'name',       label: 'Name: A to Z'       },
];

const stateOf = (product) => FARMERS.find((f) => f.id === product.farmerId)?.state;

export default function Products() {
  const [searchQuery,      setSearchQuery]      = useState('');
  const [activeCategory,   setActiveCategory]   = useState('all');
  const [activeState,      setActiveState]      = useState('all');
  const [inStockOnly,      setInStockOnly]      = useState(false);
  const [sortBy,           setSortBy]           = useState('featured');
  const [isLoading,        setIsLoading]        = useState(true);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0 });
    const timer = setTimeout(() => setIsLoading(false), 600); // fake network delay
    return () => clearTimeout(timer); // cleanup if we leave before it fires
  }, []);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const result = PRODUCTS.filter((p) => {
      if (activeCategory !== 'all' && p.category !== activeCategory) return false;
      if (activeState !== 'all' && stateOf(p) !== activeState) return false;
      if (inStockOnly && !p.inStock) return false;
      if (q && ![p.name, p.farmerName, p.farmerLocation, p.category].some((s) => s.toLowerCase().includes(q))) return false;
      return true;
    });

    const sorters = {
      'price-asc':  (a, b) => a.price - b.price,
      'price-desc': (a, b) => b.price - a.price,
      rating:       (a, b) => b.rating - a.rating,
      name:         (a, b) => a.name.localeCompare(b.name),
      // Featured first, then in-stock before sold-out
      featured:     (a, b) => (b.featured - a.featured) || (b.inStock - a.inStock),
    };
    return result.sort(sorters[sortBy]);
  }, [searchQuery, activeCategory, activeState, inStockOnly, sortBy]);

  const countFor = (catId) =>
    catId === 'all' ? PRODUCTS.length : PRODUCTS.filter((p) => p.category === catId).length;

  const clearFilters = () => {
    setSearchQuery('');
    setActiveCategory('all');
    setActiveState('all');
    setInStockOnly(false);
    setSortBy('featured');
  };

  const activeFilters = [
    activeCategory !== 'all' && { key: 'cat', label: CATEGORIES.find((c) => c.id === activeCategory)?.label, clear: () => setActiveCategory('all') },
    activeState !== 'all' && { key: 'state', label: `From ${activeState}`, clear: () => setActiveState('all') },
    inStockOnly && { key: 'stock', label: 'In stock', clear: () => setInStockOnly(false) },
    searchQuery && { key: 'q', label: `“${searchQuery}”`, clear: () => setSearchQuery('') },
  ].filter(Boolean);

  return (
    <div className="products-page">
      <header className="page-header">
        <div className="container">
          <nav className="breadcrumb breadcrumb--light" aria-label="Breadcrumb">
            <Link to="/" className="breadcrumb__link">Home</Link>
            <span className="breadcrumb__sep" aria-hidden="true">›</span>
            <span className="breadcrumb__current" aria-current="page">Produce</span>
          </nav>

          <div className="page-header__row">
            <div>
              <h1 className="page-header__title">Fresh produce</h1>
              <p className="page-header__subtitle">
                {PRODUCTS.length} products from {FARMERS.length} farms in {FARMER_STATES.length} states, priced by the farmers.
              </p>
            </div>

            <div className="page-header__search">
              <div className="input-icon-wrap input-icon-wrap--dark">
                <Icon name="search" size={18} />
                <input
                  type="search"
                  className="input input--on-dark"
                  placeholder="Search tomatoes, yam, Kano…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search products"
                  autoComplete="off"
                />
                {searchQuery && (
                  <button className="input-icon-wrap__clear" onClick={() => setSearchQuery('')} aria-label="Clear search">
                    <Icon name="x" size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container products-layout">
        <button
          className="products-filter-toggle btn btn-outline btn-sm"
          onClick={() => setShowMobileFilter((o) => !o)}
          aria-expanded={showMobileFilter}
          aria-controls="filter-sidebar"
        >
          <Icon name="filter" size={16} />
          {showMobileFilter ? 'Hide filters' : `Filters${activeFilters.length ? ` (${activeFilters.length})` : ''}`}
        </button>

        <aside
          id="filter-sidebar"
          className={`products-sidebar${showMobileFilter ? ' products-sidebar--open' : ''}`}
          aria-label="Product filters"
        >
          <div className="products-sidebar__section">
            <h2 className="products-sidebar__heading">Category</h2>
            <ul className="products-sidebar__list">
              {CATEGORIES.map(({ id, label }) => (
                <li key={id}>
                  <button
                    className={`products-sidebar__item${activeCategory === id ? ' products-sidebar__item--active' : ''}`}
                    onClick={() => setActiveCategory(id)}
                    aria-pressed={activeCategory === id}
                  >
                    <span className="products-sidebar__item-label">{label}</span>
                    <span className="products-sidebar__item-count">{countFor(id)}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="products-sidebar__section">
            <label htmlFor="state-filter" className="products-sidebar__heading">Grown in</label>
            <select
              id="state-filter"
              className="input"
              value={activeState}
              onChange={(e) => setActiveState(e.target.value)}
            >
              <option value="all">Any state</option>
              {FARMER_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="products-sidebar__section">
            <label className="products-sidebar__check">
              <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} />
              Hide sold-out items
            </label>
          </div>

          {activeFilters.length > 0 && (
            <button className="products-sidebar__clear" onClick={clearFilters}>
              Clear all filters
            </button>
          )}
        </aside>

        <div className="products-main">
          <div className="products-toolbar">
            <p className="products-toolbar__count" aria-live="polite">
              {isLoading
                ? 'Loading produce…'
                : `${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''}`}
            </p>

            <div className="products-toolbar__sort">
              <label htmlFor="sort-select" className="products-toolbar__sort-label">Sort by</label>
              <select
                id="sort-select"
                className="input products-toolbar__select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                {SORT_OPTIONS.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          {activeFilters.length > 0 && !isLoading && (
            <div className="products-filter-chips" aria-label="Active filters">
              {activeFilters.map((f) => (
                <span key={f.key} className="filter-chip">
                  {f.label}
                  <button onClick={f.clear} aria-label={`Remove filter: ${f.label}`}>
                    <Icon name="x" size={12} strokeWidth={2.5} />
                  </button>
                </span>
              ))}
            </div>
          )}

          <div className="products-grid-main">
            {isLoading && <SkeletonGrid count={6} />}

            {!isLoading && filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}

            {!isLoading && filteredProducts.length === 0 && (
              <div className="empty-state products-empty" role="status">
                <span className="empty-state__icon"><Icon name="search" size={28} /></span>
                <h2>Nothing matches that yet</h2>
                <p>Try a different word, or clear the filters to see everything that's in season.</p>
                <button className="btn btn-primary" onClick={clearFilters}>Clear filters</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
