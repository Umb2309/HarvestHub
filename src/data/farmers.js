/**
 * Mock farmer/producer data
 * --------------------------
 * Structured to mirror a real API response (e.g. GET /api/farmers).
 * Each farmer has an id that links to products via farmerId in products.js
 */

export const FARMERS = [
  {
    id: 'f001',
    name: 'Sarah Mitchell',
    farm: 'Green Valley Farm',
    location: 'Napa Valley, CA',
    avatar: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=200&h=200&fit=crop&crop=face',
    coverImage: 'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=800&h=400&fit=crop',
    bio: 'Third-generation farmer specialising in certified organic vegetables and herbs. Sarah has been farming the same Napa Valley land her grandparents first cultivated in 1952.',
    specialties: ['Organic Vegetables', 'Fresh Herbs', 'Heirloom Tomatoes'],
    certifications: ['USDA Organic', 'Certified Naturally Grown'],
    yearsActive: 12,
    productCount: 24,
    rating: 4.9,
    reviewCount: 312,
    featured: true,
  },
  {
    id: 'f002',
    name: 'Carlos Rivera',
    farm: 'Sunrise Berry Farm',
    location: 'Watsonville, CA',
    avatar: 'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=200&h=200&fit=crop&crop=face',
    coverImage: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&h=400&fit=crop',
    bio: 'Carlos grows over 15 varieties of strawberries and seasonal fruit across 40 acres of California coastline. His low-spray farming methods protect the local ecosystem.',
    specialties: ['Strawberries', 'Seasonal Fruits', 'Rainbow Carrots'],
    certifications: ['Low-Spray Certified', 'California Sustainable Winegrowing'],
    yearsActive: 8,
    productCount: 18,
    rating: 4.8,
    reviewCount: 201,
    featured: true,
  },
  {
    id: 'f003',
    name: 'Linda Chen',
    farm: 'Happy Hen Ranch',
    location: 'Sonoma, CA',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face',
    coverImage: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800&h=400&fit=crop',
    bio: 'Linda raises 300 free-range hens on open pasture, supplemented with non-GMO grain. Her hens roam freely year-round — happy hens, better eggs.',
    specialties: ['Free-Range Eggs', 'Pasture-Raised Poultry', 'Organic Feed'],
    certifications: ['Certified Humane', 'Non-GMO Verified'],
    yearsActive: 6,
    productCount: 8,
    rating: 4.7,
    reviewCount: 158,
    featured: true,
  },
  {
    id: 'f004',
    name: 'James Okafor',
    farm: 'Golden Meadow Apiary',
    location: 'Mendocino, CA',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face',
    coverImage: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800&h=400&fit=crop',
    bio: 'Master beekeeper tending 200+ hives across wildflower meadows in Mendocino County. James produces raw, unfiltered honey that preserves all natural enzymes and pollen.',
    specialties: ['Raw Honey', 'Beeswax Products', 'Pollination Services'],
    certifications: ['USDA Organic', 'Raw & Unfiltered Certified'],
    yearsActive: 15,
    productCount: 12,
    rating: 5.0,
    reviewCount: 89,
    featured: false,
  },
  {
    id: 'f005',
    name: 'Emma Thornton',
    farm: 'Clearwater Mill',
    location: 'Petaluma, CA',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
    coverImage: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=400&fit=crop',
    bio: 'Emma mills heritage grains grown on her family farm and bakes small-batch sourdough using traditional long-fermentation methods passed down for generations.',
    specialties: ['Heritage Grains', 'Artisan Bread', 'Stone-Milled Flour'],
    certifications: ['Certified B Corporation', 'Regenerative Organic Certified'],
    yearsActive: 5,
    productCount: 15,
    rating: 4.9,
    reviewCount: 224,
    featured: false,
  },
];

/** Returns only featured farmers */
export const getFeaturedFarmers = () => FARMERS.filter((f) => f.featured);

/** Looks up a single farmer by their id */
export const getFarmerById = (id) => FARMERS.find((f) => f.id === id) ?? null;
