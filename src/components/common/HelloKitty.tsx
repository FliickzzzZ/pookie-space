import React from 'react';
import { motion } from 'framer-motion';

// ============================================================
// HELLO KITTY VECTOR ILLUSTRATIONS (100% Reliable, Crisp & Cute)
// ============================================================

export const HelloKittyFace: React.FC<{ size?: number; className?: string; bowColor?: string }> = ({ 
  size = 48, 
  className = '',
  bowColor = '#FB71A9' 
}) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 85" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block drop-shadow-xs select-none ${className}`}
    >
      {/* Hello Kitty Head & Ears */}
      <path
        d="M 28 22 C 22 10, 16 12, 14 24 C 12 36, 12 55, 20 66 C 28 77, 72 77, 80 66 C 88 55, 88 36, 86 24 C 84 12, 78 10, 72 22 C 64 18, 36 18, 28 22 Z"
        fill="#FFFFFF"
        stroke="#4A354F"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />

      {/* Eyes */}
      <ellipse cx="34" cy="46" rx="3.5" ry="5.2" fill="#2E1B26" />
      <ellipse cx="66" cy="46" rx="3.5" ry="5.2" fill="#2E1B26" />

      {/* Nose */}
      <ellipse cx="50" cy="52" rx="4.5" ry="3.2" fill="#FBBF24" stroke="#4A354F" strokeWidth="1.5" />

      {/* Whiskers Left */}
      <path d="M 12 43 L 26 44" stroke="#4A354F" strokeWidth="2.8" strokeLinecap="round" />
      <path d="M 10 51 L 26 51" stroke="#4A354F" strokeWidth="2.8" strokeLinecap="round" />
      <path d="M 13 59 L 26 57" stroke="#4A354F" strokeWidth="2.8" strokeLinecap="round" />

      {/* Whiskers Right */}
      <path d="M 74 44 L 88 43" stroke="#4A354F" strokeWidth="2.8" strokeLinecap="round" />
      <path d="M 74 51 L 90 51" stroke="#4A354F" strokeWidth="2.8" strokeLinecap="round" />
      <path d="M 74 57 L 87 59" stroke="#4A354F" strokeWidth="2.8" strokeLinecap="round" />

      {/* Iconic Bow (Right Ear / Side) */}
      <g transform="translate(62, 10)">
        {/* Bow Knot */}
        <circle cx="10" cy="11" r="5" fill={bowColor} stroke="#4A354F" strokeWidth="2.5" />
        {/* Left Loop */}
        <ellipse cx="2" cy="10" rx="7.5" ry="5.5" transform="rotate(-15 2 10)" fill={bowColor} stroke="#4A354F" strokeWidth="2.5" />
        {/* Right Loop */}
        <ellipse cx="18" cy="12" rx="7.5" ry="5.5" transform="rotate(15 18 12)" fill={bowColor} stroke="#4A354F" strokeWidth="2.5" />
        {/* Bow highlight */}
        <circle cx="9" cy="9.5" r="1.5" fill="#FFFFFF" opacity="0.8" />
      </g>
    </svg>
  );
};

// Hello Kitty Holding a Sparkling Heart
export const HelloKittyWithHeart: React.FC<{ size?: number; className?: string }> = ({ 
  size = 110, 
  className = '' 
}) => {
  return (
    <div className={`relative inline-block ${className}`} style={{ width: size, height: size * 1.15 }}>
      <svg viewBox="0 0 120 135" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
        {/* Body & Cute Dress */}
        <path
          d="M 38 78 C 30 95, 30 115, 36 122 C 40 125, 80 125, 84 122 C 90 115, 90 95, 82 78 Z"
          fill="#FECDD6"
          stroke="#4A354F"
          strokeWidth="3.5"
        />
        {/* Little White Paws / Feet */}
        <ellipse cx="46" cy="124" rx="8" ry="5" fill="#FFFFFF" stroke="#4A354F" strokeWidth="2.5" />
        <ellipse cx="74" cy="124" rx="8" ry="5" fill="#FFFFFF" stroke="#4A354F" strokeWidth="2.5" />

        {/* Hello Kitty Head */}
        <path
          d="M 38 28 C 30 14, 24 16, 22 28 C 18 42, 18 64, 28 76 C 38 88, 82 88, 92 76 C 102 64, 102 42, 98 28 C 96 16, 90 14, 82 28 C 72 23, 48 23, 38 28 Z"
          fill="#FFFFFF"
          stroke="#4A354F"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* Eyes */}
        <ellipse cx="44" cy="54" rx="4" ry="6" fill="#2E1B26" />
        <ellipse cx="76" cy="54" rx="4" ry="6" fill="#2E1B26" />

        {/* Nose */}
        <ellipse cx="60" cy="61" rx="5" ry="3.5" fill="#FBBF24" stroke="#4A354F" strokeWidth="1.8" />

        {/* Whiskers */}
        <path d="M 18 51 L 32 52" stroke="#4A354F" strokeWidth="3" strokeLinecap="round" />
        <path d="M 16 60 L 32 60" stroke="#4A354F" strokeWidth="3" strokeLinecap="round" />
        <path d="M 19 69 L 32 67" stroke="#4A354F" strokeWidth="3" strokeLinecap="round" />

        <path d="M 88 52 L 102 51" stroke="#4A354F" strokeWidth="3" strokeLinecap="round" />
        <path d="M 88 60 L 104 60" stroke="#4A354F" strokeWidth="3" strokeLinecap="round" />
        <path d="M 88 67 L 101 69" stroke="#4A354F" strokeWidth="3" strokeLinecap="round" />

        {/* Bow on Ear */}
        <g transform="translate(74, 14)">
          <circle cx="12" cy="12" r="6" fill="#FB71A9" stroke="#4A354F" strokeWidth="3" />
          <ellipse cx="3" cy="11" rx="9" ry="6.5" transform="rotate(-15 3 11)" fill="#F43F87" stroke="#4A354F" strokeWidth="3" />
          <ellipse cx="21" cy="13" rx="9" ry="6.5" transform="rotate(15 21 13)" fill="#F43F87" stroke="#4A354F" strokeWidth="3" />
          <circle cx="10" cy="10" r="2" fill="#FFFFFF" opacity="0.9" />
        </g>

        {/* Big Heart in Hands */}
        <g transform="translate(60, 96)">
          <path
            d="M 0 10 C -18 -8, -32 6, 0 32 C 32 6, 18 -8, 0 10 Z"
            fill="url(#hkHeartGrad)"
            stroke="#BE1254"
            strokeWidth="3"
          />
          {/* Paw Left holding heart */}
          <ellipse cx="-16" cy="10" rx="6" ry="5" fill="#FFFFFF" stroke="#4A354F" strokeWidth="2.5" />
          {/* Paw Right holding heart */}
          <ellipse cx="16" cy="10" rx="6" ry="5" fill="#FFFFFF" stroke="#4A354F" strokeWidth="2.5" />
        </g>

        <defs>
          <linearGradient id="hkHeartGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FB71A9" />
            <stop offset="100%" stopColor="#E11D6E" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

// Hello Kitty Iconic Bow Only
export const HelloKittyBow: React.FC<{ size?: number; className?: string; color?: string }> = ({ 
  size = 28, 
  className = '',
  color = '#FB71A9'
}) => {
  return (
    <svg width={size} height={size * 0.75} viewBox="0 0 50 38" fill="none" xmlns="http://www.w3.org/2000/svg" className={`inline-block ${className}`}>
      <g>
        <ellipse cx="12" cy="19" rx="12" ry="9" transform="rotate(-15 12 19)" fill={color} stroke="#4A354F" strokeWidth="3" />
        <ellipse cx="38" cy="19" rx="12" ry="9" transform="rotate(15 38 19)" fill={color} stroke="#4A354F" strokeWidth="3" />
        <circle cx="25" cy="19" r="7.5" fill={color} stroke="#4A354F" strokeWidth="3" />
        <circle cx="23" cy="17" r="2" fill="#FFFFFF" opacity="0.8" />
      </g>
    </svg>
  );
};

// Hello Kitty Sticker Pill
export const HelloKittyPill: React.FC<{ text?: string }> = ({ text = "Pookie x Hello Kitty 🎀" }) => {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 border border-pookie-200/90 shadow-soft backdrop-blur-md">
      <HelloKittyFace size={24} />
      <span className="text-xs font-bold text-pookie-700 tracking-wide font-sans">
        {text}
      </span>
    </div>
  );
};

// Hello Kitty Floating Accent in Screen Corner
export const HelloKittyCornerSticker: React.FC = () => {
  return (
    <motion.div
      animate={{ y: [0, -6, 0], rotate: [-2, 2, -2] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      className="fixed bottom-20 right-4 md:bottom-8 md:right-8 z-30 pointer-events-none select-none drop-shadow-lg hidden sm:block"
    >
      <div className="relative">
        <HelloKittyWithHeart size={90} />
        <span className="absolute -top-2 -left-2 text-lg animate-bounce">✨</span>
      </div>
    </motion.div>
  );
};
