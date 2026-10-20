/**
 * StarRating Component
 * --------------------
 * Props:
 *   rating      {number}  — e.g. 4.8   (the score out of 5)
 *   reviewCount {number}  — e.g. 142   (total reviews, optional)
 *   size        {string}  — 'sm' | 'md' (controls icon size)
 *
 * 🎓 REACT CONCEPT — Props
 * Props are how parent components pass data INTO a child component.
 * Think of them like function arguments.
 * The parent writes:  <StarRating rating={4.8} reviewCount={142} />
 * This component receives:  function StarRating({ rating, reviewCount })
 *
 * 🎓 REACT CONCEPT — Default parameter values
 * We write { size = 'md' } to give `size` a fallback value.
 * If the parent doesn't pass a `size` prop, it defaults to 'md'.
 */

import './StarRating.css';

export default function StarRating({ rating, reviewCount, size = 'md' }) {
  // Math.round(rating * 2) / 2  → rounds to nearest 0.5
  // e.g. 4.76 → 4.5,  4.82 → 5.0
  const rounded = Math.round(rating * 2) / 2;

  return (
    <div className={`star-rating star-rating--${size}`} aria-label={`${rating} out of 5 stars`}>
      {/* ── Stars ──
          Array.from({ length: 5 }, ...) creates [0,1,2,3,4]
          For each index `i`, we render one star icon.
          We determine if it's full, half, or empty based on the rating.
      */}
      <div className="star-rating__stars" aria-hidden="true">
        {Array.from({ length: 5 }, (_, i) => {
          const value = i + 1; // star position (1 through 5)

          if (value <= rounded) {
            // Full star — rating is at or above this position
            return <span key={i} className="star star--full">★</span>;
          } else if (value - 0.5 === rounded) {
            // Half star — rating is exactly 0.5 below this position
            return <span key={i} className="star star--half">★</span>;
          } else {
            // Empty star
            return <span key={i} className="star star--empty">★</span>;
          }
        })}
      </div>

      {/* Rating number */}
      <span className="star-rating__score">{rating.toFixed(1)}</span>

      {/* Review count — only shows if reviewCount was passed as a prop */}
      {reviewCount !== undefined && (
        <span className="star-rating__count">({reviewCount})</span>
      )}
    </div>
  );
}

