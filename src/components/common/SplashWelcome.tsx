import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart } from 'lucide-react';
import { sounds } from '../../utils/soundEffects';
import { HelloKittyFace, HelloKittyBow } from './HelloKitty';

interface SplashWelcomeProps {
  onDismiss: () => void;
}

export const SplashWelcome: React.FC<SplashWelcomeProps> = ({ onDismiss }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    sounds.playSparkle();
    const timer = setTimeout(() => {
      handleClose();
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onDismiss, 400);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.4 }}
          onClick={handleClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blush-100/95 via-pearl-50/95 to-lavender-100/95 backdrop-blur-xl cursor-pointer select-none"
        >
          {/* Background animated gentle orbs */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute w-72 h-72 rounded-full bg-pookie-300/30 blur-3xl pointer-events-none -top-10 -left-10"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute w-80 h-80 rounded-full bg-lavender-300/30 blur-3xl pointer-events-none -bottom-10 -right-10"
          />

          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: -10 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative px-8 py-10 rounded-4xl glass-card text-center max-w-sm sm:max-w-md mx-4 shadow-soft-lg border-2 border-white/95"
          >
            {/* Hello Kitty Cute Avatar Badge */}
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 300, damping: 20 }}
              className="w-24 h-24 mx-auto mb-4 rounded-3xl bg-gradient-to-tr from-pookie-100 via-white to-lavender-100 flex items-center justify-center shadow-soft border-2 border-pookie-200 relative group"
            >
              <HelloKittyFace size={68} />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                className="absolute -top-2 -right-2 text-yellow-400"
              >
                <Sparkles className="w-6 h-6 fill-yellow-300" />
              </motion.div>
            </motion.div>

            {/* EXACT Welcome Text */}
            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl sm:text-4xl font-extrabold text-pookie-600 tracking-tight font-display mb-2 drop-shadow-xs"
            >
              Bienvenida, pookie 💗
            </motion.h1>

            {/* EXACT Introduction Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-base sm:text-lg text-rosewood-700 font-semibold tracking-wide flex items-center justify-center gap-1.5"
            >
              Soy naimnecita, tu asistente personal ✨
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pookie-100/80 text-[11px] font-bold text-pookie-700"
            >
              <HelloKittyBow size={14} />
              <span>Edición Especial Hello Kitty 🎀</span>
            </motion.div>

            {/* Subtle dismiss tip */}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 0.8 }}
              className="inline-block mt-5 text-xs text-rosewood-500/80 font-normal"
            >
              Toca en cualquier lugar para entrar
            </motion.span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
