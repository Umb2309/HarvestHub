import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { NIGERIAN_STATES, getDeliveryQuote, FREE_DELIVERY_THRESHOLD } from '../data/delivery';
import { naira, normaliseNgPhone, shortDate } from '../utils/format';
import Icon from '../components/ui/Icon';
import './Checkout.css';

const PAY_ON_DELIVERY_STATES = ['Lagos', 'FCT (Abuja)'];

const PAYMENT_METHODS = [
  { id: 'card',     icon: 'card', title: 'Debit card',      sub: 'Visa, Mastercard or Verve' },
  { id: 'transfer', icon: 'bank', title: 'Bank transfer',   sub: 'Pay into a one-time account' },
  { id: 'pod',      icon: 'cash', title: 'Pay on delivery', sub: 'Cash or POS · Lagos & Abuja' },
];

/** "4084084084084081" → "4084 0840 8408 4081" */
const formatCardNumber = (v) => v.replace(/\D/g, '').slice(0, 19).replace(/(\d{4})(?=\d)/g, '$1 ');

export default function Checkout() {
  const { items, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: user?.name ?? '',
    phone: user?.phone ?? '',
    email: user?.email ?? '',
    state: user?.state === 'FCT' ? 'FCT (Abuja)' : (user?.state ?? 'Lagos'),
    city: '',
    address: '',
    landmark: '',
    note: '',
    payment: 'card',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [order, setOrder] = useState(null);

  useEffect(() => { window.scrollTo({ top: 0 }); }, []);

  // Nothing to check out (and no order just placed) → back to the cart
  useEffect(() => {
    if (items.length === 0 && !order) navigate('/cart', { replace: true });
  }, [items, order, navigate]);

  const quote = getDeliveryQuote(form.state, cartTotal);
  const grandTotal = cartTotal + quote.fee;
  const podAllowed = PAY_ON_DELIVERY_STATES.includes(form.state);

  // If the user switches to a state without pay-on-delivery, fall back to card
  useEffect(() => {
    if (!podAllowed && form.payment === 'pod') setForm((f) => ({ ...f, payment: 'card' }));
  }, [podAllowed, form.payment]);

  const setField = (name, value) => {
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: undefined }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'cardNumber') return setField(name, formatCardNumber(value));
    if (name === 'cardExpiry') {
      const d = value.replace(/\D/g, '').slice(0, 4);
      return setField(name, d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d);
    }
    if (name === 'cardCvv') return setField(name, value.replace(/\D/g, '').slice(0, 4));
    setField(name, value);
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Enter the name of the person receiving the order.';
    if (!normaliseNgPhone(form.phone)) e.phone = 'Enter a Nigerian mobile number, e.g. 0803 123 4567.';
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'That email address doesn\'t look right.';
    if (!form.city.trim()) e.city = 'Enter your town or area.';
    if (form.address.trim().length < 6) e.address = 'Enter your house number and street.';

    if (form.payment === 'card') {
      const digits = form.cardNumber.replace(/\s/g, '');
      if (!/^\d{16,19}$/.test(digits)) e.cardNumber = 'Card numbers are 16 to 19 digits.';
      const m = form.cardExpiry.match(/^(0[1-9]|1[0-2])\/(\d{2})$/);
      if (!m) e.cardExpiry = 'Use MM/YY.';
      else if (new Date(2000 + +m[2], +m[1], 1) <= new Date()) e.cardExpiry = 'This card has expired.';
      if (!/^\d{3,4}$/.test(form.cardCvv)) e.cardCvv = '3 or 4 digits.';
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      // Move focus to the first field with an error
      requestAnimationFrame(() => document.querySelector('.input--error')?.focus());
      return;
    }

    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1400)); // pretend to talk to the payment provider

    const eta = new Date();
    eta.setDate(eta.getDate() + quote.days);
    if (eta.getDay() === 0) eta.setDate(eta.getDate() + 1); // no Sunday deliveries

    setOrder({
      number: `HH-${Math.floor(100000 + Math.random() * 900000)}`,
      eta: shortDate(eta),
      name: form.name.trim(),
      phone: normaliseNgPhone(form.phone),
      address: [form.address, form.city, form.state].join(', ') + (form.landmark.trim() ? ` (${form.landmark.trim()})` : ''),
      payment: form.payment,
      total: grandTotal,
      itemCount: items.reduce((n, i) => n + i.quantity, 0),
    });
    setIsSubmitting(false);
    clearCart();
    window.scrollTo({ top: 0 });
  };

  /* ── Success screen ── */
  if (order) {
    return (
      <div className="container section checkout-success">
        <div className="checkout-success__card card">
          <span className="checkout-success__icon"><Icon name="check" size={32} strokeWidth={2.5} /></span>
          <h1 className="checkout-success__title">Order placed</h1>
          <p className="checkout-success__sub">
            Thanks, {order.name.split(' ')[0]}. The farms have your order and will start packing.
            We'll text updates to {order.phone}.
          </p>

          {order.payment === 'transfer' && (
            <div className="checkout-success__transfer">
              <p className="checkout-success__transfer-title">Complete your bank transfer</p>
              <dl>
                <div><dt>Amount</dt><dd>{naira(order.total)}</dd></div>
                <div><dt>Bank</dt><dd>Demo Bank Nigeria</dd></div>
                <div><dt>Account no.</dt><dd>0123456789</dd></div>
                <div><dt>Account name</dt><dd>HarvestHub / {order.number}</dd></div>
              </dl>
              <p className="form-hint">This account expires in 30 minutes. It's a demo — don't send real money.</p>
            </div>
          )}

          <dl className="checkout-success__details">
            <div><dt>Order number</dt><dd><strong>{order.number}</strong></dd></div>
            <div><dt>Arrives by</dt><dd className="text-primary"><strong>{order.eta}</strong></dd></div>
            <div><dt>Deliver to</dt><dd>{order.address}</dd></div>
            <div><dt>Payment</dt><dd>{PAYMENT_METHODS.find((p) => p.id === order.payment).title}</dd></div>
            <div><dt>Total</dt><dd><strong>{naira(order.total)}</strong> · {order.itemCount} items</dd></div>
          </dl>

          <div className="checkout-success__actions">
            <Link to="/products" className="btn btn-primary">Keep shopping</Link>
            <Link to="/" className="btn btn-outline">Back to home</Link>
          </div>
        </div>
      </div>
    );
  }

  const fieldClass = (name) => `input${errors[name] ? ' input--error' : ''}`;
  const FieldError = ({ name }) => errors[name]
    ? <p className="form-error-msg" id={`${name}-error`}>{errors[name]}</p>
    : null;
  const describedBy = (name) => (errors[name] ? `${name}-error` : undefined);

  /* ── Form ── */
  return (
    <div className="container section checkout-page">
      <header className="checkout-page__header">
        <Link to="/cart" className="checkout-page__back">← Back to cart</Link>
        <h1 className="checkout-page__title">Checkout</h1>
        {!user && (
          <p className="checkout-page__signin">
            Have an account? <Link to="/login" state={{ from: { pathname: '/checkout' } }}>Sign in</Link> to fill this in faster.
          </p>
        )}
      </header>

      <form className="checkout-layout" onSubmit={handleSubmit} noValidate>
        <div className="checkout-forms">
          {/* 1. Delivery */}
          <fieldset className="checkout-card card">
            <legend className="checkout-card__title"><span>1</span> Delivery details</legend>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name" className="label">Full name</label>
                <input id="name" name="name" className={fieldClass('name')} value={form.name} onChange={handleChange}
                  autoComplete="name" placeholder="Chiamaka Okeke" aria-invalid={!!errors.name} aria-describedby={describedBy('name')} />
                <FieldError name="name" />
              </div>
              <div className="form-group">
                <label htmlFor="phone" className="label">Phone number</label>
                <input id="phone" name="phone" type="tel" className={fieldClass('phone')} value={form.phone} onChange={handleChange}
                  autoComplete="tel" placeholder="0803 123 4567" aria-invalid={!!errors.phone} aria-describedby={describedBy('phone') ?? 'phone-hint'} />
                {errors.phone ? <FieldError name="phone" /> : <p className="form-hint" id="phone-hint">The rider will call this number on arrival.</p>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email" className="label">Email <span className="label__optional">(optional, for your receipt)</span></label>
              <input id="email" name="email" type="email" className={fieldClass('email')} value={form.email} onChange={handleChange}
                autoComplete="email" placeholder="you@example.com" aria-invalid={!!errors.email} aria-describedby={describedBy('email')} />
              <FieldError name="email" />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="state" className="label">State</label>
                <select id="state" name="state" className="input" value={form.state} onChange={handleChange} autoComplete="address-level1">
                  {NIGERIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="city" className="label">Town / area</label>
                <input id="city" name="city" className={fieldClass('city')} value={form.city} onChange={handleChange}
                  autoComplete="address-level2" placeholder="e.g. Yaba, Wuse 2, Bodija" aria-invalid={!!errors.city} aria-describedby={describedBy('city')} />
                <FieldError name="city" />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="address" className="label">Street address</label>
              <input id="address" name="address" className={fieldClass('address')} value={form.address} onChange={handleChange}
                autoComplete="street-address" placeholder="House 12, Adebayo Street" aria-invalid={!!errors.address} aria-describedby={describedBy('address')} />
              <FieldError name="address" />
            </div>

            <div className="form-group">
              <label htmlFor="landmark" className="label">Nearest landmark <span className="label__optional">(optional)</span></label>
              <input id="landmark" name="landmark" className="input" value={form.landmark} onChange={handleChange}
                placeholder="e.g. opposite First Bank, after the filling station" />
            </div>

            <div className="form-group">
              <label htmlFor="note" className="label">Note for the farmer or rider <span className="label__optional">(optional)</span></label>
              <textarea id="note" name="note" className="input textarea checkout-note" rows={2} value={form.note} onChange={handleChange}
                placeholder="e.g. Please cut the chicken into 8 pieces. Gate is blue." />
            </div>

            <p className="checkout-delivery-note">
              <Icon name="truck" size={18} />
              <span>
                Delivery to <strong>{form.state}</strong>:{' '}
                {quote.fee === 0 ? <strong>free</strong> : <strong>{naira(quote.fee)}</strong>}
                {' '}· usually {quote.days === 1 ? 'next day' : `${quote.days} days`}
              </span>
            </p>
          </fieldset>

          {/* 2. Payment */}
          <fieldset className="checkout-card card">
            <legend className="checkout-card__title"><span>2</span> Payment</legend>

            <div className="choice-grid" role="radiogroup" aria-label="Payment method">
              {PAYMENT_METHODS.map((m) => {
                const disabled = m.id === 'pod' && !podAllowed;
                return (
                  <label key={m.id} className={`choice${disabled ? ' choice--disabled' : ''}`}>
                    <input type="radio" name="payment" value={m.id} checked={form.payment === m.id}
                      onChange={handleChange} disabled={disabled} />
                    <Icon name={m.icon} size={20} className="choice__icon" />
                    <span>
                      <span className="choice__title">{m.title}</span>
                      <span className="choice__sub">{disabled ? 'Not available in your state yet' : m.sub}</span>
                    </span>
                  </label>
                );
              })}
            </div>

            {form.payment === 'card' && (
              <div className="checkout-card-fields">
                <div className="form-group">
                  <label htmlFor="cardNumber" className="label">Card number</label>
                  <input id="cardNumber" name="cardNumber" inputMode="numeric" autoComplete="cc-number"
                    className={fieldClass('cardNumber')} value={form.cardNumber} onChange={handleChange}
                    placeholder="0000 0000 0000 0000" aria-invalid={!!errors.cardNumber} aria-describedby={describedBy('cardNumber')} />
                  <FieldError name="cardNumber" />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="cardExpiry" className="label">Expiry</label>
                    <input id="cardExpiry" name="cardExpiry" inputMode="numeric" autoComplete="cc-exp"
                      className={fieldClass('cardExpiry')} value={form.cardExpiry} onChange={handleChange}
                      placeholder="MM/YY" aria-invalid={!!errors.cardExpiry} aria-describedby={describedBy('cardExpiry')} />
                    <FieldError name="cardExpiry" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="cardCvv" className="label">CVV</label>
                    <input id="cardCvv" name="cardCvv" type="password" inputMode="numeric" autoComplete="cc-csc"
                      className={fieldClass('cardCvv')} value={form.cardCvv} onChange={handleChange}
                      placeholder="123" aria-invalid={!!errors.cardCvv} aria-describedby={describedBy('cardCvv')} />
                    <FieldError name="cardCvv" />
                  </div>
                </div>
              </div>
            )}

            {form.payment === 'transfer' && (
              <p className="checkout-pay-note">
                After you place the order we'll show a one-time account number. Your order is confirmed as soon as the transfer lands.
              </p>
            )}
            {form.payment === 'pod' && (
              <p className="checkout-pay-note">
                Pay the rider in cash or by POS when your order arrives. Please have the exact amount ready if paying cash.
              </p>
            )}
          </fieldset>
        </div>

        {/* Summary */}
        <aside className="checkout-summary card" aria-label="Order summary">
          <h2 className="checkout-summary__title">Your order</h2>

          <ul className="checkout-summary__items">
            {items.map((item) => (
              <li key={item.id}>
                <span className="checkout-summary__item-name">
                  {item.name} <span className="text-muted">× {item.quantity}</span>
                </span>
                <span>{naira(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>

          <div className="checkout-summary__row"><span>Subtotal</span><span>{naira(cartTotal)}</span></div>
          <div className="checkout-summary__row">
            <span>Delivery ({quote.label})</span>
            <span>{quote.fee === 0 ? <strong className="text-primary">Free</strong> : naira(quote.fee)}</span>
          </div>
          {quote.fee > 0 && (
            <p className="checkout-summary__hint">Free delivery on orders over {naira(FREE_DELIVERY_THRESHOLD)}.</p>
          )}
          <div className="checkout-summary__row checkout-summary__row--total">
            <span>Total</span><span>{naira(grandTotal)}</span>
          </div>

          <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={isSubmitting}>
            {isSubmitting
              ? <span className="spinner-wrap"><span className="spinner" /> Placing order…</span>
              : form.payment === 'card' ? `Pay ${naira(grandTotal)}` : 'Place order'}
          </button>

          <p className="checkout-summary__disclaimer">
            <Icon name="shield" size={14} /> Demo checkout — no real payment is taken.
          </p>
        </aside>
      </form>
    </div>
  );
}
