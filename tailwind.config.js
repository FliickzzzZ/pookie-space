/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pookie: {
          50: '#fff5f8',
          100: '#ffe4ee',
          200: '#fecddf',
          300: '#fda4c7',
          400: '#fb71a9',
          500: '#f43f87',
          600: '#e11d6e',
          700: '#be1254',
          800: '#9d1245',
          900: '#83143d',
        },
        blush: {
          50: '#fffafb',
          100: '#fff0f4',
          200: '#ffe0e9',
          300: '#ffc1d3',
          400: '#ff92b2',
          500: '#f95f8e',
        },
        lavender: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
        },
        pearl: {
          50: '#ffffff',
          100: '#faf9f7',
          200: '#f5f3ef',
          300: '#eae6df',
          400: '#dfd8ce',
        },
        rosewood: {
          500: '#8e5b6e',
          700: '#5c3a47',
          800: '#432934',
          900: '#2d1822',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Playfair Display"', 'serif'],
        cursive: ['"Caveat"', 'cursive'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(244, 63, 135, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'soft-lg': '0 10px 30px -4px rgba(244, 63, 135, 0.12), 0 4px 12px -2px rgba(0, 0, 0, 0.05)',
        'glow': '0 0 25px -2px rgba(251, 113, 169, 0.35)',
        'glow-lavender': '0 0 25px -2px rgba(192, 132, 252, 0.35)',
        'inner-soft': 'inset 0 2px 4px 0 rgba(244, 63, 135, 0.06)',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.9', transform: 'scale(1.02)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}
