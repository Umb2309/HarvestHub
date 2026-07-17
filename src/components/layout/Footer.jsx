import { Link } from 'react-router-dom';
import './Footer.css';

const FOOTER_LINKS = {
  Marketplace: [
    { to: '/products', label: 'Browse Products' },
    { to: '/farmers',  label: 'Meet Farmers'   },
    { to: '/about',    label: 'Our Story'       },
  ],
  Account: [
    { to: '/login',    label: 'Sign In'  },
    { to: '/register', label: 'Register' },
    { to: '/cart',     label: 'My Cart'  },
  ],
  Support: [
    { to: '/contact', label: 'Contact Us'      },
    { to: '/about',   label: 'How It Works'    },
    { to: '/contact', label: 'Report an Issue' },
  ],
};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__top container">

        {/* Brand Column */}
        <div className="footer__brand">
          <Link to="/" className="footer__logo" aria-label="HarvestHub home">
            <span className="footer__logo-icon" aria-hidden="true">🌿</span>
            <span className="footer__logo-text">HarvestHub</span>
          </Link>
          <p className="footer__tagline">
            Connecting local farmers directly with communities who care about fresh, seasonal food.
          </p>

          {/* Social Icons */}
          <div className="footer__socials" aria-label="Social media links">
            {/* Instagram */}
            <a href="#" className="footer__social-link" aria-label="Follow us on Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
              </svg>
            </a>
            {/* Facebook */}
            <a href="#" className="footer__social-link" aria-label="Follow us on Facebook">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
            {/* Twitter / X */}
            <a href="#" className="footer__social-link" aria-label="Follow us on X (Twitter)">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 4l16 16M20 4L4 20"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Link Columns */}
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
            <h4 className="footer__newsletter-heading">Stay in season</h4>
            <p className="footer__newsletter-sub">Get weekly updates on what's fresh at the market.</p>
          </div>
          <form
            className="footer__newsletter-form"
            onSubmit={(e) => { e.preventDefault(); }}
            aria-label="Newsletter sign-up"
          >
            <input
              type="email"
              className="input footer__newsletter-input"
              placeholder="your@email.com"
              aria-label="Email address"
              required
            />
            <button type="submit" className="btn btn-primary">Subscribe</button>
          </form>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer__bottom container">
        <p className="footer__copy">© {year} HarvestHub. Built with 💚 for local communities.</p>
        <nav aria-label="Legal links" className="footer__legal">
          <Link to="#" className="footer__link">Privacy</Link>
          <Link to="#" className="footer__link">Terms</Link>
          <Link to="#" className="footer__link">Cookies</Link>
        </nav>
      </div>
    </footer>
  );
}
