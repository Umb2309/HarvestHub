import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { NIGERIAN_STATES } from '../data/delivery';
import { normaliseNgPhone } from '../utils/format';
import AuthShell from '../components/layout/AuthShell';
import Icon from '../components/ui/Icon';

const ROLES = [
  { id: 'buyer',  icon: 'basket', title: 'I want to buy',  sub: 'Order fresh produce' },
  { id: 'farmer', icon: 'sprout', title: 'I want to sell', sub: 'List my harvest' },
];

export default function Register() {
  const { register, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // /register?role=farmer preselects the farmer option
  const initialRole = new URLSearchParams(location.search).get('role') === 'farmer' ? 'farmer' : 'buyer';
  const from = location.state?.from?.pathname || '/';

  const [form, setForm] = useState({
    role: initialRole, name: '', email: '', phone: '', state: 'Lagos', farmName: '', password: '', agree: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => { window.scrollTo({ top: 0 }); }, []);
  useEffect(() => {
    if (user) navigate(from, { replace: true });
  }, [user, from, navigate]);

  const isFarmer = form.role === 'farmer';

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors((x) => ({ ...x, [name]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (form.name.trim().split(/\s+/).length < 2) e.name = 'Enter your first and last name.';
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) e.email = 'Enter a valid email address.';
    if (!normaliseNgPhone(form.phone)) e.phone = 'Enter a Nigerian mobile number, e.g. 0803 123 4567.';
    if (isFarmer && !form.farmName.trim()) e.farmName = 'What is your farm called?';
    if (form.password.length < 8) e.password = 'Use at least 8 characters.';
    if (!form.agree) e.agree = 'Please accept the terms to continue.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    if (!validate()) return;

    setIsSubmitting(true);
    const result = await register({
      name: form.name,
      email: form.email,
      phone: normaliseNgPhone(form.phone),
      state: form.state,
      role: form.role,
      password: form.password,
    });
    setIsSubmitting(false);
    if (!result.success) setAuthError(result.error);
  };

  const field = (name) => `input${errors[name] ? ' input--error' : ''}`;

  return (
    <AuthShell farmerId={isFarmer ? 'f003' : 'f009'}>
      <h1 className="auth__title">Create your account</h1>
      <p className="auth__subtitle">
        {isFarmer
          ? 'Tell us about you and your farm. Our team will call to arrange a visit.'
          : 'Save your address, check out faster and get 10% off your first order.'}
      </p>

      {authError && (
        <div className="alert alert--error" role="alert">
          <Icon name="x" size={18} />
          <p>{authError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <span className="label" id="role-label">I'm joining to…</span>
          <div className="choice-grid" role="radiogroup" aria-labelledby="role-label">
            {ROLES.map((r) => (
              <label key={r.id} className="choice">
                <input type="radio" name="role" value={r.id} checked={form.role === r.id} onChange={handleChange} />
                <Icon name={r.icon} size={20} className="choice__icon" />
                <span>
                  <span className="choice__title">{r.title}</span>
                  <span className="choice__sub">{r.sub}</span>
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="r-name" className="label">Full name</label>
          <input id="r-name" name="name" className={field('name')} value={form.name} onChange={handleChange}
            autoComplete="name" placeholder="Adaeze Nwosu" />
          {errors.name && <p className="form-error-msg">{errors.name}</p>}
        </div>

        {isFarmer && (
          <div className="form-group">
            <label htmlFor="r-farm" className="label">Farm name</label>
            <input id="r-farm" name="farmName" className={field('farmName')} value={form.farmName} onChange={handleChange}
              placeholder="e.g. Nwosu Family Farms" />
            {errors.farmName && <p className="form-error-msg">{errors.farmName}</p>}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="r-email" className="label">Email</label>
          <input id="r-email" name="email" type="email" className={field('email')} value={form.email} onChange={handleChange}
            autoComplete="email" placeholder="you@example.com" />
          {errors.email && <p className="form-error-msg">{errors.email}</p>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="r-phone" className="label">Phone</label>
            <input id="r-phone" name="phone" type="tel" className={field('phone')} value={form.phone} onChange={handleChange}
              autoComplete="tel" placeholder="0803 123 4567" />
            {errors.phone && <p className="form-error-msg">{errors.phone}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="r-state" className="label">{isFarmer ? 'Farm location' : 'State'}</label>
            <select id="r-state" name="state" className="input" value={form.state} onChange={handleChange}>
              {NIGERIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="r-password" className="label">Password</label>
          <div className="auth__password">
            <input id="r-password" name="password" type={showPassword ? 'text' : 'password'}
              className={field('password')} value={form.password} onChange={handleChange} autoComplete="new-password" />
            <button type="button" className="auth__toggle" onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}>
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {errors.password ? <p className="form-error-msg">{errors.password}</p> : <p className="form-hint">At least 8 characters.</p>}
        </div>

        <div className="form-group">
          <label className="auth__terms">
            <input type="checkbox" name="agree" checked={form.agree} onChange={handleChange} />
            <span>I agree to HarvestHub's terms of service and privacy policy.</span>
          </label>
          {errors.agree && <p className="form-error-msg">{errors.agree}</p>}
        </div>

        <button type="submit" className="btn btn-primary btn-lg btn-block auth__submit" disabled={isSubmitting}>
          {isSubmitting
            ? <span className="spinner-wrap"><span className="spinner" /> Creating account…</span>
            : isFarmer ? 'Apply to sell' : 'Create account'}
        </button>
      </form>

      <p className="auth__switch">
        Already have an account? <Link to="/login" state={location.state}>Sign in</Link>
      </p>
    </AuthShell>
  );
}
