/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        appcolor: {
          100: '#B0C4DE',  // Lightest shade
          200: '#A2B3C8',  // Lighter shade
          300: '#94A2B2',  // Light shade
          400: '#7F8CBA',  // Medium-light shade
          500: '#6C7A99',  // Your base color (Medium shade)
          600: '#5A6282',  // Medium-dark shade
          700: '#4A546C',  // Dark shade
          800: '#394052',  // Darker shade
          900: '#2B2E3E',  // Darkest shade
        },
      },
    },
  },
  plugins: [],
}