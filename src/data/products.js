/**
 * Mock product data
 * ---------------------
 * In a real app, this would come from an API: fetch('/api/products')
 * We structure it identically to what an API would return so the swap is easy.
 *
 * Unsplash images use URL parameters:
 *   ?w=600&h=400&fit=crop  → resizes + crops the image to exact dimensions
 */

export const CATEGORIES = [
  { id: 'all',        label: 'All Produce',   icon: '🛒' },
  { id: 'vegetables', label: 'Vegetables',     icon: '🥦' },
  { id: 'fruits',     label: 'Fruits',         icon: '🍓' },
  { id: 'herbs',      label: 'Herbs & Greens', icon: '🌿' },
  { id: 'dairy',      label: 'Dairy & Eggs',   icon: '🥚' },
  { id: 'grains',     label: 'Grains & Honey', icon: '🌾' },
];

export const PRODUCTS = [
  {
    id: 'p001',
    name: 'Organic Heirloom Tomatoes',
    category: 'vegetables',
    price: 4.99,
    unit: 'per lb',
    farmerId: 'f001',
    farmerName: 'Green Valley Farm',
    farmerLocation: 'Napa Valley, CA',
    description:
      'Vine-ripened heirloom tomatoes bursting with flavor. Hand-picked at peak ripeness, no pesticides, no shortcuts.',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&h=400&fit=crop',
    badge: 'Organic',
    rating: 4.8,
    reviewCount: 142,
    inStock: true,
    featured: true,
  },
  {
    id: 'p002',
    name: 'Fresh Strawberries',
    category: 'fruits',
    price: 5.49,
    unit: 'per pint',
    farmerId: 'f002',
    farmerName: 'Sunrise Berry Farm',
    farmerLocation: 'Watsonville, CA',
    description:
      'Sweet, sun-ripened strawberries picked fresh every morning. Perfect for snacking, smoothies, or desserts.',
    image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=600&h=400&fit=crop',
    badge: 'Seasonal',
    rating: 4.9,
    reviewCount: 218,
    inStock: true,
    featured: true,
  },
  {
    id: 'p003',
    name: 'Farm Fresh Eggs',
    category: 'dairy',
    price: 6.99,
    unit: 'per dozen',
    farmerId: 'f003',
    farmerName: 'Happy Hen Ranch',
    farmerLocation: 'Sonoma, CA',
    description:
      'Free-range eggs from pasture-raised hens. Rich, golden yolks and a flavor that store-bought can\'t match.',
    image: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=600&h=400&fit=crop',
    badge: 'Free Range',
    rating: 4.7,
    reviewCount: 95,
    inStock: true,
    featured: true,
  },
  {
    id: 'p004',
    name: 'Baby Spinach & Mixed Greens',
    category: 'herbs',
    price: 3.49,
    unit: 'per bag',
    farmerId: 'f001',
    farmerName: 'Green Valley Farm',
    farmerLocation: 'Napa Valley, CA',
    description:
      'Tender baby spinach and mixed salad greens, harvested young for maximum nutrition and delicate flavour.',
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&h=400&fit=crop',
    badge: 'Organic',
    rating: 4.6,
    reviewCount: 73,
    inStock: true,
    featured: false,
  },
  {
    id: 'p005',
    name: 'Raw Wildflower Honey',
    category: 'grains',
    price: 12.99,
    unit: 'per 12oz jar',
    farmerId: 'f004',
    farmerName: 'Golden Meadow Apiary',
    farmerLocation: 'Mendocino, CA',
    description:
      'Pure, unfiltered wildflower honey packed with natural enzymes, antioxidants, and complex floral notes.',
    image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=600&h=400&fit=crop',
    badge: 'Raw',
    rating: 5.0,
    reviewCount: 61,
    inStock: true,
    featured: true,
  },
  {
    id: 'p006',
    name: 'Rainbow Carrots',
    category: 'vegetables',
    price: 3.29,
    unit: 'per bunch',
    farmerId: 'f002',
    farmerName: 'Sunrise Berry Farm',
    farmerLocation: 'Watsonville, CA',
    description:
      'A stunning mix of purple, yellow, orange and white carrots — sweet, crunchy and packed with nutrients.',
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600&h=400&fit=crop',
    badge: null,
    rating: 4.5,
    reviewCount: 48,
    inStock: true,
    featured: false,
  },
  {
    id: 'p007',
    name: 'Artisan Sourdough Loaf',
    category: 'grains',
    price: 8.50,
    unit: 'per loaf',
    farmerId: 'f005',
    farmerName: 'Clearwater Mill',
    farmerLocation: 'Petaluma, CA',
    description:
      'Stone-milled heritage wheat, long-fermented sourdough with a crackling crust and open crumb.',
    image: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=600&h=400&fit=crop',
    badge: 'Artisan',
    rating: 4.9,
    reviewCount: 187,
    inStock: true,
    featured: true,
  },
  {
    id: 'p008',
    name: 'Fresh Basil',
    category: 'herbs',
    price: 2.49,
    unit: 'per bunch',
    farmerId: 'f001',
    farmerName: 'Green Valley Farm',
    farmerLocation: 'Napa Valley, CA',
    description:
      'Fragrant Genovese basil, grown in full sun. Perfect for pesto, caprese salads, or finishing a pasta dish.',
    image: 'https://images.unsplash.com/photo-1618375569909-3c8616cf7733?w=600&h=400&fit=crop',
    badge: 'Organic',
    rating: 4.7,
    reviewCount: 34,
    inStock: false,
    featured: false,
  },
];

/** Returns only products marked as featured */
export const getFeaturedProducts = () => PRODUCTS.filter((p) => p.featured);

/** Returns products filtered by category (or all if 'all') */
export const getProductsByCategory = (category) =>
  category === 'all' ? PRODUCTS : PRODUCTS.filter((p) => p.category === category);

/** Looks up a single product by its id */
export const getProductById = (id) => PRODUCTS.find((p) => p.id === id) ?? null;
