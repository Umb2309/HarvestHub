/**
 * Home Page
 * ----------
 * Assembled from several visual sections:
 *  1. Hero          — full-width banner with CTA
 *  2. Stats         — 3 trust-building numbers
 *  3. Categories    — pill filter buttons
 *  4. FeaturedProducts — product cards grid
 *  5. HowItWorks    — 3-step explainer
 *  6. FarmerSpotlight — farmer cards
 *  7. CtaBanner     — newsletter / join CTA
 *
 * 🎓 REACT CONCEPT — Component Composition
 * The Home page is itself a component, but it's built by composing
 * smaller components together. Each section is its own function defined
 * below the main export. This is called "co-location" — keeping related
 * pieces close together in the same file.
 */

import { useState } from 'react';
import { Link }     from 'react-router-dom';
import { getFeaturedProducts, CATEGORIES } from '../data/products';
import { getFeaturedFarmers }              from '../data/farmers';
import ProductCard from '../components/product/ProductCard';
import FarmerCard  from '../components/farmer/FarmerCard';
import './Home.css';

/* ─────────────────────────────────────────────────────────── */
/* 1. HERO SECTION                                             */
/* ─────────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-heading">
      {/* Background image with overlay */}
      <div className="hero__bg" aria-hidden="true">
        <img
          src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1600&h=900&fit=crop"
          alt=""
          className="hero__bg-img"
        />
        <div className="hero__bg-overlay" />
      </div>

      {/* Content */}
      <div className="hero__content container">
        <div className="hero__text animate-fade-in-up">
          {/* Small label above the heading */}
          <span className="badge badge-accent hero__label">🌱 Farm to Table</span>

          <h1 id="hero-heading" className="hero__heading">
            Fresh From the <br />
            <span className="hero__heading-highlight">Farm, Direct</span>
            <br /> to Your Door
          </h1>

          <p className="hero__sub">
            Skip the supermarket. Shop directly from 200+ local farmers and get
            the freshest, most flavourful produce delivered to your door.
          </p>

          {/* CTA Buttons */}
          <div className="hero__actions">
            <Link to="/products" className="btn btn-secondary btn-lg">
              Shop Fresh Produce
            </Link>
            <Link to="/farmers" className="btn btn-lg hero__btn-outline">
              Meet the Farmers
            </Link>
          </div>

          {/* Social proof row */}
          <div className="hero__proof">
            <div className="hero__proof-avatars" aria-hidden="true">
              {['photo-1535713875002-d1d0cf377fde', 'photo-1580489944761-15a19d654956', 'photo-1506794778202-cad84cf45f1d'].map((id, i) => (
                <img
                  key={i}
                  src={`https://images.unsplash.com/${id}?w=40&h=40&fit=crop&crop=face`}
                  alt=""
                  className="hero__proof-avatar"
                  style={{ zIndex: 3 - i }}
                />
              ))}
            </div>
            <p className="hero__proof-text">
              <strong>4,800+</strong> happy customers this month
            </p>
          </div>
        </div>

        {/* Floating product cards on the right */}
        <div className="hero__visual animate-fade-in" aria-hidden="true">
          <div className="hero__float-card hero__float-card--1">
            <img src="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=280&h=200&fit=crop" alt="" />
            <div className="hero__float-info">
              <span>Heirloom Tomatoes</span>
              <strong>$4.99 / lb</strong>
            </div>
          </div>
          <div className="hero__float-card hero__float-card--2">
            <img src="https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=280&h=200&fit=crop" alt="" />
            <div className="hero__float-info">
              <span>Fresh Strawberries</span>
              <strong>$5.49 / pint</strong>
            </div>
          </div>
          {/* Floating badge */}
          <div className="hero__float-badge">
            <span className="hero__float-badge-icon">✓</span>
            <div>
              <p className="hero__float-badge-title">Certified Organic</p>
              <p className="hero__float-badge-sub">Sourced with care</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────── */
/* 2. TRUST STATS BAR                                          */
/* ─────────────────────────────────────────────────────────── */
const STATS = [
  { value: '200+',   label: 'Local Farmers',     icon: '🌾' },
  { value: '1,200+', label: 'Fresh Products',    icon: '🥬' },
  { value: '4,800+', label: 'Happy Customers',   icon: '❤️' },
  { value: '48hr',   label: 'Farm to Doorstep',  icon: '🚚' },
];

function StatsBar() {
  return (
    <section className="stats-bar" aria-label="HarvestHub at a glance">
      <div className="container stats-bar__grid">
        {/* 🎓 .map() — iterate over the STATS array and render a <div> for each */}
        {STATS.map(({ value, label, icon }) => (
          <div key={label} className="stats-bar__item">
            <span className="stats-bar__icon" aria-hidden="true">{icon}</span>
            <span className="stats-bar__value">{value}</span>
            <span className="stats-bar__label">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────── */
/* 3. FEATURED PRODUCTS (with category filter)                 */
/* ─────────────────────────────────────────────────────────── */

/**
 * 🎓 REACT CONCEPT — useState for UI state
 *
 * `activeCategory` stores which filter pill is selected.
 * When a user clicks a pill, setActiveCategory runs, React re-renders
 * FeaturedProducts, and `displayedProducts` is recalculated automatically.
 * No manual DOM updates needed — React handles it.
 */
function FeaturedProducts() {
  const [activeCategory, setActiveCategory] = useState('all');

  // All featured products from our mock data
  const featured = getFeaturedProducts();

  // Filter products based on activeCategory
  // If 'all', show everything. Otherwise filter by category.
  const displayedProducts = activeCategory === 'all'
    ? featured
    : featured.filter((p) => p.category === activeCategory);

  return (
    <section className="section featured-products" aria-labelledby="products-heading">
      <div className="container">

        {/* Section header */}
        <div className="section-header">
          <span className="section-label">Fresh Picks</span>
          <h2 id="products-heading">Harvested This Week</h2>
          <p>Seasonal produce at peak freshness, sourced directly from local farms.</p>
        </div>

        {/* Category filter pills */}
        {/* 🎓 role="tablist" is an ARIA attribute for accessibility */}
        <div className="category-pills" role="tablist" aria-label="Filter by category">
          {CATEGORIES.map(({ id, label, icon }) => (
            <button
              key={id}
              role="tab"
              aria-selected={activeCategory === id}
              className={`category-pill ${activeCategory === id ? 'category-pill--active' : ''}`}
              onClick={() => setActiveCategory(id)}
            >
              <span aria-hidden="true">{icon}</span>
              {label}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {displayedProducts.length > 0 ? (
          <div className="products-grid">
            {displayedProducts.map((product) => (
              // Each ProductCard gets the full product object as a prop
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          // Empty state — shown when no products match the filter
          <div className="empty-state">
            <span className="empty-state__icon" aria-hidden="true">🥬</span>
            <h3>No featured products in this category yet</h3>
            <p>Check back soon or browse all products.</p>
            <Link to="/products" className="btn btn-primary">Browse All Products</Link>
          </div>
        )}

        {/* View all link */}
        <div className="section-cta">
          <Link to="/products" className="btn btn-outline btn-lg">
            View All Products
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────── */
/* 4. HOW IT WORKS                                             */
/* ─────────────────────────────────────────────────────────── */
const STEPS = [
  {
    step: '01',
    icon: '🔍',
    title: 'Browse & Discover',
    desc: 'Explore hundreds of fresh products from verified local farmers. Filter by category, location, or farm.',
  },
  {
    step: '02',
    icon: '🛒',
    title: 'Add to Your Cart',
    desc: 'Select your produce, choose quantities, and add items from multiple farms in one single order.',
  },
  {
    step: '03',
    icon: '🚚',
    title: 'Receive Your Harvest',
    desc: 'Your order is picked fresh and delivered within 48 hours — from the field straight to your kitchen.',
  },
];

function HowItWorks() {
  return (
    <section className="section how-it-works" aria-labelledby="how-heading">
      <div className="container">
        <div className="section-header">
          <span className="section-label">Simple Process</span>
          <h2 id="how-heading">How HarvestHub Works</h2>
          <p>From farm gate to your front door in three easy steps.</p>
        </div>

        <div className="how-it-works__grid">
          {STEPS.map(({ step, icon, title, desc }, index) => (
            <div key={step} className="how-it-works__step">
              {/* Connector line between steps (hidden on last item) */}
              {index < STEPS.length - 1 && (
                <div className="how-it-works__connector" aria-hidden="true" />
              )}
              <div className="how-it-works__icon-wrap" aria-hidden="true">
                <span className="how-it-works__icon">{icon}</span>
              </div>
              <span className="how-it-works__step-num" aria-hidden="true">{step}</span>
              <h3 className="how-it-works__title">{title}</h3>
              <p className="how-it-works__desc">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────── */
/* 5. FARMER SPOTLIGHT                                         */
/* ─────────────────────────────────────────────────────────── */
function FarmerSpotlight() {
  // getFeaturedFarmers() returns farmers where featured === true
  const farmers = getFeaturedFarmers();

  return (
    <section className="section farmer-spotlight" aria-labelledby="farmers-heading">
      <div className="container">
        <div className="section-header">
          <span className="section-label">Meet the Growers</span>
          <h2 id="farmers-heading">Local Farmers You Can Trust</h2>
          <p>Every farmer on HarvestHub is verified, passionate, and dedicated to sustainable growing practices.</p>
        </div>

        <div className="farmers-grid">
          {farmers.map((farmer) => (
            <FarmerCard key={farmer.id} farmer={farmer} />
          ))}
        </div>

        <div className="section-cta">
          <Link to="/farmers" className="btn btn-outline btn-lg">
            Meet All Farmers
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────── */
/* 6. CTA BANNER                                               */
/* ─────────────────────────────────────────────────────────── */
function CtaBanner() {
  return (
    <section className="cta-banner" aria-labelledby="cta-heading">
      <div className="cta-banner__bg" aria-hidden="true">
        <img
          src="https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=1400&h=500&fit=crop"
          alt=""
          className="cta-banner__bg-img"
        />
        <div className="cta-banner__overlay" />
      </div>
      <div className="container cta-banner__content">
        <div className="cta-banner__text">
          <span className="section-label" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Join the Community
          </span>
          <h2 id="cta-heading" className="cta-banner__heading">
            Start Shopping Fresh Today
          </h2>
          <p className="cta-banner__sub">
            Create your free account and get 10% off your first order. No subscription needed.
          </p>
          <div className="cta-banner__actions">
            <Link to="/register" className="btn btn-secondary btn-lg">Get Started Free</Link>
            <Link to="/about"    className="btn btn-lg cta-banner__ghost-btn">Learn More</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────── */
/* MAIN HOME EXPORT — assembles all sections                   */
/* ─────────────────────────────────────────────────────────── */
export default function Home() {
  return (
    <>
      <Hero />
      <StatsBar />
      <FeaturedProducts />
      <HowItWorks />
      <FarmerSpotlight />
      <CtaBanner />
    </>
  );
}
