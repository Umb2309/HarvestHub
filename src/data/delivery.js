/**
 * Delivery rules (mock)
 * ----------------------
 * One place for every delivery number, so Cart, Checkout and the
 * marketing copy can never disagree with each other.
 */

export const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT (Abuja)', 'Gombe',
  'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos',
  'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto',
  'Taraba', 'Yobe', 'Zamfara',
];

/** Orders at or above this subtotal ship free */
export const FREE_DELIVERY_THRESHOLD = 60000;

const ZONES = [
  { states: ['Lagos'],                                fee: 2500, days: 1, label: 'Lagos' },
  { states: ['FCT (Abuja)'],                          fee: 3000, days: 2, label: 'Abuja' },
  { states: ['Ogun', 'Oyo', 'Osun', 'Ondo', 'Ekiti'], fee: 3500, days: 2, label: 'South-West' },
  { states: ['Rivers', 'Enugu', 'Kano', 'Kaduna'],    fee: 4000, days: 3, label: 'Major cities' },
];
const DEFAULT_ZONE = { fee: 5000, days: 4, label: 'Other states' };

/** The cheapest fee we charge anywhere — used for "from ₦2,500" copy */
export const LOWEST_DELIVERY_FEE = Math.min(...ZONES.map((z) => z.fee));

/** Returns { fee, days, label } for a state and order subtotal */
export function getDeliveryQuote(state, subtotal) {
  const zone = ZONES.find((z) => z.states.includes(state)) ?? DEFAULT_ZONE;
  return { ...zone, fee: subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : zone.fee };
}
