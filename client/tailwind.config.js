/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff0f5',
          100: '#fde2ed',
          200: '#fbc6da',
          300: '#f89bbd',
          400: '#f46b9c',
          500: '#ec407a',
          600: '#d3245f',
          700: '#b01548',
          800: '#92123c',
          900: '#500050',
          950: '#330033',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'sans-serif'],
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        marquee: 'marquee 75s linear infinite',
        'marquee-slow': 'marquee 75s linear infinite',
      },
    },
  },
  plugins: [],
};
