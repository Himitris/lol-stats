/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'blue': {
          500: '#0AC8B9',
          600: '#0B9B8A',
          700: '#077267',
        },
      },
    },
  },
  plugins: [],
};