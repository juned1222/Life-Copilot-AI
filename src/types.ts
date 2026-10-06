export interface CampusItem {
  id: string;
  name: string;
  category: 'Food' | 'Stationery' | 'Essentials';
  tags: string[];
}

export interface UserProfile {
  role: 'student' | 'guest';
  fullName?: string;
  email?: string;
  rollNumber?: string;
  classSection?: string;
  password?: string;
}

export interface VendorOption {
  vendorName: string;
  itemName: string;
  price: number;
  timeMins: number; // Time in minutes to obtain (e.g. 5m, 15m, 2880m for 2 days)
  timeText: string;
  availability: 'In Stock' | 'Limited Stock' | 'Out of Stock' | 'Available' | 'Fast Delivery' | '1-2 Days';
  locationInfo: string;
  openingHours?: string;
  direct_link?: string; // Deep link URL for online providers
}

export interface SearchState {
  itemQuery: string;
  maxBudget: number;
  maxTime: string; // "Immediate (5m)", "Under 30m", "End of Day", "Any time"
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text?: string;
  // Dynamic fields for smart recommendations
  searchContext?: SearchState;
  recommendations?: {
    searchedItem: string;
    options: VendorOption[];
    winner: VendorOption | null;
    alternative: VendorOption | null;
    actionPlan: string[];
  };
}

export interface SavedChat {
  id: string;
  title: string;
  timestamp: string;
  messages: ChatMessage[];
}
