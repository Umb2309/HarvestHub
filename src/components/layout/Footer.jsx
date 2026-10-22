import { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../ui/Logo';
import Icon from '../ui/Icon';
import './Footer.css';

const FOOTER_LINKS = {
  Shop: [
    { to: '/products', label: 'All produce' },
    { to: '/farmers',  label: 'Our farmers' },
    { to: '/cart',     label: 'Your cart'   },
  ],
  Farmers: [
    { to: '/register?role=farmer', label: 'Sell on HarvestHub' },
    { to: '/about#how-it-works',   label: 'How payouts work'   },
    { to: '/contact',              label: 'Talk to our team'   },
  ],
  Company: [
    { to: '/about',   label: 'About us'    },
    { to: '/contact', label: 'Contact'     },
    { to: '/contact#faq', label: 'Delivery & FAQ' },
  ],
};

export default function Footer() {
  const year = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="footer">
      <div className="footer__top container">

        <div className="footer__brand">
          <Logo tone="light" />
          <p className="footer__tagline">
            We connect Nigerian farmers with households and kitchens that want to buy
            directly from them.
          </p>

          <ul className="footer__contact">
            <li><Icon name="pin" size={16} /> 14 Adeola Odeku Street, Victoria Island, Lagos</li>
            <li><Icon name="phone" size={16} /> +234 802 555 0147</li>
            <li><Icon name="clock" size={16} /> Monday to Saturday, 8am to 6pm</li>
          </ul>

          <div className="footer__socials">
            <a href="#" className="footer__social-link" aria-label="HarvestHub on Instagram"><Icon name="instagram" size={18} /></a>
            <a href="#" className="footer__social-link" aria-label="HarvestHub on Facebook"><Icon name="facebook" size={18} /></a>
            <a href="#" className="footer__social-link" aria-label="HarvestHub on X"><Icon name="xlogo" size={18} /></a>
          </div>
        </div>

        {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
          <div key={heading} className="footer__col">
            <h3 className="footer__col-heading">{heading}</h3>
            <ul className="footer__col-links">
              {links.map(({ to, label }) => (
                <li key={label}>
                  <Link to={to} className="footer__link">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Newsletter */}
      <div className="footer__newsletter">
        <div className="container footer__newsletter-inner">
          <div>
            <h3 className="footer__newsletter-heading">Weekly harvest updates</h3>
            <p className="footer__newsletter-sub">New produce and price changes, sent every Monday.</p>
          </div>

          {subscribed ? (
            <p className="footer__newsletter-done" role="status">
              <Icon name="check" size={18} /> Thanks. You're subscribed.
            </p>
          ) : (
            <form className="footer__newsletter-form" onSubmit={handleSubscribe} aria-label="Newsletter sign-up">
              <input
                type="email"
                className="input input--on-dark"
                placeholder="you@example.com"
                aria-label="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-secondary">Subscribe</button>
            </form>
          )}
        </div>
      </div>

      <div className="footer__bottom container">
        <p className="footer__copy">© {year} HarvestHub Agro Ltd. Prices and farms shown are sample data.</p>
        <p className="footer__pay">Card, bank transfer and pay on delivery accepted</p>
      </div>
    </footer>
  );
}
