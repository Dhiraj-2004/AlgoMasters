/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        fill: {
          '0%': { width: '0%' },
          '100%': { width: '75%' },
        },
      },
      animation: {
        fill: 'fill 2s ease-in-out forwards',
      },
    },
  },
  plugins: [],
};
