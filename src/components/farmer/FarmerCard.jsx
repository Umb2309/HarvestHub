/**
 * FarmerCard
 * -----------
 * A farmer profile summary. Used on Home (spotlight) and the Farmers page.
 *
 * Props:
 *   farmer {object} — a farmer from src/data/farmers.js
 */

import { Link } from 'react-router-dom';
import StarRating from '../ui/StarRating';
import SmartImage from '../ui/SmartImage';
import Icon from '../ui/Icon';
import { initials } from '../../utils/format';
import './FarmerCard.css';

export default function FarmerCard({ farmer }) {
  const { id, name, farm, location, avatar, coverImage, specialties, rating, reviewCount, productCount, yearsActive, quote } = farmer;

  return (
    <Link to={`/farmers/${id}`} className="farmer-card card" aria-label={`${name}, ${farm} — view profile`}>
      <div className="farmer-card__cover">
        <SmartImage src={coverImage} alt="" className="farmer-card__cover-img" loading="lazy" fallback="" />
        <div className="farmer-card__cover-overlay" aria-hidden="true" />
      </div>

      <div className="farmer-card__avatar-wrap">
        <SmartImage src={avatar} alt="" className="farmer-card__avatar" variant="avatar" fallback={initials(name)} />
      </div>

      <div className="farmer-card__body">
        <div>
          <h3 className="farmer-card__name">{name}</h3>
          <p className="farmer-card__farm">{farm}</p>
        </div>

        <p className="farmer-card__location">
          <Icon name="pin" size={13} strokeWidth={2.2} />
          {location}
        </p>

        {quote && <p className="farmer-card__quote">“{quote}”</p>}

        <div className="farmer-card__specialties">
          {specialties.slice(0, 3).map((spec) => (
            <span key={spec} className="badge badge-primary">{spec}</span>
          ))}
        </div>

        <StarRating rating={rating} reviewCount={reviewCount} size="sm" />

        <div className="farmer-card__stats">
          <div className="farmer-card__stat">
            <span className="farmer-card__stat-value">{productCount}</span>
            <span className="farmer-card__stat-label">Products</span>
          </div>
          <div className="farmer-card__stat-divider" aria-hidden="true" />
          <div className="farmer-card__stat">
            <span className="farmer-card__stat-value">{yearsActive}</span>
            <span className="farmer-card__stat-label">Years farming</span>
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
