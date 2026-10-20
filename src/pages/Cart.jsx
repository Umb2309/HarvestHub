import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { CATEGORY_MARK } from '../data/products';
import { FREE_DELIVERY_THRESHOLD, LOWEST_DELIVERY_FEE } from '../data/delivery';
import { naira } from '../utils/format';
import SmartImage from '../components/ui/SmartImage';
import Icon from '../components/ui/Icon';
import './Cart.css';

export default function Cart() {
  const { items, cartCount, cartTotal, updateQty, removeItem, clearCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => { window.scrollTo({ top: 0 }); }, []);

  if (items.length === 0) {
    return (
      <div className="container section cart-empty">
        <div className="empty-state">
          <span className="empty-state__icon"><Icon name="basket" size={28} /></span>
          <h1>Your cart is empty</h1>
          <p>Tomatoes from Kano, yam from Benue, eggs from Abeokuta — start with what you need this week.</p>
          <Link to="/products" className="btn btn-primary">Browse produce</Link>
        </div>
      </div>
    );
  }

  const farmCount = new Set(items.map((i) => i.farmerId)).size;
  const remaining = Math.max(0, FREE_DELIVERY_THRESHOLD - cartTotal);
  const progress = Math.min(100, (cartTotal / FREE_DELIVERY_THRESHOLD) * 100);

  return (
    <div className="container section cart-page">
      <header className="cart-page__header">
        <h1 className="cart-page__title">Your cart</h1>
        <p className="cart-page__subtitle">
          {cartCount} item{cartCount !== 1 ? 's' : ''} from {farmCount} farm{farmCount !== 1 ? 's' : ''}
        </p>
      </header>

      <div className="cart-layout">
        <section className="cart-items card" aria-label="Items in your cart">
          <ul>
            {items.map((item) => (
              <li key={item.id} className="cart-item">
                <SmartImage
                  src={item.image}
                  alt=""
                  className="cart-item__image"
                  fallback={item.mark ?? CATEGORY_MARK[item.category]}
                />

                <div className="cart-item__info">
                  <h3 className="cart-item__name">
                    <Link to={`/products/${item.id}`}>{item.name}</Link>
                  </h3>
                  <p className="cart-item__meta">{naira(item.price)} {item.unit}</p>
                  <p className="cart-item__farm"><Icon name="pin" size={12} /> {item.farmerName}</p>
                </div>

                <div className="cart-item__qty" role="group" aria-label={`Quantity of ${item.name}`}>
                  <button onClick={() => updateQty(item.id, item.quantity - 1)} aria-label={`Decrease ${item.name}`}>
                    <Icon name="minus" size={14} strokeWidth={2.4} />
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQty(item.id, item.quantity + 1)} aria-label={`Increase ${item.name}`}>
                    <Icon name="plus" size={14} strokeWidth={2.4} />
                  </button>
                </div>

                <p className="cart-item__total">{naira(item.price * item.quantity)}</p>

                <button className="cart-item__remove" onClick={() => removeItem(item.id)} aria-label={`Remove ${item.name}`}>
                  <Icon name="x" size={18} />
                </button>
              </li>
            ))}
          </ul>

          <div className="cart-items__footer">
            <Link to="/products" className="btn btn-ghost btn-sm">← Keep shopping</Link>
            <button className="btn btn-ghost btn-sm cart-items__clear" onClick={clearCart}>Empty cart</button>
          </div>
        </section>

        <aside className="cart-summary card" aria-label="Order summary">
          <h2 className="cart-summary__title">Order summary</h2>

          <div className="cart-summary__row">
            <span>Subtotal</span>
            <span>{naira(cartTotal)}</span>
          </div>
          <div className="cart-summary__row">
            <span>Delivery</span>
            <span>{remaining === 0 ? <strong className="text-primary">Free</strong> : `From ${naira(LOWEST_DELIVERY_FEE)}`}</span>
          </div>

          <div className="cart-summary__progress">
            <div className="cart-summary__bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)} aria-label="Progress to free delivery">
              <span style={{ width: `${progress}%` }} />
            </div>
            <p>
              {remaining === 0
                ? 'Your order qualifies for free delivery.'
                : <>Add <strong>{naira(remaining)}</strong> more for free delivery.</>}
            </p>
          </div>

          <div className="cart-summary__row cart-summary__row--total">
            <span>Estimated total</span>
            <span>{naira(cartTotal)}{remaining > 0 && <small> + delivery</small>}</span>
          </div>
          <p className="cart-summary__note">Exact delivery fee is set by your state at checkout.</p>

          <button className="btn btn-primary btn-lg btn-block" onClick={() => navigate('/checkout')}>
            Go to checkout
          </button>

          <ul className="cart-summary__assurances">
            <li><Icon name="cash" size={16} /> Pay on delivery available</li>
            <li><Icon name="shield" size={16} /> Bad item? We refund or replace it</li>
          </ul>
        </aside>
      </div>
    </div>
  );
}
