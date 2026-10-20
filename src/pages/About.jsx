import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FARMERS, FARMER_STATES } from '../data/farmers';
import { PRODUCTS } from '../data/products';
import Icon from '../components/ui/Icon';
import SmartImage from '../components/ui/SmartImage';
import './About.css';

const BUYER_STEPS = [
  'Browse by product or by farm and add what you need to your cart.',
  'Choose your state and pay by card, bank transfer or on delivery.',
  'Farmers harvest and pack against your order — not before.',
  'A rider delivers to your door and calls you on arrival.',
];

const FARMER_STEPS = [
  'Apply online. Someone from our team visits your farm within two weeks.',
  'List your produce and set your own price per unit.',
  'When an order comes in, pack it by the cut-off; we arrange pickup.',
  'Get paid into your bank account within 48 hours of delivery, minus our 10%.',
];

const CHECKS = [
  { icon: 'users',  title: 'A real farm, visited', text: 'We visit every farm in person before it lists, and again once a year.' },
  { icon: 'scale',  title: 'Honest weights',       text: 'A "paint bucket" or "5kg bag" means the same thing on every order. We spot-check at pickup.' },
  { icon: 'shield', title: 'Quality promise',      text: 'If something arrives bruised, rotten or short, send a photo and we refund or replace it.' },
  { icon: 'chat',   title: 'Direct line',          text: 'Every farmer profile shows how quickly they reply. You can ask questions before you order.' },
];

export default function About() {
  useEffect(() => { window.scrollTo({ top: 0 }); }, []);

  const deliveryCities = new Set(FARMERS.flatMap((f) => f.deliversTo)).size;

  return (
    <div className="about-page">
      <header className="page-header">
        <div className="container">
          <nav className="breadcrumb breadcrumb--light" aria-label="Breadcrumb">
            <Link to="/" className="breadcrumb__link">Home</Link>
            <span className="breadcrumb__sep" aria-hidden="true">›</span>
            <span className="breadcrumb__current" aria-current="page">About</span>
          </nav>
          <h1 className="page-header__title">Why we started HarvestHub</h1>
          <p className="page-header__subtitle">
            Nigerian farmers grow good food. Too much of it never makes it to the people who want to buy it.
          </p>
        </div>
      </header>

      {/* Story */}
      <section className="container section about-story">
        <div className="about-story__text">
          <h2 className="about-heading">The tomato problem</h2>
          <p>
            A basket of tomatoes picked in Kano passes through several hands before it reaches a kitchen in
            Lagos — a local aggregator, a transporter, a market union, a wholesaler at Mile 12, then a
            retailer. Each one takes a cut, and the tomatoes spend days in the back of a hot truck.
          </p>
          <p>
            By the time they arrive, a large share are bruised or rotten. The farmer was paid a fraction of
            what you paid, and you still had to sort through the basket.
          </p>
          <p>
            HarvestHub cuts that chain short. You order from the farm. The farm harvests against your
            order, packs it properly, and we deliver it. Farmers set their own prices and keep 90% of every sale.
          </p>
        </div>

        <figure className="about-story__figure">
          <SmartImage
            src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=700&h=560&fit=crop"
            alt="Crates of freshly harvested vegetables on a farm"
            className="about-story__image"
            fallback="🧺"
          />
          <figcaption className="about-story__caption">
            <strong>90%</strong>
            <span>of every sale goes to the farmer</span>
          </figcaption>
        </figure>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="about-how">
        <div className="container">
          <h2 className="about-heading text-center">How it works</h2>

          <div className="about-how__grid">
            <div className="about-how__col">
              <h3 className="about-how__title"><Icon name="basket" size={22} /> If you're buying</h3>
              <ol className="about-how__steps">
                {BUYER_STEPS.map((s) => <li key={s}>{s}</li>)}
              </ol>
              <Link to="/products" className="btn btn-primary">Start shopping</Link>
            </div>

            <div className="about-how__col about-how__col--farmer">
              <h3 className="about-how__title"><Icon name="sprout" size={22} /> If you're farming</h3>
              <ol className="about-how__steps">
                {FARMER_STEPS.map((s) => <li key={s}>{s}</li>)}
              </ol>
              <Link to="/register?role=farmer" className="btn btn-secondary">Apply to sell</Link>
            </div>
          </div>
        </div>
      </section>

      {/* What we check */}
      <section className="container section">
        <h2 className="about-heading text-center">What we check, so you don't have to</h2>
        <div className="about-checks">
          {CHECKS.map(({ icon, title, text }) => (
            <div key={title} className="about-check">
              <span className="about-check__icon"><Icon name={icon} size={22} /></span>
              <h3 className="about-check__title">{title}</h3>
              <p className="about-check__text">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Where we are */}
      <section className="container about-today">
        <div className="about-today__inner">
          <div>
            <h2 className="about-today__heading">Where we are today</h2>
            <p className="about-today__text">
              We're early, and we'd rather tell you that than make up big numbers. Here's what's live right now.
            </p>
          </div>
          <dl className="about-today__stats">
            <div><dt>{FARMERS.length}</dt><dd>Partner farms</dd></div>
            <div><dt>{FARMER_STATES.length}</dt><dd>States we source from</dd></div>
            <div><dt>{PRODUCTS.length}</dt><dd>Products listed</dd></div>
            <div><dt>{deliveryCities}</dt><dd>States with direct farm routes</dd></div>
          </dl>
        </div>
      </section>
    </div>
  );
}
