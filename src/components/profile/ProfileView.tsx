import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Sparkles, 
  Heart, 
  Palette, 
  Shirt, 
  ShoppingBag, 
  DollarSign, 
  Edit3, 
  ShieldCheck, 
  Calendar as CalendarIcon, 
  RefreshCw,
  Check
} from 'lucide-react';
import { UserTasteProfile } from '../../types';
import { storageService } from '../../services/storageService';
import { sounds } from '../../utils/soundEffects';
import { firePookieConfetti } from '../../utils/confetti';
import { HelloKittyFace, HelloKittyBow } from '../common/HelloKitty';

interface ProfileViewProps {
  onEditTastes: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onEditTastes }) => {
  const [profile, setProfile] = useState<UserTasteProfile>(storageService.getProfile());
  const [wishlistCount, setWishlistCount] = useState(0);
  const [eventsCount, setEventsCount] = useState(0);
  const [showSecretLetter, setShowSecretLetter] = useState(false);

  const avatars = [
    { id: 'kitty-classic', emoji: '🎀', label: 'Kitty Clásica', isKitty: true, bowColor: '#FB71A9' },
    { id: 'kitty-coquette', emoji: '💖', label: 'Kitty Coquette', isKitty: true, bowColor: '#F43F87' },
    { id: 'kitty-lavender', emoji: '💜', label: 'Kitty Lavanda', isKitty: true, bowColor: '#C084FC' },
    { id: 'kitty-bear', emoji: '🧸', label: 'Kitty & Osito', isKitty: true, bowColor: '#FDA4AF' },
    { id: 'my-melody', emoji: '🌸', label: 'My Melody', isKitty: false },
    { id: 'kuromi', emoji: '🖤', label: 'Kuromi Chic', isKitty: false },
    { id: 'cinnamoroll', emoji: '☁️', label: 'Cinnamoroll', isKitty: false },
    { id: 'pookie-crown', emoji: '👑', label: 'Kitty Queen', isKitty: true, bowColor: '#FBBF24' }
  ];

  const reload = () => {
    setProfile(storageService.getProfile());
    setWishlistCount(storageService.getWishlist().length);
    setEventsCount(storageService.getEvents().length);
  };

  useEffect(() => {
    reload();
    window.addEventListener('pookie_storage_update', reload);
    return () => window.removeEventListener('pookie_storage_update', reload);
  }, []);

  const handleSelectAvatar = (av: typeof avatars[0]) => {
    sounds.playPop();
    const updated = { ...profile, avatarId: av.id };
    storageService.saveProfile(updated);
    setProfile(updated);
  };

  const currentAvatar = avatars.find(a => a.id === profile.avatarId) || avatars[0];

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Profile Header */}
      <div className="p-6 sm:p-10 rounded-5xl glass-card border border-white/80 shadow-soft relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          {/* Avatar Icon */}
          <div className="w-20 h-20 rounded-4xl bg-gradient-to-tr from-pookie-200 via-white to-lavender-200 flex items-center justify-center text-3xl shadow-glow text-white shrink-0 border-2 border-white">
            {currentAvatar.isKitty ? (
              <HelloKittyFace size={54} bowColor={currentAvatar.bowColor} />
            ) : (
              <span>{currentAvatar.emoji}</span>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="font-display font-bold text-2xl sm:text-3xl text-rosewood-900 capitalize">
                {profile.name}
              </h1>
              <span className="text-pookie-500 text-xl">💗</span>
            </div>
            <p className="text-xs sm:text-sm text-rosewood-600 font-medium">
              Perfil de estilo exclusivo • Asistente vinculada: <strong>naimnecita ✨</strong>
            </p>
            <div className="flex items-center gap-2 pt-1 text-[11px] text-rosewood-500">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Privacidad 100% segura en dispositivo</span>
            </div>
          </div>
        </div>

        {/* Edit Tastes CTA */}
        <button
          onClick={() => { sounds.playPop(); onEditTastes(); }}
          className="pookie-gradient-btn px-6 py-3.5 rounded-3xl text-white font-bold text-xs sm:text-sm shadow-soft flex items-center gap-2 transition"
        >
          <Edit3 className="w-4 h-4" />
          <span>Editar mis gustos</span>
        </button>
      </div>

      {/* Avatar Selector */}
      <div className="p-6 rounded-4xl bg-white/80 backdrop-blur-xl border border-pookie-200/80 shadow-soft">
        <h3 className="font-display font-bold text-sm text-rosewood-800 uppercase tracking-wider mb-3">
          Elige tu avatar chic
        </h3>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
          {avatars.map((av) => {
            const isSelected = (profile.avatarId || 'kitty-classic') === av.id;
            return (
              <button
                key={av.id}
                onClick={() => handleSelectAvatar(av)}
                className={`p-3 rounded-2xl flex flex-col items-center justify-center transition border ${
                  isSelected
                    ? 'border-pookie-500 bg-pookie-100/90 shadow-soft ring-2 ring-pookie-300'
                    : 'border-pookie-100 bg-white hover:bg-pookie-50/60'
                }`}
              >
                {av.isKitty ? (
                  <HelloKittyFace size={32} bowColor={av.bowColor} />
                ) : (
                  <span className="text-2xl">{av.emoji}</span>
                )}
                <span className="text-[10px] font-bold text-rosewood-700 mt-1 truncate max-w-full">
                  {av.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Statistics Counter Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-pink-50/80 border border-pink-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white text-pookie-600 flex items-center justify-center shadow-xs">
            <Heart className="w-6 h-6 fill-pookie-500 text-pookie-500" />
          </div>
          <div>
            <span className="text-xs font-bold text-rosewood-600 uppercase">En tu Wishlist</span>
            <h4 className="font-display font-bold text-2xl text-rosewood-900">{wishlistCount} artículos</h4>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-purple-50/80 border border-purple-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white text-lavender-600 flex items-center justify-center shadow-xs">
            <CalendarIcon className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-rosewood-600 uppercase">Citas agendadas</span>
            <h4 className="font-display font-bold text-2xl text-rosewood-900">{eventsCount} eventos</h4>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-rose-50/80 border border-rose-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white text-rose-500 flex items-center justify-center shadow-xs">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-rosewood-600 uppercase">Presupuesto tipo</span>
            <h4 className="font-display font-bold text-2xl text-rosewood-900">{profile.budgetAmountTypical || 80} €</h4>
          </div>
        </div>
      </div>

      {/* Taste Preferences Breakdown */}
      <div className="p-6 sm:p-8 rounded-5xl glass-card border border-white/80 shadow-soft space-y-6">
        <div className="flex items-center justify-between border-b border-pookie-100 pb-4">
          <div>
            <h2 className="font-display font-bold text-xl text-rosewood-900">
              Tus Gustos Autorizados
            </h2>
            <p className="text-xs text-rosewood-600">
              Naimnecita consulta estos datos antes de recomendarte ropa, belleza o eventos.
            </p>
          </div>
          <button
            onClick={() => { sounds.playPop(); onEditTastes(); }}
            className="text-xs font-bold text-pookie-600 hover:underline flex items-center gap-1"
          >
            <span>Cambiar preferencias</span>
            <Edit3 className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Colors */}
          <div className="p-4 rounded-3xl bg-white/70 border border-pookie-100">
            <span className="text-xs font-bold text-rosewood-500 uppercase tracking-wider block mb-2">
              🎨 Colores Favoritos
            </span>
            <div className="flex flex-wrap gap-2">
              {profile.colors.map((c) => (
                <span key={c} className="px-3 py-1 rounded-full bg-pookie-100 text-pookie-800 text-xs font-semibold">
                  {c}
                </span>
              ))}
            </div>
          </div>

          {/* Clothing Styles */}
          <div className="p-4 rounded-3xl bg-white/70 border border-pookie-100">
            <span className="text-xs font-bold text-rosewood-500 uppercase tracking-wider block mb-2">
              👗 Estilos de Ropa
            </span>
            <div className="flex flex-wrap gap-2">
              {profile.clothingStyles.map((s) => (
                <span key={s} className="px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-semibold">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Outfit Occasions */}
          <div className="p-4 rounded-3xl bg-white/70 border border-pookie-100">
            <span className="text-xs font-bold text-rosewood-500 uppercase tracking-wider block mb-2">
              🥂 Ocasiones Habituales
            </span>
            <div className="flex flex-wrap gap-2">
              {profile.outfitTypes.map((o) => (
                <span key={o} className="px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-semibold">
                  {o}
                </span>
              ))}
            </div>
          </div>

          {/* Beauty & Skincare */}
          <div className="p-4 rounded-3xl bg-white/70 border border-pookie-100">
            <span className="text-xs font-bold text-rosewood-500 uppercase tracking-wider block mb-2">
              🧴 Belleza & Skincare
            </span>
            <div className="flex flex-wrap gap-2">
              {profile.beautyPreferences.map((b) => (
                <span key={b} className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* Accessories */}
          <div className="p-4 rounded-3xl bg-white/70 border border-pookie-100">
            <span className="text-xs font-bold text-rosewood-500 uppercase tracking-wider block mb-2">
              💍 Accesorios
            </span>
            <div className="flex flex-wrap gap-2">
              {profile.accessories.map((a) => (
                <span key={a} className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold">
                  {a}
                </span>
              ))}
            </div>
          </div>

          {/* Favorite Stores */}
          <div className="p-4 rounded-3xl bg-white/70 border border-pookie-100">
            <span className="text-xs font-bold text-rosewood-500 uppercase tracking-wider block mb-2">
              🛍️ Tiendas Preferidas
            </span>
            <div className="flex flex-wrap gap-2">
              {profile.favoriteStores.map((st) => (
                <span key={st} className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold">
                  {st}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Dislikes */}
        {profile.dislikes.length > 0 && (
          <div className="p-4 rounded-3xl bg-rose-50/70 border border-rose-200">
            <span className="text-xs font-bold text-rose-800 uppercase tracking-wider block mb-2">
              🙅‍♀️ Lo que NO te gusta (Reglas de exclusión para la IA)
            </span>
            <div className="flex flex-wrap gap-2">
              {profile.dislikes.map((d) => (
                <span key={d} className="px-3 py-1 rounded-full bg-white text-rose-700 text-xs font-semibold border border-rose-200">
                  {d}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Additional Notes */}
        {profile.additionalNotes && (
          <div className="p-4 rounded-3xl bg-pookie-50/60 border border-pookie-200">
            <span className="text-xs font-bold text-pookie-800 uppercase tracking-wider block mb-1">
              💌 Notas personales para naimnecita
            </span>
            <p className="text-xs text-rosewood-700 italic">
              "{profile.additionalNotes}"
            </p>
          </div>
        )}

        {/* Carta Secreta de Amor para Sofía 💌 */}
        <div className="p-6 sm:p-8 rounded-5xl bg-gradient-to-br from-pink-100 via-rose-50 to-lavender-100 border-2 border-pink-300/80 shadow-soft relative overflow-hidden mt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-soft flex items-center justify-center text-2xl border border-pink-200 shrink-0">
                💌
              </div>
              <div>
                <h3 className="font-display font-bold text-base sm:text-lg text-rosewood-900 flex items-center gap-1.5">
                  <span>Mensaje Secreto para Sofía</span>
                  <Heart className="w-4 h-4 fill-pookie-500 text-pookie-500 animate-pulse" />
                </h3>
                <p className="text-xs text-rosewood-600">
                  Un mensaje sagrado guardado en el corazón de Pookie Space
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                sounds.playSparkle();
                firePookieConfetti();
                setShowSecretLetter(!showSecretLetter);
              }}
              className="px-5 py-2.5 rounded-2xl pookie-gradient-btn text-white text-xs font-bold shadow-soft flex items-center gap-2 self-start sm:self-auto transition hover:opacity-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>{showSecretLetter ? 'Ocultar Carta' : 'Abrir Carta Secreta ✨'}</span>
            </button>
          </div>

          {showSecretLetter && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="mt-6 p-6 sm:p-8 rounded-4xl bg-white/95 border border-pink-200 shadow-soft space-y-4 relative"
            >
              <div className="flex items-center justify-between border-b border-pink-100 pb-3">
                <span className="text-xs font-extrabold text-pookie-600 uppercase tracking-wider flex items-center gap-1.5">
                  <HelloKittyBow size={16} />
                  <span>Para mi niña hermosa, Sofía</span>
                </span>
                <span className="text-xs text-rosewood-400 font-medium">Por siempre y para siempre ♾️</span>
              </div>

              <div className="text-sm sm:text-base text-rosewood-800 leading-relaxed font-medium space-y-3 italic">
                <p>
                  "Te amo demasiado. Eres como mi alma gemela, la pareja que nunca tuve... eres absolutamente todo para mí."
                </p>
                <p>
                  "Amo cada detalle de ti, tu sonrisa, tu forma de ser y todo lo que eres. Y quiero que tengas grabado en el alma esto:"
                </p>
                <p className="font-bold text-pookie-600 not-italic text-sm sm:text-base bg-pink-50/90 p-4 rounded-2xl border border-pink-200 shadow-xs">
                  ✨ "Si algún día realmente me necesitas, aunque el mundo entero esté en contra tuya, yo estaré a tu lado contra el mundo entero." ✨
                </p>
              </div>

              <div className="pt-3 flex items-center justify-between text-xs text-rosewood-500 border-t border-pink-100">
                <span>Con todo el amor del mundo</span>
                <span className="font-bold text-pookie-600 flex items-center gap-1">
                  Pookie Space 💗
                </span>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
