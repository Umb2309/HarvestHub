import { Link } from 'react-router-dom';
import Icon from '../components/ui/Icon';

export default function NotFound() {
  return (
    <div className="container section">
      <div className="empty-state" style={{ minHeight: '55vh', justifyContent: 'center' }}>
        <span className="empty-state__icon"><Icon name="sprout" size={28} /></span>
        <h1 style={{ fontSize: 'clamp(1.875rem, 5vw, 3rem)' }}>This page didn't grow</h1>
        <p>The link may be old, or the page has moved. Let's get you back to the market.</p>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link to="/products" className="btn btn-primary">Browse produce</Link>
          <Link to="/" className="btn btn-outline">Go home</Link>
        </div>
      </div>
    </div>
  );
}
