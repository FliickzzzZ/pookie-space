import React, { useState, useEffect } from 'react';
import { 
  Home, 
  MessageCircleHeart, 
  Sparkles, 
  Calendar, 
  Heart, 
  User, 
  Settings,
  ShoppingBag
} from 'lucide-react';
import { ActiveTab } from '../../types';
import { sounds } from '../../utils/soundEffects';
import { storageService } from '../../services/storageService';
import { HelloKittyFace, HelloKittyBow } from './HelloKitty';

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onTabChange }) => {
  const [wishlistCount, setWishlistCount] = useState(0);
  const [eventCount, setEventCount] = useState(0);

  const updateCounts = () => {
    try {
      const wish = storageService.getWishlist();
      const ev = storageService.getEvents();
      if (Array.isArray(wish)) setWishlistCount(wish.filter(w => !w.isPurchased).length);
      if (Array.isArray(ev)) setEventCount(ev.filter(e => !e.isCompleted).length);
    } catch (err) {
      console.warn('Navbar count update error:', err);
    }
  };

  useEffect(() => {
    updateCounts();
    window.addEventListener('pookie_storage_update', updateCounts);
    return () => window.removeEventListener('pookie_storage_update', updateCounts);
  }, []);

  const navItems = [
    { id: 'inicio' as ActiveTab, label: 'Inicio', icon: Home },
    { id: 'chat' as ActiveTab, label: 'naimnecita', icon: MessageCircleHeart, badge: 'IA' },
    { id: 'shopper' as ActiveTab, label: 'Personal Shopper', icon: ShoppingBag, badge: 'Chic' },
    { id: 'calendario' as ActiveTab, label: 'Calendario', icon: Calendar, count: eventCount },
    { id: 'wishlist' as ActiveTab, label: 'Wishlist', icon: Heart, count: wishlistCount },
    { id: 'perfil' as ActiveTab, label: 'Mi perfil', icon: User },
    { id: 'configuracion' as ActiveTab, label: 'Configuración', icon: Settings },
  ];

  const handleSelect = (tab: ActiveTab) => {
    sounds.playPop();
    onTabChange(tab);
  };

  return (
    <>
      {/* ============================================================ */}
      {/* DESKTOP SIDEBAR (Visible on md and up) */}
      {/* ============================================================ */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 shrink-0 p-4 border-r border-pookie-100/90 bg-white/60 backdrop-blur-2xl min-h-[calc(100vh-65px)]">
        {/* Naimnecita status widget card with Hello Kitty */}
        <div className="mb-6 p-4 rounded-3xl bg-gradient-to-br from-pookie-50 via-white to-lavender-50 border border-pookie-200/80 shadow-soft relative overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-pookie-200 via-white to-lavender-200 flex items-center justify-center shadow-soft border border-pookie-200 relative p-1">
              <HelloKittyFace size={38} />
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <h4 className="font-display font-bold text-sm text-rosewood-900">
                  naimnecita
                </h4>
                <HelloKittyBow size={13} />
              </div>
              <p className="text-xs text-rosewood-600 font-medium leading-tight">
                Tu asistente personal lista para consentirte
              </p>
            </div>
          </div>
          <button
            onClick={() => handleSelect('chat')}
            className="w-full mt-3 py-2 px-3 rounded-2xl bg-white/90 hover:bg-pookie-50 border border-pookie-200/80 text-xs font-semibold text-pookie-600 flex items-center justify-center gap-2 transition hover:shadow-sm"
          >
            <MessageCircleHeart className="w-4 h-4 text-pookie-500" />
            <span>Hablar con naimnecita</span>
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-pookie-500 to-pookie-600 text-white shadow-soft font-bold'
                    : 'text-rosewood-700 hover:bg-pookie-100/60 hover:text-pookie-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-white' : 'text-pookie-500'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-white/25 text-white'
                          : 'bg-pookie-100 text-pookie-600'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {typeof item.count === 'number' && item.count > 0 && (
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-white text-pookie-600 shadow-sm'
                          : 'bg-pookie-200/80 text-pookie-800'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </nav>

        {/* Bottom subtle quote */}
        <div className="pt-4 mt-auto border-t border-pookie-100/70 text-center">
          <p className="text-xs font-cursive text-pookie-600 text-base">
            "Para una chica que merece lo más lindo" 💗
          </p>
          <span className="text-[10px] text-rosewood-400 block mt-1">
            Pookie Space v1.0 • Hecho con amor
          </span>
        </div>
      </aside>

      {/* ============================================================ */}
      {/* MOBILE BOTTOM DOCK (Visible below md) */}
      {/* ============================================================ */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/85 backdrop-blur-2xl border-t border-pookie-200/80 px-2 py-1.5 safe-area-bottom shadow-lg">
        <div className="flex items-center justify-around max-w-lg mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`relative flex flex-col items-center justify-center py-1.5 px-2.5 rounded-2xl transition-all duration-200 ${
                  isActive ? 'text-pookie-600' : 'text-rosewood-500 hover:text-pookie-600'
                }`}
              >
                {isActive && (
                  <span className="absolute -top-1 w-6 h-1 rounded-full bg-pookie-500 shadow-glow" />
                )}
                <div className="relative">
                  <Icon
                    className={`w-5 h-5 transition-transform ${
                      isActive ? 'scale-115 text-pookie-600' : ''
                    }`}
                  />
                  {typeof item.count === 'number' && item.count > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 w-4 h-4 bg-pookie-500 text-white rounded-full text-[9px] font-extrabold flex items-center justify-center shadow-xs">
                      {item.count}
                    </span>
                  )}
                </div>
                <span className={`text-[10px] mt-1 font-medium tracking-tight ${
                  isActive ? 'font-bold text-pookie-600' : 'text-rosewood-600'
                }`}>
                  {item.id === 'shopper' ? 'Shopper' : item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
