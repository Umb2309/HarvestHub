/**
 * Formatting helpers
 * -------------------
 * naira(9500)        → "₦9,500"
 * naira(9500.5, 2)   → "₦9,500.50"
 *
 * We build the string ourselves instead of using Intl currency style, because
 * some browsers print "NGN 9,500" for en-NG and we want the ₦ sign everywhere.
 */
export function naira(amount, decimals = 0) {
  const n = Number(amount) || 0;
  return '₦' + n.toLocaleString('en-NG', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/** "Hajiya Aisha Bello" → "AB" (skips titles like Hajiya, Alhaji, Chief, Dr, Mrs) */
const TITLES = new Set(['hajiya', 'alhaji', 'chief', 'dr', 'dr.', 'mrs', 'mrs.', 'mr', 'mr.', 'pastor', 'engr']);
export function initials(name = '') {
  const parts = name.split(/\s+/).filter((w) => w && !TITLES.has(w.toLowerCase()));
  return ((parts[0]?.[0] ?? '') + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
}

/** Normalises a Nigerian phone number. Accepts 0803…, 803…, +234803…, 234803… */
export function normaliseNgPhone(raw = '') {
  const digits = raw.replace(/\D/g, '');
  if (/^0[789][01]\d{8}$/.test(digits)) return '+234' + digits.slice(1);
  if (/^[789][01]\d{8}$/.test(digits)) return '+234' + digits;
  if (/^234[789][01]\d{8}$/.test(digits)) return '+' + digits;
  return null;
}

/** "Thu, 22 Oct" style date */
export function shortDate(date) {
  return date.toLocaleDateString('en-NG', { weekday: 'short', day: 'numeric', month: 'short' });
}
