export interface FoodDish {
  id: string;
  name: string;
  price: number;
  isBestseller?: boolean;
  category: 'Snack' | 'Beverage' | 'Meal' | 'Dessert' | 'Breakfast';
  dietType: 'Veg' | 'Jain Available' | 'Egg';
}

export interface FoodSpot {
  id: string;
  name: string;
  tagline: string;
  category: 'canteen' | 'cafe' | 'street_food' | 'dhaba' | 'juice' | 'delivery';
  categoryLabel: string;
  locationDescription: string;
  lat: number;
  lng: number;
  rating: number;
  reviewCount: number;
  priceRange: string;
  averagePrice: number;
  openingHours: string;
  isOpenNow: boolean;
  walkTimeMinutes: number; // approximate walk time from Block A
  distanceMeters: number; // from campus center
  phone?: string;
  popularDishes: FoodDish[];
  features: string[];
  googlePlaceQuery?: string;
}

export interface CampusBlock {
  id: string;
  name: string;
  description: string;
  lat: number;
  lng: number;
}

export const ACROPOLIS_CENTER = {
  lat: 22.8227,
  lng: 75.9424
};

export const CAMPUS_BLOCKS: CampusBlock[] = [
  {
    id: 'block-a',
    name: 'Block A (CSE, IT & Core Branches)',
    description: 'Central academic building, Manasvi canteen ground floor',
    lat: 22.8229,
    lng: 75.9422
  },
  {
    id: 'block-b',
    name: 'Block B (Civil, Mech Labs & Audi)',
    description: 'Quadrangle porch, Nescafe cafe',
    lat: 22.8223,
    lng: 75.9426
  },
  {
    id: 'block-c',
    name: 'Block C (Admin & Central Library)',
    description: 'Administration, examination cell and reading hall',
    lat: 22.8217,
    lng: 75.9421
  },
  {
    id: 'gate-1',
    name: 'Gate 1 (Main Bypass Entrance)',
    description: 'Security post, delivery pickup hub, Manglia bypass road',
    lat: 22.8239,
    lng: 75.9418
  },
  {
    id: 'gate-2',
    name: 'Gate 2 (Sports Ground & Plaza)',
    description: 'Near cricket ground, basketball court, Food Court',
    lat: 22.8233,
    lng: 75.9432
  }
];

export const CAMPUS_FOOD_SPOTS: FoodSpot[] = [
  {
    id: 'manasvi-canteen',
    name: 'Acropolis College Canteen (Manasvi Foods)',
    tagline: 'The official heartbeat of AITR Indore snacks & meals',
    category: 'canteen',
    categoryLabel: 'Campus Canteen',
    locationDescription: 'Block A Ground Floor (Inside Campus)',
    lat: 22.8229,
    lng: 75.9422,
    rating: 4.4,
    reviewCount: 420,
    priceRange: '₹15 - ₹70',
    averagePrice: 35,
    openingHours: '8:00 AM - 5:30 PM',
    isOpenNow: true,
    walkTimeMinutes: 1,
    distanceMeters: 40,
    features: ['UPI Accepted', 'Indoor Seating', 'Quick Counter', 'Jain Options'],
    popularDishes: [
      { id: 'd-1', name: 'Legendary Baked Samosa (Crispy & Hot)', price: 20, isBestseller: true, category: 'Snack', dietType: 'Veg' },
      { id: 'd-2', name: 'Indori Sev Poha with Jalebi', price: 25, isBestseller: true, category: 'Breakfast', dietType: 'Veg' },
      { id: 'd-3', name: 'Hot Samosa Chaat with Chole', price: 30, category: 'Snack', dietType: 'Veg' },
      { id: 'd-4', name: 'Special Acropolis Thali', price: 70, category: 'Meal', dietType: 'Veg' },
      { id: 'd-5', name: 'Masala Chai & Bun Maska', price: 20, category: 'Beverage', dietType: 'Veg' },
      { id: 'd-6', name: 'Veg Hakka Chowmein', price: 40, category: 'Snack', dietType: 'Veg' }
    ]
  },
  {
    id: 'campus-b-cafe',
    name: 'Campus B Central Cafe & Nescafe Hub',
    tagline: 'Cold coffee, grilled sandwiches & chill vibes between labs',
    category: 'cafe',
    categoryLabel: 'Campus Cafe',
    locationDescription: 'Block B Central Quadrangle Porch',
    lat: 22.8223,
    lng: 75.9426,
    rating: 4.5,
    reviewCount: 290,
    priceRange: '₹25 - ₹90',
    averagePrice: 50,
    openingHours: '8:30 AM - 5:00 PM',
    isOpenNow: true,
    walkTimeMinutes: 2,
    distanceMeters: 90,
    features: ['Shaded Porch Seating', 'Fast Preparation', 'Premium Coffee', 'Desserts'],
    popularDishes: [
      { id: 'd-7', name: 'Signature Thick Cold Coffee', price: 50, isBestseller: true, category: 'Beverage', dietType: 'Veg' },
      { id: 'd-8', name: 'Cheese Loaded Grilled Sandwich', price: 55, isBestseller: true, category: 'Snack', dietType: 'Veg' },
      { id: 'd-9', name: 'Cheese Baked Samosa (Oven Fresh)', price: 28, category: 'Snack', dietType: 'Veg' },
      { id: 'd-10', name: 'Butter Veg Maggi', price: 35, category: 'Snack', dietType: 'Veg' },
      { id: 'd-11', name: 'Warm Chocolate Walnut Brownie', price: 45, category: 'Dessert', dietType: 'Veg' }
    ]
  },
  {
    id: 'food-court-gate2',
    name: 'Acropolis Food Court & Sports Plaza',
    tagline: 'South Indian dosas, pav bhaji & meals with sports ground view',
    category: 'canteen',
    categoryLabel: 'Food Court',
    locationDescription: 'Opposite Basketball Court & Gate 2',
    lat: 22.8234,
    lng: 75.9431,
    rating: 4.3,
    reviewCount: 215,
    priceRange: '₹30 - ₹110',
    averagePrice: 65,
    openingHours: '9:00 AM - 6:00 PM',
    isOpenNow: true,
    walkTimeMinutes: 4,
    distanceMeters: 160,
    features: ['Open-air Courtyard', 'Full Meals', 'South Indian Special', 'Evening Crowd'],
    popularDishes: [
      { id: 'd-12', name: 'Butter Masala Dosa with Sambhar', price: 65, isBestseller: true, category: 'Meal', dietType: 'Veg' },
      { id: 'd-13', name: 'Amul Pav Bhaji (Extra Pav)', price: 65, isBestseller: true, category: 'Meal', dietType: 'Veg' },
      { id: 'd-14', name: 'Idli Vada Sambhar Combo', price: 50, category: 'Breakfast', dietType: 'Veg' },
      { id: 'd-15', name: 'Chole Bhature (2 Bhature)', price: 75, category: 'Meal', dietType: 'Veg' },
      { id: 'd-16', name: 'Kullad Sweet Rabdi Lassi', price: 40, category: 'Beverage', dietType: 'Veg' }
    ]
  },
  {
    id: 'manglia-square-tapri',
    name: 'Manglia Square Tapri & Chaat Corner',
    tagline: 'Indore famous local breakfast, spicy kachori & ginger tea',
    category: 'street_food',
    categoryLabel: 'Tapri & Street Food',
    locationDescription: 'Manglia Chouraha / Bypass Junction',
    lat: 22.8248,
    lng: 75.9408,
    rating: 4.6,
    reviewCount: 570,
    priceRange: '₹10 - ₹45',
    averagePrice: 25,
    openingHours: '7:00 AM - 9:30 PM',
    isOpenNow: true,
    walkTimeMinutes: 6,
    distanceMeters: 290,
    features: ['Ultra Budget', 'Authentic Taste', 'Early Morning 7AM', 'Late Night'],
    popularDishes: [
      { id: 'd-17', name: 'Indori Sev Poha with Usal Gravy', price: 20, isBestseller: true, category: 'Breakfast', dietType: 'Veg' },
      { id: 'd-18', name: 'Hing Masala Fried Kachori', price: 15, isBestseller: true, category: 'Snack', dietType: 'Veg' },
      { id: 'd-19', name: 'Spicy Fried Samosa with Chutney', price: 15, category: 'Snack', dietType: 'Veg' },
      { id: 'd-20', name: 'Strong Kadak Adrak Chai', price: 10, category: 'Beverage', dietType: 'Veg' },
      { id: 'd-21', name: 'Ratlami Sev Mix Packet', price: 25, category: 'Snack', dietType: 'Veg' }
    ]
  },
  {
    id: 'sharmaji-dhaba',
    name: 'Sharmaji Dhaba & Student Bhojanalaya',
    tagline: 'Unlimited hosteler thalis, dal baati & paratha feast',
    category: 'dhaba',
    categoryLabel: 'Student Dhaba',
    locationDescription: 'Manglia Bypass Road (Near Acropolis Flyover)',
    lat: 22.8212,
    lng: 75.9398,
    rating: 4.3,
    reviewCount: 440,
    priceRange: '₹60 - ₹130',
    averagePrice: 85,
    openingHours: '10:30 AM - 10:30 PM',
    isOpenNow: true,
    walkTimeMinutes: 7,
    distanceMeters: 330,
    features: ['Hosteler Favorite', 'Unlimited Chapati', 'Dal Baati Sundays', 'Takeaway Available'],
    popularDishes: [
      { id: 'd-22', name: 'Special Student Unlimited Thali', price: 80, isBestseller: true, category: 'Meal', dietType: 'Veg' },
      { id: 'd-23', name: 'Indori Dal Baati Churma Platter', price: 100, isBestseller: true, category: 'Meal', dietType: 'Veg' },
      { id: 'd-24', name: 'Butter Paneer Masala with 4 Rotis', price: 110, category: 'Meal', dietType: 'Veg' },
      { id: 'd-25', name: 'Stuffed Aloo Paratha with Curd', price: 45, category: 'Meal', dietType: 'Veg' }
    ]
  },
  {
    id: 'campus-juice-bar',
    name: 'Campus Fresh Juice & Nutrition Bar',
    tagline: 'Pure seasonal fruit juices, protein shakes & health bowls',
    category: 'juice',
    categoryLabel: 'Juice & Nutrition',
    locationDescription: 'Pathway near Block C Academic Wing',
    lat: 22.8218,
    lng: 75.9419,
    rating: 4.6,
    reviewCount: 180,
    priceRange: '₹30 - ₹70',
    averagePrice: 45,
    openingHours: '8:00 AM - 5:00 PM',
    isOpenNow: true,
    walkTimeMinutes: 2,
    distanceMeters: 110,
    features: ['No Added Sugar Option', 'Freshly Pressed', 'Protein Supplements', 'Fruit Salads'],
    popularDishes: [
      { id: 'd-26', name: 'Fresh Mosambi & Orange Juice', price: 40, isBestseller: true, category: 'Beverage', dietType: 'Veg' },
      { id: 'd-27', name: 'Oreo KitKat Loaded Thickshake', price: 60, isBestseller: true, category: 'Beverage', dietType: 'Veg' },
      { id: 'd-28', name: 'Banana Protein Peanut Butter Shake', price: 65, category: 'Beverage', dietType: 'Veg' },
      { id: 'd-29', name: 'Mixed Seasonal Fruit Bowl with Chaat Masala', price: 40, category: 'Snack', dietType: 'Veg' }
    ]
  },
  {
    id: 'bypass-chatori-gali',
    name: 'Bypass Chatori Gali (Momos & Rolls)',
    tagline: 'Evening street food heaven right outside Gate 1',
    category: 'street_food',
    categoryLabel: 'Street Food Hub',
    locationDescription: 'Opposite Main Entrance Gate 1',
    lat: 22.8241,
    lng: 75.9416,
    rating: 4.4,
    reviewCount: 340,
    priceRange: '₹30 - ₹80',
    averagePrice: 50,
    openingHours: '11:00 AM - 9:30 PM',
    isOpenNow: true,
    walkTimeMinutes: 4,
    distanceMeters: 190,
    features: ['Evening Hangout', 'Momos Special', 'Frankies & Rolls', 'Chai Stalls'],
    popularDishes: [
      { id: 'd-30', name: 'Crispy Fried Paneer Momos (8 Pcs)', price: 50, isBestseller: true, category: 'Snack', dietType: 'Veg' },
      { id: 'd-31', name: 'Spicy Schezwan Frankie Roll', price: 45, isBestseller: true, category: 'Snack', dietType: 'Veg' },
      { id: 'd-32', name: 'Peri Peri Crispy French Fries', price: 50, category: 'Snack', dietType: 'Veg' },
      { id: 'd-33', name: 'Kulhad Tandoori Chai', price: 15, category: 'Beverage', dietType: 'Veg' }
    ]
  },
  {
    id: 'gate-delivery-hub',
    name: 'Gate 1 Delivery Drop-off Point',
    tagline: 'Instant 10-15m deliveries from Blinkit, Zomato & Swiggy',
    category: 'delivery',
    categoryLabel: 'Instant Delivery Hub',
    locationDescription: 'Acropolis Main Security Gate 1',
    lat: 22.8239,
    lng: 75.9418,
    rating: 4.8,
    reviewCount: 650,
    priceRange: '₹30 - ₹300',
    averagePrice: 120,
    openingHours: '24/7 Security Point',
    isOpenNow: true,
    walkTimeMinutes: 3,
    distanceMeters: 150,
    features: ['Blinkit 10m Delivery', 'Swiggy/Zomato Point', 'Late Night Hosteler Access', 'Parcel Storage'],
    popularDishes: [
      { id: 'd-34', name: 'Blinkit Instant Snacks & Chips Basket', price: 90, isBestseller: true, category: 'Snack', dietType: 'Veg' },
      { id: 'd-35', name: 'Zomato Campus Group Pizza Deal', price: 199, isBestseller: true, category: 'Meal', dietType: 'Veg' },
      { id: 'd-36', name: 'Amul / Havmor Ice Cream Tub', price: 120, category: 'Dessert', dietType: 'Veg' }
    ]
  }
];

// Helper to calculate distance between two coordinates in meters
export function calculateDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth radius in metres
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

// Helper to calculate walking time in minutes
export function calculateWalkTimeMinutes(distanceMeters: number): number {
  // Average campus walking speed ~ 4.5 km/h = 75 meters/min, with turns/walkways factor 1.2
  const minutes = Math.ceil((distanceMeters * 1.2) / 75);
  return Math.max(1, minutes);
}
