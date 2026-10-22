/**
 * ProductDetails Page — /products/:id
 * ------------------------------------
 * 🎓 useParams() reads :id from the URL (e.g. { id: 'p001' }).
 * 🎓 useNavigate() lets us redirect in code when the id doesn't exist.
 */

import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProductById, getCategoryLabel, PRODUCTS } from '../data/products';
import { getFarmerById } from '../data/farmers';
import { FREE_DELIVERY_THRESHOLD } from '../data/delivery';
import { useCart } from '../contexts/CartContext';
import { naira, initials } from '../utils/format';
import ProductCard from '../components/product/ProductCard';
import StarRating from '../components/ui/StarRating';
import SmartImage from '../components/ui/SmartImage';
import Icon from '../components/ui/Icon';
import './ProductDetails.css';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { items, addItem } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const product = getProductById(id);

  // Guard: unknown id → back to the catalogue
  useEffect(() => {
    if (!product) navigate('/products', { replace: true });
  }, [product, navigate]);

  // Reset when moving between products
  useEffect(() => {
    window.scrollTo({ top: 0 });
    setQuantity(1);
    setJustAdded(false);
  }, [id]);

  if (!product) return null;

  const farmer = getFarmerById(product.farmerId);
  const inCart = items.find((i) => i.id === product.id)?.quantity ?? 0;

  // Related: same category first, then other items from the same farm
  const related = [
    ...PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id),
    ...PRODUCTS.filter((p) => p.farmerId === product.farmerId && p.category !== product.category),
  ].slice(0, 4);

  const handleAddToCart = () => {
    if (!product.inStock) return;
    for (let i = 0; i < quantity; i++) addItem(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  return (
    <div className="product-details-page">
      <div className="container">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to="/" className="breadcrumb__link">Home</Link>
          <span className="breadcrumb__sep" aria-hidden="true">›</span>
          <Link to="/products" className="breadcrumb__link">Produce</Link>
          <span className="breadcrumb__sep" aria-hidden="true">›</span>
          <span className="breadcrumb__current" aria-current="page">{product.name}</span>
        </nav>

        <div className="product-details-main">
          <div className="product-details-gallery">
            <div className="product-details-image-wrap">
              <SmartImage
                src={product.image}
                alt={product.name}
                className="product-details-image"
                fallback={product.mark}
              />
              {product.badge && <span className="product-details-badge">{product.badge}</span>}
            </div>
          </div>

          <div className="product-details-info">
            <span className="badge badge-earth product-details-category">{getCategoryLabel(product.category)}</span>
            <h1 className="product-details-name">{product.name}</h1>
            <StarRating rating={product.rating} reviewCount={product.reviewCount} />

            <div className="product-details-price-row">
              <span className="product-details-price">{naira(product.price)}</span>
              <span className="product-details-unit">{product.unit}</span>
            </div>

            <p className="product-details-description">{product.description}</p>

            {product.inStock ? (
              <>
                <div className="product-details-actions">
                  <div className="quantity-selector" role="group" aria-label="Quantity">
                    <button
                      className="quantity-btn"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      aria-label="Decrease quantity"
                    ><Icon name="minus" size={16} strokeWidth={2.4} /></button>
                    <span className="quantity-value" aria-live="polite">{quantity}</span>
                    <button
                      className="quantity-btn"
                      onClick={() => setQuantity((q) => Math.min(50, q + 1))}
                      disabled={quantity >= 50}
                      aria-label="Increase quantity"
                    ><Icon name="plus" size={16} strokeWidth={2.4} /></button>
                  </div>

                  <button
                    className={`btn btn-lg ${justAdded ? 'btn-success' : 'btn-primary'} product-details-add-btn`}
                    onClick={handleAddToCart}
                  >
                    {justAdded
                      ? <><Icon name="check" size={18} strokeWidth={2.5} /> Added to cart</>
                      : <>Add to cart · {naira(product.price * quantity)}</>}
                  </button>
                </div>

                <p className="product-details-subnote" aria-live="polite">
                  {inCart > 0
                    ? <>You have <strong>{inCart}</strong> in your cart. <Link to="/cart">View cart</Link></>
                    : <>Free delivery on orders over {naira(FREE_DELIVERY_THRESHOLD)}.</>}
                </p>
              </>
            ) : (
              <div className="alert alert--info" role="status">
                <Icon name="clock" size={18} />
                <div>
                  <p className="alert__title">Sold out for now</p>
                  <p>{farmer?.name.split(' ')[0] ?? 'The farmer'} restocks after the next harvest. Check back in a few days.</p>
                </div>
              </div>
            )}

            <ul className="product-details-facts">
              <li><Icon name="pin" size={16} /> Grown in {product.farmerLocation}</li>
              <li><Icon name="truck" size={16} /> Delivered to {farmer?.deliversTo.join(', ')}</li>
              <li><Icon name="shield" size={16} /> Refund or replacement if an item arrives damaged</li>
            </ul>

            {farmer && (
              <Link to={`/farmers/${farmer.id}`} className="product-details-farmer">
                <SmartImage
                  src={farmer.avatar}
                  alt=""
                  className="product-details-farmer-avatar"
                  variant="avatar"
                  fallback={initials(farmer.name)}
                />
                <div className="product-details-farmer-info">
                  <p className="product-details-farmer-label">Grown by</p>
                  <p className="product-details-farmer-name">{farmer.name}</p>
                  <p className="product-details-farmer-farm">{farmer.farm} · {farmer.responseTime}</p>
                </div>
                <Icon name="arrowRight" size={18} className="product-details-farmer-arrow" />
              </Link>
            )}
          </div>
        </div>

        {related.length > 0 && (
          <section className="product-details-related" aria-labelledby="related-heading">
            <h2 id="related-heading" className="product-details-related__title">Related products</h2>
            <div className="product-details-related-grid">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
