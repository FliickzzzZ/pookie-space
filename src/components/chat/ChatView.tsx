import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Sparkles, 
  Heart, 
  Trash2, 
  Volume2, 
  VolumeX, 
  ExternalLink, 
  Calendar as CalendarIcon, 
  ShoppingBag, 
  Check, 
  Plus,
  Key,
  ShieldCheck,
  X
} from 'lucide-react';
import { ChatMessage, ActiveTab, OutfitRecommendation, WishlistItem, CalendarEvent } from '../../types';
import { geminiService } from '../../services/geminiService';
import { storageService } from '../../services/storageService';
import { sounds } from '../../utils/soundEffects';
import { firePookieConfetti } from '../../utils/confetti';
import { HelloKittyFace, HelloKittyBow } from '../common/HelloKitty';
import { MarkdownRenderer } from './MarkdownRenderer';

interface ChatViewProps {
  initialPrompt?: string;
  onNavigate: (tab: ActiveTab) => void;
}

export const ChatView: React.FC<ChatViewProps> = ({ initialPrompt, onNavigate }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(storageService.getChatHistory());
  const [input, setInput] = useState(initialPrompt || '');
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [groqKeyInput, setGroqKeyInput] = useState(storageService.getGroqApiKey());
  const [hasGroqKey, setHasGroqKey] = useState(!!storageService.getGroqApiKey());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSaveGroqKey = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playSparkle();
    storageService.setGroqApiKey(groqKeyInput);
    setHasGroqKey(!!groqKeyInput.trim());
    setShowKeyModal(false);
    firePookieConfetti();
  };

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // If initialPrompt was passed from Home, send it automatically
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim().length > 0) {
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    sounds.playPop();
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      sender: 'user',
      text: text,
      timestamp: new Date().toISOString()
    };

    const updated = [...messages, userMsg];
    setMessages(updated);
    storageService.saveChatHistory(updated);
    setInput('');
    setLoading(true);

    try {
      const response = await geminiService.sendMessage(text, updated);
      sounds.playSparkle();

      const aiMsg: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        sender: 'naimnecita',
        text: response.text,
        timestamp: new Date().toISOString(),
        actionCard: response.actionCard
      };

      const finalMessages = [...updated, aiMsg];
      setMessages(finalMessages);
      storageService.saveChatHistory(finalMessages);

      if (response.actionCard) {
        firePookieConfetti();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    sounds.playPop();
    if (confirm('¿Quieres reiniciar la conversación con naimnecita?')) {
      storageService.clearChatHistory();
      setMessages(storageService.getChatHistory());
    }
  };

  // Text-to-speech with natural Spanish voice
  const speakMessage = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const clean = text.replace(/[*_#`]/g, '');
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.lang = 'es-ES';
    utterance.pitch = 1.1; // Gentle sweet pitch
    utterance.rate = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // Quick Action: Add outfit piece to wishlist
  const handleAddPieceToWishlist = (piece: any) => {
    sounds.playSparkle();
    firePookieConfetti();
    storageService.addWishlistItem({
      title: piece.name,
      category: 'Outfits',
      price: piece.estimatedPrice || 25,
      currency: '€',
      store: 'Amazon',
      storeUrl: piece.amazonSearchUrl,
      notes: `Prenda recomendada por naimnecita: ${piece.description || ''}`,
      isPurchased: false,
      aiRecommended: true,
    });
    alert(`¡Añadido a tu Wishlist! 💗 "${piece.name}"`);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-135px)] md:h-[calc(100vh-100px)] max-w-4xl mx-auto glass-card rounded-4xl border border-white/80 shadow-soft-lg overflow-hidden">
      {/* Top Chat Header */}
      <div className="px-6 py-4 bg-white/70 border-b border-pookie-100/90 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pookie-200 via-white to-lavender-200 flex items-center justify-center shadow-soft border border-pookie-200 relative p-1">
            <HelloKittyFace size={36} />
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="font-display font-bold text-base sm:text-lg text-rosewood-900">
                naimnecita
              </h2>
              <HelloKittyBow size={15} />
            </div>
            <p className="text-xs text-rosewood-600 font-medium">
              Tu asistente personal inteligente • Modo consentidora Hello Kitty 🎀
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sounds.playPop();
              setShowKeyModal(true);
            }}
            title="Configurar IA Groq (Local)"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition ${
              hasGroqKey
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                : 'bg-pookie-50 text-pookie-700 border-pookie-200 hover:bg-pookie-100'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {hasGroqKey ? 'Groq Activo' : 'Clave IA'}
            </span>
          </button>

          <button
            onClick={handleClearHistory}
            title="Reiniciar chat"
            className="p-2 rounded-xl text-rosewood-400 hover:text-rose-500 hover:bg-rose-50 transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Groq Local Key Modal */}
      <AnimatePresence>
        {showKeyModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-rosewood-900/40 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white/95 backdrop-blur-xl border border-pookie-200 rounded-3xl p-6 max-w-md w-full shadow-soft-lg space-y-4"
            >
              <div className="flex items-center justify-between border-b border-pookie-100 pb-3">
                <div className="flex items-center gap-2">
                  <HelloKittyBow size={20} />
                  <h3 className="font-display font-bold text-base text-rosewood-900">
                    IA Inteligente Groq (Local)
                  </h3>
                </div>
                <button
                  onClick={() => setShowKeyModal(false)}
                  className="p-1 rounded-full text-rosewood-400 hover:bg-pookie-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-rosewood-600 leading-relaxed">
                Tus conversaciones con naimnecita se almacenan <strong>100% en la memoria local de tu dispositivo</strong> (localStorage). Tu clave no se sube a ningún servidor ni repositorio.
              </p>

              <form onSubmit={handleSaveGroqKey} className="space-y-3">
                <label className="block text-xs font-bold text-rosewood-800 uppercase tracking-wider">
                  Clave API de Groq:
                </label>
                <input
                  type="password"
                  value={groqKeyInput}
                  onChange={(e) => setGroqKeyInput(e.target.value)}
                  placeholder="gsk_..."
                  className="w-full p-3 rounded-2xl border border-pookie-200 text-xs sm:text-sm text-rosewood-900 focus:outline-none focus:ring-2 focus:ring-pookie-400 font-mono"
                />
                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setShowKeyModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-medium text-rosewood-600 hover:bg-pookie-50 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="pookie-gradient-btn px-5 py-2 rounded-xl text-white font-bold text-xs shadow-soft transition"
                  >
                    Guardar localmente
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          const msgText = typeof msg.text === 'string' ? msg.text : '';
          const hasTable = !isUser && msgText.includes('|');
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-end gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-full bg-white border border-pookie-200 flex items-center justify-center shrink-0 shadow-xs mb-1 p-0.5">
                  <HelloKittyFace size={26} />
                </div>
              )}

              <div
                className={`${
                  hasTable
                    ? 'w-full max-w-[98%] sm:max-w-[94%]'
                    : 'max-w-[88%] sm:max-w-[78%]'
                } rounded-3xl p-4 sm:p-5 shadow-soft transition ${
                  isUser
                    ? 'bg-gradient-to-br from-pookie-500 to-pookie-600 text-white rounded-br-none'
                    : 'bg-white/95 text-rosewood-900 border border-pookie-100/90 rounded-bl-none'
                }`}
              >
                {/* Message Header with Read Aloud */}
                <div className="flex items-center justify-between gap-4 mb-1">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider ${
                      isUser ? 'text-pookie-200' : 'text-pookie-600'
                    }`}
                  >
                    {isUser ? 'Tú (pookie)' : 'naimnecita ✨'}
                  </span>
                  {!isUser && (
                    <button
                      onClick={() => speakMessage(msgText)}
                      title="Escuchar mensaje en voz alta"
                      className="text-rosewood-400 hover:text-pookie-600 transition"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Message Body with Rich Markdown & Guaranteed Store Links */}
                <div className="text-xs sm:text-sm font-medium leading-relaxed">
                  <MarkdownRenderer content={msgText} isUser={isUser} />
                </div>

                {/* ============================================================ */}
                {/* ACTION CARDS (Event created, Outfit suggested, Wishlist added) */}
                {/* ============================================================ */}
                {msg.actionCard && msg.actionCard.data && (
                  <div className="mt-4 pt-3 border-t border-pookie-200/50">
                    {/* Action 1: Event Created */}
                    {msg.actionCard.type === 'event_created' && (
                      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-pookie-50 to-lavender-50 border border-pookie-200 flex items-center justify-between gap-3 text-rosewood-900">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-pookie-500 text-white flex items-center justify-center shrink-0">
                            <CalendarIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-pookie-600 uppercase">
                              Cita Agendada ✨
                            </span>
                            <h4 className="text-xs font-bold">{msg.actionCard.data?.title || 'Cita agendada'}</h4>
                            <p className="text-[11px] text-rosewood-600">
                              {msg.actionCard.data?.date} a las {msg.actionCard.data?.startTime}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => { sounds.playPop(); onNavigate('calendario'); }}
                          className="px-3 py-1.5 rounded-xl bg-white text-pookie-600 border border-pookie-200 text-xs font-bold hover:bg-pookie-50 transition shrink-0"
                        >
                          Ver calendario
                        </button>
                      </div>
                    )}

                    {/* Action 2: Outfit Suggested */}
                    {msg.actionCard.type === 'outfit_suggested' && (
                      <div className="space-y-2.5 text-rosewood-900">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-pookie-600 flex items-center gap-1.5">
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>{msg.actionCard.data?.title || 'Outfit recomendado'}</span>
                          </span>
                          <span className="text-xs font-extrabold text-pookie-700 bg-pookie-100 px-2.5 py-0.5 rounded-full">
                            Total: ~{msg.actionCard.data?.estimatedBudget || 80} €
                          </span>
                        </div>

                        {/* Pieces list */}
                        <div className="space-y-2.5">
                          {(msg.actionCard.data?.pieces || []).map((piece: any, idx: number) => (
                            <div
                              key={idx}
                              className="p-3 rounded-2xl bg-white border border-pookie-100 shadow-xs flex flex-col gap-2"
                            >
                              <div className="flex items-start gap-3">
                                {piece.imageUrl && (
                                  <img
                                    src={piece.imageUrl}
                                    alt={piece.name}
                                    className="w-14 h-14 rounded-xl object-cover shrink-0 border border-pookie-100"
                                    loading="lazy"
                                  />
                                )}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="text-[10px] font-bold text-rosewood-500 uppercase">
                                      {piece.category}
                                    </span>
                                    <span className="text-xs font-extrabold text-pookie-600">
                                      ~{piece.estimatedPrice} €
                                    </span>
                                  </div>
                                  <h5 className="text-xs font-bold text-rosewood-900 mt-0.5 line-clamp-1">
                                    {piece.name}
                                  </h5>
                                  <p className="text-[11px] text-rosewood-600 line-clamp-2 mt-0.5 leading-snug">{piece.description}</p>
                                </div>
                              </div>

                              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-pookie-100/70">
                                {piece.directProductUrl ? (
                                  <a
                                    href={piece.directProductUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-3 py-1.5 rounded-xl pookie-gradient-btn text-white text-[11px] font-bold flex items-center gap-1.5 shadow-xs transition hover:opacity-95"
                                  >
                                    <ShoppingBag className="w-3.5 h-3.5" />
                                    <span>Comprar en {piece.directStore || 'Tienda'} 🛍️</span>
                                    <ExternalLink className="w-2.5 h-2.5" />
                                  </a>
                                ) : (
                                  <span className="text-[10px] text-rosewood-400">Selección personalizada</span>
                                )}

                                <div className="flex items-center gap-1.5">
                                  <a
                                    href={piece.amazonSearchUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-2 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 text-[10px] font-bold border border-amber-200 flex items-center gap-1 transition"
                                  >
                                    <span>Amazon</span>
                                    <ExternalLink className="w-2.5 h-2.5" />
                                  </a>
                                  <a
                                    href={piece.aliexpressSearchUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-2 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-800 text-[10px] font-bold border border-red-200 flex items-center gap-1 transition"
                                  >
                                    <span>AliExpress</span>
                                    <ExternalLink className="w-2.5 h-2.5" />
                                  </a>
                                  <button
                                    onClick={() => handleAddPieceToWishlist(piece)}
                                    title="Añadir a Wishlist"
                                    className="p-1.5 rounded-lg bg-pookie-100 hover:bg-pookie-200 text-pookie-700 transition"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}

        {/* Typing indicator */}
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2.5 text-rosewood-500 text-xs font-medium pl-2"
          >
            <div className="w-7 h-7 rounded-full bg-pookie-200 flex items-center justify-center text-pookie-600 animate-spin">
              <Sparkles className="w-4 h-4" />
            </div>
            <span>naimnecita está pensando algo lindo para ti... ✨</span>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Hello Kitty Quick Stickers Bar */}
      <div className="px-4 py-2 bg-pink-50/70 border-t border-pookie-200/70 flex items-center gap-2 overflow-x-auto">
        <span className="text-[10px] font-bold text-pookie-700 uppercase tracking-wider shrink-0 flex items-center gap-1">
          <HelloKittyBow size={13} />
          <span>Stickers:</span>
        </span>
        {[
          { name: 'Amor', file: 'kitty_love.png', text: '¡Te amo mucho naimnecita! 💖' },
          { name: 'Guiño', file: 'kitty_wink.png', text: '¡Hola pookie! ✨' },
          { name: 'Sonrojo', file: 'kitty_blush.png', text: '¡Qué lindo, me encanta! 🥰' },
          { name: 'Chic', file: 'kitty_sunglasses.png', text: '¡Modo chic activado! 🕶️' },
          { name: 'Lazo', file: 'kitty_bow.png', text: '¡Amo los lazos coquette! 🎀' },
          { name: 'Pastel', file: 'kitty_cake.png', text: '¡Momento dulce de tarta! 🍰' },
          { name: 'Osito', file: 'kitty_teddy.png', text: '¡Abrazo de oso tierno! 🧸' },
          { name: 'Corazón', file: 'kitty_heart.png', text: '¡Pookie x Hello Kitty forever! 💗' },
          { name: 'Manzana', file: 'kitty_apple.png', text: '¡Manzanita dulce! 🍎' },
        ].map((stk) => (
          <button
            key={stk.name}
            type="button"
            onClick={() => handleSendMessage(stk.text)}
            className="p-1 rounded-xl bg-white/90 hover:bg-pookie-100 border border-pookie-200 transition shadow-xs hover:scale-110 shrink-0"
            title={stk.name}
          >
            <img src={`./kitty/emojis/${stk.file}`} alt={stk.name} className="w-6 h-6 object-contain" />
          </button>
        ))}
      </div>

      {/* Suggested prompts footer chips */}
      <div className="px-4 py-2 bg-pookie-50/60 border-t border-pookie-100 overflow-x-auto flex items-center gap-2 text-xs">
        {[
          'Naimnecita, quiero un outfit para una cena con un presupuesto de 80 € 🍷',
          'Pookie, recuérdame mañana a las 5 que tengo que estudiar 📚',
          'Recomiéndame una rutina facial glow coreana ✨',
          '¿Qué me pongo para un brunch con amigas? 🥐'
        ].map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(prompt)}
            className="px-3 py-1 rounded-full bg-white text-rosewood-700 hover:bg-pookie-100 border border-pookie-200/80 transition text-[11px] font-semibold whitespace-nowrap shadow-xs"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="p-4 bg-white/90 border-t border-pookie-100">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu mensaje para naimnecita..."
            className="flex-1 py-3 px-4 rounded-full border border-pookie-200 text-xs sm:text-sm text-rosewood-900 focus:outline-none focus:ring-2 focus:ring-pookie-400 bg-white"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="pookie-gradient-btn p-3 rounded-full text-white shadow-soft transition disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
