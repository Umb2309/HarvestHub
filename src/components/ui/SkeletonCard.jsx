/**
 * SkeletonCard Component
 * -----------------------
 * A "shimmer" placeholder shown while products are loading.
 * Used on: Products page, Home page (future).
 *
 * 🎓 REACT CONCEPT — Rendering lists with Array.from
 * The PARENT decides how many skeletons to show by passing `count`.
 * e.g. <SkeletonGrid count={8} />
 * Array.from({ length: count }) creates an empty array of that length,
 * then .map() renders a <SkeletonCard> for each slot.
 *
 * This is a common pattern: create N placeholder items without real data.
 */
import './SkeletonCard.css';

export function SkeletonCard() {
  return (
    <div className="skeleton-card card" aria-hidden="true">
      {/* Image area shimmer */}
      <div className="skeleton-card__image skeleton" />

      {/* Body shimmer lines */}
      <div className="skeleton-card__body">
        <div className="skeleton skeleton-card__line skeleton-card__line--short" />
        <div className="skeleton skeleton-card__line skeleton-card__line--full"  />
        <div className="skeleton skeleton-card__line skeleton-card__line--mid"   />
        <div className="skeleton skeleton-card__line skeleton-card__line--short" />
      </div>

      {/* Footer shimmer */}
      <div className="skeleton-card__footer">
        <div className="skeleton skeleton-card__price" />
        <div className="skeleton skeleton-card__btn"   />
      </div>
    </div>
  );
}

/** Renders N skeleton cards in a grid */
export function SkeletonGrid({ count = 8 }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i} />
      ))}
    </>
  );
}
