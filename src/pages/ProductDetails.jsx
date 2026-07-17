/**
 * ProductDetails Page
 * --------------------
 * Displays a full product page when user clicks a ProductCard.
 * URL: /products/:id  (e.g. /products/p001)
 *
 * 🎓 NEW REACT HOOKS used here:
 *
 * useParams()
 *   Reads URL parameters. The route is defined as "/products/:id" in App.jsx.
 *   useParams() returns { id: 'p001' } when the URL is /products/p001.
 *   This is how we know WHICH product to display.
 *
 * useNavigate()
 *   Gives us a `navigate` function to redirect programmatically.
 *   e.g. navigate('/products') — same as clicking a <Link to="/products"> but in code.
 *   We use it to redirect to /products if the product ID doesn't exist.
 */

import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProductById, PRODUCTS } from '../data/products';
import { getFarmerById } from '../data/farmers';
import { useCart } from '../contexts/CartContext';
import ProductCard from '../components/product/ProductCard';
import StarRating  from '../components/ui/StarRating';
import './ProductDetails.css';

export default function ProductDetails() {
  // 🎓 useParams — reads the :id from the URL
  const { id } = useParams();
  const navigate = useNavigate();

  // 🎓 useState — local quantity selector state
  const [quantity, setQuantity] = useState(1);
  const [addedMsg, setAddedMsg] = useState(false);

  const { addItem, cartCount } = useCart();

  // Look up the product from our mock data
  const product = getProductById(id);

  // 🎓 useEffect — redirect to /products if the id doesn't match any product
  // This is a "guard" pattern — very common in production apps
  useEffect(() => {
    if (!product) {
      navigate('/products', { replace: true }); // replace: true means no back-button entry
    }
  }, [product, navigate]);

  // Scroll to top when product changes (navigating between products)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  // If product not found yet, render nothing (redirect is happening)
  if (!product) return null;

  // Look up the farmer who sells this product
  const farmer = getFarmerById(product.farmerId);

  // Related products: same category, exclude current product, max 4
  const relatedProducts = PRODUCTS
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  // Add to cart handler
  const handleAddToCart = () => {
    if (!product.inStock) return;
    // Add the product `quantity` number of times
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
    setAddedMsg(true);
    setTimeout(() => setAddedMsg(false), 2000);
  };

  const decreaseQty = () => setQuantity((q) => Math.max(1, q - 1));
  const increaseQty = () => setQuantity((q) => Math.min(99, q + 1));

  return (
    <div className="product-details-page animate-fade-in">
      <div className="container">

        {/* ── Breadcrumb ── */}
        <nav className="breadcrumb product-details-breadcrumb" aria-label="Breadcrumb">
          <Link to="/" className="breadcrumb__link">Home</Link>
          <span className="breadcrumb__sep" aria-hidden="true">›</span>
          <Link to="/products" className="breadcrumb__link">Products</Link>
          <span className="breadcrumb__sep" aria-hidden="true">›</span>
          <span className="breadcrumb__current" aria-current="page">{product.name}</span>
        </nav>

        {/* ── Main: Image + Info ── */}
        <div className="product-details-main">

          {/* Left: Image */}
          <div className="product-details-gallery">
            <div className="product-details-image-wrap">
              <img
                src={product.image}
                alt={product.name}
                className="product-details-image"
              />
              {!product.inStock && (
                <div className="product-details-oos">Out of Stock</div>
              )}
              {product.badge && (
                <span className="badge badge-primary product-details-badge">{product.badge}</span>
              )}
            </div>
          </div>

          {/* Right: Info panel */}
          <div className="product-details-info">
            <p className="product-details-category badge badge-earth">
              {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
            </p>

            <h1 className="product-details-name">{product.name}</h1>

            <StarRating rating={product.rating} reviewCount={product.reviewCount} />

            <p className="product-details-description">{product.description}</p>

            {/* Price */}
            <div className="product-details-price-row">
              <span className="product-details-price">${product.price.toFixed(2)}</span>
              <span className="product-details-unit">{product.unit}</span>
            </div>

            {/* Quantity Selector */}
            <div className="product-details-actions">
              <div className="quantity-selector" role="group" aria-label="Quantity">
                <button
                  className="quantity-btn"
                  onClick={decreaseQty}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >−</button>
                <span className="quantity-value" aria-live="polite">{quantity}</span>
                <button
                  className="quantity-btn"
                  onClick={increaseQty}
                  disabled={quantity >= 99}
                  aria-label="Increase quantity"
                >+</button>
              </div>

              <button
                className={`btn btn-lg ${addedMsg ? 'btn-success' : 'btn-primary'} product-details-add-btn`}
                onClick={handleAddToCart}
                disabled={!product.inStock}
                aria-live="polite"
              >
                {addedMsg
                  ? `✓ Added ${quantity} to cart!`
                  : product.inStock
                    ? `Add ${quantity} to Cart`
                    : 'Out of Stock'}
              </button>
            </div>

            {/* Subtotal hint */}
            {product.inStock && (
              <p className="product-details-subtotal">
                Subtotal: <strong>${(product.price * quantity).toFixed(2)}</strong>
              </p>
            )}

            {/* Divider */}
            <hr className="divider" />

            {/* Farmer info card */}
            {farmer && (
              <Link to={`/farmers/${farmer.id}`} className="product-details-farmer">
                <img
                  src={farmer.avatar}
                  alt={farmer.name}
                  className="product-details-farmer-avatar"
                />
                <div className="product-details-farmer-info">
                  <p className="product-details-farmer-name">{farmer.name}</p>
                  <p className="product-details-farmer-farm">{farmer.farm}</p>
                  <p className="product-details-farmer-location">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                    {farmer.farmerLocation || farmer.location}
                  </p>
                </div>
                <span className="product-details-farmer-arrow" aria-hidden="true">›</span>
              </Link>
            )}

            {/* Trust badges */}
            <div className="product-details-trust">
              {[
                { icon: '🌱', label: 'Sustainably Grown'  },
                { icon: '🚚', label: 'Delivered Fresh'     },
                { icon: '✅', label: 'Quality Guaranteed' },
              ].map(({ icon, label }) => (
                <div key={label} className="trust-badge">
                  <span aria-hidden="true">{icon}</span>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Related Products ── */}
        {relatedProducts.length > 0 && (
          <section className="product-details-related" aria-labelledby="related-heading">
            <div className="section-header" style={{ textAlign: 'left' }}>
              <span className="section-label">More Like This</span>
              <h2 id="related-heading">Related Products</h2>
            </div>
            <div className="product-details-related-grid">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
