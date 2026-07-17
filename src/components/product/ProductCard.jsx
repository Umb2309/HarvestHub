/**
 * ProductCard Component
 * ----------------------
 * Displays a single product in a card layout.
 * Used on: Home page, Products page, Farmer Profile page.
 *
 * Props:
 *   product {object} — a product object from src/data/products.js
 *
 * 🎓 REACT CONCEPT — Destructuring props
 * Instead of `props.product`, we write `{ product }` in the function signature.
 * Then we can destructure further:  const { name, price, image } = product;
 * This makes the code much cleaner to read.
 *
 * 🎓 REACT CONCEPT — useState
 * `const [added, setAdded] = useState(false)` creates a local piece of state.
 * - `added`    → the current value (starts as false)
 * - `setAdded` → the function to change it
 * When `setAdded(true)` is called, React re-renders this component with added=true.
 */

import { useState } from 'react';
import { Link }     from 'react-router-dom';
import { useCart }  from '../../contexts/CartContext';
import StarRating   from '../ui/StarRating';
import './ProductCard.css';

export default function ProductCard({ product }) {
  // Destructure the fields we need from the product object
  const { id, name, category, price, unit, farmerName, image, badge, rating, reviewCount, inStock } = product;

  // 🎓 useState — local "just added" feedback state for the button
  const [added, setAdded] = useState(false);

  // 🎓 useCart — custom hook that reads from CartContext
  // We only need `addItem` here, so we destructure just that one function
  const { addItem } = useCart();

  // Called when the user clicks "Add to Cart"
  const handleAddToCart = (e) => {
    // Stop the click from bubbling up to the <Link> wrapper (which would navigate away)
    e.preventDefault();
    e.stopPropagation();

    if (!inStock) return; // guard: do nothing if out of stock

    addItem(product);   // add product to cart via CartContext
    setAdded(true);     // show "✓ Added" feedback

    // After 1.5 seconds, reset the button back to "Add to Cart"
    // setTimeout is a browser API — we don't need useEffect here
    // because we're just scheduling a state reset, not a side effect tied to rendering
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    // The whole card is a link to the product details page
    <Link to={`/products/${id}`} className="product-card card" aria-label={`View ${name}`}>

      {/* ── Image ── */}
      <div className="product-card__image-wrap">
        <img
          src={image}
          alt={name}
          className="product-card__image"
          loading="lazy"       /* browser only loads this image when it's near the viewport */
        />

        {/* Badge — only renders if `badge` is not null */}
        {/* 🎓 CONCEPT — Conditional rendering with && */}
        {/* If badge is truthy, render the <span>. If badge is null/false, render nothing. */}
        {badge && (
          <span className="product-card__badge badge badge-primary">{badge}</span>
        )}

        {/* Out of stock overlay */}
        {!inStock && (
          <div className="product-card__out-of-stock">Out of Stock</div>
        )}
      </div>

      {/* ── Body ── */}
      <div className="product-card__body">

        {/* Category label — e.g. "vegetables" → "Vegetables" */}
        <p className="product-card__category">
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </p>

        <h3 className="product-card__name">{name}</h3>

        {/* StarRating is a child component — we pass data to it via props */}
        <StarRating rating={rating} reviewCount={reviewCount} size="sm" />

        <p className="product-card__farmer">
          <span className="product-card__farmer-icon" aria-hidden="true">🌱</span>
          {farmerName}
        </p>
      </div>

      {/* ── Footer ── */}
      <div className="product-card__footer">
        <div className="product-card__price">
          <span className="product-card__amount">${price.toFixed(2)}</span>
          <span className="product-card__unit">{unit}</span>
        </div>

        {/* Add to Cart button */}
        <button
          className={`btn btn-sm ${added ? 'btn-success' : 'btn-primary'}`}
          onClick={handleAddToCart}
          disabled={!inStock}
          aria-label={`Add ${name} to cart`}
        >
          {/* 🎓 CONCEPT — Ternary expression in JSX */}
          {/* condition ? valueIfTrue : valueIfFalse */}
          {added ? '✓ Added' : 'Add'}
        </button>
      </div>
    </Link>
  );
}
