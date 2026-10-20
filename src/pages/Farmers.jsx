import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FARMERS, FARMER_STATES } from '../data/farmers';
import FarmerCard from '../components/farmer/FarmerCard';
import Icon from '../components/ui/Icon';
import './Farmers.css';

/**
 * Each filter matches if ANY of the farmer's specialties contains one of its keywords.
 * (Keeps the chips readable while the data keeps its own wording.)
 */
const SPECIALTY_FILTERS = [
  { id: 'all',     label: 'Everything',            keywords: [] },
  { id: 'veg',     label: 'Vegetables & peppers',  keywords: ['tomato', 'pepper', 'onion', 'carrot', 'cabbage', 'vegetable'] },
  { id: 'tubers',  label: 'Tubers & grains',       keywords: ['yam', 'garri', 'cassava', 'potato', 'rice', 'grain'] },
  { id: 'greens',  label: 'Leafy greens',          keywords: ['green'] },
  { id: 'poultry', label: 'Eggs & poultry',        keywords: ['egg', 'poultry'] },
  { id: 'pantry',  label: 'Oils, honey & spices',  keywords: ['oil', 'honey', 'ginger', 'spice', 'beeswax'] },
];

export default function Farmers() {
  const [query, setQuery] = useState('');
  const [specialty, setSpecialty] = useState('all');
  const [state, setState] = useState('all');

  useEffect(() => { window.scrollTo({ top: 0 }); }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const keywords = SPECIALTY_FILTERS.find((s) => s.id === specialty).keywords;

    return FARMERS.filter((f) => {
      const matchesQuery = !q || [f.name, f.farm, f.location, ...f.specialties].some((s) => s.toLowerCase().includes(q));
      const matchesSpecialty = !keywords.length ||
        f.specialties.some((s) => keywords.some((k) => s.toLowerCase().includes(k)));
      const matchesState = state === 'all' || f.state === state;
      return matchesQuery && matchesSpecialty && matchesState;
    });
  }, [query, specialty, state]);

  const reset = () => { setQuery(''); setSpecialty('all'); setState('all'); };

  return (
    <div className="farmers-page">
      <header className="page-header">
        <div className="container">
          <nav className="breadcrumb breadcrumb--light" aria-label="Breadcrumb">
            <Link to="/" className="breadcrumb__link">Home</Link>
            <span className="breadcrumb__sep" aria-hidden="true">›</span>
            <span className="breadcrumb__current" aria-current="page">Farmers</span>
          </nav>

          <div className="page-header__row">
            <div>
              <h1 className="page-header__title">Meet the farmers</h1>
              <p className="page-header__subtitle">
                {FARMERS.length} farms across {FARMER_STATES.length} states. Our team visits every one
                before it lists, and you can order from any of them directly.
              </p>
            </div>

            <div className="page-header__search">
              <div className="input-icon-wrap input-icon-wrap--dark">
                <Icon name="search" size={18} />
                <input
                  type="search"
                  className="input input--on-dark"
                  placeholder="Search by name, farm or town…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  aria-label="Search farmers"
                />
                {query && (
                  <button className="input-icon-wrap__clear" onClick={() => setQuery('')} aria-label="Clear search">
                    <Icon name="x" size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="container farmers-filters" aria-label="Filter farmers">
        <div className="chip-row" role="group" aria-label="What they grow">
          {SPECIALTY_FILTERS.map((s) => (
            <button
              key={s.id}
              className={`chip${specialty === s.id ? ' chip--active' : ''}`}
              onClick={() => setSpecialty(s.id)}
              aria-pressed={specialty === s.id}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="farmers-filters__state">
          <label htmlFor="farmer-state" className="farmers-filters__label">State</label>
          <select id="farmer-state" className="input" value={state} onChange={(e) => setState(e.target.value)}>
            <option value="all">All states</option>
            {FARMER_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </section>

      <section className="container farmers-results">
        <p className="farmers-results__count" aria-live="polite">
          Showing {filtered.length} of {FARMERS.length} farms
        </p>

        {filtered.length > 0 ? (
          <div className="farmers-directory">
            {filtered.map((farmer) => <FarmerCard key={farmer.id} farmer={farmer} />)}
          </div>
        ) : (
          <div className="empty-state">
            <span className="empty-state__icon"><Icon name="users" size={28} /></span>
            <h2>No farms match those filters</h2>
            <p>We're onboarding new farmers every month. Try a different state or clear the filters.</p>
            <button className="btn btn-outline" onClick={reset}>Clear filters</button>
          </div>
        )}
      </section>

      <section className="container">
        <div className="farmers-sell">
          <div>
            <h2 className="farmers-sell__title">Do you farm? Sell on HarvestHub.</h2>
            <p className="farmers-sell__text">
              No listing fee — we take 10% only when you make a sale. You set your price, we handle
              delivery, and payouts land in your bank account within 48 hours of the order arriving.
            </p>
          </div>
          <Link to="/register?role=farmer" className="btn btn-secondary btn-lg">Apply as a farmer</Link>
        </div>
      </section>
    </div>
  );
}
