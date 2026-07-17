import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import './Layout.css';

// Pages that should NOT show the footer (full-screen auth pages, etc.)
const NO_FOOTER_PATHS = ['/login', '/register', '/checkout'];

export default function Layout() {
  const { pathname } = useLocation();
  const showFooter = !NO_FOOTER_PATHS.includes(pathname);

  return (
    <div className="layout">
      <Navbar />
      <main
        className="layout__main"
        id="main-content"
        role="main"
        tabIndex={-1}
      >
        {/* Key on pathname triggers fade-in animation on route change */}
        <div className="page-wrapper" key={pathname}>
          <Outlet />
        </div>
      </main>
      {showFooter && <Footer />}
    </div>
  );
}
