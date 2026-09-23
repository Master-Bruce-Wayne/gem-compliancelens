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
        surface: '#FFFFFF',
        background: '#F7F8FA',
        border: '#E4E7EC',
        compliantBg: '#DCFCE7',
        compliantText: '#15803D',
        needsReviewBg: '#FEF3C7',
        needsReviewText: '#B45309',
        nonCompliantBg: '#FEE2E2',
        nonCompliantText: '#B91C1C',
        textPrimary: '#1A1D29',
        textSecondary: '#5C6072'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
