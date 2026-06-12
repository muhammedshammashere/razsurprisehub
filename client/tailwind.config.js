/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff5f9',
          100: '#ffe3ee',
          200: '#ffc4dc',
          300: '#ff94bd',
          400: '#fb639a',
          500: '#ec407a',
          600: '#d92668',
          700: '#b81855',
          800: '#8d1247',
          900: '#500050',
          950: '#2d002d',
        },
        primary: {
          DEFAULT: '#ec407a',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#500050',
          foreground: '#ffffff',
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
