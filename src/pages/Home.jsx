/**
 * Home Page
 * ----------
 *  1. Hero            — headline, CTAs, two product preview cards
 *  2. FactsBar        — four facts derived from the data (not invented stats)
 *  3. FeaturedProducts— this week's picks with category chips
 *  4. Origins         — which state each staple comes from
 *  5. HowItWorks      — three steps
 *  6. FarmerSpotlight — featured farmers
 *  7. JoinBanner      — split CTA for buyers and farmers
 *
 * 🎓 Component composition: each section is a small function in this file,
 * and Home just stacks them. Keeping them together ("co-location") makes the
 * page easy to read top to bottom.
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getFeaturedProducts, getProductById, CATEGORIES } from '../data/products';
import { FARMERS, getFeaturedFarmers } from '../data/farmers';
import { LOWEST_DELIVERY_FEE, FREE_DELIVERY_THRESHOLD } from '../data/delivery';
import { naira, initials } from '../utils/format';
import ProductCard from '../components/product/ProductCard';
import FarmerCard from '../components/farmer/FarmerCard';
import SmartImage from '../components/ui/SmartImage';
import Icon from '../components/ui/Icon';
import './Home.css';

/* ── 1. Hero ─────────────────────────────────────────────── */
function Hero() {
  const tomatoes = getProductById('p001');
  const eggs = getProductById('p009');
  const faces = FARMERS.slice(0, 4);

  return (
    <section className="hero" aria-labelledby="hero-heading">
      <div className="hero__bg" aria-hidden="true">
        <img
          src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1600&h=900&fit=crop"
          alt=""
          className="hero__bg-img"
        />
        <div className="hero__bg-overlay" />
      </div>

      <div className="hero__content container">
        <div className="hero__text animate-fade-in-up">
          <span className="hero__label">
            <Icon name="truck" size={15} /> Delivering to Lagos, Abuja and Ibadan
          </span>

          <h1 id="hero-heading" className="hero__heading">
            Buy straight from <br />
            <span className="hero__heading-highlight">the farmers</span> who<br />
            grow your food
          </h1>

          <p className="hero__sub">
            Order tomatoes from Kano, yams from Benue and eggs from Abeokuta directly from the
            farms that grow them. Farmers set their own prices and keep 90% of each sale.
          </p>

          <div className="hero__actions">
            <Link to="/products" className="btn btn-secondary btn-lg">Shop produce</Link>
            <Link to="/farmers" className="btn btn-lg btn-light-outline">Meet the farmers</Link>
          </div>

          <div className="hero__proof">
            <div className="hero__proof-avatars" aria-hidden="true">
              {faces.map((f, i) => (
                <SmartImage
                  key={f.id}
                  src={f.avatar}
                  alt=""
                  className="hero__proof-avatar"
                  variant="avatar"
                  fallback={initials(f.name)}
                  style={{ zIndex: faces.length - i }}
                />
              ))}
            </div>
            <p className="hero__proof-text">
              <strong>{FARMERS.length} partner farms</strong> across {new Set(FARMERS.map((f) => f.state)).size} states
            </p>
          </div>
        </div>

        {/* Preview cards — decorative, the real products are below */}
        <div className="hero__visual animate-fade-in" aria-hidden="true">
          {[tomatoes, eggs].map((p, i) => (
            <div key={p.id} className={`hero__float-card hero__float-card--${i + 1}`}>
              <SmartImage src={p.image} alt="" className="hero__float-img" fallback={p.mark} />
              <div className="hero__float-info">
                <span>{p.name} · {p.farmerLocation.split(',').pop().trim()}</span>
                <strong>{naira(p.price)} <small>{p.unit}</small></strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── 2. Facts bar ────────────────────────────────────────── */
function FactsBar() {
  const facts = [
    { icon: 'sprout', value: `${FARMERS.length} farms`,          label: `Verified, in ${new Set(FARMERS.map((f) => f.state)).size} states` },
    { icon: 'truck',  value: `From ${naira(LOWEST_DELIVERY_FEE)}`, label: `Delivery · free over ${naira(FREE_DELIVERY_THRESHOLD)}` },
    { icon: 'clock',  value: '1 to 4 days',                          label: 'From harvest to your door' },
    { icon: 'cash',   value: 'Pay on delivery',                   label: 'Or card and bank transfer' },
  ];

  return (
    <section className="facts-bar" aria-label="HarvestHub at a glance">
      <div className="container facts-bar__grid">
        {facts.map(({ icon, value, label }) => (
          <div key={value} className="facts-bar__item">
            <span className="facts-bar__icon"><Icon name={icon} size={22} /></span>
            <div>
              <p className="facts-bar__value">{value}</p>
              <p className="facts-bar__label">{label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── 3. Featured products ────────────────────────────────── */
/**
 * 🎓 useState for UI state: `activeCategory` remembers which chip is selected.
 * Changing it re-renders this section and `displayed` is recalculated.
 */
function FeaturedProducts() {
  const [activeCategory, setActiveCategory] = useState('all');
  const featured = getFeaturedProducts();

  // Only show chips for categories that actually have featured products
  const chips = CATEGORIES.filter((c) => c.id === 'all' || featured.some((p) => p.category === c.id));
  const displayed = activeCategory === 'all' ? featured : featured.filter((p) => p.category === activeCategory);

  return (
    <section className="section featured-products" aria-labelledby="products-heading">
      <div className="container">
        <div className="section-header section-header--split">
          <div>
            <h2 id="products-heading">Available this week</h2>
            <p>Prices are set by the farmers.</p>
          </div>
          <Link to="/products" className="btn btn-outline">
            See all produce <Icon name="arrowRight" size={16} />
          </Link>
        </div>

        <div className="chip-row featured-products__chips" role="tablist" aria-label="Filter by category">
          {chips.map(({ id, label }) => (
            <button
              key={id}
              role="tab"
              aria-selected={activeCategory === id}
              className={`chip${activeCategory === id ? ' chip--active' : ''}`}
              onClick={() => setActiveCategory(id)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="products-grid">
          {displayed.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── 4. Origins ──────────────────────────────────────────── */
const ORIGINS = [
  { state: 'Kano',        crop: 'Tomatoes & peppers', farmerId: 'f001' },
  { state: 'Benue',       crop: 'Yams & garri',       farmerId: 'f002' },
  { state: 'Plateau',     crop: 'Potatoes & carrots', farmerId: 'f004' },
  { state: 'Ebonyi',      crop: 'Abakaliki rice',     farmerId: 'f005' },
  { state: 'Ogun',        crop: 'Eggs & chicken',     farmerId: 'f003' },
  { state: 'Cross River', crop: 'Plantain & palm oil', farmerId: 'f006' },
];

function Origins() {
  return (
    <section className="section origins" aria-labelledby="origins-heading">
      <div className="container">
        <div className="section-header">
          <h2 id="origins-heading">Where our produce comes from</h2>
          <p>Each product page shows the farm and town it came from.</p>
        </div>

        <ul className="origins__grid">
          {ORIGINS.map(({ state, crop, farmerId }) => {
            const farmer = FARMERS.find((f) => f.id === farmerId);
            return (
              <li key={state}>
                <Link to={`/farmers/${farmerId}`} className="origins__card">
                  <span className="origins__state">{state}</span>
                  <span className="origins__crop">{crop}</span>
                  <span className="origins__farm">
                    {farmer.farm}
                    <Icon name="arrowRight" size={14} />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* ── 5. How it works ─────────────────────────────────────── */
const STEPS = [
  { icon: 'search', title: 'Choose your produce', desc: 'Browse by product or by farmer. Every listing shows where it was grown and who grew it.' },
  { icon: 'basket', title: 'Place your order', desc: 'Farmers harvest after your order is confirmed, so produce is not stored in a warehouse first.' },
  { icon: 'truck',  title: 'Receive your delivery', desc: 'Lagos greens and eggs arrive the next day. Produce from the north takes 2 to 4 days.' },
];

function HowItWorks() {
  return (
    <section className="section how-it-works" aria-labelledby="how-heading">
      <div className="container">
        <div className="section-header">
          <h2 id="how-heading">How ordering works</h2>
        </div>

        <ol className="how-it-works__grid">
          {STEPS.map(({ icon, title, desc }) => (
            <li key={title} className="how-it-works__step">
              <div className="how-it-works__top">
                <span className="how-it-works__icon-wrap"><Icon name={icon} size={24} /></span>
              </div>
              <h3 className="how-it-works__title">{title}</h3>
              <p className="how-it-works__desc">{desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ── 6. Farmer spotlight ─────────────────────────────────── */
function FarmerSpotlight() {
  const farmers = getFeaturedFarmers().slice(0, 3);

  return (
    <section className="section farmer-spotlight" aria-labelledby="farmers-heading">
      <div className="container">
        <div className="section-header section-header--split">
          <div>
            <h2 id="farmers-heading">Our farmers</h2>
            <p>Our team visits every farm before it can list on HarvestHub.</p>
          </div>
          <Link to="/farmers" className="btn btn-outline">
            All farmers <Icon name="arrowRight" size={16} />
          </Link>
        </div>

        <div className="farmers-grid">
          {farmers.map((farmer) => (
            <FarmerCard key={farmer.id} farmer={farmer} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── 7. Join banner ──────────────────────────────────────── */
function JoinBanner() {
  return (
    <section className="join-banner" aria-label="Get started">
      <div className="container join-banner__grid">
        <div className="join-banner__panel join-banner__panel--buyer">
          <h2 className="join-banner__heading">Buying for your home or business?</h2>
          <p className="join-banner__sub">
            Create a free account to save your address and track your orders. Your first order gets 10% off.
          </p>
          <Link to="/register" className="btn btn-secondary btn-lg">Create a free account</Link>
        </div>

        <div className="join-banner__panel join-banner__panel--farmer">
          <h2 className="join-banner__heading">Are you a farmer?</h2>
          <p className="join-banner__sub">
            List your produce at your own price. Payment reaches your bank account within 48 hours of delivery.
          </p>
          <Link to="/register?role=farmer" className="btn btn-lg btn-light-outline">Start selling</Link>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <FactsBar />
      <FeaturedProducts />
      <Origins />
      <HowItWorks />
      <FarmerSpotlight />
      <JoinBanner />
    </>
  );
}
