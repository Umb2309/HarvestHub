import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container section text-center" style={{ paddingBlock: '6rem' }}>
      <p style={{ fontSize: '5rem', lineHeight: 1 }}>🌿</p>
      <h1 style={{ fontSize: 'clamp(1.875rem, 5vw, 3rem)', marginBlock: '1rem 0.75rem' }}>
        Page Not Found
      </h1>
      <p className="text-secondary" style={{ marginBottom: '2rem' }}>
        Looks like this field is empty. Let's get you back to the harvest.
      </p>
      <Link to="/" className="btn btn-primary btn-lg">Back to Home</Link>
    </div>
  );
}
