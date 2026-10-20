/**
 * Logo — HarvestHub wordmark with a leaf mark.
 * `tone="light"` is for dark backgrounds (footer, auth panels).
 */
import { Link } from 'react-router-dom';
import Icon from './Icon';
import './Logo.css';

export default function Logo({ tone = 'dark', onClick, className = '' }) {
  return (
    <Link to="/" className={`logo logo--${tone} ${className}`} aria-label="HarvestHub home" onClick={onClick}>
      <span className="logo__mark" aria-hidden="true">
        <Icon name="leaf" size={18} strokeWidth={2.2} />
      </span>
      <span className="logo__text">HarvestHub</span>
    </Link>
  );
}
