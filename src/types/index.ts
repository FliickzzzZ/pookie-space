// Core Types for Pookie Space

export interface UserTasteProfile {
  name: string;
  colors: string[];
  clothingStyles: string[];
  outfitTypes: string[];
  beautyPreferences: string[];
  accessories: string[];
  interests: string[];
  budgetLevel: 'economico' | 'equilibrado' | 'premium' | 'lujo';
  budgetAmountTypical?: number;
  favoriteStores: string[];
  dislikes: string[];
  additionalNotes: string;
  avatarId: string;
  completedOnboarding: boolean;
  createdAt: string;
  updatedAt: string;
}

export type WishlistCategory = 'Outfits' | 'Belleza & Skincare' | 'Accesorios' | 'Decoración & Lifestyle' | 'Varios';

export interface WishlistItem {
  id: string;
  title: string;
  category: WishlistCategory;
  price: number;
  currency: string;
  store: 'Amazon' | 'AliExpress' | 'Zara' | 'Sephora' | 'Stradivarius' | 'Otro';
  storeUrl: string;
  imageUrl?: string;
  notes?: string;
  createdAt: string;
  isPurchased: boolean;
  aiRecommended?: boolean;
}

export type EventCategory = 'Cita' | 'Estudio' | 'Belleza & Self-care' | 'Social' | 'Compras' | 'Importante';

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime?: string; // HH:mm
  category: EventCategory;
  notes?: string;
  recurrence: 'none' | 'daily' | 'weekly' | 'monthly';
  reminderMinutes: number; // 0, 5, 15, 30, 60, 1440
  isCompleted?: boolean;
  notificationScheduled?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'naimnecita';
  text: string;
  timestamp: string;
  actionCard?: {
    type: 'event_created' | 'wishlist_added' | 'outfit_suggested';
    data: any;
  };
}

export interface OutfitPiece {
  name: string;
  category: 'Top' | 'Bottom' | 'Vestido' | 'Calzado' | 'Bolso' | 'Accesorio' | 'Belleza';
  description: string;
  estimatedPrice: number;
  amazonSearchUrl: string;
  aliexpressSearchUrl: string;
  directProductUrl?: string;
  directStore?: string;
  imageUrl?: string;
  colorHint?: string;
}

export interface OutfitRecommendation {
  id: string;
  title: string;
  occasion: string;
  estimatedBudget: number;
  styleVibe: string;
  explanation: string;
  pieces: OutfitPiece[];
  createdAt: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'reminder' | 'naimnecita' | 'system';
}

export type ActiveTab = 'inicio' | 'chat' | 'shopper' | 'calendario' | 'wishlist' | 'perfil' | 'configuracion';
