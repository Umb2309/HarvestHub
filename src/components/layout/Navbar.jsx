import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import './Navbar.css';

const NAV_LINKS = [
  { to: '/',         label: 'Home',     exact: true },
  { to: '/products', label: 'Products' },
  { to: '/farmers',  label: 'Farmers'  },
  { to: '/about',    label: 'About'    },
  { to: '/contact',  label: 'Contact'  },
];

export default function Navbar() {
  const { cartCount }         = useCart();
  const { user, logout }      = useAuth();
  const navigate              = useNavigate();

  const [menuOpen,    setMenuOpen]    = useState(false);
  const [scrolled,    setScrolled]    = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef(null);

  // Scroll shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change / resize
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate('/');
  };

  const closeMobileMenu = () => setMenuOpen(false);

  return (
    <header className={`navbar${scrolled ? ' navbar--scrolled' : ''}`} role="banner">
      <div className="navbar__inner container">

        {/* ── Brand ── */}
        <Link to="/" className="navbar__brand" aria-label="HarvestHub home" onClick={closeMobileMenu}>
          <span className="navbar__logo-icon" aria-hidden="true">🌿</span>
          <span className="navbar__logo-text">HarvestHub</span>
        </Link>

        {/* ── Desktop Nav ── */}
        <nav className="navbar__nav" aria-label="Main navigation">
          {NAV_LINKS.map(({ to, label, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              className={({ isActive }) =>
                `navbar__link${isActive ? ' navbar__link--active' : ''}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* ── Actions ── */}
        <div className="navbar__actions">
          {/* Cart */}
          <Link
            to="/cart"
            className="navbar__cart-btn"
            aria-label={`Shopping cart, ${cartCount} item${cartCount !== 1 ? 's' : ''}`}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="9"  cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {cartCount > 0 && (
              <span className="navbar__cart-badge" aria-live="polite">{cartCount}</span>
            )}
          </Link>

          {/* Auth — Desktop */}
          {user ? (
            <div className="navbar__profile" ref={profileRef}>
              <button
                className="navbar__avatar-btn"
                onClick={() => setProfileOpen((o) => !o)}
                aria-expanded={profileOpen}
                aria-haspopup="true"
                aria-label="Account menu"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="navbar__avatar"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                <span className="navbar__avatar-name">{user.name.split(' ')[0]}</span>
                <svg className={`navbar__chevron${profileOpen ? ' rotated' : ''}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {profileOpen && (
                <div className="navbar__dropdown animate-slide-down" role="menu">
                  <div className="navbar__dropdown-header">
                    <p className="navbar__dropdown-name">{user.name}</p>
                    <p className="navbar__dropdown-email">{user.email}</p>
                  </div>
                  <hr className="navbar__dropdown-divider" />
                  <button
                    className="navbar__dropdown-item navbar__dropdown-item--danger"
                    onClick={handleLogout}
                    role="menuitem"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="navbar__auth-links">
              <Link to="/login" className="btn btn-ghost btn-sm">Sign in</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Join free</Link>
            </div>
          )}

          {/* ── Hamburger ── */}
          <button
            className="navbar__hamburger"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            <span className={`navbar__hamburger-bar${menuOpen ? ' open' : ''}`} />
            <span className={`navbar__hamburger-bar${menuOpen ? ' open' : ''}`} />
            <span className={`navbar__hamburger-bar${menuOpen ? ' open' : ''}`} />
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      <div
        id="mobile-menu"
        className={`navbar__mobile${menuOpen ? ' navbar__mobile--open' : ''}`}
        aria-hidden={!menuOpen}
      >
        <nav aria-label="Mobile navigation">
          {NAV_LINKS.map(({ to, label, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              className={({ isActive }) =>
                `navbar__mobile-link${isActive ? ' navbar__mobile-link--active' : ''}`
              }
              onClick={closeMobileMenu}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="navbar__mobile-divider" />

        {user ? (
          <div className="navbar__mobile-user">
            <p className="navbar__mobile-user-name">{user.name}</p>
            <p className="navbar__mobile-user-email">{user.email}</p>
            <button className="btn btn-outline btn-sm" onClick={() => { handleLogout(); closeMobileMenu(); }}>
              Sign out
            </button>
          </div>
        ) : (
          <div className="navbar__mobile-auth">
            <Link to="/login"    className="btn btn-outline btn-full" onClick={closeMobileMenu}>Sign in</Link>
            <Link to="/register" className="btn btn-primary btn-full" onClick={closeMobileMenu}>Join free</Link>
          </div>
        )}
      </div>
    </header>
  );
}
