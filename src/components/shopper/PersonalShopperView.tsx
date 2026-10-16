import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, 
  Sparkles, 
  Heart, 
  ExternalLink, 
  Sliders, 
  Plus, 
  ShieldCheck, 
  Check, 
  Info,
  DollarSign
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { getStoreSearchUrl } from '../../services/storeSearchService';
import { getDirectProductFor } from '../../data/verifiedProducts';
import { OutfitRecommendation, OutfitPiece } from '../../types';
import { sounds } from '../../utils/soundEffects';
import { firePookieConfetti } from '../../utils/confetti';
import { HelloKittyFace, HelloKittyBow, HelloKittyWithHeart } from '../common/HelloKitty';

export const PersonalShopperView: React.FC = () => {
  const profile = storageService.getProfile();

  const [occasion, setOccasion] = useState('Cena con amigas');
  const [budget, setBudget] = useState(profile.budgetAmountTypical || 80);
  const [styleTone, setStyleTone] = useState(profile.clothingStyles[0] || 'Coquette Chic');
  const [loading, setLoading] = useState(false);
  const [currentOutfit, setCurrentOutfit] = useState<OutfitRecommendation | null>(null);
  const [customPrompt, setCustomPrompt] = useState('Naimnecita, quiero un outfit para una cena con un presupuesto de 80 €');

  const occasionsList = [
    'Cena con amigas 🥂',
    'Cita romántica 🍷',
    'Brunch de domingo 🥞',
    'Universidad / Trabajo chic 📚',
    'Noche de fiesta 🪩',
    'Boda / Evento especial 💍',
    'Paseo casual comfy ☕'
  ];

  const handleGenerateOutfit = (targetBudget?: number, targetOccasion?: string) => {
    sounds.playPop();
    setLoading(true);

    const activeBudget = targetBudget || budget;
    const activeOccasion = targetOccasion || occasion;

    setTimeout(() => {
      const mainColor = profile.colors[0] || 'Rosa pastel';
      const secondaryColor = profile.colors[1] || 'Blanco perlado';

      const isFormal = activeOccasion.includes('Cena') || activeOccasion.includes('Cita') || activeOccasion.includes('Boda') || activeOccasion.includes('fiesta');

      const rawPieces = isFormal
        ? [
            {
              category: 'Vestido' as const,
              defaultName: `Vestido midi fluido en tono ${mainColor}`,
              budgetShare: 0.45,
            },
            {
              category: 'Calzado' as const,
              defaultName: `Sandalias de tacón fino o kitten heels en ${secondaryColor}`,
              budgetShare: 0.35,
            },
            {
              category: 'Bolso' as const,
              defaultName: `Mini bolso Hello Kitty con cadena dorada`,
              budgetShare: 0.20,
            }
          ]
        : [
            {
              category: 'Top' as const,
              defaultName: `Top de punto fino o blusa vaporosa en tono ${mainColor}`,
              budgetShare: 0.35,
            },
            {
              category: 'Bottom' as const,
              defaultName: `Pantalón ancho palazzo o falda tableada ${secondaryColor}`,
              budgetShare: 0.40,
            },
            {
              category: 'Accesorio' as const,
              defaultName: `Set de accesorios dorados minimalistas`,
              budgetShare: 0.25,
            }
          ];

      const pieces: OutfitPiece[] = rawPieces.map(raw => {
        const estPrice = Math.round(activeBudget * raw.budgetShare);
        const verified = getDirectProductFor(raw.category, activeOccasion);

        return {
          name: verified?.name || raw.defaultName,
          category: raw.category,
          description: verified?.description || `Seleccionado con amor por naimnecita para ${activeOccasion.toLowerCase()}.`,
          estimatedPrice: verified?.estimatedPrice || estPrice,
          colorHint: verified?.colorHint || mainColor,
          directProductUrl: verified?.directProductUrl,
          directStore: verified?.store,
          imageUrl: verified?.imageUrl,
          amazonSearchUrl: getStoreSearchUrl('Amazon', `${verified?.name || raw.defaultName}`, 'ropa', estPrice),
          aliexpressSearchUrl: getStoreSearchUrl('AliExpress', `${verified?.name || raw.defaultName}`, 'ropa', estPrice),
        };
      });

      const outfitResult: OutfitRecommendation = {
        id: `outfit-${Date.now()}`,
        title: `Propuesta ${styleTone} para ${activeOccasion}`,
        occasion: activeOccasion,
        estimatedBudget: activeBudget,
        styleVibe: `${styleTone} con armonía de ${mainColor} y ${secondaryColor}`,
        explanation: `Naimnecita ha seleccionado esta combinación respetando tu presupuesto total de ${activeBudget} € y tus preferencias por el estilo ${styleTone}. Tienes el botón de compra directo al producto verificado y enlaces alternativos para comparar disponibilidad real.`,
        pieces: pieces,
        createdAt: new Date().toISOString()
      };

      setCurrentOutfit(outfitResult);
      setLoading(false);
      sounds.playSparkle();
      firePookieConfetti();
    }, 600);
  };

  const handleSaveToWishlist = (piece: OutfitPiece) => {
    sounds.playSparkle();
    firePookieConfetti();
    storageService.addWishlistItem({
      title: piece.name,
      category: 'Outfits',
      price: piece.estimatedPrice,
      currency: '€',
      store: 'Amazon',
      storeUrl: piece.amazonSearchUrl,
      notes: `Recomendado para ${occasion} (${styleTone}) por naimnecita.`,
      isPurchased: false,
      aiRecommended: true,
    });
    alert(`¡"${piece.name}" guardado en tu Wishlist con éxito! 💗`);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-5xl glass-card border border-white/80 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        {/* Hello Kitty Watermark */}
        <div className="absolute -right-4 -bottom-6 opacity-15 pointer-events-none select-none hidden md:block">
          <HelloKittyFace size={160} />
        </div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pookie-100 text-pookie-700 text-xs font-bold mb-2">
            <HelloKittyBow size={16} />
            <span>Personal Shopper x Hello Kitty 🎀</span>
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-rosewood-900 flex items-center gap-2">
            <span>Encuentra tu Look Soñado ✨</span>
          </h1>
          <p className="text-xs sm:text-sm text-rosewood-600 mt-1 max-w-xl">
            Cuéntanos qué plan tienes y cuánto quieres gastar. Naimnecita diseñará una combinación perfecta basada en tus gustos personales con filtros de precio reales.
          </p>
        </div>

        {/* Quick prompt test button */}
        <button
          onClick={() => {
            setBudget(80);
            setOccasion('Cena con amigas 🥂');
            handleGenerateOutfit(80, 'Cena con amigas 🥂');
          }}
          className="pookie-gradient-btn px-6 py-3 rounded-full text-white font-bold text-xs sm:text-sm shadow-glow shrink-0 transition"
        >
          Outfit Cena 80 € 🍷
        </button>
      </div>

      {/* Control Panel: Occasion, Budget, Style */}
      <div className="p-6 sm:p-8 rounded-4xl bg-white/85 backdrop-blur-xl border border-pookie-200/80 shadow-soft space-y-6">
        {/* Occasion Selection */}
        <div>
          <label className="block text-xs font-bold text-rosewood-800 uppercase tracking-wider mb-2.5">
            1. ¿Para qué ocasión es el outfit?
          </label>
          <div className="flex flex-wrap gap-2">
            {occasionsList.map((occ) => (
              <button
                key={occ}
                onClick={() => { sounds.playPop(); setOccasion(occ); }}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition border ${
                  occasion === occ
                    ? 'bg-pookie-500 text-white border-pookie-500 shadow-soft'
                    : 'bg-pookie-50/70 text-rosewood-700 border-pookie-100 hover:bg-pookie-100'
                }`}
              >
                {occ}
              </button>
            ))}
          </div>
        </div>

        {/* Budget Slider & Quick Pills */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-rosewood-800 uppercase tracking-wider">
              2. Presupuesto estimado total
            </label>
            <span className="text-base font-extrabold text-pookie-600 bg-pookie-50 px-3 py-1 rounded-full border border-pookie-200">
              {budget} €
            </span>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="range"
              min={30}
              max={300}
              step={5}
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full h-2 bg-pookie-100 rounded-lg appearance-none cursor-pointer accent-pookie-500"
            />
          </div>

          <div className="flex items-center gap-2 mt-2">
            {[40, 60, 80, 120, 180].map((b) => (
              <button
                key={b}
                onClick={() => { sounds.playPop(); setBudget(b); }}
                className={`px-3 py-1 rounded-xl text-xs font-semibold border transition ${
                  budget === b
                    ? 'bg-pookie-500 text-white border-pookie-500'
                    : 'bg-white text-rosewood-700 border-pookie-200 hover:bg-pookie-50'
                }`}
              >
                {b} €
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={() => handleGenerateOutfit()}
          disabled={loading}
          className="w-full py-4 rounded-3xl pookie-gradient-btn text-white font-bold text-sm shadow-glow flex items-center justify-center gap-2 transition"
        >
          <Sparkles className="w-5 h-5" />
          <span>{loading ? 'naimnecita está diseñando tu look...' : 'Generar Combinación Personalizada ✨'}</span>
        </button>
      </div>

      {/* Outfit Results Section */}
      {currentOutfit && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header of recommendation */}
          <div className="p-6 rounded-4xl bg-gradient-to-r from-pookie-50 via-white to-lavender-50 border border-pookie-200/80 shadow-soft">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
              <h3 className="font-display font-bold text-xl text-rosewood-900">
                {currentOutfit.title} 💗
              </h3>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-pookie-500 text-white font-extrabold text-xs shadow-soft">
                  Presupuesto: {currentOutfit.estimatedBudget} €
                </span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-rosewood-700 leading-relaxed font-medium">
              {currentOutfit.explanation}
            </p>
          </div>

          {/* Piece Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {currentOutfit.pieces.map((piece, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -4 }}
                className="p-5 rounded-4xl glass-card border border-white/90 shadow-soft flex flex-col justify-between overflow-hidden"
              >
                <div>
                  {/* Product Image Preview if available */}
                  {piece.imageUrl && (
                    <div className="relative w-full h-44 rounded-2xl overflow-hidden mb-3.5 bg-pookie-50 border border-pookie-100/80 shadow-xs">
                      <img
                        src={piece.imageUrl}
                        alt={piece.name}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        loading="lazy"
                      />
                      {piece.directStore && (
                        <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-white/95 backdrop-blur-md text-rosewood-800 text-[10px] font-extrabold shadow-xs border border-pookie-200">
                          {piece.directStore} Directo
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-pookie-100 text-pookie-700 text-[10px] font-bold uppercase">
                      {piece.category}
                    </span>
                    <span className="text-sm font-extrabold text-pookie-600">
                      ~{piece.estimatedPrice} €
                    </span>
                  </div>

                  <h4 className="font-display font-bold text-base text-rosewood-900 mt-1 line-clamp-2">
                    {piece.name}
                  </h4>
                  <p className="text-xs text-rosewood-600 mt-2 leading-relaxed">
                    {piece.description}
                  </p>
                  {piece.colorHint && (
                    <span className="inline-block mt-2 text-[11px] font-semibold text-rosewood-500">
                      Color sugerido: <strong className="text-pookie-600">{piece.colorHint}</strong>
                    </span>
                  )}
                </div>

                {/* Actions: Direct Link, Search Links, and Wishlist */}
                <div className="mt-5 pt-3 border-t border-pookie-100/70 space-y-2">
                  {/* DIRECT PRODUCT LINK BUTTON */}
                  {piece.directProductUrl && (
                    <a
                      href={piece.directProductUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-3 rounded-2xl pookie-gradient-btn text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-soft hover:shadow-glow transition"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Comprar Producto en {piece.directStore || 'Tienda'} 🛍️</span>
                      <ExternalLink className="w-3 h-3 ml-0.5" />
                    </a>
                  )}

                  {/* Alternate Search Links */}
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={piece.amazonSearchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-[11px] font-bold text-center flex items-center justify-center gap-1 transition"
                    >
                      <span>Amazon ES</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                    <a
                      href={piece.aliexpressSearchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-900 border border-red-200 text-[11px] font-bold text-center flex items-center justify-center gap-1 transition"
                    >
                      <span>AliExpress</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>

                  <button
                    onClick={() => handleSaveToWishlist(piece)}
                    className="w-full py-2 px-3 rounded-xl bg-pookie-100/90 hover:bg-pookie-200 text-pookie-700 text-xs font-bold flex items-center justify-center gap-1.5 transition"
                  >
                    <Heart className="w-3.5 h-3.5 fill-pookie-600" />
                    <span>Guardar en Wishlist</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Transparency & API Compliance Note */}
      <div className="p-5 rounded-3xl bg-pearl-100/80 border border-pookie-100 text-rosewood-600 text-xs space-y-2">
        <div className="flex items-center gap-2 text-rosewood-800 font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Arquitectura Transparente de Tiendas (Amazon & AliExpress)</span>
        </div>
        <p className="leading-relaxed">
          En cumplimiento estricto con las políticas de acceso y scraping, Pookie Space genera enlaces de búsqueda directa enriquecidos con parámetros de moda verificados. Las recomendaciones de precios son estimaciones estilísticas conceptuales para que conozcas la disponibilidad real en un solo clic sin inventar productos.
        </p>
      </div>
    </div>
  );
};
