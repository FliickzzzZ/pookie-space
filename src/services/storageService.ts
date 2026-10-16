// Storage Service for Pookie Space
// Hybrid LocalStorage & extensible Firestore sync

import { UserTasteProfile, WishlistItem, CalendarEvent, ChatMessage, AppNotification } from '../types';

const KEYS = {
  PROFILE: 'pookie_profile_v1',
  WISHLIST: 'pookie_wishlist_v1',
  CALENDAR: 'pookie_calendar_v1',
  CHAT: 'pookie_chat_v1',
  NOTIFICATIONS: 'pookie_notifications_v1',
  GEMINI_KEY: 'pookie_gemini_api_key',
  GROQ_KEY: 'pookie_groq_api_key',
  FIREBASE_CONFIG: 'pookie_firebase_config',
  HAS_SEEN_WELCOME: 'pookie_has_seen_welcome',
};

// Initial default profile (before onboarding)
export const defaultTasteProfile: UserTasteProfile = {
  name: 'pookie',
  colors: ['Rosa pastel', 'Blanco perlado', 'Lavanda', 'Rosa empolvado'],
  clothingStyles: ['Coquette chic', 'Clean girl aesthetic', 'Casual elegante'],
  outfitTypes: ['Citas románticas', 'Brunch con amigas', 'Día a día aesthetic'],
  beautyPreferences: ['Skincare coreano glow', 'Perfumes florales y vainilla', 'Labiales nude y gloss'],
  accessories: ['Joyería dorada minimal', 'Bolsos baguette/mini', 'Gafas de sol chic'],
  interests: ['Moda', 'Fotografía & Estética', 'Cafeterías bonitas', 'Wellness & Skincare'],
  budgetLevel: 'equilibrado',
  budgetAmountTypical: 80,
  favoriteStores: ['Zara', 'Amazon', 'AliExpress', 'Sephora', 'Stradivarius'],
  dislikes: ['Colores fluorescentes estridentes', 'Estampados animales exagerados'],
  additionalNotes: 'Me encantan las prendas delicadas, suaves, cómodas y con un toque coqueto y femenino.',
  avatarId: 'pookie-heart',
  completedOnboarding: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// Initial starter wishlist items to delight the user immediately
const defaultWishlist: WishlistItem[] = [
  {
    id: 'w-1',
    title: 'Vestido Midi Plisado Rosa Empolvado',
    category: 'Outfits',
    price: 35.99,
    currency: '€',
    store: 'Amazon',
    storeUrl: 'https://www.amazon.es/s?k=vestido+midi+plisado+rosa+empolvado&i=fashion',
    imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&auto=format&fit=crop&q=60',
    notes: 'Ideal para cenas o citas especiales. La caída de la tela es un sueño.',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    isPurchased: false,
    aiRecommended: true,
  },
  {
    id: 'w-2',
    title: 'Serum Glow Iluminador con Niacinamida',
    category: 'Belleza & Skincare',
    price: 18.50,
    currency: '€',
    store: 'Sephora',
    storeUrl: 'https://www.sephora.es/buscar?q=serum+glow+niacinamida',
    imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&auto=format&fit=crop&q=60',
    notes: 'Para conseguir el efecto glass-skin que recomienda naimnecita.',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    isPurchased: false,
    aiRecommended: true,
  },
  {
    id: 'w-3',
    title: 'Mini Bolso Perla Pastel con Cadena Dorada',
    category: 'Accesorios',
    price: 24.90,
    currency: '€',
    store: 'AliExpress',
    storeUrl: 'https://es.aliexpress.com/wholesale?SearchText=mini+bolso+perla+pastel+dorado&sortType=total_tranpro_desc',
    imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&auto=format&fit=crop&q=60',
    notes: 'Combina con todos los vestidos claros y blazers oversize.',
    createdAt: new Date().toISOString(),
    isPurchased: false,
    aiRecommended: false,
  }
];

// Initial starter calendar events
const todayStr = new Date().toISOString().split('T')[0];
const tomorrow = new Date(Date.now() + 86400000);
const tomorrowStr = tomorrow.toISOString().split('T')[0];

const defaultEvents: CalendarEvent[] = [
  {
    id: 'e-1',
    title: 'Cena especial con amigas 🥂',
    date: tomorrowStr,
    startTime: '20:30',
    endTime: '23:00',
    category: 'Social',
    notes: 'Outfit elegido con naimnecita: vestido midi y accesorios dorados.',
    recurrence: 'none',
    reminderMinutes: 60,
    isCompleted: false,
  },
  {
    id: 'e-2',
    title: 'Rutina de Skincare & Mascarilla Glow ✨',
    date: todayStr,
    startTime: '21:30',
    endTime: '22:00',
    category: 'Belleza & Self-care',
    notes: 'Momento de relax total.',
    recurrence: 'weekly',
    reminderMinutes: 15,
    isCompleted: false,
  }
];

export const storageService = {
  // Taste Profile
  getProfile(): UserTasteProfile {
    try {
      const data = localStorage.getItem(KEYS.PROFILE);
      if (!data) return defaultTasteProfile;
      const parsed = JSON.parse(data);
      if (!parsed || typeof parsed !== 'object') return defaultTasteProfile;
      return {
        ...defaultTasteProfile,
        ...parsed,
        colors: Array.isArray(parsed.colors) && parsed.colors.length > 0 ? parsed.colors : defaultTasteProfile.colors,
        clothingStyles: Array.isArray(parsed.clothingStyles) && parsed.clothingStyles.length > 0 ? parsed.clothingStyles : defaultTasteProfile.clothingStyles,
        outfitTypes: Array.isArray(parsed.outfitTypes) && parsed.outfitTypes.length > 0 ? parsed.outfitTypes : defaultTasteProfile.outfitTypes,
        beautyPreferences: Array.isArray(parsed.beautyPreferences) ? parsed.beautyPreferences : defaultTasteProfile.beautyPreferences,
        accessories: Array.isArray(parsed.accessories) ? parsed.accessories : defaultTasteProfile.accessories,
        interests: Array.isArray(parsed.interests) ? parsed.interests : defaultTasteProfile.interests,
        favoriteStores: Array.isArray(parsed.favoriteStores) && parsed.favoriteStores.length > 0 ? parsed.favoriteStores : defaultTasteProfile.favoriteStores,
        dislikes: Array.isArray(parsed.dislikes) ? parsed.dislikes : defaultTasteProfile.dislikes,
      };
    } catch {
      return defaultTasteProfile;
    }
  },

  saveProfile(profile: UserTasteProfile): void {
    profile.updatedAt = new Date().toISOString();
    localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
    window.dispatchEvent(new CustomEvent('pookie_storage_update', { detail: { key: 'profile' } }));
  },

  // Wishlist
  getWishlist(): WishlistItem[] {
    try {
      const data = localStorage.getItem(KEYS.WISHLIST);
      if (!data) {
        localStorage.setItem(KEYS.WISHLIST, JSON.stringify(defaultWishlist));
        return defaultWishlist;
      }
      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed)) return defaultWishlist;
      return parsed.filter(w => w && typeof w === 'object' && w.title);
    } catch {
      return defaultWishlist;
    }
  },

  saveWishlist(items: WishlistItem[]): void {
    localStorage.setItem(KEYS.WISHLIST, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent('pookie_storage_update', { detail: { key: 'wishlist' } }));
  },

  addWishlistItem(item: Omit<WishlistItem, 'id' | 'createdAt'>): WishlistItem {
    const current = this.getWishlist();
    const newItem: WishlistItem = {
      ...item,
      id: `w-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString(),
    };
    this.saveWishlist([newItem, ...current]);
    return newItem;
  },

  removeWishlistItem(id: string): void {
    const current = this.getWishlist().filter(i => i.id !== id);
    this.saveWishlist(current);
  },

  toggleWishlistPurchased(id: string): void {
    const current = this.getWishlist().map(item => {
      if (item.id === id) {
        return { ...item, isPurchased: !item.isPurchased };
      }
      return item;
    });
    this.saveWishlist(current);
  },

  // Calendar
  getEvents(): CalendarEvent[] {
    try {
      const data = localStorage.getItem(KEYS.CALENDAR);
      if (!data) {
        localStorage.setItem(KEYS.CALENDAR, JSON.stringify(defaultEvents));
        return defaultEvents;
      }
      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed)) return defaultEvents;
      return parsed.filter(e => e && typeof e === 'object' && e.title);
    } catch {
      return defaultEvents;
    }
  },

  saveEvents(events: CalendarEvent[]): void {
    localStorage.setItem(KEYS.CALENDAR, JSON.stringify(events));
    window.dispatchEvent(new CustomEvent('pookie_storage_update', { detail: { key: 'calendar' } }));
  },

  addEvent(event: Omit<CalendarEvent, 'id'>): CalendarEvent {
    const current = this.getEvents();
    const newEvent: CalendarEvent = {
      ...event,
      id: `e-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    this.saveEvents([...current, newEvent]);
    return newEvent;
  },

  updateEvent(event: CalendarEvent): void {
    const current = this.getEvents().map(e => e.id === event.id ? event : e);
    this.saveEvents(current);
  },

  removeEvent(id: string): void {
    const current = this.getEvents().filter(e => e.id !== id);
    this.saveEvents(current);
  },

  toggleEventCompleted(id: string): void {
    const current = this.getEvents().map(e => {
      if (e.id === id) {
        return { ...e, isCompleted: !e.isCompleted };
      }
      return e;
    });
    this.saveEvents(current);
  },

  // Chat History
  getChatHistory(): ChatMessage[] {
    try {
      const data = localStorage.getItem(KEYS.CHAT);
      if (!data) return [
        {
          id: 'msg-init-1',
          sender: 'naimnecita',
          text: '¡Hola pookie! 💗 Qué alegría verte por aquí. Recuerda que puedo ayudarte a elegir el outfit perfecto, armar tu calendario, guardar tus deseos o simplemente charlar. ¿Qué te gustaría hacer hoy? ✨',
          timestamp: new Date().toISOString()
        }
      ];
      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed)) return [];
      return parsed
        .filter(m => m && typeof m === 'object')
        .map((m, idx) => ({
          id: m.id || `msg-${idx}`,
          sender: m.sender === 'user' ? 'user' : 'naimnecita',
          text: typeof m.text === 'string' ? m.text : '',
          timestamp: m.timestamp || new Date().toISOString(),
          actionCard: m.actionCard && m.actionCard.data ? m.actionCard : undefined
        }));
    } catch {
      return [];
    }
  },

  saveChatHistory(messages: ChatMessage[]): void {
    localStorage.setItem(KEYS.CHAT, JSON.stringify(messages));
    window.dispatchEvent(new CustomEvent('pookie_storage_update', { detail: { key: 'chat' } }));
  },

  clearChatHistory(): void {
    localStorage.removeItem(KEYS.CHAT);
    window.dispatchEvent(new CustomEvent('pookie_storage_update', { detail: { key: 'chat' } }));
  },

  // Notifications
  getNotifications(): AppNotification[] {
    try {
      const data = localStorage.getItem(KEYS.NOTIFICATIONS);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },

  addNotification(notif: Omit<AppNotification, 'id' | 'time' | 'read'>): void {
    const current = this.getNotifications();
    const item: AppNotification = {
      ...notif,
      id: `notif-${Date.now()}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false
    };
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify([item, ...current.slice(0, 20)]));
    window.dispatchEvent(new CustomEvent('pookie_storage_update', { detail: { key: 'notifications' } }));
  },

  // Gemini API Key (stored strictly client-side)
  getGeminiApiKey(): string {
    return localStorage.getItem(KEYS.GEMINI_KEY) || '';
  },

  setGeminiApiKey(key: string): void {
    if (key) {
      localStorage.setItem(KEYS.GEMINI_KEY, key.trim());
    } else {
      localStorage.removeItem(KEYS.GEMINI_KEY);
    }
    window.dispatchEvent(new CustomEvent('pookie_storage_update', { detail: { key: 'gemini_key' } }));
  },

  // Groq API Key (stored strictly in local device storage)
  getGroqApiKey(): string {
    return localStorage.getItem(KEYS.GROQ_KEY) || '';
  },

  setGroqApiKey(key: string): void {
    if (key) {
      localStorage.setItem(KEYS.GROQ_KEY, key.trim());
    } else {
      localStorage.removeItem(KEYS.GROQ_KEY);
    }
    window.dispatchEvent(new CustomEvent('pookie_storage_update', { detail: { key: 'groq_key' } }));
  },

  // Welcome screen flag
  hasSeenWelcome(): boolean {
    return sessionStorage.getItem(KEYS.HAS_SEEN_WELCOME) === 'true';
  },

  setSeenWelcome(): void {
    sessionStorage.setItem(KEYS.HAS_SEEN_WELCOME, 'true');
  },

  // Export full JSON backup
  exportAllData(): string {
    return JSON.stringify({
      version: '1.0',
      exportedAt: new Date().toISOString(),
      profile: this.getProfile(),
      wishlist: this.getWishlist(),
      calendar: this.getEvents(),
      chat: this.getChatHistory(),
    }, null, 2);
  },

  // Import JSON backup
  importAllData(jsonStr: string): boolean {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.profile) this.saveProfile(parsed.profile);
      if (parsed.wishlist) this.saveWishlist(parsed.wishlist);
      if (parsed.calendar) this.saveEvents(parsed.calendar);
      return true;
    } catch (e) {
      console.error('Failed to import backup:', e);
      return false;
    }
  },

  // Reset all data
  resetAllData(): void {
    localStorage.clear();
    sessionStorage.clear();
    window.location.reload();
  }
};
