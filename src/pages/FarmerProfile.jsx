import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getFarmerById } from '../data/farmers';
import { PRODUCTS } from '../data/products';
import { initials } from '../utils/format';
import ProductCard from '../components/product/ProductCard';
import StarRating from '../components/ui/StarRating';
import SmartImage from '../components/ui/SmartImage';
import Icon from '../components/ui/Icon';
import './FarmerProfile.css';

export default function FarmerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const farmer = getFarmerById(id);

  useEffect(() => {
    if (!farmer) navigate('/farmers', { replace: true });
  }, [farmer, navigate]);

  useEffect(() => { window.scrollTo({ top: 0 }); }, [id]);

  if (!farmer) return null;

  const {
    name, farm, location, avatar, coverImage, bio, quote, specialties, certifications,
    deliversTo, yearsActive, rating, reviewCount, responseTime,
  } = farmer;

  const products = PRODUCTS.filter((p) => p.farmerId === id);
  const firstName = name.replace(/^(Hajiya|Alhaji|Chief)\s+/, '').split(' ')[0];

  return (
    <div className="farmer-profile-page">
      <div className="farmer-profile__hero">
        <SmartImage src={coverImage} alt="" className="farmer-profile__hero-img" fallback="" />
        <div className="farmer-profile__hero-overlay" aria-hidden="true" />
        <div className="container farmer-profile__hero-inner">
          <nav className="breadcrumb breadcrumb--light" aria-label="Breadcrumb">
            <Link to="/" className="breadcrumb__link">Home</Link>
            <span className="breadcrumb__sep" aria-hidden="true">›</span>
            <Link to="/farmers" className="breadcrumb__link">Farmers</Link>
            <span className="breadcrumb__sep" aria-hidden="true">›</span>
            <span className="breadcrumb__current" aria-current="page">{name}</span>
          </nav>
        </div>
      </div>

      <div className="container farmer-profile__main">
        <aside className="farmer-profile__sidebar">
          <div className="farmer-profile__card">
            <SmartImage
              src={avatar}
              alt={name}
              className="farmer-profile__avatar"
              variant="avatar"
              fallback={initials(name)}
            />
            <h1 className="farmer-profile__name">{name}</h1>
            <p className="farmer-profile__farm">{farm}</p>
            <p className="farmer-profile__location"><Icon name="pin" size={14} strokeWidth={2.2} /> {location}</p>
            <div className="farmer-profile__rating">
              <StarRating rating={rating} reviewCount={reviewCount} />
            </div>

            <div className="farmer-profile__stats">
              <div><strong>{yearsActive}</strong><span>Years farming</span></div>
              <div><strong>{products.length}</strong><span>Products</span></div>
              <div><strong>{reviewCount}</strong><span>Reviews</span></div>
            </div>

            <dl className="farmer-profile__details">
              <div>
                <dt>Grows</dt>
                <dd className="farmer-profile__pills">
                  {specialties.map((s) => <span key={s} className="badge badge-primary">{s}</span>)}
                </dd>
              </div>
              <div>
                <dt>Delivers to</dt>
                <dd>{deliversTo.join(' · ')}</dd>
              </div>
              <div>
                <dt>Memberships</dt>
                <dd className="farmer-profile__pills">
                  {certifications.map((c) => <span key={c} className="badge badge-outline">{c}</span>)}
                </dd>
              </div>
              <div>
                <dt>Response time</dt>
                <dd>{responseTime}</dd>
              </div>
            </dl>

            <a href="#farmer-products" className="btn btn-primary btn-block">Shop {firstName}'s produce</a>
          </div>
        </aside>

        <div className="farmer-profile__content">
          <section className="farmer-profile__story">
            <h2 className="farmer-profile__heading">About the farm</h2>
            <p className="farmer-profile__bio">{bio}</p>
            {quote && (
              <blockquote className="farmer-profile__quote">
                <p>“{quote}”</p>
                <footer>— {name}</footer>
              </blockquote>
            )}
          </section>

          <section id="farmer-products" className="farmer-profile__products">
            <h2 className="farmer-profile__heading">From {farm}</h2>
            {products.length > 0 ? (
              <div className="farmer-profile__products-grid">
                {products.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            ) : (
              <div className="empty-state">
                <span className="empty-state__icon"><Icon name="sprout" size={28} /></span>
                <h3>Nothing listed right now</h3>
                <p>{firstName} lists new produce after each harvest. Check back soon.</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
