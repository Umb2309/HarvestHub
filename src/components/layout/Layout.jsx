import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import './Layout.css';

// Pages that hide the footer so the form gets full attention
const NO_FOOTER_PATHS = ['/login', '/register', '/checkout'];

export default function Layout() {
  const { pathname, hash } = useLocation();
  const showFooter = !NO_FOOTER_PATHS.includes(pathname);

  // React Router doesn't scroll to #anchors by itself. This runs after the page's
  // own effects, so links like /contact#faq land on the right section.
  useEffect(() => {
    if (!hash) return;
    const t = setTimeout(() => {
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
    return () => clearTimeout(t);
  }, [pathname, hash]);

  return (
    <div className="layout">
      <a href="#main-content" className="skip-link">Skip to content</a>
      <Navbar />
      <main className="layout__main" id="main-content" tabIndex={-1}>
        {/* Keying on pathname replays the fade-in animation on every route change */}
        <div className="page-wrapper" key={pathname}>
          <Outlet />
        </div>
      </main>
      {showFooter && <Footer />}
    </div>
  );
}
