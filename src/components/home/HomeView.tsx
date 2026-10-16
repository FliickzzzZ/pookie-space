import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  MessageCircleHeart, 
  Calendar, 
  Heart, 
  ShoppingBag, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft,
  ExternalLink,
  Plus
} from 'lucide-react';
import { ActiveTab, CalendarEvent, WishlistItem, UserTasteProfile } from '../../types';
import { storageService } from '../../services/storageService';
import { sounds } from '../../utils/soundEffects';
import { firePookieConfetti } from '../../utils/confetti';
import { HelloKittyFace, HelloKittyWithHeart, HelloKittyBow } from '../common/HelloKitty';

interface HomeViewProps {
  onNavigate: (tab: ActiveTab) => void;
  onAskNaimnecita: (prompt: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, onAskNaimnecita }) => {
  const [profile, setProfile] = useState<UserTasteProfile>(storageService.getProfile());
  const [events, setEvents] = useState<CalendarEvent[]>(storageService.getEvents());
  const [wishlist, setWishlist] = useState<WishlistItem[]>(storageService.getWishlist());
  const [quickInput, setQuickInput] = useState('');
  const [activeSlide, setActiveSlide] = useState(0);

  const reloadData = () => {
    setProfile(storageService.getProfile());
    setEvents(storageService.getEvents());
    setWishlist(storageService.getWishlist());
  };

  useEffect(() => {
    window.addEventListener('pookie_storage_update', reloadData);
    return () => window.removeEventListener('pookie_storage_update', reloadData);
  }, []);

  // Time of day greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Buenos días, pookie', emoji: '☀️', phrase: 'Que tu día sea tan lindo y brillante como tú.' };
    if (hour < 20) return { text: 'Buenas tardes, pookie', emoji: '🌸', phrase: 'Tómate un respiro, un café o un matcha bien merecido.' };
    return { text: 'Buenas noches, pookie', emoji: '🌙', phrase: 'Hora de tu skincare relajante y descansar como una reina.' };
  };

  const greeting = getGreeting();

  // Upcoming non-completed events
  const upcomingEvents = events.filter(e => !e.isCompleted).slice(0, 3);
  const favoriteWishes = wishlist.filter(w => !w.isPurchased).slice(0, 4);

  // Handle toggle event complete
  const handleToggleEvent = (id: string) => {
    sounds.playSparkle();
    firePookieConfetti();
    storageService.toggleEventCompleted(id);
  };

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim()) return;
    sounds.playPop();
    const text = quickInput.trim();
    setQuickInput('');
    onAskNaimnecita(text);
  };

  // Carousel slide data
  const carouselCards = [
    {
      id: 'look-today',
      badge: 'Estilo del día ✨',
      title: 'Inspiración Coquette Chic',
      description: `Tonos ${profile.colors[0] || 'Rosa pastel'} y ${profile.colors[1] || 'Blanco perlado'}. Diseñado especialmente para tus gustos.`,
      actionLabel: 'Ver en Personal Shopper',
      actionTab: 'shopper' as ActiveTab,
      bgGrad: 'from-pink-100 via-rose-50 to-purple-100',
      icon: ShoppingBag
    },
    {
      id: 'next-event',
      badge: 'Próxima cita 📅',
      title: upcomingEvents[0] ? upcomingEvents[0].title : 'Organiza tu semana',
      description: upcomingEvents[0] 
        ? `Programado para ${upcomingEvents[0].date} a las ${upcomingEvents[0].startTime}.`
        : 'Añade tus citas, momentos de estudio y rutinas de belleza.',
      actionLabel: 'Abrir Calendario',
      actionTab: 'calendario' as ActiveTab,
      bgGrad: 'from-purple-100 via-pink-50 to-indigo-100',
      icon: Calendar
    },
    {
      id: 'wish-featured',
      badge: 'Tu Wishlist 💖',
      title: favoriteWishes[0] ? favoriteWishes[0].title : 'Crea tu lista de deseos',
      description: favoriteWishes[0]
        ? `Precio: ${favoriteWishes[0].price} ${favoriteWishes[0].currency} en ${favoriteWishes[0].store}.`
        : 'Guarda vestidos, maquillaje, bolsos y accesorios que te enamoren.',
      actionLabel: 'Ver toda la Wishlist',
      actionTab: 'wishlist' as ActiveTab,
      bgGrad: 'from-amber-50 via-rose-50 to-pink-100',
      icon: Heart
    }
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* ============================================================ */}
      {/* HERO BANNER & GREETING */}
      {/* ============================================================ */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 sm:p-10 rounded-5xl glass-card relative overflow-hidden border border-white/80 shadow-soft-lg"
      >
        {/* Hello Kitty Background Watermark */}
        <div className="absolute -right-6 -bottom-6 opacity-20 pointer-events-none select-none hidden lg:block">
          <HelloKittyFace size={180} />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-xl">
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pookie-100/90 text-pookie-700 text-xs font-bold border border-pookie-200">
                <HelloKittyBow size={16} />
                <span>Pookie Space x Hello Kitty 🎀</span>
              </div>
              <span className="text-[11px] font-bold text-lavender-600 bg-lavender-50 px-2.5 py-0.5 rounded-full border border-lavender-200">
                naimnecita ✨
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-rosewood-900 tracking-tight flex items-center gap-2">
              <span>{greeting.text} {greeting.emoji}</span>
            </h1>
            <p className="text-sm sm:text-base text-rosewood-700 font-medium">
              {greeting.phrase}
            </p>
          </div>

          {/* Quick Chat Bubble trigger to naimnecita & Hello Kitty Illustration */}
          <div className="shrink-0 flex items-center gap-4">
            <div className="hidden sm:block">
              <img
                src="./kitty/kitty_teddy_sweet.png"
                alt="Hello Kitty Sweet"
                className="w-28 sm:w-32 h-auto drop-shadow-md select-none hover:scale-105 transition-transform"
              />
            </div>
            <button
              onClick={() => { sounds.playPop(); onNavigate('chat'); }}
              className="pookie-gradient-btn px-6 py-3.5 rounded-3xl text-white font-bold text-sm shadow-glow flex items-center gap-2.5 transition group"
            >
              <MessageCircleHeart className="w-5 h-5 transition-transform group-hover:scale-110" />
              <span>Hablar con naimnecita</span>
              <ArrowRight className="w-4 h-4 opacity-75" />
            </button>
          </div>
        </div>

        {/* Quick Ask / Command Bar */}
        <form onSubmit={handleQuickSubmit} className="mt-8 relative z-10">
          <div className="flex items-center gap-2 p-1.5 bg-white/90 rounded-full border border-pookie-200 shadow-inner-soft focus-within:ring-2 focus-within:ring-pookie-400 transition">
            <div className="pl-4 text-pookie-500">
              <Sparkles className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={quickInput}
              onChange={(e) => setQuickInput(e.target.value)}
              placeholder="Pregúntale lo que quieras a naimnecita (ej: outfit para el sábado, recordatorio...)"
              className="w-full py-2.5 px-2 bg-transparent text-xs sm:text-sm text-rosewood-900 placeholder:text-rosewood-400 focus:outline-none"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-full bg-pookie-500 hover:bg-pookie-600 text-white text-xs font-bold transition shadow-soft flex items-center gap-1.5 shrink-0"
            >
              <span>Enviar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Suggested Quick Prompt Chips */}
          <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1 text-xs">
            <span className="text-rosewood-500 font-medium text-[11px] shrink-0">Ideas rápidas:</span>
            {[
              'Outfit cena de 80 € 🍷',
              'Recuérdame estudiar mañana 📚',
              'Rutina de skincare glow ✨',
              '¿Qué hay en mi wishlist? 🛍️'
            ].map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => {
                  sounds.playPop();
                  onAskNaimnecita(chip);
                }}
                className="px-3 py-1 rounded-full bg-white/80 hover:bg-pookie-100 text-rosewood-700 border border-pookie-200/80 transition whitespace-nowrap text-[11px] font-semibold"
              >
                {chip}
              </button>
            ))}
          </div>
        </form>
      </motion.section>

      {/* ============================================================ */}
      {/* DYNAMIC INTERACTIVE CAROUSEL */}
      {/* ============================================================ */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <span className="text-pookie-500 font-bold">✨</span>
            <h2 className="font-display font-bold text-xl text-rosewood-900">
              Destacados para ti hoy
            </h2>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                sounds.playPop();
                setActiveSlide(s => (s > 0 ? s - 1 : carouselCards.length - 1));
              }}
              className="p-1.5 rounded-full glass-card hover:bg-pookie-100 text-rosewood-600 transition"
              title="Anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                sounds.playPop();
                setActiveSlide(s => (s < carouselCards.length - 1 ? s + 1 : 0));
              }}
              className="p-1.5 rounded-full glass-card hover:bg-pookie-100 text-rosewood-600 transition"
              title="Siguiente"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Slide Display */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {carouselCards.map((card, idx) => {
            const Icon = card.icon;
            const isSlideFocused = activeSlide === idx;
            return (
              <motion.div
                key={card.id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className={`p-6 rounded-4xl bg-gradient-to-br ${card.bgGrad} border border-white/90 shadow-soft flex flex-col justify-between transition-all ${
                  isSlideFocused ? 'ring-2 ring-pookie-400 shadow-soft-lg' : ''
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 rounded-full bg-white/80 text-rosewood-800 text-[11px] font-bold border border-pookie-200">
                      {card.badge}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-white/70 flex items-center justify-center text-pookie-600 shadow-xs">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="font-display font-bold text-lg text-rosewood-900 leading-snug">
                    {card.title}
                  </h3>
                  <p className="text-xs text-rosewood-700 mt-2 font-medium line-clamp-2">
                    {card.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-rosewood-100/60 flex items-center justify-between">
                  <button
                    onClick={() => { sounds.playPop(); onNavigate(card.actionTab); }}
                    className="text-xs font-bold text-pookie-600 hover:text-pookie-700 flex items-center gap-1 transition"
                  >
                    <span>{card.actionLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ============================================================ */}
      {/* TWO COLUMNS: UPCOMING EVENTS & WISHLIST FAVORITES */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Column 1: Upcoming Events & Reminders */}
        <section className="p-6 rounded-4xl glass-card border border-white/90 shadow-soft flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-lavender-100 text-lavender-600 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-rosewood-900">
                  Próximos Eventos
                </h3>
                <p className="text-xs text-rosewood-600">Tus citas y momentos agendados</p>
              </div>
            </div>
            <button
              onClick={() => { sounds.playPop(); onNavigate('calendario'); }}
              className="text-xs font-bold text-pookie-600 hover:underline flex items-center gap-1"
            >
              <span>Ver calendario</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3 flex-1">
            {upcomingEvents.length === 0 ? (
              <div className="text-center py-8 px-4 rounded-3xl bg-pookie-50/50 border border-dashed border-pookie-200">
                <p className="text-xs text-rosewood-600 font-medium">
                  No tienes eventos pendientes para hoy. ¡Dile a naimnecita que te agende algo! ✨
                </p>
              </div>
            ) : (
              upcomingEvents.map((ev) => (
                <div
                  key={ev.id}
                  className="p-3.5 rounded-2xl bg-white/70 hover:bg-white border border-pookie-100 shadow-xs flex items-center justify-between transition"
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleToggleEvent(ev.id)}
                      title="Marcar como completado"
                      className="text-rosewood-300 hover:text-emerald-500 transition"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                    </button>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-rosewood-900">
                        {ev.title}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-rosewood-500 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {ev.startTime}
                        </span>
                        <span>•</span>
                        <span>{ev.date}</span>
                      </div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-pookie-100 text-pookie-700 text-[10px] font-bold">
                    {ev.category}
                  </span>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Column 2: Wishlist Favorites */}
        <section className="p-6 rounded-4xl glass-card border border-white/90 shadow-soft flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-pookie-100 text-pookie-600 flex items-center justify-center">
                <Heart className="w-5 h-5 fill-pookie-500 text-pookie-500" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-rosewood-900">
                  Tus Deseos Favoritos
                </h3>
                <p className="text-xs text-rosewood-600">Prendas y caprichos guardados</p>
              </div>
            </div>
            <button
              onClick={() => { sounds.playPop(); onNavigate('wishlist'); }}
              className="text-xs font-bold text-pookie-600 hover:underline flex items-center gap-1"
            >
              <span>Ver wishlist</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
            {favoriteWishes.length === 0 ? (
              <div className="col-span-2 text-center py-8 px-4 rounded-3xl bg-pookie-50/50 border border-dashed border-pookie-200">
                <p className="text-xs text-rosewood-600 font-medium">
                  Tu wishlist está lista para llenarse de cositas lindas. 🌸
                </p>
              </div>
            ) : (
              favoriteWishes.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-2xl bg-white/70 hover:bg-white border border-pookie-100 shadow-xs flex flex-col justify-between transition group"
                >
                  <div className="flex items-start gap-3">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-12 h-12 rounded-xl object-cover border border-pookie-100 shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-pookie-100 flex items-center justify-center text-pookie-500 font-bold shrink-0">
                        🛍️
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-rosewood-900 truncate">
                        {item.title}
                      </h4>
                      <p className="text-xs font-extrabold text-pookie-600 mt-1">
                        {item.price} {item.currency}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-pookie-100/60 flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-rosewood-500">{item.store}</span>
                    <a
                      href={item.storeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pookie-600 font-bold hover:underline flex items-center gap-1"
                    >
                      <span>Ver tienda</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
