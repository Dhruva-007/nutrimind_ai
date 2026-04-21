/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#22C55E', // Green
        danger: '#EF4444',
        warning: '#F59E0B',
      },
    },
  },
  plugins: [],
};
