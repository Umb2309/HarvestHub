/**
 * ProductCard
 * ------------
 * One product in the grid. Used on Home, Products, Product Details (related) and Farmer Profile.
 *
 * Props:
 *   product {object} — a product from src/data/products.js
 *
 * 🎓 Why the card is an <article> and not a <Link>:
 * A <button> inside an <a> is invalid HTML and makes clicks ambiguous.
 * Instead, the product name is the link, and a CSS ::after on it stretches
 * the clickable area over the whole card ("stretched link"). The cart controls
 * sit above that layer with z-index, so they stay independently clickable.
 */

import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { getCategoryLabel } from '../../data/products';
import { naira } from '../../utils/format';
import StarRating from '../ui/StarRating';
import SmartImage from '../ui/SmartImage';
import Icon from '../ui/Icon';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { id, name, category, price, unit, farmerName, farmerLocation, image, badge, rating, reviewCount, inStock } = product;
  const { items, addItem, updateQty } = useCart();

  // How many of this product are already in the cart (0 if none)
  const qtyInCart = items.find((i) => i.id === id)?.quantity ?? 0;
  const state = farmerLocation.split(',').pop().trim(); // "Kura, Kano State" → "Kano State"

  return (
    <article className={`product-card card${inStock ? '' : ' product-card--oos'}`}>
      <div className="product-card__image-wrap">
        <SmartImage
          src={image}
          alt=""
          className="product-card__image"
          loading="lazy"
          fallback={product.mark}
        />
        {badge && <span className="product-card__badge">{badge}</span>}
        {!inStock && <span className="product-card__oos-label">Sold out</span>}
      </div>

      <div className="product-card__body">
        <p className="product-card__category">{getCategoryLabel(category)}</p>
        <h3 className="product-card__name">
          <Link to={`/products/${id}`} className="product-card__link">{name}</Link>
        </h3>
        <StarRating rating={rating} reviewCount={reviewCount} size="sm" />
        <p className="product-card__farmer">
          <Icon name="pin" size={12} strokeWidth={2.2} />
          <span>{farmerName} · {state}</span>
        </p>
      </div>

      <div className="product-card__footer">
        <div className="product-card__price">
          <span className="product-card__amount">{naira(price)}</span>
          <span className="product-card__unit">{unit}</span>
        </div>

        {!inStock ? (
          <span className="product-card__restock">Restocking</span>
        ) : qtyInCart > 0 ? (
          <div className="product-card__stepper" role="group" aria-label={`${name} quantity in cart`}>
            <button onClick={() => updateQty(id, qtyInCart - 1)} aria-label={`Remove one ${name}`}>
              <Icon name="minus" size={14} strokeWidth={2.5} />
            </button>
            <span aria-live="polite">{qtyInCart}</span>
            <button onClick={() => addItem(product)} aria-label={`Add one more ${name}`}>
              <Icon name="plus" size={14} strokeWidth={2.5} />
            </button>
          </div>
        ) : (
          <button
            className="btn btn-primary btn-sm product-card__add"
            onClick={() => addItem(product)}
            aria-label={`Add ${name} to cart`}
          >
            <Icon name="plus" size={14} strokeWidth={2.5} /> Add
          </button>
        )}
      </div>
    </article>
  );
}
