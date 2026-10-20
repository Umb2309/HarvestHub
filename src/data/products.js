/**
 * Mock product data (Nigeria, prices in Naira)
 * ---------------------------------------------
 * Shaped like a GET /api/products response so it can be swapped for a real API later.
 * Prices are stored as whole Naira numbers (no kobo) — format them with naira() from utils/format.js.
 *
 * `image` is an Unsplash URL. Products without a reliable photo use null, and
 * <SmartImage> shows a styled placeholder with the category mark instead.
 */

import { getFarmerById } from './farmers';

const photo = (id) => `https://images.unsplash.com/${id}?w=600&h=450&fit=crop`;

export const CATEGORIES = [
  { id: 'all',        label: 'All produce'          },
  { id: 'vegetables', label: 'Vegetables & peppers' },
  { id: 'tubers',     label: 'Tubers & grains'      },
  { id: 'greens',     label: 'Leafy greens'         },
  { id: 'fruits',     label: 'Fruits'               },
  { id: 'poultry',    label: 'Eggs & poultry'       },
  { id: 'pantry',     label: 'Oils, honey & spices' },
];

/** Emoji used only on image placeholders when a photo is missing */
export const CATEGORY_MARK = {
  vegetables: '🍅', tubers: '🍠', greens: '🥬', fruits: '🍌', poultry: '🥚', pantry: '🍯',
};

const RAW_PRODUCTS = [
  {
    id: 'p001', name: 'Fresh Tomatoes (Roma)', category: 'vegetables',
    price: 9500, unit: 'per paint bucket (~4kg)', farmerId: 'f001',
    description: 'Firm Roma tomatoes picked half-ripe in Kura and packed in ventilated crates, so they arrive red and whole rather than squashed. Good for stew base and for keeping a few days on the counter.',
    image: photo('photo-1592924357228-91a4daadcfea'),
    badge: 'This week\'s harvest', rating: 4.8, reviewCount: 142, inStock: true, featured: true,
  },
  {
    id: 'p002', name: 'Tatashe (Red Bell Pepper)', category: 'vegetables',
    price: 4200, unit: 'per kg', farmerId: 'f001',
    description: 'Sweet, thick-walled tatashe for stew colour without too much heat. Blend with tomatoes and rodo for a classic Nigerian stew base.',
    image: null,
    badge: null, rating: 4.7, reviewCount: 88, inStock: true, featured: false,
  },
  {
    id: 'p003', name: 'Ata Rodo (Scotch Bonnet)', category: 'vegetables',
    price: 5200, unit: 'per kg', farmerId: 'f001',
    description: 'Hot, fragrant scotch bonnet peppers. A kilo goes a long way — most families freeze what they don\'t use in the first week.',
    image: null,
    badge: 'Very hot', rating: 4.9, reviewCount: 117, inStock: true, featured: false,
  },
  {
    id: 'p004', name: 'Red Onions', category: 'vegetables',
    price: 6000, unit: 'per 3kg bag', farmerId: 'f001',
    description: 'Dry-cured red onions from the Kano River basin. Stored properly in a cool, airy place they keep for weeks.',
    image: photo('photo-1618512496248-a07fe83aa8cb'),
    badge: null, rating: 4.6, reviewCount: 59, inStock: true, featured: false,
  },
  {
    id: 'p005', name: 'Benue Yam (Medium Tubers)', category: 'tubers',
    price: 5000, unit: 'per tuber (~3kg)', farmerId: 'f002',
    description: 'New-season yam from Zaki-Biam. Cooks soft and pounds smooth. Each tuber is checked for rot at the barn before it is bagged.',
    image: null,
    badge: 'New yam', rating: 4.9, reviewCount: 203, inStock: true, featured: true,
  },
  {
    id: 'p006', name: 'White Garri', category: 'tubers',
    price: 7500, unit: 'per 5kg bag', farmerId: 'f002',
    description: 'Fine, well-fried white garri processed in small batches. Crisp for drinking, swells well for eba. Sieved twice to remove fibre.',
    image: null,
    badge: null, rating: 4.7, reviewCount: 91, inStock: true, featured: false,
  },
  {
    id: 'p007', name: 'Abakaliki Rice (Destoned)', category: 'tubers',
    price: 18500, unit: 'per 10kg bag', farmerId: 'f005',
    description: 'Long-grain parboiled local rice, destoned and colour-sorted. Milling date is printed on every bag. Rinse once and cook like any long-grain rice.',
    image: photo('photo-1586201375761-83865001e31c'),
    badge: 'Stone-free', rating: 4.9, reviewCount: 241, inStock: true, featured: true,
  },
  {
    id: 'p008', name: 'Irish Potatoes', category: 'tubers',
    price: 9000, unit: 'per 5kg bag', farmerId: 'f004',
    description: 'Cured Plateau potatoes, sorted to medium size. Great for chips, porridge or potato and egg sauce.',
    image: photo('photo-1518977676601-b53f82aba655'),
    badge: null, rating: 4.8, reviewCount: 96, inStock: true, featured: true,
  },
  {
    id: 'p009', name: 'Crate of Eggs (30)', category: 'poultry',
    price: 6200, unit: 'per crate', farmerId: 'f003',
    description: 'Thirty fresh eggs collected the day before dispatch. Medium to large, brown shells. Packed in a firm tray and sealed box so they arrive unbroken.',
    image: photo('photo-1506976785307-8732e854ad03'),
    badge: 'Laid this week', rating: 4.7, reviewCount: 302, inStock: true, featured: true,
  },
  {
    id: 'p010', name: 'Dressed Broiler Chicken', category: 'poultry',
    price: 13500, unit: 'per bird (~1.8kg)', farmerId: 'f003',
    description: 'Whole broiler, slaughtered and cleaned to order on Thursdays and delivered chilled. Ask in the order note if you want it cut into pieces.',
    image: null,
    badge: 'Thursdays only', rating: 4.6, reviewCount: 74, inStock: true, featured: false,
  },
  {
    id: 'p011', name: 'Jos Carrots', category: 'vegetables',
    price: 2800, unit: 'per kg', farmerId: 'f004',
    description: 'Sweet, crunchy carrots from the Plateau highlands. Washed and trimmed before packing.',
    image: photo('photo-1598170845058-32b9d6a5da37'),
    badge: null, rating: 4.5, reviewCount: 48, inStock: true, featured: false,
  },
  {
    id: 'p012', name: 'Cabbage', category: 'vegetables',
    price: 1800, unit: 'per head (~1.5kg)', farmerId: 'f004',
    description: 'Tight, heavy heads of green cabbage for coleslaw, salad or stir-fry. Outer leaves left on to protect them in transit.',
    image: photo('photo-1594282486552-05b4d80fbb9f'),
    badge: null, rating: 4.4, reviewCount: 37, inStock: true, featured: false,
  },
  {
    id: 'p013', name: 'Ugu (Fluted Pumpkin Leaves)', category: 'greens',
    price: 1200, unit: 'per bunch', farmerId: 'f009',
    description: 'Tender ugu leaves cut the morning of delivery. Enough for one pot of edikang ikong or egusi for a family of four.',
    image: photo('photo-1576045057995-568f588f82fb'),
    badge: 'Same-day in Lagos', rating: 4.8, reviewCount: 129, inStock: true, featured: false,
  },
  {
    id: 'p014', name: 'Waterleaf', category: 'greens',
    price: 700, unit: 'per bunch', farmerId: 'f009',
    description: 'Fresh waterleaf, usually paired with ugu in soups. Back in stock after the next cut.',
    image: null,
    badge: null, rating: 4.6, reviewCount: 52, inStock: false, featured: false,
  },
  {
    id: 'p015', name: 'Unripe Plantain', category: 'fruits',
    price: 12000, unit: 'per bunch (14–18 fingers)', farmerId: 'f006',
    description: 'Big, green plantain fingers. Leave a few days to ripen for dodo, or cook green for porridge and chips.',
    image: null,
    badge: null, rating: 4.7, reviewCount: 81, inStock: true, featured: false,
  },
  {
    id: 'p016', name: 'Sugarloaf Pineapple', category: 'fruits',
    price: 2500, unit: 'per fruit', farmerId: 'f006',
    description: 'Low-acid sugarloaf pineapples, sweet right to the core. Harvested close to ripe.',
    image: photo('photo-1550258987-190a2d41a8ba'),
    badge: null, rating: 4.8, reviewCount: 66, inStock: true, featured: false,
  },
  {
    id: 'p017', name: 'Red Palm Oil', category: 'pantry',
    price: 14000, unit: 'per 5L keg', farmerId: 'f006',
    description: 'Hand-processed palm oil with nothing added. It sets thick in cold weather — that\'s normal and a sign it hasn\'t been mixed.',
    image: null,
    badge: 'Nothing added', rating: 4.8, reviewCount: 112, inStock: true, featured: false,
  },
  {
    id: 'p018', name: 'Raw Honey (Iseyin)', category: 'pantry',
    price: 9500, unit: 'per 1L bottle', farmerId: 'f007',
    description: 'Strained, unheated honey from savannah woodland hives. It may crystallise over time; stand the bottle in warm water to loosen it.',
    image: photo('photo-1558642452-9d2a7deb7f62'),
    badge: 'Raw', rating: 5.0, reviewCount: 88, inStock: true, featured: true,
  },
  {
    id: 'p019', name: 'Fresh Ginger', category: 'pantry',
    price: 3500, unit: 'per kg', farmerId: 'f008',
    description: 'Kafanchan ginger, pungent and fibrous-free when young. Use in zobo, pepper soup and tea.',
    image: photo('photo-1615485500704-8e990f9900f7'),
    badge: null, rating: 4.7, reviewCount: 64, inStock: true, featured: false,
  },
];

/** Per-product placeholder marks (only shown when a photo is missing) */
const MARKS = {
  p001: '🍅', p002: '🫑', p003: '🌶️', p004: '🧅', p005: '🍠', p006: '🥣', p007: '🍚', p008: '🥔',
  p009: '🥚', p010: '🍗', p011: '🥕', p012: '🥬', p013: '🥬', p014: '🌿', p015: '🍌', p016: '🍍',
  p017: '🫙', p018: '🍯', p019: '🫚',
};

// Denormalise farmer name and location onto each product (an API would usually do this join).
export const PRODUCTS = RAW_PRODUCTS.map((p) => {
  const f = getFarmerById(p.farmerId);
  return { ...p, mark: MARKS[p.id] ?? CATEGORY_MARK[p.category], farmerName: f?.farm ?? 'Unknown farm', farmerLocation: f?.location ?? '' };
});

/** Returns only products marked as featured */
export const getFeaturedProducts = () => PRODUCTS.filter((p) => p.featured);

/** Returns products filtered by category (or all if 'all') */
export const getProductsByCategory = (category) =>
  category === 'all' ? PRODUCTS : PRODUCTS.filter((p) => p.category === category);

/** Looks up a single product by id */
export const getProductById = (id) => PRODUCTS.find((p) => p.id === id) ?? null;

/** Human label for a category id */
export const getCategoryLabel = (id) => CATEGORIES.find((c) => c.id === id)?.label ?? id;
