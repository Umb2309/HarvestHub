/**
 * AuthShell — shared two-panel layout for Login and Register.
 * Left: brand panel with a farmer's quote. Right: the form (children).
 */
import Logo from '../ui/Logo';
import SmartImage from '../ui/SmartImage';
import { getFarmerById } from '../../data/farmers';
import { initials } from '../../utils/format';
import './AuthShell.css';

export default function AuthShell({ farmerId = 'f003', children }) {
  const farmer = getFarmerById(farmerId);

  return (
    <div className="auth">
      <aside className="auth__panel" aria-hidden="true">
        <Logo tone="light" />
        <figure className="auth__quote">
          <blockquote>{farmer.quote}</blockquote>
          <figcaption>
            <SmartImage src={farmer.avatar} alt="" className="auth__quote-avatar" variant="avatar" fallback={initials(farmer.name)} />
            <span>
              <strong>{farmer.name}</strong>
              <span>{farmer.farm}, {farmer.location.split(',').pop().trim()}</span>
            </span>
          </figcaption>
        </figure>
      </aside>

      <div className="auth__main">
        <div className="auth__form-wrap">{children}</div>
      </div>
    </div>
  );
}
