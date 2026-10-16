import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Heart, 
  Palette, 
  Shirt, 
  Sparkle, 
  ShoppingBag, 
  ThumbsDown, 
  CreditCard, 
  Smile, 
  Star
} from 'lucide-react';
import { UserTasteProfile } from '../../types';
import { storageService } from '../../services/storageService';
import { sounds } from '../../utils/soundEffects';
import { firePookieConfetti } from '../../utils/confetti';

interface OnboardingWizardProps {
  onComplete: () => void;
  initialProfile?: UserTasteProfile;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onComplete, initialProfile }) => {
  const [currentStep, setCurrentStep] = useState(0);

  // Form State initialized with either passed profile or defaults
  const [profile, setProfile] = useState<UserTasteProfile>(
    initialProfile || storageService.getProfile()
  );

  const totalSteps = 10;

  // Options Definitions
  const colorOptions = [
    { label: 'Rosa pastel', color: '#FCE7F3', border: '#F472B6' },
    { label: 'Blanco perlado', color: '#FAF9F6', border: '#E5E5E5' },
    { label: 'Rosa empolvado', color: '#FECDD6', border: '#FB71A9' },
    { label: 'Lavanda suave', color: '#E9D5FF', border: '#C084FC' },
    { label: 'Champagne / Vainilla', color: '#FEF3C7', border: '#F59E0B' },
    { label: 'Beige nude', color: '#F5EBE0', border: '#D5BDAF' },
    { label: 'Celeste bebé', color: '#E0F2FE', border: '#38BDF8' },
    { label: 'Negro elegante', color: '#27272A', border: '#52525B', textColor: '#FFFFFF' },
    { label: 'Verde menta pastel', color: '#DCFCE7', border: '#4ADE80' },
  ];

  const styleOptions = [
    { title: 'Coquette Chic', desc: 'Lazos, encajes, detalles románticos y tonos pasteles', icon: '🎀' },
    { title: 'Clean Girl Aesthetic', desc: 'Minimalismo impecable, piel glowy y prendas básicas pulidas', icon: '✨' },
    { title: 'Old Money Pastel', desc: 'Prendas clásicas de alta calidad, blazers y estilo polo', icon: '👒' },
    { title: 'Casual Chic', desc: 'Comodidad con estilo: jeans rectos, gabardina y tops finos', icon: '☕' },
    { title: 'Y2K Nostalgia', desc: 'Brillos, faldas tableadas y toques retro chic', icon: '💖' },
    { title: 'Romántico Francés', desc: 'Vestidos florales, cárdigans suaves y bolsos de mimbre', icon: '🥐' },
  ];

  const outfitTypeOptions = [
    { label: 'Citas románticas 🍷', desc: 'Vestidos fluidos, toques sensuales elegantes' },
    { label: 'Brunch con amigas 🥞', desc: 'Looks aesthetic para fotos y cafeterías bonitas' },
    { label: 'Universidad / Trabajo chic 📚', desc: 'Prendas estructuradas pero muy cómodas' },
    { label: 'Noches de fiesta / Eventos 🪩', desc: 'Brillos, vestidos satinados y tacones' },
    { label: 'Días de viaje y turismo ✈️', desc: 'Conjuntos bonitos y súper prácticos' },
    { label: 'Comfy Loungewear en casa 🧸', desc: 'Sets de punto suave y sudaderas oversize' },
  ];

  const beautyOptions = [
    'Skincare coreano / Glass skin 🧴',
    'Maquillaje glow y natural ✨',
    'Perfumes dulces de vainilla y flores 🌸',
    'Mascarillas hidratantes nocturnas 🌙',
    'Bálsamos labiales y glosses jugosos 🍓',
    'Cuidado capilar y aceites nutritivos 💇‍♀️',
    'Esmaltes en tonos porcelana o milky white 💅',
  ];

  const accessoryOptions = [
    'Joyería dorada minimalista ✨',
    'Joyería plateada o perlas 🦪',
    'Bolsos mini o baguette 👛',
    'Lazos de seda para el pelo 🎀',
    'Gafas de sol chic y oscuras 🕶️',
    'Zapatillas blancas impecables 👟',
    'Cinturones finos dorados/beige 🎗️',
    'Pinzas de pelo perladas 🌸',
  ];

  const interestOptions = [
    'Moda & Tendencias 👗',
    'Fotografía & Crear contenido 📸',
    'Cafeterías bonitas & Matcha 🍵',
    'Lectura & Novelas románticas 📖',
    'Fitness, Pilates & Yoga 🧘‍♀️',
    'Viajes & Escapadas ✈️',
    'Decoración estética de interiores 🛋️',
    'Música & Conciertos 🎶',
  ];

  const budgetOptions: Array<{ id: UserTasteProfile['budgetLevel']; title: string; amount: number; desc: string }> = [
    { id: 'economico', title: 'Económico', amount: 35, desc: 'Prendas y chollos increíbles por menos de 35 €' },
    { id: 'equilibrado', title: 'Equilibrado', amount: 80, desc: 'Buena relación calidad-precio entre 35 € y 80 €' },
    { id: 'premium', title: 'Premium', amount: 140, desc: 'Inversión en piezas especiales entre 80 € y 160 €' },
    { id: 'lujo', title: 'Lujo', amount: 250, desc: 'Moda exclusiva y piezas de colección > 160 €' },
  ];

  const storeOptions = [
    'Zara', 'Amazon', 'AliExpress', 'Sephora', 'Stradivarius', 'Mango', 'Bershka', 'Shein', 'Pull&Bear', 'H&M'
  ];

  const dislikeOptions = [
    'Colores fluorescentes muy llamativos 🚫',
    'Estampados de leopardo o serpiente 🚫',
    'Prendas rígidas o telas ásperas 🚫',
    'Prendas excesivamente oscuras o góticas 🚫',
    'Zapatos de tacón incómodos 🚫',
    'Prendas sin forma o demasiado anchas 🚫',
  ];

  // Helper to toggle arrays
  const toggleSelection = (key: keyof UserTasteProfile, item: string) => {
    sounds.playPop();
    const current = (profile[key] as string[]) || [];
    const exists = current.includes(item);
    const updated = exists ? current.filter(x => x !== item) : [...current, item];
    setProfile(prev => ({ ...prev, [key]: updated }));
  };

  const handleNext = () => {
    sounds.playPop();
    if (currentStep < totalSteps - 1) {
      setCurrentStep(s => s + 1);
    } else {
      handleFinish();
    }
  };

  const handleBack = () => {
    sounds.playPop();
    if (currentStep > 0) {
      setCurrentStep(s => s - 1);
    }
  };

  const handleFinish = () => {
    sounds.playSparkle();
    firePookieConfetti();
    const updatedProfile: UserTasteProfile = {
      ...profile,
      completedOnboarding: true,
      updatedAt: new Date().toISOString()
    };
    storageService.saveProfile(updatedProfile);
    setTimeout(() => {
      onComplete();
    }, 1200);
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 flex flex-col justify-center items-center">
      <div className="w-full max-w-2xl bg-white/80 backdrop-blur-2xl rounded-5xl p-6 sm:p-10 border border-pookie-200/80 shadow-soft-lg relative overflow-hidden">
        {/* Top Header & Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-pookie-100 text-pookie-600 flex items-center justify-center font-bold text-xs">
                {currentStep + 1}
              </span>
              <span className="text-xs font-bold text-rosewood-600 uppercase tracking-wider">
                Paso {currentStep + 1} de {totalSteps}
              </span>
            </div>
            <button
              onClick={handleFinish}
              className="text-xs font-semibold text-rosewood-500 hover:text-pookie-600 transition"
            >
              Completar luego
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2.5 bg-pookie-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-pookie-400 via-pookie-500 to-lavender-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Dynamic Slides */}
        <AnimatePresence mode="wait">
          {/* SLIDE 0: COLORES FAVORITOS */}
          {currentStep === 0 && (
            <motion.div
              key="step-0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="text-center sm:text-left">
                <span className="text-2xl mb-1 inline-block">🎨</span>
                <h2 className="text-2xl font-bold font-display text-rosewood-900">
                  ¿Cuáles son tus colores favoritos para vestir y decorar?
                </h2>
                <p className="text-xs sm:text-sm text-rosewood-600 mt-1">
                  Naimnecita priorizará estos tonos en tus sugerencias de outfits y productos.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                {colorOptions.map((opt) => {
                  const isSelected = profile.colors.includes(opt.label);
                  return (
                    <button
                      key={opt.label}
                      onClick={() => toggleSelection('colors', opt.label)}
                      className={`flex items-center gap-3 p-3 rounded-2xl border transition text-left ${
                        isSelected
                          ? 'border-pookie-500 bg-pookie-50/80 shadow-soft'
                          : 'border-pookie-100 bg-white/60 hover:bg-white'
                      }`}
                    >
                      <span
                        className="w-7 h-7 rounded-full shadow-inner shrink-0 flex items-center justify-center text-xs"
                        style={{
                          backgroundColor: opt.color,
                          border: `1.5px solid ${opt.border}`,
                          color: opt.textColor || '#432934'
                        }}
                      >
                        {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-rosewood-800">
                        {opt.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* SLIDE 1: ESTILOS DE ROPA */}
          {currentStep === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="text-center sm:text-left">
                <span className="text-2xl mb-1 inline-block">👗</span>
                <h2 className="text-2xl font-bold font-display text-rosewood-900">
                  ¿Con qué estilos de ropa te sientes más identificada?
                </h2>
                <p className="text-xs sm:text-sm text-rosewood-600 mt-1">
                  Puedes seleccionar uno o varios estilos para combinarlos.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {styleOptions.map((opt) => {
                  const isSelected = profile.clothingStyles.includes(opt.title);
                  return (
                    <button
                      key={opt.title}
                      onClick={() => toggleSelection('clothingStyles', opt.title)}
                      className={`p-4 rounded-3xl border transition text-left flex items-start gap-3.5 ${
                        isSelected
                          ? 'border-pookie-500 bg-pookie-50/90 shadow-soft'
                          : 'border-pookie-100 bg-white/70 hover:bg-white'
                      }`}
                    >
                      <span className="text-2xl p-2 rounded-2xl bg-white shadow-xs border border-pookie-100">
                        {opt.icon}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-rosewood-900">{opt.title}</h4>
                          {isSelected && <Check className="w-4 h-4 text-pookie-600" />}
                        </div>
                        <p className="text-xs text-rosewood-600 mt-0.5">{opt.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* SLIDE 2: TIPOS DE OUTFIT */}
          {currentStep === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="text-center sm:text-left">
                <span className="text-2xl mb-1 inline-block">🥂</span>
                <h2 className="text-2xl font-bold font-display text-rosewood-900">
                  ¿Para qué ocasiones sueles necesitar ideas de outfit?
                </h2>
                <p className="text-xs sm:text-sm text-rosewood-600 mt-1">
                  Elige las ocasiones más habituales en tu día a día.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {outfitTypeOptions.map((opt) => {
                  const isSelected = profile.outfitTypes.includes(opt.label);
                  return (
                    <button
                      key={opt.label}
                      onClick={() => toggleSelection('outfitTypes', opt.label)}
                      className={`p-4 rounded-2xl border transition text-left ${
                        isSelected
                          ? 'border-pookie-500 bg-pookie-50 shadow-soft'
                          : 'border-pookie-100 bg-white/70 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-rosewood-900">{opt.label}</h4>
                        {isSelected && <Check className="w-4 h-4 text-pookie-600" />}
                      </div>
                      <p className="text-xs text-rosewood-600 mt-1">{opt.desc}</p>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* SLIDE 3: BELLEZA & SKINCARE */}
          {currentStep === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="text-center sm:text-left">
                <span className="text-2xl mb-1 inline-block">🧴</span>
                <h2 className="text-2xl font-bold font-display text-rosewood-900">
                  ¿Qué productos de belleza y cuidado personal te enamoran?
                </h2>
                <p className="text-xs sm:text-sm text-rosewood-600 mt-1">
                  Naimnecita incluirá toques de glow y belleza en tus rutinas.
                </p>
              </div>

              <div className="flex flex-wrap gap-2.5 pt-2">
                {beautyOptions.map((opt) => {
                  const isSelected = profile.beautyPreferences.includes(opt);
                  return (
                    <button
                      key={opt}
                      onClick={() => toggleSelection('beautyPreferences', opt)}
                      className={`px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold border transition ${
                        isSelected
                          ? 'bg-pookie-500 text-white border-pookie-500 shadow-soft'
                          : 'bg-white/80 text-rosewood-800 border-pookie-200/80 hover:bg-pookie-50'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* SLIDE 4: ACCESORIOS */}
          {currentStep === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="text-center sm:text-left">
                <span className="text-2xl mb-1 inline-block">💍</span>
                <h2 className="text-2xl font-bold font-display text-rosewood-900">
                  ¿Tus accesorios favoritos para completar cualquier look?
                </h2>
                <p className="text-xs sm:text-sm text-rosewood-600 mt-1">
                  Los detalles marcan la diferencia entre un look común y uno inolvidable.
                </p>
              </div>

              <div className="flex flex-wrap gap-2.5 pt-2">
                {accessoryOptions.map((opt) => {
                  const isSelected = profile.accessories.includes(opt);
                  return (
                    <button
                      key={opt}
                      onClick={() => toggleSelection('accessories', opt)}
                      className={`px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold border transition ${
                        isSelected
                          ? 'bg-pookie-500 text-white border-pookie-500 shadow-soft'
                          : 'bg-white/80 text-rosewood-800 border-pookie-200/80 hover:bg-pookie-50'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* SLIDE 5: INTERESES PERSONALES */}
          {currentStep === 5 && (
            <motion.div
              key="step-5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="text-center sm:text-left">
                <span className="text-2xl mb-1 inline-block">🌸</span>
                <h2 className="text-2xl font-bold font-display text-rosewood-900">
                  ¿Cuáles son tus pasatiempos e intereses favoritos?
                </h2>
                <p className="text-xs sm:text-sm text-rosewood-600 mt-1">
                  Para que las conversaciones y recordatorios de naimnecita se adapten a tu vida.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 pt-2">
                {interestOptions.map((opt) => {
                  const isSelected = profile.interests.includes(opt);
                  return (
                    <button
                      key={opt}
                      onClick={() => toggleSelection('interests', opt)}
                      className={`p-3.5 rounded-2xl border text-xs sm:text-sm font-semibold text-left transition flex items-center justify-between ${
                        isSelected
                          ? 'bg-pookie-500 text-white border-pookie-500 shadow-soft'
                          : 'bg-white/80 text-rosewood-800 border-pookie-200/80 hover:bg-pookie-50'
                      }`}
                    >
                      <span>{opt}</span>
                      {isSelected && <Check className="w-4 h-4" />}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* SLIDE 6: PRESUPUESTO HABITUAL */}
          {currentStep === 6 && (
            <motion.div
              key="step-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="text-center sm:text-left">
                <span className="text-2xl mb-1 inline-block">💳</span>
                <h2 className="text-2xl font-bold font-display text-rosewood-900">
                  ¿Cuál es tu rango de presupuesto habitual para compras y outfits?
                </h2>
                <p className="text-xs sm:text-sm text-rosewood-600 mt-1">
                  Naimnecita calculará combinaciones realistas que se adapten a tu bolsillo.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {budgetOptions.map((opt) => {
                  const isSelected = profile.budgetLevel === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => {
                        sounds.playPop();
                        setProfile(prev => ({
                          ...prev,
                          budgetLevel: opt.id,
                          budgetAmountTypical: opt.amount
                        }));
                      }}
                      className={`p-4 rounded-3xl border text-left transition ${
                        isSelected
                          ? 'border-pookie-500 bg-pookie-50 shadow-soft'
                          : 'border-pookie-100 bg-white/70 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-rosewood-900 text-base">{opt.title}</span>
                        <span className="px-2.5 py-1 rounded-full bg-white text-pookie-600 text-xs font-bold border border-pookie-200">
                          ~{opt.amount} €
                        </span>
                      </div>
                      <p className="text-xs text-rosewood-600 mt-1.5">{opt.desc}</p>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* SLIDE 7: TIENDAS FAVORITAS */}
          {currentStep === 7 && (
            <motion.div
              key="step-7"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="text-center sm:text-left">
                <span className="text-2xl mb-1 inline-block">🛍️</span>
                <h2 className="text-2xl font-bold font-display text-rosewood-900">
                  ¿En qué tiendas sueles comprar o buscar inspiración?
                </h2>
                <p className="text-xs sm:text-sm text-rosewood-600 mt-1">
                  Amazon y AliExpress están integradas con enlaces directos para facilitarte la búsqueda.
                </p>
              </div>

              <div className="flex flex-wrap gap-2.5 pt-2">
                {storeOptions.map((store) => {
                  const isSelected = profile.favoriteStores.includes(store);
                  return (
                    <button
                      key={store}
                      onClick={() => toggleSelection('favoriteStores', store)}
                      className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold border transition ${
                        isSelected
                          ? 'bg-pookie-500 text-white border-pookie-500 shadow-soft'
                          : 'bg-white/80 text-rosewood-800 border-pookie-200/80 hover:bg-pookie-50'
                      }`}
                    >
                      {store}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* SLIDE 8: LO QUE NO TE GUSTA (DISLIKES) */}
          {currentStep === 8 && (
            <motion.div
              key="step-8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="text-center sm:text-left">
                <span className="text-2xl mb-1 inline-block">🙅‍♀️</span>
                <h2 className="text-2xl font-bold font-display text-rosewood-900">
                  ¿Qué cosas definitivamente NO van con tu estilo?
                </h2>
                <p className="text-xs sm:text-sm text-rosewood-600 mt-1">
                  Es tan importante saber lo que te gusta como lo que odias para no equivocarnos nunca.
                </p>
              </div>

              <div className="space-y-2.5 pt-2">
                {dislikeOptions.map((opt) => {
                  const isSelected = profile.dislikes.includes(opt);
                  return (
                    <button
                      key={opt}
                      onClick={() => toggleSelection('dislikes', opt)}
                      className={`w-full p-3.5 rounded-2xl border text-xs sm:text-sm font-semibold text-left transition flex items-center justify-between ${
                        isSelected
                          ? 'bg-rose-100/90 text-rose-900 border-rose-300 shadow-sm'
                          : 'bg-white/80 text-rosewood-700 border-pookie-100 hover:bg-rose-50/50'
                      }`}
                    >
                      <span>{opt}</span>
                      {isSelected ? (
                        <span className="text-xs font-bold text-rose-700 bg-white/80 px-2 py-0.5 rounded-full">
                          Evitar
                        </span>
                      ) : (
                        <span className="text-xs text-rosewood-400">Toca para evitar</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* SLIDE 9: NOTAS FINALES Y CONFIRMACIÓN */}
          {currentStep === 9 && (
            <motion.div
              key="step-9"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="text-center sm:text-left">
                <span className="text-2xl mb-1 inline-block">💌</span>
                <h2 className="text-2xl font-bold font-display text-rosewood-900">
                  ¿Algún detalle extra que quieras compartir con naimnecita?
                </h2>
                <p className="text-xs sm:text-sm text-rosewood-600 mt-1">
                  Cuéntale cualquier preferencia especial, corte de ropa favorito o talla habitual.
                </p>
              </div>

              <textarea
                value={profile.additionalNotes}
                onChange={(e) => setProfile(prev => ({ ...prev, additionalNotes: e.target.value }))}
                placeholder="Ejemplo: Prefiero vestidos con manga corta, me encantan los lazos y los pendientes pequeños dorados..."
                rows={4}
                className="w-full p-4 rounded-3xl border border-pookie-200/90 bg-white/90 text-xs sm:text-sm text-rosewood-900 focus:outline-none focus:ring-2 focus:ring-pookie-400 transition"
              />

              <div className="p-4 rounded-3xl bg-gradient-to-r from-pookie-50 to-lavender-50 border border-pookie-200/60 flex items-center gap-3">
                <span className="text-2xl">✨</span>
                <p className="text-xs text-rosewood-700 font-medium">
                  Tus respuestas se han guardado de forma segura. Podrás modificarlas en cualquier momento desde tu pestaña <strong>Mi perfil</strong>.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="mt-8 pt-4 border-t border-pookie-100 flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className={`px-4 py-2.5 rounded-full text-xs font-semibold flex items-center gap-2 transition ${
              currentStep === 0
                ? 'opacity-0 pointer-events-none'
                : 'text-rosewood-600 hover:bg-pookie-100/60'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Anterior</span>
          </button>

          <button
            onClick={handleNext}
            className="pookie-gradient-btn px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold text-white shadow-soft flex items-center gap-2"
          >
            <span>{currentStep === totalSteps - 1 ? 'Guardar y comenzar 💗' : 'Siguiente'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
