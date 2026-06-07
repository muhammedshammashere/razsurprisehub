/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff1f7',
          100: '#ffe4ef',
          200: '#fecddf',
          300: '#fda4c9',
          400: '#fb72ad',
          500: '#f43f8c',
          600: '#db2777', // Primary pink brand color
          700: '#be185d', // Hover state
          800: '#9d174d',
          900: '#831843',
          950: '#500724',
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
