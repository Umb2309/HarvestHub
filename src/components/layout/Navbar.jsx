import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import Logo from '../ui/Logo';
import Icon from '../ui/Icon';
import SmartImage from '../ui/SmartImage';
import { initials } from '../../utils/format';
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
  const { pathname }          = useLocation();

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

  // Close menus whenever the route changes
  useEffect(() => {
    setMenuOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  // Stop the page behind the mobile menu from scrolling
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  // Close mobile menu when resizing up to desktop
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
        <Logo onClick={closeMobileMenu} />

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
            <Icon name="cart" size={22} />
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
                <SmartImage
                  src={user.avatar}
                  alt=""
                  className="navbar__avatar"
                  variant="avatar"
                  fallback={initials(user.name)}
                />
                <span className="navbar__avatar-name">{user.name.split(' ')[0]}</span>
                <Icon name="chevronDown" size={14} strokeWidth={2.5} className={`navbar__chevron${profileOpen ? ' rotated' : ''}`} />
              </button>

              {profileOpen && (
                <div className="navbar__dropdown animate-slide-down" role="menu">
                  <div className="navbar__dropdown-header">
                    <p className="navbar__dropdown-name">{user.name}</p>
                    <p className="navbar__dropdown-email">{user.email}</p>
                  </div>
                  <hr className="navbar__dropdown-divider" />
                  <Link to="/cart" className="navbar__dropdown-item" role="menuitem">
                    <Icon name="cart" size={16} />
                    My cart {cartCount > 0 && `(${cartCount})`}
                  </Link>
                  <button
                    className="navbar__dropdown-item navbar__dropdown-item--danger"
                    onClick={handleLogout}
                    role="menuitem"
                  >
                    <Icon name="logout" size={16} />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="navbar__auth-links">
              <Link to="/login" className="btn btn-ghost btn-sm">Sign in</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Create account</Link>
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
            <Link to="/register" className="btn btn-primary btn-full" onClick={closeMobileMenu}>Create account</Link>
          </div>
        )}
      </div>
    </header>
  );
}

