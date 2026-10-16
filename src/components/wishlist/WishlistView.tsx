import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Search, 
  Plus, 
  Trash2, 
  ExternalLink, 
  CheckCircle2, 
  Sparkles, 
  Filter, 
  Tag, 
  X
} from 'lucide-react';
import { WishlistItem, WishlistCategory } from '../../types';
import { storageService } from '../../services/storageService';
import { sounds } from '../../utils/soundEffects';
import { firePookieConfetti } from '../../utils/confetti';
import { getStoreSearchUrl } from '../../services/storeSearchService';
import { HelloKittyFace, HelloKittyBow } from '../common/HelloKitty';

export const WishlistView: React.FC = () => {
  const [items, setItems] = useState<WishlistItem[]>(storageService.getWishlist());
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [showModal, setShowModal] = useState(false);

  // New item form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<WishlistCategory>('Outfits');
  const [newPrice, setNewPrice] = useState<number>(29.99);
  const [newStore, setNewStore] = useState<'Amazon' | 'AliExpress' | 'Zara' | 'Sephora' | 'Stradivarius' | 'Otro'>('Amazon');
  const [newUrl, setNewUrl] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');

  const reload = () => {
    setItems(storageService.getWishlist());
  };

  useEffect(() => {
    window.addEventListener('pookie_storage_update', reload);
    return () => window.removeEventListener('pookie_storage_update', reload);
  }, []);

  const categories = ['Todas', 'Outfits', 'Belleza & Skincare', 'Accesorios', 'Decoración & Lifestyle', 'Varios'];

  // Filter items
  const filteredItems = items.filter(item => {
    const matchesCategory = selectedCategory === 'Todas' || item.category === selectedCategory;
    const matchesSearch = 
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      (item.notes && item.notes.toLowerCase().includes(search.toLowerCase())) ||
      item.store.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Calculate totals
  const totalValue = items.reduce((acc, curr) => acc + (curr.price || 0), 0);
  const purchasedCount = items.filter(i => i.isPurchased).length;

  const handleTogglePurchased = (id: string) => {
    sounds.playSparkle();
    firePookieConfetti();
    storageService.toggleWishlistPurchased(id);
  };

  const handleDelete = (id: string, title: string) => {
    sounds.playPop();
    if (confirm(`¿Quieres eliminar "${title}" de tu Wishlist?`)) {
      storageService.removeWishlistItem(id);
    }
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    sounds.playSparkle();
    firePookieConfetti();

    // Auto-generate store url if blank
    const finalUrl = newUrl.trim() || getStoreSearchUrl(newStore, newTitle);

    storageService.addWishlistItem({
      title: newTitle.trim(),
      category: newCategory,
      price: Number(newPrice) || 0,
      currency: '€',
      store: newStore,
      storeUrl: finalUrl,
      imageUrl: newImageUrl.trim() || undefined,
      notes: newNotes.trim() || undefined,
      isPurchased: false,
      aiRecommended: false
    });

    // Reset form
    setNewTitle('');
    setNewNotes('');
    setNewUrl('');
    setNewImageUrl('');
    setShowModal(false);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Header with Stats */}
      <div className="p-6 sm:p-8 rounded-5xl glass-card border border-white/80 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        {/* Hello Kitty Watermark */}
        <div className="absolute -right-4 -bottom-4 opacity-15 pointer-events-none select-none hidden md:block">
          <HelloKittyFace size={150} />
        </div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pookie-100 text-pookie-700 text-xs font-bold mb-2">
            <HelloKittyBow size={16} />
            <span>Wishlist x Hello Kitty 🎀</span>
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-rosewood-900 flex items-center gap-2">
            <span>Wishlist de pookie 💗</span>
          </h1>
          <p className="text-xs sm:text-sm text-rosewood-600 mt-1">
            Organiza tus caprichos, prendas y cosméticos favoritos con enlaces directos y precios reales.
          </p>
        </div>

        {/* Stats Pill & Add Button */}
        <div className="flex items-center gap-3">
          <div className="bg-white/80 border border-pookie-200 rounded-3xl px-4 py-2 text-right">
            <span className="text-[10px] text-rosewood-500 font-bold uppercase block">
              Valor Total
            </span>
            <span className="font-display font-bold text-lg text-pookie-600">
              {totalValue.toFixed(2)} €
            </span>
          </div>

          <button
            onClick={() => { sounds.playPop(); setShowModal(true); }}
            className="pookie-gradient-btn px-5 py-3 rounded-3xl text-white font-bold text-xs sm:text-sm shadow-glow flex items-center gap-2 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Añadir deseo</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-4">
        {/* Search Input */}
        <div className="flex items-center gap-2 p-2 bg-white/80 rounded-3xl border border-pookie-200 shadow-inner-soft">
          <Search className="w-4 h-4 text-rosewood-400 ml-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar en tu wishlist por nombre, tienda o notas..."
            className="w-full py-2 px-2 bg-transparent text-xs sm:text-sm text-rosewood-900 placeholder:text-rosewood-400 focus:outline-none"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { sounds.playPop(); setSelectedCategory(cat); }}
              className={`px-4 py-2 rounded-full font-bold whitespace-nowrap transition border ${
                selectedCategory === cat
                  ? 'bg-pookie-500 text-white border-pookie-500 shadow-soft'
                  : 'bg-white/80 text-rosewood-700 border-pookie-200 hover:bg-pookie-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Wishlist Items */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-5xl bg-white/50 border border-dashed border-pookie-200 space-y-3">
          <span className="text-4xl block">🛍️</span>
          <h3 className="font-display font-bold text-lg text-rosewood-900">
            No hay deseos que coincidan
          </h3>
          <p className="text-xs text-rosewood-600 max-w-sm mx-auto">
            Añade un nuevo capricho manualmente o pídele a naimnecita que te recomiende un outfit.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`rounded-4xl glass-card border transition-all flex flex-col justify-between overflow-hidden group ${
                  item.isPurchased
                    ? 'opacity-65 border-emerald-200 bg-emerald-50/30'
                    : 'border-white/90 hover:shadow-soft-lg'
                }`}
              >
                {/* Image Section */}
                <div className="h-44 w-full bg-pookie-100/60 relative overflow-hidden flex items-center justify-center">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-pookie-400">
                      <Sparkles className="w-8 h-8 mb-1 animate-pulse" />
                      <span className="text-[11px] font-bold">Pookie Selection ✨</span>
                    </div>
                  )}

                  {/* Store Badge */}
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-bold text-rosewood-800 shadow-xs border border-pookie-100">
                    {item.store}
                  </span>

                  {/* Purchased Stamp if bought */}
                  {item.isPurchased && (
                    <div className="absolute inset-0 bg-emerald-900/20 backdrop-blur-xs flex items-center justify-center">
                      <span className="px-4 py-1.5 rounded-full bg-emerald-600 text-white font-extrabold text-xs shadow-md">
                        ¡Comprado! 💖
                      </span>
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[10px] font-bold text-pookie-600 uppercase tracking-wider">
                        {item.category}
                      </span>
                      <span className="text-base font-extrabold text-rosewood-900">
                        {item.price} {item.currency}
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-base text-rosewood-900 line-clamp-2">
                      {item.title}
                    </h3>

                    {item.notes && (
                      <p className="text-xs text-rosewood-600 mt-2 font-medium line-clamp-2 italic">
                        "{item.notes}"
                      </p>
                    )}
                  </div>

                  {/* Bottom Actions */}
                  <div className="mt-5 pt-3 border-t border-pookie-100 flex items-center justify-between text-xs">
                    {/* Toggle Purchased */}
                    <button
                      onClick={() => handleTogglePurchased(item.id)}
                      className={`flex items-center gap-1.5 font-bold transition ${
                        item.isPurchased
                          ? 'text-emerald-600 hover:text-emerald-700'
                          : 'text-rosewood-500 hover:text-emerald-600'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{item.isPurchased ? 'Comprado' : 'Pendiente'}</span>
                    </button>

                    <div className="flex items-center gap-2">
                      {/* External Store Link */}
                      <a
                        href={item.storeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-pookie-100/80 hover:bg-pookie-200 text-pookie-700 transition"
                        title="Ver producto en la tienda"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(item.id, item.title)}
                        className="p-2 rounded-xl hover:bg-rose-100 text-rosewood-400 hover:text-rose-600 transition"
                        title="Eliminar de wishlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Modal: Añadir Deseo */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              className="w-full max-w-lg bg-white rounded-5xl p-6 sm:p-8 shadow-soft-lg border border-pookie-200 space-y-5"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-xl text-rosewood-900">
                  Añadir nuevo deseo 💖
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 rounded-full hover:bg-pookie-100 text-rosewood-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddItem} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-rosewood-800 uppercase mb-1">
                    Título o prenda *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Ej. Bolso de mano perla con cadena"
                    className="w-full p-3 rounded-2xl border border-pookie-200 text-xs sm:text-sm text-rosewood-900 focus:outline-none focus:ring-2 focus:ring-pookie-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-rosewood-800 uppercase mb-1">
                      Categoría
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as WishlistCategory)}
                      className="w-full p-3 rounded-2xl border border-pookie-200 text-xs sm:text-sm text-rosewood-900 focus:outline-none focus:ring-2 focus:ring-pookie-400 bg-white"
                    >
                      <option value="Outfits">Outfits</option>
                      <option value="Belleza & Skincare">Belleza & Skincare</option>
                      <option value="Accesorios">Accesorios</option>
                      <option value="Decoración & Lifestyle">Decoración</option>
                      <option value="Varios">Varios</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-rosewood-800 uppercase mb-1">
                      Precio aprox (€)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={newPrice}
                      onChange={(e) => setNewPrice(parseFloat(e.target.value) || 0)}
                      className="w-full p-3 rounded-2xl border border-pookie-200 text-xs sm:text-sm text-rosewood-900 focus:outline-none focus:ring-2 focus:ring-pookie-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-rosewood-800 uppercase mb-1">
                      Tienda
                    </label>
                    <select
                      value={newStore}
                      onChange={(e) => setNewStore(e.target.value as any)}
                      className="w-full p-3 rounded-2xl border border-pookie-200 text-xs sm:text-sm text-rosewood-900 focus:outline-none focus:ring-2 focus:ring-pookie-400 bg-white"
                    >
                      <option value="Amazon">Amazon</option>
                      <option value="AliExpress">AliExpress</option>
                      <option value="Zara">Zara</option>
                      <option value="Sephora">Sephora</option>
                      <option value="Stradivarius">Stradivarius</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-rosewood-800 uppercase mb-1">
                      Enlace web (opcional)
                    </label>
                    <input
                      type="url"
                      value={newUrl}
                      onChange={(e) => setNewUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full p-3 rounded-2xl border border-pookie-200 text-xs sm:text-sm text-rosewood-900 focus:outline-none focus:ring-2 focus:ring-pookie-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-rosewood-800 uppercase mb-1">
                    URL de imagen (opcional)
                  </label>
                  <input
                    type="url"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full p-3 rounded-2xl border border-pookie-200 text-xs sm:text-sm text-rosewood-900 focus:outline-none focus:ring-2 focus:ring-pookie-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-rosewood-800 uppercase mb-1">
                    Notas o por qué te encanta
                  </label>
                  <textarea
                    rows={2}
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    placeholder="Me encanta para llevar con el vestido blanco..."
                    className="w-full p-3 rounded-2xl border border-pookie-200 text-xs sm:text-sm text-rosewood-900 focus:outline-none focus:ring-2 focus:ring-pookie-400"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-5 py-2.5 rounded-full text-xs font-semibold text-rosewood-600 hover:bg-pookie-100"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="pookie-gradient-btn px-6 py-2.5 rounded-full text-white font-bold text-xs sm:text-sm shadow-soft"
                  >
                    Guardar deseo ✨
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
