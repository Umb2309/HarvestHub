import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FREE_DELIVERY_THRESHOLD, LOWEST_DELIVERY_FEE } from '../data/delivery';
import { naira } from '../utils/format';
import Icon from '../components/ui/Icon';
import './Contact.css';

const TOPICS = [
  { value: 'order',    label: 'A problem with my order' },
  { value: 'delivery', label: 'Delivery question' },
  { value: 'selling',  label: 'I want to sell on HarvestHub' },
  { value: 'bulk',     label: 'Bulk / restaurant orders' },
  { value: 'other',    label: 'Something else' },
];

const CHANNELS = [
  { icon: 'chat',  title: 'WhatsApp',  value: '+234 802 555 0147', href: 'https://wa.me/2348025550147', note: 'Fastest — usually under 15 minutes' },
  { icon: 'phone', title: 'Call us',   value: '+234 802 555 0147', href: 'tel:+2348025550147',          note: 'Mon–Sat, 8am – 6pm' },
  { icon: 'mail',  title: 'Email',     value: 'hello@harvesthub.ng', href: 'mailto:hello@harvesthub.ng', note: 'We reply within one working day' },
];

const FAQS = [
  {
    q: 'How much is delivery?',
    a: `From ${naira(LOWEST_DELIVERY_FEE)} in Lagos, and a little more for other states depending on distance. Orders over ${naira(FREE_DELIVERY_THRESHOLD)} ship free anywhere we deliver.`,
  },
  {
    q: 'How fresh is the produce, really?',
    a: 'Farmers harvest against confirmed orders. Lagos greens and eggs usually arrive the day after they are picked; produce from the north takes 2–4 days in ventilated crates.',
  },
  {
    q: 'Can I pay on delivery?',
    a: 'Yes, in Lagos and Abuja, by cash or POS. Everywhere else you can pay by card or bank transfer at checkout.',
  },
  {
    q: 'What if something arrives damaged?',
    a: 'Send us a photo on WhatsApp within 24 hours of delivery and we will refund or replace the item — no long back-and-forth.',
  },
  {
    q: 'I\'m a farmer. How do I start selling?',
    a: 'Create a farmer account, and someone from our team will call you to arrange a farm visit. There is no listing fee; we take 10% only when you sell.',
  },
];

export default function Contact() {
  useEffect(() => { window.scrollTo({ top: 0 }); }, []);

  const [form, setForm] = useState({ name: '', contact: '', topic: 'order', orderNumber: '', message: '' });
  const [errors, setErrors] = useState({});
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Tell us your name.';
    const c = form.contact.trim();
    const isEmail = /^\S+@\S+\.\S+$/.test(c);
    const isPhone = c.replace(/\D/g, '').length >= 10;
    if (!c) e.contact = 'We need an email or phone number to reply.';
    else if (!isEmail && !isPhone) e.contact = 'Enter a valid email or phone number.';
    if (form.message.trim().length < 10) e.message = 'Give us a little more detail (at least 10 characters).';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSending(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsSending(false);
    setSent(true);
  };

  const reset = () => {
    setForm({ name: '', contact: '', topic: 'order', orderNumber: '', message: '' });
    setSent(false);
  };

  return (
    <div className="contact-page">
      <header className="page-header">
        <div className="container">
          <nav className="breadcrumb breadcrumb--light" aria-label="Breadcrumb">
            <Link to="/" className="breadcrumb__link">Home</Link>
            <span className="breadcrumb__sep" aria-hidden="true">›</span>
            <span className="breadcrumb__current" aria-current="page">Contact</span>
          </nav>
          <h1 className="page-header__title">Talk to us</h1>
          <p className="page-header__subtitle">
            Order issue, delivery question or want to sell your harvest — a real person reads every message.
          </p>
        </div>
      </header>

      <div className="container contact-channels">
        {CHANNELS.map(({ icon, title, value, href, note }) => (
          <a key={title} href={href} className="contact-channel" target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
            <span className="contact-channel__icon"><Icon name={icon} size={22} /></span>
            <span>
              <span className="contact-channel__title">{title}</span>
              <span className="contact-channel__value">{value}</span>
              <span className="contact-channel__note">{note}</span>
            </span>
          </a>
        ))}
      </div>

      <div className="container section contact-layout">
        <section className="contact-form card" aria-labelledby="contact-form-heading">
          <h2 id="contact-form-heading" className="contact-section-title">Send a message</h2>

          {sent ? (
            <div className="contact-sent" role="status">
              <span className="contact-sent__icon"><Icon name="check" size={28} strokeWidth={2.5} /></span>
              <h3>Message received</h3>
              <p>Thanks, {form.name.split(' ')[0]}. We'll get back to you at <strong>{form.contact}</strong> within one working day.</p>
              <button className="btn btn-outline" onClick={reset}>Send another message</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="c-name" className="label">Your name</label>
                  <input id="c-name" name="name" className={`input${errors.name ? ' input--error' : ''}`}
                    value={form.name} onChange={handleChange} placeholder="Emeka Obi" autoComplete="name" />
                  {errors.name && <p className="form-error-msg">{errors.name}</p>}
                </div>
                <div className="form-group">
                  <label htmlFor="c-contact" className="label">Email or phone</label>
                  <input id="c-contact" name="contact" className={`input${errors.contact ? ' input--error' : ''}`}
                    value={form.contact} onChange={handleChange} placeholder="you@example.com or 0803…" />
                  {errors.contact && <p className="form-error-msg">{errors.contact}</p>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="c-topic" className="label">What's it about?</label>
                  <select id="c-topic" name="topic" className="input" value={form.topic} onChange={handleChange}>
                    {TOPICS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                {form.topic === 'order' && (
                  <div className="form-group">
                    <label htmlFor="c-order" className="label">Order number <span className="label__optional">(optional)</span></label>
                    <input id="c-order" name="orderNumber" className="input" value={form.orderNumber}
                      onChange={handleChange} placeholder="HH-123456" />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="c-message" className="label">Message</label>
                <textarea id="c-message" name="message" rows={6}
                  className={`input textarea${errors.message ? ' input--error' : ''}`}
                  value={form.message} onChange={handleChange}
                  placeholder={form.topic === 'selling'
                    ? 'Tell us what you grow, where your farm is and roughly how much you harvest per season.'
                    : 'How can we help?'} />
                {errors.message && <p className="form-error-msg">{errors.message}</p>}
              </div>

              <button type="submit" className="btn btn-primary btn-lg" disabled={isSending}>
                {isSending ? <span className="spinner-wrap"><span className="spinner" /> Sending…</span> : 'Send message'}
              </button>
            </form>
          )}
        </section>

        <aside className="contact-aside">
          <div className="contact-office card">
            <h3 className="contact-office__title">Lagos office & pickup point</h3>
            <p className="contact-office__address">
              <Icon name="pin" size={16} />
              <span>14 Adeola Odeku Street,<br />Victoria Island, Lagos</span>
            </p>
            <p className="contact-office__hours">
              <Icon name="clock" size={16} />
              <span>Pickups: Tue, Thu & Sat, 10am – 4pm</span>
            </p>
            <p className="form-hint">Sample address for this demo.</p>
          </div>
        </aside>
      </div>

      <section id="faq" className="container contact-faq" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="contact-section-title">Common questions</h2>
        <div className="contact-faq__list">
          {FAQS.map(({ q, a }) => (
            <details key={q} className="contact-faq__item">
              <summary>
                {q}
                <Icon name="chevronDown" size={18} className="contact-faq__chevron" />
              </summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
