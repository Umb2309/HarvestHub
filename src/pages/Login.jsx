import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth, DEMO_ACCOUNT } from '../contexts/AuthContext';
import AuthShell from '../components/layout/AuthShell';
import Icon from '../components/ui/Icon';

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Where to go after signing in (e.g. back to checkout)
  const from = location.state?.from?.pathname || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => { window.scrollTo({ top: 0 }); }, []);

  // Already signed in? Skip this page.
  useEffect(() => {
    if (user) navigate(from, { replace: true });
  }, [user, from, navigate]);

  const validate = () => {
    const e = {};
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) e.email = 'Enter the email you signed up with.';
    if (!password) e.password = 'Enter your password.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    if (!validate()) return;

    setIsSubmitting(true);
    const result = await login({ email, password });
    setIsSubmitting(false);

    if (!result.success) setAuthError(result.error);
    // On success, the `user` effect above redirects
  };

  const fillDemo = () => {
    setEmail(DEMO_ACCOUNT.email);
    setPassword(DEMO_ACCOUNT.password);
    setErrors({});
    setAuthError('');
  };

  return (
    <AuthShell farmerId="f001">
      <h1 className="auth__title">Welcome back</h1>
      <p className="auth__subtitle">Sign in to check out faster and track your orders.</p>

      {authError && (
        <div className="alert alert--error" role="alert">
          <Icon name="x" size={18} />
          <p>{authError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="email" className="label">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className={`input${errors.email ? ' input--error' : ''}`}
            placeholder="you@example.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setErrors((x) => ({ ...x, email: undefined })); }}
          />
          {errors.email && <p className="form-error-msg">{errors.email}</p>}
        </div>

        <div className="form-group">
          <div className="auth__label-row">
            <label htmlFor="password" className="label">Password</label>
            <a href="mailto:hello@harvesthub.ng?subject=Password%20reset" className="auth__small-link">Forgot password?</a>
          </div>
          <div className="auth__password">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              className={`input${errors.password ? ' input--error' : ''}`}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setErrors((x) => ({ ...x, password: undefined })); }}
            />
            <button type="button" className="auth__toggle" onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}>
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {errors.password && <p className="form-error-msg">{errors.password}</p>}
        </div>

        <button type="submit" className="btn btn-primary btn-lg btn-block auth__submit" disabled={isSubmitting}>
          {isSubmitting ? <span className="spinner-wrap"><span className="spinner" /> Signing in…</span> : 'Sign in'}
        </button>
      </form>

      <div className="auth__demo">
        <span>Demo account: <code>{DEMO_ACCOUNT.email}</code> / <code>{DEMO_ACCOUNT.password}</code></span>
        <button type="button" className="btn btn-ghost btn-sm" onClick={fillDemo}>Fill in</button>
      </div>

      <p className="auth__switch">
        New to HarvestHub? <Link to="/register" state={location.state}>Create an account</Link>
      </p>
    </AuthShell>
  );
}
