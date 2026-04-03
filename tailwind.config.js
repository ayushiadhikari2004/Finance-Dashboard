/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        obsidian: '#121212',
        chocolate: '#1B1411',
        gold: '#D4AF37',
        'amber-warm': '#FFBF00',
        offwhite: '#E5E5E5',
      },
      boxShadow: {
        'gold-glow': '0 0 24px rgba(212,175,55,0.18)',
        'gold-glow-lg': '0 0 48px rgba(212,175,55,0.12)',
        'dark-depth': '0 8px 32px rgba(0,0,0,0.5)',
      },
      backdropBlur: {
        xs: '4px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
