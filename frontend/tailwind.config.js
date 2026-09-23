/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: '#1F3864',
        brandHover: '#15294D',
        background: '#F7F8FA',
        border: '#E4E7EC',
        compliantBg: '#DCFCE7',
        compliantText: '#15803D',
        needsReviewBg: '#FEF3C7',
        needsReviewText: '#B45309',
        nonCompliantBg: '#FEE2E2',
        nonCompliantText: '#B91C1C',
        textPrimary: '#1A1D29',
        textSecondary: '#5C6072',
        obsidian: {
          950: '#06080B',
          900: '#0B0E14',
          850: '#0E121A',
          800: '#111622',
          700: '#182030',
          600: '#222D42'
        },
        surface: {
          DEFAULT: '#0d1017',
          dim: '#090b10',
          container: '#131722',
          high: '#191f2d',
          border: '#1f2536'
        },
        govgold: {
          DEFAULT: '#d4af37',
          light: '#f2ca50',
          dim: '#947a24'
        },
        champagne: {
          300: '#f5e5b8',
          400: '#e5c982',
          500: '#d4af37',
          600: '#b89428',
          700: '#8c6f1a'
        },
        statusemerald: {
          400: '#34d399',
          500: '#10b981',
          900: 'rgba(16, 185, 129, 0.12)',
          border: 'rgba(16, 185, 129, 0.35)'
        },
        statusamber: {
          400: '#fbbf24',
          500: '#f59e0b',
          900: 'rgba(245, 158, 11, 0.12)',
          border: 'rgba(245, 158, 11, 0.35)'
        },
        slateblue: {
          DEFAULT: '#38bdf8',
          dim: '#0284c7'
        }
      },
      boxShadow: {
        'glow-gold': '0 0 24px -4px rgba(212, 175, 55, 0.18)',
        'glow-emerald': '0 0 16px -2px rgba(16, 185, 129, 0.22)',
        'inner-glow': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.07)'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
