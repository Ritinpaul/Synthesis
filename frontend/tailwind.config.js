/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          base: '#060A0A',
          deck: '#0A1211',
          elevated: '#101B1A',
        },
        brand: {
          emerald: '#10B981',
          emeraldHover: '#059669',
          emeraldMuted: 'rgba(16, 185, 129, 0.12)',
          teal: '#14B8A6',
          cyan: '#06B6D4',
        },
        risk: {
          critical: '#EF4444',
          high: '#F97316',
          medium: '#F59E0B',
          nominal: '#10B981',
        },
        hairline: {
          subtle: '#142321',
          bright: '#203633',
        },
      },
    },
  },
  plugins: [],
};
