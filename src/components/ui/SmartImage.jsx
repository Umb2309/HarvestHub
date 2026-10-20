/**
 * SmartImage
 * -----------
 * An <img> that swaps itself for a designed placeholder when the source is
 * missing or fails to load (mock URLs break, networks drop). The placeholder
 * takes the same className, so it fills exactly the same box.
 *
 * Props:
 *   src        {string|null}  image URL
 *   alt        {string}       alt text (also used as the placeholder's label)
 *   fallback   {node}         what to show inside the placeholder (initials, an emoji…)
 *   variant    {'tile'|'avatar'}  placeholder style
 *   ...rest    passed through to <img> (className, loading, etc.)
 */
import { useState } from 'react';
import './SmartImage.css';

export default function SmartImage({ src, alt = '', fallback = null, variant = 'tile', className = '', ...rest }) {
  const [failedSrc, setFailedSrc] = useState(null);
  const failed = !src || failedSrc === src;

  if (failed) {
    return (
      <div
        className={`smart-img smart-img--${variant} ${className}`}
        role={alt ? 'img' : undefined}
        aria-label={alt || undefined}
        aria-hidden={alt ? undefined : true}
      >
        <span className="smart-img__mark">{fallback}</span>
      </div>
    );
  }

  return <img src={src} alt={alt} className={className} onError={() => setFailedSrc(src)} {...rest} />;
}
