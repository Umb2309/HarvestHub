/**
 * FarmerCard Component
 * ---------------------
 * Displays a farmer profile in a card layout.
 * Used on: Home page (spotlight), Farmers page.
 *
 * Props:
 *   farmer {object} — a farmer object from src/data/farmers.js
 */

import { Link }     from 'react-router-dom';
import StarRating   from '../ui/StarRating';
import './FarmerCard.css';

export default function FarmerCard({ farmer }) {
  const { id, name, farm, location, avatar, coverImage, specialties, rating, reviewCount, productCount, yearsActive } = farmer;

  return (
    <Link to={`/farmers/${id}`} className="farmer-card card" aria-label={`View ${name}'s profile`}>

      {/* Cover image strip at the top */}
      <div className="farmer-card__cover">
        <img src={coverImage} alt={`${farm} farm`} className="farmer-card__cover-img" loading="lazy" />
        {/* Green gradient overlay so the avatar stays readable */}
        <div className="farmer-card__cover-overlay" aria-hidden="true" />
      </div>

      {/* Avatar — positioned to overlap the cover image */}
      <div className="farmer-card__avatar-wrap">
        <img src={avatar} alt={name} className="farmer-card__avatar" />
      </div>

      {/* Body content */}
      <div className="farmer-card__body">
        <h3 className="farmer-card__name">{name}</h3>
        <p className="farmer-card__farm">{farm}</p>

        <p className="farmer-card__location">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          {location}
        </p>

        {/* Specialties — rendered as small badge pills */}
        {/* 🎓 CONCEPT — .map() to render a list */}
        {/* .map() transforms each array item into a JSX element. */}
        {/* The `key` prop is REQUIRED — React uses it to track list items efficiently. */}
        <div className="farmer-card__specialties">
          {specialties.slice(0, 2).map((spec) => (
            <span key={spec} className="badge badge-primary">{spec}</span>
          ))}
        </div>

        <StarRating rating={rating} reviewCount={reviewCount} size="sm" />

        {/* Stats row */}
        <div className="farmer-card__stats">
          <div className="farmer-card__stat">
            <span className="farmer-card__stat-value">{productCount}</span>
            <span className="farmer-card__stat-label">Products</span>
          </div>
          <div className="farmer-card__stat-divider" aria-hidden="true" />
          <div className="farmer-card__stat">
            <span className="farmer-card__stat-value">{yearsActive}</span>
            <span className="farmer-card__stat-label">Years</span>
          </div>
          <div className="farmer-card__stat-divider" aria-hidden="true" />
          <div className="farmer-card__stat">
            <span className="farmer-card__stat-value">{reviewCount}</span>
            <span className="farmer-card__stat-label">Reviews</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
